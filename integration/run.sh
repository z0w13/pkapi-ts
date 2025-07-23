#!/usr/bin/env bash
set -euo pipefail

readonly SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

cd "$SCRIPT_DIR"
docker compose up -d --wait

export PLURALKIT_DATABASE="postgres://pluralkit:pluralkit@$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' integration-postgres-1):5432/pluralkit"
export PLURALKIT_BASEURL="http://$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' integration-api-rust-1):5000"

# just randomly generated with python
# `import secrets; import base64; print(base64.b64encode(secrets.token_bytes(48)))`
export PLURALKIT_TOKEN="5c+TmmxbLClthBAM1wCHrU+dztnSqSOlR9fBwxoMrhV2ieeVGif5Om0nNEBoZSlo"

echo "Running migrations..."
docker compose run --rm api bin/PluralKit.Bot.dll

pnpm exec vitest run --coverage --dir integration/__tests__ "$@"

docker compose down -v
