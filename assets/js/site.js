/* ============================================================
   KNIGHTS ATELIER — site.js  (shared across every page)
   Mobile nav toggle + nav cart count. No dependencies.
   ============================================================ */
(function () {
  'use strict';
  var doc = document;

  function navToggle() {
    var btn = doc.querySelector('.nav__toggle');
    var links = doc.getElementById('nav-links');
    if (!btn || !links) return;
    var close = function () { btn.setAttribute('aria-expanded', 'false'); links.classList.remove('is-open'); };
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      links.classList.toggle('is-open', !open);
    });
    links.addEventListener('click', function (e) { if (e.target.tagName === 'A') close(); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  function cartCount() {
    var el = doc.querySelector('[data-cart-count]');
    if (!el) return;
    try { el.textContent = (JSON.parse(localStorage.getItem('ka_cart') || '{}').count) || 0; } catch (e) {}
  }

  function init() { navToggle(); cartCount(); }
  if (doc.readyState !== 'loading') init();
  else doc.addEventListener('DOMContentLoaded', init);
  window.addEventListener('ka:cart', cartCount);   // shop.js dispatches this after cart changes
})();
