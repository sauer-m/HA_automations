# Wecker (Echo Spot Schlafzimmer)

Stand 25.11.2026. Wecker des Echo Spot Schlafzimmer in Home Assistant anzeigen, stellen und bei Abwesenheit pausieren.

## Grundlage

- Integration **Alexa Media Player** (HACS, alandtse/alexa_media_player v5.22.1). Die offizielle Integration `alexa_devices` kann Wecker nur lesen.
- Daten: `sensor.echo_spot_schlafzimmer_nachster_alarm`, Attribut `sorted_all` (alle Wecker mit `id`, `status`, `originalTime`, `recurringPattern`).
- Dienste: `alexa_media.create_alarm` (time, days: weekdays/weekends/everyday/mon…sun), `enable_alarm`, `disable_alarm`, `delete_alarm` (alarm_id). Ändern = neu anlegen und alten löschen.
- Einrichtung über den AMP-Login-Proxy scheiterte zuerst mit 403 von Nginx Proxy Manager: „Block Common Exploits“ sperrt `=http://` in Query-Strings (Amazon-OpenID-URL). Für die Einrichtung kurz ausschalten, danach wieder an.

## Seite

`/dashboard-beleuctung/wecker` (Unteransicht, Karte `custom:wecker-card`, `/local/wecker-card.js`): Liste mit an/aus, ändern, löschen (zweimal tippen); Formular Uhrzeit + Einmalig / Mo–Fr / Täglich / Sa + So / eigene Tage.

## Kachel

`zuhause-card` (Statusleiste) und `willkommen-card` (Kopfzeile), nur Wecker für heute oder morgen:

| Zustand | Anzeige |
|---|---|
| kein Wecker | „kein Wecker“, grau |
| Wecker an | „Wecker morgen 06:45“, Symbol grün |
| wegen Abwesenheit pausiert | Text durchgestrichen, Symbol rot |

Klick öffnet die Wecker-Seite.

## Pause bei Abwesenheit

`automation.wecker_bei_abwesenheit_pausieren` mit `input_boolean.wecker_abwesenheit_pausiert` und `input_text.wecker_pausierte_ids`:

- Marcel und Sarah beide ausdrücklich nicht zu Hause (`unknown`/`unavailable` zählt **nicht** als weg, Sarah hat nur den Router-Tracker) und Wohnungstür seit 30 min abgeschlossen: aktive Echo-Spot-Wecker aus, IDs merken. In der Zeit neu gestellte Wecker gehen ebenfalls aus.
- Jemand kommt heim oder Tür wird aufgeschlossen: gemerkte Wecker wieder an.
- Nach HA-Start wird neu geprüft.
