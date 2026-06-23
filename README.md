# Project — Shopify

A bespoke **Shopify Online Store 2.0 theme** for a print-on-demand (POD) apparel
brand, featuring **Melina** (an AI brand model) styled in the products. The
storefront is built for a premium, editorial feel: custom typography, GSAP
scroll animations, an animated loading screen, and hand-built landing sections.

Because it's a real Shopify theme (not a separate headless app), **cart,
checkout, payments, and POD fulfillment all work natively** through Shopify — we
own the front-end code; Shopify owns the secure checkout.

---

## Why a custom theme (and not "edit a theme in Shopify" or headless)

| Approach | Animation freedom | Infra | Who owns the code |
| --- | --- | --- | --- |
| Buy a theme + edit in Shopify admin | Low | None | Shopify (you rent) |
| **Custom theme — this repo** | **High** | **None (Shopify hosts)** | **You (Git)** |
| Headless (Hydrogen / Next.js) | Highest | High (separate hosting) | You |

We chose the **custom theme**: maximum design freedom with native checkout and
the least infrastructure to maintain. See `docs/SHOPIFY_SETUP.md` for how the
theme connects to a live store.

---

## Repository structure

```
.
├── assets/            # CSS, JS (incl. GSAP init), fonts, static images
│   ├── base.css       # Design system: tokens, layout, components, motion utils
│   ├── theme.js       # GSAP ScrollTrigger reveals, parallax, reduced-motion
│   └── loading.js     # Animated loading-screen controller
├── config/
│   ├── settings_schema.json  # Theme customizer settings (fonts, colors, layout)
│   └── settings_data.json    # Default saved settings
├── layout/
│   ├── theme.liquid          # Main HTML shell (loads tokens, GSAP, sections)
│   └── password.liquid       # "Coming soon" / password page shell
├── locales/
│   └── en.default.json       # UI strings
├── sections/          # Reusable, customizer-editable blocks
│   ├── header-group.json / footer-group.json   # Section groups
│   ├── header.liquid / footer.liquid / announcement-bar.liquid
│   ├── hero.liquid                 # Animated campaign hero (design showcase)
│   ├── featured-collection.liquid  # Scroll-revealed product grid
│   ├── rich-text.liquid
│   └── main-*.liquid               # Page bodies (product, collection, cart, …)
├── snippets/
│   ├── css-variables.liquid        # Font faces + design tokens (Liquid-driven)
│   └── loading-screen.liquid       # Loader markup
├── templates/         # JSON page templates (Online Store 2.0)
└── docs/              # Setup & design documentation
```

---

## Documentation

- **`docs/DESIGN_SYSTEM.md`** — typography proposals (3 directions), color
  palette, spacing/type scale, and motion principles.
- **`docs/SHOPIFY_SETUP.md`** — create the store, connect this theme (Shopify
  CLI + GitHub), how checkout works, plan considerations.
- **`docs/POD_SETUP.md`** — Printful vs Printify, install + product workflow.
- **`docs/MELINA_ASSETS.md`** — generating Melina imagery with Higgs Field and
  using it across the theme.

---

## Quick start (local development)

You develop the theme locally and preview it against a real (dev) store.

```bash
# 1. Install the Shopify CLI (https://shopify.dev/docs/themes/tools/cli)
npm install -g @shopify/cli@latest

# 2. Log in and connect to your store
shopify theme dev --store your-store.myshopify.com

# 3. (optional) Lint + format
npm install            # installs Theme Check + Prettier (dev only)
npm run lint           # shopify theme check
npm run format         # prettier (Liquid-aware)
```

`shopify theme dev` gives you a live local preview with hot reload. When ready,
`shopify theme push` uploads it to the store. See `docs/SHOPIFY_SETUP.md`.

> **Note:** This is a Shopify theme — the `.liquid` files render on Shopify, so
> opening them directly in a browser won't work. Always preview via the CLI.

---

## Roadmap

- [x] **Phase 0 — Scaffold + design system** *(this commit)*: theme skeleton,
      design tokens, animated loading screen + hero showcase, full docs.
- [ ] **Phase 1 — Landing + loading page**: finish the homepage narrative
      (pinned scroll sequences, marquee, lookbook), polish the loader.
- [ ] **Phase 2 — Melina assets**: generate campaign imagery with Higgs Field,
      wire into hero/lookbook/product media.
- [ ] **Phase 3 — Product + collection design**: PDP, collection grid, filtering,
      cart drawer.
- [ ] **Phase 4 — Commerce setup**: connect store, install POD app, configure
      payments, shipping, and checkout branding.
- [ ] **Phase 5 — Launch**: domain, password-off, analytics, QA, performance.
