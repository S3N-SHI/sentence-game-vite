export class TimerController {
  constructor(elementoTiempoId = 'tiempo') {
    this.tiempoInicio = 0;
    this.tiempoTranscurrido = 0;
    this.interval = null;
    this.elementoTiempo = document.getElementById(elementoTiempoId);
  }
  iniciar() {
    this.tiempoInicio = Date.now();
    this.interval = setInterval(() => this.actualizar(), 100);
  }
  actualizar() {
    this.tiempoTranscurrido = Date.now() - this.tiempoInicio;
    const segundos = Math.floor(this.tiempoTranscurrido / 1000);
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    if (this.elementoTiempo) {
      this.elementoTiempo.textContent = String(minutos).padStart(2, '0') + ':' + String(segs).padStart(2, '0');
    }
  }
  pausar() {
    if (this.interval) {
      clearInterval(this.interval);
      this.tiempoTranscurrido = Date.now() - this.tiempoInicio;
    }
  }
  reanudar() {
    this.tiempoInicio = Date.now() - this.tiempoTranscurrido;
    this.interval = setInterval(() => this.actualizar(), 100);
  }
  detener() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
  obtenerTiempoTranscurrido() {
    return this.tiempoTranscurrido;
  }
}
