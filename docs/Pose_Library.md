# Melina — Pose & Gesture Library

A reference bank of **iconic, recreatable poses** for Melina, drawn from the most recognizable
poses/gestures in **Movies · Anime · TV · Marketing/Ads** (top 5 each, 20 total). Built for
**Soul 2, single subject** — one Melina, charged-but-clothed, no dual/identical characters, no
background people, no moving objects. **All motion comes from her body / hair / fabric + the camera.**

> **Provenance (be honest):** compiled 2026-07-07 via the `deep-research` workflow. The search step
> surfaced the canonical sources (listed at the end); the automated **fetch/verify step returned empty**
> (sandbox egress blocks page fetches — same limit as the media CDN), so these are grounded in
> established, low-controversy cultural knowledge + those sources, **not** freshly fact-checked claims.

## How to use it

- **Bake the pose + camera ANGLE into the Soul-2 still** (that's where identity is safe). Add the
  *cinematic move* and the *trend effects* afterward.
- **Path A — stills-only velocity edit:** generate a burst of poses, cut fast on the beat in the editor
  (zero identity drift). **Path B — one clean move:** animate the still with a single low-drift move
  (Seedance/Kling), single subject only. See `PRODUCTION_SYSTEM.md` §2 and the bible Part 8 (drift).
- **Effects → post** (film grain, halation, flares, letterbox, speed-ramp, glitch) — bible §5.2.3.
- Prompts below are **scene-only fragments** for `generate_image(model: soul_2, soul_id: 63d8ff04…)`.

---

## 🎬 Movies

**M1 · Skirt-Catch** *(Marilyn Monroe — The Seven Year Itch, 1955)* — playful joy.
*Pose:* knees together, both hands lightly holding the front of a flared midi dress as a breeze lifts it, shoulders up, laughing, gaze down/away.
*Prompt:* `…standing over a warm updraft, knees together, both hands lightly holding a flared knee-length dress as a gentle breeze lifts it, shoulders lifted, delighted laughing smile, gaze down.`
· Path B · **FASH/LIFE** · *effect:* speed-ramp + wind.

**M2 · "I'm Flying"** *(Titanic, 1997 — solo adaptation)* — freedom, exhilaration.
*Pose:* at a railing, arms outstretched wide like wings, chin lifted, eyes closed, wind in hair, slight back-arch.
*Prompt:* `…at a bay railing at golden hour, arms outstretched wide like wings, chin lifted, eyes closed, wind lifting her hair, a slight back-arch, serene.`
· Path B · **EMO/LIFE** · *effect:* slow-mo ramp.

**M3 · Hepburn Poise** *(Breakfast at Tiffany's, 1961)* — timeless elegance.
*Pose:* elongated neck, one elbow raised with hand near the jaw, other hand at the waist, ¾ to lens, serene.
*Prompt:* `…elegant three-quarter pose, neck elongated, one elbow raised with hand resting near the jaw, other hand at the waist, a refined column dress, composed serene expression.`
· Path A · **FASH**.

**M4 · Femme-Fatale Lean** *(film noir)* — cool mystery. **★ sample produced**
*Pose:* shoulder to a wall, one knee bent (foot flat on wall), hand near collarbone, gaze off-camera, unbothered.
*Prompt:* `…leaning a shoulder against a bluestone wall in a dim laneway at night, one knee bent with the foot flat on the wall, one hand resting near the collarbone, gaze cast off-camera, cool and unbothered.`
· Path A/B · **EMO** · *effect:* film grain + letterbox.

**M5 · Hero Walk-to-Lens** *(action heroine)* — power, momentum.
*Pose:* mid-stride toward a low camera, chin level, natural arm swing, intense gaze to lens.
*Prompt:* `…mid-stride striding toward a low camera, chin level, natural arm swing, an intense level gaze to the lens.`
· Path B (Static, she approaches) · **FIT/EMO** · *effect:* slow-mo ramp on the stop.

---

## 🌸 Anime

**A1 · JoJo Pose** *(JoJo's Bizarre Adventure)* — flamboyant confidence.
*Pose:* twisted torso/contrapposto, one hand raised with fingers splayed, other on hip, chin down, eyes up to lens.
*Prompt:* `…dramatic twisted contrapposto stance, one hand raised with fingers splayed, other hand on the hip, chin down, eyes up to the lens, flamboyant and confident.`
· Path A · **FASH/AI**.

**A2 · Shaft Head-Tilt** *(Monogatari / Studio Shaft)* — alluring unease. **★ sample produced**
*Pose:* head tilted extremely to one side, chin slightly down, unbroken stare up to camera, still level shoulders.
*Prompt:* `…tight three-quarter close-up, head tilted extremely far to one side, chin dipped slightly, an unbroken cool stare up into the lens, shoulders still and level, faintly unsettling.`
· Path A · **EMO** · *effect:* letterbox + grain.

**A3 · Idol V-Sign** *(shoujo / idol)* — cute, playful.
*Pose:* peace sign beside the eye, head tilted, wink or open smile.
*Prompt:* `…a peace sign held beside her eye, head tilted, a bright wink and open smile, playful.`
· Path A · **LIFE**.

**A4 · Wind-Swept Resolve** *(shonen)* — determination.
*Pose:* feet apart, fists loose at sides, chin up, hair blowing, level resolute gaze.
*Prompt:* `…standing feet apart, fists loose at her sides, chin up, hair and clothing blowing in the wind, a level resolute gaze.`
· Path B (hair) · **FIT**.

**A5 · Over-Shoulder Cool** *(Attack on Titan)* — brooding.
*Pose:* ¾-back, collar/hood up, glancing back over the shoulder, guarded.
*Prompt:* `…three-quarter back to camera, collar or hood up, glancing back over her shoulder to the lens, guarded and brooding.`
· Path A/B · **EMO/AI**.

---

## 📺 TV Series

**T1 · Wednesday Dance** *(Wednesday, 2022)* — deadpan cool.
*Gesture seq:* angular, jerky arm shapes with a flat deadpan face — a moving beat.
*Prompt:* `…mid-dance in an angular, jerky arm pose, wrists flicked, a completely flat deadpan expression.`
· Path A burst / Path B motion · **EMO/AI** · *effect:* beat-cut velocity edit.

**T2 · Fourth-Wall Look** *(Fleabag / The Office)* — dry, knowing. **★ sample produced**
*Pose:* mid-action, a sudden side-glance straight to lens with a micro-smirk.
*Prompt:* `…caught mid-moment, turning her head to shoot a sudden dry, knowing side-glance straight into the lens with the faintest micro-smirk, as if sharing a private joke.`
· Path A · **EMO** *(perfect for her meta voice)*.

**T3 · Angels Pose** *(Charlie's Angels — solo)* — playful power.
*Pose:* side stance, finger-guns raised near the shoulder, back slightly arched, confident smile.
*Prompt:* `…side stance, finger-guns raised near her shoulder, back slightly arched, a confident smile to the lens.`
· Path A · **FASH**.

**T4 · The "Smize"** *(Tyra Banks / ANTM)* — smiling with the eyes.
*Pose:* soft relaxed mouth, engaged slightly-narrowed eyes, chin a touch down, to lens.
*Prompt:* `…a beauty portrait smiling with the eyes only — soft relaxed mouth, engaged slightly narrowed eyes, chin a touch down, direct to lens.`
· Path A · **FASH/JOB**.

**T5 · The Throne Sit** *(Game of Thrones / Bridgerton)* — authority.
*Pose:* seated tall, one elbow on the armrest, hand loose, chin high, cool gaze.
*Prompt:* `…seated tall in a statement chair, one elbow on the armrest with the hand loose, chin high, a cool authoritative gaze.`
· Path A · **FASH/EMO**.

---

## 📣 Marketing / Ads

**AD1 · Rosie "We Can Do It!"** *(J. Howard Miller WWII poster)* — empowerment.
*Pose:* flexed bicep, rolled sleeve, bandana, determined side-glance, other hand at the rolled sleeve.
*Prompt:* `…flexing one bicep with a rolled shirt sleeve and a knotted bandana, the other hand at the sleeve, a determined side-glance, bold.`
· Path A · **FIT**.

**AD2 · Chanel N°5 Glamour** *(fragrance campaigns)* — timeless luxe. **★ sample produced**
*Pose:* fingertips grazing the collarbone/jaw, elongated neck, soft half-lidded gaze, minimal.
*Prompt:* `…an elegant beauty portrait, fingertips lightly grazing the line of the jaw and collarbone, neck elongated, chin lifted a touch, a soft half-lidded gaze to the lens, timeless and expensive.`
· Path A · **FASH**.

**AD3 · Catalog Contrapposto** *(model-posing staple)* — clean confidence.
*Pose:* weight on the back hip, front knee soft, one hand on hip, shoulders open.
*Prompt:* `…weight settled on the back hip, front knee soft, one hand on the hip, shoulders open, a clean confident gaze.`
· Path A · **FASH/LIFE**.

**AD4 · Walk-Away Glance** *(fashion / perfume ads)* — allure.
*Pose:* walking away, torso twisting back, glance over the shoulder to lens.
*Prompt:* `…walking away from camera, torso twisting back, a glance over the shoulder to the lens, hair swinging.`
· Path B · **FASH**.

**AD5 · Hand-to-Face Aspirational** *(beauty ads)* — soft desire.
*Pose:* fingertips lightly framing the cheek/jaw, lips parted, direct warm gaze.
*Prompt:* `…fingertips lightly framing the cheek and jaw, lips softly parted, a direct warm gaze to the lens, glowing.`
· Path A · **JOB/FASH**.

---

## Effect pairings (post — CapCut/Premiere)
- **Wind + speed-ramp:** M1, M2, A4 · **Letterbox + film grain:** M4, A2, T2 · **Beat-cut velocity edit:** T1
- **Slow-mo ramp on a stop/turn:** M5, AD4 · **Halation/flare + LUT:** AD2, AD5 · **Glitch (openly-AI):** T1, A5

## Reference sources (from the research search step)
Filmsite iconic scenes · PetaPixel/Biography (Monroe skirt) · Titanic Wiki ("I'm Flying") · CBR / GameRant /
DualShockers (anime poses) · JoJoWiki + KnowYourMeme (JoJo poses) · CBR (Shaft head-tilt) · CNN / Ricky Spears
(Wednesday dance) · Medium (look-to-camera: Office/Fleabag) · TVTropes (Angels Pose) · Wikipedia (Rosie the
Riveter / We Can Do It!) · The Last Fashion Bible / StyleCaster (Chanel N°5) · model posing guides.

---
*See `PRODUCTION_SYSTEM.md` (pipeline, drift, moodboards) · `docs/Melina_Master_Reference.md` Part 8 (camera moves).*
