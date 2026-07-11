/* =========================================================
   MAIN.JS - Productos, filtros, wishlist, navegación, init
========================================================= */

/* ---------- DATA ---------- */
const PRODUCTS = [
  {id:1, name:"Vestido Primavera", cat:"vestidos", price:89.99, old:120, tag:"sale", img:"https://image.qwenlm.ai/public_source/5464824b-34b1-42b4-9ff7-767d94e66660/189f6329b-eba2-4a01-9659-e3fb23c2b9f5.png"},
  {id:2, name:"Bolso Tote Beige", cat:"accesorios", price:149.00, tag:"new", img:"https://image.qwenlm.ai/public_source/5464824b-34b1-42b4-9ff7-767d94e66660/18e62f663-922a-4ba3-9604-bb920b6abb7b.png"},
  {id:3, name:"Tacones Nude", cat:"calzado", price:129.50, tag:"new", img:"https://image.qwenlm.ai/public_source/5464824b-34b1-42b4-9ff7-767d94e66660/177d3988a-7510-4eb6-a5e6-7d92677c2c80.png"},
  {id:4, name:"Gafas Cat-Eye", cat:"accesorios", price:79.00, img:"https://image.qwenlm.ai/public_source/5464824b-34b1-42b4-9ff7-767d94e66660/19c3993bf-5ce7-4374-ba09-c75ff4fbf1fa.png"},
  {id:5, name:"Blazer Negro", cat:"abrigos", price:199.00, tag:"new", img:"https://image.qwenlm.ai/public_source/5464824b-34b1-42b4-9ff7-767d94e66660/1b526e81b-047b-4314-bef9-01623148ccff.png"},
  {id:6, name:"Collar Oro Minimal", cat:"joyeria", price:59.90, img:"https://image.qwenlm.ai/public_source/5464824b-34b1-42b4-9ff7-767d94e66660/1afae555b-d701-4dd9-bbbb-2eebf6cd6d58.png"},
  {id:7, name:"Vestido Midi Rosa", cat:"vestidos", price:95.00, old:130, tag:"sale", img:"https://image.qwenlm.ai/public_source/5464824b-34b1-42b4-9ff7-767d94e66660/189f6329b-eba2-4a01-9659-e3fb23c2b9f5.png"},
  {id:8, name:"Bolso Crossbody", cat:"accesorios", price:119.00, img:"https://image.qwenlm.ai/public_source/5464824b-34b1-42b4-9ff7-767d94e66660/18e62f663-922a-4ba3-9604-bb920b6abb7b.png"},
];

let visibleCount = 6;
let currentFilter = "all";

/* ---------- STATE (localStorage) ---------- */
const CART_KEY = "tt_cart_v1";
const USER_KEY = "tt_user_v1";
const WISH_KEY = "tt_wish_v1";

let cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
let user = JSON.parse(localStorage.getItem(USER_KEY) || "null");
let wishlist = new Set(JSON.parse(localStorage.getItem(WISH_KEY) || "[]"));

function saveCart(){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
function saveUser(){ localStorage.setItem(USER_KEY, JSON.stringify(user)); }
function saveWish(){ localStorage.setItem(WISH_KEY, JSON.stringify([...wishlist])); }

/* ---------- RENDER PRODUCTS ---------- */
function renderProducts(){
  const grid = document.getElementById("productsGrid");
  if(!grid) return;
  const filtered = currentFilter === "all" ? PRODUCTS : PRODUCTS.filter(p => p.cat === currentFilter);
  const visible = filtered.slice(0, visibleCount);
  grid.innerHTML = visible.map(p => `
    <article class="product-card">
      <div class="product-img">
        <img src="${p.img}" alt="${p.name}" loading="lazy"/>
        ${p.tag ? `<span class="product-tag ${p.tag}">${p.tag === "sale" ? "-25%" : "Nuevo"}</span>` : ""}
        <button class="product-wish ${wishlist.has(p.id)?"active":""}" data-wish="${p.id}" aria-label="Favorito">
          <svg viewBox="0 0 24 24" fill="${wishlist.has(p.id)?"currentColor":"none"}" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
      </div>
      <div class="product-info">
        <div class="product-cat">${p.cat}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-bottom">
          <div class="product-price">
            ${p.old ? `<span class="old">$${p.old.toFixed(2)}</span>`:""}
            $${p.price.toFixed(2)}
          </div>
          <button class="product-add" data-add="${p.id}" aria-label="Añadir al carrito">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
          </button>
        </div>
      </div>
    </article>
  `).join("");
  const loadMore = document.getElementById("loadMore");
  if(loadMore) loadMore.style.display = visible.length < filtered.length ? "" : "none";
}

/* ---------- TOAST ---------- */
function toast(msg, type=""){
  const wrap = document.getElementById("toastWrap");
  if(!wrap) return;
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.innerHTML = `<span>${msg}</span>`;
  wrap.appendChild(el);
  setTimeout(() => { el.style.opacity = "0"; el.style.transform = "translateX(120%)"; el.style.transition = "all .3s"; }, 2500);
  setTimeout(() => el.remove(), 2900);
}

/* ---------- NAVIGATION ---------- */
function setupNavigation(){
  document.addEventListener("click", e => {
    const navLink = e.target.closest("[data-nav]");
    if(!navLink) return;
    const target = navLink.dataset.nav;
    document.querySelectorAll(".nav a").forEach(a => a.classList.toggle("active", a.dataset.nav === target));
    if(target === "home"){
      window.scrollTo({top:0, behavior:"smooth"});
    } else {
      const el = document.getElementById(target === "productos" ? "productos" : target === "reviews" ? "reviews" : "contacto");
      if(el) el.scrollIntoView({behavior:"smooth"});
    }
    document.getElementById("mobileNav")?.classList.remove("open");
  });
  // Menu toggle
  document.addEventListener("click", e => {
    if(e.target.closest("#menuToggle")){ document.getElementById("mobileNav")?.classList.add("open"); return; }
    if(e.target.closest("#mobileClose")){ document.getElementById("mobileNav")?.classList.remove("open"); return; }
  });
}

/* ---------- FILTERS ---------- */
function setupFilters(){
  document.addEventListener("click", e => {
    const chip = e.target.closest(".filter-chip");
    if(chip){
      document.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      currentFilter = chip.dataset.filter;
      visibleCount = 6;
      renderProducts();
      return;
    }
    const catCard = e.target.closest(".cat-card");
    if(catCard){
      currentFilter = catCard.dataset.filter;
      document.querySelectorAll(".filter-chip").forEach(c => c.classList.toggle("active", c.dataset.filter === currentFilter));
      renderProducts();
      document.getElementById("productos")?.scrollIntoView({behavior:"smooth"});
      return;
    }
  });
  const loadMore = document.getElementById("loadMore");
  if(loadMore){
    loadMore.addEventListener("click", () => {
      visibleCount += 4;
      renderProducts();
    });
  }
}

/* ---------- WISHLIST ---------- */
function setupWishlist(){
  document.addEventListener("click", e => {
    const wishBtn = e.target.closest("[data-wish]");
    if(!wishBtn) return;
    const id = parseInt(wishBtn.dataset.wish);
    if(wishlist.has(id)){ wishlist.delete(id); toast("Eliminado de favoritos"); }
    else { wishlist.add(id); toast("Añadido a favoritos", "success"); }
    saveWish();
    renderProducts();
  });
}

/* ---------- FORMS ---------- */
function setupForms(){
  const contactForm = document.getElementById("contactForm");
  if(contactForm){
    contactForm.addEventListener("submit", e => {
      e.preventDefault();
      toast("Mensaje enviado. Te responderemos pronto.", "success");
      e.target.reset();
    });
  }
  const newsletterForm = document.getElementById("newsletterForm");
  if(newsletterForm){
    newsletterForm.addEventListener("submit", e => {
      e.preventDefault();
      toast("¡Suscripción exitosa! Revisa tu correo.", "success");
      e.target.reset();
    });
  }
  const searchBtn = document.getElementById("searchBtn");
  if(searchBtn){
    searchBtn.addEventListener("click", () => toast("Búsqueda próximamente disponible", ""));
  }
}

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  if(typeof updateCartUI === "function") updateCartUI();
  setupNavigation();
  setupFilters();
  setupWishlist();
  setupForms();
  if(user) console.log("Sesión activa:", user.name);
});
