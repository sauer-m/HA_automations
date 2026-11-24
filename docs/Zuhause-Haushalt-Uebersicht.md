# Zuhause und Haushalt: Reiter „Übersicht“ (24.11.2026)

Mockup: https://claude.ai/artifact/PjTdVWtvjrdK1hwRLiAfTP (mit Codex-Review).

## Zuhause (`dashboard-beleuctung`)

Reiter: **Übersicht** · Licht · Klima · Medien · Sicherheit. Unterseiten: `klima-verlauf`, `fernbedienung-wohnzimmer`, `fernbedienung-schlafzimmer`.

- **Übersicht** = Panel-View mit `custom:zuhause-card` (`www/zuhause-card.js`, Ressource `/local/zuhause-card.js?v=N`).
  - Statuszeile: Personen, Wohnungstür (zweimal tippen = abschließen), Haustür, Fenster, Alarm, Innentemperatur, Lichter an.
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
Offen: Philips 800i (Wohnzimmer) ist nur über Alexa eingebunden, nicht in HA.
