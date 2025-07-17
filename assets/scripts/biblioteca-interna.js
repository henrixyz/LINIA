function toggleBiblioteca() {
    const container = document.getElementById("bibliotecaContainer");
    const isVisible = container.style.display === "block";

    if (isVisible) {
        container.style.display = "none";
        container.innerHTML = "";
    } else {
        container.style.display = "block";

        const livros = [
        {
            titulo: "O Alienista",
            autor: "Machado de Assis",
            capa: "../assets/img/caps/o-alienista.png",
            arquivo: "../assets/livros/txt/alienista.txt"
        },
        {
            titulo: "Cinco Minutos",
            autor: "José de Alencar",
            capa: "../assets/img/caps/cinco-minutos.png",
            arquivo: "../assets/livros/txt/memorias-postumas.txt"
        },
        {
            titulo: "A Metamorfose",
            autor: "Franz Kafka",
            capa: "../assets/img/caps/a-metamorfose.png",
            arquivo: "../assets/livros/txt/a-metamorfose.txt"
        },
        ];

        livros.forEach(livro => {
        const div = document.createElement("div");
        div.className = "livro-card";
        div.innerHTML = `
            <img src="${livro.capa}" alt="Capa do livro" class="capa-livro">
            <div class="livro-info">
                <strong>${livro.titulo}</strong>
                <span>${livro.autor}</span>
            </div>
        `;

        div.addEventListener("click", async () => {
            try {
            const response = await fetch(livro.arquivo);
            const texto = await response.text();
            localStorage.setItem("textoCompleto", texto);
            localStorage.removeItem("capituloSelecionado");

            const urlParams = new URLSearchParams(window.location.search);
            const destino = urlParams.get("proximo");

            if (destino === "leia-agora") {
                window.location.href = "capitulos.html?proximo=capitulo-normal";
            } else if (destino === "palavra") {
                window.location.href = "capitulos.html?proximo=capitulo-palavra";
            } else if (destino === "texto-narrado") {
                window.location.href = "capitulos.html?proximo=capitulo-narrado";
            } else if (destino === "modo-estudo") {
                window.location.href = "capitulos.html?proximo=capitulo-estudo";
            } else {
                window.location.href = "separar-capitulos.html";
            }
            } catch (err) {
            alert("Erro ao carregar o livro.");
            console.error(err);
            }
        });

        container.appendChild(div);
        });

        
    }

}

//trocar cor quando clicar

const card = document.querySelector('.card-2');

card.addEventListener('click', () => {
  const currentColor = getComputedStyle(card).backgroundColor;

  if (currentColor === 'rgb(246, 240, 240)') {
    card.style.backgroundColor = '#ffd600'; // amarelo
  } else {
    card.style.backgroundColor = '#f6f0f0'; // branco original
  }
});