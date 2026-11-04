# HA_automations

Spiegel der Home-Assistant-Konfiguration von Marcel (HA OS 2026.10 als VM auf Proxmox). Secrets sind geschwärzt (`!secret …`); das Repo ist nicht direkt lauffähig, sondern Dokumentation und Versionsgeschichte.

| Ordner | Inhalt | Quelle in HA |
|---|---|---|
| `config/` | `automations.yaml`, `scripts.yaml`, `scenes.yaml`, `configuration.yaml`, `light_groups.yaml` | `/config` |
| `config/packages/` | Heimkino Wohnzimmer und Schlafzimmer (YAML-Packages) | `/config/packages` |
| `esphome/` | Eigene ESPHome-Geräte (BenQ, Brunnen, Steckdose, Landroid-Kamera, ProfiCook, XGIMI-Remote) | `/config/esphome` |
| `dashboards/` | Lovelace-Dashboards (Beleuchtung/Klima/Sicherheit/Media, Listen, Tools, Karte) | `.storage/lovelace*` |
| `helpers/` | `input_boolean`, `input_number` aus der UI | `.storage/input_*` |
| `tools/export.sh` | Aktualisiert den Spiegel vom Samba-Share und schwärzt Secrets | – |

Nicht im Repo: `secrets.yaml`, Zigbee2MQTT-Konfiguration (enthält den Netzwerkschlüssel), Datenbank, eigene Blueprints in `blueprints/automation/sauer-m` (ein Dateiname mit `<>` lässt sich unter Windows nicht kopieren).

## Aktualisieren

```bash
bash tools/export.sh
git diff
git commit -am "Config-Stand JJJJ-MM-TT"
```
