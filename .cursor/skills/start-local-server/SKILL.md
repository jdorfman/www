---
name: start-local-server
description: Start the local preview server for this static site with npx live-server on port 8080. Use when the user types /start-local-server, asks to preview the site locally, or hits ERR_CONNECTION_REFUSED on 127.0.0.1:8080.
---

# Start Local Server

When the user types `/start-local-server`, serve the repo root with `npx live-server`.

## Command

From the repository root:

```bash
npx --yes live-server --port=8080 --host=127.0.0.1 --no-browser
```

## Steps

1. Check whether something is already serving `http://127.0.0.1:8080/`:
   - `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8080/`
   - If you get `200`, report that the server is already running and stop.
2. Otherwise start `live-server` in the background (do not open a browser).
3. Wait until the process prints `Ready for changes` (or equivalent) and confirm with a `200` from curl.
4. Tell the user the site is available at **http://127.0.0.1:8080/**

## Notes

- Always use `npx live-server` (see `AGENTS.md`). Do not switch to Python `http.server`, Vite, or another static server unless the user asks.
- Bind to `127.0.0.1:8080` so local browser previews and resume PDF generation stay consistent.
- Keep the server running after starting it; do not kill an existing healthy instance.
