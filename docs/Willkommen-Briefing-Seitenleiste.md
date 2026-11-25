# Willkommen, Briefing und Seitenleiste

Stand 19.11.2026.

## Seitenleiste

Custom Sidebar (elchininet, Marketplace) ordnet die Seitenleiste in drei Bereiche, getrennt durch Linien:

1. **Alltag:** Willkommen, Zuhause, Haushalt, To-do, Pflanzen
2. **Themen:** Werkstatt, Energie
3. **System:** Karte, History, Activity, Media, Maintenance, Apps

- Config: [`www/custom-sidebar-config.yaml`](../www/custom-sidebar-config.yaml) (in HA `/config/www/`)
- Geladen über `frontend: extra_module_url` in `configuration.yaml`
- Benutzer „Sarah“ sieht aus dem System-Bereich nur die Karte (Exception mit `extend_from: base`)
- Debug: `?cs_debug` an die URL hängen
- Startseite für alle: `default_panel: dashboard-willkommen` (System-Einstellung `core`)

Zusammengelegt am 18./19.11.: Mova, Tools, Listen, Briefing und Info sind gelöscht. Ihre Inhalte stecken jetzt in Haushalt (Aufgaben, Geräte, Saugroboter, Bad) und Willkommen.

## Dashboard Willkommen

[`dashboards/dashboard_willkommen.json`](../dashboards/dashboard_willkommen.json), Reiter:

| Reiter | Inhalt | Sichtbar |
|---|---|---|
| Start | `custom:willkommen-card` | alle |
| Briefing | `custom:briefing-card` | nur Marcel (`visible`) |
| Mondsmäussion | Markdown, Ansage-Knopf, Startdatum | alle |

### Willkommen-Karte

[`www/willkommen-card.js`](../www/willkommen-card.js), Ressource `/local/willkommen-card.js?v=N`. Bei Änderungen die Datei kopieren und `?v=` hochzählen.

- **Wohnungstür offen** ist nur dann ein dringender Hinweis, wenn niemand zu Hause ist (`person.sauerm` und `person.sarah` nicht `home`). Ist jemand da, gibt es keinen Hinweis, der Tür-Chip bleibt neutral und der Satz oben sagt nur „die Wohnungstür ist nicht abgeschlossen“ (seit 25.11.2026). `sensor.hinweise_anzahl` zählt genauso, siehe [`helpers/willkommen-template-sensoren.md`](../helpers/willkommen-template-sensoren.md).
- `BRIEFING` ordnet jedem Benutzer seinen Briefing-Sensor zu. Wer keinen Eintrag hat, sieht keine Briefing-Zeilen.
- **Haustür-Knopf (Schnellaktionen):**
  - Tippen, dann nochmal tippen: Haustür öffnen.
  - Lange drücken (0,6 s): Popup „Beide Türen öffnen?“. Nach Bestätigung startet `script.turen_nacheinander_offnen` ([`config/scripts.yaml`](../config/scripts.yaml)). Das Skript öffnet sofort die Haustür (`lock.unlock`) und 5 s später die Wohnungstür (`lock.open`, LOQED, Falle zurück).
  - Während das Skript läuft, ist der Knopf rot umrandet und zeigt „ABBRUCH“ mit Countdown. Tippen ruft `script.turn_off` auf, dann bleibt die Wohnungstür zu.
  - Die Verzögerung läuft in HA, nicht im Browser. Ein gesperrtes Handy stört also nicht.

### Briefing-Karte

[`www/briefing-card.js`](../www/briefing-card.js), Ressource `/local/briefing-card.js?v=N`.

- Liest `sensor.briefing` (Attribut `voll`, von A.R.E.S. über [`config/packages/briefing.yaml`](../config/packages/briefing.yaml)) und zerlegt die `##`-Abschnitte. Daraus baut sie Kennzahlen, eine Termin-Zeitleiste, Demnächst, Postfach, Zuhause, System und die Push-Einstellungen.
- Ein unbekannter Abschnitt erscheint als einfache Liste. Ändert A.R.E.S. das Format innerhalb von Wetter, Termine oder Verkehr, muss die Karte angepasst werden.
- Briefing für einen weiteren Benutzer: zweiter Sensor, Eintrag in `BRIEFING` in der Willkommen-Karte und den Benutzer im `visible` des Briefing-Reiters ergänzen.

## Wohnungstür (LOQED) im HA-Dialog

Der Schieber schließt ab und auf, der Knopf „Öffnen“ zieht zusätzlich die Falle zurück. Das entspricht den drei Knöpfen der LOQED-App.

## Briefing für Sarah (19.11.2026)

Sarahs Briefing entsteht komplett in Home Assistant, ohne A.R.E.S.: Package `config/packages/briefing_sarah.yaml` → `sensor.briefing_sarah` mit den Attributen `voll` und `kurz` im selben Format wie `sensor.briefing`.

- Neu alle 15 min, beim Start und per `input_button.briefing_sarah_aktualisieren`.
- Inhalt: Wetter (`weather.forecast_home`), Wohnzimmer, Akku von Sarahs iPhone (nur Tracker-Attribut `battery_level`, mit „Stand …“, wenn älter als 6 h), schwache Batterien < 25 %, Waze zur Arbeit Lübeck und Ahrensburg (neuer Eintrag `sensor.waze_verkehr_ahrensburg_aus_luebeck`), Haushalt-Kalender (nur Einträge mit „👤 Sarah“ oder ohne Zuständigen).
- Nicht drin: Mails, Dienstkalender, Geburtstage (nur bei A.R.E.S. für Marcel).
- Push an `notify.mobile_app_iphone_17_pro` über die Automation `briefing_sarah_push`, Zeiten `input_datetime.briefing_sarah_push_werktag`/`_wochenende`, an/aus über `input_boolean.briefing_sarah_push_*`.
- Briefing-Reiter für beide Benutzer sichtbar; `briefing-card` nimmt über `users: {<user_id>: {...}}` je Benutzer einen eigenen Sensor, eigene Push-Schalter und die Quellenangabe. Willkommen-Karte: `BRIEFING`-Map um Sarahs user_id erweitert.
- `recorder: exclude` für `sensor.briefing_sarah` greift erst nach dem nächsten HA-Neustart.
