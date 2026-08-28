# Knights — Design Direction (v2, post-review)

Editorial / Swiss discipline, but **material-derived, not magazine-cream**. The concept —
leather jacket as *modern armor* — drives the surface: the site is built from the material itself.
One aesthetic risk: the **stacking-scroll** signature (plates layering over each other) on Home.

> v2 changes (from review): dropped the cream `#F4F1EA` palette (the #1 AI tell + anti-Swiss +
> anti-material); fixed secondary-text contrast; collapsed to ONE typeface (Archivo) with tabular
> figures instead of a mono; scoped the stacking signature to Home; committed the Shopify path to
> Storefront API → hosted checkout; made success criteria verifiable. Anime.js kept per explicit
> request (used for the load/reveal sequence), though it is technically optional.

## Voice
Terse, severe, a little cold. Copy reads like a manifesto. "Modern armor." "A code, worn." No hype.

## Ground — dark, material-derived (RECOMMENDED)
The site is **oiled black leather**, not paper. Dark ground makes the concept structural and lets
the overshadow-stack read as plates in shadow. (Alt if you want classic Swiss: a true white at
chroma ~0 with oxblood as the flat bold accent — a token flip, not a rebuild.)

Tokens (exact hexes finalized + contrast-checked at build; names tie to the material, not "paper/cream"):
- `--leather: #0C0C0E` — cold near-black ground (oiled leather)
- `--chalk:   #E9EAEC` — cool off-white for type/inverse surfaces (chroma ~0 — NOT warm cream)
- `--steel:   #7C8288` — cold gunmetal; hairline rules + decorative only (too light for text)
- `--steel-ink: #AEB4B9` — secondary text on the dark ground, verified ≥ 4.5:1
- `--oxblood: #8E2A2A` — the single accent (leather's own red): one word, a rule, a hover
Contrast is a gate, not a hope: every text pair computed ≥ 4.5:1 (large ≥ 3:1) at build.

## Typography — one family (Swiss discipline)
**Archivo** only (variable; genuinely Swiss-grotesque, not a reflex-reject default), used across
a width/weight contrast axis — no second family, no mono:
- **Wordmark / display:** Archivo Expanded, heavy, uppercase, monumental — KNIGHTS as a wall.
- **Body / UI:** Archivo normal, 400/500.
- **Indices / sizes / prices / labels:** Archivo **tabular lining figures** + tracked uppercase —
  delivers the "spec-sheet" texture without a mono (mono reads as dev-tool costume on a fashion house).
- Ceilings: display clamp ≤ ~6rem; letter-spacing floor −0.03em; `text-wrap:balance` on headings;
  body line length 65–75ch. **Self-hosted woff2** + preload + `font-display:swap` (no CDN, no FOIT).

## Grid & space
Swiss 12-col, wide outer margins (`clamp(1.25rem,5vw,5rem)`), baseline rhythm, hairline `--steel`
rules as structure. Home uses full-viewport panels for the stack; other pages use normal editorial flow.

## Signature motion — the stacking scroll (Home only)
As you scroll Home, each panel (a "plate") rises and **overshadows** the previous, which recedes
into shadow. Build discipline:
- **Progressive enhancement first:** panels are in **normal document flow, fully visible, in CSS**.
  JS only *layers* the stack on top. JS fails → a clean flowed page, never blank panels.
- **CSS-first mechanic:** prototype with `position: sticky` panels + a darkening scrim on the
  outgoing plate. Add incoming/outgoing scale + restrained inner parallax (GSAP) **only if it reads
  flat** — don't build five coordinated transforms up front (ponytail).
- **GSAP ScrollTrigger** owns the scrubbed stack + any parallax. **Anime.js** owns the one-time
  load reveal (letter-by-letter wordmark, staggered manifesto lines) — off the scroll timeline so
  the engines never fight.
- **Fallbacks:** `prefers-reduced-motion` AND touch/≤768px → no pin/scrub, plain stacked sections,
  identical content. Verify keyboard scroll (Space/PageDown) advances, find-in-page works, no CLS
  from pin recalculation, `100svh` handles mobile address-bar show/hide.
- **Nav legibility:** no mix-blend gamble — swap nav tokens (light↔dark) per active panel via a
  ScrollTrigger callback so it's legible at every panel, including mid-transition.
- Animate only transform/opacity; `will-change` sparingly; 60fps target.

## Components
- **Nav:** wordmark left; hairline menu (Home/Products/About/Contact) + cart count right; token-swaps per panel.
- **Buttons:** rectangular, hairline `--steel` or solid; `:active` scale 0.97; `--oxblood` on hover. No pills, no soft shadows, no ghost-cards.
- **PDP:** oversized image, spec list in tabular figures (material, weight, origin, sizes), price,
  add-to-cart → cart module. Size guide + fit indicator + delivery estimate + reviews block
  (research: fit drives ~50% of returns; empty reviews kill conversion).
- **Forms:** underline inputs, generous labels, `:focus-visible` ring, real validation, errors
  below field via `aria-describedby`.

## Commerce — Storefront API → hosted checkout (single swap point)
- **Shopify Storefront API (GraphQL)** to read products + build a cart; redirect to Shopify's
  **hosted checkout**. (Not Buy Button SDK — its iframe can't be restyled to this design.)
- **Public Storefront access token** only (read-only, safe to embed) — never an Admin token.
- Multi-page static site → **cart id persisted in `localStorage`**; the nav cart-count reads that
  shared state on every page.
- All Shopify wiring behind **one config/module** (`assets/js/shop.js`) with placeholder creds, so
  Pages↔Shopify is a single swap. Until connected, add-to-cart calls the real module against a
  mock catalog — no `href="#"` fake buttons.

## Verifiable success criteria (checked, not asserted)
- **Distinctive:** 0 slop hits on impeccable's detector; body ground NOT in the cream band (OKLCH
  L 0.84–0.97 / C<0.06 / hue 40–100); no font from the reflex-reject list; with copy stripped, it
  still reads "armor," not "generic editorial."
- **Signature:** reduced-motion + ≤768px show fully-visible flowed sections; content readable with
  JS disabled; keyboard scroll advances the stack; no CLS from pin.
- **a11y:** axe/Lighthouse a11y ≥ 95; all text ≥ 4.5:1; `:focus-visible` everywhere; skip link; nav keyboard-operable.
- **Commerce:** add-to-cart hits the real cart module with one documented swap point; nav count reads shared state; zero fake buttons.
- **Fast:** LCP < 2.5s; stated JS ceiling; fonts self-hosted woff2 + preload; every image has width/height (no CLS).

## Anti-slop guardrails (hard bans)
No cream/sand/warm-neutral body ground; no reflex-reject fonts; no mono-as-technical; no gradient
text; no glassmorphism default; no side-stripe borders; no ghost-cards (1px border + wide shadow);
no 32px+ card radii; no tracked-uppercase eyebrow on every section. The 01/02 plate indices are
earned (the stack IS a real sequence). If it could be mistaken for a template, redo it.
