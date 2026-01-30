# Justin Dorfman's Portfolio

Personal portfolio website showcasing videos, projects, and professional work.

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
1. Extracts the video ID from any YouTube URL format
2. Fetches the video title automatically via YouTube's oEmbed API
3. Places the new video as Horizontal Card 1 (featured position)
4. Cascades all existing videos down one position
5. Moves the oldest video (Small Card 3) to the "More" section

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

## Local Development

```bash
npx live-server
```

## File Structure

```
├── index.html                      # Main portfolio page
├── man.html                        # Man page style resume
├── CNAME                           # Custom domain configuration
├── AGENTS.md                       # AI agent instructions
└── .cursor/
    └── skills/
        └── add-video/
            └── SKILL.md            # Video addition automation skill
```
