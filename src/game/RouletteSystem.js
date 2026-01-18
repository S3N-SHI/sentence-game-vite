export class RouletteSystem {
  static sortear(probabilidad) {
    const random = Math.floor(Math.random() * probabilidad) + 1;
    const muere = random === 1 || probabilidad === 1;
    console.log('Sorteo: ' + random + ' de ' + probabilidad);
    return { numero: random, probabilidad, muere, salvado: !muere };
  }
}
