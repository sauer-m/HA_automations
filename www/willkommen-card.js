// willkommen-card: Startseite nach Mockup (claude.ai/artifact/5ajiW5xn2K2hW4iuHzEmN9), Live-Daten aus HA.
// Quelle: Smarthome/ha/willkommen-card.js · Repo sauer-m/HA_automations www/
const I = {
  alarmoff: 'M12 21a8 8 0 1 0 0-16a8 8 0 0 0 0 16M12 9v4l2.5 2M5 3 2 6M19 3l3 3M3 3l18 18',
  alarm: 'M12 21a8 8 0 1 0 0-16a8 8 0 0 0 0 16M12 9v4l2.5 2M5 3 2 6M19 3l3 3',
  home:'M3 10.5 12 3l9 7.5V21H3z',
  wash: 'M4 2h16v20H4zM12 9a5 5 0 1 0 0 10a5 5 0 1 0 0-10M8 5h.01M11 5h.01',
  list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  bolt: 'M13 2 4 14h7l-1 8 9-12h-7z',
  cube: 'M12 2 3 7v10l9 5 9-5V7zM3 7l9 5 9-5M12 12v10',
  leaf: 'M5 21c0-9 5-15 15-16c0 10-6 15-15 16zM5 21l8-8',
  robot: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18M12 8a2 2 0 1 0 0 4a2 2 0 1 0 0-4',
  news: 'M4 4h13v16H6a2 2 0 0 1-2-2zM17 8h3v10a2 2 0 0 1-2 2M8 8h5M8 12h5M8 16h3',
  battery: 'M3 7h15v10H3zM21 10v4M6 10v4',
  window: 'M4 3h16v18H4zM12 3v18M4 12h16',
  lock: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4',
  unlock: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 7.5-2',
  door: 'M5 21V3h11v18M16 3l3 1v17M12 12h.01',
  light: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z',
  away: 'M10 17l5-5-5-5M15 12H3M14 3h6v18h-6',
  film: 'M3 5h18v14H3zM7 5v14M17 5v14M3 9h4M3 15h4M17 9h4M17 15h4',
  check: 'M5 12.5l4.5 4.5L19 7',
  cal: 'M4 5h16v16H4zM4 10h16M9 3v4M15 3v4',
  car: 'M5 16h14M6 16l1.5-6h9L18 16M7 19v-3M17 19v-3',
  mail: 'M3 6h18v12H3zM3 6l9 7 9-7',
  thermo: 'M10 14V5a2 2 0 0 1 4 0v9a4 4 0 1 1-4 0z',
  printer: 'M7 3h10v6H7zM4 9h16v8H4zM7 14h10v7H7z',
  coffee: 'M4 8h12v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM16 10h2a2 2 0 0 1 0 4h-2M8 3v2M12 3v2',
  rain: 'M7 15a5 5 0 1 1 9.5-3H17a3.5 3.5 0 0 1 0 7H7zM9 21l1-2M13 21l1-2',
  sun: 'M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  cloud: 'M7 18a5 5 0 1 1 9.5-3H17a3.5 3.5 0 0 1 0 7z',
  dot: 'M12 10a2 2 0 1 0 0 4a2 2 0 1 0 0-4',
};
const ic = (k) => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="${I[k] || I.dot}"/></svg>`;
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmt = (v, d = 1) => (isFinite(v) ? v : 0).toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });

const TAGE = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
// Wecker Echo Spot Schlafzimmer (Alexa Media Player, sorted_all): Logik wie wecker-card.js
const WKS = 'sensor.echo_spot_schlafzimmer_nachster_alarm', WKP = 'input_boolean.wecker_abwesenheit_pausiert', WKI = 'input_text.wecker_pausierte_ids', WKNAV = '/dashboard-beleuctung/wecker';
const wkDays = (a) => { const p = a.recurringPattern, rr = a.rRuleData && (a.rRuleData.byWeekDays || a.rRuleData.byDay), R = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 };
  if (Array.isArray(rr) && rr.length) return rr.map((d) => R[String(d).slice(0, 2).toUpperCase()]).filter((d) => d != null);
  if (!p) return null; if (p === 'P1D' || p === 'XXXX-WXX') return [0, 1, 2, 3, 4, 5, 6]; if (p === 'XXXX-WD') return [1, 2, 3, 4, 5]; if (p === 'XXXX-WE') return [0, 6];
  const m = p.match(/^XXXX-WXX-([1-7](?:,[1-7])*)$/); return m ? m[1].split(',').map((n) => +n % 7) : []; };
const wkNext = (a, from) => { const [H, M] = String(a.originalTime || '').split(':').map(Number), days = wkDays(a);
  if (!isFinite(H) || (days && !days.length)) { const t = Date.parse(a.date_time); return isFinite(t) && t >= from ? t : null; }
  if (days === null) { const [y, mo, d] = String(a.originalDate || '').split('-').map(Number); const t = new Date(y, mo - 1, d, H, M).getTime(); return isFinite(t) && t >= from ? t : null; }
  const b = new Date(from); for (let i = 0; i < 8; i++) { const c = new Date(b.getFullYear(), b.getMonth(), b.getDate() + i, H, M); if (days.includes(c.getDay()) && c.getTime() >= from) return c.getTime(); } return null; };
// st: 'on' (grün) | 'off' (wegen Abwesenheit pausiert: rot, durchgestrichen) | 'none' (grau); nur heute/morgen
const wkTile = (states) => { const o = states[WKS], g = (id) => (states[id] ? states[id].state : '');
  const pz = g(WKP) === 'on' ? g(WKI).split(',').map((x) => x.trim()).filter(Boolean) : [], from = Date.now() - 60000; let best = null;
  ((o && o.attributes.sorted_all) || []).forEach((a) => { if (!a || a.type !== 'Alarm') return; const p = a.status !== 'ON' && pz.includes(a.id); if (a.status !== 'ON' && !p) return;
    const t = wkNext(a, from); if (t && (!best || t < best.t || (t === best.t && !p))) best = { t, p }; });
  if (!best) return { st: 'none', txt: 'kein Wecker' };
  const d0 = new Date(best.t); d0.setHours(0, 0, 0, 0); const t0 = new Date(); t0.setHours(0, 0, 0, 0); const n = Math.round((d0 - t0) / 864e5);
  if (n > 1) return { st: 'none', txt: 'kein Wecker' };
  return { st: best.p ? 'off' : 'on', txt: `${n === 0 ? 'heute' : 'morgen'} ${new Date(best.t).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}` }; };
const TAGK = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
const MON = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
const WX = { 'clear-night': 'klar', cloudy: 'bewölkt', exceptional: 'Unwetter', fog: 'Nebel', hail: 'Hagel', lightning: 'Gewitter', 'lightning-rainy': 'Gewitter', partlycloudy: 'teils bewölkt', pouring: 'Starkregen', rainy: 'Regen', snowy: 'Schnee', 'snowy-rainy': 'Schneeregen', sunny: 'sonnig', windy: 'windig', 'windy-variant': 'windig' };
const WXI = { rainy: 'rain', pouring: 'rain', 'snowy-rainy': 'rain', snowy: 'rain', sunny: 'sun', 'clear-night': 'sun', partlycloudy: 'cloud', cloudy: 'cloud', fog: 'cloud' };
const VAC = { docked: 'angedockt', cleaning: 'saugt', returning: 'fährt zurück', paused: 'pausiert', idle: 'bereit', error: 'Fehler' };
const PRUSA = { idle: 'bereit', busy: 'beschäftigt', printing: 'druckt', paused: 'pausiert', finished: 'fertig', stopped: 'gestoppt', error: 'Fehler', attention: 'braucht Aufmerksamkeit', ready: 'bereit' };

const WEATHER = 'weather.weather_23554_lubeck_deutschland';
const PERSONS = ['person.sauerm', 'person.sarah'];
const WIN = [['binary_sensor.wohnzimmerfenster', 'Wohnzimmerfenster'], ['binary_sensor.esszimmerfenster', 'Esszimmerfenster'], ['binary_sensor.schlafzimmerfenster', 'Schlafzimmerfenster'], ['binary_sensor.badezimmerfenster', 'Badezimmerfenster'], ['binary_sensor.terrassentur', 'Terrassentür']];
const GERAETE = [['sensor.waschmaschine_zustand', 'Waschmaschine', 'hwr_waschmaschine'], ['sensor.trockner_zustand', 'Trockner', 'hwr_trockner'], ['sensor.spulmaschine_zustand', 'Spülmaschine', 'kuche_spulmaschine']];
const LIGHTS = ['light.wohnzimmerlicht', 'light.stehlampe', 'light.ecklampe_wohnzimmer', 'light.schlafzimmerlicht', 'light.nachttischlampe', 'light.badezimmerlicht', 'light.badezimmerlicht_hintergrundbeleuchtung', 'light.kuche_schaltausgang_kuchenlicht', 'light.esszimmerlicht', 'light.schalter_flurlicht', 'light.ambilight_buro', 'light.terrassenlicht', 'light.teelichter_esszimmer', 'light.teelichter_schlafzimmer'];
// Briefing-Sensor je Benutzer (user.id). Wer keinen hat, sieht keine Briefing-Inhalte.
const BRIEFING = { d2389a10564e41eb9bd0bed86ae20b40: 'sensor.briefing', c9575fe71bdd4630abbd97185a784bfa: 'sensor.briefing_sarah' };
// Persönliche Home-Tasks-Listen je Benutzer (user.id): nur dieser Benutzer sieht ihre Hinweise.
// Schlüssel k ergibt todo.<k>, calendar.<k>_calendar, binary_sensor.<k>_overdue, sensor.<k>_open_tasks.
const PERSONAL = { d2389a10564e41eb9bd0bed86ae20b40: [['korperpflege', 'Körperpflege', '/dashboard-haushalt/aufgaben']] };
const ABFALL = [['sensor.abfall_restmull', 'Restmüll'], ['sensor.abfall_biotonne', 'Biotonne'], ['sensor.abfall_papier', 'Papier'], ['sensor.abfall_gelber_sack', 'Gelber Sack']];
const BOTH = 'script.turen_nacheinander_offnen'; // Haustür sofort, Wohnungstür nach 5 s
const SEVTXT ={ crit: 'Kritisch', warn: 'Achtung', info: 'Info' };

class WillkommenCard extends HTMLElement {
  setConfig(c) { this._c = c || {}; this._arm = null; }
  getCardSize() { return 14; }

  set hass(h) {
    this._hass = h;
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      const sr = this.shadowRoot;
      sr.addEventListener('click', (e) => this._click(e));
      // Langer Druck auf "Haustür öffnen" -> Popup für beide Türen
      sr.addEventListener('pointerdown', (e) => {
        this._lp = false;
        const b = e.target.closest('[data-qa="door"]');
        if (!b || this._bothActive()) return;
        clearTimeout(this._lpT);
        this._lpT = setTimeout(() => { this._lp = true; this._arm = null; this._dlg = true; this._render(); if (navigator.vibrate) navigator.vibrate(30); }, 600);
      });
      ['pointerup', 'pointercancel'].forEach((t) => sr.addEventListener(t, () => clearTimeout(this._lpT), true));
      sr.addEventListener('contextmenu', (e) => { if (e.target.closest('[data-qa="door"]')) e.preventDefault(); });
      if (!document.getElementById('wk-fonts')) {
        const l = document.createElement('link');
        l.id = 'wk-fonts'; l.rel = 'stylesheet';
        l.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600&display=swap';
        document.head.appendChild(l);
      }
    }
    const now = Date.now();
    if (!this._t || now - this._t > 2000) { this._t = now; this._render(); }
    else if (!this._pend) this._pend = setTimeout(() => { this._pend = null; this._t = Date.now(); this._render(); }, 2000);
  }
  connectedCallback() { this._iv = setInterval(() => this._render(), 30000); }
  disconnectedCallback() { clearInterval(this._iv); }

  _o(id) { return this._hass.states[id]; }
  _s(id) { const o = this._o(id); return o ? o.state : 'unavailable'; }
  _n(id) { const v = parseFloat(this._s(id)); return isFinite(v) ? v : null; }
  _a(id, k) { const o = this._o(id); return o ? o.attributes[k] : undefined; }
  _fn(id) { return this._a(id, 'friendly_name') || id; }
  _ago(id) {
    const o = this._o(id); if (!o) return '';
    const m = Math.round((Date.now() - new Date(o.last_changed)) / 60000);
    if (m < 1) return 'gerade eben';
    if (m < 60) return `seit ${m} min`;
    if (m < 1440) return `seit ${Math.round(m / 60)} h`;
    return `seit ${Math.round(m / 1440)} Tagen`;
  }
  // Countdown läuft, solange das Skript läuft (oder gerade gestartet wurde, Zustand noch nicht da)
  _bothActive() {
    if (this._s(BOTH) === 'on') return true;
    return !!this._both && Date.now() - this._both < 1500;
  }
  _bothLeft() {
    const lt = Date.parse(this._a(BOTH, 'last_triggered') || '');
    const st = Math.max(this._both || 0, isFinite(lt) ? lt : 0) || Date.now();
    return Math.max(0, Math.ceil((st + 5000 - Date.now()) / 1000));
  }
  _tick() {
    clearInterval(this._tk);
    this._tk = setInterval(() => {
      this._render();
      if (!this._bothActive()) { clearInterval(this._tk); this._tk = null; this._both = 0; this._render(); }
    }, 250);
  }
  _hhmm(t) { const d = new Date(t); return isNaN(d) ? '' : d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }); }
  _wecker() { return wkTile(this._hass.states); }

  _click(e) {
    if (this._lp) { this._lp = false; return; } // Klick nach Langdruck schlucken
    const dl = e.target.closest('[data-dlg]');
    if (dl) {
      const ok = dl.dataset.dlg === 'ok';
      if (dl.dataset.dlg === 'bg' && e.target !== dl) return;
      this._dlg = false;
      if (ok) {
        this._both = Date.now(); this._cancelled = 0;
        this._hass.callService('script', 'turn_on', { entity_id: BOTH });
        this._tick();
      }
      this._render(); return;
    }
    const el = e.target.closest('[data-nav],[data-mi],[data-qa]');
    if (!el) return;
    if (el.dataset.nav) {
      history.pushState(null, '', el.dataset.nav);
      window.dispatchEvent(new CustomEvent('location-changed', { detail: { replace: false } }));
    } else if (el.dataset.mi) {
      const ev = new Event('hass-more-info', { bubbles: true, composed: true });
      ev.detail = { entityId: el.dataset.mi };
      this.dispatchEvent(ev);
    } else if (el.dataset.qa) this._qa(el.dataset.qa);
  }

  _qa(k) {
    const h = this._hass;
    if (k === 'door' && this._bothActive()) { // ABBRUCH: Wohnungstür bleibt zu
      h.callService('script', 'turn_off', { entity_id: BOTH });
      this._both = 0; this._cancelled = Date.now(); this._arm = null;
      setTimeout(() => this._render(), 3100);
      this._render(); return;
    }
    const confirmFirst = { lights: 1, door: 1 };
    if (confirmFirst[k] && this._arm !== k) {
      this._arm = k; clearTimeout(this._armT);
      this._armT = setTimeout(() => { this._arm = null; this._render(); }, 4000);
      this._render(); return;
    }
    this._arm = null; clearTimeout(this._armT);
    if (k === 'lights') h.callService('light', 'turn_off', { entity_id: LIGHTS });
    if (k === 'away') h.callService('input_boolean', 'toggle', { entity_id: 'input_boolean.abwesenheit' });
    if (k === 'preheat') h.callService('input_boolean', 'toggle', { entity_id: 'input_boolean.heizung_anheizen' });
    if (k === 'door') h.callService('lock', 'unlock', { entity_id: 'lock.haustur' });
    this._render();
  }

  _alerts() {
    const A = [];
    const nobody = PERSONS.every((p) => this._s(p) !== 'home');
    WIN.forEach(([id, label]) => {
      if (this._s(id) === 'on') A.push({ sev: 'crit', ic: id.includes('terrasse') ? 'door' : 'window', t: `${label} offen`, s: this._ago(id), go: ['Klima', '/dashboard-beleuctung/klima'] });
    });
    const lk = this._s('lock.wohnungstur');
    // Nur kritisch, wenn niemand zu Hause ist; mit jemandem daheim ist eine offene Wohnungstür okay.
    if (nobody && lk !== 'locked' && lk !== 'unavailable' && lk !== 'unknown')
      A.push({ sev: 'crit', ic: 'unlock', t: 'Wohnungstür nicht abgeschlossen', s: `niemand zu Hause · ${this._ago('lock.wohnungstur')}`, go: ['Tür', null, 'lock.wohnungstur'] });

    if (this._s('binary_sensor.batterie_flotte_schwache_batterien_ersetzen_uberfallig') === 'on') {
      const low = Object.entries(this._hass.states).filter(([id, o]) => o.attributes.device_class === 'battery' && id.startsWith('sensor.') && !id.startsWith('sensor.p50') && isFinite(parseFloat(o.state)) && parseFloat(o.state) < 20)
        .map(([id, o]) => (o.attributes.friendly_name || id).replace(/ ?Batterie(stand)?$/i, ''));
      const maint = this._hass.panels && this._hass.panels['maintenance-supporter'] ? '/maintenance-supporter' : '/maintenance';
      A.push({ sev: 'warn', ic: 'battery', t: low.length === 1 ? `Batterie schwach: ${low[0]}` : low.length ? `Batterien schwach: ${low.length} Geräte` : 'Batterien prüfen',
        s: `Wartungstermin fällig: schwache Batterien ersetzen${low.length > 1 ? ' · ' + low.slice(0, 3).join(', ') : ''}`, go: ['Wartung', maint] });
    }
    if (this._s('binary_sensor.haushalt_overdue') === 'on') {
      const msg = this._a('calendar.haushalt_calendar', 'message');
      const st = new Date(this._a('calendar.haushalt_calendar', 'start_time'));
      A.push({ sev: 'warn', ic: 'list', t: 'Haushalt: Aufgaben überfällig', s: `${this._n('sensor.haushalt_open_tasks') ?? '–'} offen${msg ? ` · nächster Termin: ${msg}, ${TAGK[st.getDay()]} ${st.getDate()}.${st.getMonth() + 1}.` : ''}`, go: ['Aufgaben', '/dashboard-haushalt/aufgaben'] });
    }
    // Persönliche Listen nur für den angemeldeten Benutzer: überfällig oder heute fällig
    const u = this._hass.user && this._hass.user.id;
    (PERSONAL[u] || []).forEach(([k, name, nav]) => {
      const od = this._o(`binary_sensor.${k}_overdue`), cal = `calendar.${k}_calendar`;
      const titles = ((od && od.attributes.overdue_tasks) || []).map((t) => (typeof t === 'string' ? t : t.title || t.summary)).filter(Boolean);
      const st = this._a(cal, 'start_time'), msg = this._a(cal, 'message');
      const today = st && new Date(st.replace(' ', 'T')) <= new Date() && msg && !titles.includes(msg);
      if (today) titles.push(msg);
      if (titles.length) A.push({ sev: 'warn', ic: 'list', t: `${name}: ${titles.length === 1 ? titles[0] : titles.length + ' Aufgaben fällig'}`, s: titles.length > 1 ? titles.slice(0, 3).join(', ') : od && od.state === 'on' ? 'überfällig · nur für dich sichtbar' : 'heute fällig · nur für dich sichtbar', go: [name, nav] });
    });
    // Abfall: morgen oder heute
    const abf = ABFALL.filter(([id]) => [0, 1].includes(this._a(id, 'daysTo')));
    if (abf.length) {
      const d = this._a(abf[0][0], 'daysTo');
      const names = abf.filter(([id]) => this._a(id, 'daysTo') === d).map(([, n]) => n);
      A.push({ sev: 'info', ic: 'trash', t: `${d ? 'Morgen' : 'Heute'} Abfuhr: ${names.join(' + ')}`, s: d ? 'heute Abend rausstellen' + (names.includes('Gelber Sack') ? ' · Gelbe Säcke bis 6 Uhr an die Straße' : '') : 'bis 6 Uhr an der Straße', go: ['Abfall', '/dashboard-haushalt'] });
    }
    const plants = Object.keys(this._hass.states).filter((id) => id.startsWith('binary_sensor.simple_plant_todo_') && this._s(id) === 'on')
      .map((id) => id.replace('binary_sensor.simple_plant_todo_', '').split('_').map((w) => w[0].toUpperCase() + w.slice(1)).join(' '));
    if (plants.length) A.push({ sev: 'warn', ic: 'leaf', t: plants.length === 1 ? 'Eine Pflanze braucht Wasser' : `${plants.length} Pflanzen brauchen Wasser`, s: plants.slice(0, 4).join(', '), go: ['Pflanzen', '/dashboard-pflanzen'] });

    GERAETE.forEach(([id, name, pre]) => {
      if (this._s(id) === 'finished') {
        const k = this._n(`sensor.${pre}_kosten_des_letzten_zyklus`);
        A.push({ sev: 'info', ic: 'wash', t: `${name} fertig`, s: `${this._ago(id).replace('seit', 'vor')}${k != null ? ` · letzter Zyklus ${fmt(k, 2)} €` : ''}`, go: ['Haushalt', '/dashboard-haushalt/geraete'] });
      }
    });
    if (this._s('sensor.prusa_xl') === 'finished')
      A.push({ sev: 'info', ic: 'printer', t: 'Prusa XL: Druck fertig', s: 'Steckdose schaltet nach 30 min Leerlauf ab', go: ['Werkstatt', '/dashboard-fabrication'] });
    const ord = { crit: 0, warn: 1, info: 2 };
    return A.sort((a, b) => ord[a.sev] - ord[b.sev]);
  }

  _today(sid) {
    const k = (sid && this._a(sid, 'kurz')) || '';
    const rows = [];
    k.split('\n').map((z) => z.trim()).filter(Boolean).forEach((z) => {
      const i = z.indexOf(':'); if (i < 0) return;
      const key = z.slice(0, i).trim(), val = z.slice(i + 1).trim();
      if (key === 'Wetter' || (key === 'Systemhinweise' && val === '0')) return;
      if (key === 'Termine heute') rows.push(['cal', `${val} Termine`, '']);
      else if (key === 'Erster') rows.push(['dot', 'Erster Termin', `<b>${esc(val)}</b>`]);
      else if (key === 'Verkehr') { const m = val.match(/ca\.\s*([\d.,]+\s*min)(?:,\s*([\d.,]+)\s*km)?/); rows.push(['car', 'Arbeitsweg', m ? `<b>${esc(m[1])}</b>${m[2] ? ` · ${fmt(parseFloat(m[2]), 1)} km` : ''}` : esc(val)]); }
      else if (key === 'Postfach') rows.push(['mail', 'Postfach', esc(val).replace(/^(\d+)/, '<b>$1</b>')]);
      else rows.push(['dot', esc(key), esc(val)]);
    });
    if (rows.length && rows[0][0] === 'cal' && rows[1] && rows[1][1] === 'Erster Termin') { rows[0][2] = `erster: ${rows[1][2]}`; rows.splice(1, 1); }
    const msg = this._a('calendar.haushalt_calendar', 'message');
    if (msg) { const st = new Date(this._a('calendar.haushalt_calendar', 'start_time')); rows.push(['coffee', 'Haushalt-Kalender', `${esc(msg)} · <b>${TAGK[st.getDay()]}</b>`]); }
    const t = sid ? this._a(sid, 'erstellt_um') : null;
    return { rows, stand: t ? this._hhmm(t) : '' };
  }

  _render() {
    const h = this._hass;
    if (!h || !this.shadowRoot) return;
    const dark = !!(h.themes && h.themes.darkMode);
    const now = new Date(), hr = now.getHours();
    const first = ((h.user && h.user.name) || '').split(' ')[0];
    const tod = hr < 5 || hr >= 23 ? 'nacht' : hr < 11 ? 'morgen' : hr < 18 ? 'tag' : 'abend';
    const greet = { morgen: `Guten Morgen, ${first}`, tag: `Hallo ${first}`, abend: `Guten Abend, ${first}`, nacht: `Gute Nacht, ${first}` }[tod];

    // Lagesatz
    const P = PERSONS.map((id) => ({ id, name: this._fn(id), st: this._s(id) }));
    const isMe = (p) => p.name === first;
    const where = (p) => p.st === 'home' ? 'zu Hause' : p.st === 'not_home' ? 'unterwegs' : p.st === 'Arbeit' ? 'auf der Arbeit' : `bei ${p.st}`;
    const home = P.filter((p) => p.st === 'home'), out = P.filter((p) => p.st !== 'home');
    let people;
    if (home.length === P.length) people = 'Ihr seid beide zu Hause';
    else if (!home.length) people = 'Niemand ist zu Hause';
    else {
      const part = (p) => isMe(p) ? `du bist ${where(p)}` : `<b>${esc(p.name)}</b> ist ${where(p)}`;
      people = [...home, ...out].map(part).join(', ');
      people = people.charAt(0).toUpperCase() + people.slice(1);
    }
    const locked = this._s('lock.wohnungstur') === 'locked';
    const doorBad = !locked && PERSONS.every((p) => this._s(p) !== 'home');
    const al = this._alerts();
    const nCrit = al.filter((a) => a.sev === 'crit').length;
    const tail = !al.length ? 'Nichts zu tun.' : nCrit ? `<b>${al.length} ${al.length === 1 ? 'Hinweis' : 'Hinweise'}</b>, davon ${nCrit} dringend.` : al.length === 1 ? '<b>1 Ding</b> für heute.' : `<b>${al.length} Dinge</b> für heute.`;

    // Wetter
    const ws = this._s(WEATHER);
    const temp = this._a(WEATHER, 'temperature'), wind = this._a(WEATHER, 'wind_speed');
    const up = this._s('sun.sun') === 'above_horizon';
    const sunT = this._hhmm(this._a('sun.sun', up ? 'next_setting' : 'next_rising'));
    const wk = this._wecker();

    const hello = `<div class="hello"><div class="eyebrow">${TAGE[now.getDay()]}, ${now.getDate()}. ${MON[now.getMonth()]} · ${this._hhmm(now)} Uhr</div><h2>${esc(greet)}</h2>
      <div class="sum">${people}, ${locked ? 'alles ist abgeschlossen' : doorBad ? 'die <b>Wohnungstür ist offen</b>' : 'die Wohnungstür ist nicht abgeschlossen'}. ${tail}</div>
      <div class="meta"><span class="wk-${wk.st}" data-nav="${WKNAV}">${ic(wk.st === 'off' ? 'alarmoff' : 'alarm')}${wk.st === 'none' ? 'kein Wecker' : wk.st === 'off' ? `<s>Wecker ${wk.txt}</s>` : `Wecker ${wk.txt}`}</span><span data-mi="${WEATHER}">${ic(WXI[ws] || 'cloud')}Lübeck ${temp != null ? fmt(temp, 1) : '–'} °C · ${WX[ws] || ws}</span>${wind != null ? `<span>Wind ${Math.round(wind)} km/h</span>` : ''}<span>${up ? 'Sonnenuntergang' : 'Sonnenaufgang'} ${sunT}</span></div></div>`;

    const goAttr = (g) => g[1] ? `data-nav="${g[1]}"` : `data-mi="${g[2]}"`;
    const attention = `<div class="att" aria-label="Hinweise">${al.length
      ? al.map((a) => `<div class="alert ${a.sev}" ${goAttr(a.go)} role="button" tabindex="0"><div class="ic">${ic(a.ic)}</div><div class="tx"><b><span class="sev">${SEVTXT[a.sev]}</span>${esc(a.t)}</b><small>${esc(a.s)}</small></div><span class="go">${a.go[0]} →</span></div>`).join('')
      : `<div class="alert ok"><div class="ic">${ic('check')}</div><div class="tx"><b>Alles in Ordnung</b><small>Fenster zu, ${locked ? 'Türen abgeschlossen' : 'Türen in Ordnung'}, keine Geräte fertig, keine Aufgaben fällig.</small></div><span></span></div>`}</div>`;

    const chip = (p) => `<span class="chip ${p.st === 'home' ? 'home' : ''}" data-mi="${p.id}"><span class="av">${esc(p.name[0] || '?')}</span>${esc(p.name)} <span class="st">· ${where(p)}</span></span>`;
    const hd = this._s('lock.haustur') === 'locked';
    const who = `<div class="card who"><div class="ch"><h3>Wer ist da</h3></div><div class="chips">${P.map(chip).join('')}
      <span class="chip lock ${locked ? 'ok' : doorBad ? 'bad' : ''}" data-mi="lock.wohnungstur">${ic(locked ? 'lock' : 'unlock')}Wohnungstür ${locked ? 'zu' : 'offen'}</span>
      <span class="chip lock ${hd ? 'ok' : 'bad'}" data-mi="lock.haustur">${ic(hd ? 'lock' : 'unlock')}Haustür ${hd ? 'zu' : 'offen'}</span></div></div>`;

    const lightsOn = LIGHTS.filter((l) => this._s(l) === 'on').length;
    const awayOn = this._s('input_boolean.abwesenheit') === 'on', heatOn = this._s('input_boolean.heizung_anheizen') === 'on';
    const bothOn = this._bothActive();
    if (bothOn && !this._tk) this._tick(); // auch wenn das Skript woanders gestartet wurde
    const cancelled = this._cancelled && Date.now() - this._cancelled < 3000;
    const QA = [
      ['lights', 'light', 'Alle Lichter aus', this._arm === 'lights' ? 'Nochmal tippen zum Ausschalten' : lightsOn ? `${lightsOn} von 14 an` : 'alle aus', false],
      ['away', 'away', 'Abwesend', awayOn ? 'an · Heizung auf Urlaub' : 'aus', awayOn],
      ['preheat', 'thermo', 'Vorheizen', heatOn ? 'an · Urlaubsmodus aus' : 'aus', heatOn],
      bothOn ? ['door', 'door', 'ABBRUCH', `Wohnungstür öffnet in ${this._bothLeft()} s`, false, 'abort']
        : cancelled ? ['door', 'door', 'Abgebrochen', 'Wohnungstür bleibt zu', false]
        : ['door', 'door', 'Haustür öffnen', this._arm === 'door' ? 'Nochmal tippen zum Öffnen' : 'Tippen · lang: beide Türen', false],
    ];
    const quick = `<div class="card quick"><div class="ch"><h3>Schnellaktionen</h3><span class="sub">${tod === 'abend' || tod === 'nacht' ? 'Abendauswahl' : 'Tagesauswahl'}</span></div>
      <div class="qas">${QA.map(([k, i, t, s, on, x]) => `<button class="qa ${on ? 'on' : ''} ${this._arm === k ? 'armed' : ''} ${x || ''}" data-qa="${k}">${ic(i)}<b>${t}</b><small>${esc(s)}</small></button>`).join('')}</div></div>`;
    const dlg = this._dlg ? `<div class="dlg-bg" data-dlg="bg"><div class="dlg" role="dialog" aria-modal="true">
      <div class="dlg-ic">${ic('door')}</div><h3>Beide Türen öffnen?</h3>
      <p>Die <b>Haustür</b> öffnet sofort, die <b>Wohnungstür</b> 5 Sekunden später. Bis dahin kannst du die Wohnungstür mit einem Tipp auf den Knopf abbrechen.</p>
      <div class="dlg-b"><button class="btn" data-dlg="no">Abbrechen</button><button class="btn pri" data-dlg="ok">Öffnen</button></div></div></div>` : '';

    const bs = BRIEFING[h.user && h.user.id];
    const td = this._today(bs);
    const bnav = bs ? ' data-nav="/dashboard-willkommen/briefing"' : '';
    const today = `<div class="card today"><div class="ch"><h3>Heute</h3>${bs ? `<span class="sub"${bnav}>aus dem Briefing${td.stand ? ' · ' + td.stand : ''} →</span>` : ''}</div><div class="rows">
      ${td.rows.length ? td.rows.map(([i, l, v]) => `<div class="row"${bnav}>${ic(i)}<span>${l}</span><span class="v">${v}</span></div>`).join('') : `<div class="muted">${bs ? 'Noch kein Briefing abgerufen.' : 'Heute steht nichts an.'}</div>`}</div></div>`;

    const pw = this._n('sensor.energie_leistung_erfasst'), ck = this._n('sensor.stromkosten_heute');
    const vac = this._s('vacuum.p50_pro_ultra'), pr = this._s('sensor.prusa_xl'), plug = this._s('switch.prusa_xl_keller');
    const prTxt = plug === 'off' ? '<b>aus</b> · Steckdose aus' : `<b>${PRUSA[pr] || (pr === 'unavailable' ? 'offline' : pr)}</b>`;
    const t = this._n('sensor.wohnzimmerthermostat_temperature');
    const status = `<div class="card status"><div class="ch"><h3>Kurzstatus</h3><span class="sub">tippen für Details</span></div><div class="rows">
      <div class="row" data-mi="sensor.wohnzimmerthermostat_temperature">${ic('thermo')}<span>Innen (Wohnzimmer)</span><span class="v"><b>${t != null ? fmt(t, 1) : '–'} °C</b></span></div>
      <div class="row" data-nav="/dashboard-energie/overview">${ic('bolt')}<span>Strom erfasst</span><span class="v"><b>${pw != null ? Math.round(pw) : '–'} W</b> · heute ${ck != null ? fmt(ck, 2) : '–'} €</span></div>
      <div class="row" data-mi="vacuum.p50_pro_ultra">${ic('robot')}<span>Mova</span><span class="v"><b>${VAC[vac] || vac}</b></span></div>
      <div class="row" data-nav="/dashboard-fabrication">${ic('printer')}<span>Prusa XL</span><span class="v">${prTxt}</span></div></div></div>`;

    const plantsN = Object.keys(h.states).filter((id) => id.startsWith('binary_sensor.simple_plant_todo_')).length;
    const plantsDue = Object.keys(h.states).filter((id) => id.startsWith('binary_sensor.simple_plant_todo_') && this._s(id) === 'on').length;
    const einkauf = this._n('todo.einkaufsliste_2');
    const termine = (td.rows.find((r) => r[0] === 'cal') || [])[1];
    const NAV = [
      ['home', 'Zuhause', 'Licht, Klima, Kameras', '/dashboard-beleuctung'],
      ['wash', 'Haushalt', `${this._n('sensor.haushalt_open_tasks') ?? '–'} offen`, '/dashboard-haushalt'],
      ['list', 'To-do', einkauf ? `Einkauf: ${einkauf}` : 'Einkauf leer', '/todo?entity_id=todo.einkaufsliste_2'],
      ['bolt', 'Energie', `${ck != null ? fmt(ck, 2) : '–'} € heute`, '/dashboard-energie/overview'],
      ['cube', 'Werkstatt', `Prusa XL ${plug === 'off' ? 'aus' : PRUSA[pr] || 'offline'}`, '/dashboard-fabrication'],
      ['leaf', 'Pflanzen', plantsDue ? `${plantsDue} gießen` : `${plantsN} Pflanzen`, '/dashboard-pflanzen'],
      ['robot', 'Mova', VAC[vac] || vac, '/dashboard-haushalt/saugroboter'],
      bs && ['news', 'Briefing', termine || 'Tagesüberblick', '/dashboard-willkommen/briefing'],
    ].filter(Boolean);
    const nav = `<div class="navgrid">${NAV.map(([i, l, s, p]) => `<div class="tile" data-nav="${p}" role="link" tabindex="0"><span class="tb">${ic(i)}</span><span>${l}<small>${esc(s)}</small></span></div>`).join('')}</div>`;

    const order = tod === 'morgen' ? [hello, attention, today, status, who, quick, nav] : [hello, attention, who, quick, today, status, nav];
    this.shadowRoot.innerHTML = `<style>${this._css(dark)}</style><div class="view">${order.join('')}</div>${dlg}`;
  }

  _css(dark) {
    const p = dark
      ? { accent: '#4a9be8', accentSoft: '#1b2c3e', good: '#3fbf85', goodSoft: '#15291f', warn: '#e2a93b', warnSoft: '#2e2412', crit: '#ec6a5f', critSoft: '#331a18' }
      : { accent: '#1f78d1', accentSoft: '#e3effb', good: '#1a9c62', goodSoft: '#e2f4eb', warn: '#b97700', warnSoft: '#fbf0d9', crit: '#c8382e', critSoft: '#fbe6e4' };
    return `
:host{display:block;container-type:inline-size;--card:var(--ha-card-background,var(--card-background-color,#fff));--ink:var(--primary-text-color);--ink2:var(--secondary-text-color);--muted:var(--secondary-text-color);--line:var(--divider-color,rgba(127,127,127,.25));--sunk:rgba(127,127,127,.09);
  --accent:${p.accent};--accent-soft:${p.accentSoft};--good:${p.good};--good-soft:${p.goodSoft};--warn:${p.warn};--warn-soft:${p.warnSoft};--crit:${p.crit};--crit-soft:${p.critSoft};
  --fd:"Space Grotesk",var(--ha-font-family-body,system-ui),sans-serif;--fb:"Inter",var(--ha-font-family-body,system-ui),sans-serif}
*{box-sizing:border-box}
h2,h3{font-family:var(--fd);font-weight:600;margin:0;text-wrap:balance}
svg.i{width:18px;height:18px;flex:none;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
.view{max-width:1560px;margin:0 auto;padding:22px 28px;display:grid;gap:16px;grid-template-columns:repeat(12,minmax(0,1fr));align-content:start;font-family:var(--fb);font-size:14px;line-height:1.5;color:var(--ink)}
.eyebrow{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);font-weight:600}
.muted{color:var(--muted)}
[data-nav],[data-mi],[data-qa]{cursor:pointer}
.card{background:var(--card);border:1px solid var(--line);border-radius:var(--ha-card-border-radius,14px);padding:16px;display:grid;gap:10px;align-content:start;min-width:0}
.ch{display:flex;align-items:baseline;justify-content:space-between;gap:10px}
.ch h3{font-size:15px}
.ch .sub{font-size:12px;color:var(--muted)}
.hello{grid-column:1/-1;display:grid;gap:4px;padding:6px 2px 4px}
.hello h2{font-size:30px;letter-spacing:-.015em}
.hello .sum{font-size:15px;color:var(--ink2);max-width:72ch}
.hello .sum b{color:var(--ink);font-weight:600}
.meta{display:flex;flex-wrap:wrap;gap:6px 16px;color:var(--ink2);font-size:13px;margin-top:6px}
.meta span{display:inline-flex;align-items:center;gap:6px}
.meta .wk-on svg{color:var(--good)}.meta .wk-off,.meta .wk-off svg{color:var(--crit)}.meta .wk-none{opacity:.7}
.att{grid-column:1/-1;display:grid;gap:8px}
.alert{display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:11px 14px}
.alert[data-nav]:hover,.alert[data-mi]:hover,.tile:hover,.row:hover{border-color:var(--accent)}
.alert .ic{width:34px;height:34px;border-radius:9px;display:grid;place-items:center}
.alert.crit .ic{background:var(--crit-soft);color:var(--crit)}.alert.warn .ic{background:var(--warn-soft);color:var(--warn)}
.alert.info .ic{background:var(--accent-soft);color:var(--accent)}.alert.ok .ic{background:var(--good-soft);color:var(--good)}
.alert .tx{min-width:0}.alert b{display:block;font-weight:600}
.alert small{color:var(--ink2);font-size:12.5px}
.sev{font-size:10.5px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;padding:2px 7px;border-radius:999px;margin-right:6px;vertical-align:1px}
.crit .sev{background:var(--crit-soft);color:var(--crit)}.warn .sev{background:var(--warn-soft);color:var(--warn)}.info .sev{background:var(--accent-soft);color:var(--accent)}
.go{border:1px solid var(--line);color:var(--ink2);font-size:12.5px;font-weight:500;padding:5px 10px;border-radius:8px;white-space:nowrap}
.who{grid-column:span 5}.quick{grid-column:span 7}.today{grid-column:span 7}.status{grid-column:span 5}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chip{display:inline-flex;align-items:center;gap:8px;padding:6px 12px 6px 6px;border-radius:999px;background:var(--sunk);font-size:13px}
.chip .av{width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font-size:11px;font-weight:600;background:var(--card);border:1px solid var(--line)}
.chip.home .av{border-color:var(--good);color:var(--good)}
.chip .st{color:var(--ink2)}
.chip.lock{padding-left:10px}.chip.lock.ok{color:var(--good)}.chip.lock.bad{color:var(--crit)}
.qas{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
.qa{appearance:none;border:1px solid var(--line);background:var(--sunk);color:var(--ink);font:inherit;border-radius:12px;padding:12px 10px;display:grid;gap:6px;justify-items:start;align-content:start;text-align:left}
.qa svg{color:var(--accent)}.qa b{font-size:13px;font-weight:600}.qa small{font-size:11.5px;color:var(--muted);line-height:1.3}
.qa.on{background:var(--accent-soft);border-color:var(--accent)}
.qa.armed{border-color:var(--warn);background:var(--warn-soft)}.qa.armed small{color:var(--warn);font-weight:600}
.qa{-webkit-touch-callout:none;-webkit-user-select:none;user-select:none;touch-action:manipulation}
.qa.abort{border:2px solid var(--crit);background:var(--crit-soft);padding:11px 9px;animation:qa-pulse 1s ease-in-out infinite}
.qa.abort svg,.qa.abort b,.qa.abort small{color:var(--crit)}.qa.abort b{letter-spacing:.06em}.qa.abort small{font-weight:600}
@keyframes qa-pulse{50%{box-shadow:0 0 0 4px var(--crit-soft)}}
.dlg-bg{position:fixed;inset:0;z-index:20;background:rgba(0,0,0,.45);display:grid;place-items:center;padding:16px}
.dlg{background:var(--card);color:var(--ink);border:1px solid var(--line);border-radius:16px;padding:22px;max-width:360px;width:100%;font-family:var(--fb);font-size:14px;line-height:1.5;box-shadow:0 12px 40px rgba(0,0,0,.3)}
.dlg h3{margin:10px 0 6px;font-family:var(--fd);font-size:18px;font-weight:600}.dlg p{margin:0 0 18px;color:var(--muted)}.dlg p b{color:var(--ink)}
.dlg-ic{width:40px;height:40px;border-radius:10px;display:grid;place-items:center;background:var(--warn-soft);color:var(--warn)}
.dlg-b{display:flex;gap:8px;justify-content:flex-end}
.btn{appearance:none;font:inherit;font-weight:600;border-radius:10px;padding:10px 16px;border:1px solid var(--line);background:var(--sunk);color:var(--ink);cursor:pointer}
.btn.pri{background:var(--warn);border-color:var(--warn);color:#fff}
.qa:focus-visible,.alert:focus-visible,.tile:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.rows{display:grid}
.row{display:grid;grid-template-columns:22px 1fr auto;gap:10px;align-items:center;padding:8px 4px;border-top:1px solid var(--line);border-radius:6px}
.row:first-child{border-top-color:transparent}
.row svg{color:var(--muted)}
.row .v{font-variant-numeric:tabular-nums;color:var(--ink2);font-size:13px;text-align:right}
.row .v b{color:var(--ink);font-weight:600}
.navgrid{grid-column:1/-1;display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px}
.tile{display:flex;align-items:center;gap:10px;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:10px 12px;font-weight:500;font-size:13px}
.tile .tb{width:30px;height:30px;border-radius:8px;display:grid;place-items:center;background:var(--sunk);color:var(--ink2)}
.tile small{display:block;font-weight:400;color:var(--muted);font-size:11.5px}
@container (max-width:760px){
  .view{padding:14px;grid-template-columns:minmax(0,1fr)}
  .view>*{grid-column:1/-1 !important}
  .hello h2{font-size:25px}
  .qas,.navgrid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .go{display:none}
}`;
  }
}
customElements.define('willkommen-card', WillkommenCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: 'willkommen-card', name: 'Willkommen', description: 'Startseite nach Mockup' });
