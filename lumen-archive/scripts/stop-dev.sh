#!/bin/bash
# Stop the Vite dev server started by start-dev.sh
if [ -f /tmp/vite.pid ]; then
  PID="$(cat /tmp/vite.pid)"
  if kill -0 "$PID" 2>/dev/null; then
    kill "$PID" && echo "Stopped Vite dev server (pid=$PID)"
  else
    echo "No running process at pid=$PID"
  fi
  rm -f /tmp/vite.pid
else
  pkill -f 'vite/bin/vite.js' 2>/dev/null && echo "Killed Vite by name" || echo "No Vite process found"
fi
