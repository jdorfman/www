---
name: add-video
description: Add a new YouTube video to the portfolio. New video becomes Horizontal Video Card 1, all others shift down, oldest goes to More section. Use when user types /add-video followed by a YouTube URL.
---

# Add Video to Portfolio

When the user types `/add-video <URL>` (optional quoted title and category), run the add script from the repo root. Do **not** edit video HTML in `index.html` by hand.

## Command

```bash
node scripts/add-video.mjs "<URL>" ["Custom Title"] ["Category Name"]
```

- URL: any YouTube format (`watch?v=`, `youtu.be/`, `embed/`)
- Title: fetched from YouTube oEmbed unless overridden
- Category: defaults to `Demos` unless overridden

## On success

Confirm the video title and that it is now **Horizontal Video Card 1** (featured). Mention `/git` if the user wants to commit and open a PR.

## On failure

Report the script error (stderr). Do not fall back to manual HTML edits.

## Data source

Videos are stored newest-first in `data/videos.json`. The script updates JSON and regenerates the marked section in `index.html` via `scripts/render-videos.mjs`.

## Rotation (unchanged)

| Position | Role |
|----------|------|
| JSON index 0 | Horizontal Card 1 (new video) |
| 1 | Horizontal Card 2 |
| 2–4 | Small Cards 1–3 |
| 5+ | More section (archived) |
