/**
 * FrasesManager.js
 * Gestión de frases del juego
 */

export class FrasesManager {
  constructor() {
    this.frases = [
      "La felicidad se puede hallar hasta en los más oscuros momentos, si somos capaces de usar bien la luz.",
      "Las consecuencias de nuestras acciones son siempre tan complicadas, tan diversas, que predecir el futuro resulta ser un negocio muy difícil en sí",
      "Cuando la música suena, el corazón comienza a bailar sin aviso.",
      "El conocimiento es poder, pero la sabiduría es saber cómo usarlo correctamente.",
      "En la vida, no se trata de esperar a que pase la tormenta, sino de aprender a bailar bajo la lluvia.",
      "La verdadera grandeza consiste en ser dueño de uno mismo y no esclavo de las circunstancias."
    ];
  }

  /**
   * Obtiene todas las frases disponibles
   */
  obtenerTodasLasFrases() {
    return [...this.frases];
  }

  /**
   * Obtiene una frase aleatoria
   */
  obtenerFraseAleatoria() {
    const index = Math.floor(Math.random() * this.frases.length);
    return this.frases[index];
  }

  /**
   * Obtiene una frase por índice
   */
  obtenerFrasePorIndice(index) {
    return this.frases[index] || this.frases[0];
  }
}