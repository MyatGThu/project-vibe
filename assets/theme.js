/* =====================================================================
   theme.js — scroll animations & interactions
   Uses GSAP + ScrollTrigger (loaded in theme.liquid). Degrades
   gracefully: if GSAP is missing or the visitor prefers reduced motion,
   content is shown immediately with no animation.
   ===================================================================== */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  var hasGSAP = typeof window.gsap !== "undefined";

  /**
   * Reveal everything instantly (fallback / reduced motion).
   */
  function showAll() {
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  }

  if (!hasGSAP || prefersReduced) {
    showAll();
    return;
  }

  var gsap = window.gsap;
  if (window.ScrollTrigger) {
    gsap.registerPlugin(window.ScrollTrigger);
  }

  /**
   * Scroll-reveal: fade + move elements into place as they enter view.
   * Group children with [data-reveal-group] for a stagger.
   */
  function initReveals() {
    // Standalone reveals (not inside a group)
    gsap.utils
      .toArray("[data-reveal]")
      .filter(function (el) {
        return !el.closest("[data-reveal-group]");
      })
      .forEach(function (el) {
        gsap.to(el, {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      });

    // Staggered groups
    gsap.utils.toArray("[data-reveal-group]").forEach(function (group) {
      var items = group.querySelectorAll("[data-reveal]");
      if (!items.length) return;
      gsap.to(items, {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: group,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    });
  }

  /**
   * Subtle parallax for [data-parallax] (e.g. hero media).
   * data-parallax="0.15" controls strength (fraction of scroll travel).
   */
  function initParallax() {
    gsap.utils.toArray("[data-parallax]").forEach(function (el) {
      var strength = parseFloat(el.getAttribute("data-parallax")) || 0.12;
      gsap.to(el, {
        yPercent: strength * 100,
        ease: "none",
        scrollTrigger: {
          trigger: el.closest("[data-parallax-scope]") || el,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });
  }

  /**
   * Hero entrance — runs after the loader hands off (see loading.js),
   * or immediately on DOM ready if no loader is present.
   */
  function playHeroIntro() {
    var hero = document.querySelector("[data-hero-intro]");
    if (!hero) return;
    var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(hero.querySelectorAll("[data-hero-stagger]"), {
      yPercent: 110,
      opacity: 0,
      duration: 1.1,
      stagger: 0.12,
    });
    var media = hero.querySelector(".hero__media");
    if (media) {
      tl.from(media, { scale: 1.12, duration: 1.6, ease: "power2.out" }, 0);
    }
  }

  function init() {
    initReveals();
    initParallax();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Expose hero intro so the loader can trigger it at the right moment.
  window.__themeHeroIntro = playHeroIntro;
  // If no loader runs, play the hero intro once the window loads.
  window.addEventListener("load", function () {
    if (!document.querySelector(".loader")) playHeroIntro();
  });
})();
