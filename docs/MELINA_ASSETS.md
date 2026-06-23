# Melina — Brand Model Asset Workflow

**Melina** is the brand's AI model. This is how we generate consistent imagery of
her wearing the POD products and wire it into the theme. We use the **Higgs Field
MCP** (connected in this Claude Code session) for generation.

---

## Principles

- **Consistency is everything.** Melina must look like the same person across
  every shot. Lock a **character reference** and reuse it for all generations.
- **Product fidelity.** The garment + print in the image should match the actual
  POD product as closely as possible (color, placement, fit).
- **Editorial direction.** Match the design system: warm, premium, lots of
  negative space, soft daylight or studio. Avoid busy backgrounds — Melina + the
  garment are the subject.

---

## Workflow (Higgs Field)

1. **Establish/lock Melina.** Check existing characters (`show_characters`,
   `show_reference_elements`). If Melina already exists as a character/reference
   element, reuse her ID. If not, create a reference set from her best images so
   future generations stay on-model.
2. **Recommend a model.** Use `models_explore(action:'recommend')` with the goal
   ("on-model fashion e-commerce photo of Melina wearing <product>") to pick the
   best image model before generating.
3. **Generate stills** (`generate_image`): hero shots (vertical + wide crops),
   lookbook frames, and per-product on-model photos. Generate multiple angles.
4. **Refine, don't re-roll:** `remove_background` for clean PDP cutouts,
   `upscale_image` to 2K/4K for hero/retina, `outpaint_image` to extend a shot
   into a full-bleed hero, `reframe` to retarget aspect ratios.
5. **Motion (optional):** `generate_video` for a short hero loop or a scroll-tied
   clip; `reframe` for aspect ratios.
6. **Export & place** (see below).

> Tip: keep a generation log (prompt, model, seed/refs, output) per asset so we
> can reproduce and stay on-model.

---

## Sizing & placement in the theme

| Use | Aspect | Notes |
| --- | --- | --- |
| Hero (desktop) | 16:9 or full-bleed | provide a 4:5 mobile crop too |
| Lookbook | 4:5 portrait | editorial, full-figure |
| Product gallery | 4:5 portrait | on-model first image |
| PDP cutout | transparent PNG | `remove_background` |
| Section accents | varies | use `reframe` to retarget |

- Drop final images in `assets/` (or upload to Shopify Files / product media).
- Hero/lookbook images are set via section settings in the theme customizer.
- Always provide descriptive `alt` text (accessibility + SEO).

---

## Disclosure & ethics

- Consider a subtle, honest disclosure that brand imagery is AI-generated where
  appropriate (some regions/platforms increasingly expect this).
- Ensure product mockups in imagery reflect what ships, to avoid misleading
  customers.

---

## Next action

When we reach **Phase 2**, the first step is to confirm whether Melina already
exists as a Higgs Field character/reference. If yes, we lock that ID; if not, we
build her reference set before generating campaign imagery.
