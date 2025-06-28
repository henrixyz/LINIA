    function gerarCapitulos() {
    const texto = localStorage.getItem("textoCompleto");
    if (!texto) {
      document.getElementById("capitulosContainer").textContent = "Nenhum texto carregado.";
      return;
    }

    const capitulos = texto.split(/cap[ií]tulo\s+\d+/i).filter(t => t.trim() !== "");

    const container = document.getElementById("capitulosContainer");
    capitulos.forEach((conteudo, index) => {
      const div = document.createElement("div");
      div.className = "card-1";
      div.textContent = `Capítulo ${index + 1}`;
      div.style.cursor = "pointer";

      div.addEventListener("click", () => {
        localStorage.setItem("capituloSelecionado", conteudo);
        window.location.href = `capitulo.html`;
      });

      container.appendChild(div);
    });
  }

  gerarCapitulos();