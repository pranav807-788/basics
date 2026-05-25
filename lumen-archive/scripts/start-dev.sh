#!/bin/bash
# Start the Vite dev server detached so it survives shell exit.
# Logs: /tmp/vite.log   PID: /tmp/vite.pid
set -e
cd "$(dirname "$0")/.."
rm -f /tmp/vite.log /tmp/vite.pid
setsid nohup node node_modules/vite/bin/vite.js dev --host 0.0.0.0 --port 5173 --strictPort </dev/null > /tmp/vite.log 2>&1 &
PID=$!
echo "$PID" > /tmp/vite.pid
disown || true
echo "Started Vite dev server (pid=$PID)"
