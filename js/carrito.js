/* =========================================================
   CARRITO.JS - Carrito de compras y drawer
========================================================= */

/* ---------- CART OPERATIONS ---------- */
function addToCart(id){
  const p = PRODUCTS.find(x => x.id === id);
  if(!p) return;
  const existing = cart.find(x => x.id === id);
  if(existing) existing.qty++;
  else cart.push({...p, qty:1});
  saveCart();
  updateCartUI();
  toast(`${p.name} añadido al carrito`, "success");
}

function removeFromCart(id){
  cart = cart.filter(x => x.id !== id);
  saveCart();
  updateCartUI();
}

function changeQty(id, delta){
  const item = cart.find(x => x.id === id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) removeFromCart(id);
  else { saveCart(); updateCartUI(); }
}

/* ---------- UI UPDATE ---------- */
function updateCartUI(){
  const count = cart.reduce((s,i) => s+i.qty, 0);
  const badge = document.getElementById("cartCount");
  if(badge){
    badge.textContent = count;
    badge.classList.toggle("show", count > 0);
  }
  const body = document.getElementById("cartBody");
  const foot = document.getElementById("cartFoot");
  if(!body) return;
  if(cart.length === 0){
    body.innerHTML = `
      <div class="cart-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        <p>Tu carrito está vacío</p>
        <p style="font-size:.85rem;margin-top:6px">¡Añade productos para comenzar!</p>
      </div>`;
    if(foot) foot.style.display = "none";
    return;
  }
  body.innerHTML = cart.map(i => `
    <div class="cart-item">
      <div class="cart-item-img"><img src="${i.img}" alt="${i.name}"/></div>
      <div>
        <div class="cart-item-name">${i.name}</div>
        <div class="cart-item-price">$${i.price.toFixed(2)}</div>
        <div class="qty">
          <button data-dec="${i.id}">−</button>
          <span>${i.qty}</span>
          <button data-inc="${i.id}">+</button>
        </div>
      </div>
      <button class="cart-item-remove" data-rm="${i.id}" aria-label="Eliminar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
      </button>
    </div>
  `).join("");
  if(foot) foot.style.display = "block";
  const subtotal = cart.reduce((s,i) => s + i.price*i.qty, 0);
  const shipping = subtotal >= 100 ? 0 : 9.99;
  const total = subtotal + shipping;
  const elSub = document.getElementById("cartSubtotal");
  const elShip = document.getElementById("cartShipping");
  const elTot = document.getElementById("cartTotal");
  if(elSub) elSub.textContent = `$${subtotal.toFixed(2)}`;
  if(elShip) elShip.textContent = shipping === 0 ? "Gratis" : `$${shipping.toFixed(2)}`;
  if(elTot) elTot.textContent = `$${total.toFixed(2)}`;
}

/* ---------- DRAWER ---------- */
function openCart(){
  document.getElementById("cartDrawer")?.classList.add("open");
  document.getElementById("cartOverlay")?.classList.add("open");
}
function closeCart(){
  document.getElementById("cartDrawer")?.classList.remove("open");
  document.getElementById("cartOverlay")?.classList.remove("open");
}

/* ---------- CART EVENTS ---------- */
document.addEventListener("click", e => {
  const addBtn = e.target.closest("[data-add]");
  if(addBtn){ addToCart(parseInt(addBtn.dataset.add)); return; }
  const inc = e.target.closest("[data-inc]");
  if(inc){ changeQty(parseInt(inc.dataset.inc), 1); return; }
  const dec = e.target.closest("[data-dec]");
  if(dec){ changeQty(parseInt(dec.dataset.dec), -1); return; }
  const rm = e.target.closest("[data-rm]");
  if(rm){ removeFromCart(parseInt(rm.dataset.rm)); return; }
  if(e.target.closest("#cartBtn")){ openCart(); return; }
  if(e.target.closest("#cartClose") || e.target.closest("#cartOverlay")){ closeCart(); return; }
});

/* ---------- CHECKOUT ---------- */
document.addEventListener("click", e => {
  if(!e.target.closest("#checkoutBtn")) return;
  if(!user){
    closeCart();
    if(typeof openModal === "function") openModal("loginModal");
    toast("Inicia sesión para continuar", "");
    return;
  }
  toast("¡Pedido realizado con éxito!", "success");
  cart = [];
  saveCart();
  updateCartUI();
  closeCart();
});

/* ---------- CART PAGE RENDER ---------- */
function renderCartPage(){
  const list = document.getElementById("cartPageList");
  const summary = document.getElementById("cartPageSummary");
  if(!list) return;
  if(cart.length === 0){
    list.innerHTML = `
      <div class="cart-empty" style="padding:80px 20px">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        <p style="font-size:1.1rem;margin-top:16px">Tu carrito está vacío</p>
        <p style="font-size:.9rem;margin-top:8px;color:var(--c-muted)">¡Añade productos para comenzar!</p>
        <a href="index.html" class="btn btn-primary" style="margin-top:24px">Ir a la tienda</a>
      </div>`;
    if(summary) summary.innerHTML = "";
    return;
  }
  list.innerHTML = cart.map(i => `
    <div class="cart-page-item">
      <div class="cart-page-item-img"><img src="${i.img}" alt="${i.name}"/></div>
      <div>
        <div class="cart-page-item-name">${i.name}</div>
        <div class="cart-page-item-price">$${i.price.toFixed(2)}</div>
        <div class="qty" style="margin-top:10px">
          <button data-dec="${i.id}">−</button>
          <span>${i.qty}</span>
          <button data-inc="${i.id}">+</button>
        </div>
      </div>
      <div class="cart-page-item-actions">
        <div style="font-weight:700;font-size:1.05rem">$${(i.price*i.qty).toFixed(2)}</div>
        <button class="cart-page-item-remove" data-rm="${i.id}" aria-label="Eliminar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
        </button>
      </div>
    </div>
  `).join("");
  const subtotal = cart.reduce((s,i) => s + i.price*i.qty, 0);
  const shipping = subtotal >= 100 ? 0 : 9.99;
  const total = subtotal + shipping;
  if(summary){
    summary.innerHTML = `
      <h3>Resumen del pedido</h3>
      <div class="cart-summary">
        <div class="cart-row"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
        <div class="cart-row"><span>Envío</span><span>${shipping === 0 ? "Gratis" : "$"+shipping.toFixed(2)}</span></div>
        <div class="cart-row total"><span>Total</span><span>$${total.toFixed(2)}</span></div>
      </div>
      <button class="btn btn-primary checkout-btn" id="checkoutBtn">
        Finalizar compra
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
      </button>
      <a href="index.html" class="btn btn-outline" style="width:100%;justify-content:center;margin-top:10px">Seguir comprando</a>
    `;
  }
}
