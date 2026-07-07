# Soul 2 Media Production System — Melina Jones Voss

**The operating system for turning the Melina character bible into Instagram / Threads /
X / TikTok content, using the Higgs Field connector.**

This document is the bridge between three things:

1. **The character bible** — `docs/Melina_Master_Reference.md` (Rev 3.0). The single source of
   truth for who Melina is, what she looks like, and what is brand-safe.
2. **The Higgs Field connector** — the MCP tools that actually generate the images and videos.
3. **This repo** — where the finished, named assets live (`Image_Soul2/`, `Video_Soul2/`).

> If the bible and this document ever disagree on *identity* (eyes, skin, freckles, hair, hands),
> **the bible wins**. This document only owns the *process*: naming, routing, folders, and the
> connector calls.

---

## 1. The character (the one fixed input)

| Field | Value |
|---|---|
| **Name** | Melina Jones Voss |
| **Higgs Field type** | `soul_2` (Soul 2.0 — a trained, reusable identity) |
| **`soul_id`** | `63d8ff04-4518-463f-84ac-8a3d5ddd7192` |
| **Status** | `ready` |
| **Home base / persona** | Melbourne, AU · relatable-glam · openly AI |

Because Melina is a **trained Soul**, the identity is injected by the `soul_id` — this is the
bible's **Route B**. So prompts are **scene-only**: pose, wardrobe, setting, light, mood, and any
explicit *override* (a hair restyle). **Do not** paste the full Identity Lock into the prompt, and
**do not** restate eye/skin/freckle colour (say "grey-green / pale cool" at most). See bible Part 0
and Part 5.

---

## 2. The pipeline (bible → connector → repo)

```
                        ┌─────────────────────────────────────────────┐
   character bible ───► │  1. AUTHOR PROMPT  (scene-only, flag-safe)  │
   (identity + rules)   └───────────────────┬─────────────────────────┘
                                            ▼
                        ┌─────────────────────────────────────────────┐
   Higgs Field  ──────► │  2. IMAGE   generate_image(model=soul_2,     │
   connector            │             soul_id=…, aspect, quality=2k)   │
                        └───────────────────┬─────────────────────────┘
                                            ▼   (QC vs Identity Lock — bible Part 6)
                        ┌─────────────────────────────────────────────┐
                        │  3. NAME + SAVE  →  Image_Soul2/<slug>.png   │
                        │     record Title + job_id in MANIFEST        │
                        └───────────────────┬─────────────────────────┘
                                            ▼   (only stills marked "Animate: YES")
                        ┌─────────────────────────────────────────────┐
   Higgs Field  ──────► │  4. VIDEO   generate_video(model=seedance_2_0│
   connector            │             start_image = the image job_id)  │
                        └───────────────────┬─────────────────────────┘
                                            ▼
                        ┌─────────────────────────────────────────────┐
                        │  5. NAME + SAVE  →  Video_Soul2/<slug>.mp4   │
                        │     video slug is DERIVED from the image     │
                        └───────────────────┬─────────────────────────┘
                                            ▼
                        ┌─────────────────────────────────────────────┐
   content skills ────► │  6. CAPTION / SCHEDULE / DISCLOSE → platforms│
   (*-sms, hook, etc.)  │     Instagram · Threads · X · TikTok         │
                        └─────────────────────────────────────────────┘
```

### Which connector tool for which job

| Step | Tool | Notes |
|---|---|---|
| Still portrait / fashion / UGC | `generate_image` · `model: soul_2` | `soul_id` + `quality: 2k`. Aspect: `9:16` Reels, `3:4` feed, `1:1` X. |
| One-off character ref (no Soul) | `generate_image` · `nano_banana_pro` | Fallback only; Melina is a trained Soul, prefer `soul_2`. |
| Animate a still (identity-safe) | `generate_video` · `model: seedance_2_0` | Identity comes from the **start frame** — use high-identity, **eyes-visible**, front-on stills. |
| Multi-shot / dance / audio-synced | `generate_video` · `model: kling3_0` | For anchor pieces only (higher drift). |
| Fast single-frame animation | `generate_video` · `model: kling3_0_turbo` | Cheap motion beats. |
| Upscale finals | `upscale_image` / `upscale_video` | 2K/4K masters for hero posts only. |
| Reframe for another platform | `reframe` | e.g. take a 9:16 Reel to 1:1 for X. |
| Cutout / transparent | `remove_background` | product/composite work. |
| Check spend | `balance` / `get_cost: true` | Always preflight video cost. |

### Cost reality (measured, this workspace)

- **`soul_2` image, 2k** ≈ **0.12 credits** each — effectively free; generate freely, keep the best.
- **`seedance_2_0` video, 5s / 720p / std** ≈ **22.5 credits** each — the expensive step.
  **Draft-first, animate only "YES" stills, keep the still as the fallback** (bible §4.3, §4.5).

---

## 3. Naming — the rules the request is built on

Two hard requirements from the brief:
**(a) every image has a proper Title; (b) every video's name is derived from the image it came from.**

### 3.1 Image slug

```
MEL_<NNN>_<PILLAR>_<Title-In-Kebab>_<aspect>.png
```

| Part | Meaning | Example |
|---|---|---|
| `MEL` | Melina / Soul 2 prefix (constant) | `MEL` |
| `<NNN>` | zero-padded running number, never reused | `006` |
| `<PILLAR>` | content-pillar code (see §4) | `AI` |
| `<Title-In-Kebab>` | the human **Title**, hyphenated, Title-Case | `Intro-Anchor-Portrait` |
| `<aspect>` | frame shape, `x` for `:` | `9x16` |

**Example** → `MEL_006_AI_Intro-Anchor-Portrait_9x16.png`
**Human Title** (stored in the manifest) → *"Intro Anchor — Openly AI"*

### 3.2 Video slug — derived from the image

```
<image-slug-without-aspect>__<CameraMove>_<Ns>.mp4
```

Take the source image's slug, **drop the `_<aspect>` suffix**, then append `__` +
the camera move (from the bible's Part 8 moves) + duration.

**Example**
- source image → `MEL_006_AI_Intro-Anchor-Portrait_9x16.png`
- video → `MEL_006_AI_Intro-Anchor-Portrait__SlowPushIn_5s.mp4`
- Human Title → *"Intro Anchor — Openly AI · Slow Push-In"*

The shared `MEL_006_AI_Intro-Anchor-Portrait` stem makes the lineage obvious at a glance and when
sorted. A still can spawn several videos (`__Drift_5s`, `__SlowPushIn_5s`) and they all stay grouped.

### 3.3 The Title itself

- Human, editorial, memorable. Format: **`Place / Subject — Beat`** (e.g. *"Laneway Café — Flat White"*).
- Lives in the manifest `Title` column **and** as the kebab middle of the filename.
- One Title = one concept = one running number. Never recycle a number.

Both folders carry a `MANIFEST.md` that maps `slug ↔ Title ↔ job_id ↔ prompt ↔ pillar ↔ animate`.

---

## 4. Content pillars → platforms

Pillar codes used in the slug (from bible Part 3.6 — flagged as pending re-confirmation there):

| Code | Pillar | Grid share | Primary surfaces |
|---|---|---|---|
| `FASH` | Fashion & Style | 25% | Reels + feed (IG), X |
| `LIFE` | Aesthetic Daily Life (Melbourne) | 25% | Reels + feed, Threads |
| `JOB` | The Job / Working Model | 15% | Reels, feed |
| `FIT` | Fitness / Active | 15% | Reels |
| `EMO` | Emotional Honesty / Personality | 12% | Threads, feed, Reels |
| `AI` | Openly-AI / Meta | 8% | Reels, X, anchor posts |

**Reach vs conversion:** Reels/Explore = acquisition; the grid = conversion. Most output is
cheap fast formats (stills cut to Reels, carousels); the full talking-head chain is anchors only
(bible §3.3–3.5).

**Disclosure is non-negotiable** (bible Part 7): native AI-content label on every export; ad
disclosure (`#ad` / "Paid partnership") prominent in the caption body, never buried in hashtags.

---

## 5. QC gate before anything is "done" (bible Part 6, condensed)

- ☐ **Grey-green eyes** when visible — never blue / blue-grey / brown / hazel.
- ☐ **Freckles** present and asymmetric — never airbrushed out.
- ☐ **Pale, cool skin** — never tanned / golden, even in Melbourne light.
- ☐ **Hair** long base by default (colour not warm-brown); if restyled, note it and hold it.
- ☐ **Gold set** — hoops + right-wrist bracelet + pendant; no silver creep.
- ☐ **Youthful hands** — no aged veins/tendons.
- ☐ No logos/lettering; no drift toward a real person; fully clothed (charged-but-clothed only).
- ☐ **Native AI-content label on export.**

> **Carried-forward blocker (bible Part 1):** the reference set predates the long-hair / grey-green
> lock. Treat these generations as the *new* canonical set and QC every frame against the lock.

---

## 6. How to add the next asset (checklist)

1. Pick a pillar + write a **scene-only** prompt (flag-safe wording — bible §5.2.4).
2. `generate_image(model: soul_2, soul_id: 63d8ff04-…, aspect, quality: 2k)`; best-of-2/3 if it matters.
3. QC against §5. Assign the next `NNN`, a Title, and the slug. Save the PNG to `Image_Soul2/`.
4. Add a row to `Image_Soul2/MANIFEST.md`. Mark `Animate: YES/NO/MAYBE`.
5. For `YES` stills only: `generate_video(model: seedance_2_0, start_image = image job_id)`.
   Save the MP4 to `Video_Soul2/` with the **derived** slug; add a row to `Video_Soul2/MANIFEST.md`.
6. Caption + disclose with the content skills (`caption-writer-sms`, `hook-writer-sms`,
   `content-calendar-sms`, `platform-strategy-sms`); schedule to the platform.

---

## 7. Moodboards, Elements & model availability (connector reality)

### 7.1 Moodboards — what the connector can and can't do

In the Higgs Field **UI**, a *Moodboard* is a saved style/reference preset ("Curated" presets like
General, Warm ambient, Theatrical light… plus your own "My Moodboards") that biases a **Soul**
generation's tone, palette and creative direction. Under the hood it is applied as a **`style_id`**
(+ `style_strength`) on the generation — you can read it back from `show_generations` params:

| Moodboard (style) | `style_id` | Notes |
|---|---|---|
| General *(default)* | `3db34ab5-3439-4317-9e03-08dc30852e69` | what the connector always applies to `soul_2` |
| Muted cool film | `a15510bf-2439-4964-a2cc-0e35d1b5e70f` | seen at `style_strength: 0.5` |

**Connector limitation (verified 2026-07-07):** the MCP `generate_image` **Soul 2 tool ignores
`style_id`/`style_strength`** — it returns *"Higgsfield Soul 2.0 does not support this parameter"* and
falls back to the default **General** style. There is also **no MCP tool to browse or select
moodboards**. So today, **moodboards are effectively UI-only** through the connector.

**How to "add it into the setup" anyway (workarounds):**
1. **Replicate the moodboard as a reference `Element`** (§7.2) — build an Element from the moodboard's
   images and use it with the models that *do* accept references (Nano Banana Pro/2, GPT Image 2,
   Seedream, Kling, Seedance). That carries the *aesthetic* into the connector even though Soul's
   `style_id` can't be set. This is the recommended path.
2. **Record the `style_id`** you want (capture it from `show_generations` after one UI generation with
   the moodboard selected) so the look is reproducible in the UI and ready if the connector adds
   support. Do the same to capture your custom **"MELINA J…" moodboard** id.
3. Drive mood through the **prompt** (lighting, palette, atmosphere, emotion) — `MEL_007` proves a
   moody result from prompt alone with no moodboard applied.

### 7.2 Elements — reusable identity/aesthetic for non-Soul models

A trained **Soul** works only with `soul_2` / `soul_cinema_studio`. To use Melina in any other model,
use a reusable **Element** and embed its id as `<<<element_id>>>` in the prompt (the backend injects
the reference and rewrites it to `@Name`).

| Element | id | Built from |
|---|---|---|
| `Melina-JV` | `0ca6a093-92c1-4ef7-a50e-e3e7af7e214e` | finished front-facing stills MEL_001/002/003/006 |

Used by the storyboards (`gpt_image_2`). Compatible models: Nano Banana Pro (`nano_banana_2`),
Nano Banana 2 (`nano_banana_flash`), GPT Image 2 (`gpt_image_2`), Seedream, Cinema Studio, Kling 3.0,
Seedance 2.0. Refresh the Element as the look evolves (`show_reference_elements action=create`).

### 7.3 Image model cheat-sheet (with measured cost + gotchas)

| Want | `model` | Identity via | Cost (this workspace) |
|---|---|---|---|
| On-brand Melina still | `soul_2` | `soul_id` (trained Soul) | ~0.12 cr (2k) |
| Storyboard / non-Soul edit | `gpt_image_2` (GPT Image 2) | `Melina-JV` Element | ~0.5 cr (1k) |
| 4K / text / diagrams | `nano_banana_2` (Nano Banana Pro) | Element | ~1.5 cr (1k) |

> **Gotcha:** requesting `model: nano_banana_2` in this workspace came back tagged `nano_banana_flash`
> (Nano Banana **2**, not Pro). For a guaranteed target, use `gpt_image_2` (GPT Image 2) or confirm the
> returned `model` field. The storyboards were (re)generated on `gpt_image_2` for this reason.

---
*Companion docs: `docs/Melina_Master_Reference.md` (character bible) · `docs/Storyboards_Soul2.md`
(3 storyboards) · `CLAUDE.md` (repo guide) · `.agents/social-media-context-sms.md` (social context) ·
`Image_Soul2/README.md` · `Video_Soul2/README.md`.*
