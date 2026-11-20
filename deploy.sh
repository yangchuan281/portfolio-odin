#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# One-command deploy: sync this folder to the server, rebuild, restart.
#
#   SERVER_HOST=1.2.3.4 ./deploy.sh
#
# Everything is overridable from the environment:
#   SERVER_HOST   public IP or DNS name (required)
#   SERVER_USER   ssh user                (default: root)
#   SSH_PORT      ssh port                (default: 22)
#   REMOTE_DIR    target directory        (default: /opt/odin-portfolio)
# ─────────────────────────────────────────────────────────────
set -euo pipefail

SERVER_HOST="${SERVER_HOST:-}"
SERVER_USER="${SERVER_USER:-root}"
SSH_PORT="${SSH_PORT:-22}"
REMOTE_DIR="${REMOTE_DIR:-/opt/odin-portfolio}"

if [ -z "$SERVER_HOST" ]; then
  echo "usage: SERVER_HOST=<ip-or-domain> [SERVER_USER=root] [SSH_PORT=22] [REMOTE_DIR=/opt/odin-portfolio] ./deploy.sh" >&2
  exit 1
fi

TARGET="${SERVER_USER}@${SERVER_HOST}"
SSH_OPTS=(-p "$SSH_PORT" -o ConnectTimeout=10)
SSH_CMD="ssh ${SSH_OPTS[*]}"

# 0. pre-flight — a placeholder canonical is a silent own goal.
if grep -q 'YOUR-DOMAIN' index.html projects.html projects/*.html sitemap.xml robots.txt 2>/dev/null; then
  echo "✗ metadata still points at YOUR-DOMAIN" >&2
  echo "  run: ./set-domain.sh ${SERVER_HOST}   (or ALLOW_PLACEHOLDER=1 to publish anyway)" >&2
  [ "${ALLOW_PLACEHOLDER:-0}" = "1" ] || exit 1
fi

echo "→ target   ${TARGET}:${REMOTE_DIR}"

# 1. make sure the target directory exists
$SSH_CMD "$TARGET" "mkdir -p '${REMOTE_DIR}'"

# 2. sync — --delete keeps the server identical to this folder,
#    so removed files do not linger. Never ship .git or local junk.
echo "→ syncing"
rsync -az --delete \
  -e "$SSH_CMD" \
  --exclude '.git/' \
  --exclude '.archive/' \
  --exclude '.github/' \
  --exclude 'node_modules/' \
  --exclude '.DS_Store' \
  --exclude 'Thumbs.db' \
  --exclude '*.log' \
  ./ "${TARGET}:${REMOTE_DIR}/"

# 3. build + restart on the server
echo "→ building on server"
$SSH_CMD "$TARGET" "cd '${REMOTE_DIR}' && docker compose up -d --build && docker compose ps"

echo
echo "✓ deployed → http://${SERVER_HOST}/"
echo "  logs:  ssh -p ${SSH_PORT} ${TARGET} 'cd ${REMOTE_DIR} && docker compose logs -f --tail=50'"
