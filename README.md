# Te Amo — a Shopify theme

A fashion Shopify **Online Store 2.0** theme fronted by a disclosed AI model
(Melina Jones Voss). The homepage is a **scroll story**, not a product grid, and the
whole theme is built for award-style motion with in-place product discovery. Sells
every kind of clothing — eveningwear, everyday, **swimwear**, and **gym / activewear**;
every campaign image is AI-generated and openly disclosed.

## What's inside

| Feature | How |
|---|---|
| Smooth scroll + scroll reveals | **Lenis** + **GSAP ScrollTrigger** (vendored in `assets/`) |
| Homepage scroll story | 3D-parallax landing flythrough → three self-themed category worlds (Gym / Swim / Dress) → lookbook → manifesto → casting call (`templates/index.json`) |
| Editorial photo grammar | Masked clip-path reveals, in-frame parallax, and a floating "View" cursor on the portfolio grid + lookbook (`.photo-reveal` — `assets/base.css` + `assets/motion.js`) |
| Pinned horizontal lookbook | GSAP pin/scrub + in-frame horizontal parallax (`sections/lookbook.liquid`) |
| Melina portfolio microsite | A dark portfolio page with its own chrome, swapped in when `template.suffix == 'portfolio'` (`sections/melina-portfolio.liquid`) |
| 3D product spins | **`<model-viewer>`** (lazy-loaded only when a product has a 3D model) |
| Hover → model reveal | Product card shows a faceless crop, reveals Melina on hover (`card--hide-face`) |
| Click → overlay, no page change | Native `<dialog>` quick-view: description, price, **size + quantity**, add to bag |
| Attract models | `sections/model-call.liquid` — casting & collaboration CTA |

Everything respects `prefers-reduced-motion` and degrades gracefully without JS. The
scroll-jacking effects (3D flythrough, category parallax, lookbook pin, in-frame
parallax, "View" cursor) are **desktop-only** — mobile/touch falls back to calm native
scrolling and swipe strips.

`assets/` also carries two extra scroll modules — a scroll-velocity photo wall
(`.gallery`) and a photo vortex (`[data-vortex]`) — that are wired in JS/CSS but not
currently placed on any template.

## Theme structure

```
layout/theme.liquid          assets/base.css     one stylesheet (CSS-var driven, no per-component CSS)
config/settings_*.json       assets/motion.js    Lenis + GSAP orchestration
locales/en.default.json      assets/store.js     quick-view, cart drawer, lazy model-viewer
templates/*.json             assets/*.min.js     vendored gsap / lenis / scrolltrigger / model-viewer
templates/customers/*.json   sections/           landing-3d, category-showcase, lookbook,
snippets/                                         melina-portfolio, manifesto, model-call, main-*, …
preview/*.html · site/*.html dev mirrors (open in a browser; site/* is the GitHub Pages build)
images/                      staged campaign renders (not yet referenced by the theme)
techpack/                    garment specs, HTML tech packs, SVG flats — production docs, not deployed
```

## Connect this repo to Shopify

The live store tracks the **`main`** branch through Shopify's GitHub integration —
whatever is on `main` is what the store renders. Development happens on a feature
branch and is merged into `main` via PR, so **changes are invisible on the store until
they are merged** (`git push` to a feature branch is not a deploy).

1. Shopify admin: **Online Store → Themes → Add theme → Connect from GitHub**.
2. Choose this repo (`MyatGThu/project-vibe`) and the **`main`** branch. The theme
   folders live at the repo **root**, which Shopify's integration requires.
3. **Customize** to preview. Edits made in Shopify's editor commit back automatically.
4. Local dev (optional): `shopify theme dev` (Shopify CLI) against a dev store — no
   repo link needed. Standalone previews: open `preview/*.html` in a browser.

## Sell with Tapstitch

Shopify admin → **Apps → Shopify App Store** → search **"Tapstitch" (ODMPOD)** → Install →
design/sync products (title, price, variants) → **Publish**. Products appear in your catalog
and fulfil automatically. Assign a `Collection` to the homepage / collection sections and the
hardcoded demo capsule is replaced by your real Tapstitch products (the demo-fallback pattern).

## Swapping in Melina's imagery

The demo ships with generated Melina renders referenced by URL (hero, About, lookbook, and
a capsule of looks). To make it yours: upload images in the theme editor (Hero, Lookbook,
About, and portfolio sections all have image pickers) or attach them to your Tapstitch/Shopify
products — uploaded images always take precedence over the demo URLs. Generate more looks from
the Soul character "Melina Jones Voss" in Higgsfield.

## Validate

```
npx @shopify/theme-check-node   # or: shopify theme check
```
