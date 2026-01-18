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
