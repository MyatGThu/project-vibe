# Shopify Setup — Store, Theme & Checkout

How this repo becomes a live storefront, and how checkout/payments actually work.

---

## 1. Create the store

1. Sign up at [shopify.com](https://www.shopify.com) (a free trial works; you can
   also create a **development store** via a free [Shopify Partners](https://www.shopify.com/partners)
   account to build before committing to a paid plan).
2. Note your store domain: `your-store.myshopify.com`.
3. Set the store to **password-protected** (Online Store → Preferences) while we
   build — see `layout/password.liquid` for the "coming soon" page.

---

## 2. Connect this theme

You have two ways to get this code onto the store. Use the CLI day-to-day; add
GitHub sync once you want pushes to deploy.

### Option A — Shopify CLI (recommended for development)

```bash
npm install -g @shopify/cli@latest

# Live local preview with hot reload (does not touch the live theme):
shopify theme dev --store your-store.myshopify.com

# Upload as an unpublished theme you can preview in admin:
shopify theme push --unpublished

# Pull customizer changes merchants made in admin back into Git:
shopify theme pull
```

### Option B — GitHub integration (recommended for deploys)

Shopify admin → Online Store → Themes → **Add theme → Connect from GitHub**.
Point it at this repo + branch. Shopify then keeps a theme in sync with the
branch, so merging to that branch deploys.

> **Workflow tip:** develop on a feature branch with `shopify theme dev`, open a
> PR, and let the GitHub integration track `main` (or a `production` branch) for
> deploys. Avoid editing the same files in the admin code editor and Git at once.

---

## 3. How checkout & payments work (important)

**Checkout is hosted by Shopify and lives *outside* the theme.** Our theme
controls everything up to and including the **cart / cart drawer**. The moment a
shopper clicks "Checkout," Shopify renders its own secure, PCI-DSS-compliant,
one-page checkout. This is *why*:

- We get a secure checkout for free — no payment plumbing to build.
- We can change the theme freely without breaking checkout.
- No theme (on any plan) can fully restyle the checkout HTML.

### Turning on payments
Settings → **Payments** → activate **Shopify Payments** (cards) and enable
wallets: **Shop Pay, Apple Pay, Google Pay, PayPal**. Wallets meaningfully lift
conversion for apparel — turn them on.

### How much can we customize checkout?
- **Standard plans:** brand the checkout via the **Checkout editor** (logo,
  colors, fonts, button style) so it matches our theme. We mirror these in the
  theme's design tokens for consistency.
- **Shopify Plus:** full **Checkout Extensibility** (UI extensions, custom
  fields, content blocks, Shopify Functions for payment/shipping logic).
- **Gone in 2026:** the old `checkout.liquid` and "Additional Scripts" were
  fully retired. Any checkout tweak now goes through the editor or
  extensibility — **not** theme code. So we never put checkout logic in this repo.

### Cart → checkout in this theme
- `templates/cart.json` + `sections/main-cart.liquid` render the cart page.
- The checkout button is a standard `name="checkout"` submit inside the cart
  `{% form 'cart' %}`, which hands off to Shopify's hosted checkout.

---

## 4. Plan considerations

- **Basic / Shopify (Standard):** enough to launch — custom theme, all sales
  channels, branded (not deeply customized) checkout.
- **Shopify Plus:** only needed later for advanced checkout logic, B2B, or very
  high volume. **Not required for launch.**

---

## 5. Pre-launch checklist

- [ ] Products imported from POD app (see `docs/POD_SETUP.md`)
- [ ] Payments + wallets enabled, test order placed
- [ ] Shipping zones/rates configured (POD apps can sync these)
- [ ] Taxes configured for your regions
- [ ] Checkout branded to match the theme
- [ ] Policies (refund, privacy, ToS, shipping) added
- [ ] Custom domain connected
- [ ] Analytics (Shopify + GA4) installed
- [ ] Theme passes `npm run lint`, Lighthouse pass on mobile
- [ ] Remove store password

---

## Sources

- [Shopify — Customizing/editing checkout & accounts](https://help.shopify.com/en/manual/checkout-settings/customize-checkout-configurations)
- [Shopify Theme Detector — Checkout Customization 2026](https://shopthemedetector.com/blog/shopify-checkout-customization/)
- [Shopify CLI for themes](https://shopify.dev/docs/themes/tools/cli)
- [Payment Customization Function API](https://shopify.dev/docs/api/functions/latest/payment-customization)
