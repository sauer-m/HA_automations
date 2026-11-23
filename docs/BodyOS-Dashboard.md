# BodyOS – Gesundheits-Cockpit

Stand 23.11.2026. Zusätzlich als Reiter `bodyos` in `dashboard-willkommen`. Dashboard `dashboard-bodyos` (Seitenleiste „Themen“, nach Energie), eine Panel-View `heute`
mit `custom:bodyos-card` (`www/bodyos-card.js`, in HA `/config/www/bodyos-card.js`, Ressource `/local/bodyos-card.js?v=6`).
Bei Änderungen Datei per Samba kopieren und `?v=` hochzählen. Sichtbar nur für Marcel (view `visible`); Custom Sidebar blendet den Eintrag für Sarah aus.

## Aufbau (eine lange Seite, Reiter oben = Sprungmarken, bleiben beim Scrollen stehen)
1. Readiness: Oura Readiness/Schlaf/Aktivität als Ringe, Tagesurteil aus Readiness, HRV und Ruhepuls ggü. 7-Tage-Schnitt, Temperatur.
2. Vitalwerte: Ruhepuls (Garmin via Health Connect), HRV und Temperaturabweichung (Oura), Sparklines aus dem Verlauf.
3. Schlaf (Oura): Dauer, Phasen, tiefster Puls, SpO₂, 7 Nächte mit Ziellinie 7:30.
4. Aktivität: Schritte vs. 7.000, Distanz, Stockwerke, Gesamt-kcal (Garmin/HC); aktive kcal aus Oura (HC liefert dort nur Einzelwerte). Nie addieren.
5. Trainingswoche: Ziel 2× Sport + 2× Yoga. Tippen = +1, lange drücken = −1. Tage mit Einheit aus dem Zählerverlauf.
6. Körper: `sensor.sm_f741b_weight` (g → kg), Fallback `input_number.marcel_gewicht`; Körperfett aus HC oder `input_number.marcel_koerperfett` (> 3); Magermasse aus HC oder berechnet.
7. Ernährung: Ziele 2.250 kcal / 170 g EW / 75 g F / 225 g KH. Ist-Werte folgen (MyFitnessPal noch nicht in HA).
8. Mealprep Mo–Fr: Zielwerte je Mahlzeit, optional Gerichte per Karten-Option `meals`; Knöpfe zu Tandoor (/mealplan, /shopping).

## Helfer und Automation
- `counter.bodyos_sport_woche`, `counter.bodyos_yoga_woche` (`helpers/counter.json`)
- `automation.bodyos_trainingszahler_wochenstart`: setzt beide montags 00:00 zurück.

## Garmin Connect (HACS, seit 23.11.2026)
Kopfzeile zeigt nur den Ring-Akku. Einen Akkustand der Fenix E liefert Garmin Connect nicht; der Uhr-Sync-Chip wurde am 23.11. auf Marcels Wunsch entfernt.

Seit v5: Vitalwerte zweite Reihe aus Garmin Connect (Body Battery mit Tages-Tief/Hoch, Trainingsbereitschaft, Stress Ø). Ernährung: Ist-kcal aus `sensor.garmin_connect_aufgenommene_kalorien` (MyFitnessPal → Garmin), Makros weiter offen. Trainingswoche zählt automatisch aus `sensor.garmin_connect_letzte_aktivitaten` (Attribut `last_activities`, letzte 10): Yoga = Yoga, Gehen zählt nicht, alles andere ab 10 min (`min_activity_min`) = Sport. Die Zähler-Helfer kommen für nicht erfasste Einheiten dazu.

## Offen
- MyFitnessPal-Ist-Werte, Tandoor-Speiseplan als HA-Sensor (dann `meals` automatisch).
