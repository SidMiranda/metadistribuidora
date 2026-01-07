// --- LOGIN ERROR ---

const form = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");
const button = document.querySelector(".login-btn");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Ativa loading
  button.classList.add("loading");

  // Simula requisição
  setTimeout(() => {
    button.classList.remove("loading");

    // Mostra erro
    errorMessage.style.display = "block";
    errorMessage.classList.remove("shake");
    void errorMessage.offsetWidth;
    errorMessage.classList.add("shake");
  }, 1500);
});


// --- IGNORE ---