// ============================================================
// Raízes do Nordeste — Protótipo Front-End (Opção B)
// Vanilla JS, dados mockados, sem processamento real de pagamento.
// ============================================================

const state = {
  unitId: UNITS[0].id,
  cart: {},               // { productId: qty }
  coupon: null,           // { code, discount }
  lgpdFidelidade: false,
  termsAccepted: false,
  identifyMethod: "login", // "login" | "guest"
  pickupMethod: "balcao",
  user: null,             // logado ou null
  payMethod: "pix",
  currentView: "cardapio",
  activeCategory: "Todos",
  lastOrder: null,
};

const fmt = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// Helper defensivo: garante compatibilidade com navegadores mais antigos
// eventualmente usados em totens de loja.
function each(nodeList, fn) {
  for (let i = 0; i < nodeList.length; i++) fn(nodeList[i], i);
}

// ---------------- NAVEGAÇÃO ----------------
function goto(view) {
  each(document.querySelectorAll(".view"), (el) => (el.hidden = el.dataset.view !== view));
  each(document.querySelectorAll(".tabbar__item, .topnav__item"), (el) =>
    el.classList.toggle("is-active", el.dataset.goto === view)
  );
  state.currentView = view;
  if (view === "carrinho") renderCart();
  if (view === "perfil") renderPerfil();
  window.scrollTo(0, 0);
}

document.addEventListener("click", (e) => {
  const gotoBtn = e.target.closest("[data-goto]");
  if (gotoBtn) goto(gotoBtn.dataset.goto);
});

// ---------------- TOAST ----------------
let toastTimer = null;
function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (el.hidden = true), 2200);
}

// ---------------- UNIDADE ----------------
function renderUnitPicker() {
  const unit = UNITS.find((u) => u.id === state.unitId);
  document.getElementById("unitPickerValue").textContent = unit.name;
  const list = document.getElementById("unitList");
  list.innerHTML = UNITS.map(
    (u) => `
    <li>
      <button data-unit="${u.id}" class="${u.id === state.unitId ? "is-selected" : ""}">
        <span>${u.name}<small>Cozinha ${u.kitchen === "completa" ? "completa" : "reduzida"}</small></span>
        ${u.id === state.unitId ? "✓" : ""}
      </button>
    </li>`
  ).join("");
}

document.getElementById("unitPicker").addEventListener("click", () => {
  document.getElementById("unitBackdrop").hidden = false;
  document.getElementById("unitSheet").hidden = false;
});
document.getElementById("unitBackdrop").addEventListener("click", closeSheet);
function closeSheet() {
  document.getElementById("unitBackdrop").hidden = true;
  document.getElementById("unitSheet").hidden = true;
}
document.getElementById("unitList").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-unit]");
  if (!btn) return;
  const newUnit = btn.dataset.unit;
  if (newUnit !== state.unitId) {
    state.unitId = newUnit;
    state.cart = {}; // regra: cardápio (e carrinho) é por unidade
    toast("Unidade alterada — carrinho reiniciado");
  }
  closeSheet();
  renderUnitPicker();
  renderMenu();
  updateCartBadge();
});

// ---------------- CARDÁPIO ----------------
function menuForUnit() {
  return MENU.filter((p) => p.availableIn.includes(state.unitId));
}

function renderCategoryChips() {
  const cats = ["Todos", ...new Set(menuForUnit().map((p) => p.category))];
  const el = document.getElementById("categoryChips");
  el.innerHTML = cats
    .map((c) => `<button class="chip ${c === state.activeCategory ? "is-active" : ""}" data-cat="${c}">${c}</button>`)
    .join("");
}
document.getElementById("categoryChips").addEventListener("click", (e) => {
  const chip = e.target.closest("[data-cat]");
  if (!chip) return;
  state.activeCategory = chip.dataset.cat;
  renderCategoryChips();
  renderMenu();
});

document.getElementById("searchInput").addEventListener("input", renderMenu);

function renderMenu() {
  const term = document.getElementById("searchInput").value.trim().toLowerCase();
  let items = menuForUnit();
  if (state.activeCategory !== "Todos") items = items.filter((p) => p.category === state.activeCategory);
  if (term) items = items.filter((p) => p.name.toLowerCase().includes(term));

  const list = document.getElementById("productList");
  if (items.length === 0) {
    list.innerHTML = `<p class="empty-state__text">Nenhum item encontrado para esta unidade.</p>`;
    return;
  }

  list.innerHTML = items
    .map((p) => {
      const qty = state.cart[p.id] || 0;
      const initials = p.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
      return `
      <article class="product-card">
        <div class="product-card__thumb">${initials}</div>
        <div class="product-card__body">
          <div class="product-card__top">
            <p class="product-card__name">${p.name}</p>
            <span class="product-card__price">${fmt(p.price)}</span>
          </div>
          <p class="product-card__desc">${p.desc}</p>
          <div class="product-card__foot">
            ${p.seasonal ? `<span class="seasonal-tag">Edição junina</span>` : `<span></span>`}
            <div class="qty-stepper" data-id="${p.id}">
              ${
                qty === 0
                  ? `<button class="add-btn" data-action="inc">Adicionar</button>`
                  : `<button data-action="dec">–</button><span>${qty}</span><button data-action="inc">+</button>`
              }
            </div>
          </div>
        </div>
      </article>`;
    })
    .join("");
}

document.getElementById("productList").addEventListener("click", (e) => {
  const stepper = e.target.closest(".qty-stepper");
  if (!stepper) return;
  const id = stepper.dataset.id;
  const actionBtn = e.target.closest("button");
  const action = actionBtn ? actionBtn.dataset.action : null;
  if (!action) return;
  const current = state.cart[id] || 0;
  if (action === "inc") state.cart[id] = current + 1;
  if (action === "dec") state.cart[id] = Math.max(0, current - 1);
  if (state.cart[id] === 0) delete state.cart[id];
  renderMenu();
  updateCartBadge();
});

function updateCartBadge() {
  const count = Object.keys(state.cart).reduce((a, k) => a + state.cart[k], 0);
  ["cartBadge", "cartBadgeTop"].forEach(function (id) {
    const badge = document.getElementById(id);
    if (!badge) return;
    badge.hidden = count === 0;
    badge.textContent = count;
  });
}

// ---------------- CARRINHO ----------------
function cartItems() {
  return Object.entries(state.cart).map(([id, qty]) => {
    const product = MENU.find((p) => p.id === id);
    return Object.assign({}, product, { qty: qty, lineTotal: product.price * qty });
  });
}

function subtotal() {
  return cartItems().reduce((sum, i) => sum + i.lineTotal, 0);
}

function discountValue() {
  if (!state.coupon) return 0;
  return Math.min(subtotal(), state.coupon.discount);
}

function renderCart() {
  const items = cartItems();
  document.getElementById("cartEmpty").hidden = items.length > 0;
  document.getElementById("cartContent").hidden = items.length === 0;
  if (items.length === 0) return;

  document.getElementById("cartList").innerHTML = items
    .map(
      (i) => `
      <li class="cart-item">
        <div>
          <p class="cart-item__name">${i.name}</p>
          <p class="cart-item__sub">${i.qty} × ${fmt(i.price)}</p>
        </div>
        <div class="cart-item__right">
          <strong>${fmt(i.lineTotal)}</strong>
        </div>
      </li>`
    )
    .join("");

  // Identificação
  const idRow = document.getElementById("identifyRow");
  idRow.innerHTML = `
    <label class="option-row ${state.identifyMethod === "login" ? "is-selected" : ""}">
      <input type="radio" name="identify" value="login" ${state.identifyMethod === "login" ? "checked" : ""}>
      ${state.user ? `Continuar como ${state.user.name}` : "Fazer login / cadastro rápido"}
    </label>
    <label class="option-row ${state.identifyMethod === "guest" ? "is-selected" : ""}">
      <input type="radio" name="identify" value="guest" ${state.identifyMethod === "guest" ? "checked" : ""}>
      Continuar como convidado (sem coletar dados pessoais)
    </label>`;

  // Retirada
  const pickupRow = document.getElementById("pickupRow");
  const methods = [
    ["balcao", "Retirar no balcão"],
    ["totem", "Retirar no totem"],
    ["pickup", "Pick-up rápido"],
  ];
  pickupRow.innerHTML = methods
    .map(
      ([val, label]) => `
    <label class="option-row ${state.pickupMethod === val ? "is-selected" : ""}">
      <input type="radio" name="pickup" value="${val}" ${state.pickupMethod === val ? "checked" : ""}>
      ${label}
    </label>`
    )
    .join("");

  renderSummary();
}

document.getElementById("identifyRow").addEventListener("change", (e) => {
  state.identifyMethod = e.target.value;
  renderCart();
});
document.getElementById("pickupRow").addEventListener("change", (e) => {
  state.pickupMethod = e.target.value;
  renderCart();
});

function renderSummary() {
  document.getElementById("sumSubtotal").textContent = fmt(subtotal());
  const disc = discountValue();
  document.getElementById("sumDiscountLine").hidden = disc === 0;
  document.getElementById("sumDiscount").textContent = "- " + fmt(disc);
  document.getElementById("sumTotal").textContent = fmt(Math.max(0, subtotal() - disc));
}

document.getElementById("applyCoupon").addEventListener("click", () => {
  const code = document.getElementById("couponInput").value.trim().toUpperCase();
  const note = document.getElementById("couponNote");
  if (code === "BEMVINDO10") {
    state.coupon = { code, discount: subtotal() * 0.1 };
    note.textContent = "Cupom aplicado: 10% de desconto.";
  } else if (code === "PONTOS" && state.user) {
    state.coupon = { code, discount: Math.min(15, subtotal()) };
    note.textContent = "Pontos de fidelidade resgatados: R$ 15,00 de desconto.";
  } else {
    state.coupon = null;
    note.textContent = code ? "Cupom inválido para esta unidade/pedido." : "";
  }
  renderSummary();
});

document.getElementById("lgpdConsent").addEventListener("change", (e) => {
  state.lgpdFidelidade = e.target.checked;
});
document.getElementById("termsConsent").addEventListener("change", (e) => {
  state.termsAccepted = e.target.checked;
});
document.getElementById("openPrivacy").addEventListener("click", (e) => {
  e.preventDefault();
  toast("Política de Privacidade (conteúdo de exemplo para fins do protótipo).");
});

document.getElementById("goToPaymentBtn").addEventListener("click", () => {
  if (cartItems().length === 0) return toast("Adicione itens ao carrinho.");
  if (!state.termsAccepted) return toast("É necessário aceitar os Termos de Uso para continuar.");
  if (state.identifyMethod === "login" && !state.user) {
    toast("Faça login no Perfil ou escolha continuar como convidado.");
    return;
  }
  document.getElementById("payTotal").textContent = fmt(Math.max(0, subtotal() - discountValue()));
  goto("pagamento");
});

// ---------------- PAGAMENTO (MOCK) ----------------
function renderPayMethods() {
  const methods = [
    ["pix", "Pix"],
    ["credito", "Cartão de crédito"],
    ["debito", "Cartão de débito"],
  ];
  document.getElementById("payMethods").innerHTML = methods
    .map(
      ([val, label]) => `
    <label class="option-row ${state.payMethod === val ? "is-selected" : ""}">
      <input type="radio" name="paymethod" value="${val}" ${state.payMethod === val ? "checked" : ""}>
      ${label}
    </label>`
    )
    .join("");
}
document.getElementById("payMethods").addEventListener("change", (e) => {
  state.payMethod = e.target.value;
  renderPayMethods();
});

document.getElementById("confirmPaymentBtn").addEventListener("click", () => {
  document.getElementById("confirmPaymentBtn").hidden = true;
  document.getElementById("payProcessing").hidden = false;

  // Simula chamada ao serviço de pagamento externo (2s)
  setTimeout(() => {
    const approved = Math.random() > 0.15; // ~85% de aprovação simulada
    document.getElementById("payProcessing").hidden = true;
    document.getElementById("confirmPaymentBtn").hidden = false;

    if (approved) {
      finalizeOrder(true);
      goto("status");
    } else {
      toast("Pagamento recusado pelo serviço externo. Tente novamente.");
    }
  }, 1800);
});

// ---------------- STATUS DO PEDIDO ----------------
function finalizeOrder(approved) {
  const total = Math.max(0, subtotal() - discountValue());
  const points = Math.floor(total);
  state.lastOrder = {
    number: Math.floor(1000 + Math.random() * 9000),
    unit: UNITS.find((u) => u.id === state.unitId).name,
    total,
    points,
    approved,
    createdAt: Date.now(),
  };
  if (state.user) state.user.points += points;
  state.cart = {};
  updateCartBadge();
  renderStatusView();
  advanceOrderTimeline();
}

function renderStatusView() {
  const order = state.lastOrder;
  if (!order) return;
  document.getElementById("orderNumber").textContent = "#" + order.number;
  document.getElementById("statusBanner").textContent = order.approved
    ? "Pagamento aprovado"
    : "Pagamento recusado";
  document.getElementById("statusBanner").classList.toggle("is-error", !order.approved);
  document.getElementById("statusUnit").textContent = order.unit;
  document.getElementById("statusEta").textContent = "8 a 12 minutos";
  document.getElementById("pointsEarned").hidden = !order.approved;
  document.getElementById("pointsAmount").textContent = order.points;

  each(document.querySelectorAll(".timeline__step"), (el) => el.classList.remove("is-done", "is-current"));
  document.querySelector('[data-step="recebido"]').classList.add("is-done");
}

function advanceOrderTimeline() {
  const steps = ["recebido", "preparo", "pronto"];
  let i = 0;
  const el = (s) => document.querySelector(`[data-step="${s}"]`);
  el(steps[0]).classList.add("is-current");
  el(steps[0]).classList.remove("is-done");

  const tick = () => {
    el(steps[i]).classList.remove("is-current");
    el(steps[i]).classList.add("is-done");
    i++;
    if (i < steps.length) {
      el(steps[i]).classList.add("is-current");
      setTimeout(tick, 3500);
    }
  };
  setTimeout(tick, 3500);
}

// ---------------- PERFIL / LOGIN ----------------
function renderPerfil() {
  const logged = !!state.user;
  document.getElementById("perfilLogged").hidden = !logged;
  document.getElementById("perfilGuest").hidden = logged;
  if (!logged) return;
  document.getElementById("profileAvatar").textContent = state.user.name[0].toUpperCase();
  document.getElementById("profileName").textContent = state.user.name;
  document.getElementById("profileEmail").textContent = state.user.email;
  document.getElementById("profilePoints").textContent = state.user.points;
  document.getElementById("lgpdConsentProfile").checked = state.lgpdFidelidade;
}

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("loginName").value.trim();
  const email = document.getElementById("loginEmail").value.trim();
  if (!name || !email) return;
  state.user = { name, email, points: MOCK_USER.points };
  state.identifyMethod = "login";
  toast(`Bem-vindo(a), ${name}!`);
  renderPerfil();
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  state.user = null;
  renderPerfil();
});

document.getElementById("lgpdConsentProfile").addEventListener("change", (e) => {
  state.lgpdFidelidade = e.target.checked;
  document.getElementById("lgpdConsent").checked = e.target.checked;
});

document.getElementById("profileBtn").addEventListener("click", () => goto("perfil"));

// ---------------- INIT ----------------
function init() {
  renderUnitPicker();
  renderCategoryChips();
  renderMenu();
  renderPayMethods();
  updateCartBadge();
  goto("cardapio");
}
init();
