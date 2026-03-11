---
name: resume
description: Generate `resume.pdf` from `resume.html` and verify whether the checked-in PDF is stale. Use when the user types `/resume`, asks to regenerate the resume PDF, or wants to check whether `resume.pdf` matches the current HTML.
---

# Resume PDF

When the user types `/resume`, follow this workflow.

## Goal

Keep `resume.pdf` in sync with `resume.html` using the repository's script instead of manual browser printing.

## Steps

1. Check whether `resume.pdf` is stale:
   - Compare modification times for `resume.html` and `resume.pdf`.
   - If `resume.html` is newer, say the existing PDF is stale before regenerating.

2. Generate the PDF with:

```bash
./scripts/generate-resume-pdf.sh
```

3. Verify success:
   - Run `ls -lh resume.pdf`
   - Report the file size and modified time

4. If generation fails:
   - Check whether Chrome is installed at a standard macOS path or via `CHROME_BIN`
   - If a local server is already serving the repo on `127.0.0.1:8080`, the script reuses it
   - Otherwise, the script starts a temporary `npx live-server` instance automatically

## Notes

- Do not hand-edit `resume.pdf`.
- Prefer the script even if a browser tab is already open; it gives a repeatable result.
- The script waits for runtime-rendered content in `resume.html` before writing the PDF.
