# Script para crear AudioManager
Write-Host "Creando AudioManager..." -ForegroundColor Cyan

@"
export class AudioManager {
  constructor() {
    this.POS_KEY = 'pya_musica_pos';
    this.TIME_KEY = 'pya_musica_time';
    this.VOL_KEY = 'pya_musica_vol';
    this.VOL_BOTONES_KEY = 'pya_boton_vol';
    this.musica = null;
    this.hoverSound = null;
    this.selectSound = null;
    this.saveIntervalId = null;
  }
  inicializar() {
    this.setupAudioElements();
    this.aplicarVolumenDesdeLocalStorage();
    const path = window.location.pathname.toLowerCase();
    if (!path.includes('juego')) {
      this.intentarPlayMusica();
      this.comenzarGuardadoPeriodo();
      this.setupResumeOnUserGesture();
    }
    this.conectarEfectosAElementos();
    this.conectarSliderVolumen();
    window.addEventListener('beforeunload', () => this.guardarPosicion());
  }
  setupAudioElements() {
    this.musica = document.getElementById('musicaFondo') || new Audio('/sonido/sala_principal.mp3');
    this.hoverSound = document.getElementById('hoverSound') || new Audio('/sonido/hover.mp3');
    this.selectSound = document.getElementById('selectSound') || new Audio('/sonido/SELEC.mp3');
    this.musica.preload = 'auto';
    this.musica.loop = true;
    this.hoverSound.preload = 'auto';
    this.selectSound.preload = 'auto';
    const vol = localStorage.getItem(this.VOL_KEY);
    this.musica.volume = vol ? parseFloat(vol) : 0.5;
    const volBotones = localStorage.getItem(this.VOL_BOTONES_KEY);
    this.hoverSound.volume = volBotones ? parseFloat(volBotones) : 0.9;
    this.selectSound.volume = volBotones ? parseFloat(volBotones) : 0.9;
  }
  calcularPosicionParaReanudar() {
    const storedPos = parseFloat(localStorage.getItem(this.POS_KEY));
    const storedTime = parseInt(localStorage.getItem(this.TIME_KEY), 10);
    if (!isFinite(storedPos) || !storedTime) return 0;
    const ahora = Date.now();
    const elapsed = (ahora - storedTime) / 1000;
    const dur = isFinite(this.musica.duration) ? this.musica.duration : null;
    if (dur && dur > 0) return (storedPos + elapsed) % dur;
    return storedPos + elapsed;
  }
  intentarPlayMusica() {
    if (!this.musica) return;
    if (!this.musica.paused && this.musica.currentTime > 0) return;
    const startAfterMetadata = () => {
      try {
        const newPos = this.calcularPosicionParaReanudar();
        if (isFinite(this.musica.duration) && this.musica.duration > 0) {
          this.musica.currentTime = Math.min(newPos, this.musica.duration - 0.001);
        } else {
          this.musica.currentTime = newPos;
        }
      } catch (e) {}
      this.musica.play().catch(() => {});
    };
    if (this.musica.readyState >= 1) {
      startAfterMetadata();
    } else {
      this.musica.addEventListener('loadedmetadata', startAfterMetadata, { once: true });
    }
  }
  comenzarGuardadoPeriodo() {
    if (!this.musica) return;
    if (this.saveIntervalId) clearInterval(this.saveIntervalId);
    this.saveIntervalId = setInterval(() => this.guardarPosicion(), 300);
  }
  guardarPosicion() {
    try {
      if (this.musica) {
        localStorage.setItem(this.POS_KEY, String(this.musica.currentTime || 0));
        localStorage.setItem(this.TIME_KEY, String(Date.now()));
      }
    } catch (e) {}
  }
  aplicarVolumenDesdeLocalStorage() {
    const vol = localStorage.getItem(this.VOL_KEY);
    if (vol !== null && this.musica) this.musica.volume = parseFloat(vol);
    const volBot = localStorage.getItem(this.VOL_BOTONES_KEY);
    if (volBot !== null) {
      if (this.hoverSound) this.hoverSound.volume = parseFloat(volBot);
      if (this.selectSound) this.selectSound.volume = parseFloat(volBot);
    }
  }
  setupResumeOnUserGesture() {
    const resume = () => {
      this.intentarPlayMusica();
      window.removeEventListener('pointerdown', resume);
      window.removeEventListener('keydown', resume);
      window.removeEventListener('touchstart', resume);
    };
    window.addEventListener('pointerdown', resume, { once: true });
    window.addEventListener('keydown', resume, { once: true });
    window.addEventListener('touchstart', resume, { once: true });
  }
  conectarEfectosAElementos() {
    const botones = document.querySelectorAll('.btn');
    botones.forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        if (!this.hoverSound) return;
        try {
          this.hoverSound.currentTime = 0;
          this.hoverSound.play().catch(() => {});
        } catch (e) {}
      }, { passive: true });
      btn.addEventListener('click', () => {
        if (!this.selectSound) return;
        try {
          this.selectSound.currentTime = 0;
          this.selectSound.play().catch(() => {});
        } catch (e) {}
      }, { passive: true });
    });
  }
  conectarSliderVolumen() {
    const sliderFondo = document.getElementById('volumenfondo');
    if (sliderFondo) {
      const volFondo = localStorage.getItem(this.VOL_KEY);
      sliderFondo.value = volFondo !== null ? volFondo : (this.musica ? this.musica.volume : 0.5);
      sliderFondo.addEventListener('input', (e) => {
        const val = e.target.value;
        try { localStorage.setItem(this.VOL_KEY, val); } catch (err) {}
        if (this.musica) this.musica.volume = parseFloat(val);
      });
    }
    const sliderBotones = document.getElementById('botonvolumen');
    if (sliderBotones) {
      const volBotones = localStorage.getItem(this.VOL_BOTONES_KEY);
      sliderBotones.value = volBotones !== null ? volBotones : 0.9;
      sliderBotones.addEventListener('input', (e) => {
        const val = e.target.value;
        try { localStorage.setItem(this.VOL_BOTONES_KEY, val); } catch (err) {}
        if (this.hoverSound) this.hoverSound.volume = parseFloat(val);
        if (this.selectSound) this.selectSound.volume = parseFloat(val);
      });
    }
  }
}
"@ | Out-File "src\audio\AudioManager.js" -Encoding UTF8
Write-Host "- AudioManager.js creado" -ForegroundColor Green