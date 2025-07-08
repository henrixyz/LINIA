const eyeIcon = document.getElementById("eyeIcon");
const header = document.getElementById("header");
const hudButtons = document.getElementById("hudButtons");

const eyeOpenSrc = "../assets/img/icons8-eye-100.png";
const eyeClosedSrc = "../assets/img/icons8-closed-eye-100.png";

let eyeIsOpen = true;

eyeIcon.addEventListener("click", () => {
  eyeIsOpen = !eyeIsOpen;

  // Troca de imagem
  eyeIcon.src = eyeIsOpen ? eyeOpenSrc : eyeClosedSrc;

  // Mostra ou esconde HUD
  header.classList.toggle("hidden");
  hudButtons.classList.toggle("hidden");
});