# Image_Soul2/

Generated **stills** of **Melina Jones Voss** (Higgs Field Soul 2 · `soul_id 63d8ff04-4518-463f-84ac-8a3d5ddd7192`).

## Filename rule — every image has a Title

```
MEL_<NNN>_<PILLAR>_<Title-In-Kebab>_<aspect>.png
```

- `MEL` — Melina/Soul 2 prefix · `NNN` — running number (never reused)
- `PILLAR` — `FASH | LIFE | JOB | FIT | EMO | AI`
- `Title-In-Kebab` — the human **Title**, hyphenated (also stored in `MANIFEST.md`)
- `aspect` — `9x16` (Reels), `3x4` (feed), `1x1` (X)

**Example:** `MEL_001_LIFE_Laneway-Cafe-Flat-White_9x16.png` → Title *"Laneway Café — Flat White"*

## How these are made

`generate_image(model: soul_2, soul_id: 63d8ff04-…, aspect_ratio, quality: 2k)` with a
**scene-only** prompt (identity is injected by the Soul). See `../PRODUCTION_SYSTEM.md` §2–3 and the
bible `../docs/Melina_Master_Reference.md` for the Identity Lock and prompt rules.

## `MANIFEST.md`

The index of record: `slug ↔ Title ↔ pillar ↔ aspect ↔ job_id ↔ prompt ↔ Animate ↔ QC`.
Any still marked `Animate: YES` is a candidate for `../Video_Soul2/`.
