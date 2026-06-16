#!/bin/bash
# habitat3ri.eu — auto-deploy on master push
# Cron: * * * * *  (every minute, flock-guarded to prevent concurrent rebuilds)

set -euo pipefail

REPO_DIR=/opt/habitat3ri-web
LOG=/var/log/habitat3ri-deploy.log
LOCK=/var/run/habitat3ri-deploy.lock

# Single-instance via flock
exec 200>"$LOCK"
flock -n 200 || exit 0

cd "$REPO_DIR"

# Capture current Telegram creds (optional notify)
TELEGRAM_BOT_TOKEN=$(grep -E '^TELEGRAM_BOT_TOKEN=' .env 2>/dev/null | cut -d= -f2- | tr -d '"' || true)
TELEGRAM_CHAT_ID=$(grep -E '^TELEGRAM_CHAT_ID=' .env 2>/dev/null | cut -d= -f2- | tr -d '"' || true)

# Cheap remote check: ls-remote = 1 round-trip, no working-tree change
REMOTE=$(git ls-remote origin master 2>/dev/null | awk '{print $1}' | head -1)
LOCAL=$(git rev-parse HEAD 2>/dev/null)

if [ -z "$REMOTE" ] || [ -z "$LOCAL" ] || [ "$REMOTE" = "$LOCAL" ]; then
  exit 0
fi

TS=$(date -Iseconds)
SHORT=${REMOTE:0:7}
echo "[$TS] new commit detected: $LOCAL -> $REMOTE" >> "$LOG"

# Pull + rebuild. Disable -e around the block so a failure is captured in
# STATUS (and reported via Telegram below) instead of aborting the script
# silently — otherwise the failure branch never runs.
set +e
{
  git pull --ff-only origin master &&
  DBURL=$(grep -E '^DATABASE_URL=' .env | cut -d= -f2-) &&
  # Build with DB access. `docker compose build` runs off-network and can't
  # resolve the `postgres` service, so generateStaticParams + the sitemap +
  # blog listings fall back to sample articles only. Host networking plus
  # --add-host points the build at postgres' published 127.0.0.1:5432, so
  # build-time queries succeed and all articles prerender.
  docker build --network=host --add-host=postgres:127.0.0.1 \
    --build-arg DATABASE_URL="$DBURL" -t habitat3ri-web:latest . &&
  docker compose up -d
} >> "$LOG" 2>&1

STATUS=$?
set -e

if [ "$STATUS" -eq 0 ]; then
  MSG=" habitat3ri deployed: $SHORT"
  echo "[$(date -Iseconds)] OK $SHORT" >> "$LOG"
else
  MSG="L habitat3ri DEPLOY FAILED: $SHORT (see $LOG)"
  echo "[$(date -Iseconds)] FAIL $SHORT" >> "$LOG"
fi

# Optional Telegram notify
if [ -n "$TELEGRAM_BOT_TOKEN" ] && [ -n "$TELEGRAM_CHAT_ID" ]; then
  curl -sS --max-time 10 -o /dev/null \
    "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
    --data-urlencode "chat_id=${TELEGRAM_CHAT_ID}" \
    --data-urlencode "text=${MSG}" \
    || true
fi
