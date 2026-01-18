import { AudioManager } from './audio/AudioManager.js';
import '../styles/styles.css';
let audioManager;

function iniciarMaquinaEscribir() {
  const typeEl = document.getElementById('typewriter');
  if (!typeEl) return;
  const texto = typeEl.textContent;
  typeEl.textContent = '';
  let i = 0;
  const interval = setInterval(() => {
    if (i < texto.length) {
      typeEl.textContent += texto.charAt(i);
      i++;
    } else {
      clearInterval(interval);
    }
  }, 45);
}

document.addEventListener('DOMContentLoaded', () => {
  audioManager = new AudioManager();
  audioManager.inicializar();
  iniciarMaquinaEscribir();
  console.log('Sistema de audio inicializado');
});
