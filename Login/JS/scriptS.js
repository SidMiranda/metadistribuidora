const form = document.getElementById("registerForm");

/* =========================
   CUSTOM SELECT (DDI)
========================= */
const customSelect = document.getElementById("ddiSelect");
const selected = customSelect.querySelector(".selected");
const options = customSelect.querySelectorAll(".options li");

customSelect.addEventListener("click", (e) => {
  e.stopPropagation();
  customSelect.classList.toggle("open");
});

options.forEach(option => {
  option.addEventListener("click", () => {
    selected.textContent = option.textContent;
    customSelect.classList.remove("open");
  });
});

document.addEventListener("click", () => {
  customSelect.classList.remove("open");
});

/* =========================
   PHONE FORMAT
========================= */
const phoneInput = document.getElementById("phone");

phoneInput.addEventListener("input", () => {
  let value = phoneInput.value.replace(/\D/g, "");

  if (value.length > 11) value = value.slice(0, 11);

  if (value.length > 6) {
    phoneInput.value = value.replace(
      /(\d{2})(\d{5})(\d{0,4})/,
      "($1) $2-$3"
    );
  } else if (value.length > 2) {
    phoneInput.value = value.replace(
      /(\d{2})(\d{0,5})/,
      "($1) $2"
    );
  } else {
    phoneInput.value = value;
  }
});

/* =========================
   FORM VALIDATION (FIXED)
========================= */
form.addEventListener("submit", (e) => {
  e.preventDefault();
  clearErrors();

  let valid = true;

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const password = document.getElementById("password");
  const confirm = document.getElementById("confirm");

  /* NAME */
  if (name.value.trim().length < 3) {
    setError(name);
    valid = false;
  }

  /* EMAIL */
  if (!/^\S+@\S+\.\S+$/.test(email.value)) {
    setError(email);
    valid = false;
  }

  /* PHONE */
  if (phone.value.replace(/\D/g, "").length < 10) {
    setError(phone);
    valid = false;
  }

  /* PASSWORD */
  if (password.value.length < 6) {
    setError(password);
    valid = false;
  }

  /* CONFIRM PASSWORD */
  if (confirm.value !== password.value || !confirm.value) {
    setError(confirm);
    valid = false;
  }

  if (valid) {
    alert("Cadastro ilustrativo realizado com sucesso!");
    form.reset();
  }
});

/* =========================
   ERROR HANDLING
========================= */
function setError(input) {
  let group = input.closest(".input-group");
  if (group) {
    group.classList.add("invalid");
  }
}

function clearErrors() {
  document.querySelectorAll(".input-group").forEach(group => {
    group.classList.remove("invalid");
  });
}

document.getElementById("submitBtn").addEventListener("click", () => {
  form.dispatchEvent(new Event("submit"));
});
