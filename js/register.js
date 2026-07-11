/* =========================================================
   REGISTER.JS - Modal y página de registro
========================================================= */

document.addEventListener("click", e => {
  // Open register
  if(e.target.closest("#mobileRegister") || e.target.closest("[data-open-register]")){
    if(typeof closeModal === "function") closeModal("loginModal");
    openModal("registerModal");
    return;
  }
  // Open login from register
  if(e.target.closest("[data-open-login]")){
    closeModal("registerModal");
    openModal("loginModal");
    return;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Register modal form
  const registerForm = document.getElementById("registerForm");
  if(registerForm){
    registerForm.addEventListener("submit", e => {
      e.preventDefault();
      const name = e.target.querySelector("input[type=text]").value;
      const email = e.target.querySelectorAll("input[type=email]")[0].value;
      user = { email, name };
      saveUser();
      closeModal("registerModal");
      toast(`Cuenta creada. ¡Hola ${name}!`, "success");
      if(window.location.pathname.includes("register.html")){
        setTimeout(() => window.location.href = "index.html", 800);
      }
    });
  }

  // Register page standalone form
  const registerPageForm = document.getElementById("registerPageForm");
  if(registerPageForm){
    registerPageForm.addEventListener("submit", e => {
      e.preventDefault();
      const name = e.target.querySelector("input[type=text]").value;
      const email = e.target.querySelector("input[type=email]").value;
      user = { email, name };
      saveUser();
      toast(`Cuenta creada. ¡Hola ${name}!`, "success");
      setTimeout(() => window.location.href = "index.html", 800);
    });
  }

  // Switch to login
  const openLog = document.getElementById("openLogin");
  if(openLog){
    openLog.addEventListener("click", e => {
      e.preventDefault();
      window.location.href = "login.html";
    });
  }
});
