#!/bin/sh
# Lokaler Fix für FilaMan-Plugin spoolmanapi 1.2.5 (13.11.2026)
#
# Problem: PATCH /spoolman/api/v1/spool/{id} mit nur {"used_weight": x}
# (so bucht FilaBridge) wird ignoriert. Das Plugin übernimmt used_weight nur
# zusammen mit initial_weight. Echtes Spoolman setzt remaining = initial - used.
#
# Fix: zusätzlicher Zweig in _apply_spool_weights (service.py).
#  - Leerspulengewicht bekannt:   remaining = netto_anfang - used_weight
#  - Leerspulengewicht unbekannt: FilaMan meldet used_weight dann immer als 0,
#    der gesendete Wert ist also genau der neue Verbrauch: remaining -= used_weight
#
# Ausführen (Git Bash):
#   ssh -i ~/.ssh/unraid_claude root@192.168.1.10 'sh -s' < filaman_spoolmanapi_fix.sh
# Rückgängig:
#   cp service.py.orig-1.2.5 service.py im Plugin-Ordner, Container neu starten.
# Achtung: Ein Plugin-Update überschreibt den Fix. Danach prüfen, ob der
# Fehler upstream behoben ist, sonst erneut ausführen.
set -e
D=/mnt/user/appdata/filaman/plugins/spoolmanapi
cd "$D"
cp -n service.py service.py.orig-1.2.5
docker exec -i filaman-system-app python3 - <<'PY'
import py_compile
p = "/app/data/plugins/spoolmanapi/service.py"
t = open(p, encoding="utf-8").read()
anker = """        elif initial_weight is not None and used_weight is not None:
            spool.remaining_weight_g = initial_weight - used_weight
"""
zusatz = """        elif used_weight is not None:
            # Lokaler Fix 13.11.2026: PATCH nur mit used_weight (FilaBridge).
            if spool.initial_total_weight_g is not None and spool.empty_spool_weight_g is not None:
                spool.remaining_weight_g = (
                    spool.initial_total_weight_g - spool.empty_spool_weight_g - used_weight
                )
            elif spool.remaining_weight_g is not None:
                # Ohne Leerspulengewicht meldet FilaMan used_weight = 0,
                # der gesendete Wert ist daher der zusätzliche Verbrauch.
                spool.remaining_weight_g = spool.remaining_weight_g - used_weight
"""
if "Lokaler Fix 13.11.2026" in t:
    print("schon gepatcht")
else:
    assert t.count(anker) == 1, "Anker nicht gefunden - Plugin-Version geändert?"
    open(p, "w", encoding="utf-8").write(t.replace(anker, anker + zusatz))
    print("gepatcht")
py_compile.compile(p, doraise=True)
print("Syntax ok")
PY
docker restart filaman-system-app >/dev/null
echo "FilaMan neu gestartet"
