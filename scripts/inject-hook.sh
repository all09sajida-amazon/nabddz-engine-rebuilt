#!/usr/bin/env bash
# scripts/inject-hook.sh
FILE_PATH="${1:-./src/matrix-core.js}"
BOOTSTRAP_SNIPPET="// NANO INJECTION — BEGIN
// NOTE: To initialize NabdZ Nano Kernel in this environment, integrate the modules manually:
// 1. Ensure Nano Core and Nodes are bundled for browser use.
// 2. Instantiate and register nodes: new NanoCore({ ... }).register(IdentityNode());
// 3. This hook only serves as a marker.
// NANO INJECTION — END
"
if [ -f "$FILE_PATH" ]; then
  echo "$BOOTSTRAP_SNIPPET" >> "$FILE_PATH"
  echo "Injected bootstrap into $FILE_PATH"
else
  echo "Target file not found: $FILE_PATH"
fi
