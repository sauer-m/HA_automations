"""Erzeugt die Lovelace-Konfiguration für dashboard-pflanzen (Hauptansicht + Infoseite je Pflanze)."""
import json, sys

V = "2"  # Cache-Buster für /local/pflanzen/*.png
IMG = lambda k: f"/local/pflanzen/{k}.png?v={V}"
BASE = "/dashboard-pflanzen"

# ---------- Pflegetipps je Art ----------
TIPS = {
    "clusia": dict(
        licht="Hell, aber ohne pralle Mittagssonne. Das Bad ist wegen der Luftfeuchte gut, solange genug Tageslicht hinkommt.",
        wasser="Gießen, wenn die oberen 2–3 cm Erde trocken sind. Kein Wasser im Übertopf stehen lassen.",
        duengen="April bis September alle 4 Wochen mit Grünpflanzendünger.",
        probleme="Gelbe, weiche Blätter = zu nass. Abwerfende Blätter = zu dunkel oder Zugluft.",
    ),
    "sansevieria": dict(
        licht="Hell bis halbschattig, verträgt auch Sonne. Im dunklen Bad wächst er langsam, hält aber durch.",
        wasser="Erst gießen, wenn die Erde komplett trocken ist. Nie in die Blattrosette gießen. Im Winter reicht alle 3–4 Wochen.",
        duengen="April bis September alle 6–8 Wochen mit Kakteendünger.",
        probleme="Weiche, umknickende Blätter = Fäulnis durch zu viel Wasser. Trockene braune Spitzen sind harmlos, nicht ins Grüne schneiden.",
    ),
    "calathea": dict(
        licht="Hell, aber keine direkte Sonne.",
        wasser="Erde gleichmäßig leicht feucht halten, nie ganz austrocknen lassen. Zimmerwarmes, kalkarmes Wasser (Regen- oder gefiltertes Wasser).",
        duengen="April bis September alle 2–3 Wochen schwach dosiert.",
        probleme="Braune Ränder und eingerollte Blätter = zu trockene Luft oder zu trocken gegossen. Braucht über 50 % Luftfeuchte, nicht direkt neben die Heizung stellen.",
    ),
    "dracaena": dict(
        licht="Hell ohne pralle Sonne. Halbschatten geht, dann wächst sie langsamer.",
        wasser="Gießen, wenn die obere Hälfte der Erde trocken ist. Lieber zu trocken als zu nass.",
        duengen="April bis September alle 2–4 Wochen.",
        probleme="Braune Blattspitzen = trockene Heizungsluft oder kalkhaltiges Wasser. Untere Blätter vergilben mit der Zeit, das ist normal.",
    ),
    "yucca": dict(
        licht="So hell wie möglich, gern sonnig. Im Winter darf sie kühler stehen (10–15 °C).",
        wasser="Gießen, wenn die Erde zu zwei Dritteln trocken ist. Im Winter sparsam.",
        duengen="April bis September alle 2–3 Wochen.",
        probleme="Hängende, gelbe untere Blätter sind normal und können abgezupft werden. Weicher Stamm = Staunässe, sofort weniger gießen.",
    ),
    "hydro": dict(
        licht="Hell, ohne pralle Mittagssonne.",
        wasser="Hydrokultur: Erst auffüllen, wenn der Wasserstandsanzeiger auf Minimum steht, dann nur bis Optimum (Maximum nur vor dem Urlaub). Nach dem Minimum ruhig 2–3 Tage trocken stehen lassen, die Wurzeln brauchen Luft.",
        duengen="April bis September alle 4–6 Wochen Hydrodünger, im Winter nicht.",
        probleme="Faulig riechendes Wasser = zu lange auf Maximum. Einmal komplett durchspülen und neu befüllen.",
    ),
    "gruenlilie": dict(
        licht="Hell bis halbschattig. Zu dunkel = blasse, lange, schlaffe Blätter.",
        wasser="Im Sommer gleichmäßig feucht, im Winter etwas trockener. Die dicken Wurzeln speichern Wasser.",
        duengen="April bis September alle 2 Wochen.",
        probleme="Braune Spitzen = trockene Luft oder Kalk. Vertrocknete Blätter an der Basis abziehen. Ableger lassen sich einfach im Wasser bewurzeln.",
    ),
    "efeutute": dict(
        licht="Halbschattig bis hell, kommt auch mit wenig Licht aus. Die hellen Muster verblassen im Dunkeln.",
        wasser="Gießen, wenn die oberen 2 cm trocken sind.",
        duengen="April bis September alle 2–3 Wochen.",
        probleme="Lange, kahle Ranken: zurückschneiden, dann wird sie buschiger. Die Stecklinge bewurzeln im Wasserglas und können zurück in den Topf.",
    ),
    "sukkulente": dict(
        licht="Der hellste Platz der Wohnung, gern direkte Sonne. Zu wenig Licht = blasse, gestreckte Pflanzen.",
        wasser="Nur gießen, wenn die Erde komplett trocken ist, dann durchdringend. Im Winter alle 3–4 Wochen. Die grüne Gießhilfe hält die Erde eher zu feucht; bei Sukkulenten besser weglassen.",
        duengen="April bis September 1× im Monat Kakteendünger.",
        probleme="Matschige, glasige Blätter = zu nass. Die untersten Blätter vertrocknen mit der Zeit, das ist normal.",
    ),
    "monstera": dict(
        licht="Hell ohne direkte Sonne. Ein Moosstab hilft ihr beim Klettern und bringt größere Blätter.",
        wasser="Erst gießen, wenn der Sensor unter 30 % zeigt. Im Winter deutlich weniger.",
        duengen="April bis September alle 2 Wochen.",
        probleme="Braune Ränder mit gelbem Saum und hängende Blätter = Staunässe. Kein Wasser im Übertopf stehen lassen.",
    ),
}

# ---------- Pflanzen ----------
# slug, Anzeigename, Bild, Art, Tipps-Schlüssel, Hydro, Raum, Zustand laut Fotos vom 15.11.
PLANTS = [
    ("clusia_bad", "Clusia", "clusia", "Clusia rosea 'Princess'", "clusia", False, "bad",
     "Gesund und kräftig, die Blätter sind sattgrün."),
    ("bogenhanf_bad_breit", "Bogenhanf (breit)", "sansevieria_breit", "Sansevieria", "sansevieria", False, "bad",
     "Viele trockene, braune Blattspitzen. Das ist unkritisch, solange die Blätter fest bleiben."),
    ("bogenhanf_bad_spitz", "Bogenhanf (spitz)", "sansevieria_spitz", "Sansevieria 'Fernwood'", "sansevieria", False, "bad",
     "Gesund, kompakt, die Spitzen sind leicht rötlich (sortentypisch)."),
    ("calathea_schlafzimmer", "Calathea", "calathea", "Goeppertia (Calathea) warszewiczii", "calathea", False, "schlaf",
     "Gestresst: hängende Blätter, braune und gelbe Ränder. Sie steht direkt am Heizkörper: ein Stück wegrücken, Luftfeuchte erhöhen und braune Blätter abschneiden."),
    ("drachenbaum_sofa", "Drachenbaum am Sofa", "dracaena_marginata", "Dracaena marginata", "dracaena", False, "wohn",
     "Viele braune, eingerollte Blattspitzen: trockene Heizungsluft. Insgesamt eher licht, sie bräuchte mehr Licht."),
    ("yucca_fenster", "Yucca", "yucca", "Yucca elephantipes", "yucca", False, "wohn",
     "Kräftige Krone, der Stamm ist gestützt. Ein paar trockene alte Blätter am Stamm können weg."),
    ("drachenbaum_terracotta", "Drachenbaum Terracotta", "dracaena_marginata", "Dracaena marginata", "dracaena", False, "wohn",
     "Wenige Blätter, kahle Äste. Mehr Licht würde neue Austriebe fördern."),
    ("duftdracaena_fenster", "Duftdracaena", "dracaena_fragrans", "Dracaena fragrans", "dracaena", False, "wohn",
     "Gut im Wuchs, einzelne braune Flecken und Spitzen. Am kalten Fenster nachts eventuell zu kühl."),
    ("drachenbaum_twister", "Drachenbaum Twister", "dracaena_twister", "Dracaena marginata (gedreht)", "dracaena", False, "wohn",
     "Gedrehte Stämme mit kleinen Blattschöpfen, unten einige trockene Blätter. Das ist normal."),
    ("grunlilie_wohnzimmer", "Grünlilie", "gruenlilie", "Chlorophytum comosum", "gruenlilie", False, "wohn",
     "Sehr gesund und dicht, nur einzelne gelbe Blätter."),
    ("elefantenfuss", "Elefantenfuß", "elefantenfuss", "Beaucarnea recurvata · Hydrokultur", "hydro", True, "wohn",
     "Viele trockene, braune Blätter. Er braucht mehr Licht (gern direkte Sonne) und im Winter sehr wenig Wasser: Wasserstand lange auf Minimum lassen."),
    ("efeutute_regal", "Efeutute", "efeutute", "Epipremnum aureum", "efeutute", False, "wohn",
     "Lange, teils kahle Ranken mit einzelnen gelben Blättern. Ein Rückschnitt macht sie wieder buschig."),
    ("grunlilie_esszimmer", "Grünlilie", "gruenlilie", "Chlorophytum comosum", "gruenlilie", False, "ess",
     "Blass und lang gestreckt, mehrere vertrocknete Blätter: deutlich zu wenig Licht. Heller stellen."),
    ("sukkulenten_schale", "Sukkulenten-Schale", "sukkulenten_schale", "Haworthia, Aloe, Sukkulente", "sukkulente", False, "ess",
     "Haworthia und Aloe sind gesund. Die graue, zerknitterte Sukkulente rechts wirkt vertrocknet: prüfen und gegebenenfalls entfernen."),
    ("echeveria_topf", "Echeveria", "echeveria", "Echeveria", "sukkulente", False, "ess",
     "Blasse Färbung, die unteren Blätter sind vertrocknet. Sie braucht mehr Licht."),
    ("haworthia", "Haworthia", "haworthia", "Haworthiopsis attenuata", "sukkulente", False, "ess",
     "Gesund, kräftig grün."),
    ("echeveria_glas", "Echeveria im Glas", "echeveria_glas", "Echeveria · Glas ohne Abfluss", "sukkulente", False, "ess",
     "Das Glas hat kein Abflussloch: nur 1–2 Esslöffel Wasser geben. Besser in einen Topf mit Loch umsetzen."),
    ("aloe", "Aloe", "aloe", "Aloe", "sukkulente", False, "ess",
     "Hellgrün und leicht gestreckt: etwas mehr Licht wäre gut."),
    ("dracaena_warneckii", "Dracaena Warneckii", "dracaena_warneckii", "Dracaena fragrans 'Warneckii' · Hydrokultur", "hydro", True, "ess",
     "Buschig, gut im Wuchs. Einzelne braune Blätter an der Basis können weg."),
    ("schefflera", "Schefflera", "schefflera", "Schefflera arboricola · Hydrokultur", "hydro", True, "ess",
     "Gesund und dicht."),
]

ROOMS = [
    ("bad", "Badezimmer", "mdi:shower"),
    ("schlaf", "Schlafzimmer", "mdi:bed"),
    ("wohn", "Wohnzimmer", "mdi:sofa"),
    ("ess", "Esszimmer", "mdi:silverware-fork-knife"),
]


def status_tpl(s, hydro):
    tun = "Wasserstand prüfen" if hydro else "gießen"
    return (
        "{% set s = '" + s + "' %}"
        "{% set n = states('sensor.simple_plant_next_watering_' ~ s) %}"
        "{% set d = (as_datetime(n).date() - now().date()).days if as_datetime(n) is not none else none %}"
        "{% if is_state('binary_sensor.simple_plant_problem_' ~ s, 'on') %}⚠️ Überfällig seit {{ -d }} {{ 'Tag' if -d == 1 else 'Tagen' }}"
        "{% elif is_state('binary_sensor.simple_plant_todo_' ~ s, 'on') %}💧 Heute " + tun +
        "{% elif d is none %}–{% elif d == 1 %}Morgen " + tun +
        "{% else %}In {{ d }} Tagen " + tun + "{% endif %}"
        " · alle {{ states('number.simple_plant_days_between_waterings_' ~ s) | int(0) }} Tage"
    )


def badge_icon_tpl(s):
    return ("{% if is_state('binary_sensor.simple_plant_problem_" + s + "', 'on') %}mdi:alert"
            "{% elif is_state('binary_sensor.simple_plant_todo_" + s + "', 'on') %}mdi:water{% endif %}")


def badge_color_tpl(s):
    return "{{ 'red' if is_state('binary_sensor.simple_plant_problem_" + s + "', 'on') else 'blue' }}"


def press(s, name):
    return {
        "action": "perform-action",
        "perform_action": "button.press",
        "target": {"entity_id": f"button.simple_plant_mark_watered_{s}"},
        "confirmation": {"text": f"{name} als gegossen markieren?"},
    }


def plant_card(p):
    s, name, img, species, tk, hydro, room, _ = p
    return {
        "type": "custom:mushroom-template-card",
        "entity": f"sensor.simple_plant_next_watering_{s}",
        "picture": IMG(img),
        "primary": name,
        "secondary": status_tpl(s, hydro),
        "badge_icon": badge_icon_tpl(s),
        "badge_color": badge_color_tpl(s),
        "tap_action": {"action": "navigate", "navigation_path": f"{BASE}/{s.replace('_', '-')}"},
        "icon_tap_action": press(s, name),
        "hold_action": press(s, name),
        "grid_options": {"columns": 12},
    }


MONSTERA_STATUS = (
    "{% set st = state_attr('plant.monstera_wohnzimmer', 'moisture_status') %}"
    "Feuchte {{ states('sensor.monstera_wohnzimmer_bodenfeuchtigkeit') | float(0) | round(0) | int }} % · "
    "{{ {'Low': '💧 Zu trocken, gießen', 'High': '🛑 Zu nass, nicht gießen'}.get(st, '✅ Passt') }}"
)

monstera_card = {
    "type": "custom:mushroom-template-card",
    "entity": "plant.monstera_wohnzimmer",
    "picture": IMG("monstera"),
    "primary": "Monstera (Sensor)",
    "secondary": MONSTERA_STATUS,
    "badge_icon": "{% if state_attr('plant.monstera_wohnzimmer', 'moisture_status') in ['Low', 'High'] %}mdi:water-alert{% endif %}",
    "badge_color": "{{ 'red' if state_attr('plant.monstera_wohnzimmer', 'moisture_status') == 'High' else 'blue' }}",
    "tap_action": {"action": "navigate", "navigation_path": f"{BASE}/monstera"},
    "icon_tap_action": {"action": "navigate", "navigation_path": f"{BASE}/monstera"},
    "grid_options": {"columns": 12},
}

SUMMARY = (
    "{% set todo = states.binary_sensor | selectattr('entity_id', 'match', 'binary_sensor\\.simple_plant_todo_') | selectattr('state', 'eq', 'on') | map(attribute='entity_id') | list %}"
    "{% set mon = state_attr('plant.monstera_wohnzimmer', 'moisture_status') == 'Low' %}"
    "{% set n = (todo | count) + (1 if mon else 0) %}"
    "{% if n == 0 %}### 🌿 Alles im grünen Bereich\nHeute muss keine Pflanze gegossen werden."
    "{% else %}### 💧 {{ n }} {{ 'Pflanze braucht' if n == 1 else 'Pflanzen brauchen' }} heute Wasser\n"
    "{% for e in todo %}{{ device_attr(device_id(e), 'name') }}{% if not loop.last %} · {% endif %}{% endfor %}"
    "{% if mon %}{{ ' · ' if todo else '' }}Monstera Wohnzimmer{% endif %}{% endif %}\n\n"
    "<sub>Zeile tippen = Infoseite · Bild tippen oder lange drücken = gegossen</sub>"
)

room_cards = {}
for rk, rname, ricon in ROOMS:
    cards = [{"type": "heading", "heading": rname, "icon": ricon}]
    if rk == "wohn":
        cards.append(monstera_card)
    cards += [plant_card(p) for p in PLANTS if p[6] == rk]
    room_cards[rk] = cards
# Reihenfolge laut Marcel: Wohnzimmer, Esszimmer, (Flur), Schlafzimmer, Badezimmer, (Küche);
# Räume ohne Pflanzen entfallen. Schlafzimmer + Bad teilen sich eine Spalte.
sections = [
    {"type": "grid", "cards": room_cards["wohn"]},
    {"type": "grid", "cards": room_cards["ess"]},
    {"type": "grid", "cards": room_cards["schlaf"] + room_cards["bad"]},
]

main = {
    "title": "Pflanzen",
    "path": "pflanzen",
    "icon": "mdi:flower",
    "type": "sections",
    "max_columns": 3,
    "header": {"layout": "center", "card": {"type": "markdown", "text_only": True, "content": SUMMARY}},
    "sections": sections,
}


def tips_md(t, hydro):
    return (f"**☀️ Licht**  \n{t['licht']}\n\n"
            f"**💧 {'Wasser (Hydrokultur)' if hydro else 'Gießen'}**  \n{t['wasser']}\n\n"
            f"**🧪 Düngen**  \n{t['duengen']}\n\n"
            f"**⚠️ Typische Probleme**  \n{t['probleme']}")


def subview(p):
    s, name, img, species, tk, hydro, room, zustand = p
    rname = dict((r[0], r[1]) for r in ROOMS)[room]
    left = [
        {"type": "heading", "heading": name, "icon": "mdi:sprout"},
        {"type": "markdown", "text_only": True, "content": f"*{species}* · {rname}"},
        {"type": "picture", "image": IMG(img)},
        {"type": "custom:mushroom-template-card", "entity": f"sensor.simple_plant_next_watering_{s}",
         "icon": "mdi:watering-can", "color": "blue", "primary": "Nächster Termin",
         "secondary": status_tpl(s, hydro), "tap_action": {"action": "more-info"}},
        {"type": "tile", "entity": f"button.simple_plant_mark_watered_{s}",
         "name": "Wasserstand aufgefüllt" if hydro else "Jetzt gegossen", "icon": "mdi:water-check",
         "color": "green", "tap_action": press(s, name), "hide_state": True},
        {"type": "tile", "entity": f"number.simple_plant_days_between_waterings_{s}",
         "name": "Rhythmus (Tage)", "features": [{"type": "numeric-input", "style": "buttons"}]},
        {"type": "tile", "entity": f"date.simple_plant_last_watered_{s}", "name": "Zuletzt gegossen"},
        {"type": "tile", "entity": f"select.simple_plant_health_{s}", "name": "Zustand",
         "features": [{"type": "select-options"}]},
    ]
    right = [
        {"type": "heading", "heading": "Pflegetipps", "icon": "mdi:lightbulb-on-outline"},
        {"type": "markdown", "content": tips_md(TIPS[tk], hydro)},
        {"type": "heading", "heading": "Zustand laut Foto (15.11.)", "icon": "mdi:camera-outline"},
        {"type": "markdown", "content": zustand},
    ]
    return {"title": name, "path": s.replace("_", "-"), "subview": True, "back_path": f"{BASE}/pflanzen",
            "type": "sections", "max_columns": 2,
            "sections": [{"type": "grid", "cards": left}, {"type": "grid", "cards": right}]}


monstera_view = {
    "title": "Monstera", "path": "monstera", "subview": True, "back_path": f"{BASE}/pflanzen",
    "type": "sections", "max_columns": 2,
    "sections": [
        {"type": "grid", "cards": [
            {"type": "heading", "heading": "Monstera", "icon": "mdi:sprout"},
            {"type": "markdown", "text_only": True, "content": "*Monstera deliciosa* · Wohnzimmer · mit Sensor"},
            {"type": "picture", "image": IMG("monstera")},
            {"type": "custom:flower-card", "entity": "plant.monstera_wohnzimmer",
             "battery_sensor": "sensor.pflanze_monstera_wohnzimmer_battery_state",
             "show_bars": ["moisture", "illuminance", "temperature", "humidity", "dli"]},
            {"type": "history-graph", "title": "Bodenfeuchte (7 Tage)", "hours_to_show": 168,
             "entities": [{"entity": "sensor.monstera_wohnzimmer_bodenfeuchtigkeit", "name": "Feuchte"}],
             "grid_options": {"columns": "full", "rows": 4}},
        ]},
        {"type": "grid", "cards": [
            {"type": "heading", "heading": "Pflegetipps", "icon": "mdi:lightbulb-on-outline"},
            {"type": "markdown", "content": tips_md(TIPS["monstera"], False)},
            {"type": "heading", "heading": "Zustand laut Foto (15.11.)", "icon": "mdi:camera-outline"},
            {"type": "markdown", "content": "Braune Ränder, gelbe und hängende Blätter, der Sensor zeigt dauerhaft 70–76 %: Sie ist deutlich zu nass. Erst wieder gießen, wenn der Sensor unter 30 % fällt, und kein Wasser im Übertopf lassen. Die Gießhilfe vorerst herausnehmen."},
        ]},
    ],
}

config = {"views": [main] + [subview(p) for p in PLANTS] + [monstera_view]}
json.dump(config, open(sys.argv[1], "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(json.dumps(config)), "bytes,", len(config["views"]), "views")
