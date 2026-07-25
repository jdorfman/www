# Repository Memory

## Build/Test Commands
- Preview site locally: Not configured (standard web files only)
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
- Support light/dark mode and system preferences

### Local server
Always use `npx live-server` to serve the site locally

## Portfolio videos

- **Source of truth:** `data/videos.json` (newest-first array of `{ id, title, category }`)
- **Add a video:** `node scripts/add-video.mjs "<youtube-url>" ["Title"] ["Category"]` — or user command `/add-video <URL>`
- **Re-render only:** `node scripts/render-videos.mjs` after editing `videos.json`
- **Do not** edit the generated block between `<!-- VIDEOS:START -->` and `<!-- VIDEOS:END -->` in `index.html` by hand
- Shorts carousel remains hand-edited in `index.html` (`/add-short` skill)

## Cursor Cloud specific instructions

This is a static site (no `package.json`/lockfile, no build step). Node and Chrome are pre-installed; `live-server` runs via `npx` (cached, no install needed).

- **Run the site (dev):** `npx live-server --port=8080 --host=127.0.0.1 --no-browser` from the repo root, then open `http://127.0.0.1:8080/`. Serves `index.html`, `resume.html`, and `man.html`.
- **Render videos:** `node scripts/render-videos.mjs` (or `node scripts/add-video.mjs <url>`) regenerates the block between `<!-- VIDEOS:START/END -->` in `index.html` from `data/videos.json`. `add-video.mjs` fetches the title from YouTube's oEmbed API (needs network); pass a title override as a second arg to skip that.
- **Resume PDF:** `./scripts/generate-resume-pdf.sh` needs Chrome. The script only auto-detects macOS Chrome paths, so on this Linux VM you MUST set `CHROME_BIN=/usr/local/bin/google-chrome ./scripts/generate-resume-pdf.sh`. It reuses a live-server already running on `127.0.0.1:8080`, otherwise starts a temporary one on port 8765.
- **Lint/tests:** none configured; validate by loading pages in the browser.