function handleFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function(e) {
    const text = e.target.result;
    localStorage.setItem("textoCompleto", text);

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
};

    reader.readAsText(file);
}