#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# Point every absolute URL on the site at one host.
#
#   ./set-domain.sh odin.example.com      # production
#   ./set-domain.sh 203.0.113.10          # IP-only, plain HTTP
#
# Only the site's own host is rewritten — external links (GitHub
# and friends) are left alone. Idempotent: the current host is
# read back from <link rel=canonical>, so running it again with a
# new value moves the whole site instead of stacking domains.
#
#   FORCE_HTTP=1   emit http:// instead of https:// (no TLS yet)
# ─────────────────────────────────────────────────────────────
set -euo pipefail

HOST="${1:-}"
if [ -z "$HOST" ]; then
  echo "usage: ./set-domain.sh <domain-or-ip>" >&2
  echo "       FORCE_HTTP=1 ./set-domain.sh 203.0.113.10" >&2
  exit 1
fi

HOST="${HOST#http://}"
HOST="${HOST#https://}"
HOST="${HOST%%/*}"

case "$HOST" in
  ""|*[!A-Za-z0-9.:-]*) echo "invalid host: '$HOST'" >&2; exit 1 ;;
esac

SCHEME="https"
[ "${FORCE_HTTP:-0}" = "1" ] && SCHEME="http"
BASE="${SCHEME}://${HOST}"

cd "$(dirname "$0")"

# What host is the site on right now? Fall back to the placeholder.
CUR="$(sed -n 's/.*rel="canonical" href="\([^"]*\)".*/\1/p' index.html | head -1 \
       | sed -E 's#^https?://##; s#/.*$##')"
[ -z "$CUR" ] && CUR="YOUR-DOMAIN"

# Every page that carries an absolute URL. The case pages live one level
# down, so the backup has to keep the directory shape.
FILES="index.html projects.html sitemap.xml robots.txt"
for f in projects/*.html; do
  if [ -e "$f" ]; then FILES="$FILES $f"; fi
done

echo "→ rewriting ${CUR} → ${HOST}"

backup=".domain-backup.$$"
mkdir -p "$backup"
for f in $FILES; do
  mkdir -p "$backup/$(dirname "$f")"
  cp "$f" "$backup/$f"
done

restore() {
  echo "! failed — restoring originals" >&2
  for f in $FILES; do cp "$backup/$f" "$f" 2>/dev/null || true; done
  rm -rf "$backup"
  exit 1
}
trap restore ERR

# escape the dots in the old host so they match literally
ESC="$(printf '%s' "$CUR" | sed 's/\./\\./g')"
for f in $FILES; do
  sed -i "s|https\?://${ESC}|${BASE}|g" "$f"
done

# The placeholder must be gone, and external hosts must be untouched.
if grep -q 'YOUR-DOMAIN' $FILES; then
  echo "! placeholder survived the rewrite" >&2
  restore
fi
if ! grep -q 'github.com/yangchuan281' index.html; then
  echo "! external links were damaged — aborting" >&2
  restore
fi

rm -rf "$backup"

echo "✓ base url → ${BASE}"
grep -n 'rel="canonical"' index.html projects.html projects/*.html | sed 's/^/  /'
grep -n '<loc>' sitemap.xml | sed 's/^/  /'
grep -n 'Sitemap:' robots.txt | sed 's/^/  /'
echo
echo "  next: SERVER_HOST=${HOST} ./deploy.sh"
