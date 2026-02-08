#!/bin/sh
# Start the Next.js server in the background
node server.js &
SERVER_PID=$!

# Wait for server to be ready
echo "Waiting for server to start..."
sleep 8

# Run database migration via API
echo "Running database migration..."
node -e "
fetch('http://localhost:3000/api/migrate', { method: 'POST' })
  .then(r => r.json())
  .then(data => { console.log('Migration result:', JSON.stringify(data, null, 2)); })
  .catch(err => { console.error('Migration failed:', err.message); })
" 2>&1 || echo "Migration script failed"

# Wait for the server process
wait $SERVER_PID
