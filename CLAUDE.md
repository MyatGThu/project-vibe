# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A **Shopify Online Store 2.0 Liquid theme** ("Te Amo" — a women's-wear house fronted by
a disclosed AI model, Melina Jones Voss). There is **no build step**: Liquid is interpreted
server-side by Shopify, CSS/JS are hand-authored and vendored, and edits take effect only
when the theme is deployed to a store. The theme folders live at the repo **root** (Shopify's
GitHub integration requires this).

## Commands

There is no compiler, bundler, or test runner. The only tooling is the theme linter:

```bash
npx @shopify/theme-check-node     # validate Liquid/JSON (config in .theme-check.yml)
shopify theme dev                 # optional local preview against a dev store (Shopify CLI)
shopify theme check               # same as theme-check-node, via the CLI
```

`.theme-check.yml` intentionally disables `ParserBlockingScript` (the scroll/3D libs in
`assets/` are loaded deliberately) and `ImgWidthAndHeight` (every image sits in a CSS
`aspect-ratio` container). Keep those disabled unless the rendering strategy changes.

**Previewing without a store:** `preview/*.html` are standalone static mirrors of key pages
(open in a browser). They load `assets/base.css` and feed `store.js` via
`window.__PREVIEW_PRODUCTS__` instead of live Shopify product JSON. They are **dev-only QA
aids** — when you change section copy or markup, update the matching preview file so it
doesn't drift.

## Deploy & git workflow (read this — it is the #1 source of confusion)

**`git push` ≠ deploy.** The live store tracks the **`main`** branch through Shopify's GitHub
integration; whatever is on `main` is what the store renders. Development happens on the
feature branch (`claude/shopify-tapstitch-theme-06pi5z`), so **changes pushed to the branch
are invisible on the store until they are merged into `main`.** Symptom of forgetting this:
"I built X but the store still shows the old version."

- Merge the branch into `main` via a PR (squash-merge is the established pattern; PRs #32/#33/#34).
- After merging, realign the local branch with `main` (`git merge origin/main`) so it doesn't
  diverge — the branch is reused across PRs, so its individual commit SHAs are never ancestors
  of `main`, which makes it look "many commits ahead" even when the content is already merged.
- Do **not** create additional feature branches; keep using the one branch and merge it forward.
- The store should stay **password-protected** while pre-launch (see below).

## Architecture

**`layout/theme.liquid` is the Liquid→JS→CSS bridge.** It (1) writes theme settings into
`:root` CSS custom properties (`--bg`, `--ink`, `--accent`, `--display-font`, etc.), (2) sets
`<body class="template-{type} template-{type}-{suffix}">` — this body class is how per-page
and per-collection palettes are applied in `base.css` (e.g. `template-page-gym-wear`), and
(3) emits a `window.Theme` config object (routes, money format, `modelViewerSrc`) that the
scripts read. All styling flows through **one stylesheet, `assets/base.css`**, driven by those
CSS variables — there is no per-component CSS file.

**JavaScript is progressive enhancement, two files:**
- `assets/motion.js` — Lenis smooth scroll + GSAP ScrollTrigger reveals. No motion until the
  vendored libs load; `prefers-reduced-motion` is fully honored.
- `assets/store.js` — the quick-view `<dialog>`, variant/quantity selection, add-to-bag, cart
  drawer, and lazy `<model-viewer>` (loaded only when a product has a 3D model). It works
  against **either** live Shopify JSON (`/products/{handle}.js`) **or**
  `window.__PREVIEW_PRODUCTS__` for the static preview harness.
- Vendored libs (`gsap.min.js`, `lenis.min.js`, `scrolltrigger.min.js`, `model-viewer.min.js`)
  are committed, not npm-installed.

**The homepage (`templates/index.json`) is a scroll story, not a product grid.** In order:
(1) `sections/landing-3d.liquid` — a 3D-parallax collage hero of cross-world look tiles;
(2) three `sections/category-showcase.liquid` panels, one each for Gym / Swim / Dress, each
self-themed by a `.cshow--{theme}` block in `base.css` that redefines `--bg/--ink/--accent/...`
so all three worlds coexist on one page (NO prices — each panel links to its landing page);
(3) `sections/lookbook.liquid` ("Worn by Melina"), then `manifesto` + `model-call`. The
category-showcase parallax is **desktop-only** (motion.js, `[data-cshow]`, gated by `noScrollFX`);
on mobile the plate gallery collapses to a horizontal-scroll strip. Parallax depth per plate is
derived from its position in Liquid — deliberately **not** a schema setting (see sync gotcha below).

**Demo-fallback pattern (important when editing collection/homepage sections).** Sections
render real Shopify products when they exist, and fall back to hardcoded demo blocks when the
catalog is empty — see `sections/main-collection.liquid` and `sections/featured-collection.liquid`
branching on `collection.products.size` / an assigned collection, rendering
`snippets/demo-product-card.liquid` + `snippets/demo-preview-data.liquid` otherwise. This is
why the collection/homepage `templates/*.json` carry full demo product data inline.

**Header category switcher.** `snippets/collection-switcher.liquid` is the single source of
truth for the Gym/Swimwear/Dress tabs, rendered in **both** the desktop nav and the mobile
drawer (`sections/header.liquid`). It renders the store's "Featured tabs" menu if one is
assigned, else a hardcoded fallback to the three category landing pages (Gym / Swimwear / Dress),
each of which funnels to its collection via "Shop the collection". Edit the snippet once, not both
call sites. Each landing page is a `collection-story` template (`templates/page.{handle}.json`) that
self-themes via a `template-page-{handle}` palette block in `base.css`.

**Ready-to-ship mechanism.** A single setting, `settings.ready_to_ship` (schema group in
`config/settings_schema.json`), gates the "In stock" badge and the "ships in {ship_lead}" note
across product cards and the PDP (`product-card.liquid`, `demo-product-card.liquid`,
`main-product.liquid`). It defaults **OFF** — see pre-launch context below.

**Portfolio pages are a separate microsite.** When `template.suffix == 'portfolio'`,
`theme.liquid` swaps in `sections/portfolio-header.liquid` instead of the normal header group,
giving those pages their own chrome.

## Images & the image CDN (read before touching image URLs)

The Melina imagery is **not hosted by the store** — every look is hotlinked by absolute URL from
Higgsfield's CloudFront (`https://d8j0ntlcm91z4.cloudfront.net/user_.../hf_<date>_<time>_<uuid>.<ext>`),
set in section/template settings (`image_url`, `hover_image_url`, `hero_image_url`, `portrait_url`).
Two facts govern how you touch these:

- **Two variants per generation:** a heavy full-res `.png` (Higgsfield's `rawUrl`) and a light
  `_min.webp` (`minUrl`). Many full-res PNGs stacked on one page blow the mobile (iOS Safari) image
  decode/memory budget, so some silently fail to paint and show a broken-image (?) placeholder.
  **Use `_min.webp` for cards/grids/plates; keep each page's single full-bleed hero
  (`hero_image_url` / `portrait_url`) as the `.png`** — one image isn't the ceiling driver, and
  full-bleed is exactly where a downscaled webp would look soft.
- **The CDN is third-party and not owned**, so objects can purge (a broken image usually means a
  purged/mistyped object, not a CDN outage), and **this sandbox cannot reach that host** (the agent
  proxy returns 403 — curl/WebFetch to it are useless here). To check whether an image exists or
  find its `_min.webp`, use the **Higgsfield MCP** (`show_generations`, type `image`) — the source
  of truth. The durable fix (planned, not yet done) is to rehost every referenced image onto
  Shopify's own CDN (Content → Files) and repoint the URLs.

List exactly what the theme references with:
`grep -rhoE "hf_[0-9_]+[a-f0-9-]+(_min\.webp|\.png)" templates sections | sort -u`

## Repo-specific pitfalls

**Filter-precedence bug — this has bitten twice.** In `{{ obj | image_tag: alt: x | append: y }}`
or `{{ 'key' | t: n: v | date: '%Y' }}`, a trailing `| filter` binds to the **output of the
whole preceding chain**, not to the last named argument. It caused a stray "worn by Melina"
text node leaking out of product cards and the footer's `date`-gets-3-arguments crash.
**Fix: precompute the value into a variable with `assign`, then pass it as a single argument.**

**Shopify's GitHub sync silently rejects some section schema.** A `range` setting with a **decimal
`step`** (e.g. `"step": 0.05`) fails to sync, which drops the whole section file and 404s any
template that renders it — this bricked the homepage once. Keep `range` steps integer, or derive
the value another way (category-showcase derives its parallax depth from plate position rather than
a decimal `range`).

## Pre-launch business context (affects copy edits)

The store has **no real inventory yet** — the model is: proper techpack → samples → house
inventory → *then* flip products to in-stock. Until then:
- Do **not** add "In stock" / "ships in N days" claims to product copy (that's what the
  dormant `ready_to_ship` toggle is for — leave it OFF).
- Do **not** reintroduce absolute environmental claims like "0 Waste" (ACCC greenwashing risk;
  they were deliberately removed). "No overstock" style relative phrasing is the safe register.
- **Keep the AI-model disclosure** prominent — it is the brand's deliberate, defensible stance,
  not boilerplate to soften.
- `techpack/` holds garment specs, HTML tech packs, and annotated **SVG** technical flats (the
  Obsidian Trouser and Monolith Coat) — the flats are hand-authored vector line drawings, **not**
  AI renders. These are business/production documents, not theme code, and are not deployed by Shopify.
