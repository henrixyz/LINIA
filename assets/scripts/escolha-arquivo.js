function handleFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function(e) {
    const text = e.target.result;
    localStorage.setItem("textoCompleto", text);

    // 👉 Recupera o parâmetro 'proximo' da URL
    const urlParams = new URLSearchParams(window.location.search);
    const destino = urlParams.get("proximo");

    // 👉 Monta o redirecionamento dinâmico
    if (destino === "leia-agora") {
      window.location.href = "capitulos.html?proximo=capitulo";
    } else if (destino === "a") {
      window.location.href = "separar-capitulos.html?proximo=analise";
    } else if (destino === "validador") {
      window.location.href = "separar-capitulos.html?proximo=validador";
    } else if (destino === "resumo") {
      window.location.href = "separar-capitulos.html?proximo=resumo";
    } else {
      // Fallback (caso o parâmetro não exista)
      window.location.href = "separar-capitulos.html";
    }
  };

  reader.readAsText(file);
}