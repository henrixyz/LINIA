let chunks = [];
let currentIndex = 0;
let timerId = null;
let isPaused = false;
let prevBtnUsageCount = 0;
const prevBtnMaxUsage = 3;

const minSpeed = 1000;
const maxSpeed = 6000;

const outputEl = document.getElementById('output');
const restartBtn = document.getElementById('restartBtn');
const prevBtn = document.getElementById('prevBtn');
const pauseBtn = document.getElementById('pauseBtn');
const speedBtn = document.getElementById('speedBtn');

const speedLevels = [-3, -2, -1, 1, 2, 3];
let currentSpeedIndex = 3; // Começa em 1x

function getDisplayTime(text) {
  const baseTime = 1000;
  const timePerChar = 50;

  let time = baseTime + text.length * timePerChar;
  if (time < minSpeed) time = minSpeed;
  if (time > maxSpeed) time = maxSpeed;
  return time;
}

function getDisplayTimeAdjusted(text) {
  let time = getDisplayTime(text);
  const speedValue = speedLevels[currentSpeedIndex];

  if (speedValue < 0) {
    time *= Math.abs(speedValue);
  } else {
    time /= speedValue;
  }

  return Math.max(minSpeed, Math.min(maxSpeed, time));
}

function smartSplit(text, maxChars = 60) {
  const sentences = text.match(/[^.!?]+[.!?]*|\s+/g)
    .filter(Boolean)
    .map(s => s.trim());

  const result = [];

  sentences.forEach(sentence => {
    if (sentence.length <= maxChars) {
      result.push(sentence);
    } else {
      let parts = [];
      let temp = '';
      const fragments = sentence.split(',');

      for (let i = 0; i < fragments.length; i++) {
        const fragment = fragments[i].trim();
        const nextPart = temp ? temp + ', ' + fragment : fragment;

        if (nextPart.length <= maxChars) {
          temp = nextPart;
        } else {
          if (temp) parts.push(...splitByWords(temp, maxChars));
          temp = fragment;
        }
      }

      if (temp) parts.push(...splitByWords(temp, maxChars));
      result.push(...parts);
    }
  });

  return result;
}

function splitByWords(text, maxChars) {
  const words = text.split(/\s+/);
  const result = [];
  let temp = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const next = temp ? temp + ' ' + word : word;

    if (next.length <= maxChars) {
      temp = next;
    } else {
      if (temp) result.push(temp);
      temp = word;
    }
  }

  if (temp) result.push(temp);
  return result;
}

function carregarCapitulo() {
  const texto = localStorage.getItem("capituloSelecionado");
  if (!texto) {
    outputEl.textContent = "Erro ao carregar capítulo.";
    return;
  }

  const textoLimpo = texto.replace(/^cap[ií]tulo\s+\d+.*\n?/i, '').trim();
  chunks = smartSplit(textoLimpo, 60);
  startSequence();
}

function startSequence() {
  clearTimeout(timerId);

  if (!isPaused && currentIndex < chunks.length) {
    showCurrentChunk();
    atualizarBarraProgresso(); // <-- Aqui
    const displayTime = getDisplayTimeAdjusted(chunks[currentIndex]);
    currentIndex++;
    timerId = setTimeout(startSequence, displayTime);
  } else if (currentIndex >= chunks.length) {
    outputEl.textContent = "Fim da seção.";
    marcarComoConcluido();
    atualizarBarraProgresso(); // garante 100%
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
  atualizarBarraProgresso();
  prevBtnUsageCount++;
  timerId = setTimeout(() => {
    currentIndex++;
    startSequence();
  }, 6000);
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

function atualizarBarraProgresso() {
  const progresso = (currentIndex / chunks.length) * 100;
  const barra = document.getElementById("barra-preenchida");
  if (barra) {
    barra.style.width = `${Math.min(100, progresso)}%`;
  }
}

carregarCapitulo();
