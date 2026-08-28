# Knights — Design Direction

Editorial / Swiss (International Typographic Style), executed with restraint. One aesthetic risk:
the **stacking-scroll** — sections physically overshadow each other in z — as the brand's signature.

## Voice
Terse, confident, a little severe. Copy reads like a manifesto, not marketing. Sentences short.
Lowercase body, uppercase structural labels. "Modern armor." "A code, worn." No exclamation, no hype.

## Typography
- **Display / wordmark:** a tight, high-impact grotesque, uppercase, near-zero tracking.
  Candidates (Google Fonts, Pages-safe): `Archivo` (variable, condensable), `Anton` (poster impact),
  `Space Grotesk`. Wordmark KNIGHTS set solid, wide letter-fit.
- **Body / UI:** `Inter` — neutral, legible, Swiss-appropriate. Weights 400/500.
- **Spec / labels / numerals:** a mono (`Space Grotesk Mono` / `JetBrains Mono`) for section
  indices (01 / 02), sizes, prices, and captions — the "spec-sheet" editorial texture.
- Cap the display clamp at ~6rem; letter-spacing floor −0.03em (no touching letters). `text-wrap:balance` on headings.

## Color (near-monochrome + one accent)
- `--ink: #0E0E0C` (near-black, warm)
- `--paper: #F4F1EA` (warm off-white)
- `--grey: #8A867E` (muted, for secondary text/rules)
- `--line: #D9D4C9` (hairline rules)
- `--oxblood: #5A1717` (the single accent — leather's own deep red; used sparingly: rules, hovers, one word)
Contrast: body ink-on-paper ≥ 12:1. Accent only where it earns attention.

## Grid & space
- Swiss 12-column grid, wide outer margins (`clamp(1.25rem, 5vw, 5rem)`), generous gutters.
- Baseline rhythm; align type to the grid. Hairline rules (`--line`) as structure, not decoration.
- Sections are full-viewport (`100svh`) panels for the stacking mechanic.

## Signature motion — the stacking scroll (GSAP ScrollTrigger)
- Each section is a pinned, full-viewport panel. On scroll, the **next** panel rises from below
  (translateY 100%→0, slight scale 0.98→1) and covers the current, which **recedes**: scale ~0.94,
  a darkening overlay to ~0.5, and its inner content parallaxes up (y −6%) — it visibly falls to the
  background and is overshadowed. Continuous, scrubbed, never scroll-jacked (native scroll + pin).
- Restrained x/y/z parallax on inner elements (image, index number, headline drift at different rates).
- **Anime.js** owns micro-interactions: nav open, link underlines, letter-by-letter wordmark reveal
  on load, button press, form focus. Kept off the scroll timeline so the two engines never fight.
- **Reduced motion** (`prefers-reduced-motion: reduce`): panels become simple stacked scroll
  sections, no transforms/pins/overlays. Content identical and fully visible.
- Perf: animate only transform/opacity; `will-change` sparingly; images lazy + sized; 60fps target.

## Components
- **Nav:** minimal — wordmark left, a hairline menu (Home/Products/About/Contact) + cart count right.
  Mix-blend or paper/ink swap so it reads over any panel.
- **Buttons:** rectangular, hairline border or solid ink; `:active` scale 0.97; oxblood on hover. No pills, no soft shadows.
- **PDP:** oversized product image, mono spec list (material, weight, origin, sizes), price, add-to-cart (Shopify).
- **Forms:** underline inputs, generous labels, clear focus ring. Real validation + error copy.

## Anti-slop guardrails (hard bans)
No gradient text, no glassmorphism-by-default, no side-stripe accent borders, no tiny tracked
uppercase eyebrow on every section, no 32px+ card radii, no soft ghost-card (1px border + wide
shadow), no numbered eyebrows unless the sequence is real (the stacking panels ARE a real sequence,
so 01/02/03 indices are earned here). If it could be mistaken for a template, redo it.
