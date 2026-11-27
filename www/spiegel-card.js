// spiegel-card: "Magic Mirror" für den Bilderrahmen (Aimor PF1007, 1280x800, WebView 106).
// Nur gemeinsame, nicht private Infos: Uhr, Wetter, gemeinsame Kalender, Abfall, Hinweise, Wohnungsstatus.
// Quelle: Smarthome/ha/spiegel-card.js · in HA /config/www/spiegel-card.js · Repo sauer-m/HA_automations www/
// Bewusst ohne CSS-Nesting, dvh, color-mix, :has (WebView 106).
//
// Konfiguration (alle optional):
//   type: custom:spiegel-card
//   calendars: [calendar.abfall_lubeck, calendar.abfall_gelber_sack, calendar.haushalt_calendar]
//   post_entity: binary_sensor.briefkasten_post        # an = Post da (kommt noch)
//   doorbell_missed_entity: input_datetime.klingel_verpasst   # Zeitpunkt "geklingelt, als niemand da war" (kommt noch)
//   fullscreen: auto   # auto = nur mit ?kiosk in der URL; true/false erzwingen
//   night_dim: true    # 22–6 Uhr auf 55 % abdunkeln
const I = {
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  window: 'M4 3h16v18H4zM12 3v18M4 12h16',
  lock: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4',
  unlock: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 7.5-2',
  wash: 'M4 2h16v20H4zM12 9a5 5 0 1 0 0 10a5 5 0 1 0 0-10M8 5h.01M11 5h.01',
  leaf: 'M5 21c0-9 5-15 15-16c0 10-6 15-15 16zM5 21l8-8',
  list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  mail: 'M3 6h18v12H3zM3 6l9 7 9-7',
  bell: 'M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4',
  check: 'M5 12.5l4.5 4.5L19 7',
  cart: 'M3 4h2l2.4 11h11l2-8H6.2M9 20h.01M17 20h.01',
  robot: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18M12 8a2 2 0 1 0 0 4a2 2 0 1 0 0-4',
  thermo: 'M10 14V5a2 2 0 0 1 4 0v9a4 4 0 1 1-4 0z',
  drop: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z',
  battery: 'M3 7h15v10H3zM21 10v4M6 10v4',
  rain: 'M7 15a5 5 0 1 1 9.5-3H17a3.5 3.5 0 0 1 0 7H7zM9 21l1-2M13 21l1-2',
  sun: 'M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  moon: 'M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z',
  cloud: 'M7 18a5 5 0 1 1 9.5-3H17a3.5 3.5 0 0 1 0 7z',
  partly: 'M8 4v1.5M3.5 8H5M4.8 4.8l1 1M12 7.5a4 4 0 0 0-7 2.6M8 19a4 4 0 1 1 7.6-1.8H16a2.9 2.9 0 0 1 0 5.8H8z',
  snow: 'M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9',
  fog: 'M4 9h16M3 13h18M5 17h14',
  storm: 'M7 14a5 5 0 1 1 9.5-3H17a3.5 3.5 0 0 1 0 7h-2M12 13l-2 4h4l-2 4',
  wind: 'M3 9h11a3 3 0 1 0-3-3M3 15h15a3 3 0 1 1-3 3',
  dot: 'M12 10a2 2 0 1 0 0 4a2 2 0 1 0 0-4',
};
const ic = (k, c = 'i') => `<svg class="${c}" viewBox="0 0 24 24" aria-hidden="true"><path d="${I[k] || I.dot}"/></svg>`;
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmt = (v, d = 0) => (isFinite(v) ? v : 0).toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });
const pad = (n) => String(n).padStart(2, '0');

const TAGE = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
const TAGK = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
const MON = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
const WX = { 'clear-night': 'klar', cloudy: 'bewölkt', exceptional: 'Unwetter', fog: 'Nebel', hail: 'Hagel', lightning: 'Gewitter', 'lightning-rainy': 'Gewitter', partlycloudy: 'teils bewölkt', pouring: 'Starkregen', rainy: 'Regen', snowy: 'Schnee', 'snowy-rainy': 'Schneeregen', sunny: 'sonnig', windy: 'windig', 'windy-variant': 'windig' };
const WXI = { 'clear-night': 'moon', cloudy: 'cloud', exceptional: 'storm', fog: 'fog', hail: 'snow', lightning: 'storm', 'lightning-rainy': 'storm', partlycloudy: 'partly', pouring: 'rain', rainy: 'rain', snowy: 'snow', 'snowy-rainy': 'snow', sunny: 'sun', windy: 'wind', 'windy-variant': 'wind' };
const WET = ['rainy', 'pouring', 'snowy', 'snowy-rainy', 'hail', 'lightning-rainy'];

const WEATHER = 'weather.weather_23554_lubeck_deutschland';
const INNEN_T = 'sensor.wohnzimmerthermostat_temperature';
const INNEN_H = 'sensor.0x348d13fffe52a975_humidity';
const DOORS = [['lock.haustur', 'Haustür'], ['lock.wohnungstur', 'Wohnungstür']];
const WIN = [['binary_sensor.wohnzimmerfenster', 'Wohnzimmer'], ['binary_sensor.esszimmerfenster', 'Esszimmer'], ['binary_sensor.schlafzimmerfenster', 'Schlafzimmer'], ['binary_sensor.badezimmerfenster', 'Bad'], ['binary_sensor.terrassentur', 'Terrassentür']];
const GERAETE = [['sensor.waschmaschine_zustand', 'Waschmaschine'], ['sensor.trockner_zustand', 'Trockner'], ['sensor.spulmaschine_zustand', 'Spülmaschine']];
const EINKAUF = [['todo.einkaufsliste_2', 'AHR'], ['todo.hl', 'HL'], ['todo.rossmann', 'Rossmann'], ['todo.baumarkt', 'Baumarkt']];
// Abfall: Sensor, Name, Farbe; Kalender-Termine werden über das Stichwort derselben Farbe zugeordnet
const ABFALL = [['sensor.abfall_restmull', 'Restmüll', '#9aa3ad', /rest/i], ['sensor.abfall_biotonne', 'Biotonne', '#8fbf6a', /bio/i], ['sensor.abfall_papier', 'Papier', '#6aa9ff', /papier|pappe/i], ['sensor.abfall_gelber_sack', 'Gelber Sack', '#f2c94c', /gelb|wertstoff|verpack/i]];
const CAL_DEFAULT = ['calendar.abfall_lubeck', 'calendar.abfall_gelber_sack', 'calendar.haushalt_calendar'];
const CAL_COLOR = { 'calendar.haushalt_calendar': '#5ec4b6' };
const NIGHT = [22, 6]; // 22–6 Uhr gedimmt

class SpiegelCard extends HTMLElement {
  setConfig(c) { this._c = Object.assign({ calendars: CAL_DEFAULT, fullscreen: 'auto' }, c || {}); this._ev = null; this._fc = null; }
  getCardSize() { return 12; }

  set hass(h) {
    const first = !this._hass;
    this._hass = h;
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      if (!document.getElementById('sp-fonts')) {
        const l = document.createElement('link');
        l.id = 'sp-fonts'; l.rel = 'stylesheet';
        l.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@300;400;500&display=swap';
        document.head.appendChild(l);
      }
    }
    if (first) { this._loadCal(); this._subFc(); }
    const now = Date.now();
    if (!this._t || now - this._t > 2000) { this._t = now; this._render(); }
    else if (!this._pend) this._pend = setTimeout(() => { this._pend = null; this._t = Date.now(); this._render(); }, 2000);
  }
  connectedCallback() {
    this._iv = setInterval(() => this._render(), 20000);
    this._ivc = setInterval(() => this._loadCal(), 15 * 60000);
    if (this._hass && !this._unsub) this._subFc();
  }
  disconnectedCallback() {
    clearInterval(this._iv); clearInterval(this._ivc);
    if (this._unsub) { Promise.resolve(this._unsub).then((u) => typeof u === 'function' && u()).catch(() => {}); this._unsub = null; }
  }

  _o(id) { return this._hass.states[id]; }
  _s(id) { const o = this._o(id); return o ? o.state : 'unavailable'; }
  _n(id) { const v = parseFloat(this._s(id)); return isFinite(v) ? v : null; }
  _a(id, k) { const o = this._o(id); return o ? o.attributes[k] : undefined; }
  _ago(ts) {
    const m = Math.round((Date.now() - ts) / 60000);
    if (m < 1) return 'gerade eben';
    if (m < 60) return `vor ${m} min`;
    if (m < 1440) { const d = new Date(ts); return `${new Date().getDate() === d.getDate() ? 'heute' : 'gestern'} ${pad(d.getHours())}:${pad(d.getMinutes())}`; }
    return `vor ${Math.round(m / 1440)} Tagen`;
  }

  // --- Daten -------------------------------------------------------------
  async _loadCal() {
    if (!this._hass) return;
    const s = new Date(); s.setHours(0, 0, 0, 0);
    const e = new Date(s.getTime() + 8 * 864e5);
    const ids = (this._c.calendars || []).filter((id) => this._o(id));
    const all = [];
    await Promise.all(ids.map(async (id) => {
      try {
        const r = await this._hass.callApi('GET', `calendars/${id}?start=${encodeURIComponent(s.toISOString())}&end=${encodeURIComponent(e.toISOString())}`);
        (r || []).forEach((ev) => all.push(Object.assign({ cal: id }, ev)));
      } catch (err) { /* Kalender nicht erreichbar: still weglassen */ }
    }));
    this._ev = all;
    this._render();
  }
  _subFc() {
    if (!this._hass || !this._hass.connection || this._unsub || !this._o(WEATHER)) return;
    try {
      this._unsub = this._hass.connection.subscribeMessage((m) => { this._fc = m && m.forecast; this._render(); },
        { type: 'weather/subscribe_forecast', forecast_type: 'daily', entity_id: WEATHER });
      Promise.resolve(this._unsub).catch(() => { this._unsub = null; });
    } catch (err) { this._unsub = null; }
  }

  _events() {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const out = [];
    (this._ev || []).forEach((ev) => {
      const allDay = !!(ev.start && ev.start.date);
      const st = allDay ? new Date(ev.start.date + 'T00:00:00') : new Date(ev.start.dateTime || ev.start);
      const en = allDay ? new Date(ev.end.date + 'T00:00:00') : new Date(ev.end.dateTime || ev.end);
      if (!isFinite(st)) return;
      if (en < new Date() && !allDay) return; // vorbei
      const day = new Date(st); day.setHours(0, 0, 0, 0);
      const d = Math.max(0, Math.round((day - today) / 864e5));
      let color = CAL_COLOR[ev.cal] || '#c9a7ff';
      const ab = ABFALL.find((a) => a[3].test(ev.summary || ''));
      if (/abfall/.test(ev.cal) && ab) color = ab[2];
      out.push({ d, st, allDay, t: ev.summary || '', color, abfall: /abfall/.test(ev.cal) });
    });
    // gleiche Termine (z. B. doppelte Abfallkalender) zusammenfassen
    const seen = {};
    return out.filter((e) => { const k = e.d + '|' + e.t; if (seen[k]) return false; seen[k] = 1; return true; })
      .sort((a, b) => a.d - b.d || (a.allDay === b.allDay ? a.st - b.st : a.allDay ? -1 : 1));
  }

  _alerts() {
    const A = [];
    const c = this._c;
    // Post im Briefkasten (kommt noch)
    if (c.post_entity && this._s(c.post_entity) === 'on') {
      const o = this._o(c.post_entity);
      A.push({ sev: 'warn', ic: 'mail', t: 'Post im Briefkasten', s: o ? this._ago(new Date(o.last_changed).getTime()) : '' });
    }
    // Klingel, während niemand da war (kommt noch): Zeitstempel-Entity, letzte 24 h
    if (c.doorbell_missed_entity) {
      const o = this._o(c.doorbell_missed_entity);
      const ts = !o ? NaN : o.attributes.timestamp ? o.attributes.timestamp * 1000 : Date.parse(String(o.state).replace(' ', 'T'));
      if (isFinite(ts) && Date.now() - ts < 864e5 && Date.now() >= ts)
        A.push({ sev: 'warn', ic: 'bell', t: 'Es hat geklingelt', s: `als niemand da war · ${this._ago(ts)}` });
    }
    // Abfall heute/morgen
    const abf = ABFALL.filter(([id]) => [0, 1].includes(this._a(id, 'daysTo')));
    if (abf.length) {
      const d = Math.min.apply(null, abf.map(([id]) => this._a(id, 'daysTo')));
      const names = abf.filter(([id]) => this._a(id, 'daysTo') === d).map((a) => a[1]);
      const evening = new Date().getHours() >= 15;
      A.push({ sev: d === 0 || evening ? 'warn' : 'info', ic: 'trash', t: `${d ? 'Morgen' : 'Heute'}: ${names.join(' + ')}`, s: d ? 'heute Abend rausstellen' : 'Abholung heute' });
    }
    // Fenster offen, bei Regen/Kälte deutlicher
    const open = WIN.filter(([id]) => this._s(id) === 'on').map((w) => w[1]);
    if (open.length) {
      const wx = this._s(WEATHER), tout = this._a(WEATHER, 'temperature');
      const bad = WET.indexOf(wx) >= 0 || (isFinite(tout) && tout < 5);
      A.push({ sev: bad ? 'warn' : 'info', ic: 'window', t: open.length === 1 ? `${open[0]}${open[0] === 'Terrassentür' ? '' : 'fenster'} offen` : `${open.length} Fenster offen`,
        s: (open.length > 1 ? open.join(', ') + ' · ' : '') + (WET.indexOf(wx) >= 0 ? 'draußen ' + (WX[wx] || wx) : isFinite(tout) ? `draußen ${fmt(tout, 0)}°` : '') });
    }
    // Geräte fertig
    GERAETE.forEach(([id, name]) => {
      if (this._s(id) === 'finished') A.push({ sev: 'info', ic: 'wash', t: `${name} fertig`, s: this._ago(new Date(this._o(id).last_changed).getTime()) });
    });
    // Pflanzen
    const plants = Object.keys(this._hass.states).filter((id) => id.indexOf('binary_sensor.simple_plant_todo_') === 0 && this._s(id) === 'on')
      .map((id) => id.replace('binary_sensor.simple_plant_todo_', '').split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
    if (plants.length) A.push({ sev: 'info', ic: 'leaf', t: plants.length === 1 ? 'Eine Pflanze braucht Wasser' : `${plants.length} Pflanzen brauchen Wasser`, s: plants.slice(0, 3).join(', ') + (plants.length > 3 ? ' …' : '') });
    // Gemeinsame Haushaltsliste überfällig
    if (this._s('binary_sensor.haushalt_overdue') === 'on') A.push({ sev: 'info', ic: 'list', t: 'Haushalt: Aufgaben überfällig', s: `${this._n('sensor.haushalt_open_tasks') == null ? '–' : this._n('sensor.haushalt_open_tasks')} offen` });
    // Saugroboter Fehler
    if (this._s('vacuum.p50_pro_ultra') === 'error') A.push({ sev: 'warn', ic: 'robot', t: 'Saugroboter braucht Hilfe', s: 'Fehler gemeldet' });
    const ord = { crit: 0, warn: 1, info: 2 };
    return A.sort((a, b) => ord[a.sev] - ord[b.sev]);
  }

  _sun() {
    const r = Date.parse(this._a('sun.sun', 'next_rising') || ''), s = Date.parse(this._a('sun.sun', 'next_setting') || '');
    if (!isFinite(r) || !isFinite(s)) return '';
    const hm = (t) => { const d = new Date(t); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
    return `<div class="inside sun">${ic('sun')}<span>Sonne ${hm(r)} – ${hm(s)}</span></div>`;
  }

  // --- Darstellung --------------------------------------------------------
  _render() {
    if (!this._hass || !this.shadowRoot) return;
    const now = new Date(), hr = now.getHours();
    const night = this._c.night_dim !== false && (hr >= NIGHT[0] || hr < NIGHT[1]);
    const fs = this._c.fullscreen === true || (this._c.fullscreen === 'auto' && /[?&]kiosk\b/.test(location.search));

    // Spalte 1: Uhr, Datum, Wetter
    const wx = this._s(WEATHER), tout = this._a(WEATHER, 'temperature');
    const fc = (this._fc || []).filter((f) => { const d = new Date(f.datetime); d.setHours(0, 0, 0, 0); const t = new Date(); t.setHours(0, 0, 0, 0); return d >= t; }).slice(0, 5);
    const tIn = this._n(INNEN_T), hIn = this._n(INNEN_H);
    const today = fc.length && new Date(fc[0].datetime).getDate() === now.getDate() ? fc[0] : null;
    const colA = `
      <div class="clock">${pad(hr)}<span class="colon">:</span>${pad(now.getMinutes())}</div>
      <div class="date">${TAGE[now.getDay()]}, ${now.getDate()}. ${MON[now.getMonth()]}</div>
      <div class="wx">
        <div class="wxnow">${ic(WXI[wx] || 'cloud', 'wxi')}<div class="wxt">${isFinite(tout) ? fmt(tout, 0) + '°' : '–'}</div></div>
        <div class="wxd">${esc(WX[wx] || wx)}${today ? ` · ${fmt(today.temperature, 0)}° / ${fmt(today.templow, 0)}°` : ''}${today && today.precipitation_probability != null ? ` · ${today.precipitation_probability} % Regen` : ''}</div>
        <div class="fc">${fc.filter((f) => f !== today).slice(0, 4).map((f) => { const d = new Date(f.datetime); return `
          <div class="fcd"><div class="fcn">${TAGK[d.getDay()]}</div>${ic(WXI[f.condition] || 'cloud', 'fci')}<div class="fct">${fmt(f.temperature, 0)}°<span>${f.templow != null ? fmt(f.templow, 0) + '°' : ''}</span></div></div>`; }).join('')}</div>
      </div>
      <div class="inside">${ic('thermo')}<span>Innen ${tIn != null ? fmt(tIn, 1) + '°' : '–'}</span>${hIn != null ? `${ic('drop')}<span>${fmt(hIn, 0)} %</span>` : ''}</div>
      ${this._sun()}`;

    // Spalte 2: Termine (gemeinsame Kalender)
    const evs = this._events();
    const groups = {};
    evs.forEach((e) => { (groups[e.d] = groups[e.d] || []).push(e); });
    const days = Object.keys(groups).map(Number).sort((a, b) => a - b);
    let shown = 0; const MAXE = 9;
    const dayLabel = (d) => { if (d === 0) return 'Heute'; if (d === 1) return 'Morgen'; const x = new Date(); x.setDate(x.getDate() + d); return `${TAGE[x.getDay()]}, ${x.getDate()}.${x.getMonth() + 1}.`; };
    const colB = `
      <div class="h">Termine</div>
      ${this._ev === null ? '<div class="empty">lädt …</div>' : !days.length ? '<div class="empty">Keine gemeinsamen Termine in den nächsten 7 Tagen</div>' :
        days.map((d) => { if (shown >= MAXE) return ''; const list = groups[d].slice(0, MAXE - shown); shown += list.length; return `
        <div class="day${d === 0 ? ' now' : ''}"><div class="dl">${dayLabel(d)}</div>
          ${list.map((e) => `<div class="ev"><i style="background:${e.color}"></i><span class="et">${e.allDay ? '' : pad(e.st.getHours()) + ':' + pad(e.st.getMinutes()) + ' '}</span><span class="es">${esc(e.t)}</span></div>`).join('')}
        </div>`; }).join('')}
      ${evs.length > shown ? `<div class="more">+ ${evs.length - shown} weitere</div>` : ''}`;

    // Spalte 3: Hinweise + Wohnung
    const al = this._alerts();
    const doors = DOORS.map(([id, n]) => { const s = this._s(id); const ok = s === 'locked'; return `<div class="st"><span class="sti ${ok ? 'ok' : s === 'unlocked' || s === 'open' ? 'mid' : ''}">${ic(ok ? 'lock' : 'unlock')}</span><span>${n}</span><b>${ok ? 'zu' : s === 'unlocked' ? 'offen' : s === 'open' ? 'geöffnet' : '–'}</b></div>`; }).join('');
    const openW = WIN.filter(([id]) => this._s(id) === 'on').length;
    const run = GERAETE.filter(([id]) => this._s(id) === 'running').map((g) => g[1]);
    const ek = EINKAUF.map(([id, n]) => [n, this._n(id)]).filter((x) => x[1]);
    const colC = `
      <div class="h">Hinweise</div>
      <div class="alerts">${al.length ? al.slice(0, 4).map((a) => `
        <div class="al ${a.sev}"><span class="ai">${ic(a.ic)}</span><div><b>${esc(a.t)}</b>${a.s ? `<small>${esc(a.s)}</small>` : ''}</div></div>`).join('') + (al.length > 4 ? `<div class="more">+ ${al.length - 4} weitere</div>` : '')
        : `<div class="al calm"><span class="ai">${ic('check')}</span><div><b>Alles in Ordnung</b><small>Nichts zu tun gerade</small></div></div>`}</div>
      <div class="h h2">Wohnung</div>
      <div class="sts">
        ${doors}
        <div class="st"><span class="sti ${openW ? 'mid' : 'ok'}">${ic('window')}</span><span>Fenster</span><b>${openW ? openW + ' offen' : 'alle zu'}</b></div>
        ${run.length ? `<div class="st"><span class="sti act">${ic('wash')}</span><span>${esc(run.join(', '))}</span><b>läuft</b></div>` : ''}
        ${ek.length ? `<div class="st"><span class="sti">${ic('cart')}</span><span>Einkauf</span><b>${ek.map((x) => `${esc(x[0])} ${x[1]}`).join(' · ')}</b></div>` : ''}
      </div>`;

    // Leiste unten: Abfall
    const bar = ABFALL.map(([id, n, col]) => {
      const d = this._a(id, 'daysTo'); const ok = d != null && isFinite(d);
      const txt = !ok ? '–' : d === 0 ? 'heute' : d === 1 ? 'morgen' : `in ${d} Tagen`;
      return `<div class="bin${ok && d <= 1 ? ' soon' : ''}"><i style="background:${col}"></i><div><b>${n}</b><small>${txt}</small></div></div>`;
    }).join('');

    this.shadowRoot.innerHTML = `<style>${CSS}</style>
      <div class="m${fs ? ' fs' : ''}${night ? ' night' : ''}">
        <section class="a">${colA}</section>
        <section class="b">${colB}</section>
        <section class="c">${colC}</section>
        <footer>${ic('trash', 'fi')}${bar}</footer>
      </div>`;
  }
}

const CSS = `
:host { display: block; }
.m { position: relative; box-sizing: border-box; width: 100%; min-height: 800px; background: #000; color: #f2f2f0;
  font-family: Inter, 'Segoe UI', Roboto, sans-serif; display: grid; grid-template-columns: 1.08fr 1fr 1fr; grid-template-rows: 1fr auto;
  grid-column-gap: 44px; padding: 36px 44px 26px; overflow: hidden; -webkit-font-smoothing: antialiased; transition: opacity 1s; }
.m.fs { position: fixed; left: 0; top: 0; right: 0; bottom: 0; width: 100vw; height: 100vh; min-height: 0; z-index: 9999; }
.m.night { opacity: .55; }
section { min-width: 0; min-height: 0; }
.i { width: 22px; height: 22px; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; flex: none; }
.h { font-size: 13px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase; color: rgba(255,255,255,.42); margin: 4px 0 18px; }
.h2 { margin-top: 30px; }
.empty, .more { color: rgba(255,255,255,.38); font-size: 17px; }
.more { margin-top: 6px; font-size: 15px; }

/* Spalte A */
.clock { font-family: 'Space Grotesk', Inter, sans-serif; font-weight: 300; font-size: 150px; line-height: .9; letter-spacing: -6px; margin-left: -6px; }
.colon { opacity: .55; position: relative; top: -10px; margin: 0 2px; }
.date { font-size: 27px; font-weight: 300; color: rgba(255,255,255,.72); margin-top: 14px; }
.wx { margin-top: 44px; }
.wxnow { display: flex; align-items: center; }
.wxi { width: 64px; height: 64px; fill: none; stroke: #fff; stroke-width: 1.3; stroke-linecap: round; stroke-linejoin: round; margin-right: 16px; }
.wxt { font-family: 'Space Grotesk', Inter, sans-serif; font-size: 72px; font-weight: 300; line-height: 1; letter-spacing: -2px; }
.wxd { font-size: 19px; color: rgba(255,255,255,.66); margin-top: 10px; }
.fc { display: flex; margin-top: 26px; }
.fcd { flex: 1; max-width: 88px; display: flex; flex-direction: column; align-items: flex-start; }
.fcn { font-size: 15px; color: rgba(255,255,255,.5); font-weight: 500; }
.fci { width: 30px; height: 30px; fill: none; stroke: rgba(255,255,255,.85); stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; margin: 8px 0 6px; }
.fct { font-size: 19px; font-weight: 500; }
.fct span { color: rgba(255,255,255,.42); font-weight: 400; margin-left: 6px; font-size: 16px; }
.inside { display: flex; align-items: center; margin-top: 30px; color: rgba(255,255,255,.6); font-size: 17px; }
.inside .i { width: 18px; height: 18px; margin-right: 6px; }
.inside span { margin-right: 18px; }
.inside.sun { margin-top: 12px; }

/* Spalte B */
.day { margin-bottom: 18px; }
.dl { font-size: 15px; font-weight: 600; color: rgba(255,255,255,.5); margin-bottom: 7px; }
.day.now .dl { color: #fff; }
.ev { display: flex; align-items: baseline; font-size: 19px; line-height: 1.3; margin-bottom: 6px; }
.ev i { width: 9px; height: 9px; border-radius: 50%; flex: none; margin-right: 12px; position: relative; top: -2px; }
.et { color: rgba(255,255,255,.55); font-variant-numeric: tabular-nums; margin-right: 6px; flex: none; }
.es { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* Spalte C */
.alerts { display: flex; flex-direction: column; }
.al { display: flex; align-items: flex-start; padding: 11px 0 11px 14px; border-left: 3px solid rgba(255,255,255,.25); margin-bottom: 10px; }
.al .ai { color: rgba(255,255,255,.8); margin-right: 12px; margin-top: 1px; }
.al b { display: block; font-size: 19px; font-weight: 500; line-height: 1.25; }
.al small { display: block; font-size: 15px; color: rgba(255,255,255,.55); margin-top: 3px; }
.al.warn { border-left-color: #f5b041; }
.al.warn .ai { color: #f5b041; }
.al.crit { border-left-color: #ff6b6b; }
.al.crit .ai { color: #ff6b6b; }
.al.info { border-left-color: #6aa9ff; }
.al.info .ai { color: #6aa9ff; }
.al.calm { border-left-color: #5fd38d; }
.al.calm .ai { color: #5fd38d; }
.sts { display: flex; flex-direction: column; }
.st { display: flex; align-items: center; font-size: 17px; color: rgba(255,255,255,.7); padding: 7px 0; border-bottom: 1px solid rgba(255,255,255,.07); }
.st:last-child { border-bottom: 0; }
.st > span:nth-child(2) { flex: 1; min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.st b { font-weight: 500; color: #f2f2f0; margin-left: 10px; white-space: nowrap; }
.sti { color: rgba(255,255,255,.5); margin-right: 12px; display: flex; }
.sti .i { width: 19px; height: 19px; }
.sti.ok { color: #5fd38d; }
.sti.mid { color: #f5b041; }
.sti.act { color: #6aa9ff; }

/* Abfall-Leiste */
footer { grid-column: 1 / -1; display: flex; align-items: center; border-top: 1px solid rgba(255,255,255,.1); padding-top: 18px; margin-top: 10px; }
.fi { color: rgba(255,255,255,.4); margin-right: 22px; width: 24px; height: 24px; }
.bin { flex: 1; display: flex; align-items: center; }
.bin i { width: 6px; height: 34px; border-radius: 3px; margin-right: 12px; opacity: .85; }
.bin b { display: block; font-size: 17px; font-weight: 500; }
.bin small { display: block; font-size: 15px; color: rgba(255,255,255,.5); }
.bin.soon b { color: #fff; }
.bin.soon small { color: #f5b041; font-weight: 600; }
`;

customElements.define('spiegel-card', SpiegelCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: 'spiegel-card', name: 'Spiegel (Bilderrahmen)', description: 'Magic-Mirror-Ansicht für den Bilderrahmen: Uhr, Wetter, gemeinsame Termine, Hinweise, Wohnung, Abfall.' });
