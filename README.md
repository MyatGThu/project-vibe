# Te Amo — a Shopify theme

A fashion Shopify **Online Store 2.0** theme fronted by an AI model (Melina Jones Voss),
built for scroll-stopping motion and in-place product discovery. Sells every kind of
clothing — eveningwear, everyday, **swimwear**, and **gym / activewear**; every
campaign image is AI-generated and openly disclosed.

## What's inside

| Feature | How |
|---|---|
| Smooth scroll + scroll reveals | **Lenis** + **GSAP ScrollTrigger** (vendored in `assets/`) |
| 3D product spins | **`<model-viewer>`** (lazy-loaded only when a product has a 3D model) |
| Hover → model reveal | Product card shows a faceless crop, reveals Melina on hover (`card--hide-face`) |
| Click → overlay, no page change | Native `<dialog>` quick-view: description, price, **size + quantity**, add to bag |
| Pinned horizontal lookbook | GSAP pin/scrub (`sections/lookbook.liquid`) |
| About page | `templates/page.about.json` — Melina, openly disclosed as an AI model |
| Attract models | `sections/model-call.liquid` — casting & collaboration CTA |

Everything respects `prefers-reduced-motion` and degrades gracefully without JS.

## Theme structure

```
layout/theme.liquid        sections/            snippets/product-card.liquid
config/settings_*.json      hero, marquee,      snippets/meta-tags.liquid
locales/en.default.json      featured-collection, assets/base.css   (one stylesheet)
templates/*.json             lookbook, manifesto, assets/motion.js   (Lenis + GSAP)
templates/customers/*.json   model-call, about-   assets/store.js    (quick-view, cart)
                             melina, main-*        assets/*.min.js    (vendored libs)
```

## Connect this repo to Shopify

1. In Shopify admin: **Online Store → Themes → Add theme → Connect from GitHub**.
2. Choose this repo (`MyatGThu/project-vibe`) and the branch `claude/shopify-tapstitch-theme-06pi5z`.
   The theme folders live at the branch **root**, which is what Shopify's integration requires.
3. **Customize** to preview. Edits made in Shopify's editor commit back to the branch automatically.
4. Local dev (optional): `shopify theme dev` (Shopify CLI) against a dev store — no repo link needed.

## Sell with Tapstitch

Shopify admin → **Apps → Shopify App Store** → search **"Tapstitch" (ODMPOD)** → Install →
design/sync products (title, price, variants) → **Publish**. Products appear in your catalog
and fulfil automatically. Set a `Collection` on the homepage "Featured collection" section and
the demo capsule is replaced by your real Tapstitch products.

## Swapping in Melina's imagery

The demo ships with generated Melina renders referenced by URL (hero, About, and a 6-piece
capsule). To make it yours: upload images in the theme editor (Hero, Lookbook, About sections
all have image pickers) or attach them to your Tapstitch/Shopify products — uploaded images
always take precedence over the demo URLs. Generate more looks from the Soul character
"Melina Jones Voss" in Higgsfield.

## Validate

```
npx @shopify/theme-check-node   # or: shopify theme check
```
