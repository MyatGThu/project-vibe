# Print-on-Demand Setup

POD apps handle production, fulfillment, and shipping. You design products, they
print + ship per order, and orders flow in automatically from Shopify. No
inventory, no upfront cost.

---

## Printful vs Printify — which to use

| | **Printful** | **Printify** |
| --- | --- | --- |
| Production | Own facilities (5 centers) | Network of 100+ third-party providers |
| Quality control | Tighter, more consistent | Varies by provider |
| Base cost | Higher | Lower (often ~$4 less per tee) |
| Subscription | None | Free plan; Premium ~$29/mo (lower base costs) |
| Integrations | More (21) | Fewer (11) |
| Best for | Brand-consistent apparel | Price-sensitive + variety |

*(Printful and Printify announced a merger in late 2024 but still operate as
separate brands.)*

**Recommendation for this brand:**
- Lead with **Printful** for core apparel — consistency matters when Melina is
  modeling the hero products and customers expect the photo to match.
- Optionally add **Printify** later for accessories / wider catalog at lower
  cost. You can run **both apps in one store** without conflict.

---

## Setup steps

1. **Install the app:** Shopify App Store → search **Printful** (or **Printify**)
   → Install. Connect it to the store (≈2 minutes).
2. **Create products:** in the POD app, pick a blank (e.g., a premium tee),
   upload the artwork, set print placement, choose variants (size/color).
3. **Mockups → media:** the app generates mockups, but for the storefront we'll
   primarily use **Melina campaign shots** (see `docs/MELINA_ASSETS.md`). Use POD
   mockups as secondary/detail images and for variant swatches.
4. **Publish to Shopify:** push the product; it appears in Shopify Products with
   variants, pricing, and images. Organize into **Collections** (e.g., "New",
   "Tees", "Outerwear") — the theme's `featured-collection` section renders these.
5. **Pricing:** set retail = base cost + margin. Check the live profit after the
   POD app's base cost + your shipping strategy.
6. **Shipping:** let the POD app sync live shipping rates, or set flat-rate /
   free-shipping in Shopify (often simplest for conversion — bake cost into price).
7. **Test order:** place a real order (you can cancel/refund) to confirm the flow
   end-to-end before launch.

---

## How POD images feed the theme

- **Hero / lookbook:** Melina imagery (Higgs Field) — the brand-defining shots.
- **Product gallery:** Melina shot(s) first, then POD flat mockups + detail
  crops.
- **Variant swatches:** POD mockup per color, or solid color chips.

---

## Sources

- [Shopify — Printful vs Printify (2026)](https://www.shopify.com/blog/printful-vs-printify)
- [Style Factory — Printful vs Printify (2026)](https://www.stylefactoryproductions.com/blog/printful-vs-printify)
- [Printful — Shopify integration](https://www.printful.com/integrations/shopify)
