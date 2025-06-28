// ============================
// 🔁 VARIÁVEIS GLOBAIS
// ============================
let chunks = [];
let currentIndex = 0;
let timerId = null;
let isPaused = false;

let prevBtnUsageCount = 0;
const prevBtnMaxUsage = 3;

let currentSpeed = 3000;
const minSpeed = 1000;
const maxSpeed = 6000;


// ============================
// 🎯 ELEMENTOS DA INTERFACE
// ============================
const outputEl = document.getElementById('output');
const restartBtn = document.getElementById('restartBtn');
const prevBtn = document.getElementById('prevBtn');
const pauseBtn = document.getElementById('pauseBtn');
const speedBtn = document.getElementById('speedBtn');


// ============================
// ✂️ DIVISÃO INTELIGENTE POR PONTO E VÍRGULA
function smartSplit(text, minWords = 3) {
  const sentenceBlocks = text.split(/(?<=[.!?])\s+/); // divide por frases
  const finalChunks = [];

  sentenceBlocks.forEach(sentence => {
    const commaParts = sentence.split(',');
    const grouped = [];

    for (let i = 0; i < commaParts.length; i++) {
      let current = commaParts[i].trim();
      const wordCount = current.split(/\s+/).filter(Boolean).length;

      if (wordCount < minWords && grouped.length > 0) {
        grouped[grouped.length - 1] += ', ' + current;
      } else {
        grouped.push(current);
      }
    }

    finalChunks.push(...grouped);
  });

  return finalChunks;
}


// ============================
// 📄 LER ARQUIVO DE TEXTO
// ============================
document.getElementById('fileInput').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (!file) return;

  clearTimeout(timerId);
  currentIndex = 0;
  prevBtnUsageCount = 0;
  updatePrevBtnState();

  const reader = new FileReader();
  reader.onload = function(e) {
    const text = e.target.result;
    chunks = smartSplit(text, 3);
    restartBtn.disabled = false;
    startSequence();
  };

  reader.readAsText(file);
});


// ============================
// ▶️ INICIAR A SEQUÊNCIA
// ============================
function startSequence() {
  clearTimeout(timerId);
  if (!isPaused && currentIndex < chunks.length) {
    showCurrentChunk();
    currentIndex++;
    timerId = setTimeout(startSequence, currentSpeed);
  } else if (currentIndex >= chunks.length) {
    outputEl.textContent = "Fim do texto.";
    restartBtn.disabled = false;
  }
}


// ============================
// ⏯️ MOSTRAR A LEGENDA ATUAL
// ============================
function showCurrentChunk() {
  outputEl.textContent = chunks[currentIndex];
}


// ============================
// 🔁 BOTÃO DE REINICIAR
// ============================
restartBtn.addEventListener('click', () => {
  clearTimeout(timerId);
  currentIndex = 0;
  prevBtnUsageCount = 0;
  updatePrevBtnState();
  isPaused = false;
  pauseBtn.textContent = '⏸️ Pausar';
  startSequence();
});


// ============================
// ⬅️ BOTÃO DE VOLTAR
// ============================
prevBtn.addEventListener('click', () => {
  if (prevBtnUsageCount >= prevBtnMaxUsage) return;

  clearTimeout(timerId);

  currentIndex = Math.max(0, currentIndex - 2);
  showCurrentChunk();

  prevBtnUsageCount++;
  updatePrevBtnState();

  timerId = setTimeout(() => {
    currentIndex++;
    startSequence();
  }, 6000);
});


// ============================
// 🔒 BLOQUEAR VOLTAR APÓS 3x
// ============================
function updatePrevBtnState() {
  if (prevBtnUsageCount >= prevBtnMaxUsage) {
    prevBtn.disabled = true;
    prevBtn.classList.add('disabled-btn');
  } else {
    prevBtn.disabled = false;
    prevBtn.classList.remove('disabled-btn');
  }
}


// ============================
// ⏸️ BOTÃO PAUSAR/RETOMAR
// ============================
pauseBtn.addEventListener('click', () => {
  if (isPaused) {
    isPaused = false;
    pauseBtn.textContent = '⏸️';
    startSequence();
  } else {
    isPaused = true;
    pauseBtn.textContent = '▶️';
    clearTimeout(timerId);
  }
});


// ============================
// 🚀 BOTÃO DE VELOCIDADE
// ============================
speedBtn.addEventListener('click', () => {
  currentSpeed += 1000;
  if (currentSpeed > maxSpeed) currentSpeed = minSpeed;
  speedBtn.textContent = `${currentSpeed / 1000}s`;
});
