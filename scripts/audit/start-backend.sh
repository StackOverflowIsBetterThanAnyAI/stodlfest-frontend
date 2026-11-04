#!/usr/bin/env bash
# Starts the stodlfest backend with fictional test data for the full accessibility audit.
#
# - clones the backend (or uses AUDIT_BACKEND_DIR if it already contains it)
# - creates a fresh SQLite database with the audit user and test data
# - writes the backend address for Vite into .env.audit.local (used with "vite --mode audit")
# - in CI: writes the JWTs of the audit user into cypress/fixtures/sitemap.json,
#   locally: prints them, so they can be passed as AUDIT_ACCESS_TOKEN / AUDIT_REFRESH_TOKEN
# - starts the backend in the background on port 8000
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT_DIR="$ROOT/scripts/audit"
SITEMAP="$ROOT/cypress/fixtures/sitemap.json"

BACKEND_REPO="${AUDIT_BACKEND_REPO:-https://github.com/StackOverflowIsBetterThanAnyAI/stodlfest-backend.git}"
BACKEND_REF="${AUDIT_BACKEND_REF:-master}"
BACKEND_DIR="${AUDIT_BACKEND_DIR:-${RUNNER_TEMP:-/tmp}/stodlfest-backend}"
BACKEND_PORT="${AUDIT_BACKEND_PORT:-8000}"
APP_PORT="${AUDIT_APP_PORT:-5173}"
PYTHON="${PYTHON:-python3}"

# The audit runs in Docker and reaches the runner via the gateway of the bridge network,
# so the browser calls the backend at this host and sends the app's origin with it.
if [ -z "${AUDIT_HOST:-}" ]; then
    AUDIT_HOST="$(docker network inspect bridge -f '{{ (index .IPAM.Config 0).Gateway }}' 2>/dev/null || true)"
    AUDIT_HOST="${AUDIT_HOST:-172.17.0.1}"
fi
BACKEND_ADDRESS="http://$AUDIT_HOST:$BACKEND_PORT"
APP_ORIGIN="http://$AUDIT_HOST:$APP_PORT"

log() { echo "[audit-backend] $*"; }

if [ ! -f "$BACKEND_DIR/manage.py" ]; then
    log "cloning $BACKEND_REPO ($BACKEND_REF) into $BACKEND_DIR"
    git clone --quiet --depth 1 --branch "$BACKEND_REF" "$BACKEND_REPO" "$BACKEND_DIR"
fi
cd "$BACKEND_DIR"

VENV="$BACKEND_DIR/.audit-venv"
if [ ! -d "$VENV" ]; then
    log "creating virtual environment"
    "$PYTHON" -m venv "$VENV"
fi
if [ -x "$VENV/bin/python" ]; then
    PY="$VENV/bin/python"
else
    PY="$VENV/Scripts/python.exe"
fi

log "installing dependencies"
"$PY" -m pip install --quiet --disable-pip-version-check -r requirements.txt

# Environment variables take precedence over a local .env of the backend, which stays untouched.
SECRET_KEY="$("$PY" -c 'import secrets; print(secrets.token_urlsafe(50))')"
export SECRET_KEY
export DEBUG=True
export DATABASE_URL="sqlite:///audit.sqlite3"
export GEMINI_API_KEY=""
export EXTRA_ALLOWED_HOSTS="$AUDIT_HOST"
export EXTRA_CORS_ALLOWED_ORIGINS="$APP_ORIGIN"

log "creating database with test data"
rm -f audit.sqlite3
"$PY" manage.py makemigrations api --verbosity 0
"$PY" manage.py migrate --noinput --verbosity 0
TOKENS="$("$PY" manage.py shell -c "$(cat "$SCRIPT_DIR/seed.py")" | grep '^AUDIT_TOKENS=' | tail -n 1)"
TOKENS="${TOKENS#AUDIT_TOKENS=}"
if [ -z "$TOKENS" ]; then
    log "the test data could not be created"
    exit 1
fi
ACCESS_TOKEN="$("$PY" -c 'import json, sys; print(json.loads(sys.argv[1])["access"])' "$TOKENS")"
REFRESH_TOKEN="$("$PY" -c 'import json, sys; print(json.loads(sys.argv[1])["refresh"])' "$TOKENS")"

if curl -s -o /dev/null "http://127.0.0.1:$BACKEND_PORT/"; then
    log "port $BACKEND_PORT is already in use, choose another one with AUDIT_BACKEND_PORT"
    exit 1
fi

log "starting backend at $BACKEND_ADDRESS for the origin $APP_ORIGIN"
nohup "$PY" manage.py runserver "0.0.0.0:$BACKEND_PORT" --noreload > "$BACKEND_DIR/audit-backend.log" 2>&1 &

# The backend must accept the host and the origin of the audit, otherwise every page would show the login.
for attempt in $(seq 1 30); do
    if HEADERS="$(curl -s -D - -o /dev/null \
        -H "Host: $AUDIT_HOST:$BACKEND_PORT" \
        -H "Origin: $APP_ORIGIN" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        "http://127.0.0.1:$BACKEND_PORT/api/jobs/")"; then
        break
    fi
    if [ "$attempt" -eq 30 ]; then
        log "the backend did not start:"
        cat "$BACKEND_DIR/audit-backend.log"
        exit 1
    fi
    sleep 1
done
if ! grep -q '^HTTP/[0-9.]* 200' <<< "$HEADERS" ||
    ! grep -qi "^access-control-allow-origin: $APP_ORIGIN" <<< "$HEADERS"; then
    log "the backend does not accept the audit (host, origin or token):"
    echo "$HEADERS"
    cat "$BACKEND_DIR/audit-backend.log"
    exit 1
fi

echo "VITE_SERVER_ADDRESS=$BACKEND_ADDRESS" > "$ROOT/.env.audit.local"

if [ "${CI:-}" = "true" ]; then
    # the checkout of the CI runner is temporary, so the placeholders can be replaced directly
    "$PY" - "$SITEMAP" "$ACCESS_TOKEN" "$REFRESH_TOKEN" <<'EOF'
import sys
path, access, refresh = sys.argv[1:]
with open(path, encoding="utf-8") as file:
    content = file.read()
content = content.replace("{{env.AUDIT_ACCESS_TOKEN}}", access)
content = content.replace("{{env.AUDIT_REFRESH_TOKEN}}", refresh)
with open(path, "w", encoding="utf-8") as file:
    file.write(content)
EOF
    log "tokens written into cypress/fixtures/sitemap.json"
else
    log "pass these values to the audit:"
    echo "AUDIT_ACCESS_TOKEN=$ACCESS_TOKEN"
    echo "AUDIT_REFRESH_TOKEN=$REFRESH_TOKEN"
fi

log "ready"
