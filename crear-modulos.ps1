# Script para crear TODOS los módulos del juego SENTENCE
Write-Host "Creando todos los modulos JavaScript..." -ForegroundColor Cyan

# ===== GameState.js =====
@"
export class GameState {
  constructor() {
    this.textoOriginal = '';
    this.erroresActuales = 0;
    this.probabilidadActual = 5;
    this.juegoActivo = false;
    this.totalSorteos = 0;
    this.totalErrores = 0;
  }
  reset() {
    this.erroresActuales = 0;
    this.probabilidadActual = 5;
    this.totalSorteos = 0;
    this.totalErrores = 0;
  }
  incrementarError() {
    this.erroresActuales++;
    this.totalErrores++;
  }
  reducirProbabilidad() {
    if (this.probabilidadActual > 1) this.probabilidadActual--;
  }
  resetearErrores() { this.erroresActuales = 0; }
  activar() { this.juegoActivo = true; }
  desactivar() { this.juegoActivo = false; }
  incrementarSorteo() { this.totalSorteos++; }
}
"@ | Out-File "src\game\GameState.js" -Encoding UTF8
Write-Host "- GameState.js creado" -ForegroundColor Green

# ===== TextValidator.js =====
@"
export class TextValidator {
  static limpiarTexto(s) {
    if (typeof s !== 'string') s = String(s);
    s = s.replace(/[\uFEFF\u00A0\u200B-\u200F\u2028\u2029\u2060]/g, '');
    s = s.replace(/\r/g, '');
    try { s = s.normalize('NFC'); } catch (e) {}
    return s;
  }
  static validar(textoUsuario, textoOriginal) {
    const valorLimpio = this.limpiarTexto(textoUsuario);
    const esperado = textoOriginal.slice(0, valorLimpio.length);
    return {
      esValido: valorLimpio === esperado,
      progreso: (valorLimpio.length / textoOriginal.length) * 100,
      completado: valorLimpio === textoOriginal,
      excedido: valorLimpio.length > textoOriginal.length,
      textoLimpio: valorLimpio
    };
  }
}
"@ | Out-File "src\game\TextValidator.js" -Encoding UTF8
Write-Host "- TextValidator.js creado" -ForegroundColor Green

# ===== RouletteSystem.js =====
@"
export class RouletteSystem {
  static sortear(probabilidad) {
    const random = Math.floor(Math.random() * probabilidad) + 1;
    const muere = random === 1 || probabilidad === 1;
    console.log('Sorteo: ' + random + ' de ' + probabilidad);
    return { numero: random, probabilidad, muere, salvado: !muere };
  }
}
"@ | Out-File "src\game\RouletteSystem.js" -Encoding UTF8
Write-Host "- RouletteSystem.js creado" -ForegroundColor Green

# ===== TimerController.js =====
@"
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
"@ | Out-File "src\game\TimerController.js" -Encoding UTF8
Write-Host "- TimerController.js creado" -ForegroundColor Green

Write-Host "`nTodos los modulos basicos creados!" -ForegroundColor Cyan
Write-Host "Ahora crea los archivos UI y Audio manualmente o ejecuta otro script." -ForegroundColor Yellow