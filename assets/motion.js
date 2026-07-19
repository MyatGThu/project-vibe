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

      // Auto-hiding menu: retract while scrolling, return the instant the scroll stops
      // (also on scroll-up, near the top, and on keyboard focus so it's never trapped away).
      var lastY = window.scrollY, hideTimer;
      var onHideScroll = function () {
        var y = window.scrollY;
        if (y > 90 && y > lastY + 4) header.classList.add('is-hidden');
        else if (y < lastY - 4 || y <= 90) header.classList.remove('is-hidden');
        lastY = y;
        clearTimeout(hideTimer);
        hideTimer = setTimeout(function () { header.classList.remove('is-hidden'); }, 240);
      };
      window.addEventListener('scroll', onHideScroll, { passive: true });
      header.addEventListener('focusin', function () { header.classList.remove('is-hidden'); });
    }

    if (reduce) return;   // honour the user; leave everything static & visible.

    // StringTune — homepage-only declarative parallax (loaded via theme.liquid only when
    // template == index). It reads scroll (coexists with Lenis) and transforms its OWN
    // [string="parallax"] elements — a separate channel from every GSAP target, so they never
    // fight. Only runs past the reduced-motion return above; a load miss is a silent no-op.
    if (window.StringTune && window.StringTune.StringTune) {
      try {
        var st = window.StringTune.StringTune.getInstance();
        st.use(window.StringTune.StringParallax);
        st.start(60);
      } catch (e) {}
    }

    waitFor(function () { return window.gsap && window.ScrollTrigger; }, init);
  });

  function releasePhotoFrames() {
    // Libs never arrived (or bailed): release any pre-clipped/zoomed photo frames so a photo is
    // never stuck hidden. Mirrors the .js CSS initial state set in base.css.
    document.querySelectorAll('.photo-reveal').forEach(function (f) {
      f.style.clipPath = 'none';
      var n = f.querySelector('.photo-reveal__inner');
      if (n) n.style.transform = 'none';
    });
  }

  // Masked wipe + inner settle for one photo frame. Fired from a ScrollTrigger onEnter so the same
  // reveal works off a vertical page-scroll trigger OR the lookbook's horizontal containerAnimation.
  function revealFrame(frame) {
    var gsap = window.gsap;
    var inner = frame.querySelector('.photo-reveal__inner');
    gsap.to(frame, { clipPath: 'inset(0 0 0% 0)', duration: 1.15, ease: 'power3.out' });
    if (inner) gsap.to(inner, { scale: 1.06, duration: 1.35, ease: 'power3.out' });
  }

  function init() {
    var gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
    // The photo reveal depends on BOTH libs; a partial load (gsap ok, ScrollTrigger 404s) must still
    // release the frames or every photo stays clipped to zero. Guard on the full precondition.
    if (!gsap || !ScrollTrigger) { releasePhotoFrames(); return; }
    gsap.registerPlugin(ScrollTrigger);
    // Mobile browsers fire a resize every time the address bar shows/hides during a scroll. That resize
    // makes ScrollTrigger recompute + re-run invalidateOnRefresh, which snapped the scrubbed panel depths
    // to new values — the "flash" where the 3D flythrough panels jump small↔big mid-scroll. Ignoring the
    // address-bar resize (real orientation/width changes still refresh) keeps the scrub stable.
    ScrollTrigger.config({ ignoreMobileResize: true });

    // Touch / handset: skip the scroll-jacking 3D flythrough AND the horizontal pin. On mobile they fall
    // back to a static hero and a native swipe strip — a calm, non-hijacked scroll (per user request).
    var noScrollFX = window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(max-width: 900px)').matches;
    // Touch / small screens now RUN the smooth motion (parallax, shader dissolve, gallery warp),
    // just tuned down for the GPU — lowPower scales amplitudes and caps the shader resolution.
    // Only the scroll-JACKING pin (lookbook) stays a native swipe on touch (noScrollFX), because
    // hijacking a thumb-scroll feels broken. Reduced-motion is still a hard off (returned above).
    var lowPower = noScrollFX;

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

    /* ---- Editorial photo grammar: masked reveal + in-frame parallax + custom cursor ----
       Every .photo-reveal frame wipes open (clip-path) while its inner settles from a slight zoom
       as it scrolls in — a one-shot that runs on ALL viewports (mobile included). On desktop the
       inner also drifts within the clipped frame ([data-photo-parallax]), and a floating "View"
       label rides over clickable photos ([data-photo-cursor]). Reduced-motion returned before init
       ran, so none of this executes then — CSS keeps the photos static. The reveal drives the
       INNER's scale and the parallax drives its yPercent (independent transform channels), so the
       two never fight; hover-scale lives on the child <img>, a third element GSAP never touches. */
    gsap.utils.toArray('.photo-reveal').forEach(function (frame) {
      // Lookbook slides live inside the horizontally-pinned track — a vertical trigger would fire
      // them all at once (off-screen). They are revealed from the track's own motion below.
      if (frame.closest('[data-lookbook]')) return;
      ScrollTrigger.create({ trigger: frame, start: 'top 88%', once: true, onEnter: function () { revealFrame(frame); } });
    });

    // In-frame vertical photo parallax — non-jacking depth, transform-only, safe on ALL pointers
    // (mobile included): the inner drifts within the clipped frame (headroom comes from the 1.06
    // resting scale above, so ±2% never exposes an edge). The reveal owns the inner's scale, this
    // owns yPercent — separate channels, never fight. Reduced-motion returned before init(), so this
    // never runs then. (Only the scroll-JACKING effects stay behind noScrollFX below.)
    gsap.utils.toArray('[data-photo-parallax]').forEach(function (frame) {
      var inner = frame.querySelector('.photo-reveal__inner') || frame;
      gsap.fromTo(inner, { yPercent: -2 }, {
        yPercent: 2, ease: 'none',
        scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: 0.6 }
      });
    });
    // Portfolio portrait: a gentle held-scale drift as the hero scrolls away (scale stays >1 so the
    // translate keeps the frame covered). Also non-jacking → runs on touch.
    var pfPortrait = document.querySelector('.pf-hero__media img');
    if (pfPortrait) {
      gsap.fromTo(pfPortrait, { scale: 1.1, yPercent: -3 }, {
        yPercent: 3, ease: 'none',
        scrollTrigger: { trigger: '.pf-hero', start: 'top top', end: 'bottom top', scrub: true }
      });
    }

    /* Floating label cursor over clickable photos — fine, hovering pointer only (touch never fires
       hover, so nothing to reset there). */
    if (window.matchMedia('(hover: hover)').matches && window.matchMedia('(pointer: fine)').matches) {
      var pcTargets = gsap.utils.toArray('[data-photo-cursor]');
      if (pcTargets.length) {
        var pcur = document.createElement('div');
        pcur.className = 'photo-cursor';
        pcur.setAttribute('aria-hidden', 'true');
        var pcLabel = document.createElement('span');
        pcur.appendChild(pcLabel);
        document.body.appendChild(pcur);
        document.body.classList.add('has-photo-cursor');
        // GSAP owns the whole transform (translate + scale) so the disc scales ABOUT the pointer,
        // never swooping in from the corner; autoAlpha fades it in/out.
        gsap.set(pcur, { xPercent: -50, yPercent: -50, scale: 0.3, autoAlpha: 0 });
        var pcx = gsap.quickTo(pcur, 'x', { duration: 0.4, ease: 'power3' });
        var pcy = gsap.quickTo(pcur, 'y', { duration: 0.4, ease: 'power3' });
        window.addEventListener('mousemove', function (e) { pcx(e.clientX); pcy(e.clientY); }, { passive: true });
        var pcShow = function (label) {
          pcLabel.textContent = label || 'View';
          document.body.classList.add('pc-active');            // gates cursor:none to while the disc shows
          gsap.to(pcur, { scale: 1, autoAlpha: 1, duration: 0.3, ease: 'power3' });
        };
        var pcHide = function () {
          document.body.classList.remove('pc-active');
          gsap.to(pcur, { scale: 0.3, autoAlpha: 0, duration: 0.3, ease: 'power3' });
        };
        pcTargets.forEach(function (t) {
          t.addEventListener('mouseenter', function () { pcShow(t.getAttribute('data-photo-cursor')); });
          t.addEventListener('mouseleave', pcHide);
        });
        document.addEventListener('mouseleave', pcHide);
      }
    }

    /* ---- 3D scroll landing: a tall section whose viewport is held by native CSS position:sticky
           (NOT a GSAP pin — a pin hijacks scroll and can trap the user "in the frame"). We scrub only
           the panel depths: each look-panel flies in on its OWN staggered track (independent motion,
           not one block), then the viewport fades to resolve in place into Collection 01. ---- */
    var l3d = document.querySelector('[data-l3d]');
    if (l3d && !noScrollFX) {
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

    /* ---- Category showcase: 3D parallax panels (Gym / Swim / Dress) ----
       Non-jacking depth parallax — each layer drifts at its own scrubbed rate as the panel
       crosses the viewport, and the perspective stage eases on rotateX for a subtle camera
       move. Desktop only: the mobile CSS stacks these into a calm native swipe strip. */
    if (!noScrollFX) {
      gsap.utils.toArray('[data-cshow]').forEach(function (sec) {
        sec.querySelectorAll('[data-cshow-par]').forEach(function (el) {
          var d = parseFloat(el.dataset.cshowPar) || 0.2;
          gsap.fromTo(el, { yPercent: 9 * d }, {
            yPercent: -13 * d, ease: 'none',
            scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: 0.6 }
          });
        });
        var stage = sec.querySelector('[data-cshow-stage]');
        if (stage) {
          gsap.fromTo(stage, { rotateX: 6 }, {
            rotateX: -4.5, ease: 'none',
            scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: 0.8 }
          });
        }
      });
    }

    /* ---- Photo vortex: a rotating helix of the house's imagery you spiral down through
           on scroll (overdrive II). A tall section held by native position:sticky (no scroll
           hijack); scroll scrubs the stage's rotation + descent so one look is always front-
           and-centre, facing the camera, while the rest spiral around it. Desktop only:
           mobile / no-JS / reduced-motion keep the calm horizontal gallery strip. ---- */
    var vortex = document.querySelector('[data-vortex]');
    if (vortex && !noScrollFX) {
      var vstage = vortex.querySelector('[data-vortex-stage]');
      var vimgs = vstage ? Array.prototype.slice.call(vstage.querySelectorAll('img')) : [];
      if (vstage && vimgs.length >= 6) {
        vortex.classList.add('is-3d');
        var VN = vimgs.length, VANG = 42, VVS = 96, VR = 380;   // angle step, vertical step, radius
        vimgs.forEach(function (img, i) {
          var tile = document.createElement('div');
          tile.className = 'vortex__tile';
          vstage.insertBefore(tile, img);
          tile.appendChild(img);
          tile.style.transform = 'translate(-50%,-50%) rotateY(' + (i * VANG) + 'deg) translateZ(' + VR + 'px) translateY(' + (i * VVS) + 'px)';
        });
        var vTotalAng = VN * VANG, vTotalY = (VN - 1) * VVS;
        ScrollTrigger.create({
          trigger: vortex, start: 'top top', end: 'bottom bottom', scrub: 0.6,
          onUpdate: function (self) {
            var p = self.progress;
            vstage.style.transform = 'rotateY(' + (-p * vTotalAng) + 'deg) translateY(' + (-p * vTotalY) + 'px)';
          }
        });
      }
    }

    /* ---- meech213-style scroll gallery: parallax columns + scroll-velocity warp + clip reveal.
           Columns drift at their own rate; Lenis velocity skews/scales/blurs the photos into a
           "liquid" smear that settles when the scroll stops; each figure clip-reveals on enter. ---- */
    var gallery = document.querySelector('[data-gallery]');
    if (gallery) {
      // Clip reveal (also on touch — a gentle enhance; reduced-motion CSS keeps images visible).
      gsap.utils.toArray('[data-gallery] .gallery__fig').forEach(function (fig) {
        ScrollTrigger.create({ trigger: fig, start: 'top 90%', once: true, onEnter: function () { fig.classList.add('is-in'); } });
      });
      // Column parallax needs the multi-column desktop layout; mobile is a single wall (the warp
      // below still runs there — it's the signature effect).
      if (!lowPower) {
        gsap.utils.toArray('[data-gallery] [data-gallery-col]').forEach(function (col, i) {
          var to = [80, -60, 46][i % 3];
          gsap.fromTo(col, { y: 0 }, { y: to, ease: 'none', scrollTrigger: { trigger: gallery, start: 'top bottom', end: 'bottom top', scrub: 0.7 } });
        });
      }
      // Scroll-velocity warp — a manual, smoothed scrollY delta (robust on touch, where Lenis
      // leaves native momentum in place and its own velocity can read 0). Skews/scales/blurs the
      // photos into a "liquid" smear that decays back to rest; the loop idles when off-screen.
      (function () {
        var kSkew = lowPower ? 0.06 : 0.09, kScale = lowPower ? 0.0006 : 0.001, kBlur = lowPower ? 0.035 : 0.055;
        var lastSY = window.scrollY, vel = 0, running = false, raf;
        function inView() { var r = gallery.getBoundingClientRect(); return r.bottom > 0 && r.top < window.innerHeight; }
        function step() {
          var sy = window.scrollY;
          vel = vel * 0.82 + (sy - lastSY) * 0.18;
          lastSY = sy;
          gallery.style.setProperty('--g-skew', Math.max(-5, Math.min(5, vel * kSkew)).toFixed(2) + 'deg');
          gallery.style.setProperty('--g-scale', (1 + Math.min(0.05, Math.abs(vel) * kScale)).toFixed(3));
          gallery.style.setProperty('--g-blur', Math.min(3.5, Math.abs(vel) * kBlur).toFixed(2) + 'px');
          if (Math.abs(vel) < 0.05 && !inView()) { running = false; return; }
          raf = requestAnimationFrame(step);
        }
        function kick() { if (!running) { running = true; lastSY = window.scrollY; raf = requestAnimationFrame(step); } }
        window.addEventListener('scroll', kick, { passive: true });
        kick();
      })();
    }

    /* ---- Three-worlds shader dissolve (overdrive signature moment) ----
       A fixed WebGL backdrop behind the Gym/Swim/Dress showcase panels. As the viewport
       crosses the three worlds their palettes melt into one another on the GPU with a slow
       flow-noise, so the scroll reads as ONE continuous journey rather than three panels.
       Shares the desktop-only noScrollFX gate; reduced-motion already returned above. Any
       WebGL failure or <2 panels leaves the per-panel CSS backgrounds untouched (fallback). */
    (function worldsDissolve() {
      var worlds = gsap.utils.toArray('[data-cshow]');   // runs on mobile too; DPR capped below
      if (worlds.length < 2) return;

      var canvas = document.createElement('canvas');
      canvas.className = 'worlds-stage';
      canvas.setAttribute('aria-hidden', 'true');
      var gl = null;
      try {
        gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' }) ||
             canvas.getContext('experimental-webgl');
      } catch (e) {}
      if (!gl) return;                                   // no WebGL → keep the themed CSS panels

      var VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}';
      var FRAG = [
        'precision mediump float;',
        'uniform vec2 uRes;uniform float uTime;uniform float uProg;',
        'float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
        'float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.0-2.0*f);',
        'return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),u.x),mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),u.x),u.y);}',
        'float fbm(vec2 p){return 0.62*noise(p)+0.38*noise(p*2.03+11.0);}',
        'vec3 gymC(vec2 uv){vec3 g=mix(vec3(0.086,0.047,0.047),vec3(0.047,0.035,0.031),uv.y);',
        'g+=vec3(0.882,0.114,0.165)*smoothstep(0.95,0.0,distance(uv,vec2(0.76,0.16)))*0.32;return g;}',
        'vec3 swimC(vec2 uv){vec3 s=mix(vec3(0.859,0.949,1.0),vec3(1.0,0.992,0.953),smoothstep(0.0,1.0,uv.y));',
        's=mix(s,vec3(1.0,0.824,0.247),smoothstep(0.9,0.0,distance(uv,vec2(0.85,0.12)))*0.5);return s;}',
        'vec3 dressC(vec2 uv){vec3 d=mix(vec3(0.090,0.075,0.063),vec3(0.122,0.090,0.071),uv.y);',
        'd+=vec3(0.784,0.663,0.416)*smoothstep(0.95,0.0,distance(uv,vec2(0.5,0.10)))*0.24;return d;}',
        'void main(){vec2 uv=gl_FragCoord.xy/uRes;uv.y=1.0-uv.y;',
        'float n=fbm(uv*2.6+vec2(uTime*0.03,uTime*0.018));',
        'float p=clamp(uProg+(n-0.5)*0.16,0.0,1.0);',
        'vec3 col;',
        'if(p<0.5){col=mix(gymC(uv),swimC(uv),smoothstep(0.10,0.5,p));}',
        'else{col=mix(swimC(uv),dressC(uv),smoothstep(0.5,0.90,p));}',
        'col+=(n-0.5)*0.014;',
        'gl_FragColor=vec4(col,1.0);}'
      ].join('');

      function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; }
      var prog = gl.createProgram();
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;   // shader trouble → CSS panels stay

      gl.useProgram(prog);
      var quad = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      var loc = gl.getAttribLocation(prog, 'p');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      var uRes = gl.getUniformLocation(prog, 'uRes');
      var uTime = gl.getUniformLocation(prog, 'uTime');
      var uProg = gl.getUniformLocation(prog, 'uProg');

      var dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1 : 1.5);
      function resize() {
        var w = Math.max(1, Math.floor(window.innerWidth * dpr)), h = Math.max(1, Math.floor(window.innerHeight * dpr));
        if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
      }
      window.addEventListener('resize', resize, { passive: true });

      document.body.appendChild(canvas);
      document.body.classList.add('worlds-active');     // CSS turns the .cshow backgrounds transparent

      var first = worlds[0], last = worlds[worlds.length - 1];
      var visible = false, raf = 0, t0 = null;
      function inView() {
        return worlds.some(function (w) { var r = w.getBoundingClientRect(); return r.bottom > -window.innerHeight * 0.1 && r.top < window.innerHeight * 1.1; });
      }
      function progress() {
        var a = first.getBoundingClientRect().top + window.scrollY;
        var b = last.getBoundingClientRect().bottom + window.scrollY;
        var mid = window.scrollY + window.innerHeight * 0.5;
        return Math.max(0, Math.min(1, (mid - a) / Math.max(1, b - a)));
      }
      function frame(ts) {
        if (!visible) return;
        resize();
        if (t0 === null) t0 = ts || 0;
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, ((ts || 0) - t0) / 1000);
        gl.uniform1f(uProg, progress());
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        raf = requestAnimationFrame(frame);
      }
      function sync() {
        var now = inView();
        if (now && !visible) { visible = true; canvas.classList.add('is-visible'); raf = requestAnimationFrame(frame); }
        else if (!now && visible) { visible = false; canvas.classList.remove('is-visible'); cancelAnimationFrame(raf); }
      }
      // A ScrollTrigger keyed to the whole worlds range starts/stops the render loop (pause off-screen).
      ScrollTrigger.create({ trigger: first, start: 'top bottom', endTrigger: last, end: 'bottom top', onToggle: sync, onUpdate: sync });
      sync();
    })();

    /* ---- Lookbook: section-level masked reveal + horizontal pin + in-frame parallax ---- */
    var lookbook = document.querySelector('[data-lookbook]');
    if (lookbook) {
      // Section-level reveal: the strip wipes in together as it enters. Its slides share a vertical
      // position and most sit off-screen in the horizontal track, so a per-slide vertical trigger
      // would just fire them all at once anyway — one section trigger is honest and cheaper. Runs on
      // all viewports (the slides were skipped by the global reveal loop above).
      var lbFigs = gsap.utils.toArray('[data-lookbook] .lookbook__slide .photo-reveal');
      if (lbFigs.length) {
        ScrollTrigger.create({ trigger: lookbook, start: 'top 80%', once: true, onEnter: function () { lbFigs.forEach(revealFrame); } });
      }
      if (!noScrollFX) {
        var track = lookbook.querySelector('.lookbook__track');
        var scrollLen = function () { return track ? track.scrollWidth - window.innerWidth : 0; };
        if (scrollLen() > 0) {
          // Hand scrolling to the pin: kills the native swipe fallback (see .lookbook.is-pinned CSS).
          lookbook.classList.add('is-pinned');
          var lbTween = gsap.to(track, {
            x: function () { return -scrollLen(); }, ease: 'none',
            scrollTrigger: {
              trigger: lookbook, start: 'top top', end: function () { return '+=' + scrollLen(); },
              scrub: 0.6, pin: true, invalidateOnRefresh: true, anticipatePin: 1
            }
          });
          // In-frame HORIZONTAL parallax: each look drifts within its frame as the pinned track
          // carries it across (containerAnimation ties the trigger to the horizontal tween, not the
          // page scroll). xPercent channel only — the clip reveal owns scale, so they don't fight.
          lookbook.querySelectorAll('.lookbook__slide .photo-reveal__inner').forEach(function (inner) {
            gsap.fromTo(inner, { xPercent: -2.5 }, {
              xPercent: 2.5, ease: 'none',
              scrollTrigger: {
                trigger: inner.closest('.lookbook__slide'), containerAnimation: lbTween,
                start: 'left right', end: 'right left', scrub: true
              }
            });
          });
        }
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
