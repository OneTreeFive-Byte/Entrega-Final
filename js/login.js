/* =========================================================
   LOGIN.JS - Modal y página de inicio de sesión
========================================================= */

/* ---------- MODAL HELPERS ---------- */
function openModal(id){ document.getElementById(id)?.classList.add("open"); }
function closeModal(id){ document.getElementById(id)?.classList.remove("open"); }

/* ---------- LOGIN MODAL EVENTS ---------- */
document.addEventListener("click", e => {
  // User button
  if(e.target.closest("#userBtn") || e.target.closest("#mobileLogin")){
    if(user) toast(`Hola, ${user.name}!`, "success");
    else openModal("loginModal");
    return;
  }
  // Open register from login
  if(e.target.closest("[data-open-register]")){
    closeModal("loginModal");
    openModal("registerModal");
    return;
  }
  // Close modal
  if(e.target.closest("[data-close]") || (e.target.classList.contains("modal-overlay") && e.target.classList.contains("open"))){
    e.target.closest(".modal-overlay")?.classList.remove("open");
    return;
  }
});

/* ---------- LOGIN FORM ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if(loginForm){
    loginForm.addEventListener("submit", e => {
      e.preventDefault();
      const email = e.target.querySelector("input[type=email]").value;
      user = { email, name: email.split("@")[0] };
      saveUser();
      closeModal("loginModal");
      toast(`¡Bienvenido, ${user.name}!`, "success");
      // Redirect if on login page
      if(window.location.pathname.includes("login.html")){
        setTimeout(() => window.location.href = "index.html", 800);
      }
    });
  }

  // Login page standalone form
  const loginPageForm = document.getElementById("loginPageForm");
  if(loginPageForm){
    loginPageForm.addEventListener("submit", e => {
      e.preventDefault();
      const email = e.target.querySelector("input[type=email]").value;
      const remember = e.target.querySelector("input[type=checkbox]")?.checked;
      user = { email, name: email.split("@")[0] };
      saveUser();
      toast(`¡Bienvenido, ${user.name}!`, "success");
      setTimeout(() => window.location.href = "index.html", 800);
    });
  }

  // Switch to register
  const openReg = document.getElementById("openRegister");
  if(openReg){
    openReg.addEventListener("click", e => {
      e.preventDefault();
      window.location.href = "register.html";
    });
  }
});
