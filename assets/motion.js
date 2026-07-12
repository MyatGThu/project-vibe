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

    /* ---- 3D scroll landing: a tall section whose viewport is held by native CSS position:sticky
           (NOT a GSAP pin — a pin hijacks scroll and can trap the user "in the frame"). We scrub only
           the panel depths: each look-panel flies in on its OWN staggered track (independent motion,
           not one block), then the viewport fades to resolve in place into Collection 01. ---- */
    var l3d = document.querySelector('[data-l3d]');
    if (l3d) {
      var scene = l3d.querySelector('[data-l3d-scene]');
      var panels = scene ? Array.prototype.slice.call(scene.querySelectorAll('.l3d__panel')) : [];
      if (scene && panels.length) {
        l3d.classList.add('is-3d');                        // opt in to the 3D layer (static hero until now)
        // Build marker — confirms the live theme is running this sticky build (rules out a stale deploy).
        try { console.info('[te-amo] l3d flythrough · sticky build · panels=' + panels.length); } catch (e) {}
        var vp = l3d.querySelector('[data-l3d-viewport]');
        var hud = l3d.querySelector('[data-l3d-hud]');
        var cue = l3d.querySelector('[data-l3d-cue]');
        var step = parseFloat(getComputedStyle(l3d).getPropertyValue('--l3d-step')) || 380;
        var N = panels.length;
        var rest = 1400;                                   // matches the -1400px rest offset in .l3d__panel CSS
        // Seed the exit filter on the VIEWPORT, never the scene. A filter (even blur(0px)) forces
        // transform-style:flat, so putting one on the preserve-3d scene collapses the whole 3D depth
        // (panels stop flying). The viewport hosts the perspective (it is itself flat), so it is safe.
        gsap.set(vp, { filter: 'blur(0px)' });

        var perDur = 0.34;                                 // how long one panel takes to fly past
        var flyEnd = 0.82;                                 // all panels done before the in-place resolution
        var stag = N > 1 ? (flyEnd - perDur) / (N - 1) : 0;

        // Scale the tall section to the panel count, then let native position:sticky (CSS) hold the
        // viewport while we scrub only the panel depths. NO GSAP pin => scroll can never be trapped.
        l3d.style.setProperty('--l3d-h', ((N * 0.5 + 1.4) * 100).toFixed(0) + 'svh');
        var tl = gsap.timeline({
          scrollTrigger: {
            trigger: l3d, start: 'top top', end: 'bottom bottom',
            scrub: 0.5, invalidateOnRefresh: true
          }
        });
        // Each panel flies in on its OWN staggered track. A real tween drives a proxy value
        // (version-independent), whose onUpdate writes the panel's --flyz depth — so the scrub owns it.
        panels.forEach(function (panel, i) {
          var travel = rest + i * step + 560;              // z_end ≈ 560 (scale ~2×) — approaches, never balloons
          var proxy = { fz: 0 };
          panel.style.setProperty('--flyz', '0px');
          gsap.set(panel, { opacity: 1 });
          var at = i * stag;
          tl.to(proxy, {
            fz: travel, ease: 'none', duration: perDur,
            onUpdate: function () { panel.style.setProperty('--flyz', proxy.fz.toFixed(1) + 'px'); }
          }, at);
          // Dissolve each panel as it reaches the camera, so none freezes huge and lingers. This also
          // fixes an iOS bug where overflow:hidden fails to clip 3D-transformed children: a frozen
          // giant panel would otherwise bleed past the viewport as a stuck strip on the right.
          tl.to(panel, { opacity: 0, ease: 'power1.in', duration: perDur * 0.4 }, at + perDur * 0.6);
        });
        tl.to(hud, { z: -440, opacity: 0, ease: 'none', duration: 0.34 }, 0);           // headline recedes early
        if (cue) tl.to(cue, { opacity: 0, ease: 'none', duration: 0.08 }, 0);
        // Resolve in place: expand + blur + fade the whole VIEWPORT (the perspective host, safe to
        // filter) to reveal Collection 01 pulled up underneath (see .l3d underlap CSS). The blur lives
        // on the viewport, not the 3D scene, so the flythrough stays truly 3D until the dissolve.
        // ponytail: blur ceiling 8px (emil: < 20px, costly in Safari).
        tl.to(vp, { scale: 1.12, filter: 'blur(8px)', opacity: 0, ease: 'power2.in', duration: 0.18 }, 0.82);
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
