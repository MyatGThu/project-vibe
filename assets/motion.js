/* ============================================================
   Te Amo — motion.js
   Lenis smooth scroll + GSAP ScrollTrigger orchestration.
   Progressive enhancement: no motion until libs load; reduced-motion fully honoured.
   ============================================================ */
(function () {
  'use strict';

  var cfg = (window.Theme && window.Theme.motion) || { smooth: true, reveal: true };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  // Wait for deferred libs (gsap/Lenis load with `defer`, may land after DOMContentLoaded).
  function waitFor(test, cb, tries) {
    tries = tries == null ? 60 : tries;
    if (test()) return cb();
    if (tries <= 0) return cb();          // give up gracefully — content stays visible
    requestAnimationFrame(function () { waitFor(test, cb, tries - 1); });
  }

  ready(function () {
    // Header scroll state works with or without libs.
    var header = document.querySelector('.header');
    if (header) {
      var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 20); };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    if (reduce) return;   // honour the user; leave everything static & visible.

    waitFor(function () { return window.gsap && window.ScrollTrigger; }, init);
  });

  function init() {
    var gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
    if (!gsap) return;
    gsap.registerPlugin(ScrollTrigger);

    /* ---- Lenis smooth scroll, driving ScrollTrigger ---- */
    if (cfg.smooth && window.Lenis) {
      var lenis = new window.Lenis({ duration: 1.1, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
      window.__lenis = lenis;
      // pause smooth scroll while a modal/drawer locks the page
      document.addEventListener('theme:scroll-lock', function (e) { e.detail ? lenis.stop() : lenis.start(); });
    }

    /* ---- Scroll reveals (batched for perf) ---- */
    if (cfg.reveal !== false) {
      gsap.utils.toArray('.reveal').forEach(function (el) {
        var y = (el.dataset.revealY || 40) * (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--reveal-intensity')) || 1);
        gsap.fromTo(el, { y: y, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          delay: parseFloat(el.dataset.revealDelay || 0),
          scrollTrigger: { trigger: el, start: 'top 85%', once: true }
        });
      });

      /* Word-by-word display reveal (elements with .reveal-words) */
      gsap.utils.toArray('.reveal-words').forEach(function (el) {
        var words = el.querySelectorAll('.reveal-word');
        if (!words.length) return;
        gsap.set(el, { opacity: 1 });
        gsap.from(words, {
          yPercent: 110, opacity: 0, duration: 0.9, ease: 'power4.out', stagger: 0.045,
          scrollTrigger: { trigger: el, start: 'top 80%', once: true }
        });
      });
    }

    /* ---- Hero parallax + title rise ---- */
    var heroImg = document.querySelector('.hero__media img');
    if (heroImg) {
      gsap.to(heroImg, { yPercent: 14, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }
    var heroWords = document.querySelectorAll('.hero__title .word > span');
    if (heroWords.length) {
      gsap.set('.hero__title', { opacity: 1 });
      gsap.from(heroWords, { yPercent: 120, duration: 1.1, ease: 'power4.out', stagger: 0.08, delay: 0.15 });
    }

    /* ---- 3D scroll landing: pin the viewport, scrub a CSS-3D flythrough ---- */
    var l3d = document.querySelector('[data-l3d]');
    if (l3d) {
      var scene = l3d.querySelector('[data-l3d-scene]');
      var panels = scene ? scene.querySelectorAll('.l3d__panel') : [];
      if (scene && panels.length) {
        l3d.classList.add('is-3d');                        // opt in to the 3D layer (static hero until now)
        var vp = l3d.querySelector('[data-l3d-viewport]');
        var step = parseFloat(getComputedStyle(l3d).getPropertyValue('--l3d-step')) || 680;
        var start = -900;                                  // rest the panels in the distance so the headline reads clean
        var fly = panels.length * step + 300;              // travel far enough to pass the last panel
        gsap.set(scene, { z: start, rotationY: -3, transformOrigin: '50% 50%' });
        gsap.to(scene, {
          z: fly, rotationY: 3, ease: 'none',
          scrollTrigger: {
            trigger: l3d, start: 'top top', end: '+=' + Math.round(fly * 1.15),
            pin: vp, scrub: 0.5, invalidateOnRefresh: true, anticipatePin: 1
          }
        });
        // Headline recedes + fades as you dive in (first ~40% of the pin).
        gsap.to(l3d.querySelector('[data-l3d-hud]'), {
          z: -440, opacity: 0, ease: 'none',
          scrollTrigger: { trigger: l3d, start: 'top top', end: '+=' + Math.round(fly * 0.4), scrub: true }
        });
        var cue = l3d.querySelector('[data-l3d-cue]');
        if (cue) gsap.to(cue, { opacity: 0, ease: 'none', scrollTrigger: { trigger: l3d, start: 'top top', end: '+=160', scrub: true } });
      }
    }

    /* ---- Lookbook horizontal pin ---- */
    var lookbook = document.querySelector('[data-lookbook]');
    if (lookbook) {
      var track = lookbook.querySelector('.lookbook__track');
      var scrollLen = function () { return track.scrollWidth - window.innerWidth; };
      if (scrollLen() > 0) {
        gsap.to(track, {
          x: function () { return -scrollLen(); }, ease: 'none',
          scrollTrigger: {
            trigger: lookbook, start: 'top top', end: function () { return '+=' + scrollLen(); },
            scrub: 0.6, pin: true, invalidateOnRefresh: true, anticipatePin: 1
          }
        });
      }
    }

    /* ---- Magnetic buttons (emil-design-eng: restrained, springy) ---- */
    if (window.matchMedia('(hover: hover)').matches) {
      document.querySelectorAll('[data-magnetic]').forEach(function (el) {
        var strength = parseFloat(el.dataset.magnetic) || 0.35;
        var xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
        var yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
        el.addEventListener('mousemove', function (e) {
          var r = el.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * strength);
          yTo((e.clientY - (r.top + r.height / 2)) * strength);
        });
        el.addEventListener('mouseleave', function () { xTo(0); yTo(0); });
      });
    }

    ScrollTrigger.refresh();
    // Recompute pins/scroll lengths once fonts + images settle.
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }
})();
