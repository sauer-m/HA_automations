# Zuhause und Haushalt: Reiter „Übersicht“ (24.11.2026)

Mockup: https://claude.ai/artifact/PjTdVWtvjrdK1hwRLiAfTP (mit Codex-Review).

## Zuhause (`dashboard-beleuctung`)

Reiter: **Übersicht** · Licht · Klima · Medien · Sicherheit. Unterseiten: `klima-verlauf`, `fernbedienung-wohnzimmer`, `fernbedienung-schlafzimmer`.

- **Übersicht** = Panel-View mit `custom:zuhause-card` (`www/zuhause-card.js`, Ressource `/local/zuhause-card.js?v=N`).
  - Statuszeile: Personen, Wohnungstür (zweimal tippen = abschließen; rot nur, wenn niemand zu Hause ist, sonst neutral), Haustür, Fenster, Alarm, Innentemperatur, Lichter an.
  - Aktionen: Alle Lichter aus · Gute Nacht (`script.gute_nacht`, zweimal tippen) · Kino Wohnzimmer (`switch.heimkino`) · Kino Schlafzimmer (`switch.heimkino_schlafzimmer`). Vorheizen und Abwesend liegen auf Willkommen und in Klima.
  - 8 Raumkacheln: links Popup (Thermostat ±, Lichter mit Helligkeit, Teelichter-Modus, Rollo, Luftreiniger, Geräte, Kino), rechts Lichtknopf.
  - „Läuft gerade“ nur bei Bedarf: Prusa, Waschmaschine/Trockner/Spülmaschine, Mova, Kino, Luftreiniger, Kaffee, Wasserkocher.
- **Licht**: 3 Gruppen, Tile-Karten mit Helligkeit inline.
- **Klima**: Heizung je Raum, Luft (Luftreiniger, Badlüfter, Feuchte, PM2,5, VOC), Heizmodus (Vorheizen, Abwesenheit), Knopf zu **Klima-Verlauf** (Temperatur, Feuchte, PM2,5/VOC je 24 h, 7 und 30 Tage). CO₂ folgt mit Sensor.
- **Medien**: je Kino eine Sektion; Fernbedienungen als Unterseiten.
- **Sicherheit**: Türen & Alarm zuerst, dann Kameras.

## Haushalt (`dashboard-haushalt`)

Reiter: **Übersicht** · Aufgaben · Geräte · Saugroboter · **Wartung** (ex „Bad“).

- **Übersicht** = `custom:haushalt-card` (`www/haushalt-card.js`).
  - Störungen und „fertig“-Hinweise oben.
  - Geräte-Reihe: Waschmaschine, Trockner, Spülmaschine (WashData), Mova, Kaffee, Wasserkocher, Luftreiniger SZ, Landroid. Leuchtet = läuft, Ring = Fortschritt, grün pulsierend = fertig, rot = Störung, amber Punkt = Pflege fällig.
  - Pflege-Punkt: Maintenance-Sensoren `binary_sensor.<präfix>_*_uberfallig` plus überfällige Aufgaben aus `todo.haushalt`, deren Titel das Gerät nennt (Stichwortliste in der Karte, statt Labels).
  - Fällig: überfällige und bis Sonntag fällige Aufgaben mit Haken (`todo.update_item`).
  - Einkaufen, Pflege & Verschleiß (Erledigt drückt `button.*_abschliessen`).
- **Wartung**: alle Maintenance-Sensoren nach Bereich, gedrückt halten = erledigt; Mova-Restlebensdauer; Zahnbürste.
- **Geräte**: neue Sektion Kleingeräte (Kaffee, Wasserkocher, Luftreiniger).

## Skript

`script.gute_nacht`: alle Lichter aus, laufendes Heimkino aus, Wohnungstür abschließen. Heizung regeln die HmIP-Profile.

## Pflege

Karte ändern: Datei per Samba nach `/config/www/` kopieren und `?v=` der Ressource hochzählen.
Philips 1000i (AC1715, Wohnzimmer): Integration Philips HomeID (renaudallard, Domain philips_homeid), Eintrag „AC1715 (Cloud)“, steuert über die Philips-Cloud (FUSION). Konto braucht ein HomeID-Profil (einmal in der App „HomeID“ von Versuni anmelden), sonst HTTP 401. Entitäten `fan.ac1715_cloud_luftreiniger`, `sensor.ac1715_cloud_pm2_5`, Filter-Timer + Reset-Buttons.

## Nachtrag 24.11. abends

- Klima: Verlauf-Einstieg als 4 Tiles mit 24-h-Trendkurve (Tippen öffnet Klima-Verlauf).
- Klima: Heizautomatik schaltet nur nach Bestätigungsdialog um (an und aus).
- Medien: Nintendo Switch Schlafzimmer (`switch.nintendo_switch_schlafzimmer`) ergänzt.

- Philips 1000i in zuhause-card (Wohnzimmer-Popup mit Modi), haushalt-card (Luft WZ / Luft SZ, Filter-Punkt), Klima (Tile + PM2,5/Luftindex, Verlauf), Geräte, Wartung (Filter, halten = Timer zurücksetzen). Ressourcen v=2.

## Luftreiniger-Zeitplan (25.11.)

- Unterseite `/dashboard-beleuctung/luftreiniger` (Link: Klima → Luft „Zeitplan“, Raum-Popups, Haushalt-Gerätefenster).
- Helfer je Reiniger (wz/sz): `input_boolean.luftreiniger_<r>_zeitplan`, `input_datetime.luftreiniger_<r>_nacht_so_do` (21:00), `_nacht_fr_sa` (23:00), `_morgens_auto` (07:00). Ohne `initial`, damit Neustarts nichts überschreiben.
- `automation.luftreiniger_zeitplan_nachtmodus`: abends WZ Preset `sleep`, SZ Stufe 1 (11 %), nur wenn Zeitplan an und Reiniger an; morgens zurück auf `auto`, nur wenn noch im Nachtmodus.

## Luftreiniger-Auswahl und Medien-Technik (25.11.)

- Template-Selects (UI-Helfer): `select.luftreiniger_sz_stufe` (Aus, Auto, 1–5; Stufe n = %-Wert (2n-1)·100/9 → 11/33/56/78/100, Stufe 1 = Nachtmodus) und `select.luftreiniger_wz_modus` (Aus, Auto, Schlaf, Mittel, Schnell, Turbo). Alle Luftreiniger-Kacheln zeigen diese Auswahl.
- Medien: „Technik“ je Kino eingeklappt; `input_boolean.medien_technik_{wz,sz}_anzeigen` steuert die Sichtbarkeit.
