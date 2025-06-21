// ============================
// 🔁 VARIÁVEIS GLOBAIS
// ============================
let chunks = [];               // Armazena os blocos de texto
let currentIndex = 0;          // Índice da legenda atual
let timerId = null;            // ID do temporizador para controle do tempo
let isPaused = false;          // Controle de pausa

let prevBtnUsageCount = 0;     // Quantas vezes usou o botão "voltar"
const prevBtnMaxUsage = 3;     // Limite de usos do botão "voltar"

let currentSpeed = 3000;       // Velocidade padrão (3 segundos)
const minSpeed = 1000;         // Velocidade mínima (1s)
const maxSpeed = 6000;         // Velocidade máxima (6s)


// ============================
// 🎯 ELEMENTOS DA INTERFACE
// ============================
const outputEl = document.getElementById('output');
const restartBtn = document.getElementById('restartBtn');
const prevBtn = document.getElementById('prevBtn');
const pauseBtn = document.getElementById('pauseBtn');
const speedBtn = document.getElementById('speedBtn');


// ============================
// ✂️ DIVIDIR TEXTO EM BLOCOS
// ============================
function splitTextByWords(text, maxWords = 10) {
  const words = text.split(/\s+/);
  let result = [];

  for (let i = 0; i < words.length; i += maxWords) {
    result.push(words.slice(i, i + maxWords).join(' '));
  }

  return result;
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
    chunks = splitTextByWords(text, 10);
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
  }, 6000); // pausa maior ao voltar
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
    startSequence(); // retoma
  } else {
    isPaused = true;
    pauseBtn.textContent = '▶️';
    clearTimeout(timerId); // pausa
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
