function handleFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
      const text = e.target.result;
      // Salva o texto inteiro no localStorage
      localStorage.setItem("textoCompleto", text);
      // Redireciona
      window.location.href = "capitulos.html";
    };
    reader.readAsText(file);
  }