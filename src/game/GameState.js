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
