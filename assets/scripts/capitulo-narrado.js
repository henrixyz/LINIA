let chunks = [];
let currentIndex = 0;
let isPaused = false;
let prevBtnUsageCount = 0;
const prevBtnMaxUsage = 3;

const outputEl = document.getElementById('output');
const restartBtn = document.getElementById('restartBtn');
const prevBtn = document.getElementById('prevBtn');
const pauseBtn = document.getElementById('pauseBtn');
const speedBtn = document.getElementById('speedBtn');

const speedLevels = [-3, -2, -1, 1, 2, 3];
let currentSpeedIndex = 3; // Começa em 1x

let currentUtterance = null;

function smartSplit(text) {
    const sentences = text.match(/[^.!?:]+[.!?:]+/g)
    return sentences.map(s => s.trim());
}

function carregarCapitulo() {
    const texto = localStorage.getItem("capituloSelecionado");
    if (!texto) {
        outputEl.textContent = "Erro ao carregar capítulo.";
        return;
    }

    const textoLimpo = texto.replace(/^cap[ií]tulo\s+\d+.*\n?/i, '').trim();
    chunks = smartSplit(textoLimpo);
    currentIndex = 0;
    startSequence();
}

function startSequence() {
    if (isPaused || currentIndex >= chunks.length) return;

    const currentText = chunks[currentIndex];
    outputEl.textContent = currentText;
    speakText(currentText, () => {
        currentIndex++;
        if (!isPaused && currentIndex < chunks.length) {
        startSequence();
        } else if (currentIndex >= chunks.length) {
        outputEl.textContent = "Fim da seção.";
        speakText("Fim da seção.");
        marcarComoConcluido();
        }
    });
}

function speakText(text, onEndCallback) {
    if (!window.speechSynthesis) return;

    speechSynthesis.cancel();
    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.lang = 'pt-BR';

    const availableVoices = speechSynthesis.getVoices();
    const brVoice = availableVoices.find(v => v.lang === 'pt-BR' || v.name.toLowerCase().includes('brazil'));

    if (brVoice) {
        currentUtterance.voice = brVoice;
    }

    const speedFactor = speedLevels[currentSpeedIndex];
    currentUtterance.rate = Math.max(0.1, Math.abs(speedFactor));

    currentUtterance.onend = () => {
        if (typeof onEndCallback === 'function') {
            onEndCallback();
        }
    };

    speechSynthesis.speak(currentUtterance);
}

restartBtn.addEventListener('click', () => {
  speechSynthesis.cancel();
  currentIndex = 0;
  prevBtnUsageCount = 0;
  isPaused = false;
  pauseBtn.textContent = '⏸️';
  startSequence();
});

prevBtn.addEventListener('click', () => {
  if (prevBtnUsageCount >= prevBtnMaxUsage) return;
  speechSynthesis.cancel();
  currentIndex = Math.max(0, currentIndex - 2);
  prevBtnUsageCount++;
  startSequence();
});

pauseBtn.addEventListener('click', () => {
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? '▶️' : '⏸️';

  if (isPaused) {
    outputEl.classList.add('paused');
    speechSynthesis.cancel();
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

// Aguarda as vozes estarem prontas antes de iniciar
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = () => {
    carregarCapitulo();
  };
} else {
  carregarCapitulo();
}
