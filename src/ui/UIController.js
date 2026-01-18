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
    if (tiempoFinalEl) tiempoFinalEl.textContent = 'â±ï¸ Tiempo: ' + minutos + ':' + String(segs).padStart(2, '0');
    const estadisticasEl = document.getElementById('estadisticas');
    if (estadisticasEl) estadisticasEl.textContent = 'ðŸ“Š Errores: ' + totalErrores + ' | Sorteos: ' + totalSorteos + ' | Prob: 1/' + probabilidadFinal;
  }
  mostrarGameOver(tiempoTotal, totalSorteos) {
    if (!this.elementos.gameOver) return;
    const segundos = Math.floor(tiempoTotal / 1000);
    const mensajeEl = document.getElementById('mensajeGameOver');
    if (mensajeEl) mensajeEl.textContent = 'Sobreviviste ' + segundos + ' segundos y ' + totalSorteos + ' sorteos';
    this.elementos.gameOver.style.display = 'flex';
  }
  /**
   * Muestra formulario para guardar récord
   */
  mostrarFormularioRecord(datosRecord, onGuardar) {
    const formHTML = `
      <div class="record-overlay" id="recordOverlay">
        <div class="record-modal">
          <h2>¡Nuevo Récord!</h2>
          <div class="record-stats">
            <p>⏱️ Tiempo: ${this.formatearTiempo(datosRecord.tiempo)}</p>
            <p>❌ Errores: ${datosRecord.errores}</p>
            <p>💀 Muertes: ${datosRecord.muertes}</p>
            <p>🎮 Modo: ${datosRecord.modo === 'random' ? 'Aleatorio' : 'Selección'}</p>
          </div>
          <p class="record-pregunta">¿Deseas registrar este récord?</p>
          <div class="record-buttons">
            <button class="btn-record btn-si" id="btnRegistrarSi">Sí, registrar</button>
            <button class="btn-record btn-no" id="btnRegistrarNo">No, gracias</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', formHTML);
    
    document.getElementById('btnRegistrarSi').addEventListener('click', () => {
      this.mostrarFormularioNombre(datosRecord, onGuardar);
    });
    
    document.getElementById('btnRegistrarNo').addEventListener('click', () => {
      document.getElementById('recordOverlay').remove();
      setTimeout(() => window.location.href = '/index.html', 500);
    });
  }

  /**
   * Muestra formulario para ingresar nombre
   */
  mostrarFormularioNombre(datosRecord, onGuardar) {
    const overlay = document.getElementById('recordOverlay');
    overlay.innerHTML = `
      <div class="record-modal">
        <h2>Registrar Récord</h2>
        <div class="record-form">
          <div class="form-group">
            <label for="nombreJugador">Tu nombre:</label>
            <input type="text" id="nombreJugador" maxlength="20" placeholder="Ingresa tu nombre">
          </div>
          <div class="form-group">
            <label for="fechaRecord">Fecha:</label>
            <input type="date" id="fechaRecord" value="${new Date().toISOString().split('T')[0]}">
          </div>
          <div class="record-buttons">
            <button class="btn-record btn-guardar" id="btnGuardarRecord">Guardar</button>
            <button class="btn-record btn-cancelar" id="btnCancelarRecord">Cancelar</button>
          </div>
        </div>
      </div>
    `;
    
    const inputNombre = document.getElementById('nombreJugador');
    inputNombre.focus();
    
    document.getElementById('btnGuardarRecord').addEventListener('click', () => {
      const nombre = inputNombre.value.trim();
      const fecha = document.getElementById('fechaRecord').value;
      
      if (!nombre) {
        alert('Por favor ingresa tu nombre');
        return;
      }
      
      this.mostrarConfirmacionRecord(nombre, fecha, datosRecord, onGuardar);
    });
    
    document.getElementById('btnCancelarRecord').addEventListener('click', () => {
      overlay.remove();
      setTimeout(() => window.location.href = '/index.html', 500);
    });
  }

  /**
   * Muestra confirmación antes de guardar
   */
  mostrarConfirmacionRecord(nombre, fecha, datosRecord, onGuardar) {
    const overlay = document.getElementById('recordOverlay');
    const fechaFormateada = new Date(fecha).toLocaleDateString('es-ES');
    
    overlay.innerHTML = `
      <div class="record-modal">
        <h2>Confirmar Récord</h2>
        <div class="record-confirmacion">
          <p><strong>Nombre:</strong> ${nombre}</p>
          <p><strong>Fecha:</strong> ${fechaFormateada}</p>
          <p><strong>Tiempo:</strong> ${this.formatearTiempo(datosRecord.tiempo)}</p>
          <p><strong>Errores:</strong> ${datosRecord.errores}</p>
          <p><strong>Muertes:</strong> ${datosRecord.muertes}</p>
          <p><strong>Modo:</strong> ${datosRecord.modo === 'random' ? 'Aleatorio' : 'Selección'}</p>
        </div>
        <div class="record-buttons">
          <button class="btn-record btn-confirmar" id="btnConfirmarRecord">Confirmar</button>
          <button class="btn-record btn-editar" id="btnEditarRecord">Editar</button>
        </div>
      </div>
    `;
    
    document.getElementById('btnConfirmarRecord').addEventListener('click', () => {
      onGuardar(nombre, fechaFormateada, datosRecord);
      overlay.remove();
      
      const mensaje = document.createElement('div');
      mensaje.className = 'record-guardado';
      mensaje.textContent = '✓ Récord guardado exitosamente';
      document.body.appendChild(mensaje);
      
      setTimeout(() => {
        mensaje.remove();
        window.location.href = '/index.html';
      }, 2000);
    });
    
    document.getElementById('btnEditarRecord').addEventListener('click', () => {
      this.mostrarFormularioNombre(datosRecord, onGuardar);
    });
  }

  /**
   * Formatea tiempo en formato MM:SS
   */
  formatearTiempo(ms) {
    const segundos = Math.floor(ms / 1000);
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${String(minutos).padStart(2, '0')}:${String(segs).padStart(2, '0')}`;
  }
}
