# Locking a look on Soul 2 (reproducibility & outfit consistency)

**The one thing to internalize:** the trained Soul (`soul_id`) locks Melina's **face only**. Outfit, hair,
framing, and grade are **not** in the Soul — they're controlled by four other levers. If any of them
drifts between runs, the outfit changes. This is why "it keeps switching the outfit."

Sources: Higgsfield Soul ID docs (soul_id = identity lock; moodboards/presets drive the look; image-ref =
remix) + the actual saved `params` of our own generations (`show_generations`) + `docs/Melina_Master_Reference.md`
Part 1 (Identity Lock = face).

## The 4 levers that control the look (Soul locks the face; these lock everything else)

1. **Prompt wardrobe specificity** — the #1 cause of outfit switching. Vague ("a string bikini",
   "a white top") → the model invents a new garment every roll. Lock it: **garment + colour + cut +
   fabric + neckline + sleeves** ("a plain white long-sleeve fitted crop top with a crew neck + white
   high-waisted bikini bottoms"). Paste the **exact same sentence** every time.
2. **Enhance Prompt → OFF.** When ON, Higgsfield **rewrites your wardrobe words** before generating and
   the rewrite varies run-to-run — e.g. our short "white top" became the auto-expanded *"translucent,
   long-sleeved, tight-fitting white top"* (job `28e7bc9e`, `enhance_prompt: true`). Enhance ON =
   guaranteed drift. Turn it off for consistency.
3. **Moodboard / Style (`style_id`)** — pin the **same** one. Our best shots did **not** use the default
   General; they used specific styles, and regenerating on a different style looks different:
   | Look | Moodboard | `style_id` |
   |---|---|---|
   | Underwater / pool | **Underwater** | `04022c41-6164-47d9-b33f-cf241f0b5e15` |
   | Grainy noir street | **Muted cool film** (@0.5) | `a15510bf-2439-4964-a2cc-0e35d1b5e70f` |
   | Beauty portrait | **Theatrical light** | `7876c2a5-aa83-4530-ad09-2b368bbb5e95` |
   | Street editorial | **Editorial street style** | `3d5584b2-4d15-48d2-8a09-c1073259f4c6` |
   | (default) | General | `3db34ab5-3439-4317-9e03-08dc30852e69` |
4. **Seed** — pin it to **reproduce** a shot (same soul + same prompt + same style + same seed ≈ the same
   image). Every one of our gens used a *random* seed → re-rolls always differ. To iterate the same look
   with a new pose: keep 1–3 identical, change only the pose/background line, let the seed re-roll.

## Reference images — why they "don't respond well"
Soul 2's image-reference is a **remix / image-to-image**: it *re-interprets* the source, so the outfit
shifts (worse with Enhance ON). It is **not** an outfit-lock tool. For a **hard outfit lock from a photo**,
use a reusable **Element + a reference-faithful model** (Nano Banana Pro `nano_banana_2`, GPT Image 2
`gpt_image_2`, Seedream) — those hold an outfit far better. Trade-off:

| Goal | Use | Face | Outfit fidelity |
|---|---|---|---|
| Best face, fresh scene | **Soul 2** (`soul_id`) | 🔒 exact | loose (prompt-driven) |
| Reproduce an exact shot | Soul 2 + **same seed + style + prompt, Enhance OFF** | 🔒 exact | 🔒 locked |
| Lock a specific outfit from a photo | **Element + Nano Banana / GPT Image 2** | very close | 🔒 strong |

## ⚠ Connector caveat (verified 2026-07-07)
Through the **MCP connector**, `generate_image(model: soul_2)` **silently drops `seed`,
`enhance_prompt`, and `style_id`** — each returns *"Higgsfield Soul 2.0 does not support this parameter."*
So every connector Soul-2 render is a **fresh random seed on the default General style**. That is why
connector re-creations differ from UI originals. **For exact reproduction or a moodboard-matched look,
generate in the Higgsfield UI** (seed, Enhance toggle, and moodboard are all controllable there). The
connector is for *new* generation, not pixel-reproduction.

## The lock checklist (Higgsfield UI)
1. Select the Soul (Melina). 2. Pick the **same Moodboard** as the winner. 3. **Enhance Prompt → OFF.**
4. Paste the **exact wardrobe sentence**, verbatim. 5. To reproduce: set the **same seed** (copy it from
the winner's details); to vary: change only the pose/background line and let the seed re-roll.

---
*Companion: `PRODUCTION_SYSTEM.md` (§7 moodboards/Elements) · `docs/Moodboards.md` (style_id registry) ·
`docs/Melina_Master_Reference.md` Part 1 (Identity Lock).*
