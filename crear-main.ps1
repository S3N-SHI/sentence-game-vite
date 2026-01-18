# Script para crear archivos main
Write-Host "Creando archivos main..." -ForegroundColor Cyan

# main-game.js
@"
import { GameController } from './game/GameController.js';
import '../styles/styles.css';

let gameController;

document.addEventListener('DOMContentLoaded', () => {
  gameController = new GameController();
  window.iniciarJuego = () => {
    gameController.iniciarJuego();
  };
  console.log('Sistema de juego inicializado');
});
"@ | Out-File "src\main-game.js" -Encoding UTF8
Write-Host "- main-game.js creado" -ForegroundColor Green

# main-menu.js
@"
import { AudioManager } from './audio/AudioManager.js';
import '../styles/pagina-principal.css';

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
"@ | Out-File "src\main-menu.js" -Encoding UTF8
Write-Host "- main-menu.js creado" -ForegroundColor Green

Write-Host "`nArchivos main creados!" -ForegroundColor Cyan