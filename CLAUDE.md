# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A **custom Shopify Online Store 2.0 theme** (Liquid) for a print-on-demand apparel
brand fronted by "Melina," an AI brand model. It is a real theme that runs on
Shopify's servers — **not** a headless app. The repo owns only the front-end;
Shopify natively owns cart, checkout, payments, and POD fulfillment. There is no
backend, build step, or hosting to manage.

Because `.liquid` renders server-side on Shopify, **you cannot open theme files
directly in a browser** — preview through the Shopify CLI (or the static
`preview/` mockup, see below).

## Commands

Requires the Shopify CLI installed globally (`npm install -g @shopify/cli@latest`)
and Node >= 18. `npm install` only installs dev tooling (Theme Check + Prettier).

```bash
npm run dev      # shopify theme dev — live preview against a dev store, hot reload
npm run push     # shopify theme push — upload theme to the connected store
npm run pull     # shopify theme pull — pull store-side theme changes down
npm run lint     # shopify theme check (config in .theme-check.yml)
npm run format   # prettier --write over liquid/css/js/json/md
npm run format:check
```

`shopify theme dev` requires logging in and selecting a store
(`shopify theme dev --store your-store.myshopify.com`). Auth is via CLI login,
**not** tokens — `.env`/Storefront API tokens are only for optional headless
experiments and are not needed for normal theme work.

There is **no test framework** in this repo.

### Static preview (no Shopify needed)

`preview/index.html` is a plain-HTML homepage mockup that loads the *real*
`assets/base.css`, `assets/theme.js`, and `assets/loading.js`, so you can see the
look, loading screen, and scroll animations in any browser. Shopify ignores this
folder on upload; content is hardcoded with no live products/checkout.

```bash
python3 -m http.server 8000   # from repo root, then open http://localhost:8000/preview/
```

The loading screen shows once per browser session (clear sessionStorage or use a
private window to replay it).

## Architecture — the cross-file pieces that matter

### Design-token pipeline (settings → Liquid → CSS)
Tokens flow through three files; changing a customizer-driven token means editing
all three:
1. `config/settings_schema.json` — declares the customizer settings (fonts,
   colors, `page_width`).
2. `snippets/css-variables.liquid` — rendered inline in `<head>`; emits those
   settings as `:root` CSS custom properties, using Shopify's `font_face` /
   `font_modify` / color filters (this is why it runs in Liquid, not CSS).
3. `assets/base.css` — the full design system (reset, type scale, spacing,
   components, motion utilities) consuming the CSS variables. It also defines
   **static** tokens (spacing, fluid type scale, motion) and **fallback defaults**
   for the dynamic ones, so the theme renders even before settings load.

### Loading + animation handoff (theme.liquid → loading.js → theme.js)
`layout/theme.liquid` is the HTML shell. Load order is deliberate: it flips
`no-js`→`js` early (pre-hides reveal targets without FOUC), renders css-variables
+ base.css, then `defer`-loads GSAP + ScrollTrigger (from CDN), `loading.js`, and
`theme.js` in that order (`defer` preserves order; GSAP must be ready first).

- `assets/loading.js` animates the loader, then on `window load` (or a 3.5s
  safety cap) wipes it and calls `window.__themeHeroIntro`.
- `assets/theme.js` exposes `window.__themeHeroIntro` and wires scroll reveals +
  parallax. If no loader is present it plays the hero intro on `window load`
  itself.
- **Motion is opt-in via data attributes** — this is the contract sections use:
  `[data-reveal]` (fade/move in on scroll), `[data-reveal-group]` (staggers child
  `[data-reveal]`), `[data-parallax]` (+ optional `[data-parallax-scope]`),
  `[data-hero-intro]` and `[data-hero-stagger]` (hero entrance).
- **Graceful degradation is intentional:** if GSAP is missing or the visitor
  prefers reduced motion, everything is shown instantly and the loader is hidden.
  Preserve this when adding animations.

### Page composition (Online Store 2.0)
- `templates/*.json` decide which sections render on each page type.
- `sections/main-*.liquid` are the page bodies (product, collection, cart, etc.).
- `sections/header-group.json` / `footer-group.json` are section groups pulled in
  via `{% sections 'header-group' %}` in the layout.
- The rest of `sections/` are customizer-editable building blocks (hero,
  featured-collection, marquee, editorial, rich-text, announcement-bar), each with
  a `{% schema %}` block and often `presets`.
- **Section-scoped `<style>`/`<script>` are an accepted pattern here** — see
  `sections/hero.liquid`, which scopes CSS with `#hero-{{ section.id }}` and
  inlines its slideshow script. Blocks (e.g. hero "Slide" blocks) carry their own
  settings and `{{ block.shopify_attributes }}`.

## Conventions

- **Prettier with `@shopify/prettier-plugin-liquid`**: double quotes,
  `printWidth: 100`. Run `npm run format` before committing.
- **Theme Check** is relaxed on purpose (`.theme-check.yml`): `RemoteAsset` is
  disabled because GSAP is loaded from a CDN during scaffolding; `MissingTemplate`
  and `TranslationKeyExists` are off while the theme is incomplete; `UndefinedObject`
  excludes `snippets/css-variables.liquid`. Don't "fix" these without reason —
  re-enabling them (and self-hosting GSAP) is a planned production step.
- **Brand voice in copy is intentionally lowercase and casual** (e.g. "i make
  nice things", "yes, i'm AI"). Match it when editing customer-facing strings.
- UI strings live in `locales/en.default.json`.

## Sync note (Shopify ↔ GitHub)

Commit messages like `Update from Shopify for theme .../main` are auto-generated by
Shopify's GitHub integration — the store's theme editor commits back to this repo,
so changes can arrive from the Shopify side. Pull before starting work, and be
aware that `config/settings_data.json` in particular is frequently rewritten by the
store admin.

## More docs

`docs/` covers setup beyond code: `SHOPIFY_SETUP.md` (connect store, CLI + GitHub,
how checkout works), `POD_SETUP.md` (Printful/Printify), `DESIGN_SYSTEM.md`
(typography/color/motion rationale), `MELINA_ASSETS.md` (preparing brand imagery —
heroes currently use gradient placeholders).
