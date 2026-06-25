#!/usr/bin/env bash
# Permanent fix for ENOSPC file watcher limit on Linux
# Run once with: sudo bash scripts/fix-inotify-limit.sh

set -euo pipefail

TARGET=524288
CURRENT=$(cat /proc/sys/fs/inotify/max_user_watches)

echo "Current max_user_watches: $CURRENT"
echo "Setting to: $TARGET"

sysctl -w "fs.inotify.max_user_watches=$TARGET"

CONF="/etc/sysctl.d/99-inotify-watches.conf"
echo "fs.inotify.max_user_watches=$TARGET" | tee "$CONF"
sysctl --system >/dev/null 2>&1 || true

echo "Done. New limit: $(cat /proc/sys/fs/inotify/max_user_watches)"
