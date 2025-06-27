// ============================
// 🔁 VARIÁVEIS GLOBAIS
// ============================
let chunks = [];               // Armazena os blocos de texto (frases)
let currentIndex = 0;          // Índice da legenda atual
let isPaused = false;          // Controle de pausa

let prevBtnUsageCount = 0;     // Quantas vezes usou o botão "voltar"
const prevBtnMaxUsage = 3;     // Limite de usos do botão "voltar"


// ============================
// 🎯 ELEMENTOS DA INTERFACE
// ============================
const outputEl = document.getElementById('output');
const restartBtn = document.getElementById('restartBtn');
const prevBtn = document.getElementById('prevBtn');
const pauseBtn = document.getElementById('pauseBtn');

// ============================
// ✂️ DIVIDIR TEXTO EM FRASES (PERÍODOS)
// ============================
function splitTextBySentences(text) {
  // Divide usando regex que captura '.', '?', '!' seguidos de espaço ou fim da string
  // Inclui o delimitador no final da frase
  const regex = /[^.!?]+[.!?]+(\s|$)/g;
  let sentences = text.match(regex);

  // Se não achou nenhuma frase, usa o texto inteiro
  if (!sentences) {
    return [text];
  }

  // Remove espaços extras no início/fim de cada sentença
  sentences = sentences.map(s => s.trim());

  return sentences;
}

// ============================
// 🎤 FUNÇÃO DE NARRAÇÃO E AVANÇAR AUTOMÁTICO
// ============================
function speak(text) {
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'pt-BR';
  utterance.rate = 1;
  utterance.pitch = 1;

  utterance.onend = () => {
    // Quando terminar a fala, vai para o próximo bloco se não estiver pausado
    if (!isPaused) {
      currentIndex++;
      if (currentIndex < chunks.length) {
        showCurrentChunk();
      } else {
        outputEl.textContent = "Fim do texto.";
        restartBtn.disabled = false;
      }
    }
  };

  window.speechSynthesis.speak(utterance);
}

// ============================
// 📄 LER ARQUIVO DE TEXTO
// ============================
document.getElementById('fileInput').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (!file) return;

  currentIndex = 0;
  prevBtnUsageCount = 0;
  updatePrevBtnState();
  restartBtn.disabled = true;
  outputEl.textContent = "";

  const reader = new FileReader();
  reader.onload = function(e) {
    const text = e.target.result;
    chunks = splitTextBySentences(text);
    restartBtn.disabled = false;
    isPaused = false;
    pauseBtn.textContent = '⏸️';
    showCurrentChunk();
  };

  reader.readAsText(file);
});

// ============================
// ⏯️ MOSTRAR A LEGENDA ATUAL E NARRAR
// ============================
function showCurrentChunk() {
  const text = chunks[currentIndex];
  outputEl.textContent = text;
  speak(text);
}

// ============================
// 🔁 BOTÃO DE REINICIAR
// ============================
restartBtn.addEventListener('click', () => {
  window.speechSynthesis.cancel();

  currentIndex = 0;
  prevBtnUsageCount = 0;
  updatePrevBtnState();
  isPaused = false;
  pauseBtn.textContent = '⏸️';
  showCurrentChunk();
});

// ============================
// ⬅️ BOTÃO DE VOLTAR
// ============================
prevBtn.addEventListener('click', () => {
  if (prevBtnUsageCount >= prevBtnMaxUsage) return;

  window.speechSynthesis.cancel();

  currentIndex = Math.max(0, currentIndex - 1);
  showCurrentChunk();

  prevBtnUsageCount++;
  updatePrevBtnState();
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
    showCurrentChunk(); // retoma a fala no bloco atual
  } else {
    isPaused = true;
    pauseBtn.textContent = '▶️';
    window.speechSynthesis.cancel(); // pausa narração
  }
});
