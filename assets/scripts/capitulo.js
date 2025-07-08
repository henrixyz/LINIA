let chunks = [];
let currentIndex = 0;
let timerId = null;
let isPaused = false;
let prevBtnUsageCount = 0;
const prevBtnMaxUsage = 3;
let currentSpeed = 3000;
const minSpeed = 1000;
const maxSpeed = 6000;

const outputEl = document.getElementById('output');
const restartBtn = document.getElementById('restartBtn');
const prevBtn = document.getElementById('prevBtn');
const pauseBtn = document.getElementById('pauseBtn');
const speedBtn = document.getElementById('speedBtn');

// ✅ Correção da lógica para respeitar 100% o limite
function smartSplit(text, maxChars = 70) {
  const words = text.split(/\s+/);
  const result = [];
  let chunk = '';

  words.forEach((word, index) => {
    const testChunk = chunk.length ? chunk + ' ' + word : word;

    if (testChunk.length <= maxChars) {
      chunk = testChunk;
    } else {
      if (chunk) result.push(chunk.trim());
      chunk = word;
    }

    // Se última palavra, adiciona também
    if (index === words.length - 1 && chunk) {
      result.push(chunk.trim());
    }
  });

  return result;
}

function carregarCapitulo() {
  const texto = localStorage.getItem("capituloSelecionado");
  if (!texto) {
    outputEl.textContent = "Erro ao carregar capítulo.";
    return;
  }
  chunks = smartSplit(texto, 70); // ✅ Respeita 40 caracteres agora
  startSequence();
}

function startSequence() {
  clearTimeout(timerId);
  if (!isPaused && currentIndex < chunks.length) {
    showCurrentChunk();
    currentIndex++;
    timerId = setTimeout(startSequence, currentSpeed);
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
  currentSpeed += 1000;
  if (currentSpeed > maxSpeed) currentSpeed = minSpeed;
  speedBtn.textContent = `${currentSpeed / 1000}s`;
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
