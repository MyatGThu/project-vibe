#!/usr/bin/env bash
# fetch_media.sh — download the generated Melina assets into Image_Soul2/ and Video_Soul2/
# with their canonical Title-based names.
#
# WHY THIS EXISTS: the session that generated these ran in a sandbox whose egress policy
# blocks the Higgs Field media CDN, so the binaries could not be committed directly. Run this
# from any machine/environment with open internet (or after allowlisting the CDN host) to
# reconstruct the exact named files. The URLs + job_ids are the record; see each folder's
# MANIFEST.md and the per-asset .json sidecars.
#
# Usage:  bash fetch_media.sh
set -euo pipefail
cd "$(dirname "$0")"

dl() { # dl <dest_path> <url>
  local dest="$1" url="$2"
  if [ -s "$dest" ]; then echo "skip (exists)  $dest"; return; fi
  echo "get  $dest"
  curl -fSL --retry 4 --retry-delay 2 -o "$dest" "$url"
}

CDN="https://d8j0ntlcm91z4.cloudfront.net/user_31workO8jZ5gU3syoAaChkbmNoX"

# ---- Images (Image_Soul2/) ----
dl "Image_Soul2/MEL_001_LIFE_Laneway-Cafe-Flat-White_9x16.png"  "$CDN/hf_20260707_055443_09607f8a-38ae-4451-a475-a86570078afe.png"
dl "Image_Soul2/MEL_002_FASH_Studio-Gown-Editorial_3x4.png"      "$CDN/hf_20260707_055445_ae5c5936-fc1a-4494-a3b5-41f34266cd2e.png"
dl "Image_Soul2/MEL_003_JOB_On-Set-Getting-Ready_9x16.png"       "$CDN/hf_20260707_055448_af896147-da54-406e-bcf9-3bf9e1937d9b.png"
dl "Image_Soul2/MEL_004_FIT_Bayside-Movement_9x16.png"           "$CDN/hf_20260707_055451_1fc23626-0617-4925-a924-cc9e1f2a9543.png"
dl "Image_Soul2/MEL_005_EMO_Warehouse-Window-Pensive_3x4.png"    "$CDN/hf_20260707_055454_802ffc90-f153-4445-8f4c-2f9abe612b5b.png"
dl "Image_Soul2/MEL_006_AI_Intro-Anchor-Portrait_9x16.png"       "$CDN/hf_20260707_055456_93ae005e-eff1-4356-967a-cd6bece2dd89.png"
dl "Image_Soul2/MEL_007_EMO_Night-Street-After-Rain_9x16.png" "$CDN/hf_20260707_060714_57e867da-bf61-43fd-b2ee-8dc048610d63.png"

# ---- Videos (Video_Soul2/) ----

dl "Video_Soul2/MEL_006_AI_Intro-Anchor-Portrait__SlowPushIn_5s.mp4" "$CDN/hf_20260707_055934_95e76c11-c236-4f90-9cb0-ac2a7c186eed.mp4"
dl "Video_Soul2/MEL_001_LIFE_Laneway-Cafe-Flat-White__Drift_5s.mp4"  "$CDN/hf_20260707_055936_3b80efa2-2f78-4542-a48c-f282d4fa0f34.mp4"

# ---- Storyboards (Image_Soul2/Storyboards/) ----
dl "Image_Soul2/Storyboards/SB_001_Four-Seasons-in-a-Day_16x9.png" "$CDN/hf_20260707_061014_fe63aff9-51d8-4941-9edd-58da70d721f1.png"
dl "Image_Soul2/Storyboards/SB_002_The-Job_16x9.png"                "$CDN/hf_20260707_061020_ee97faf5-4035-4c2f-ab2c-32ea8a6a2edc.png"
dl "Image_Soul2/Storyboards/SB_003_Openly-AI_16x9.png"              "$CDN/hf_20260707_061024_0a6bd9e2-86c2-4029-ba1b-d8fa6a322023.png"

echo "done."
