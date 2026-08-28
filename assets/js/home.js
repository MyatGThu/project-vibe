/* ============================================================
   KNIGHTS ATELIER — home.js
   - Anime.js: one-time load reveal (wordmark letters + rising lines).
   - GSAP ScrollTrigger: the stacking "recede + overshadow" (desktop only,
     no pin/scrub of scroll position → not scroll-jacked). CSS sticky does
     the covering; GSAP only scales down + darkens the covered plate.
   - Progressive enhancement: content is visible without JS; reduced-motion
     and ≤768px fall back to a plain flowed page.
   ============================================================ */
(function () {
  'use strict';
  var doc = document;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var desktop = window.matchMedia('(min-width: 769px)').matches;

  /* ---- Anime.js load reveal ---- */
  function loadReveal() {
    var rise = doc.querySelectorAll('[data-rise]');
    var wm = doc.querySelector('[data-letters]');

    if (reduce || !window.anime) {                 // show everything, no animation
      rise.forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; });
      if (wm) wm.style.opacity = 1;
      return;
    }
    if (wm) {
      var text = wm.textContent.trim();
      wm.setAttribute('aria-label', text);         // keep the word readable to screen readers
      wm.innerHTML = text.split('').map(function (c) {
        return '<span class="ltr" style="opacity:0">' + (c === ' ' ? '&nbsp;' : c) + '</span>';
      }).join('');
      wm.style.opacity = 1;
      anime({ targets: wm.querySelectorAll('.ltr'), translateY: ['0.7em', 0], opacity: [0, 1],
        easing: 'easeOutExpo', duration: 900, delay: anime.stagger(55) });
    }
    anime({ targets: rise, translateY: [16, 0], opacity: [0, 1], easing: 'easeOutExpo',
      duration: 900, delay: anime.stagger(120, { start: 350 }) });
  }

  /* ---- GSAP stacking recede (desktop, motion allowed) ---- */
  function stack() {
    if (!desktop || reduce || !window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    var panels = gsap.utils.toArray('.panel');
    for (var i = 0; i < panels.length - 1; i++) {
      var inner = panels[i].querySelector('.panel__inner');
      var scrim = panels[i].querySelector('.panel__scrim');
      var next = panels[i + 1];
      gsap.timeline({ scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top', scrub: true } })
        .fromTo(inner, { scale: 1 }, { scale: 0.94, ease: 'none' }, 0)
        .fromTo(scrim, { opacity: 0 }, { opacity: 0.6, ease: 'none' }, 0);
    }
    var hero = doc.querySelector('.panel--hero .wordmark');
    if (hero) gsap.to(hero, { yPercent: -8, ease: 'none',
      scrollTrigger: { trigger: '.panel--hero', start: 'top top', end: 'bottom top', scrub: true } });
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }

  /* ---- Waitlist (mock; real POST swaps in via assets/js/shop.js) ---- */
  function waitlist() {
    var f = doc.querySelector('[data-waitlist]');
    if (!f) return;
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = f.querySelector('input[type=email]');
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) {
        email.setAttribute('aria-invalid', 'true'); email.focus(); return;
      }
      email.removeAttribute('aria-invalid');
      f.innerHTML = '<p class="waitlist__done">You’re on the list. We’ll write once, before the first drop.</p>';
    });
  }

  /* ---- Nav cart count from shared localStorage cart ---- */
  function cartCount() {
    var el = doc.querySelector('[data-cart-count]');
    if (!el) return;
    try { el.textContent = (JSON.parse(localStorage.getItem('ka_cart') || '{}').count) || 0; } catch (e) {}
  }

  function init() { loadReveal(); stack(); waitlist(); cartCount(); }
  if (doc.readyState !== 'loading') init();
  else doc.addEventListener('DOMContentLoaded', init);
})();
