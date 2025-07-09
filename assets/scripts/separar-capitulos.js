function gerarCapitulos() {
  const texto = localStorage.getItem("textoCompleto");
  if (!texto) {
    document.getElementById("capitulosContainer").textContent = "Nenhum texto carregado.";
    return;
  }

  // Aqui a divisão vai incluir o texto antes do primeiro capítulo no índice 0
  const capitulosBrutos = texto.split(/cap[ií]tulo\s+\d+/i);
  const titulosBrutos = texto.match(/cap[ií]tulo\s+\d+/gi) || [];

  const concluidos = JSON.parse(localStorage.getItem("capitulosConcluidos") || "[]");

  const container = document.getElementById("capitulosContainer");
  container.innerHTML = '';

  // Se o texto antes do primeiro capítulo não for vazio, adiciona prefácio
  if (capitulosBrutos[0].trim() !== "") {
    const prefacioDiv = document.createElement("div");
    prefacioDiv.className = "card-1 book-item";
    prefacioDiv.style.cursor = "pointer";

    const prefacioConteudo = capitulosBrutos[0].trim();
    const prefacioTitulo = "Prefácio";

    // Verifica se já foi concluído
    const isConcluidoPrefacio = concluidos.some(c => c.includes(prefacioTitulo));

    prefacioDiv.textContent = prefacioTitulo + (isConcluidoPrefacio ? " ✅" : "");

    prefacioDiv.addEventListener("click", () => {
      // Salva o prefácio no localStorage com nome diferente para poder marcar concluído
      localStorage.setItem("capituloSelecionado", prefacioTitulo + "\n" + prefacioConteudo);
      window.location.href = `capitulo.html`;
    });

    container.appendChild(prefacioDiv);
  }

  // Agora cria as divs pros capítulos, lembrando que capitulosBrutos[0] é o prefácio, então os capítulos começam em 1
  for (let i = 1; i < capitulosBrutos.length; i++) {
    const div = document.createElement("div");
    div.className = "card-1 book-item";
    div.style.cursor = "pointer";

    const capituloTitulo = titulosBrutos[i - 1] || `Capítulo ${i}`;
    const capituloCompleto = capituloTitulo + "\n" + capitulosBrutos[i];

    // Verifica se foi concluído
    const isConcluido = concluidos.includes(capituloCompleto);

    div.textContent = capituloTitulo + (isConcluido ? " ✅" : "");

    div.addEventListener("click", () => {
      localStorage.setItem("capituloSelecionado", capituloCompleto);
      window.location.href = `capitulo.html`;
    });

    container.appendChild(div);
  }
}

gerarCapitulos();
