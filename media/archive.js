/* ============================================================
   Melina — Archive scroll engine.
   One requestAnimationFrame loop maps window.scrollY onto a fixed
   stage: a black panel slides up, the gallery scrolls through it,
   each card scales in/out, then a light overlay + "view" close it.
   Plus a desktop cursor-reveal between the two hero looks.
   Pure vanilla — no GSAP/Lenis needed. Honours reduced-motion.
   ============================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var spacer  = document.getElementById('scroll-spacer');
  var canvas  = document.getElementById('main-canvas');
  var panel   = document.getElementById('black-panel');
  var inner   = panel && panel.querySelector('.bp-inner');
  var overlay = document.getElementById('outro-overlay');
  var info    = document.getElementById('outro-info');
  var buy     = document.getElementById('outro-buy');
  var footer  = document.getElementById('outro-footer');
  var cursor  = document.getElementById('cursor');
  var sym     = document.getElementById('circle-symbol');
  var heroA   = canvas && canvas.querySelector('[data-hero="a"]');
  var heroB   = canvas && canvas.querySelector('[data-hero="b"]');
  var cards   = [].slice.call(document.querySelectorAll('.bp-card'));
  if (!spacer || !panel || !inner) return;

  var vh = 0, maxScroll = 0, outroOffset = 166, raf = 0;

  function measure() {
    vh = window.innerHeight;
    // scrollHeight of the gallery wrap (aspect-ratio cells give height pre-load)
    maxScroll = Math.max(0, inner.scrollHeight - vh);
    spacer.style.height = (vh + maxScroll + 2 * vh) + 'px';
    outroOffset = parseFloat(info && info.getAttribute('data-outro-offset')) || 166;
    // transform-origin toward viewport centre (the "scatter pull")
    var cx = window.innerWidth / 2;
    for (var i = 0; i < cards.length; i++) {
      var r = cards[i].getBoundingClientRect();
      cards[i].style.transformOrigin = (r.left + r.width / 2 < cx) ? 'right bottom' : 'left bottom';
    }
  }

  function scaleCards() {
    for (var i = 0; i < cards.length; i++) {
      var r = cards[i].getBoundingClientRect();
      var s;
      if (r.bottom <= 0 || r.top >= vh) {
        s = 0;
      } else {
        var enter = Math.min(1, (vh - r.top) / (vh * 0.6));   // scale up as it enters
        var exit  = Math.min(1, r.bottom / (vh * 0.4));       // scale down as it exits the top
        s = Math.max(0, Math.min(enter, exit));
      }
      cards[i].style.transform = 'scale(' + s.toFixed(3) + ')';
    }
  }

  function setOutro(p) {
    if (overlay) overlay.style.opacity = p;
    if (info)    info.style.transform = 'translateY(' + (-p * outroOffset) + 'px)';
    if (buy)     buy.style.transform = 'scale(' + p + ')';
    if (footer)  footer.style.opacity = p;
  }

  function frame() {
    var y = window.scrollY || window.pageYOffset;
    if (y <= vh) {                                   // Phase 1 — panel rises over the hero
      panel.style.transform = 'translateY(' + (vh - y) + 'px)';
      inner.style.transform = 'translateY(0px)';
      setOutro(0);
    } else if (y <= vh + maxScroll) {                // Phase 2 — gallery scrolls through fixed panel
      panel.style.transform = 'translateY(0px)';
      inner.style.transform = 'translateY(' + (-(y - vh)) + 'px)';
      setOutro(0);
    } else {                                         // Outro — light overlay + view button
      panel.style.transform = 'translateY(0px)';
      inner.style.transform = 'translateY(' + (-maxScroll) + 'px)';
      setOutro(Math.max(0, Math.min(1, (y - vh - maxScroll) / (vh - 100))));
    }
    scaleCards();
    if (canvas) canvas.style.visibility = y > vh ? 'hidden' : 'visible';  // free the hero past phase 1
    raf = requestAnimationFrame(frame);
  }

  /* ---- hero cursor reveal (desktop): move left/right to reveal one of the two looks ---- */
  var active = 'a';   // A (light) shown by default
  function setActive(side) {
    if (side === active) return;
    active = side;
    if (heroA) heroA.classList.toggle('is-active', side === 'a');
    if (heroB) heroB.classList.toggle('is-active', side === 'b');
  }
  function onMove(e) {
    if (cursor) { cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; }
    if (reduce) return;
    var w = window.innerWidth, dx = e.clientX - w / 2, dz = Math.max(30, w * 0.05);
    if (Math.abs(dx) <= dz) return;                 // dead zone: hold current (no flicker at centre)
    setActive(dx < 0 ? 'b' : 'a');                  // cursor left → reveal B; right → reveal A
    var img = active === 'a' ? heroA : heroB;
    if (img) img.style.transform = 'scale(1.06) translateX(' + (dx / w * -3).toFixed(2) + '%)';
  }

  /* ---- circle symbol randomises on scroll (throttled ~80ms) ---- */
  var SYMS = ['8', '$', '^^', '%', '/'], lastSym = 0;
  function randSym() {
    var now = (window.performance && performance.now) ? performance.now() : +new Date();
    if (now - lastSym < 80) return;
    lastSym = now;
    if (sym) sym.textContent = SYMS[Math.floor(Math.random() * SYMS.length)];
  }

  function init() {
    measure();
    window.addEventListener('resize', measure, { passive: true });
    window.addEventListener('load', measure);          // re-measure once images/fonts settle
    window.addEventListener('scroll', randSym, { passive: true });

    var desktop = window.matchMedia('(min-width: 1024px)').matches;
    if (desktop) {
      window.addEventListener('mousemove', onMove, { passive: true });
    } else if (!reduce && heroA && heroB) {
      // touch: gently alternate the two hero looks
      setInterval(function () { setActive(active === 'a' ? 'b' : 'a'); }, 4200);
    }

    requestAnimationFrame(function () { document.body.classList.add('is-in'); });
    raf = requestAnimationFrame(frame);
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
