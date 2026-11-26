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
