# Knights — Product Brief

**Brand:** Knights
**One-liner:** Men's leather jackets — the jacket as *modern armor*.
**Register:** brand-led commerce (editorial storefront; design carries the brand, Shopify runs the checkout).
**Platform:** web — static site (GitHub Pages) → integrated with Shopify.

## Concept
Knights = a code, worn. The leather jacket as the modern man's armor — protection, quiet
strength, restraint. NOT medieval-literal (no crests, chainmail, or gothic kitsch). The idea of
armor expressed through Swiss-editorial discipline: structure, negative space, and one honest
material — leather — treated with reverence.

## Audience
Men, ~25–40, style-literate, value craft and longevity over trend. Willing to invest in one
excellent leather jacket. Read GQ/Aesop/COS/Saint Laurent as reference points, not fast fashion.

## Product
- Launch: **one** hero product — a men's leather jacket.
- Line will expand into more menswear — architecture must add products without a rebuild.

## Team (About page)
Myat Thu · Alex Kyaw · Yan Naing · Soe Min Thant · Saw Prince — a five-person founding team.

## Pages (4)
1. **Home** — logo-led (the KNIGHTS wordmark is the hero), manifesto, into the jacket.
2. **Products** — the leather jacket + editorial PDP; grid ready for more.
3. **About** — the five founders + the brand code (armor story).
4. **Contact** — enquiry form + details.

## Commerce & tech
- Front-end: vanilla HTML/CSS/JS (no build step) — portable, Pages-friendly, Shopify-friendly.
- Motion: GSAP (ScrollTrigger) + Anime.js.
- Cart / checkout / customer accounts: **Shopify Storefront API + Buy Button SDK** — the static
  front-end stays on Pages; Shopify runs commerce. Product/cart wiring swaps to real store creds
  on integration.
- Deploy: **GitHub Pages first**, then connect Shopify.

## Success criteria
- Reads unmistakably editorial/Swiss — could not be mistaken for a template.
- The signature stacking-scroll works on desktop + mobile, with a full reduced-motion fallback.
- Every page is a11y-clean and fast; nothing blocks content on JS.
- Commerce hooks are real integration points, not fake buttons.
