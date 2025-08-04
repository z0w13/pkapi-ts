#!/usr/bin/env bash
set -euo pipefail
readonly SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
cd "$SCRIPT_DIR"

pnpm install --frozen-lockfile --ignore-workspace
node index.js
