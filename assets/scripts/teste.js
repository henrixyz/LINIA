const urlParams = new URLSearchParams(window.location.search);
const destino = urlParams.get('proximo');

if (destino === 'palavra') {
  window.location.href = '../pages/leitura.html'; // ou qualquer página correspondente
}