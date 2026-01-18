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
      this.info.textContent = 'ðŸ’€ VALIÃ“ VRG ðŸ’€';
      this.info.style.color = '#ff4444';
    } else {
      this.info.textContent = 'âš ï¸ TE SALVASTE âš ï¸';
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
    if (!esGameOver) alert('âš ï¸ Video no encontrado');
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
