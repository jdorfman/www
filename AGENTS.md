# Repository Memory

## Build/Test Commands
- Preview site locally: `npx --yes live-server --port=8080 --host=127.0.0.1 --no-browser` — or user command `/start-local-server`
- Validation: Check HTML validity with W3C validator

## Code Style Guidelines

### HTML
- Use HTML5 doctype
- Include proper meta tags (charset, viewport)
- Indentation: 2 spaces
- Use semantic HTML elements

### CSS
- CSS variables for theming
- Use descriptive class names
- Prefer class selectors over tag selectors

### JavaScript
- Use ES6+ features with function declarations
- Follow camelCase naming for functions and variables
- Modular functionality (theme handling, etc.)
- Include comments for function purpose

### General
- Keep code simple and maintainable
- Focus on accessibility (semantic HTML, color contrast)
- Dark mode only (do not add light-mode / prefers-color-scheme overrides)

### Local server
Always use `npx live-server` to serve the site locally (`/start-local-server` skill)

## Portfolio videos

- **Source of truth:** `data/videos.json` (newest-first array of `{ id, title, category }`)
- **Add a video:** `node scripts/add-video.mjs "<youtube-url>" ["Title"] ["Category"]` — or user command `/add-video <URL>`
- **Re-render only:** `node scripts/render-videos.mjs` after editing `videos.json`
- **Do not** edit the generated blocks between `<!-- VIDEOS:START -->` / `<!-- VIDEOS:END -->` or `<!-- MORE_VIDEOS:START -->` / `<!-- MORE_VIDEOS:END -->` in `index.html` by hand
- Shorts carousel remains hand-edited in `index.html` (`/add-short` skill)

## Portfolio articles

- **Source of truth:** `data/articles.json` (newest-first array of `{ slug, url, title, category, image, publishedAt? }`)
- **Add an article:** `node scripts/add-article.mjs "<url>" ["Title"] ["Category"]` — or user command `/add-article <URL>`
- **Re-render only:** `node scripts/render-articles.mjs` after editing `articles.json`
- **OG images** saved to `assets/articles/`; script requires `og:image` (no placeholder)
- **Duplicate URL** updates metadata/image in place without changing list position
- **Do not** edit the generated blocks between `<!-- ARTICLES:START -->` / `<!-- ARTICLES:END -->` or `<!-- MORE_ARTICLES:START -->` / `<!-- MORE_ARTICLES:END -->` in `index.html` by hand