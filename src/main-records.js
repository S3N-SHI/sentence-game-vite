import { RecordsManager } from './utils/RecordsManager.js';
import { FrasesManager } from './utils/FrasesManager.js';
import { AudioManager } from './audio/AudioManager.js';
import '../styles/styles.css';

const recordsManager = new RecordsManager();
const frasesManager = new FrasesManager();
let audioManager;

document.addEventListener('DOMContentLoaded', () => {
  audioManager = new AudioManager();
  audioManager.inicializar();
  
  cargarFrasesEnSelect();
  mostrarRecords();
  
  document.getElementById('filtroModo').addEventListener('change', (e) => {
    const grupoFrase = document.getElementById('grupoFrase');
    if (e.target.value === 'seleccion') {
      grupoFrase.style.display = 'block';
    } else {
      grupoFrase.style.display = 'none';
    }
  });
  
  document.getElementById('btnFiltrar').addEventListener('click', mostrarRecords);
  
  document.getElementById('btnResetRecords').addEventListener('click', () => {
    if (confirm('¿Estás seguro de eliminar todos los récords? Esta acción no se puede deshacer.')) {
      recordsManager.eliminarTodosLosRecords();
      mostrarRecords();
    }
  });
});

function cargarFrasesEnSelect() {
  const select = document.getElementById('filtroFrase');
  const frases = frasesManager.obtenerTodasLasFrases();
  
  frases.forEach((frase, index) => {
    const option = document.createElement('option');
    option.value = frase;
    option.textContent = frase.substring(0, 50) + '...';
    select.appendChild(option);
  });
}

function mostrarRecords() {
  const modo = document.getElementById('filtroModo').value;
  const frase = document.getElementById('filtroFrase').value;
  
  let modoFiltro = modo === 'todos' ? null : modo;
  let fraseFiltro = (frase === 'todas' || modo !== 'seleccion') ? null : frase;
  
  const records = recordsManager.obtenerTopRecords(modoFiltro, fraseFiltro, 50);
  const tbody = document.getElementById('tbodyRecords');
  
  if (records.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="no-records">No hay récords registrados</td></tr>';
    return;
  }
  
  tbody.innerHTML = records.map((record, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${record.nombre}</td>
      <td>${formatearTiempo(record.tiempo)}</td>
      <td>${record.errores}</td>
      <td>${record.muertes}</td>
      <td>${record.modo === 'random' ? 'Aleatorio' : 'Selección'}</td>
      <td>${record.fecha}</td>
    </tr>
  `).join('');
}

function formatearTiempo(ms) {
  const segundos = Math.floor(ms / 1000);
  const minutos = Math.floor(segundos / 60);
  const segs = segundos % 60;
  return `${String(minutos).padStart(2, '0')}:${String(segs).padStart(2, '0')}`;
}