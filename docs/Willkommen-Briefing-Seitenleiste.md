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
