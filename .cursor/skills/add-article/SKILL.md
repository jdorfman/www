---
name: add-article
description: Add an external article to the portfolio. New article becomes Horizontal Article Card 1, all others shift down, oldest goes to More section. Use when user types /add-article followed by an article URL.
---

# Add Article to Portfolio

When the user types `/add-article <URL>` (optional quoted title and category), run the add script from the repo root. Do **not** edit article HTML in `index.html` by hand.

## Command

```bash
node scripts/add-article.mjs "<URL>" ["Custom Title"] ["Category Name"]
```

- URL: any public article/blog post with Open Graph metadata
- Title: fetched from `og:title` unless overridden
- Category: fetched from `og:site_name` (hostname fallback) unless overridden
- Image: `og:image` is required — script fails if missing; user fixes manually

## On success (new article)

Confirm the article title and that it is now **Horizontal Article Card 1** (featured). Mention `/git` if the user wants to commit and open a PR.

## On success (duplicate URL)

Confirm the article was **updated in place** (metadata and image refreshed; list position unchanged).

## On failure

Report the script error (stderr). Do not fall back to manual HTML edits.

## Data source

Articles are stored newest-first in `data/articles.json`. OG images are saved under `assets/articles/`. The script updates JSON and regenerates the marked sections in `index.html` via `scripts/render-articles.mjs`.

## Rotation (unchanged)

| Position | Role |
|----------|------|
| JSON index 0 | Horizontal Card 1 (new article) |
| 1 | Horizontal Card 2 |
| 2–4 | Small Cards 1–3 |
| 5+ | More section (archived) |

## Do not edit by hand

- `<!-- ARTICLES:START -->` … `<!-- ARTICLES:END -->`
- `<!-- MORE_ARTICLES:START -->` … `<!-- MORE_ARTICLES:END -->`
