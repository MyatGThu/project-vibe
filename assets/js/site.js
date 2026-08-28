/* ============================================================
   KNIGHTS ATELIER — site.js  (shared across every page)
   Mobile nav toggle + nav cart count + cart drawer. No dependencies.
   Cart data + checkout live in shop.js (window.KAShop); this is the UI.
   ============================================================ */
(function () {
  'use strict';
  var doc = document;

  /* ---- Mobile nav toggle ---- */
  function navToggle() {
    var btn = doc.querySelector('.nav__toggle');
    var links = doc.getElementById('nav-links');
    if (!btn || !links) return;
    var close = function (returnFocus) {
      btn.setAttribute('aria-expanded', 'false');
      links.classList.remove('is-open');
      if (returnFocus) btn.focus();
    };
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      links.classList.toggle('is-open', !open);
    });
    links.addEventListener('click', function (e) { if (e.target.closest('a')) close(false); });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') close(true);
    });
  }

  /* ---- Nav cart count (same-tab ka:cart event + cross-tab storage event) ---- */
  function cartCount() {
    var el = doc.querySelector('[data-cart-count]');
    if (!el) return 0;
    var n = 0;
    try { n = (JSON.parse(localStorage.getItem('ka_cart') || '{}').count) || 0; } catch (e) {}
    el.textContent = n;
    return n;
  }

  /* ---- Cart drawer ---- */
  function cart() {
    var Shop = window.KAShop;
    var trigger = doc.querySelector('.nav__cart');
    if (!Shop || !trigger) return;

    var overlay = doc.createElement('div'); overlay.className = 'cart-overlay';
    var drawer = doc.createElement('aside');
    drawer.className = 'cart-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-label', 'Cart');
    drawer.setAttribute('aria-hidden', 'true');
    drawer.innerHTML =
      '<div class="cart-drawer__head"><span class="cart-drawer__title">Cart</span>' +
      '<button class="cart-drawer__close" type="button" aria-label="Close cart">&#10005;</button></div>' +
      '<ul class="cart-drawer__lines" data-lines></ul>' +
      '<div class="cart-drawer__foot"><div class="cart-drawer__total"><span>Total</span><span data-total>$0</span></div>' +
      '<button class="btn btn--solid" type="button" data-checkout style="width:100%">Checkout</button>' +
      '<p class="cart-drawer__note" data-note></p></div>';
    doc.body.appendChild(overlay); doc.body.appendChild(drawer);

    var linesEl = drawer.querySelector('[data-lines]');
    var totalEl = drawer.querySelector('[data-total]');
    var noteEl = drawer.querySelector('[data-note]');
    var lastFocus = null;

    function money(n) { return '$' + n; }

    function render() {
      var c = Shop.getCart();
      linesEl.textContent = '';
      if (!c.lines.length) {
        var li = doc.createElement('li'); li.className = 'cart-drawer__empty';
        li.textContent = 'Your cart is empty.'; linesEl.appendChild(li);
      } else {
        c.lines.forEach(function (l) {
          var li = doc.createElement('li'); li.className = 'cart-line';
          var left = doc.createElement('div');
          var t = doc.createElement('div'); t.className = 'cart-line__title'; t.textContent = l.title;
          var m = doc.createElement('div'); m.className = 'cart-line__meta'; m.textContent = l.variant + ' × ' + l.qty;
          var rm = doc.createElement('button'); rm.type = 'button'; rm.className = 'cart-line__remove'; rm.textContent = 'Remove';
          rm.addEventListener('click', function () { Shop.remove(l.handle, l.variantId); render(); });
          left.appendChild(t); left.appendChild(m); left.appendChild(rm);
          var price = doc.createElement('div'); price.className = 'cart-line__price'; price.textContent = money(l.price * l.qty);
          li.appendChild(left); li.appendChild(price); linesEl.appendChild(li);
        });
      }
      var total = c.lines.reduce(function (s, l) { return s + l.price * l.qty; }, 0);
      totalEl.textContent = money(total);
    }

    function open() {
      lastFocus = doc.activeElement;
      render(); noteEl.textContent = '';
      overlay.classList.add('is-open'); drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      drawer.querySelector('.cart-drawer__close').focus();
    }
    function close() {
      overlay.classList.remove('is-open'); drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    trigger.addEventListener('click', function (e) { e.preventDefault(); open(); });   // no-JS: link falls back to products.html
    overlay.addEventListener('click', close);
    drawer.querySelector('.cart-drawer__close').addEventListener('click', close);
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && drawer.classList.contains('is-open')) close(); });
    drawer.querySelector('[data-checkout]').addEventListener('click', function () {
      var r = Shop.checkout();
      if (r && r.connected === false) noteEl.textContent = r.message;
    });
    window.addEventListener('ka:cart', function () { if (drawer.classList.contains('is-open')) render(); });
  }

  function init() { navToggle(); cartCount(); cart(); }
  if (doc.readyState !== 'loading') init();
  else doc.addEventListener('DOMContentLoaded', init);
  window.addEventListener('ka:cart', cartCount);
  window.addEventListener('storage', function (e) { if (e.key === 'ka_cart') cartCount(); });
})();
