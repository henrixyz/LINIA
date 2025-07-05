const modal = document.getElementById('modal');
const closeBtn = document.getElementById('close-btn');
const downloadBtn = document.getElementById('download-btn');

  // Quando clica na imagem da capa
document.querySelectorAll('.cover-placeholder').forEach(img => {
img.addEventListener('click', () => {
    const bookName = img.dataset.book;
    // Define o link de download (ajuste o caminho conforme seu projeto)
    downloadBtn.href = `assets/livros/${bookName}.pdf`;

    modal.classList.remove('hidden');
});
});

// Fechar modal
closeBtn.addEventListener('click', () => {
modal.classList.add('hidden');
});

// Fechar modal ao clicar fora do conteúdo
modal.addEventListener('click', (e) => {
if (e.target === modal) {
    modal.classList.add('hidden');
}
});
