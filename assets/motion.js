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

    /* ---- Scroll landing: existing outfits with a parallax drift, then the
           upcoming outfits as a fast slideshow, then a short dissolve into
           the next section (Collection 01). ---- */
    var l3d = document.querySelector('[data-l3d]');
    if (l3d) {
      var slidesWrap = l3d.querySelector('[data-l3d-slides]');
      var slides = slidesWrap ? Array.prototype.slice.call(slidesWrap.querySelectorAll('.l3d__slide')) : [];
      if (slidesWrap && slides.length) {
        l3d.classList.add('is-live');                      // JS now owns which slide shows (static hero until now)
        var vp = l3d.querySelector('[data-l3d-viewport]');
        var hud = l3d.querySelector('[data-l3d-hud]');
        var cue = l3d.querySelector('[data-l3d-cue]');
        var capEl = l3d.querySelector('[data-l3d-cap]');
        var N = slides.length;
        var nUp = slides.filter(function (s) { return s.dataset.upcoming === 'true'; }).length;
        var nBase = N - nUp;                               // existing outfits (+ hero) → parallax beat
        if (nBase < 1) { nBase = N; nUp = 0; }
        var bone = getComputedStyle(document.body).backgroundColor;   // the field we dissolve into (Collection 01)
        var A = nUp ? 0.62 : 0.86;                         // end of the parallax beat
        var B = 0.88;                                      // end of the fast beat; tail is the dissolve
        var current = -1;
        function show(i) {
          if (i === current || i < 0 || i >= N) return;
          if (current >= 0) {
            slides[current].classList.remove('is-active');
            var prev = slides[current].querySelector('img'); if (prev) prev.style.transform = 'scale(1.06)';
          }
          slides[i].classList.add('is-active');
          current = i;
          l3d.classList.toggle('show-badge', slides[i].dataset.upcoming === 'true');
          if (capEl) { var s = slides[i]; capEl.innerHTML = '<span>' + (s.dataset.cap || '') + '</span>' + (s.dataset.tag ? '<span>' + s.dataset.tag + '</span>' : ''); }
        }
        show(0);
        gsap.set(slidesWrap, { filter: 'blur(0px)' });

        var tl = gsap.timeline({
          scrollTrigger: {
            trigger: l3d, start: 'top top',
            // existing looks dwell (parallax); upcoming looks flip fast; + a short exit.
            end: function () { return '+=' + Math.round(window.innerHeight * (nBase * 0.5 + nUp * 0.28 + 0.5)); },
            pin: vp, scrub: 0.35, invalidateOnRefresh: true, anticipatePin: 1,
            onUpdate: function (self) {
              var p = self.progress;
              if (p < A) {                                  // beat 1 — existing outfits, parallax Ken Burns
                var f = (p / A) * nBase;
                var idx = Math.min(nBase - 1, Math.floor(f));
                show(idx);
                var local = f - Math.floor(f);
                var img = slides[idx] && slides[idx].querySelector('img');
                if (img) img.style.transform = 'scale(' + (1.04 + local * 0.12).toFixed(3) + ') translateY(' + ((local - 0.5) * 3).toFixed(2) + '%)';
              } else if (p < B && nUp) {                    // beat 2 — upcoming outfits, fast hard cuts
                var f2 = (p - A) / (B - A);
                show(nBase + Math.min(nUp - 1, Math.floor(f2 * nUp)));
              } else {
                show(N - 1);
              }
            }
          }
        });
        tl.to(hud, { yPercent: -16, opacity: 0, ease: 'power2.in', duration: 0.3 }, 0);      // headline clears early
        if (cue) tl.to(cue, { opacity: 0, ease: 'none', duration: 0.06 }, 0);
        if (capEl) tl.fromTo(capEl, { opacity: 0 }, { opacity: 1, ease: 'none', duration: 0.05 }, 0.05);
        // Short dissolve (last ~12%): a gentle zoom + light blur into Collection 01's field — no lingering blank.
        tl.to(slidesWrap, { scale: 1.08, filter: 'blur(9px)', opacity: 0, ease: 'power2.in', duration: 0.12 }, 0.88);
        tl.to(vp, { backgroundColor: bone, ease: 'power2.in', duration: 0.12 }, 0.88);
        if (capEl) tl.to(capEl, { opacity: 0, ease: 'none', duration: 0.08 }, 0.88);
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
