function gerarCapitulos() {
  const texto = localStorage.getItem("textoCompleto");
  const container = document.getElementById("capitulosContainer");
  container.innerHTML = '';

  if (!texto) {
    const msg = document.createElement("div");
    msg.className = "aviso-livro";
    msg.textContent = "📖 Ainda sem livro adicionado.";
    container.appendChild(msg);
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const destinoCapitulo = urlParams.get("proximo") || "capitulo-normal";

  const regex = /(cap[ií]tulo\s+(?:\d+|[ivxlcdm]+))/gi;
  const partes = texto.split(regex).filter(Boolean);

  const concluidos = JSON.parse(localStorage.getItem("capitulosConcluidos") || "[]");

  // Barra de progresso
  const barraContainer = document.createElement("div");
  barraContainer.id = "progressContainer";
  barraContainer.innerHTML = `<div id="progressBar"></div>`;
  container.appendChild(barraContainer);

  let totalTexto = 0;
  let lidoTexto = 0;

  let i = 0;
  if (!regex.test(partes[0].toLowerCase())) {
    const prefacioTitulo = "Prefácio";
    const prefacioConteudo = partes[0].trim();
    const capituloCompleto = `${prefacioTitulo}\n${prefacioConteudo}`;

    const div = document.createElement("div");
    div.className = "card-1 book-item";
    div.style.cursor = "pointer";

    const isConcluido = concluidos.includes(capituloCompleto);
    div.textContent = prefacioTitulo + (isConcluido ? " ✅" : "");

    totalTexto += capituloCompleto.length;
    if (isConcluido) lidoTexto += capituloCompleto.length;

    div.addEventListener("click", () => {
      localStorage.setItem("capituloSelecionado", capituloCompleto);
      window.location.href = `${destinoCapitulo}.html`;
    });

    container.appendChild(div);
    i = 1;
  }

  for (; i < partes.length - 1; i += 2) {
    const capituloTitulo = partes[i].trim();
    const capituloConteudo = partes[i + 1].trim();
    const capituloCompleto = `${capituloTitulo}\n${capituloConteudo}`;

    const div = document.createElement("div");
    div.className = "card-1 book-item";
    div.style.cursor = "pointer";

    const isConcluido = concluidos.includes(capituloCompleto);
    div.textContent = capituloTitulo + (isConcluido ? " ✅" : "");

    totalTexto += capituloCompleto.length;
    if (isConcluido) lidoTexto += capituloCompleto.length;

    div.addEventListener("click", () => {
      localStorage.setItem("capituloSelecionado", capituloCompleto);
      window.location.href = `${destinoCapitulo}.html`;
    });

    container.appendChild(div);
  }

  const progresso = totalTexto === 0 ? 0 : (lidoTexto / totalTexto) * 100;
  const progressBar = document.getElementById("progressBar");
  progressBar.style.width = `${progresso}%`;
}

gerarCapitulos();
