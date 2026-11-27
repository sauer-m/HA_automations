# Bilderrahmen (Aimor PF1007, Kiosk OSS)

Rahmen im LAN mit KioskBrowser-OSS (`io.github.kioskoss`) als Home-App: Startseite = HA-Dashboard
`dashboard-willkommen/start`, Bildschirmschoner = Immich Kiosk (Unraid, Port 3010), Berührung → Dashboard.

Anbindung an HA per MQTT (Mosquitto), Discovery-Präfix `homeassistant`, Geräte-Topic `kioskoss/65d78e53/…`.
Die IP des Rahmens wechselt bei jedem Start (WLAN-Chip ohne feste MAC), darum MQTT statt REST.

Erwartete Entities nach dem ersten MQTT-Connect (im Gerät prüfen, ggf. `_2`):
`switch.bilderrahmen_screen`, `switch.bilderrahmen_screensaver`, `number.bilderrahmen_brightness`,
`sensor.bilderrahmen_battery`, `button.bilderrahmen_reload`, `button.bilderrahmen_load_start_url`,
`button.bilderrahmen_restart_app`, `button.bilderrahmen_reboot_device`, `text.bilderrahmen_url`.

Automationen:
- `automation.bilderrahmen_nach_verbindung_neu_laden`: MQTT `availability = online` → reload, dann Schoner an.
- Klingel → Dashboard: offen, es gibt noch keine Klingel-Entity.

Ausführliche Doku (Gerät, ADB, WebView-Update): Projektordner `Smarthome/Doku/Bilderrahmen-PF1007.md`.

## Spiegel-Dashboard (27.11.2026)

`dashboard-spiegel` (nicht in der Seitenleiste), Panel-View `start` mit `custom:spiegel-card`
(`www/spiegel-card.js`, Ressource `/local/spiegel-card.js?v=1`). Start-URL des Rahmens:
`/dashboard-spiegel/start?kiosk` (`?kiosk` = Vollbild über Kopfzeile und Seitenleiste).

Inhalt, nur gemeinsame Infos: Uhr, Datum, Wetter mit 4-Tage-Vorhersage, Innenklima, Sonne;
Termine 7 Tage aus `calendars:` (Standard: Abfall Lübeck, Gelber Sack, Haushalt); Hinweise
(Post, Klingel in Abwesenheit, Abfall heute/morgen, Fenster offen, Gerät fertig, Pflanzen,
Haushalt überfällig, Saugroboter-Fehler); Wohnung (Türen, Fenster, laufende Geräte, Einkauf);
Abfall-Leiste. 22–6 Uhr gedimmt.

Optionen: `calendars`, `post_entity`, `doorbell_missed_entity`, `fullscreen` (auto/true/false),
`night_dim`. Für WebView 106 geschrieben (kein CSS-Nesting, kein dvh, kein color-mix).
