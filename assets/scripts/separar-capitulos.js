function gerarCapitulos() {
  const texto = localStorage.getItem("textoCompleto");
  if (!texto) {
    document.getElementById("capitulosContainer").textContent = "Nenhum texto carregado.";
    return;
  }

  const capitulosBrutos = texto.split(/cap[ií]tulo\s+\d+/i);
  const titulosBrutos = texto.match(/cap[ií]tulo\s+\d+/gi) || [];

  const capitulos = capitulosBrutos.filter(t => t.trim() !== "");
  const concluidos = JSON.parse(localStorage.getItem("capitulosConcluidos") || "[]");

  const container = document.getElementById("capitulosContainer");
  container.innerHTML = ''; 

  capitulos.forEach((conteudo, index) => {
    const div = document.createElement("div");
    div.className = "card-1 book-item";
    div.style.cursor = "pointer";

    const capituloCompleto = (titulosBrutos[index] || `Capítulo ${index + 1}`) + "\n" + conteudo;

    // Verifica se foi concluído
    const isConcluido = concluidos.includes(capituloCompleto);

    div.textContent = titulosBrutos[index] || `Capítulo ${index + 1}`;

    if (isConcluido) {
      div.classList.add("concluido");
      div.textContent += " ✅";
    }

    div.addEventListener("click", () => {
      localStorage.setItem("capituloSelecionado", capituloCompleto);
      window.location.href = `capitulo.html`;
    });

    container.appendChild(div);
  });
}

gerarCapitulos();
