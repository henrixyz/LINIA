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

    // RegEx para capturar: "Capítulo 1", "Capítulo I", "Capítulo dez" (numérico, romano ou por extenso)
    const regex = /(cap[ií]tulo\s+(?:\d+|[ivxlcdm]+|(?:um|dois|três|quatro|cinco|seis|sete|oito|nove|dez|onze|doze|treze|catorze|quatorze|quinze|dezesseis|dezessete|dezoito|dezenove|vinte|trinta|quarenta|cinquenta|sessenta|setenta|oitenta|noventa|cem|cento|duzentos|trezentos|quatrocentos|quinhentos|seiscentos|setecentos|oitocentos|novecentos|mil)(?:\s+e\s+(?:um|dois|três|quatro|cinco|seis|sete|oito|nove))?))/gi;

    const testRegex = new RegExp(regex.source, 'i'); // versão SEM a flag "g" para o teste
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

    // Se a primeira parte NÃO for título de capítulo, trata como prefácio
    if (!testRegex.test(partes[0].toLowerCase())) {
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

    // Geração dos demais capítulos
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

    // Atualiza a barra de progresso
    const progresso = totalTexto === 0 ? 0 : (lidoTexto / totalTexto) * 100;
    const progressBar = document.getElementById("progressBar");
    progressBar.style.width = `${progresso}%`;
  }

  gerarCapitulos();
