# MELINA — Master Production Reference
**Rev 3.0 · Melbourne · Consolidated**

> **What this is.** A single working reference that merges three previously separate documents:
> the **Character Bible** (persona, strategy, compliance), the **Prompt Playbook** (authoring
> craft, pipeline routing, house-style prompts), and the **Camera Moves** reference (all 30 moves
> with face-lock drift ratings). Where the three disagreed, the conflict is resolved here and
> logged in the **Reconciliation Log** at the end. Treat every section as binding, and update it as
> the character and account evolve.
>
> **Confidential — internal use only.**

---

## Contents

- **Part 0 — Read first: the generation-route gate** *(resolves the core contradiction)*
- **Part 1 — Identity Lock** *(single source of truth for the character's look)*
- **Part 2 — Persona & positioning**
- **Part 3 — Growth engine & content strategy**
- **Part 4 — Production pipeline & routing**
- **Part 5 — Prompt authoring**
- **Part 6 — QC checklist** *(consolidated)*
- **Part 7 — Brand, disclosure & compliance (Australia)**
- **Part 8 — Camera Moves reference** *(30 moves, 7 categories, drift-rated)*
- **Appendix A — Launch checklist**
- **Appendix B — Reconciliation log** *(what was merged, and every decision made)*

---

# Part 0 · Read First — The Generation-Route Gate

**This is the single most important page, because the source documents contradicted each other here.**
The Playbook said *"paste only the scene — the pipeline injects the identity for you."* The Bible said
*"prepend the full identity lock to every generation."* Both are correct — **but only for their own route.**
Following the wrong one silently produces identity drift. So, before you author anything, decide which route you're on:

| | **Route A — ChatGPT frame generation** *(current default)* | **Route B — Pipeline refs/edit flow** |
|---|---|---|
| **Where frames are made** | In ChatGPT / gpt-image-2 directly | Through the pipeline's Scenes/edit tab with `refs/` injection |
| **Who supplies the identity** | **You do — every prompt must be self-contained.** | The pipeline auto-injects it from the bible + lock. |
| **What you paste** | **The full Identity Lock (Part 1) + the scene.** | **The scene only.** Do *not* paste the lock (it stacks a second, often self-contradicting lock, and in the Scenes box a multi-paragraph lock gets split into fragment-scenes). |
| **Identity discipline** | High — nothing is injected, so nothing is guaranteed. | Handled by the QC gate against `refs/face`. |

**Rule of thumb:** if the tool isn't reading your `refs/` folder, the identity is *your* job in the prompt.
Everything in Part 5 ("paste only the scene") assumes **Route B**. On **Route A**, prepend Part 1 first.

---

# Part 1 · Identity Lock — Single Source of Truth

This is the canonical spec for Melina's look. Every other section refers back here rather than restating it.
On **Route A**, this whole block is what you prepend to a prompt. On **Route B**, this is what the pipeline injects.

### 1.1 The always-on lock (prepend on Route A)

> Long jet-black base with face-framing curtain/bottleneck bangs; **cool grey-green eyes** (not blue,
> not blue-grey, not brown, not hazel); **light, cool-neutral skin** with **freckles as the dominant
> texture**, visible pores, no retouching; delicate **gold set** — small hoops + thin chain bracelet on
> the **right** wrist + minimalist pendant necklace; **lean, athletic** build; **youthful hands** with
> real anatomy; and the **cool-skin-under-warm-light rule** — warm or bright light may *fall* on her but
> never tans, bronzes, or warms her skin colour; she reads light and cool-neutral even in Melbourne sun.

### 1.2 Face & physical anchors (the detail behind the lock)

| Anchor | Specification |
|---|---|
| **Hair** | Jet-black, **long** base — collarbone-to-mid-back, with face-framing curtain/bottleneck bangs. Healthy sheen, never matte. **One** base cut, **three** canonical stylings: (1) worn down / soft blowout = the elevated look; (2) sleek high or low ponytail = everyday / active; (3) bangs-down natural fall = relatable. Never let the colour go warm-brown. |
| **Eyes** | **Cool grey-green** (reads blue-grey in some light), heavy-lidded. NOT blue, NOT warm brown, NOT hazel. A signature — preserve it. Faint freckle constellation sits beneath. |
| **Skin** | Light/pale, neutral-to-cool undertone. Freckles across nose and cheeks are the dominant surface texture and a signature — **never airbrush them out**. Natural texture, visible pores, no heavy retouch. |
| **The light rule** | Warm/bright light may fall on her but does not tan, bronze, or warm her skin colour. Freckles hold at every temperature. **Skin tone is a constant identity anchor, independent of the environment.** |
| **Build** | Lean, athletic, natural proportions — a working model's build, visibly fit. Long legs, narrow waist, strong shoulders. Not hyper-idealised. |
| **Signature jewellery** | Delicate gold hoop earrings; thin gold chain bracelet on the **right** wrist; minimalist gold pendant necklace. Worn consistently. |
| **Hands** | Youthful; real anatomy. Avoid "visible veins / tendon definition" (reads aged). Let best-of-N pick the cleanest. |
| **Default expression** | Neutral-to-cool resting face with warmth available — "attainable but composed." Approachable, not untouchable. |

### 1.3 HARD vs SOFT — what's locked, what you can change

**HARD — always true; never write against these (the QC gate scores them):**
- **Grey-green** heavy-lidded eyes — never "blue" / "blue-grey".
- **Pale, cool-undertone** skin — never tans, bronzes, or goes golden; never "warm-neutral".
- Freckles (dominant texture), the locked facial structure, youthful hands.

**SOFT — overridable per scene (say it explicitly):**
- **Hair** — default is long jet-black waves with a face-framing fringe, but you can **restyle** (bob,
  ponytail, updo, glass-straight). An explicit override line beats the default.
- **Jewellery**, **expression**, **wardrobe**.

### 1.4 Expression library

Taxonomy (established and validated): Neutral, Happy, Sad, Angry, Surprised, Disgusted, Fearful,
Confused, Playful, Flirty, Tired, Bored, Laughing, Intense, Pensive, Smug — plus the charged register
(Smoldering, Sultry, Bedroom Eyes, Half-Smile, etc.). Match the expression to the emotional tone of
each scene. **Never prompt "smile" without specifying which type.**

> ### ⚠ OPEN BLOCKER — reference set still shows the retired look
> Every current reference (face, body, expression sheets) shows the **old bob**, and any face-lock
> reference still encoding **blue-grey** eyes conflicts with this lock. The canonical look is now the
> **long base** with **grey-green** eyes. **Nothing ships at scale until the full reference folder is
> regenerated on the long base and re-verified against the new set.** This is the #1 launch blocker
> carried forward from the Bible — it is *not* closed.

---

# Part 2 · Persona & Positioning

Consistency is what turns followers into a monetisable audience; an internally coherent persona is what
makes a synthetic creator believable rather than a content-strategy spreadsheet in a wig.

| Field | Definition |
|---|---|
| **Character name** | Melina (working name — see Open Decision in Appendix A). A wholly original AI-generated persona. Not based on, and does not impersonate, any real person. |
| **Home base** | Melbourne, Australia. Lives in an inner suburb; drives into the city for shoots. Shapes environments, light, posting times, and caption flavour. |
| **Archetype** | Relatable-glam. Gorgeous but attainable — a working model with a dry, self-aware, low-key-nerdy edge. The "hot girl who's also a real person." **Openly AI: that's the hook, not something hidden.** |
| **Occupation (narrative spine)** | Model / content creator. Shoots, ads, and creative work around Melbourne — a real life that motivates content instead of staging it. |
| **Target demographic** | Women 18–34 (primary), men 18–35 (secondary). International with an AU/global centre of gravity. Beauty, fashion, lifestyle, fitness — plus the AI-curious audience the openly-AI angle pulls in. |
| **Brand voice** | Direct, dry-humoured, self-aware, warm-relatable. Says a lot with a look. First person, casual, lower-case for casual posts. Never try-hard. |
| **Content niche** | Relatable-glam lifestyle. A charged-but-clothed sensual register is permitted (see 2.2). |

### 2.1 Melbourne as a character fact

Melbourne is a character fact, not just an operational one — laneways, coffee culture, terrace houses,
the bay — and it's referenceable because it's where the operator lives. Use that authenticity.

- **Interiors:** inner-Melbourne residential character — Victorian terrace, warehouse conversion, art-deco walk-up, or a clean modern apartment. Considered and lived-in, design-aware but not sterile.
- **Exteriors (use freely — lifestyle is the point):** laneway cafés, leafy inner-suburb streets (Fitzroy, Carlton, Collingwood, Brunswick, St Kilda, South Yarra), trams, the bay and beaches (St Kilda, Brighton bathing boxes), studios and sets.
- **Light:** bright, with genuinely changeable seasons ("four seasons in a day"). Real golden hour is available (summer evenings, the bay). Don't lock one mood — let weather and season vary the grid. **Always apply the skin-light rule.**
- **Cars:** natural as her commute/daily reality — but **don't turn it into a car account** (no specs or performance talk; wrong audience). Keep cars to aesthetic/lifestyle framing.
- **Not** Berlin / Altbau.

### 2.2 The sensual register — the hard line

> Charged, **fully clothed**, intimacy through expression (Smoldering / Sultry), **never undress.**
> Boudoir is excluded. This holds even under a "grow first, monetise later" strategy — keeping it
> brand-safe is exactly what protects future monetisation.

---

# Part 3 · Growth Engine & Content Strategy

Pillars and ratios are a *content plan*, not a *growth plan*. Posting pretty photos to the grid in order
does not grow an account — that lane is saturated with millions of real women and a flood of other AI
models. This section is the part that makes the rest worth doing.

### 3.1 The edge — openly AI + relatable-glam

Virtual influencers run roughly **2.8× the engagement rate** of human influencers (HypeAuditor:
~8.7% vs ~3.1%), driven by novelty and highly curated content. So the AI nature is the **differentiator**,
not something to bury — it's the one thing a human-passing pretty-photo account can't offer.

### 3.2 The reality check — calibrate "grow big"

The AI accounts that reached millions (Lu do Magalu ~7M, corporate mascot; Lil Miquela ~3M, startup-built)
were money-and-PR operations with agencies and press. **Solo**, the realistic path is daily-ish content,
consistency over perfection, genuine community engagement, and early monetisation — reaching **tens of
thousands over 6–18 months**, not millions overnight. Set that expectation now or you'll quit at month
four on 2,000 followers.

### 3.3 The engine — Reels, retention, repeatable format

- High-retention Reels are the reach surface. Build **one or two** ownable, cheap-to-batch formats so people follow "for more of that."
- A hook in the **first second**. Watch-time, shares, and saves drive distribution — not likes.
- Ride trending audio early. Post frequently and consistently — frequency trains the algorithm and creates more shots at momentum.

### 3.4 Reach vs conversion

**Reels and Explore = acquisition** (reach to strangers). **The grid = conversion** (it turns a viral-Reel
viewer into a follower). Your pillars are the **conversion layer** — the coherent profile someone lands on —
**not** the growth engine. Don't confuse the conversion tool for the growth tool.

### 3.5 The production split — the practical key

The talking-head pipeline (gpt-image-2 → ElevenLabs → Kling → Sync) is the slowest, most expensive,
highest-drift thing you can produce. It cannot feed a daily Reels cadence. So:

- **Most output = cheap, fast formats:** stills cut to Reels on trending audio, carousels, outfit-change / transition Reels, aesthetic b-roll, light motion — minimal or **no** lip-sync.
- **Talking-head = anchors only:** the intro, an occasional disclosure beat, the rare "she speaks" moment.

**Match the format to the cost, or cadence collapses and growth dies with it.**

### 3.6 Content pillars (grid = the conversion layer)

Targets are measured across a **month**, not enforced per week. Within every pillar, produce **Reels-first
in cheap formats** — the pillars are the WHAT; §3 is the HOW.

| Pillar (grid) | Share | What it is |
|---|---|---|
| Fashion & Style | 25% | Outfit reveals, styling, transitions. Highly Reels-friendly; where fashion brand content slots. |
| Aesthetic Daily Life (Melbourne) | 25% | Routines, café, apartment, the city. Cheap to produce; where ambient brand placement lives. |
| The Job / Working Model | 15% | BTS, getting-ready, on-set. The narrative differentiator — authentic, aspirational, relatable. |
| Fitness / Active | 15% | Workouts and movement. Framed strong-and-active, never restrictive or diet-focused. |
| Emotional Honesty / Personality | 12% | Dry humour, mood, the relatable glue. Holds the attitude and charged-clothed sensual register. |
| Openly-AI / Meta | 8% | How she's made, impossible/surreal visuals only AI can do, the AI-creator angle. Woven in, not the whole show. |

> **⚠ Verify against current working allocation.** This table is the Bible's original pillar set. Recent
> production has been running a different split (Emotional-Honesty- and Aesthetic-Daily-Life-led, with
> Drawing/Creative and Cars pillars, and no Lego). If that working split is now canonical, **this table
> needs a rewrite** — see Reconciliation Log, item 3. It's preserved as-is here because that's what's on
> file; it is deliberately *not* silently overwritten.

### 3.7 The Stories-only texture layer (NOT grid pillars)

The e-girl interests live here **and only here**: soccer, e-sports / gaming, casual BTS, polls, the nerdy
side. This humanises her — the "hot girl who's also a bit of a nerd" formula — without diluting the grid's
brand signal or pulling a mismatched audience onto the main feed. Stories are also where soft product teases
live before a main post drops.

### 3.8 Exclusions — documented decisions

- **Anime** — not a pillar, not grid content, not generated imagery. A synthetic persona can't carry it, and it pulls an incoherent audience. Run it as a separate account if it matters to you.
- **Boudoir** — excluded. Contradicts the brand-safe positioning. The charged-clothed register covers the impulse.

### 3.9 Cadence & captions

- **Reels:** the priority. Frequent — daily-to-most-days, sustainable only if most are cheap-format. Each grid post belongs to a pillar.
- **Carousels:** 1–2 per week (expression showcases, multi-look fashion).
- **Stories:** daily — e-girl texture and soft brand teases.
- **Captions:** first person, minimal, dry, lower-case for casual posts. 5–8 hashtags in the **first comment** — mix niche and mid-tier, and include the AI-discovery tags (**#aiinfluencer, #aimodel, #digitalhuman**); that pool is the single biggest exposure lever. **Ad-disclosure hashtags go in the caption body, prominently** — see Part 7.

### 3.10 Reel construction

For multi-scene Reels: 3–4 scenes, expression matched to tone, **dissolve** transitions for emotional/lifestyle
and **cut** for fashion/attitude. **Never use iris or smooth** — they read as AI. Most Reels are cheap
single-format pieces, not multi-scene talking-head productions.

---

# Part 4 · Production Pipeline & Routing

**Pipeline:** Claude (prompts) → gpt-image-2 + PuLID (image) → *[anchors only:* ElevenLabs (voice) →
Kling (animate) → Sync.so (lip-sync)*]*. Most content stops at image plus light motion. **Reserve the full
talking-head chain for anchor pieces.** Seedance 2.0 is the established alternative animation engine (see 4.4).

### 4.1 Engines & routes

- **Scenes tab (`edit` mode) — image-only stills.** Two engines, same prompts:
  - **FLUX.2 [pro] Edit** — best for full scenes, wardrobe, body at a *held* expression. No training.
  - **gpt-image-2 + PuLID** — best for portraits & *expressions* (the face holds across smiles, flirty, intense). Use this for expression sheets / close portraits.
- **Video modes** — Character (narrated / talking-head; **Kling _or_ Seedance 2.0**), UGC (product), Multi-scene, Remake, and **Multi-Ref** (Seedance 2.0 multi-image identity lock — see 4.4).
- `--upscale` adds a ~1080p Topaz master on finals. Every run prints its **actual cost** and writes `<run>/cost.json`.

### 4.2 The QC gate

Every refs/edit render runs the QC gate: **best-of-N → identity score vs `refs/face`** → winners below the
threshold are quarantined to `<run>/_rejected/` (status in `scenes.json`).

| Shot | Gate | Why |
|---|---|---|
| Face-forward portrait, eyes open (MCU–medium) | **80** | plenty of face to verify |
| Full-length / three-quarter / eyes-closed editorial | **~65** | little face to verify — a low score is *pose*, not drift |

Always **best-of-2/3** — it picks the strongest identity *and* the cleanest hands.

### 4.3 Animate decision cheat-sheet

- **Lean YES** when motion is *justified by the environment* — drifting haze, streaking lights, breeze through foliage, steam off coffee, dust motes in a beam. One clean beat.
- **Lean YES** for a single subtle beat in a still beauty frame (a slow chin-lift / gaze-turn).
- **Lean NO** for flash stills, tight close-up + wink/tongue (highest Kling drift), visible UI, and seated/faceless detail crops.
- **MOTION-ONLY** for printed-photo concepts and cheap low-risk story beats.
- **Dance / performance / multi-shot →** Seedance 2.0, not Kling (see 4.4).
- Always `--draft` an animation candidate first; keep the still as the fallback.

### 4.4 Seedance 2.0 — motion engine + Multi-Reference

Two ways to animate a Melina still beyond Kling, both on fal:

- **Character tab → Video engine → Seedance 2.0** (image-to-video) — stronger multi-shot motion than Kling (good for dance/performance), ~3× the per-second cost. **Identity comes only from the start frame.**
- **Multi-Ref tab** (reference-to-video, `--ref-image`) — up to 9 reference images + optional `@Audio1` for beat-sync. Several *consistent* refs anchor identity across the whole clip.

**What testing established (don't relearn the hard way):**

1. **Single-image Seedance drifts.** The still's identity score is the *ceiling*; motion costs ~20–27 points (88→62, 72→45). Pick high-identity, **eyes-visible** frames — sunglasses / occluded eyes lose the anchor and fall below threshold.
2. **Multi-Reference fixes the drift — but only with the right inputs:**
   - ✅ **Consistent same-look refs** (same outfit/session) + **standard tier** (NOT fast/`--draft`) + **closer framing** (face large) → identity holds **72 → 78** across the clip.
   - ❌ Mixed outfits / fast tier / full-body tiny-face → **28–42** — it blends mismatched faces into an averaged one, *worse* than single-image.
3. **The content checker blocks your `refs/`.** `refs/face`, `refs/expr`, `refs/body` are all rejected (`partner_validation_failed`). Source multi-ref anchors from **finished images** (generated / Downloads stills), not `refs/`. The ChatGPT-app fashion images pass (even a bandeau/midriff shot).
4. **Recipe:** 3–6 consistent shots, standard tier, medium close-up prompt. In the Multi-Ref tab, **drag the thumbnails** to set `@Image1 … @Image9` order (or prefix filenames `1_`, `2_` on the CLI).

**Multi-shot / dance prompt shape** — Seedance reads structure Kling ignores:

```
{Total: 15s / {N} shots / 9:16. Photoreal, full colour, cinematic. The woman is @Image1 — keep her
face / freckles / grey-green eyes consistent. Cuts land on the beat of @Audio1.
Shot 1 ({t}): {framing + ONE camera move + action}.
Shot 2 ({t}): {…}.   number the beats; one primary camera move each; transitions = whip pan / lens switch}
```

**CLI:**

```bash
python main.py "label" --ref-image 1_a.png --ref-image 2_b.png --ref-audio track.mp3 \
  --aspect 9:16 --duration 15 --motion-prompt "<@-mention multi-shot prompt>"
# Standard tier = best identity (omit --draft). Add --upscale for a 1080p master (Topaz, finals only).
```

### 4.5 Flags & timing

- **Aspect:** `--aspect 9:16` (Reels), `4:5` (feed), `1:1` (X).
- **Face-lock:** always on for final runs. **Draft-first: always** — a bad final render costs more than any test.
- **Pre-scene-canvas:** locks a shared Melbourne environment across multi-scene Reels. Motion-only (Frame As-Is) for cheap, low-risk Story beats.
- **Clip cap:** Kling's ~15-second cap forces beat budgeting. For a Seedance multi-shot: **8 panels at ~1.9s** is the practical sweet spot for a single clip; **12 panels at 2s+ exceeds the cap** — use a **4+4 two-clip split** to guarantee true 2–2.5s beats.
- **Assembly:** FFmpeg concatenation; **hard cuts** are the default (each xfade triggers a full re-encode); pixelize used selectively at specific joins.

---

# Part 5 · Prompt Authoring

> **Route check first (Part 0).** Everything below assumes **Route B** (the pipeline injects identity).
> On **Route A** (ChatGPT), prepend the Part 1 Identity Lock, then apply these rules to the scene.

### 5.1 The golden rule — paste only the SCENE *(Route B)*

On Route B the pipeline injects Melina's identity for you — face, grey-green eyes, freckles, pale cool skin,
the long-hair default, the gold set, and youthful hands. So a good prompt is **just the scene + whatever
differs from the defaults.**

- **Do NOT paste the identity lock** on Route B — it stacks a second (often self-contradicting) lock, and in the Scenes box a multi-paragraph lock gets split into fragment-scenes.
- **Don't restate eyes / skin / freckles** — the lock owns them. Restate only what *changes* (a hairstyle restyle, wardrobe, setting, mood, pose).

### 5.2 Prompt-craft rules (each proven on real renders)

1. **Eyes & skin:** omit the colour entirely (or say grey-green / pale cool). Writing "blue-grey" or "warm-neutral" fights the locked anchors and the gate scores you down.
2. **Hair restyle = explicit override:** *"restyle her hair to a sleek jet-black bob … not her usual long hair."* Hair is soft, so an explicit line overrides the default.
3. **Film grain → POST, never the prompt.** Heavy in-prompt grain ("ISO-400, grain on the skin") tanks identity and the gate rejects it. Add grain in your editor.
4. **Flag-safe wardrobe wording.** fal's moderator flags these even when fully clothed: *sheer* (even negated), *bare, strip, skin-first, midriff, off-shoulder.* Use instead: *opaque, fully lined, fully covered, modest, one softly-draped shoulder.*
5. **Hands:** the lock anchors youthful hands — still avoid "visible veins / tendon definition" (reads aged). Let best-of-N pick the cleanest.
6. **One scene per paragraph** in the Scenes box — a scene can span lines; a **blank line** starts the next scene.

### 5.3 Per-prompt authoring block (copy once per shot)

```
## {N} — {short title}
Register: {relatable / glam / fashion / attitude / dreamy}  ·  Engine: {FLUX.2 Edit | PuLID}
Adjust/Bible-check: {what you changed from the reference and why — delete if faithful}

SCENE: {pose + framing}. {hair: default long waves, OR an explicit restyle}. {wardrobe — flag-safe
wording, fully covered}. {Melbourne setting + light}. {mood}. Vertical portrait.

Animate: {YES / NO / MAYBE} — {one line of reasoning}.
Motion: {one environmental beat + one subtle action — only if animating}.
```

### 5.4 House-style example prompts

*Clean Melbourne scenes that teach the pipeline your phrasing/framing/light. On Route B, identity is locked
separately, so these stay scene-only; on Route A, prepend Part 1.*

```
Melina seated by the window of a sunlit Melbourne laneway café, a flat white on the marble table,
a soft knowing half-smile to camera. Hair down in loose natural waves with the face-framing fringe.
Wardrobe: a fine charcoal knit, elevated-casual, no logos. Background: a bluestone laneway café,
hanging plants, soft afternoon light. Natural skin texture, visible pores, no retouching; she reads
pale and cool even in the warm light. Vertical portrait.
```

```
Melina at a kitchen bench in an inner-Melbourne warehouse-conversion apartment, holding a flat white
in both hands, looking slightly off-camera with a soft half-smile. Hair in a relaxed low ponytail
with the fringe loose. Wardrobe: a white ribbed tank and soft grey lounge pants, lived-in, no logos.
Background: bright morning light through tall windows, exposed brick, a few plants. Natural skin
texture, no retouching; bright light but the skin stays pale and cool. Vertical portrait.
```

```
Melina standing full-length in a studio, weight settled on one hip, one hand resting on her hip, a
cool composed gaze to camera. Hair sleek and glass-straight with the curtain fringe. Wardrobe: an
elegant floor-length gown, fitted bodice flaring softly to the floor, refined and fully covered, no
logos. Background: a seamless warm-taupe studio backdrop, soft directional key from front-left with
gentle falloff and a subtle backdrop shadow. Editorial, expensive, controlled. Vertical portrait.
```

```
Melina walking a leafy inner-Melbourne street in soft late-afternoon light, glancing off to the
side, unposed and caught mid-step. Hair down in loose waves with the fringe. Wardrobe: an oversized
cream blazer over a fine knit, straight-leg denim, minimal sneakers, no logos. Background: a leafy
Victorian-terrace street, dappled light, gentle shadows. Warm light falls on her but the skin stays
pale and cool, never golden. Natural skin texture, no retouching. Vertical portrait.
```

---

# Part 6 · QC Checklist (Consolidated)

Run this on every output. It merges the Bible's drift-watch, the Playbook's batch-QC line, and the Don'ts.

**Identity anchors (the HARD lock):**
- ☐ **Grey-green eyes** when visible — never blue, blue-grey, brown, or hazel.
- ☐ **Freckles** present and asymmetric — never airbrushed out or flattened.
- ☐ **Pale, cool skin** — never tanned / golden / warm-graded, even in Melbourne light.
- ☐ **Hair:** long base by default, correct colour (no warm-brown creep); if restyled, note it and keep it consistent through the piece.
- ☐ **Gold set** — hoops + right-wrist bracelet + pendant; no silver creep.
- ☐ **Youthful hands** — real anatomy, no aged veins/tendons.

**Drift watch (long-hair era — larger surface than the old bob):**
- ☐ Hair **length / volume / wave / parting** stable across the clip (Kling wanders here more than on the bob).
- ☐ No perspective/orbit-induced facial wobble (see camera-move drift ratings, Part 8).

**Content & safety:**
- ☐ No logos or lettering.
- ☐ No drift toward any real person's likeness.
- ☐ Wardrobe fully clothed; charged-but-clothed register only; no undress/boudoir.
- ☐ **Native AI-content label on every export.**

---

# Part 7 · Brand, Disclosure & Compliance (Australia)

Build the disclosed, clean foundation from post one so you're ready to monetise. Brand partners buy
**audience trust, not follower counts.** Two separate obligations: **advertising disclosure** (a hard legal
line) and **AI disclosure** (best practice, platform-required, strategic).

### 7.1 Target verticals

| Tier | Verticals |
|---|---|
| **A — natural fit** | Skincare & beauty, haircare, fragrance, activewear, casual fashion, minimalist jewellery, wellness, supplements — plus (given the openly-AI angle) AI / tech / creator-tool brands and the AI-curious adjacency. |
| **B — contextual fit** | Tech accessories, home & interiors, aesthetic-forward food & beverage, apps, automotive-**lifestyle** (her commute, not performance), fitness apparel and apps. |
| **C — handle carefully** | Fast fashion (dilutes the aspirational positioning), gaming (off the grid — possible via Stories-adjacent deals, carefully), finance / crypto (audience-trust risk). |
| **Avoid entirely** | Weight-loss / diet culture, anything requiring an altered aesthetic, products the audience would find jarring. |

> **AI disclosure to brand partners — non-negotiable.** Disclose the AI nature **upfront, in writing,
> before any deal.** A brand that discovers it later pulls the partnership and may go public. The openly-AI
> positioning makes this easy — nothing to hide, and it filters for the (growing) segment of brands willing
> to work with synthetic creators.

### 7.2 Rate card — estimated AUD benchmarks (10K–50K followers)

| Deliverable | Est. range (AUD) | Notes |
|---|---|---|
| Single Reel (brand integration) | $220 – $850 | Includes scripting + production |
| Reel + Story series (5 frames) | $370 – $1,300 | Bundle rate |
| Carousel post (5 images) | $150 – $580 | Expression + product shots |
| Story takeover (10 frames, 1 day) | $220 – $750 | Awareness campaigns |
| Monthly retainer (2 reels + 4 stories) | $900 – $3,600 | Preferred partnership tier |

Rough market benchmarks, not a precise currency conversion. Rates rise with follower count and engagement;
the 2.8× engagement edge is negotiation leverage. AI-creator rates are still settling — price with room to grow.

### 7.3 Advertising disclosure — the hard legal line

- Governed by the **Australian Consumer Law (ACL)**, enforced by the **ACCC**, with the **AANA Code of Ethics** requiring advertising be "clearly distinguishable" — clear, obvious, and upfront.
- **Acceptable labels:** #ad, Advert, Advertising, Branded Content, Paid Partnership, Paid Promotion. **Insufficient:** #sp, Spon, gifted, Affiliate, Collab, "thanks to," or just tagging the brand.
- **Do not bury disclosure in a hashtag stack.** It must be prominent — at the start of the caption, in the first seconds of a video, or on every Story frame, and readable (not hidden behind UI).
- **Gifting counts.** A material connection isn't only cash — gifts, PR packages, loaned products, discounts, and ambassadorships all require disclosure.
- Use Instagram's "Paid partnership" tag **AND** a written disclosure — don't rely on the platform tag alone.
- Enforcement is real and escalating: the ACCC issued its first financial penalty for undisclosed influencer posts in 2026 (Photobook Shop, ~AU$39,600). AiMCO's Australian Influencer Marketing Code of Practice is the best-practice reference.

### 7.4 AI disclosure — best practice, platform-required, strategic

Australia has **no standalone AI Act** as of 2026. The 2024 proposal for mandatory high-risk-AI guardrails
was set aside for a technology-neutral approach: AI is governed by existing laws (ACL, Privacy Act 1988,
Online Safety Act 2021) plus voluntary standards, with a new AI Safety Institute monitoring the landscape.
No Australian statute specifically forces "label this AI persona." **Disclose it anyway**, for three reasons:

- Presenting an AI as a real human without disclosure risks **misleading or deceptive conduct under the ACL** — which is enforced.
- **Meta / Instagram platform policy** requires AI-content labelling regardless of national law.
- It **is the strategy** (openly-AI is the edge) and the ethical default. Nothing to gain by hiding it.

The landscape is moving (AI Safety Institute, possible future reforms) — revisit periodically.

### 7.5 Identity & contracts

- Melina impersonates no real person — a wholly original synthetic persona. **Don't let recreations drift toward a real creator's likeness** (right-of-publicity exposure and brand-poison).
- The character has no legal identity, ABN, or tax status. **The operator (you / your entity) holds all contracts.** Name the operator entity, not the character.

> **Not legal advice.** This summarises the current landscape for orientation only. Confirm specific
> obligations with an Australian lawyer before you monetise — rules and enforcement are evolving.

---

# Part 8 · Camera Moves Reference

**How to read this.** Each move lists what the camera physically does, the feeling it creates, and a
**drift rating** for a **face-locked Kling / PuLID setup** — the more a move re-angles or re-lights the face,
the harder identity is to hold. Ratings run **Lowest → Low → Low–Med → Med → Med–High → High.** Prefer the
low end for identity-critical shots; reserve high-drift moves for anchor pieces where you can afford best-of-N
and tight QC. 30 moves across 7 categories.

**Quick pick by drift risk:**
- **Safest (Lowest–Low):** Static, Drift, Push In, Pull Out, Tilt Up/Down, Dutch Angle, Move Up/Down, Rack Focus.
- **Moderate (Low–Med / Med):** Pan Left/Right, Steadicam, Handheld, Move Left/Right, Parallax, Rotate CW/CCW, Crane Up/Down, Arc.
- **High-risk (Med–High / High):** Orbit (any), Chiaroscuro Arc, God's Eye, Dolly Zoom, Whip Pan, Fisheye.

### 8.1 Distance — moving toward or away

| Move | How it moves | Effect | Drift | Face-lock note |
|---|---|---|---|---|
| **Push In** | Camera travels straight toward the subject along the lens axis; the subject grows and the gap closes. | Intimacy or rising tension — pulls the viewer in toward the face. | **Low** | Subject stays front-on; among the safest moves for face-lock. |
| **Pull Out** | Camera retreats straight back; the subject shrinks and surrounding space is revealed. | Isolation, reveal, emotional distance. | **Low** | Face geometry holds as it recedes; very safe. |
| **Dolly Zoom** | Camera dollies one way while the lens zooms the opposite way; subject stays the same size while the background stretches. | Vertigo and unease — the world warping around a still subject. | **High** | Perspective re-renders the face every frame; expect identity wobble. |

### 8.2 Pivot — rotating in place

| Move | How it moves | Effect | Drift | Face-lock note |
|---|---|---|---|---|
| **Pan Left** | Camera stays planted and rotates horizontally left; subject slides toward the right of frame. | Follows or reveals across a horizontal space. | **Low–Med** | Mostly safe; the face turns slightly relative to lens. |
| **Pan Right** | Camera stays planted and rotates horizontally right; subject slides toward the left of frame. | Follows or reveals across a horizontal space. | **Low–Med** | Mostly safe; the face turns slightly relative to lens. |
| **Tilt Up** | Camera stays planted and pivots its lens upward; you travel up the subject — feet to face, or face to sky. | Reveals height; can feel reverent or grand. | **Low** | Vertical reveal; face stays oriented. |
| **Tilt Down** | Camera stays planted and pivots its lens downward, travelling down the subject or scene. | Looking down; diminishing or observational. | **Low** | Vertical reveal; face stays oriented. |
| **Dutch Angle** | Camera rolls on its lens axis so the horizon sits diagonally; it tips rather than travels. | Tension, instability, something's off. | **Low** | A roll only; facial detail is preserved. |
| **Whip Pan** | An extremely fast pan that smears the frame into motion blur, usually a transition between beats. | Energy; a hard cut hidden inside a blur. | **High** | The blur destroys facial detail mid-move — only the start and end frames hold. |
| **Rotate CW** | Camera rolls clockwise around its own lens axis — the whole frame spins. *(Some tools use "rotate" to mean orbiting the subject — check yours.)* | Disorientation, dream logic, a spinning world. | **Med** | A continuous roll; gentler than an orbit but still moving. |
| **Rotate CCW** | Camera rolls counter-clockwise around its lens axis — the frame spins the other way. | Disorientation, dream logic. | **Med** | A continuous roll; gentler than an orbit but still moving. |

### 8.3 Slide — moving the whole camera through space

| Move | How it moves | Effect | Drift | Face-lock note |
|---|---|---|---|---|
| **Move Left** | Camera slides bodily left while facing forward (a truck/track); background parallaxes past the subject. | Lateral motion with real depth. | **Med** | Sliding past reveals new angles of the face — more to drift than a pan. |
| **Move Right** | Camera slides bodily right while facing forward; background parallaxes past the subject. | Lateral motion with real depth. | **Med** | Reveals new angles of the face — more to drift than a pan. |
| **Move Up** | Camera rises straight up while staying level (boom/pedestal); subject settles lower in frame. | Lifts the perspective; grand or detaching. | **Low** | Level rise; face stays front-on. |
| **Move Down** | Camera lowers straight down while staying level; subject rises in frame. | Drops the perspective toward eye level or below. | **Low** | Level descent; face stays front-on. |
| **Drift** | A slow, gentle, almost-floating wander — small unmotivated movement that keeps a held frame alive. | Ambient, dreamy, breathing. | **Low** | Minimal travel — the safest way to add life to a still frame. **Your atmospheric default.** |
| **Parallax** | A lateral move staged so foreground and background slide past the subject at different rates, exaggerating depth. | Strong three-dimensionality — the world has layers. | **Med** | Depends on a lateral slide, so the face angle shifts. |

### 8.4 Orbit — circling the subject

| Move | How it moves | Effect | Drift | Face-lock note |
|---|---|---|---|---|
| **Orbit Left** | Camera circles the subject to the left, keeping them centered while the background wheels behind. | Showcases the subject in the round; a cinematic reveal. | **High** | You see the face from every angle in one move — the single hardest case for identity lock. |
| **Orbit Right** | Camera circles the subject to the right, keeping them centered as the background wheels. | Showcases the subject in the round. | **High** | Full angular sweep of the face — hardest case for identity lock. |
| **Orbit** | A full circle around the subject — they stay centered while the whole world rotates. | Hero moment; total reveal. | **High** | A complete 360° of the face — expect drift without a strong LoRA. |
| **Arc** | A partial sweep along a curved path — an orbit that doesn't complete the circle. | Dynamic reveal without the full spin. | **Med–High** | Less angle change than a full orbit, but the face still turns through the move. |
| **Chiaroscuro Arc** | An arc staged through dramatic light and shadow, so the face passes from shadow into key light as the camera travels. | Sculptural, moody, painterly. | **High** | Changing angle and changing harsh light at once — double the identity stress. |

### 8.5 Vertical — rising and falling on a boom/crane

| Move | How it moves | Effect | Drift | Face-lock note |
|---|---|---|---|---|
| **Crane Up** | Camera rises on a crane/jib, often tilting down to hold the subject as it climbs — lifting up and over. | Sweeping scale; a pull-back-and-up reveal. | **Med** | Height plus a downward tilt shifts the face angle. |
| **Crane Down** | Camera descends from above toward the subject, often settling to eye level. | Arrival; a descent into the scene. | **Med** | High-to-eye-level descent moves the face angle through the shot. |
| **God's Eye** | Camera looks straight down from directly overhead — a true top-down bird's-eye. | Detachment, pattern, fate looking down. | **High** | Little of the face is visible from overhead; identity rests on hair and silhouette, not features. |

### 8.6 Rig — the operator's body/stabilisation

| Move | How it moves | Effect | Drift | Face-lock note |
|---|---|---|---|---|
| **Static** | The camera doesn't move; the subject moves within a locked frame. | Stillness, composition, control — lets the subject carry it. | **Lowest** | Nothing moves the camera; **the safest possible choice for face-lock.** |
| **Handheld** | Hand-held: small organic shakes and corrections, like a real person holding it. | Realism, immediacy, energy. | **Med** | Shake can smear the face on faster frames — keep it gentle. |
| **Steadicam** | Camera floats on a stabiliser — smooth, gliding movement that follows the subject fluidly. | Elegant, immersive following motion without the shake. | **Low–Med** | Smooth follow; safer than handheld, more alive than static. |

### 8.7 Lens — optical, not positional

| Move | How it moves | Effect | Drift | Face-lock note |
|---|---|---|---|---|
| **Rack Focus** | The camera doesn't move — focus pulls from one plane to another (e.g. foreground object onto the subject). | Redirects attention; shifts the story's emphasis. | **Low** | No camera travel; only focus changes. |
| **Fisheye** | Not a move but a lens — an ultra-wide optic that bulges the frame, curving straight lines outward. | Surreal, exaggerated, skate-video energy. | **High** | Barrel distortion warps facial proportions; identity bends with the lens. |

---

# Appendix A · Launch Checklist

Complete every item before the account goes live.

- ☐ **Persona name + cross-platform handle LOCKED.** Handles secured on Instagram / TikTok / X / Threads **BEFORE** deleting any old socials. *(Renaming ≠ deleting — you can rebrand without losing anything. If you do delete, claim the new handles first; freed-up handles get taken fast.)*
- ☐ **Long-hair reference set regenerated** (face / body / expressions on the long base); face-lock verified. *(See Part 1 Open Blocker — this is #1.)*
- ☐ Resolved anchors confirmed across outputs: grey-green eyes, light cool-neutral skin (holds in Melbourne light), freckles, long-hair base + three stylings, gold set.
- ☐ Intro reel produced (anchor pipeline), AI-disclosed, scheduled as post #1.
- ☐ Bio written: "AI-generated persona" + Melbourne + niche. Native AI-content label on.
- ☐ Posting model set: Reels-first cheap-format cadence; Stories daily (e-girl texture lives here).
- ☐ One or two ownable Reel formats chosen, with a batch produced ahead.
- ☐ First 9 grid posts planned across pillars — grid preview approved (the conversion layer).
- ☐ Production split confirmed: talking-head = anchors only.
- ☐ Compliance understood: ACL / AANA ad disclosure; AI disclosure via platform label + (where ads run) a prominent #ad; operator entity holds contracts.
- ☐ Rate card prepared in AUD (for when you monetise).
- ☐ Realistic target set (tens of thousands over 6–18 months); not chasing millions solo.

### The intro reel (post #1) — an anchor piece; full pipeline justified

**Image brief:** Melina, head-to-waist, slight three-quarter angle, relaxed open posture. Long jet-black
hair worn down in a soft blowout, face-framing bangs. Cool grey-green eyes to the lens. Light, cool-neutral
skin with freckles, natural texture. Gold signature set. Wardrobe: an elevated-minimalist knit or quality
casual top, no logos. Background: a recognisably-Melbourne interior softening out of focus — terrace or
warehouse light, tall windows. Lighting: soft, directional, natural, warm-but-not-tanning on the skin.
Camera: static, medium, 9:16.

**Script:**

> "Hey, I'm Melina — a model and content creator here in Melbourne. *[pause 1.2s]* And I'm AI. Completely
> synthetic, and not hiding it. Stick around — I make nice things."

Keep it warm and confident. The pause before "And I'm AI" gives the reveal weight; the openly-AI line is the
disclosure **and** the hook in one. Maximum two direction tags.

---

# Appendix B · Reconciliation Log

What was merged from where, and every editorial decision — so nothing was silently changed.

**Sources merged:** `Character_Bible_Melbourne` (persona, strategy, compliance, launch) · `Melina_Prompt_Playbook`
(authoring craft, pipeline routing, house-style prompts) · `camera-moves` (30 moves, drift ratings).

1. **Identity-injection contradiction — RESOLVED via a routing gate (Part 0).** The Playbook's "paste only the
   scene" and the Bible's "prepend the full identity lock" are *both* correct, but for different routes. They read
   as a flat contradiction only because neither document named the condition. Fix: an explicit **Route A (ChatGPT,
   self-contained prompts) vs Route B (pipeline injects)** gate up front; Part 5's "golden rule" is now marked
   Route-B-only. **This is the highest-value change in the merge** — following the wrong rule silently drifts identity.

2. **Identity spec — DE-DUPLICATED into one canonical block (Part 1).** The look was previously specified in three
   places (Bible §02, Bible §05, Playbook §0/§2/§7) with minor wording differences. Consolidated into a single
   source of truth; the gold-bracelet-on-**right**-wrist and youthful-hands details were unified.

3. **Content pillars — FLAGGED, NOT overwritten (Part 3.6).** The Bible's pillar table (Fashion 25 / Aesthetic
   Daily 25 / Job 15 / Fitness 15 / Emotional 12 / Openly-AI 8) does **not** match the split recent production has
   been running (Emotional- and Aesthetic-led, with Drawing/Creative and Cars, no Lego). The Bible version is
   preserved because it's what's on file, with a visible ⚠ note. **Decision needed:** confirm which pillar set is
   canonical, then rewrite this section to match.

4. **Eye colour — INTERNALLY CONSISTENT here, but refs still lag.** All three source files already agree on
   **grey-green** (the Bible explicitly supersedes the old "blue-grey"). The unresolved part is external: the
   reference *images* and any face-lock ref still show the retired **bob** and may still encode **blue-grey**.
   Carried forward as the **Open Blocker (Part 1)** and the #1 launch item.

5. **QC — CONSOLIDATED (Part 6).** The Bible's drift-watch, the Playbook's batch-QC line, and the Bible's Don'ts
   were overlapping. Merged into one checklist.

6. **Camera moves — TRANSCRIBED IN FULL (Part 8).** All 30 moves across 7 categories preserved with their how /
   effect / drift / face-lock note, reorganised into per-category tables plus a drift-risk quick-pick. Cross-linked
   to the QC drift-watch.

7. **Timing/assembly craft — ADDED to Part 4.5** from established practice (Kling 15s cap → 8-panel sweet spot,
   4+4 split for true 2–2.5s beats; FFmpeg hard-cut default). Not in the original three files as written, but
   operationally part of the same pipeline; included for completeness. Remove if you want the doc to stay strictly
   to the three source files.

---

*Melina · Master Production Reference · Rev 3.0 · Melbourne · Consolidated · internal use only. An operational guide — update it as the character and account evolve.*
