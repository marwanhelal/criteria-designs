#!/bin/sh

# ── 1. Start nginx ────────────────────────────────────────────────────────────
# nginx listens on :3000 (what Traefik connects to).
# It serves /api/uploads/ directly from disk and proxies everything else to
# Next.js on :3001. Runs rootless using /tmp for its temp/pid files.
echo "Starting nginx..."
nginx -c /app/nginx.conf &
NGINX_PID=$!

# ── 2. Start Next.js on internal port 3001 ───────────────────────────────────
echo "Starting Next.js on port 3001..."
PORT=3001 HOSTNAME=127.0.0.1 node server.js &
SERVER_PID=$!

# ── 3. Wait for Next.js to be ready, then run migrations ─────────────────────
echo "Waiting for Next.js to start..."
sleep 8

echo "Running database migration..."
node -e "
fetch('http://127.0.0.1:3001/api/migrate', { method: 'POST' })
  .then(r => r.json())
  .then(data => { console.log('Migration result:', JSON.stringify(data, null, 2)); })
  .catch(err => { console.error('Migration failed:', err.message); })
" 2>&1 || echo "Migration script failed"

# ── 4. Keep running until Next.js exits ──────────────────────────────────────
wait $SERVER_PID
kill $NGINX_PID 2>/dev/null
