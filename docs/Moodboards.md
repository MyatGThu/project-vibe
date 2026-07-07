# Moodboards — registry & how to add them to the setup

**Status (verified 2026-07-07):** the Higgs Field **Soul moodboard/style presets are UI-only** through
the connector. There is *no* MCP endpoint that lists them, and the Soul 2 `generate_image` tool ignores
`style_id`/`style_strength`. This file is the workaround: a registry of moodboard `style_id`s we harvest
from the UI, plus the procedure to add more.

## What the connector CAN and CAN'T enumerate

| Connector surface | Returns | Is it the Soul moodboard? |
|---|---|---|
| MCP resources (`ListMcpResourcesTool` server=Higgs_Field) | UI widget HTML only | ❌ |
| `presets_show` | image→video motion presets (`higgsfield_preset` + `preset_id`) | ❌ different system |
| `shorts_studio_list_presets` | Shorts Studio reel restyles | ❌ different system |
| `show_marketing_studio` type=`image_style`/`ad_format` | curated DTC-ad formats | ❌ different system |
| `models_explore(get soul_2)` | errors | — |
| `generate_image` soul_2 + `style_id` | **stripped**: "Soul 2.0 does not support this parameter" | ❌ |

Soul style assets live at `https://cdn.higgsfield.ai/soul-v2-style/<uuid>.webp` — but no list API is exposed.

## Registry (name → style_id)

Harvested from generation history (`show_generations` → `params.style_id` / `params.style`).

| Moodboard | `style_id` | Default strength | Preview asset |
|---|---|---|---|
| **General** *(connector default for soul_2)* | `3db34ab5-3439-4317-9e03-08dc30852e69` | 1.0 | `soul-v2-style/f33d85f2-6521-4fa8-8e8f-894cfbdee578.webp` |
| **Muted cool film** | `a15510bf-2439-4964-a2cc-0e35d1b5e70f` | 0.5 | — |

**UI Curated presets still needing ids** (from the moodboard panel — capture per the procedure below):
General ✅ · Warm ambient · Y2K studio · Swag era · Theatrical light · Y2K street · … (scroll for more)
**Custom (My Moodboards):** `MELINA J…` — id unknown; capture it.

## Procedure — add a moodboard to this registry

1. In the Higgs Field **UI**, pick the moodboard (Curated or your MELINA J… board), generate **one**
   image with the Soul selected.
2. Back here, I call `show_generations(type='image')` and read that job's
   `params.style_id`, `params.style.name`, `params.style.url`, `params.style_strength`.
3. I add the row to the table above. Repeat per moodboard you care about.

> Once captured, the ids are reproducible in the UI and ready if/when the connector adds `style_id`
> support for Soul. Today they still can't be passed through `generate_image` for `soul_2`.

## Fallback that works TODAY — replicate a moodboard as an Element

For **non-Soul** models (`gpt_image_2`, `nano_banana_2/flash`, `seedream_*`, `seedance_2_0`, `kling3_0`)
the aesthetic can be carried via a reference **Element** instead of a Soul style:

1. Collect 3–6 images that embody the mood (your MELINA J… board images, or a curated look).
2. `show_reference_elements(action='create', category='environment'|'auto', medias=[{id,url,type}])`
   — the backend fetches the URLs (no local egress needed).
3. Embed `<<<element_id>>>` in the `generate_image`/`generate_video` prompt alongside the `Melina-JV`
   identity element. The look transfers even though Soul's `style_id` can't be set.

Identity element already built: `Melina-JV` = `0ca6a093-92c1-4ef7-a50e-e3e7af7e214e`.

---
*See `PRODUCTION_SYSTEM.md` §7 for the broader moodboard/Elements discussion.*
