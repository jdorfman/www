# Justin Dorfman's Portfolio

Personal portfolio website showcasing videos, projects, and professional work.

## Table of Contents

- [Cursor AI Skills](#cursor-ai-skills)
  - [`/add-video`](#add-video---add-a-new-youtube-video)
  - [`/resume`](#resume---regenerate-the-resume-pdf)
  - [`/git`](#git---stage-commit-push--open-a-pr)
- [Resume](#resume)
- [Deployment](#deployment)
- [Local Development](#local-development)
- [File Structure](#file-structure)

## Cursor AI Skills

This repository includes custom Cursor AI skills to automate common tasks.

### `/add-video` - Add a New YouTube Video

Automatically adds a new YouTube video to the portfolio with proper rotation.

**Usage:**
```
/add-video <YouTube URL>
```

**Examples:**
```
/add-video https://www.youtube.com/watch?v=abc123
/add-video https://youtu.be/abc123
```

**What it does:**
1. Runs `node scripts/add-video.mjs` with your URL
2. Extracts the video ID and fetches the title via YouTube's oEmbed API
3. Prepends the video to `data/videos.json` (newest first)
4. Regenerates the video section in `index.html` (Horizontal Card 1 featured; oldest archived to More)

**Manual CLI (same as the agent runs):**
```bash
node scripts/add-video.mjs "https://www.youtube.com/watch?v=abc123"
node scripts/render-videos.mjs   # re-render only, after editing data/videos.json
```

**Optional overrides:**
```
/add-video URL "Custom Title"
/add-video URL "Custom Title" "Category Name"
```

**Video rotation order:**
| Position | Action |
|----------|--------|
| Horizontal Card 1 | ← New video goes here |
| Horizontal Card 2 | ← Previous Horizontal Card 1 |
| Small Card 1 | ← Previous Horizontal Card 2 (changes to small) |
| Small Card 2 | ← Previous Small Card 1 |
| Small Card 3 | ← Previous Small Card 2 |
| More Section | ← Previous Small Card 3 (archived) |

**Skill location:** `.cursor/skills/add-video/SKILL.md`

### `/resume` - Regenerate the Resume PDF

Checks whether `resume.pdf` is stale, then regenerates it from `resume.html`.

**Usage:**
```
/resume
```

**What it does:**
1. Compares `resume.html` and `resume.pdf` timestamps
2. Rebuilds `resume.pdf` from the HTML using headless Chrome
3. Reuses the existing local server when available, or starts a temporary one
4. Verifies the generated PDF file

**Skill location:** `.cursor/skills/resume/SKILL.md`

### `/git` - Stage, Commit, Push & Open a PR

Automates the full git workflow in one command.

**Usage:**
```
/git
```

**What it does:**
1. Stages all changes
2. Generates a commit message based on the diff
3. Pushes to the remote branch
4. Opens a pull request

**Skill location:** `~/.cursor/skills/git/SKILL.md` (global skill)

## Resume

The resume is static HTML with no build process. To update:

- **Content:** Edit [resume.html](resume.html) directly (experience, skills, summary, etc.)
- **"Last updated" date:** Change the text at the bottom of the page
- **Duration auto-calculation:** Elements with `data-start-date="YYYY-MM"` and `data-start-text="Month Year"` automatically show "Month Year - Present (X years Y months)" at runtime
- **PDF:** Run `./scripts/generate-resume-pdf.sh` or use `/resume` to regenerate `resume.pdf`
- **man.html:** A separate man-page style resume; update independently if you want it in sync

## Deployment

This site is deployed on [Cloudflare Pages](https://pages.cloudflare.com/). The `wrangler.jsonc` file configures the deployment settings for Cloudflare's Wrangler CLI.

## Local Development

```bash
npx live-server
```

## File Structure

```
├── index.html                      # Main portfolio page
├── data/
│   └── videos.json                 # Long-form videos (newest first); source of truth
├── resume.html                     # Resume page
├── man.html                        # Man page style resume
├── scripts/
│   ├── add-video.mjs               # Add video + render index.html
│   ├── render-videos.mjs           # Regenerate video HTML from videos.json
│   ├── migrate-videos-to-json.mjs  # One-time HTML → JSON migration
│   └── generate-resume-pdf.sh      # Generates resume.pdf from resume.html
├── wrangler.jsonc                  # Cloudflare Pages deployment config
├── AGENTS.md                       # AI agent instructions
└── .cursor/
    └── skills/
        ├── add-video/
        │   └── SKILL.md            # Video addition automation skill
        └── resume/
            └── SKILL.md            # Resume PDF generation skill

# Global Cursor skills (not in this repo)
~/.cursor/skills/
└── git/
    └── SKILL.md                    # Git workflow automation skill (/git)
```
