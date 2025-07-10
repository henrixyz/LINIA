let chunks = [];
let currentIndex = 0;
let timerId = null;
let isPaused = false;
let prevBtnUsageCount = 0;
const prevBtnMaxUsage = 3;

const minSpeed = 200;
const maxSpeed = 3000;

const outputEl = document.getElementById('output');
const restartBtn = document.getElementById('restartBtn');
const prevBtn = document.getElementById('prevBtn');
const pauseBtn = document.getElementById('pauseBtn');
const speedBtn = document.getElementById('speedBtn');

// Níveis de velocidade: -3x, -2x, -1x, 1x, 2x, 3x
const speedLevels = [-3, -2, -1, 1, 2, 3];
let currentSpeedIndex = 3; // Começa em 1x

function getDisplayTime(text) {
  const baseTime = 300; // menor tempo base
  const timePerChar = 20; // menor tempo por caractere

  let time = baseTime + text.length * timePerChar;

  if (time < minSpeed) time = minSpeed;
  if (time > maxSpeed) time = maxSpeed;

  return time;
}

function getDisplayTimeAdjusted(text) {
  let time = getDisplayTime(text);
  const speedValue = speedLevels[currentSpeedIndex];

  if (speedValue < 0) {
    time = time * Math.abs(speedValue); // mais devagar
  } else {
    time = time / speedValue; // mais rápido
  }

  if (time < minSpeed) time = minSpeed;
  if (time > maxSpeed) time = maxSpeed;

  return time;
}

function wordSplit(text) {
  return text
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);
}

function carregarCapitulo() {
  const texto = localStorage.getItem("capituloSelecionado");
  if (!texto) {
    outputEl.textContent = "Erro ao carregar capítulo.";
    return;
  }

  const textoLimpo = texto.replace(/^cap[ií]tulo\s+\d+.*\n?/i, '').trim();
  chunks = wordSplit(textoLimpo);
  startSequence();
}

function startSequence() {
  clearTimeout(timerId);
  if (!isPaused && currentIndex < chunks.length) {
    showCurrentChunk();
    const displayTime = getDisplayTimeAdjusted(chunks[currentIndex]);
    currentIndex++;
    timerId = setTimeout(startSequence, displayTime);
  } else if (currentIndex >= chunks.length) {
    outputEl.textContent = "Fim da seção.";
    marcarComoConcluido();
  }
}

function showCurrentChunk() {
  if (currentIndex < chunks.length) {
    outputEl.textContent = chunks[currentIndex];
  }
}

restartBtn.addEventListener('click', () => {
  clearTimeout(timerId);
  currentIndex = 0;
  prevBtnUsageCount = 0;
  isPaused = false;
  pauseBtn.textContent = '⏸️';
  startSequence();
});

prevBtn.addEventListener('click', () => {
  if (prevBtnUsageCount >= prevBtnMaxUsage) return;
  clearTimeout(timerId);
  currentIndex = Math.max(0, currentIndex - 2);
  showCurrentChunk();
  prevBtnUsageCount++;
  timerId = setTimeout(() => {
    currentIndex++;
    startSequence();
  }, 2000); // 2 segundos para exibir anterior
});

pauseBtn.addEventListener('click', () => {
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? '▶️' : '⏸️';

  if (isPaused) {
    outputEl.classList.add('paused');
    clearTimeout(timerId);
  } else {
    outputEl.classList.remove('paused');
    startSequence();
  }
});

speedBtn.addEventListener('click', () => {
  currentSpeedIndex = (currentSpeedIndex + 1) % speedLevels.length;
  const label = speedLevels[currentSpeedIndex] + 'x';
  speedBtn.textContent = label;
});

function marcarComoConcluido() {
  const capitulo = localStorage.getItem("capituloSelecionado");
  let concluidos = JSON.parse(localStorage.getItem("capitulosConcluidos") || "[]");
  if (!concluidos.includes(capitulo)) {
    concluidos.push(capitulo);
    localStorage.setItem("capitulosConcluidos", JSON.stringify(concluidos));
  }
}

carregarCapitulo();
