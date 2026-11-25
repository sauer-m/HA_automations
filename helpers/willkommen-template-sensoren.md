# Template-Sensoren für die Willkommen-Seite (UI-Helper, 18.11.2026)

## sensor.pflanzen_giessen_anzahl
```jinja
{{ states.binary_sensor | selectattr('entity_id', 'match', 'binary_sensor.simple_plant_todo_') | selectattr('state', 'eq', 'on') | list | count }}
```

## sensor.hinweise_anzahl
Zählt alle Hinweise, die auf der Willkommen-Seite erscheinen. 0 = „Alles in Ordnung“.
```jinja
{% set fenster = ['binary_sensor.wohnzimmerfenster', 'binary_sensor.esszimmerfenster', 'binary_sensor.schlafzimmerfenster', 'binary_sensor.badezimmerfenster', 'binary_sensor.terrassentur'] | select('is_state', 'on') | list | count %}
{% set niemand = not is_state('person.sauerm', 'home') and not is_state('person.sarah', 'home') %}
{% set tuer = 1 if niemand and states('lock.wohnungstur') not in ['locked', 'unavailable', 'unknown'] else 0 %}
{% set akku = 1 if is_state('binary_sensor.batterie_flotte_schwache_batterien_ersetzen_uberfallig', 'on') else 0 %}
{% set haushalt = 1 if is_state('binary_sensor.haushalt_overdue', 'on') else 0 %}
{% set pflanzen = 1 if states('sensor.pflanzen_giessen_anzahl') | int(0) > 0 else 0 %}
{% set geraete = ['sensor.waschmaschine_zustand', 'sensor.trockner_zustand', 'sensor.spulmaschine_zustand'] | select('is_state', 'finished') | list | count %}
{% set druck = 1 if is_state('sensor.prusa_xl', 'finished') else 0 %}
{{ fenster + tuer + akku + haushalt + pflanzen + geraete + druck }}
```
Wohnungstür zählt seit 25.11.2026 nur, wenn niemand zu Hause ist.

Neuer Hinweis auf der Seite = auch hier ergänzen.
