# Fabrication-Dashboard (3D-Drucker, Laser)

Stand: 18.11.2026 · Dashboard `dashboard-fabrication` · Spiegel in `sauer-m/HA_automations` (`dashboards/lovelace.dashboard_fabrication.json`, `www/`)

## Statusanzeige mit Leuchtrand
Auf der Übersicht und auf den Detailseiten von Prusa XL und A1 Mini leuchtet die Statuskachel je nach Zustand:

| Begriff | Farbe | Wann |
|---|---|---|
| running | gelb `#fdd835` | printing, busy, paused, prepare, running, pause, slicing, init |
| idle | grün `#43a047` | idle, ready, finished, finish, stopped, failed |
| off | grau `#9e9e9e` | unavailable, unknown, offline; beim Prusa XL zusätzlich, sobald `switch.prusa_xl_keller` nicht `on` ist |
| error | rot `#e53935` | error, attention |
| aktuell noch nicht eingebunden | grau | H2C (keine Entität, Platzhalter `sensor.h2c_noch_nicht_eingebunden`) |

- Text und Rand nutzen dieselbe Regel. Beim Prusa XL steht deshalb in Text und Rand gleichzeitig off, sobald die Steckdose aus ist. Vorher lief beides kurz auseinander, weil der Drucker sich erst etwa 30 s nach dem Ausschalten abmeldet.
- Während eines Drucks ist die Statuskachel ausgeblendet; dann leuchtet die Fortschritt-Kachel.
- Umsetzung: eigene Karte `custom:status-glow-card` (Inline-Ressource, Quelle `Smarthome\dashboards\status-glow-card.js`). Sie ist unsichtbar und gibt der **vorherigen sichtbaren Karte** einen `box-shadow`. Optionen: `entity`, `power`, `skip` (Kartentypen überspringen, z. B. `picture-entity`), `running`/`error`/`off` (eigene Zustandslisten), `colors`.
- Die Karte steht deshalb direkt **hinter der Fortschritt-Kachel**. Wer Karten umsortiert, muss sie mitziehen.
- Abhängig von Frontend-Interna (Wrapper `div.card` mit Klasse `hidden` in `hui-grid-section`). Nach HA-Updates prüfen; bricht es, fehlt nur der Rand.

## Gleich hohe Drucker-Kacheln
Statuskachel `rows: 2`, Köpfe-/Slot-Liste `rows: 3`. Der Prusa listet immer alle 5 Köpfe (freie als „leer“), der H2C hat einen Platzhalter „Details folgen“. Gemessen 18.11.: alle drei Spalten 902 px. Neue Zeilen in den Listen (z. B. die 24 H2C-Slots) passen nicht in die feste Höhe und müssten zusammengefasst werden.

## Einschalter Prusa XL (mit Drucksperre)
- Kachel „Drucker-Strom“ auf der Prusa-XL-Seite unter „Steuerung“. Antippen fragt nach und ruft `script.drucker_steckdose_schalten` auf (`aktion: umschalten`). Halten, Doppeltippen und das Detailfenster sind abgeschaltet, damit niemand die Sperre umgeht.
- Das Skript verweigert das Ausschalten (Fehlermeldung im UI), wenn
  - der Status auf printing, busy, paused, prepare, running, pause, slicing, init oder attention steht, oder
  - der Leistungssensor mehr als `max_watt` (60 W) meldet. Das greift auch, wenn PrusaLink gerade nicht erreichbar ist.
- Felder: `steckdose`, `status`, `leistung` (optional), `max_watt`, `aktion` (an/aus/umschalten). Für A1 Mini und H2C dieselbe Kachel mit deren Entitäten anlegen, sobald sie eine schaltbare Steckdose haben. Auf der A1-Mini-Seite steht dafür ein Platzhalter.
- Ungetestet im Echtbetrieb: Der Testaufruf wurde am 18.11. von der Berechtigungsprüfung blockiert; geprüft sind nur die Templates.
- Unabhängig davon schaltet `automation.prusa_xl_steckdose_nach_druckende_aus` die Steckdose 30 Min. nach Druckende unter 30 W ab.

## Laser
Eigenes Symbol (Strahl mit Funkenfächer), selbst als Vektor gezeichnet:
- Bild in der Laser-Kachel: `/config/www/fabrication/laser.svg`
- Icon `fab:laser` für Reiter und Überschrift: Inline-Ressource `fab-icons.js` (Quelle `Smarthome\dashboards\fab-icons.js`). Weitere eigene Icons dort in `ICONS` ergänzen.
- `fab-icons.js` definiert zusätzlich ein Minimal-`iron-icon`. Grund: Reiter-Icons werden gezeichnet, bevor eigene Icon-Sets geladen sind; `ha-icon` fällt dann dauerhaft auf `iron-icon` zurück, das HA nicht mehr mitbringt. Bricht das nach einem Update, fehlt nur das Reiter-Icon.

## Noch offen
- H2C einbinden (Bambu-Lab-Integration), dann Status-Glow-Entität und Slot-Liste anpassen.
- Schaltbare Messsteckdosen für A1 Mini und H2C, dann Einschalter wie beim Prusa XL.
