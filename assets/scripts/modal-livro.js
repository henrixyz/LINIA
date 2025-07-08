const modal = document.getElementById('modal');
const closeBtn = document.getElementById('close-btn');
const downloadBtn = document.getElementById('download-btn');

document.querySelectorAll('.cover-placeholder').forEach(img => {
    img.addEventListener('click', () => {
        const bookName = img.dataset.book;
        downloadBtn.href = `assets/livros/${bookName}.pdf`;
        modal.classList.remove('hidden');
  });
});

closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
});


modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.add('hidden');
    }
});


downloadBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Impede navegação padrão

    const url = downloadBtn.href;
    const link = document.createElement('a');
    link.href = url;
    link.download = '';
    link.click(); 

    // Feedback visual
    downloadBtn.textContent = 'Baixado!';
    downloadBtn.style.backgroundColor = '#000'; // verde
    downloadBtn.style.color = '#fff';

    // Restaurar após 2 segundos
    setTimeout(() => {
        downloadBtn.textContent = 'Baixar';
        downloadBtn.style.backgroundColor = '#fcd600';
        downloadBtn.style.color = '#000';
    }, 2000);
});
