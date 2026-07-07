# CLAUDE.md — project-vibe

Guidance for Claude Code (and any agent) working in this repo.

## What this repo is

A production workspace for **Melina Jones Voss** — a wholly original, openly-AI social-media
persona (Melbourne, relatable-glam). The repo holds the character reference, the production
system, the installed agent skills, and the generated media.

## Read these first

1. **`docs/Melina_Master_Reference.md`** — the character bible (Rev 3.0). Identity, persona,
   strategy, compliance, prompt craft, camera moves. **This is the source of truth for identity.**
2. **`PRODUCTION_SYSTEM.md`** — how the bible becomes content via the Higgs Field connector:
   the pipeline, the model routing, the cost reality, and the naming rules.

## The character (constant)

- Higgs Field trained Soul → `model: soul_2`, `soul_id: 63d8ff04-4518-463f-84ac-8a3d5ddd7192`.
- Identity is injected by the `soul_id` (bible **Route B**) → prompts are **scene-only**.
  Never paste the Identity Lock; never write "blue-grey" eyes or "warm/tanned" skin.

## Folders

| Path | Contents |
|---|---|
| `Image_Soul2/` | Generated stills + `MANIFEST.md`. Filenames carry a Title (see naming rules). |
| `Video_Soul2/` | Generated videos + `MANIFEST.md`. Each filename is **derived from its source image**. |
| `docs/` | The character bible. |
| `.claude/skills/` | Installed agent skills (see below). |

## Naming (hard rules — do not break)

- **Image:** `MEL_<NNN>_<PILLAR>_<Title-In-Kebab>_<aspect>.png` — every image has a Title.
- **Video:** `<image-slug-minus-aspect>__<CameraMove>_<Ns>.mp4` — the video name comes from the
  image it was generated from. Full spec in `PRODUCTION_SYSTEM.md` §3.
- Pillars: `FASH LIFE JOB FIT EMO AI`. Never reuse a running number.

## Installed skills (`.claude/skills/`, via skills.sh / `npx skills`)

- **Discovery:** `find-skills`
- **Code guidelines:** `karpathy-guidelines`
- **Design / UX / UI:** `impeccable`, `gpt-taste`, `minimalist-ui`, `industrial-brutalist-ui`,
  `redesign-existing-projects`, `imagegen-frontend-web`, `imagegen-frontend-mobile`, `brandkit`
- **Social / content (`*-sms`):** `content-strategy`, `content-calendar`, `platform-strategy`,
  `post-writer`, `caption-writer`, `carousel-writer`, `thread-writer`, `hook-writer`,
  `content-repurposer`, `performance-analyzer`, `audience-growth-tracker`,
  `content-pattern-analyzer`, `optimization-advisor`, `social-media-context`

`skills-lock.json` records the exact set — restore with `npx skills experimental_install`.
Add more with `npx skills add <owner/repo> --skill <name> --agent claude-code --copy -y`.

## Working style (from `karpathy-guidelines`)

Keep changes surgical; don't overcomplicate; surface assumptions instead of guessing; define what
"done" looks like. For any media generation, **preflight cost** (`get_cost: true`) and **draft-first**
on video — a bad final render costs far more than a test.

## Compliance (non-negotiable — bible Part 7)

Openly-AI: native AI label on every export. Any paid content carries a prominent `#ad` /
"Paid partnership" in the caption body. Fully clothed, charged-but-clothed register only.
