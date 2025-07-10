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
            capa: "../assets/img/caps/o-alienista.png"
        },
        {
            titulo: "Memórias Póstumas",
            autor: "Machado de Assis",
            capa: "../assets/img/caps/memorias-postumas.jpg"
        },
        {
            titulo: "A Metamorfose",
            autor: "Franz Kafka",
            capa: "../assets/img/caps/a-metamorfose.png"
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

      div.addEventListener("click", () => {
            alert(`Você escolheu: ${livro.titulo}`);
            // Aqui você pode salvar no localStorage ou carregar o conteúdo
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