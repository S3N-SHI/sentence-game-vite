# Script para crear módulos de UI
Write-Host "Creando modulos de UI..." -ForegroundColor Cyan

# ===== UIController.js =====
@"
export class UIController {
  constructor() {
    this.elementos = {
      instrucciones: document.getElementById('instrucciones'),
      hud: document.getElementById('hud'),
      textoContainer: document.getElementById('textoContainer'),
      textoUsuarioOverlay: document.getElementById('textoUsuarioOverlay'),
      contadorErrores: document.getElementById('contadorErrores'),
      probabilidad: document.getElementById('probabilidad'),
      progreso: document.getElementById('progreso'),
      victoria: document.getElementById('victoria'),
      gameOver: document.getElementById('gameOver'),
      countdown: document.getElementById('countdown'),
      countdownNumber: document.getElementById('countdownNumber')
    };
  }
  ocultarInstrucciones() {
    if (this.elementos.instrucciones) this.elementos.instrucciones.style.display = 'none';
  }
  mostrarHUD() {
    if (this.elementos.hud) this.elementos.hud.style.display = 'grid';
  }
  mostrarTextoContainer() {
    if (this.elementos.textoContainer) this.elementos.textoContainer.style.display = 'block';
  }
  ocultarTextoContainer() {
    if (this.elementos.textoContainer) this.elementos.textoContainer.style.display = 'none';
  }
  actualizarTextoOverlay(texto) {
    if (this.elementos.textoUsuarioOverlay) this.elementos.textoUsuarioOverlay.textContent = texto;
  }
  limpiarTextoOverlay() {
    this.actualizarTextoOverlay('');
  }
  actualizarProgreso(porcentaje) {
    if (this.elementos.progreso) this.elementos.progreso.textContent = porcentaje + '%';
  }
  actualizarErrores(errores) {
    if (this.elementos.contadorErrores) this.elementos.contadorErrores.textContent = errores + '/3';
    for (let i = 1; i <= 3; i++) {
      const dot = document.getElementById('error' + i);
      if (dot) {
        if (i <= errores) dot.classList.add('activo');
        else dot.classList.remove('activo');
      }
    }
    if (this.elementos.contadorErrores) {
      if (errores >= 2) this.elementos.contadorErrores.classList.add('danger');
      else this.elementos.contadorErrores.classList.remove('danger');
    }
  }
  actualizarProbabilidad(probabilidad) {
    if (this.elementos.probabilidad) {
      this.elementos.probabilidad.textContent = '1/' + probabilidad;
      if (probabilidad <= 2) this.elementos.probabilidad.classList.add('danger');
      else this.elementos.probabilidad.classList.remove('danger');
    }
  }
  mostrarErrorShake() {
    if (this.elementos.textoContainer) {
      this.elementos.textoContainer.classList.add('error-shake');
      setTimeout(() => this.elementos.textoContainer.classList.remove('error-shake'), 500);
    }
  }
  mostrarCuentaRegresiva(callback) {
    if (!this.elementos.countdown || !this.elementos.countdownNumber) {
      callback();
      return;
    }
    this.elementos.countdown.style.display = 'flex';
    let contador = 3;
    const intervalo = setInterval(() => {
      if (contador > 0) {
        this.elementos.countdownNumber.textContent = contador;
        this.elementos.countdownNumber.style.animation = 'none';
        setTimeout(() => this.elementos.countdownNumber.style.animation = 'countdown-pulse 1s ease-out', 10);
        contador--;
      } else {
        clearInterval(intervalo);
        this.elementos.countdown.style.display = 'none';
        callback();
      }
    }, 1000);
  }
  mostrarVictoria(tiempoTotal, totalErrores, totalSorteos, probabilidadFinal) {
    if (!this.elementos.victoria) return;
    this.elementos.victoria.style.display = 'block';
    const segundos = Math.floor(tiempoTotal / 1000);
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    const tiempoFinalEl = document.getElementById('tiempoFinal');
    if (tiempoFinalEl) tiempoFinalEl.textContent = '⏱️ Tiempo: ' + minutos + ':' + String(segs).padStart(2, '0');
    const estadisticasEl = document.getElementById('estadisticas');
    if (estadisticasEl) estadisticasEl.textContent = '📊 Errores: ' + totalErrores + ' | Sorteos: ' + totalSorteos + ' | Prob: 1/' + probabilidadFinal;
  }
  mostrarGameOver(tiempoTotal, totalSorteos) {
    if (!this.elementos.gameOver) return;
    const segundos = Math.floor(tiempoTotal / 1000);
    const mensajeEl = document.getElementById('mensajeGameOver');
    if (mensajeEl) mensajeEl.textContent = 'Sobreviviste ' + segundos + ' segundos y ' + totalSorteos + ' sorteos';
    this.elementos.gameOver.style.display = 'flex';
  }
}
"@ | Out-File "src\ui\UIController.js" -Encoding UTF8
Write-Host "- UIController.js creado" -ForegroundColor Green

# ===== VideoController.js =====
@"
export class VideoController {
  constructor() {
    this.overlay = document.getElementById('videoOverlay');
    this.player = document.getElementById('videoPlayer');
    this.info = document.getElementById('videoInfo');
  }
  reproducir(rutaVideo, esGameOver, callback) {
    if (!this.overlay || !this.player || !this.info) {
      callback();
      return;
    }
    this.player.src = rutaVideo;
    this.overlay.style.display = 'flex';
    if (esGameOver) {
      this.info.textContent = '💀 VALIÓ VRG 💀';
      this.info.style.color = '#ff4444';
    } else {
      this.info.textContent = '⚠️ TE SALVASTE ⚠️';
      this.info.style.color = '#f5c16c';
    }
    this.player.play().catch(() => this.manejarError(esGameOver, callback));
    this.player.onended = () => {
      this.ocultar();
      callback();
    };
    this.player.onerror = () => this.manejarError(esGameOver, callback);
  }
  manejarError(esGameOver, callback) {
    this.ocultar();
    if (!esGameOver) alert('⚠️ Video no encontrado');
    callback();
  }
  ocultar() {
    if (this.overlay) this.overlay.style.display = 'none';
    if (this.player) {
      this.player.pause();
      this.player.currentTime = 0;
    }
  }
  detener() {
    if (this.player) {
      this.player.pause();
      this.player.currentTime = 0;
    }
    this.ocultar();
  }
}
"@ | Out-File "src\ui\VideoController.js" -Encoding UTF8
Write-Host "- VideoController.js creado" -ForegroundColor Green

Write-Host "`nModulos de UI creados!" -ForegroundColor Cyan