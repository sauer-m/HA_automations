#!/usr/bin/env bash
# Spiegelt die HA-Config vom Samba-Share ins Repo und schwärzt Secrets.
# Aufruf aus dem Repo-Root: bash tools/export.sh   (danach git diff prüfen, dann committen)
set -euo pipefail

SRC="${HA_CONFIG:-//192.168.1.165/config}"
cd "$(dirname "$0")/.."

mkdir -p config/packages esphome dashboards helpers

cp "$SRC"/{automations,scripts,scenes,configuration,light_groups}.yaml config/
cp "$SRC"/packages/*.yaml config/packages/

for f in "$SRC"/esphome/*.yaml; do
  [ "$(basename "$f")" = secrets.yaml ] || cp "$f" esphome/
done

for f in lovelace.dashboard_beleuctung lovelace.dashboard_listen lovelace.dashboard_tools \
         lovelace.map lovelace_dashboards lovelace_resources; do
  cp "$SRC/.storage/$f" "dashboards/$f.json"
done
for f in input_boolean input_number; do
  cp "$SRC/.storage/$f" "helpers/$f.json"
done

# Klartext-Secrets ersetzen
sed -i -E 's/^(\s+key:\s*)"[^"]+"/\1!secret api_encryption_key/; s/^(\s+password:\s*)"[^"]+"/\1!secret REDACTED_password/' esphome/*.yaml
sed -i -E 's/^(\s+webhook_id:\s*)[^!].*$/\1!secret REDACTED_webhook_id  # im Repo geschwärzt/' config/automations.yaml

# Abbruch, wenn noch etwas nach Secret aussieht
if grep -rnE 'webhook_id: [^!]|(key|password|token):\s*"[^"]{6,}"|://[^/ ]+:[^/ ]+@' config esphome dashboards helpers; then
  echo "ABBRUCH: mögliche Secrets gefunden (siehe oben)" >&2
  exit 1
fi
echo "Export ok. Jetzt: git diff"
