import { GameState } from './GameState.js';
import { TextValidator } from './TextValidator.js';
import { RouletteSystem } from './RouletteSystem.js';
import { TimerController } from './TimerController.js';
import { UIController } from '../ui/UIController.js';
import { VideoController } from '../ui/VideoController.js';
import { RecordsManager } from '../utils/RecordsManager.js';
import { FrasesManager } from '../utils/FrasesManager.js';

export class GameController {
  constructor() {
    this.state = new GameState();
    this.ui = new UIController();
    this.video = new VideoController();
    this.timer = new TimerController();
    this.entrada = document.getElementById('entradaUsuario');
    this.textoOriginalEl = document.getElementById('textoOriginal');
    this.textoContainer = document.getElementById('textoContainer');
    this.validarTexto = this.validarTexto.bind(this);
    this.prevenirPegar = this.prevenirPegar.bind(this);
    this.enfocarEntrada = this.enfocarEntrada.bind(this);
    this.recordsManager = new RecordsManager();
    this.frasesManager = new FrasesManager();
    this.modoJuego = 'seleccion'; // 'random' o 'seleccion'
    this.fraseSeleccionada = '';
  }

  iniciarJuego() {
    const seleccion = document.querySelector('input[name="oracion"]:checked');
    if (seleccion && this.textoOriginalEl) {
      this.textoOriginalEl.textContent = seleccion.value;
    }
    this.ui.ocultarInstrucciones();
    this.ui.mostrarHUD();
    this.ui.mostrarTextoContainer();
    const textoRaw = this.textoOriginalEl.textContent;
    this.state.textoOriginal = TextValidator.limpiarTexto(textoRaw).trim();
    this.state.reset();
    this.ui.actualizarErrores(this.state.erroresActuales);
    this.ui.actualizarProbabilidad(this.state.probabilidadActual);
    if (this.state.probabilidadActual <= 2) {
      // Aquí activarías la música de tensión
      // Necesitarías acceso al AudioManager
    }
    this.ui.mostrarCuentaRegresiva(() => this.comenzarJuego());
  }

  comenzarJuego() {
    this.state.activar();
    this.entrada.focus();
    this.timer.iniciar();
    this.entrada.addEventListener('input', this.validarTexto);
    this.entrada.addEventListener('paste', this.prevenirPegar);
    if (this.textoContainer) {
      this.textoContainer.addEventListener('click', this.enfocarEntrada);
    }
  }

  prevenirPegar(e) {
    e.preventDefault();
    alert('â›” Â¡No puedes copiar y pegar!');
  }

  enfocarEntrada() {
    if (this.state.juegoActivo) this.entrada.focus();
  }

  validarTexto() {
    if (!this.state.juegoActivo) return;
    const resultado = TextValidator.validar(this.entrada.value, this.state.textoOriginal);
    this.ui.actualizarTextoOverlay(resultado.textoLimpio);
    if (resultado.excedido) {
      this.registrarError();
      return;
    }
    if (resultado.esValido) {
      this.ui.actualizarProgreso(Math.round(resultado.progreso));
      if (resultado.completado) this.victoria();
    } else {
      this.registrarError();
    }
  }

  registrarError() {
    this.state.desactivar();
    this.state.incrementarError();
    this.ui.mostrarErrorShake();
    this.ui.actualizarErrores(this.state.erroresActuales);
    // Activar musica de tension si probabilidad es critica
    this.verificarMusicaTension();
    if (this.state.erroresActuales >= 3) {
      this.timer.pausar();
      setTimeout(() => this.sortearRuletaRusa(), 1000);
    } else {
      setTimeout(() => this.continuarJuego(), 1000);
    }
  }

  sortearRuletaRusa() {
    this.state.incrementarSorteo();
    const resultado = RouletteSystem.sortear(this.state.probabilidadActual);
    if (resultado.muere) {
      this.video.reproducir('videos/valio_vrg.mp4', true, () => this.gameOver());
    } else {
      this.video.reproducir('videos/hable_bien.mp4', false, () => {
        this.state.reducirProbabilidad();
        this.ui.actualizarProbabilidad(this.state.probabilidadActual);
        this.continuarJuegoDespuesSorteo();
      });
    }
  }

  continuarJuego() {
    this.entrada.value = '';
    this.ui.limpiarTextoOverlay();
    this.state.activar();
    this.entrada.focus();
  }

  continuarJuegoDespuesSorteo() {
    this.state.resetearErrores();
    this.ui.actualizarErrores(0);
    this.entrada.value = '';
    this.ui.limpiarTextoOverlay();
    this.timer.reanudar();
    this.state.activar();
    this.entrada.focus();
  }

  gameOver() {
    // Detener musica de tension
    if (window.audioManagerGlobal) {
      window.audioManagerGlobal.detenerMusicaTension();
    }
    this.timer.detener();
    const tiempoTotal = this.timer.obtenerTiempoTranscurrido();
    this.ui.mostrarGameOver(tiempoTotal, this.state.totalSorteos);
    this.limpiarEventListeners();
  }

  victoria() {
    // Detener musica de tension
    if (window.audioManagerGlobal) {
      window.audioManagerGlobal.detenerMusicaTension();
    }
    this.timer.detener();
    this.state.desactivar();
    const tiempoTotal = this.timer.obtenerTiempoTranscurrido();

    this.ui.ocultarTextoContainer();
    this.ui.mostrarVictoria(
      tiempoTotal,
      this.state.totalErrores,
      this.state.totalSorteos,
      this.state.probabilidadActual
    );

    // Mostrar formulario de récord
    const datosRecord = {
      tiempo: tiempoTotal,
      errores: this.state.totalErrores,
      muertes: this.state.totalSorteos,
      modo: this.modoJuego || 'seleccion',
      frase: this.state.textoOriginal
    };

    this.ui.mostrarFormularioRecord(datosRecord, (nombre, fecha, datos) => {
      this.recordsManager.guardarRecord({
        nombre,
        fecha,
        tiempo: datos.tiempo,
        errores: datos.errores,
        muertes: datos.muertes,
        modo: datos.modo,
        frase: datos.frase
      });
    });

    this.limpiarEventListeners();
  }

  /**
   * Muestra el formulario para guardar récord
   */
  mostrarFormularioRecord(tiempoTotal) {
    const datosRecord = {
      tiempo: tiempoTotal,
      errores: this.state.totalErrores,
      muertes: this.state.totalSorteos,
      modo: this.modoJuego,
      frase: this.state.textoOriginal
    };

    // Aquí llaman el método del UIController
    // this.ui.mostrarFormularioRecord(datosRecord, (nombre, fecha) => {
    //   this.guardarRecord(nombre, fecha, datosRecord);
    // });
  }
  limpiarEventListeners() {
    if (this.entrada) {
      this.entrada.removeEventListener('input', this.validarTexto);
      this.entrada.removeEventListener('paste', this.prevenirPegar);
    }
    if (this.textoContainer) {
      this.textoContainer.removeEventListener('click', this.enfocarEntrada);
    }
  }
  /**
   * Verifica y activa musica de tension
   */
  verificarMusicaTension() {
    // Necesitamos acceso al AudioManager global
    if (window.audioManagerGlobal && this.state.probabilidadActual <= 2) {
      window.audioManagerGlobal.reproducirMusicaTension();
    }
  }
}
