document.addEventListener("DOMContentLoaded", () => {
  const login = document.querySelector(".button-login");
  const gitHub = document.querySelector(".button-gitHub");
  const form = document.getElementById("loginForm");

  // Función que maneja el evento submit del formulario
  const submit = (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => (obj[key] = value));
    fetch("https://proyecto-final-backend-production.up.railway.app/api/session/login", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((result) => {
      if (result.status === 200) {
        window.location.replace("https://proyecto-final-backend-production.up.railway.app/api/products/pages/1");
      } else if (result.status === 401) {
        alert("Credenciales inválidas o erróneas");
      }
    });
  };

  // Vincular la función al evento click del botón de login
  login.addEventListener("click", submit);

  gitHub.addEventListener("click", function (event) {
    event.preventDefault(); // Esto evita el comportamiento predeterminado del botón (enviar formulario)
    window.location.href = "/github/login"; // Redirige a la URL deseada al hacer clic en el botón
  });
});
