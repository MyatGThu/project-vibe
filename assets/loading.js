/* =====================================================================
   loading.js — animated loading screen controller
   Shows a brand-mark loader on first paint, fills a progress bar, then
   wipes away once the page's assets have loaded (or a max wait elapses),
   and hands off to the hero entrance animation.
   Respects prefers-reduced-motion and degrades without GSAP.
   ===================================================================== */
(function () {
  "use strict";

  var loader = document.querySelector(".loader");
  if (!loader) return;

  var prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  var hasGSAP = typeof window.gsap !== "undefined";
  var bar = loader.querySelector(".loader__bar span");

  // Only show the loader once per session (feels premium, not annoying).
  var SEEN_KEY = "melina:loaded";
  var alreadySeen = false;
  try {
    alreadySeen = sessionStorage.getItem(SEEN_KEY) === "1";
  } catch (e) {
    /* storage blocked — just show it */
  }

  function handoff() {
    if (typeof window.__themeHeroIntro === "function") {
      window.__themeHeroIntro();
    }
  }

  function finish() {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch (e) {}

    if (!hasGSAP || prefersReduced) {
      loader.setAttribute("hidden", "");
      handoff();
      return;
    }

    window.gsap.to(loader, {
      yPercent: -100,
      duration: 0.9,
      ease: "power4.inOut",
      onComplete: function () {
        loader.setAttribute("hidden", "");
        handoff();
      },
    });
  }

  // If seen this session, skip the show entirely.
  if (alreadySeen) {
    loader.setAttribute("hidden", "");
    return;
  }

  // Animate the progress bar while the page loads.
  if (hasGSAP && !prefersReduced && bar) {
    window.gsap.to(bar, { width: "70%", duration: 1.0, ease: "power1.out" });
  }

  var done = false;
  function complete() {
    if (done) return;
    done = true;
    if (hasGSAP && !prefersReduced && bar) {
      window.gsap.to(bar, {
        width: "100%",
        duration: 0.3,
        ease: "power2.out",
        onComplete: finish,
      });
    } else {
      finish();
    }
  }

  // Hand off on window load, with a safety cap so we never trap the page.
  window.addEventListener("load", complete);
  setTimeout(complete, 3500);
})();
