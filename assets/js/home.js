/* ============================================================
   KNIGHTS ATELIER — home.js
   - Anime.js: one-time load reveal (wordmark letters + rising lines).
   - GSAP ScrollTrigger: the stacking "recede + overshadow" (desktop only,
     via gsap.matchMedia so it sets up/tears down cleanly across breakpoints).
   - Mobile nav toggle (native <button>, aria-expanded).
   - Content is visible without JS AND if this script fails: hiding is done
     in JS just before animating, never gated in CSS.
   ============================================================ */
(function () {
  'use strict';
  var doc = document;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Anime.js load reveal (hide-then-reveal happens here, not in CSS) ---- */
  function loadReveal() {
    if (reduce || !window.anime) return;               // leave everything visible
    var rise = doc.querySelectorAll('[data-rise]');
    var wm = doc.querySelector('[data-letters]');
    rise.forEach(function (el) { el.style.opacity = 0; });
    if (wm) {
      var text = wm.textContent.trim();
      wm.setAttribute('aria-label', text);             // keep the word readable to screen readers
      wm.innerHTML = text.split('').map(function (c) {
        return '<span class="ltr" style="opacity:0;will-change:transform,opacity">' + (c === ' ' ? '&nbsp;' : c) + '</span>';
      }).join('');
      var letters = wm.querySelectorAll('.ltr');
      anime({ targets: letters, translateY: ['0.7em', 0], opacity: [0, 1], easing: 'easeOutExpo',
        duration: 900, delay: anime.stagger(55),
        complete: function () { letters.forEach(function (l) { l.style.willChange = 'auto'; }); } });
    }
    anime({ targets: rise, translateY: [16, 0], opacity: [0, 1], easing: 'easeOutExpo',
      duration: 900, delay: anime.stagger(120, { start: 350 }) });
  }

  /* ---- Mobile nav toggle ---- */
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

  /* ---- GSAP stacking recede (desktop + motion; matchMedia auto-reverts on resize) ---- */
  function stack() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    gsap.matchMedia().add('(min-width: 769px) and (prefers-reduced-motion: no-preference)', function () {
      var panels = gsap.utils.toArray('.panel');
      for (var i = 0; i < panels.length - 1; i++) {
        var inner = panels[i].querySelector('.panel__inner');
        var scrim = panels[i].querySelector('.panel__scrim');
        gsap.timeline({ scrollTrigger: { trigger: panels[i + 1], start: 'top bottom', end: 'top top', scrub: true } })
          .fromTo(inner, { scale: 1 }, { scale: 0.94, ease: 'none' }, 0)
          .fromTo(scrim, { opacity: 0 }, { opacity: 0.6, ease: 'none' }, 0);
      }
      var hero = doc.querySelector('.panel--hero .wordmark');
      if (hero) gsap.to(hero, { yPercent: -8, ease: 'none',
        scrollTrigger: { trigger: '.panel--hero', start: 'top top', end: 'bottom top', scrub: true } });
    });
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }

  /* ---- Waitlist (mock; real POST swaps in via assets/js/shop.js) ---- */
  function waitlist() {
    var f = doc.querySelector('[data-waitlist]');
    if (!f) return;
    var hint = doc.getElementById('wl-hint');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = f.querySelector('input[type=email]');
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) {
        email.setAttribute('aria-invalid', 'true');
        if (hint) { hint.textContent = 'Enter a valid email address.'; hint.setAttribute('data-error', ''); }
        email.focus(); return;
      }
      email.removeAttribute('aria-invalid');
      if (hint) { hint.textContent = hint.getAttribute('data-hint-default') || ''; hint.removeAttribute('data-error'); }
      f.innerHTML = '<p class="waitlist__done" tabindex="-1" role="status">You’re on the list. We’ll write once, before the first drop.</p>';
      var done = f.querySelector('.waitlist__done');
      if (done) done.focus();
    });
  }

  /* ---- Nav cart count from shared localStorage cart ---- */
  function cartCount() {
    var el = doc.querySelector('[data-cart-count]');
    if (!el) return;
    try { el.textContent = (JSON.parse(localStorage.getItem('ka_cart') || '{}').count) || 0; } catch (e) {}
  }

  function init() { loadReveal(); navToggle(); stack(); waitlist(); cartCount(); }
  if (doc.readyState !== 'loading') init();
  else doc.addEventListener('DOMContentLoaded', init);
})();
