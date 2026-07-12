#!/bin/sh
# prisma migrate deploy needs a session-level advisory lock. Neon computes can
# be slow to respond to that specific step even when the initial connection
# succeeds quickly, so retry with backoff instead of failing the whole build.
set -e

attempt=1
max_attempts=4
delay=5

while [ "$attempt" -le "$max_attempts" ]; do
  echo "prisma migrate deploy: attempt $attempt/$max_attempts"
  if npx prisma migrate deploy; then
    exit 0
  fi
  if [ "$attempt" -eq "$max_attempts" ]; then
    echo "prisma migrate deploy: all attempts failed"
    exit 1
  fi
  echo "prisma migrate deploy: retrying in ${delay}s..."
  sleep "$delay"
  attempt=$((attempt + 1))
  delay=$((delay * 2))
done
