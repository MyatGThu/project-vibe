# Design System

The visual language for a **premium, editorial POD fashion brand**. The default
direction is implemented in the theme today; the alternatives are one settings
change away (see "Switching directions" below).

---

## 1. Typography — choose a direction

Three researched pairings, each pairing a **display** face (headlines, hero,
section titles) with a **text** face (body, UI, captions). All are on Google
Fonts and available in Shopify's font picker, so you can switch in the theme
customizer with no code.

### Direction A — "Editorial Luxe" ✅ *default*
- **Display:** Playfair Display — high-contrast transitional serif, timeless and
  elegant; the workhorse of luxury editorial layouts.
- **Text:** Inter — neutral, highly legible grotesque; disappears so the imagery
  and serif headlines lead.
- **Feels like:** Vogue-adjacent, refined, trustworthy. Safe premium default.

### Direction B — "Modern Fashion"
- **Display:** Instrument Serif — contemporary, slightly quirky high-fashion
  serif; reads current and design-forward.
- **Text:** Plus Jakarta Sans — geometric, friendly-modern sans.
- **Feels like:** A young, design-led label (think editorial streetwear).

### Direction C — "Haute Minimal"
- **Display:** Cormorant Garamond — delicate, high-contrast Didone-ish serif;
  very airy and boutique.
- **Text:** Montserrat — clean geometric sans.
- **Feels like:** Boutique, wedding-luxe, lots of whitespace.

> **Recommendation:** Start with **A (Editorial Luxe)** — it's the most robust
> across product photography and long-form copy. Move to **B** if you want the
> brand to feel younger / more design-led once Melina's campaign imagery sets the
> tone.

**Switching directions:** Online Store → Customize → Theme settings →
Typography → pick the Heading + Body fonts. Or change the defaults in
`config/settings_data.json` (`heading_font`, `body_font`) and the fallback stacks
in `snippets/css-variables.liquid`.

---

## 2. Type scale

Fluid scale using `clamp()` (defined in `assets/base.css`), roughly a
**1.25 (major third)** ratio, so headlines scale smoothly between mobile and
desktop.

| Token | Use | Approx range |
| --- | --- | --- |
| `--fs-900` | Hero display | 2.75 → 6rem |
| `--fs-800` | Page / section title | 2.25 → 3.75rem |
| `--fs-700` | Sub-section | 1.75 → 2.5rem |
| `--fs-600` | Card / lead | 1.4 → 1.75rem |
| `--fs-500` | Large body | 1.15 → 1.25rem |
| `--fs-400` | Body | 1rem |
| `--fs-300` | Small / caption | 0.85rem |
| `--fs-200` | Eyebrow / label | 0.75rem (tracked +0.12em, uppercase) |

---

## 3. Color palette (default "Bone & Bronze")

A restrained, warm palette that flatters apparel photography. Defined as tokens
in `snippets/css-variables.liquid`.

| Token | Hex | Role |
| --- | --- | --- |
| `--color-bg` | `#F6F3EE` | Page background (warm bone) |
| `--color-surface` | `#FFFFFF` | Cards, drawers |
| `--color-ink` | `#161413` | Primary text (rich near-black) |
| `--color-muted` | `#6E6A64` | Secondary text |
| `--color-line` | `#E5DFD6` | Hairline borders |
| `--color-accent` | `#B08D57` | Warm bronze — links, focus, small accents |
| `--color-ink-bg` | `#161413` | Dark sections (inverts to bone text) |

Keep accent usage **sparse** — premium brands lean on contrast and whitespace,
not color. Most "color" should come from Melina's imagery.

---

## 4. Spacing & layout

- **Spacing scale** (`--space-*`): `4, 8, 12, 16, 24, 32, 48, 64, 96, 128px`
  exposed as `--space-3xs … --space-3xl`.
- **Page width:** `--page-width` (default `1400px`), `--page-width-narrow`
  (`760px`) for long-form text.
- **Gutters:** fluid `--gutter` (clamps ~20→48px).
- **Radius:** `--radius-sm` 2px, `--radius` 6px, `--radius-lg` 14px (mostly
  square — luxe tends to sharp corners).

---

## 5. Motion principles

Animation should feel **intentional and quiet**, never bouncy.

- **Easing:** `--ease-out` `cubic-bezier(0.16, 1, 0.3, 1)` (primary),
  `--ease-in-out` `cubic-bezier(0.65, 0, 0.35, 1)`.
- **Durations:** micro `150ms`, base `400ms`, scene `700–900ms`.
- **Scroll reveals:** elements fade + rise ~24px as they enter (handled by
  `[data-reveal]` in `theme.js`). Stagger groups with `[data-reveal-group]`.
- **Parallax:** subtle only (`[data-parallax]`, ≤12% travel).
- **Loading screen:** brand mark + wipe, exits once assets load, then hands off
  to the hero entrance.
- **Accessibility:** everything is gated behind `prefers-reduced-motion`. When a
  visitor opts out, content appears instantly with no transform.

---

## Sources

- [Typewolf — 40 Best Google Fonts (2026)](https://www.typewolf.com/google-fonts)
- [LandingPageFlow — Google Font Pairings for 2026](https://www.landingpageflow.com/post/google-font-pairings-for-websites)
- [Ace & Whim — Free Google Fonts for Luxury Brands](https://aceandwhim.com/13-free-google-fonts-for-your-luxury-brand-website/)
- [GSAP — ScrollTrigger docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
