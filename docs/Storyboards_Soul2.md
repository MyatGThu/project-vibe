# Melina — Storyboards (Soul 2)

Three Reel storyboards derived from `Melina_Master_Reference.md`, written for **mood and character**
(the earlier stills were clean but flat). Each is a 4-beat vertical Reel concept with camera moves
drawn from the bible's Part 8 (low-drift for identity-critical beats).

**Rendered with:** `generate_image` · `model: gpt_image_2` (GPT Image 2) using the reusable Melina
Element `Melina-JV` (`0ca6a093-92c1-4ef7-a50e-e3e7af7e214e`) so identity holds in a non-Soul model.
Boards are 2×2 panel sheets (16:9). Files: `Image_Soul2/Storyboards/SB_00N_*.png` (+ `.json` sidecars).

> **Production routing:** a storyboard is a *plan*. To shoot a beat as a final asset, generate the
> panel as a `soul_2` still (Route B, scene-only prompt), then animate the "YES" beats with
> `seedance_2_0` (identity from the start frame). See `../PRODUCTION_SYSTEM.md`.

---

## SB_001 — "Four Seasons in a Day"  · pillars LIFE + EMO

**The mood:** Melbourne's "four seasons in a day" as an emotional arc — hope → exasperation →
melancholy → dry acceptance. Warm-to-cool grade. The relatable-glam glue: gorgeous, but the weather
doesn't care, and neither, quite, does she.

| Beat | Shot | Camera (drift) | Expression |
|---|---|---|---|
| 1 · morning · hopeful | Laneway café, golden window light, flat white | **Drift** (Low) | soft hopeful half-smile |
| 2 · midday · turned | Grey overcast, wind in a bluestone laneway, coat pulled tight | **Handheld** (Med) | wry, unimpressed |
| 3 · afternoon · rain | Rain on a tram window, her pensive reflection, smeared lights | **Rack Focus** (Low) | pensive, quiet |
| 4 · golden hour · typical | Clear warm light by the bay (St Kilda), calm | **Push In** (Low) | knowing dry half-smile to camera |

**Caption seed:** "four seasons in a day and i dressed for exactly none of them ☕️🌧️"
**Generation prompt:** 2×2 storyboard sheet, four numbered film-still panels, same woman `@Melina-JV`
in each (grey-green eyes, freckles, pale cool skin, long jet-black hair + fringe), warm-to-cool
cinematic grade, fully clothed, no logos — panels as the table above.

---

## SB_002 — "The Job"  · pillar JOB

**The mood:** the working-model reality behind the glamour — early, tiring, human, then the
transformation under the key light, then the deflate. Aspirational *and* honest; warm bulb light.

| Beat | Shot | Camera (drift) | Expression |
|---|---|---|---|
| 1 · call time · 5am | Vanity mirror, getting-ready, coffee in hand | **Static** (Lowest) | tired but focused |
| 2 · fitting | Wardrobe fitting by a garment rack, crew soft behind | **Handheld** (Med) | candid laugh |
| 3 · action | On set under a crisp key light, hitting the pose | **Push In** (Low) | intense, composed |
| 4 · that's a wrap | Slumped back in the director's chair, robe on again | **Pull Out** (Low) | dry, exhausted half-smile |

**Caption seed:** "5am call time, 11 looks, one usable second of footage. the job 🎬"
**Generation prompt:** 2×2 storyboard sheet, four numbered film-still panels, same woman `@Melina-JV`
in each, warm bulb-lit behind-the-scenes cinematic mood, fully clothed, no logos — panels as above.

---

## SB_003 — "Openly AI"  · pillar AI / Meta

**The mood:** the differentiator, made literal — start photoreal, glitch the reveal, do the impossible
(two of her, seamless), reassemble whole and unbothered. Clean-then-surreal, cool tones, confident.
This is the one only an AI creator can post — the whole hook (bible §3.1).

| Beat | Shot | Camera (drift) | Expression |
|---|---|---|---|
| 1 · looks real | Ordinary photoreal Melbourne portrait, tall windows | **Static** (Lowest) | direct, confident |
| 2 · the reveal | Glitch / pixel-sort ripples across half her face | **Whip Pan** (High — anchor beat) | calm |
| 3 · only ai can | She steps out of a second identical frame of herself | **Dolly Zoom** (High — anchor beat) | playful |
| 4 · yeah, i'm ai | Reassembled, whole, to camera | **Static** (Lowest) | knowing dry half-smile |

**Caption seed:** "yeah, i'm ai. no i'm not going to be weird about it. stick around, i make nice things."
**Disclosure:** this beat *is* the AI disclosure and the hook in one — keep the native AI label on.
**Generation prompt:** 2×2 storyboard sheet, four numbered film-still panels, same woman `@Melina-JV`
in each, clean-then-surreal cool-toned mood, fully clothed, no logos — panels as above.

---

## Rendered assets

| Storyboard | File | Higgs job_id |
|---|---|---|
| SB_001 · Four Seasons in a Day | `../Image_Soul2/Storyboards/SB_001_Four-Seasons-in-a-Day_16x9.png` | `fe63aff9-51d8-4941-9edd-58da70d721f1` |
| SB_002 · The Job | `../Image_Soul2/Storyboards/SB_002_The-Job_16x9.png` | `ee97faf5-4035-4c2f-ab2c-32ea8a6a2edc` |
| SB_003 · Openly AI | `../Image_Soul2/Storyboards/SB_003_Openly-AI_16x9.png` | `0a6bd9e2-86c2-4029-ba1b-d8fa6a322023` |

All three on `gpt_image_2` (GPT Image 2), 16:9, high quality, with the `Melina-JV` Element. Binaries
on the Higgs Field CDN — `../fetch_media.sh` pulls them locally (see `../PRODUCTION_SYSTEM.md` §7 on
the egress limit). An earlier Nano Banana 2 (`nano_banana_flash`) pass exists in Higgs history but is
superseded by these.

---
*High-drift moves (Whip Pan, Dolly Zoom) are used deliberately in SB_003 as anchor beats — shoot
best-of-N and QC hard (bible Part 8). Everything else stays low-drift.*
