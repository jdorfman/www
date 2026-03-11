#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT_PATH="${1:-"$ROOT_DIR/resume.pdf"}"
TMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/resume-pdf.XXXXXX")"
TMP_OUTPUT="$TMP_DIR/resume.pdf"
TMP_PROFILE="$TMP_DIR/chrome-profile"
DEFAULT_URL="http://127.0.0.1:8080/resume.html"
TEMP_PORT="8765"
TEMP_URL="http://127.0.0.1:${TEMP_PORT}/resume.html"
SERVER_PID=""

find_chrome() {
  local candidates=()

  if [[ -n "${CHROME_BIN:-}" ]]; then
    candidates+=("$CHROME_BIN")
  fi

  candidates+=(
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary"
    "/Applications/Chromium.app/Contents/MacOS/Chromium"
  )

  local candidate
  for candidate in "${candidates[@]}"; do
    if [[ -x "$candidate" ]]; then
      printf '%s\n' "$candidate"
      return 0
    fi
  done

  return 1
}

cleanup() {
  if [[ -n "$SERVER_PID" ]] && kill -0 "$SERVER_PID" >/dev/null 2>&1; then
    kill "$SERVER_PID" >/dev/null 2>&1 || true
    wait "$SERVER_PID" 2>/dev/null || true
  fi
  rm -rf "$TMP_DIR"
}

wait_for_url() {
  local url="$1"
  local retries="${2:-20}"
  local delay="${3:-1}"
  local attempt

  for ((attempt = 1; attempt <= retries; attempt += 1)); do
    if curl -fsS "$url" >/dev/null 2>&1; then
      return 0
    fi
    sleep "$delay"
  done

  return 1
}

trap cleanup EXIT

rm -f "$TMP_OUTPUT"
rm -rf "$TMP_PROFILE"

CHROME_BIN="$(find_chrome)" || {
  echo "Could not find a Chrome/Chromium binary. Set CHROME_BIN to override." >&2
  exit 1
}

if wait_for_url "$DEFAULT_URL" 1 1; then
  RESUME_URL="$DEFAULT_URL"
else
  (
    cd "$ROOT_DIR"
    npx live-server --quiet --host=127.0.0.1 --port="$TEMP_PORT" --no-browser
  ) >/dev/null 2>&1 &
  SERVER_PID="$!"

  if ! wait_for_url "$TEMP_URL" 30 1; then
    echo "Timed out waiting for temporary live-server at $TEMP_URL" >&2
    exit 1
  fi

  RESUME_URL="$TEMP_URL"
fi

python3 - "$CHROME_BIN" "$RESUME_URL" "$TMP_OUTPUT" "$TMP_PROFILE" <<'PY'
import os
import subprocess
import sys
import time

chrome_bin, resume_url, output_path, profile_dir = sys.argv[1:]

command = [
    chrome_bin,
    "--headless=new",
    "--disable-gpu",
    "--disable-background-networking",
    "--disable-component-update",
    "--disable-default-apps",
    "--disable-sync",
    f"--user-data-dir={profile_dir}",
    "--no-pdf-header-footer",
    "--virtual-time-budget=5000",
    f"--print-to-pdf={output_path}",
    resume_url,
]

process = subprocess.Popen(
    command,
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL,
)

deadline = time.time() + 45
last_size = -1
stable_checks = 0

while time.time() < deadline:
    if os.path.exists(output_path):
        size = os.path.getsize(output_path)
        if size > 0 and size == last_size:
            stable_checks += 1
        else:
            stable_checks = 0
            last_size = size

        if stable_checks >= 2:
            process.terminate()
            try:
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                process.kill()
                process.wait(timeout=5)
            sys.exit(0)

    if process.poll() is not None:
        sys.exit(0 if os.path.exists(output_path) and os.path.getsize(output_path) > 0 else process.returncode or 1)

    time.sleep(1)

if process.poll() is None:
    process.terminate()
    try:
        process.wait(timeout=5)
    except subprocess.TimeoutExpired:
        process.kill()
        process.wait(timeout=5)

sys.exit(0 if os.path.exists(output_path) and os.path.getsize(output_path) > 0 else 1)
PY

mkdir -p "$(dirname "$OUTPUT_PATH")"
mv "$TMP_OUTPUT" "$OUTPUT_PATH"

echo "Generated $(basename "$OUTPUT_PATH") from $RESUME_URL"
