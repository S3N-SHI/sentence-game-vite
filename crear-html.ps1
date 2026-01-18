# Script para crear archivos HTML
Write-Host "Creando archivos HTML..." -ForegroundColor Cyan

# ===== index.html =====
@"
<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>SENTENCE! – Bienvenidos</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;600&family=Roboto+Slab:wght@300;700&display=swap" rel="stylesheet">
</head>
<body>
    <audio id="musicaFondo" src="/sonido/sala_principal.mp3" loop preload="auto"></audio>
    <audio id="hoverSound" src="/sonido/hover.mp3" preload="auto"></audio>
    <audio id="selectSound" src="/sonido/SELEC.mp3" preload="auto"></audio>

    <main class="container">
        <header class="intro">
            <h1 class="title">SENTENCE!</h1>
            <p class="tag" id="typewriter">Un juego de palabras, tinta y decisiones.</p>
        </header>

        <section class="paper">
            <p class="lead">Bienvenido, escritor. Antes de comenzar, afina tu pluma.</p>

            <nav class="menu">
                <a href="/juego.html" class="btn" id="btnJugar">Jugar</a>
                <a href="/acerca.html" class="btn" id="btnAcerca">Acerca de</a>
                <a href="/opciones.html" class="btn" id="btnOpciones">Opciones</a>
                <a href="/creditos.html" class="btn" id="btnCreditos">Créditos</a>
            </nav>

            <div class="meta">
                <span>Versión 1.0</span> · <span>© Sentence</span>
            </div>
        </section>

        <footer class="footer">
            <p>"Mi pluma lo mató" – <strong>Juan Montalvo</strong></p>
        </footer>
    </main>

    <script type="module" src="/src/main-menu.js"></script>
</body>
</html>
"@ | Out-File "index.html" -Encoding UTF8
Write-Host "- index.html creado" -ForegroundColor Green

# ===== juego.html =====
@"
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Transcripción Extrema - Ruleta Rusa</title>
</head>
<body>
  <div class="game-container">
    <h1>🎲 TRANSCRIPCIÓN EXTREMA - RULETA RUSA 🎲</h1>

    <div class="instrucciones" id="instrucciones">
      <h3>⚠️ REGLAS DEL JUEGO ⚠️</h3>
      <p>✍️ Escribe el texto EXACTAMENTE como aparece</p>
      <p>🎯 Puedes cometer hasta <strong>3 ERRORES</strong> antes de entrar en un sorteo</p>
      <p>🎲 Al 3er error → <strong>SORTEO VIVES/MUERES</strong></p>
      <div class="destacado"></div>
      <p>📊 Probabilidades: 1/5 → 1/4 → 1/3 → 1/2 → 1/1 (muerte segura)</p>
      <p>⏱️ El cronómetro se pausa durante los videos</p>
      <p style="margin-top: 20px; opacity: 0.8; font-size: 0.9em;">⚠️ No puedes copiar y pegar</p>
      
      <div class="oraciones-seleccion">
        <h4>Elige una oración para jugar:</h4>
        <label><input type="radio" name="oracion" value="La felicidad se puede hallar hasta en los más oscuros momentos, si somos capaces de usar bien la luz." checked> La felicidad se puede hallar hasta en los más oscuros momentos, si somos capaces de usar bien la luz</label><br>
        <label><input type="radio" name="oracion" value="Las consecuencias de nuestras acciones son siempre tan complicadas, tan diversas, que predecir el futuro resulta ser un negocio muy difícil en sí"> Las consecuencias de nuestras acciones son siempre tan complicadas, tan diversas, que predecir el futuro resulta ser un negocio muy difícil en sí</label><br>
        <label><input type="radio" name="oracion" value="Cuando la música suena, el corazón comienza a bailar sin aviso."> Cuando la música suena, el corazón comienza a bailar sin aviso.</label>
      </div>
      
      <button class="btn-iniciar" onclick="iniciarJuego()">¡COMENZAR LA RULETA!</button>
    </div>

    <div class="hud" style="display: none;" id="hud">
      <div class="hud-item">
        <div class="hud-label">⏱️ TIEMPO</div>
        <div class="hud-value" id="tiempo">00:00</div>
      </div>
      <div class="hud-item">
        <div class="hud-label">📊 RULETA</div>
        <div class="hud-value" id="probabilidad">1/5</div>
      </div>
      <div class="hud-item">
        <div class="hud-label">❌ ERRORES</div>
        <div class="hud-value" id="contadorErrores">0/3</div>
        <div class="errores-barra">
          <div class="error-dot" id="error1"></div>
          <div class="error-dot" id="error2"></div>
          <div class="error-dot" id="error3"></div>
        </div>
      </div>
      <div class="hud-item">
        <div class="hud-label">📈 PROGRESO</div>
        <div class="hud-value" id="progreso">0%</div>
      </div>
    </div>

    <div class="texto-container" id="textoContainer" style="display: none;">
      <div class="texto-original" id="textoOriginal"></div>
      <div class="texto-usuario-overlay" id="textoUsuarioOverlay"></div>
    </div>

    <textarea id="entradaUsuario" spellcheck="false"></textarea>

    <div class="victoria" id="victoria">
      <h2>🎉 ¡SOBREVIVISTE! 🎉</h2>
      <p id="tiempoFinal"></p>
      <p id="estadisticas"></p>
      <button class="btn-iniciar" onclick="location.reload()">Jugar de nuevo</button>
    </div>
  </div>

  <div class="countdown-overlay" id="countdown" style="display: none;">
    <div class="countdown-number" id="countdownNumber">3</div>
  </div>

  <div class="video-overlay" id="videoOverlay">
    <video id="videoPlayer"></video>
    <div class="video-info" id="videoInfo"></div>
  </div>

  <div class="game-over" id="gameOver">
    <h2>💀 GAME OVER 💀</h2>
    <p id="mensajeGameOver">¡Valió Vrg!</p>
    <button onclick="location.reload()">Intentar de nuevo</button>
  </div>

  <script type="module" src="/src/main-game.js"></script>
</body>
</html>
"@ | Out-File "juego.html" -Encoding UTF8
Write-Host "- juego.html creado" -ForegroundColor Green

# ===== opciones.html =====
@"
<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Opciones – Sentence</title>
</head>
<body>
    <audio id="musicaFondo" src="/sonido/sala_principal.mp3" loop preload="auto"></audio>
    <audio id="hoverSound" src="/sonido/hover.mp3" preload="auto"></audio>
    <audio id="selectSound" src="/sonido/SELEC.mp3" preload="auto"></audio>

    <main class="container">
        <header class="intro">
            <h1 class="title">Opciones</h1>
        </header>

        <section class="paper">
            <p class="lead">Ajusta el volumen del juego según tu preferencia.</p>

            <div class="slider-box">
                <label for="volumenfondo">Volumen de fondo:</label>
                <input type="range" id="volumenfondo" min="0" max="1" step="0.01">
            </div>

            <div class="slider-box">
                <label for="botonvolumen">Volumen de botones:</label>
                <input type="range" id="botonvolumen" min="0" max="1" step="0.01">
            </div>

            <nav class="menu">
                <a href="/index.html" class="btn" id="btnVolver">Volver</a>
            </nav>
        </section>
    </main>

    <script type="module" src="/src/main-menu.js"></script>
</body>
</html>
"@ | Out-File "opciones.html" -Encoding UTF8
Write-Host "- opciones.html creado" -ForegroundColor Green

Write-Host "`n✅ Todos los archivos HTML creados!" -ForegroundColor Cyan