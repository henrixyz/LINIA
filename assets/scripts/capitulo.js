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

  function splitTextByWords(text, maxWords = 10) {
    const words = text.split(/\s+/);
    let result = [];
    for (let i = 0; i < words.length; i += maxWords) {
      result.push(words.slice(i, i + maxWords).join(' '));
    }
    return result;
  }

  function carregarCapitulo() {
    const texto = localStorage.getItem("capituloSelecionado");
    if (!texto) {
      outputEl.textContent = "Erro ao carregar capítulo.";
      return;
    }
    chunks = splitTextByWords(texto, 10);
    startSequence();
  }

  function startSequence() {
    clearTimeout(timerId);
    if (!isPaused && currentIndex < chunks.length) {
      showCurrentChunk();
      currentIndex++;
      timerId = setTimeout(startSequence, currentSpeed);
    } else if (currentIndex >= chunks.length) {
      outputEl.textContent = "Fim do capítulo.";
    }
  }

  function showCurrentChunk() {
    outputEl.textContent = chunks[currentIndex];
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
    if (!isPaused) startSequence();
    else clearTimeout(timerId);
  });

  speedBtn.addEventListener('click', () => {
    currentSpeed += 1000;
    if (currentSpeed > maxSpeed) currentSpeed = minSpeed;
    speedBtn.textContent = `${currentSpeed / 1000}s`;
  });

  carregarCapitulo();