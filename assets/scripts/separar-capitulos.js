function gerarCapitulos() {
  const texto = localStorage.getItem("textoCompleto");
  if (!texto) {
    document.getElementById("capitulosContainer").textContent = "Nenhum texto carregado.";
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const destinoCapitulo = urlParams.get("proximo") || "capitulo-normal";

  const capitulosBrutos = texto.split(/cap[ií]tulo\s+\d+/i);
  const titulosBrutos = texto.match(/cap[ií]tulo\s+\d+/gi) || [];
  const concluidos = JSON.parse(localStorage.getItem("capitulosConcluidos") || "[]");

  const container = document.getElementById("capitulosContainer");
  container.innerHTML = '';

  if (capitulosBrutos[0].trim() !== "") {
    const prefacioDiv = document.createElement("div");
    prefacioDiv.className = "card-1 book-item";
    prefacioDiv.style.cursor = "pointer";

    const prefacioConteudo = capitulosBrutos[0].trim();
    const prefacioTitulo = "Prefácio";

    const isConcluidoPrefacio = concluidos.some(c => c.includes(prefacioTitulo));
    prefacioDiv.textContent = prefacioTitulo + (isConcluidoPrefacio ? " ✅" : "");

    prefacioDiv.addEventListener("click", () => {
      localStorage.setItem("capituloSelecionado", prefacioTitulo + "\n" + prefacioConteudo);
      window.location.href = `${destinoCapitulo}.html`;
    });

    container.appendChild(prefacioDiv);
  }

  for (let i = 1; i < capitulosBrutos.length; i++) {
    const div = document.createElement("div");
    div.className = "card-1 book-item";
    div.style.cursor = "pointer";

    const capituloTitulo = titulosBrutos[i - 1] || `Capítulo ${i}`;
    const capituloCompleto = capituloTitulo + "\n" + capitulosBrutos[i];
    const isConcluido = concluidos.includes(capituloCompleto);

    div.textContent = capituloTitulo + (isConcluido ? " ✅" : "");

    div.addEventListener("click", () => {
      localStorage.setItem("capituloSelecionado", capituloCompleto);
      window.location.href = `${destinoCapitulo}.html`;
    });

    container.appendChild(div);
  }
}

gerarCapitulos();

