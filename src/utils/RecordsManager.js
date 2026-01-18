/**
 * RecordsManager.js
 * Sistema de gestión de récords del juego
 */

export class RecordsManager {
  constructor() {
    this.STORAGE_KEY = 'sentence_records';
  }

  /**
   * Obtiene todos los récords guardados
   */
  obtenerRecords() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error al cargar récords:', e);
      return [];
    }
  }

  /**
   * Guarda un nuevo récord
   * @param {Object} record - { nombre, tiempo, errores, muertes, modo, frase, fecha }
   */
  guardarRecord(record) {
    try {
      const records = this.obtenerRecords();
      records.push({
        id: Date.now(),
        nombre: record.nombre,
        tiempo: record.tiempo,
        errores: record.errores,
        muertes: record.muertes,
        modo: record.modo, // 'random' o 'seleccion'
        frase: record.frase,
        fecha: record.fecha || new Date().toLocaleDateString('es-ES')
      });
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records));
      return true;
    } catch (e) {
      console.error('Error al guardar récord:', e);
      return false;
    }
  }

  /**
   * Obtiene récords filtrados por modo y frase
   */
  obtenerRecordsFiltrados(modo = null, frase = null) {
    let records = this.obtenerRecords();
    
    if (modo) {
      records = records.filter(r => r.modo === modo);
    }
    
    if (frase) {
      records = records.filter(r => r.frase === frase);
    }
    
    return this.ordenarRecords(records);
  }

  /**
   * Ordena récords por puntuación (menor tiempo + menos errores = mejor)
   */
  ordenarRecords(records) {
    return records.sort((a, b) => {
      const scoreA = a.tiempo + (a.errores * 1000) + (a.muertes * 5000);
      const scoreB = b.tiempo + (b.errores * 1000) + (b.muertes * 5000);
      return scoreA - scoreB;
    });
  }

  /**
   * Obtiene el top N récords
   */
  obtenerTopRecords(modo = null, frase = null, limit = 10) {
    const records = this.obtenerRecordsFiltrados(modo, frase);
    return records.slice(0, limit);
  }

  /**
   * Elimina todos los récords (para resetear)
   */
  eliminarTodosLosRecords() {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}