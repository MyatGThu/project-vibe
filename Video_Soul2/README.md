# Video_Soul2/

Generated **videos** of **Melina Jones Voss**, animated from stills in `../Image_Soul2/`.

## Filename rule — the name comes from the source image

```
<image-slug-without-aspect>__<CameraMove>_<Ns>.mp4
```

Take the source image slug, drop its `_<aspect>` suffix, then append `__` + camera move
(bible Part 8) + duration.

**Example**
- source → `MEL_006_AI_Intro-Anchor-Portrait_9x16.png`
- video → `MEL_006_AI_Intro-Anchor-Portrait__SlowPushIn_5s.mp4`
- Title → *"Intro Anchor — Openly AI · Slow Push-In"*

The shared `MEL_006_AI_Intro-Anchor-Portrait` stem keeps every derivative grouped with its still.

## How these are made

`generate_video(model: seedance_2_0, medias:[{role: start_image, value: <image job_id>}], aspect_ratio, duration)`.
**Identity comes from the start frame** — animate only high-identity, eyes-visible, front-on stills
(bible §4.3–4.4). Preflight cost (`get_cost: true`), draft-first, keep the still as the fallback.

Prefer **low-drift camera moves** for identity-critical shots — Static, Drift, Push In, Pull Out,
Tilt, Rack Focus (bible Part 8). Reserve Orbit / Whip Pan / Dolly Zoom for anchor pieces.

## `MANIFEST.md`

Maps `video slug ↔ Title ↔ source image slug ↔ source job_id ↔ video job_id ↔ camera move ↔ duration`.
