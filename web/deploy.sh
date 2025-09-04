#!/usr/bin/env bash
set -euo pipefail

# deploy.sh - simple deploy helper for the web app
# Usage:
#   ./deploy.sh dev    # pull, install, restart dev server (nohup)
#   ./deploy.sh prod   # pull, install, build and start production server (nohup)

REPO_ROOT="${REPO_ROOT:-/var/portal-dgp}"
WEB_DIR="$REPO_ROOT/web"
LOGDIR="$WEB_DIR/logs"
mkdir -p "$LOGDIR"

usage(){
  echo "Usage: $0 [dev|prod]" >&2
  exit 2
}

MODE="${1:-dev}"

echo "Deploy script starting: mode=$MODE repo=$REPO_ROOT"

if [ ! -d "$REPO_ROOT" ]; then
  echo "Repo root not found: $REPO_ROOT" >&2
  exit 3
fi

cd "$REPO_ROOT"
echo "Pulling latest from origin/main..."
git pull origin main --rebase || git pull origin main || true

if [ ! -d "$WEB_DIR" ]; then
  echo "Web directory not found: $WEB_DIR" >&2
  exit 4
fi

cd "$WEB_DIR"

get_pid_for_port(){
  local port="$1" pid=""
  if command -v lsof >/dev/null 2>&1; then
    pid=$(lsof -ti tcp:"$port" 2>/dev/null || true)
  fi
  if [ -z "$pid" ] && command -v ss >/dev/null 2>&1; then
    pid=$(ss -ltnp 2>/dev/null | awk -v p=":$port" '$0~p{for(i=1;i<=NF;i++) if($i~/pid=/) {match($i,/pid=([0-9]+)/,a); print a[1]}}')
  fi
  if [ -z "$pid" ] && command -v netstat >/dev/null 2>&1; then
    pid=$(netstat -ltnp 2>/dev/null | awk -v p=":$port" '$0~p{print $7}' | sed -E 's#/.*##')
  fi
  echo "$pid"
}

install_deps(){
  echo "Installing dependencies (npm)..."
  if command -v npm >/dev/null 2>&1; then
    # try fast/clean install first
    npm ci --prefer-offline --no-audit --no-fund || npm install --legacy-peer-deps
  else
    echo "npm not found in PATH" >&2
    exit 5
  fi
}

stop_port(){
  local p="$1"
  local pid
  pid=$(get_pid_for_port "$p" || true)
  if [ -n "$pid" ]; then
    echo "Killing process $pid on port $p"
    kill -9 $pid || true
    sleep 1
  else
    echo "No process found on port $p"
  fi
}

if [ "$MODE" = "dev" ]; then
  install_deps
  stop_port 3000
  echo "Starting Next in dev mode (0.0.0.0:3000), logs: $LOGDIR/next-dev.log"
  nohup env PORT=3000 HOST=0.0.0.0 npm run dev > "$LOGDIR/next-dev.log" 2>&1 &
  echo "Started dev server (background). Tail logs with: tail -f $LOGDIR/next-dev.log"
  exit 0
fi

if [ "$MODE" = "prod" ]; then
  install_deps
  echo "Building app..."
  npm run build
  stop_port 3000
  echo "Starting Next in production mode (0.0.0.0:3000), logs: $LOGDIR/next-prod.log"
  nohup env HOST=0.0.0.0 PORT=3000 npm start > "$LOGDIR/next-prod.log" 2>&1 &
  echo "Started production server (background). Tail logs with: tail -f $LOGDIR/next-prod.log"
  exit 0
fi

usage
