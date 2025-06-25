# AGENT.md - Personal Website Development Guide

## Build/Lint/Test Commands
- No build process required - static HTML/CSS/JS website
- To serve locally: `python -m http.server 8000` or `npx serve .`
- To validate HTML: `npx htmllint index.html`
- To format: VS Code's built-in HTML formatter

## Architecture & Codebase Structure
- **Single-page static website** - Personal portfolio/manual page
- **Main file**: `index.html` - Contains all HTML, CSS, and JavaScript inline
- **Deployment**: GitHub Pages (via CNAME file)
- **Authentication**: `keybase.txt` for Keybase verification
- **No external dependencies** - Pure HTML/CSS/JS

## Code Style Guidelines
- **HTML**: Semantic HTML5, proper indentation (2 spaces)
- **CSS**: CSS custom properties for theming, responsive design with media queries
- **JavaScript**: Vanilla JS, camelCase variables, event listeners for theme switching
- **Naming**: Descriptive class names like `.theme-container`, `.section-title`
- **Theming**: CSS variables for light/dark mode support
- **Responsive**: Mobile-first approach, hide complex UI on mobile
- **Comments**: Minimal inline comments, self-documenting code preferred
- **Formatting**: Consistent 2-space indentation throughout
