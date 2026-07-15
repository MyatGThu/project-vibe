# Te Amo — storefront review + collection techpack flats

**Store reviewed:** https://uhvxrd-gq.myshopify.com/ · **Date:** 2026-07-15 · **Currency:** AUD
**Goal (as briefed):** build each techpack *exactly as the showcase looks*, with clear,
non-overlapping callout letters/descriptions and properly-addressed seams and cuts.

> This document is the bridge between the **live storefront** (what the customer sees) and the
> **factory-facing technical flats** in this folder. It is a business/production document — it is
> not deployed by Shopify.

---

## 1. What the store actually contains

The catalogue is **16 made-to-order products across three showcased collections** plus a one-item
front page. Everything is priced, sized XS–L, and currently `totalInventory: 0` (correct for
made-to-order, but see the checklist — inventory tracking should be off, not sold-out).

| Collection (live) | Handle | Products | Price band (AUD) |
|---|---|---:|---|
| **Gym** (Activewear) | `gym-collection` | 5 | $120 – $260 |
| **Swimwear** | `swimwear-collection` | 5 | $150 – $220 |
| **Dress / Autumn Capsule** | `collection-01-the-autumn-capsule` | 6 | $520 – $2,400 |

Full catalogue by collection:

- **Gym** — Contour Set $240 · Slipstream Zip $260 · Ascent Hoodie $220 · Traverse Short $140 · Ridgeline Tank $120
- **Swim** — Ink Maillot $220 · Tide One-Piece $210 · Dune Bikini $180 · Reef Triangle $170 · Cove Cover-Up $150
- **Autumn Capsule** — Halo Gown $2,400 · Null Suit $1,450 · Monolith Coat $1,290 · Liquid Slip $690 · Obsidian Trouser $580 · Vapor Knit $520

Every product image is an openly-disclosed AI render (Higgsfield `soul_v2`). The generation prompt
*is* the design brief — I read each one and drew the flats to the prompt, not to the render's
pixels, because (per the tech-pack, sheet 08) an AI render "contains seams that do not close and
drape no woven fabric produces." A flat has to capture the **silhouette + design intent** while
specifying **real, buildable** construction.

---

## 2. One photo per collection (the hero I built each flat from)

I could not download the image bytes into this environment (egress policy blocks the Shopify /
CloudFront CDNs), so the three heroes are also rendered to you live via the Higgsfield widget in
chat. For the record, each hero, its stable Shopify CDN image, and the exact showcase prompt:

### Gym → **The Contour Set** ($240)
![The Contour Set](https://cdn.shopify.com/s/files/1/0726/0468/0275/files/hf_20260713_151351_737f08ab-3002-4854-a30c-a6e0cc54c546.png?v=1783955826)
> "high-waisted sculpting legging and longline sports bra in matte graphite, seamless compression
> knit, second-skin fit."
>
> ⚠️ **v01 also borrowed detail from two *other* homepage looks** — the Forge-Legging prompt (*contour
> seaming that follows the leg line*) and the Power-Bra prompt (*longline racerback, clean flat seams*).
> Those are different garments; their seams don't appear on the Contour Set's own render, which is
> seamless. **v02 drops them and draws to the Contour Set's own prompt** (seamless / second-skin).

### Swim → **The Ink Maillot** ($220)
![The Ink Maillot](https://cdn.shopify.com/s/files/1/0726/0468/0275/files/hf_20260713_151356_b12f66c1-f7a1-4b04-ac6c-6f69885075e9.png?v=1783955835)
> "sculptural high-leg one-piece swimsuit in ink black, plunging square neckline, open back, matte
> fabric." — fully lined.

### Dress / Autumn Capsule → **The Obsidian Trouser** ($580)
![The Obsidian Trouser](https://cdn.shopify.com/s/files/1/0726/0468/0275/files/hf_20260712_091438_0f50da26-d92a-45d1-aabc-ded6a06a4a7a.png?v=1783954169)
> "high-waisted **wide-leg** trousers in ink-black wool styled with a champagne silk shell and a
> minimal leather belt."

*(The Obsidian Trouser is the piece that already has a full workbook —
`TeAmo_TR001_ObsidianTrouser_TechPack_v01.xlsx` — so it is the natural techpack hero for the
tailoring/dress world; the Monolith Coat and Halo Gown are the runway faces of that collection.)*

---

## 3. The flats produced (this folder)

Each flat is a scaled front + back line drawing, drawn to the showcase silhouette, with a
**lettered callout system**: small A/B/C markers sit on the drawing with short leader lines, and
**every description lives in a tidy legend column** — so no prose floats over the art and nothing
overlaps. A line-key, key-measures / POM block, and fabric/colour block sit alongside.

| File | Style | Collection | Views | Callouts |
|---|---|---|---|---|
| `TR-001_ObsidianTrouser_flat_v02.svg` | TR-001 | Dress / Autumn | Front + Back | A–K |
| `AW-001_ContourSet_flat_v02.svg` | AW-001 | Gym | Bra F/B + Legging F/B | A–I |
| `SW-001_InkMaillot_flat_v01.svg` | SW-001 | Swim | Front + Back | A–J |

Each flat carries the chosen **showcase reference image** (top of the right column, loaded from the
store's Shopify CDN) so the sheet shows the exact render it is drawn to. All three were put through an
adversarial review pass (silhouette match, callout overlaps, category-correct construction, clipping)
and revised: the trouser was redrawn true wide-leg with back darts + corrected leg-opening measures;
the Contour bra neckline was raised and the flatlock/coverstitch legend disambiguated; the Maillot got
its coverstitch topstitch drawn and its back labelled a deep V to match the art.

`TR-001_ObsidianTrouser_flat_v01.svg` (the earlier straight-leg draft) is kept for version history —
v02 supersedes it. `AW-001_ContourSet_flat_v01.svg` (the cut-and-sew draft, drawn partly from the
Forge-Legging and Power-Bra prompts) is likewise kept for history — **v02 supersedes it**, redrawn
seamless to the Contour Set's own render.

### Seams & cuts addressed on each flat
- **Obsidian Trouser** — waistband join, fly (left-over-right J-stitch), slant pockets, **side seam
  pressed open**, **inseam pressed open**, **centre-back seam** (double-stitched, 1.5 cm let-out SA),
  blind hem, pressed crease, no back pockets. Tailoring seams — *not* serged closed.
- **Contour Set (v02, seamless)** — knit-in high waistband, **seamless body — no side or sculpt
  seams** (compression + shaping knit-in), **knit-in gusset** (no bartacks), clean ankle hem
  (laser-cut / narrow coverstitch); bra neckline/armhole bonded-elastic binds, smooth racer back,
  longline knit-in underband, **molded / bonded bust support** (no sewn bust seam). Seamless knit —
  circular-knit / bonded, *not* cut-and-sew flatlock. *(v01 kept the cut-and-sew flatlock build for
  a factory that samples that route.)*
- **Ink Maillot** — square-plunge neckline (elastic-applied), continuous straps, bust princess
  support seam, **fully lined** (power mesh), high-cut leg openings (elastic), **gusset** (lined,
  bartacked), **open-back deep V** (elastic), **centre-back seam**, **side seam 3-thread overlock**.
  Swim edges — elastic-applied, *not* topstitched-only.

---

## 4. Findings that matter for the goal

1. **Wide-leg vs tapered conflict (Obsidian Trouser).** The showcase is **wide-leg**, but the
   workbook POM (knee 22.6 / leg-opening 19.8, ½) specifies a **tapered** leg. The v02 flat is drawn
   wide-leg to match the showcase and carries a red SILHOUETTE NOTE: to actually build the showcase
   look, widen knee & hem (≈ leg opening 24–25 ½). **This is a decision to make before pattern.**
2. **Four categories = four supply chains (sheet 09).** Tailoring (lockstitch/press), activewear
   (coverstitch/flatlock/elastic), and swim (overlock/elastic-applicator/lining) are *different
   factories and machines*. The three flats deliberately use category-correct construction language;
   don't let a factory quote one category's method for another.
3. **Only the trouser has a workbook.** AW-001 and SW-001 flats carry a **KEY POM — build on sample**
   block (measure points, values TBD) and a category spec block, because no BOM/POM/construction
   workbook exists for them yet. Each needs its own workbook (mirroring the Obsidian one) before a
   factory can quote accurately.
4. **Store hygiene (from the supplied checklist, still open).** Store name is still "My Store";
   keep it **password-protected** pre-launch; the AI-model disclosure is the brand's best asset —
   keep it prominent. These are storefront tasks, not techpack tasks, and are tracked in
   `storefixchecklist.md`.

---

## 5. What each flat still needs before it goes to a factory

- **A flat is not a pattern.** All three say DRAFT / not-to-scale / not-graded. A patternmaker must
  validate proportions and grade (sheet 08).
- **Named fabric or a physical swatch** — a gsm range is a category, not a fabric (sheet 02/08).
- **POM values** for AW-001 and SW-001, measured on the first proto **relaxed AND stretched**
  (recovery is the fit for knit/swim).
- **The brand name** — you cannot print a woven label for a house whose store title is "My Store"
  (sheet 08). This blocks trims across every collection.
