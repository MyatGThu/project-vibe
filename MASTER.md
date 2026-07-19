# MASTER.md — Te Amo design system

Single source of truth for the visual + motion rebuild. Every color, size, easing and
duration in the theme resolves to a token defined here. If a value isn't here, it doesn't
ship. This document governs `assets/base.css`, `assets/motion.js`, the Liquid sections, and
the `site/*.html` static preview equally.

> Status: rebuild in progress. The three collection palettes below already existed and were
> sound — this rebuild **elevates execution** (type rhythm, composition, motion, library-driven
> interaction) on top of them. It does not reinvent the color architecture.

---

## Theses

Both theses are stated as **explicit assumptions** (brainstorm was resolved from the accumulated
brief + the prior art-direction research rather than a fresh Q&A). Veto any line and it changes.

### Visual thesis
> One editorial house, three lit rooms. A warm-neutral gallery daylight is the connective tissue;
> each collection recolors the room into a self-contained world — **DRESS** in ivory-&-champagne
> quiet luxury, **GYM** in oxblood-on-black power, **SWIM** in azure-&-sun openness. Fraunces
> (optical display serif) carries every headline against Space Grotesk's quiet utility, with extreme
> size contrast (0.8rem labels → up to 10rem display) and generous air. Surfaces are sharp
> (radius ≤ 6px), structured by hairline rules and full-bleed imagery — **no cards, no boxes**.

Addresses — color: per-world recolor over a neutral base · type: Fraunces × Space Grotesk, high
contrast · spacing: airy, wide scale · components: sharp, hairline, image-and-type led.

**Assumption flagged for veto:** DRESS. The deployed DRESS world is warm-*dark* (`#171310` +
champagne gold) — reads "evening luxe." True old-money quiet luxury (The Row / Loro Piana) is
pale, undyed naturals in daylight. This rebuild introduces a **light DRESS register** (ivory /
oat / camel) as the dominant, keeping the dark as an evening/hero accent. If you want DRESS to
stay fully dark, say so.

### Interaction thesis
> Slow, cinematic scroll is the primary medium (Lenis smooth-scroll + GSAP scrub, 600–1200ms
> reveals on exponential ease-out). Each world announces itself through **one signature motion** —
> DRESS a restrained fabric-settle & drift, GYM a hard cut-and-lock with kinetic type, SWIM a
> buoyant light-caustic drift. Hover lifts imagery with a subtle scale (1.03) and a "View" cursor.
> **Never bounce, never elastic.** anime.js owns discrete UI micro-motion (120–220ms); StringTune
> drives the homepage scroll-story only; Three.js is reserved for a single 3D moment per world.
> `prefers-reduced-motion` collapses everything to instant crossfades.

Addresses — timing: slow scroll 600–1200ms / fast UI 120–220ms · hover: scale 1.03 + View cursor ·
scroll: scrubbed reveals, one signature per world · forbidden: bounce, elastic, motion-gated content.

---

## Foundations (global tokens)

These live in `:root` (base.css) and are partly fed by theme settings via `layout/theme.liquid`.

### Type
- **Display / headings:** `--display-font` = `"Fraunces", Georgia, serif` — weight 300–360, line-height ≤ 1.02, letter-spacing −0.015 to −0.03em (floor −0.04em; never tighter).
- **Body / UI:** `--ui-font` = `"Space Grotesk", system-ui, sans-serif` — weight 350, line-height 1.6.
- **Scale (fluid, existing):** `--step--1` … `--step-5`. Display hero ceiling = `--step-5` (≤ 10rem).
- **Labels/eyebrows:** `--step--1`, uppercase, letter-spacing 0.22em. Used deliberately, **not above every section** (an eyebrow on every section is an AI tell — see bans).
- Body measure capped 65–75ch. `text-wrap: balance` on h1–h3, `pretty` on prose.

### Spacing
- `--gutter: clamp(1.15rem, 4vw, 3.25rem)` (page inset)
- `--space: clamp(4rem, 10vw, 9rem)` (section rhythm — vary it, don't apply uniformly)
- Base unit 4px; steps 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96.

### Radii & surfaces
- `--radius: 2px` global (sharp). Per-world may lift to 6px (GYM/SWIM). **Never** ≥ 16px on a surface.
- Hairline rule = `1px solid var(--line)`. No side-stripe accents. No 1px-border + soft-shadow "ghost card" pairing.

### Motion tokens
| token | value | use |
|---|---|---|
| `--ease` | `cubic-bezier(0.22, 1, 0.36, 1)` | soft settle (default) |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | entrances/exits (exponential) |
| `--dur-fast` | 140ms | UI feedback (press, toggle) |
| `--dur` | 500ms | standard transition |
| `--dur-reveal` | 900ms | scroll reveal (scrubbed) |
| stagger | 60–90ms | list reveals |

No `ease-in` on UI. No bounce/elastic anywhere. Every animation has a `prefers-reduced-motion: reduce`
fallback (crossfade or instant). Only animate transform / opacity / filter / clip-path.

---

## The three worlds

Each world is a body-class palette block in base.css (`.template-collection-*`,
`.template-page-*`, `.cshow--*`). Values below are the **canonical, already-deployed** tokens
plus the rebuild's additions.

### DRESS — quiet luxury  ·  `template-page-dress-and-jackets`, `.cshow--dress`
- **Mood:** clean, old-money, undyed naturals, gallery daylight; restraint is the whole point.
- **Light register (new, dominant):** `--bg #F1ECE3` (oat) · `--surface #FAF7F1` · `--ink #1E1913` · `--muted #7A7062` · `--accent #B8935A` (champagne bronze) · `--line #DED6C8`.
- **Dark register (kept, evening/hero accent):** `--bg #171310` · `--ink #F2EBE2` · `--accent #C8A96A`.
- **Signature motion:** fabric-settle — imagery drifts up ~6% and settles; type fades in weight (300→360). Slow, no snap.
- **Do:** enormous whitespace, one hero garment, serif italic pull-quotes. **Don't:** color pops, fast motion, more than one accent.

### GYM — power  ·  `template-collection-gym`, `template-page-gym-wear`, `.cshow--gym`
- **Mood:** solidity, strength, kinetic. Red + black.
- **Palette (kept):** `--bg #0C0908` · `--surface #17100F` · `--ink #F5ECEC` · `--muted #C08A8A` · `--accent #E11D2A` (power red) · `--accent-2 #7A0C12` · `--line #3A1E1E` · `--radius 6px`.
- **Signature motion:** cut-and-lock — hard, fast reveals (no easing drift), kinetic uppercase type that locks into a grid; a single red wipe.
- **Do:** uppercase display, high contrast, motion that feels athletic. **Don't:** softness, pastel, slow fades, greenwashing/"0 waste" claims.

### SWIM — sun & open water  ·  `template-collection-swimwear`, `template-page-swimwear`, `.cshow--swim`
- **Mood:** relaxed, sensual, happy, sunlit. Blue + yellow.
- **Palette (kept):** `--bg #E9F7FF` · `--ink #063A5E` (deep ocean) · `--accent #00A6E0` (azure) · sun-yellow highlight `#FFF6D6`/`#FFD84D` on eyebrows.
- **Signature motion:** buoyant caustic drift — gentle vertical float, light-caustic shimmer over imagery, warm overexposed edges.
- **Do:** golden-hour warmth, generous crops, ease. **Don't:** cold/clinical blue, hard geometry, tension.

---

## Library lanes (no overlap, each earns its bytes)

| library | size | loaded | owns |
|---|---|---|---|
| Lenis | 18KB | every page | smooth scroll |
| GSAP + ScrollTrigger | 117KB | every page | scroll timelines, scrub, parallax, reveals |
| anime.js | 17KB | every page | discrete UI micro-motion — bag add, menu, badges, counters (120–220ms) |
| StringTune | 500KB | **homepage only** | declarative parallax + cursor of the scroll-story landing |
| Three.js | ~600KB | **on demand** | a single true-3D moment per world, only where raw WebGL/model-viewer can't |
| model-viewer | 1MB | PDP w/ 3D only | GLB product viewer (bundles its own three) |

Rule: PDPs and collection grids stay on Lenis + GSAP + anime only. Heavy libs are page-scoped.

---

## Non-negotiables

- **AI-model disclosure stays prominent.** Melina Jones Voss is a disclosed AI model — deliberate
  brand stance, never softened or buried.
- **Pre-launch copy:** no "in stock" / "ships in N days" (that's the dormant `ready_to_ship` toggle,
  OFF). No absolute environmental claims ("0 waste"). Relative phrasing ("no overstock") is the safe register.
- **Images:** `_min.webp` for cards/grids/plates; `.png` only for a page's single full-bleed hero.
- **Accessibility floor:** body contrast ≥ 4.5:1, visible focus, reduced-motion honored, responsive
  375 / 768 / 1024 / 1440.

## Build order (page by page — validate each before the next)

1. **Homepage** (`sections/*` + `templates/index.json` + `site/index.html`) — the scroll-story that ties the three worlds.
2. **DRESS** world (reference implementation of quiet-luxury register).
3. **GYM** world.
4. **SWIM** world.
5. **PDP** (`main-product`) — the register adapts per product's collection.
6. **Audit** (Phase 5) — full checklist, all breakpoints.
