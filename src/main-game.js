import { GameController } from './game/GameController.js';
import { FrasesManager } from './utils/FrasesManager.js';
import '../styles/styles.css';
import { AudioManager } from './audio/AudioManager.js';

let audioManager;
let gameController;
let frasesManager;
let modoSeleccionado = null;
let fraseSeleccionada = null;

document.addEventListener('DOMContentLoaded', () => {
  gameController = new GameController();
  frasesManager = new FrasesManager();
  audioManager = new AudioManager();
  audioManager.inicializar();
  window.audioManagerGlobal = audioManager;
  configurarSelectoresModo();
  console.log('Sistema de juego inicializado');
});

function configurarSelectoresModo() {
  // Botones de modo
  document.getElementById('btnModoRandom').addEventListener('click', () => {
    modoSeleccionado = 'random';
    document.getElementById('modoSelector').style.display = 'none';
    document.getElementById('randomConfirm').style.display = 'block';
  });
  
  document.getElementById('btnModoSeleccion').addEventListener('click', () => {
    modoSeleccionado = 'seleccion';
    document.getElementById('modoSelector').style.display = 'none';
    cargarFrases();
    document.getElementById('fraseSelector').style.display = 'block';
  });
  
  // Random confirm
  document.getElementById('btnJugarRandom').addEventListener('click', () => {
    fraseSeleccionada = frasesManager.obtenerFraseAleatoria();
    iniciarJuegoConFrase();
  });
  
  document.getElementById('btnVolverModoRandom').addEventListener('click', () => {
    document.getElementById('randomConfirm').style.display = 'none';
    document.getElementById('modoSelector').style.display = 'block';
  });
  
  // Seleccion de frase
  document.getElementById('btnJugarFrase').addEventListener('click', () => {
    if (fraseSeleccionada) {
      iniciarJuegoConFrase();
    }
  });
  
  document.getElementById('btnVolverModo').addEventListener('click', () => {
    document.getElementById('fraseSelector').style.display = 'none';
    document.getElementById('modoSelector').style.display = 'block';
  });
}

function cargarFrases() {
  const frases = frasesManager.obtenerTodasLasFrases();
  const lista = document.getElementById('frasesLista');
  
  lista.innerHTML = frases.map((frase, index) => `
    <div class="frase-item" data-index="${index}">
      <input type="radio" name="frase" id="frase${index}" value="${frase}">
      <label for="frase${index}">${frase}</label>
    </div>
  `).join('');
  
  // Eventos de seleccion
  document.querySelectorAll('input[name="frase"]').forEach(input => {
    input.addEventListener('change', (e) => {
      fraseSeleccionada = e.target.value;
      document.getElementById('btnJugarFrase').disabled = false;
    });
  });
}

function iniciarJuegoConFrase() {
  // Ocultar selectores
  document.getElementById('modoSelector').style.display = 'none';
  document.getElementById('fraseSelector').style.display = 'none';
  document.getElementById('randomConfirm').style.display = 'none';
  
  // Configurar juego
  gameController.modoJuego = modoSeleccionado;
  gameController.fraseSeleccionada = fraseSeleccionada;
  
  // Establecer frase en el elemento
  const textoOriginalEl = document.getElementById('textoOriginal');
  if (textoOriginalEl) {
    textoOriginalEl.textContent = fraseSeleccionada;
  }
  
  // Iniciar juego
  gameController.iniciarJuego();
}

// Exponer para compatibilidad
window.iniciarJuego = () => {
  if (gameController && fraseSeleccionada) {
    gameController.iniciarJuego();
  }
};