// zuhause-card: Reiter "Übersicht" im Dashboard Zuhause (dashboard-beleuctung), nach Mockup
// claude.ai/artifact/PjTdVWtvjrdK1hwRLiAfTP (24.11.2026). Quelle: Smarthome/ha/zuhause-card.js
const I = {
  sofa: 'M4 11V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3M2 11h20v6H2zM4 17v3M20 17v3',
  bed: 'M3 7v13M3 14h18v6M21 14v-3a3 3 0 0 0-3-3h-7v6M7 11a1.5 1.5 0 1 0 0-.01',
  shower: 'M4 20V8a4 4 0 0 1 8 0M10 8h6M12 12v.01M14 14v.01M16 12v.01M12 16v.01M16 16v.01',
  fork: 'M7 3v8a2 2 0 0 0 2 2v8M11 3v8M17 3c-2 2-2 6 0 8v10',
  chef: 'M6 14a4 4 0 0 1 1-7.9 5 5 0 0 1 10 0A4 4 0 0 1 18 14v6H6zM6 17h12',
  coat: 'M12 4v3M8 7h8l3 4-3 2v8H8v-8l-3-2z',
  desk: 'M3 8h18M5 8v12M19 8v12M8 4h8v4',
  deck: 'M3 21V10l9-6 9 6v11M3 14h18M8 14v7M16 14v7',
  light: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z',
  moon: 'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z',
  film: 'M3 5h18v14H3zM7 5v14M17 5v14M3 9h4M3 15h4M17 9h4M17 15h4',
  proj: 'M3 8h18v9H3zM16 12.5a2 2 0 1 0 0 .01M6 11h5M6 14h3M6 17v2M18 17v2',
  people: 'M9 11a4 4 0 1 0 0-8a4 4 0 0 0 0 8M2 21v-1a6 6 0 0 1 12 0v1M16 3.5a4 4 0 0 1 0 7.5M22 21v-1a6 6 0 0 0-4-5.6',
  person: 'M12 11a4 4 0 1 0 0-8a4 4 0 0 0 0 8M5 21v-1a7 7 0 0 1 14 0v1',
  lock: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4',
  unlock: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 7.5-2',
  window: 'M4 3h16v18H4zM12 3v18M4 12h16',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  thermo: 'M10 14V5a2 2 0 0 1 4 0v9a4 4 0 1 1-4 0z',
  flame: 'M12 22a6 6 0 0 0 6-6c0-4-3-6-4-10-2 2-3 4-3 6-1-1-2-2-2-4-2 2-3 5-3 8a6 6 0 0 0 6 6z',
  blind: 'M4 3h16M5 3v13h14V3M5 7h14M5 11h14M12 16v4',
  fan: 'M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0M12 10c0-4 1-7 4-7s2 5-2 7M14 12c4 0 7 1 7 4s-5 2-7-2M12 14c0 4-1 7-4 7s-2-5 2-7M10 12c-4 0-7-1-7-4s5-2 7 2',
  printer: 'M7 3h10v6H7zM4 9h16v8H4zM7 14h10v7H7z',
  wash: 'M4 2h16v20H4zM12 9a5 5 0 1 0 0 10a5 5 0 1 0 0-10M8 5h.01M11 5h.01',
  dry: 'M4 2h16v20H4zM12 9a5 5 0 1 0 0 10a5 5 0 1 0 0-10M10 12.5c1 .8 3 .8 4 0M10 15.5c1 .8 3 .8 4 0M8 5h.01',
  dish: 'M4 2h16v20H4zM4 7h16M8 4.5h.01M7 11h10M7 15h10M9 11v8M15 11v8',
  vac: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18M12 8a2 2 0 1 0 0 4a2 2 0 1 0 0-4M7 16h10',
  coffee: 'M4 8h12v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM16 10h2a2 2 0 0 1 0 4h-2M8 3v2M12 3v2',
  kettle: 'M6 9h11l-1 11H7zM8 9V7a4 4 0 0 1 8 0v2M17 11l3-1v5l-3 1M10 4h4',
  drop: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z',
  candle: 'M12 3c1 1.5 1.5 2.5 0 4c-1.5-1.5-1-2.5 0-4zM9 9h6v12H9z',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
  up: 'M6 15l6-6 6 6', down: 'M6 9l6 6 6-6', stop: 'M7 7h10v10H7z',
  x: 'M6 6l12 12M18 6 6 18',
  dot: 'M12 10a2 2 0 1 0 0 4a2 2 0 1 0 0-4',
};
const ic = (k, cls = 'i') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${I[k] || I.dot}"/></svg>`;
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const de = (v, d = 1) => Number(v).toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });
const hhmm = (t) => { const d = new Date(t); return isNaN(d) ? '' : d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }); };
const ring = (p, col, w = 5) => { const r = 28, c = 2 * Math.PI * r;
  return `<svg class="ring" viewBox="0 0 62 62" aria-hidden="true"><circle cx="31" cy="31" r="${r}" fill="none" stroke="var(--line)" stroke-width="${w}"/><circle cx="31" cy="31" r="${r}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-dasharray="${(c * Math.max(0, Math.min(100, p)) / 100).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 31 31)"/></svg>`; };

// Kurznamen wie bisher im Reiter Licht
const LN = {
  'light.wohnzimmerlicht': 'Wohnzimmerlicht', 'light.stehlampe': 'Stehlampe', 'light.ecklampe_wohnzimmer': 'Ecklampe',
  'light.esszimmerlicht': 'Esszimmerlicht', 'light.teelichter_esszimmer': 'Teelichter', 'light.kuche_schaltausgang_kuchenlicht': 'Küchenlicht',
  'light.schlafzimmerlicht': 'Schlafzimmerlicht', 'light.nachttischlampe': 'Nachttischlampe', 'light.teelichter_schlafzimmer': 'Teelichter',
  'light.badezimmerlicht': 'Badezimmerlicht', 'light.badezimmerlicht_hintergrundbeleuchtung': 'Bad Ambilight', 'light.schalter_flurlicht': 'Flurlicht',
  'light.ambilight_buro': 'Ambilight Büro', 'light.terrassenlicht': 'Terrassenlicht',
};
const LIGHTS = Object.keys(LN);
const ROOMS = [
  { id: 'wz', n: 'Wohnzimmer', ic: 'sofa', t: 'sensor.wohnzimmerthermostat_temperature', h: 'sensor.wohnzimmerthermostat_humidity', cl: 'climate.wohnzimmer', v: 'sensor.heizkorperthermostat_wohnzimmer_heating', w: 'binary_sensor.wohnzimmerfenster', L: ['light.wohnzimmerlicht', 'light.stehlampe', 'light.ecklampe_wohnzimmer'], kino: 'switch.heimkino' },
  { id: 'ez', n: 'Esszimmer', ic: 'fork', t: 'sensor.heizkorperthermostat_esszimmer_temperature', v: 'sensor.heizkorperthermostat_esszimmer_heating', w: 'binary_sensor.esszimmerfenster', L: ['light.esszimmerlicht', 'light.teelichter_esszimmer'], sel: 'input_select.teelichter_esszimmer_modus' },
  { id: 'ku', n: 'Küche', ic: 'chef', L: ['light.kuche_schaltausgang_kuchenlicht'], dev: [['switch.kaffeemaschine', 'Kaffeemaschine', 'coffee'], ['climate.proficook_pc_wks_1167g_kettle', 'Wasserkocher', 'kettle']] },
  { id: 'sz', n: 'Schlafzimmer', ic: 'bed', t: 'sensor.heizkorperthermostat_schlafzimmer_temperature', h: 'sensor.0x348d13fffe52a975_humidity', cl: 'climate.schlafzimmer', v: 'sensor.heizkorperthermostat_schlafzimmer_heating', w: 'binary_sensor.schlafzimmerfenster', L: ['light.schlafzimmerlicht', 'light.nachttischlampe', 'light.teelichter_schlafzimmer'], sel: 'input_select.teelichter_schlafzimmer_modus', cover: 'cover.rollo_schlafzimmer', fan: 'fan.luftreiniger_schlafzimmer', pm: 'sensor.0x348d13fffe52a975_pm25', kino: 'switch.heimkino_schlafzimmer' },
  { id: 'bz', n: 'Bad', ic: 'shower', t: 'sensor.heizkorperthermostat_badezimmer_temperature', cl: 'climate.badezimmer', v: 'sensor.heizkorperthermostat_badezimmer_heating', w: 'binary_sensor.badezimmerfenster', L: ['light.badezimmerlicht', 'light.badezimmerlicht_hintergrundbeleuchtung'], dev: [['switch.badezimmerlufter', 'Lüfter', 'fan']] },
  { id: 'fl', n: 'Flur', ic: 'coat', L: ['light.schalter_flurlicht'], lock: 'lock.wohnungstur' },
  { id: 'bu', n: 'Büro', ic: 'desk', L: ['light.ambilight_buro'] },
  { id: 'te', n: 'Terrasse', ic: 'deck', L: ['light.terrassenlicht'], w: 'binary_sensor.terrassentur', wn: 'Terrassentür' },
];
const PERSONS = ['person.sauerm', 'person.sarah'];
const NIGHT = 'script.gute_nacht';
const KINO = [['switch.heimkino', 'Kino Wohnzimmer', 'film', 'BenQ · Denon · Fire TV'], ['switch.heimkino_schlafzimmer', 'Kino Schlafzimmer', 'proj', 'XGIMI · Fire TV · Rollo']];
const WASH = [['waschmaschine', 'Waschmaschine', 'wash', '#2f86e0'], ['trockner', 'Trockner', 'dry', '#e08a1f'], ['spulmaschine', 'Spülmaschine', 'dish', '#14a3b8']];
const ALARM = { disarmed: 'unscharf', armed_home: 'intern scharf', armed_away: 'scharf', armed_night: 'Nacht scharf', triggered: 'ausgelöst', arming: 'wird scharf', pending: 'Verzögerung' };

class ZuhauseCard extends HTMLElement {
  setConfig(c) { this._c = c || {}; this._room = null; this._busy = {}; }
  getCardSize() { return 12; }

  set hass(h) {
    this._hass = h;
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.addEventListener('click', (e) => this._click(e));
      this._kd = (e) => { if (e.key === 'Escape' && this._room) { this._room = null; this._render(true); } };
      if (!document.getElementById('wk-fonts')) {
        const l = document.createElement('link');
        l.id = 'wk-fonts'; l.rel = 'stylesheet';
        l.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600&display=swap';
        document.head.appendChild(l);
      }
    }
    const now = Date.now();
    if (!this._t || now - this._t > 1000) { this._t = now; this._render(); }
    else if (!this._pend) this._pend = setTimeout(() => { this._pend = null; this._t = Date.now(); this._render(); }, 1000);
  }
  connectedCallback() { this._iv = setInterval(() => this._render(), 30000); document.addEventListener('keydown', this._kd); }
  disconnectedCallback() { clearInterval(this._iv); document.removeEventListener('keydown', this._kd); }

  _o(id) { return this._hass.states[id]; }
  _s(id) { const o = this._o(id); return o ? o.state : 'unavailable'; }
  _n(id) { const v = parseFloat(this._s(id)); return isFinite(v) ? v : null; }
  _a(id, k) { const o = this._o(id); return o ? o.attributes[k] : undefined; }
  _on(id) { return this._s(id) === 'on'; }
  _svc(d, s, data) { return this._hass.callService(d, s, data); }
  _mi(id) { const ev = new Event('hass-more-info', { bubbles: true, composed: true }); ev.detail = { entityId: id }; this.dispatchEvent(ev); }
  _nav(p) { history.pushState(null, '', p); window.dispatchEvent(new CustomEvent('location-changed', { detail: { replace: false } })); }
  _flash(k, ms = 2500) { this._busy[k] = Date.now() + ms; setTimeout(() => this._render(true), ms + 50); }
  _isBusy(k) { return (this._busy[k] || 0) > Date.now(); }

  _click(e) {
    const t = e.target;
    if (this._room && (t.classList.contains('scrim') || t.closest('[data-close]'))) { this._room = null; this._render(true); return; }
    const el = t.closest('[data-room],[data-rl],[data-act],[data-mi],[data-nav],[data-lt],[data-br],[data-th],[data-sel],[data-cv],[data-tg],[data-lock]');
    if (!el) return;
    const d = el.dataset, h = this._hass;
    if (d.room) { this._room = d.room; this._render(true); return; }
    if (d.mi) { this._mi(d.mi); return; }
    if (d.nav) { this._room = null; this._nav(d.nav); return; }
    if (d.rl) {
      const r = ROOMS.find((x) => x.id === d.rl);
      const on = r.L.filter((l) => this._on(l));
      if (on.length) this._svc('light', 'turn_off', { entity_id: on });
      else this._svc('light', 'turn_on', { entity_id: r.L[0] });
      this._flash('rl' + r.id, 1500); this._render(true); return;
    }
    if (d.lt) { this._svc('light', 'toggle', { entity_id: d.lt }); return; }
    if (d.br) {
      const rect = el.getBoundingClientRect();
      const pct = Math.max(1, Math.min(100, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
      this._svc('light', 'turn_on', { entity_id: d.br, brightness_pct: pct }); return;
    }
    if (d.th) {
      const [id, dir] = d.th.split('|');
      const cur = parseFloat(this._a(id, 'temperature'));
      if (!isFinite(cur)) return;
      const step = parseFloat(this._a(id, 'target_temp_step')) || 0.5;
      this._svc('climate', 'set_temperature', { entity_id: id, temperature: Math.round((cur + (dir === '+' ? step : -step)) * 10) / 10 }); return;
    }
    if (d.sel) { const [id, opt] = d.sel.split('|'); this._svc('input_select', 'select_option', { entity_id: id, option: opt }); return; }
    if (d.cv) { const [id, s] = d.cv.split('|'); this._svc('cover', s, { entity_id: id }); return; }
    if (d.tg) {
      const id = d.tg, dom = id.split('.')[0];
      if (dom === 'climate') this._svc('climate', 'set_hvac_mode', { entity_id: id, hvac_mode: this._s(id) === 'off' ? 'heat' : 'off' });
      else this._svc(dom === 'fan' ? 'fan' : 'homeassistant', 'toggle', { entity_id: id });
      return;
    }
    if (d.lock) {
      if (this._arm !== 'lock') { this._arm = 'lock'; clearTimeout(this._armT); this._armT = setTimeout(() => { this._arm = null; this._render(true); }, 4000); this._render(true); return; }
      this._arm = null; this._svc('lock', 'lock', { entity_id: d.lock }); this._flash('lock', 4000); this._render(true); return;
    }
    if (d.act) {
      const a = d.act;
      if (a === 'alloff') {
        const on = LIGHTS.filter((l) => this._on(l));
        if (on.length) this._svc('light', 'turn_off', { entity_id: on });
        this._flash('alloff', 2000);
      } else if (a === 'night') {
        if (this._arm !== 'night') { this._arm = 'night'; clearTimeout(this._armT); this._armT = setTimeout(() => { this._arm = null; this._render(true); }, 4000); this._render(true); return; }
        this._arm = null; this._svc('script', 'turn_on', { entity_id: NIGHT }); this._flash('night', 6000);
      } else if (a.startsWith('switch.')) {
        this._svc('switch', this._on(a) ? 'turn_off' : 'turn_on', { entity_id: a }); this._flash(a, 8000);
      }
      this._render(true);
    }
  }

  _roomInfo(r) {
    const t = r.t ? this._n(r.t) : null;
    const soll = r.cl ? parseFloat(this._a(r.cl, 'temperature')) : NaN;
    const valve = r.v ? this._n(r.v) : null;
    const win = r.w ? this._on(r.w) : false;
    const winMin = win ? Math.max(0, Math.round((Date.now() - new Date(this._o(r.w).last_changed)) / 60000)) : 0;
    const on = r.L.filter((l) => this._on(l));
    return { t, soll: isFinite(soll) ? soll : null, valve, win, winMin, on, hum: r.h ? this._n(r.h) : null };
  }

  _render(force) {
    const h = this._hass;
    if (!h || !this.shadowRoot) return;
    if (!force && this._room && this.shadowRoot.querySelector('.scrim')) { /* Popup offen: trotzdem aktualisieren */ }
    const dark = !!(h.themes && h.themes.darkMode);
    const info = Object.fromEntries(ROOMS.map((r) => [r.id, this._roomInfo(r)]));
    const lightsOn = LIGHTS.filter((l) => this._on(l));
    const winOpen = ROOMS.filter((r) => info[r.id].win);
    const temps = ROOMS.filter((r) => r.t && r.id !== 'te').map((r) => info[r.id].t).filter((v) => v != null);
    const avg = temps.length ? temps.reduce((a, b) => a + b, 0) / temps.length : null;

    // Statuszeile
    const P = PERSONS.map((id) => ({ n: (this._a(id, 'friendly_name') || id).split(' ')[0], home: this._s(id) === 'home' }));
    const home = P.filter((p) => p.home);
    const ppl = home.length === P.length ? `<b>${esc(P[0].n)}</b> und <b>${esc(P[1].n)}</b> da` : home.length ? `<b>${esc(home[0].n)}</b> da` : 'niemand da';
    const wt = this._s('lock.wohnungstur'), ht = this._s('lock.haustur'), al = this._s('alarm_control_panel.hmip_alarm_control_panel');
    const pills = [
      `<button class="pill ${home.length ? 'ok' : ''}" data-mi="${PERSONS[0]}">${ic('people')}<span>${ppl}</span></button>`,
      wt === 'locked' ? `<button class="pill ok" data-mi="lock.wohnungstur">${ic('lock')}Wohnungstür zu</button>`
        : `<button class="pill ${wt === 'open' ? 'crit' : 'warn'}" data-lock="lock.wohnungstur">${ic('unlock')}${this._arm === 'lock' ? '<b>Nochmal tippen: abschließen</b>' : this._isBusy('lock') ? 'schließt ab …' : `Wohnungstür <b>${wt === 'open' ? 'offen' : 'nicht abgeschlossen'}</b>`}</button>`,
      `<button class="pill ${ht === 'locked' ? 'ok' : 'warn'}" data-mi="lock.haustur">${ic(ht === 'locked' ? 'lock' : 'unlock')}Haustür ${ht === 'locked' ? 'zu' : '<b>offen</b>'}</button>`,
      winOpen.length ? `<button class="pill crit" data-room="${winOpen[0].id}">${ic('window')}<b>${winOpen.length === 1 ? (winOpen[0].wn || winOpen[0].n + 'fenster') + ' offen' : winOpen.length + ' Fenster offen'}</b></button>` : `<span class="pill ok">${ic('window')}Fenster zu</span>`,
      `<button class="pill ${al === 'triggered' ? 'crit' : ''}" data-mi="alarm_control_panel.hmip_alarm_control_panel">${ic('shield')}Alarm ${ALARM[al] || al}</button>`,
      avg != null ? `<span class="pill">${ic('thermo')}Innen <b>${de(avg)} °C</b></span>` : '',
      lightsOn.length ? `<button class="pill lamp" data-act="alloff">${ic('light')}<b>${lightsOn.length} ${lightsOn.length === 1 ? 'Licht' : 'Lichter'} an</b></button>` : `<span class="pill">${ic('light')}Alle Lichter aus</span>`,
    ];

    // Aktionen
    const nightTxt = this._arm === 'night' ? 'Nochmal tippen zum Starten' : this._isBusy('night') || this._on(NIGHT) ? 'läuft …' : 'Licht und Kino aus, Wohnungstür zu';
    const kinoAct = KINO.map(([id, n, i, sub]) => {
      const on = this._on(id), busy = this._isBusy(id);
      return `<button class="act state ${on ? 'on' : ''} ${busy ? 'busy' : ''}" data-act="${id}">${ic(i)}<b>${n}</b><small>${busy ? (on ? 'startet …' : 'schaltet aus …') : on ? 'läuft · tippen zum Ausschalten' : sub}</small><span class="sw"></span></button>`;
    }).join('');
    const acts = `
      <button class="act ${this._isBusy('alloff') ? 'busy' : ''}" data-act="alloff">${ic('light')}<b>Alle Lichter aus</b><small>${this._isBusy('alloff') ? 'schaltet aus …' : lightsOn.length ? `${lightsOn.length} von ${LIGHTS.length} an` : 'alles dunkel'}</small></button>
      <button class="act ${this._arm === 'night' ? 'arm' : ''} ${this._isBusy('night') ? 'busy' : ''}" data-act="night">${ic('moon')}<b>Gute Nacht</b><small>${nightTxt}</small></button>
      ${kinoAct}`;

    // Räume
    const tiles = ROOMS.map((r) => {
      const x = info[r.id];
      let ex;
      if (x.win) ex = `<div class="x crit">${ic('window')}${r.wn || 'Fenster'} offen · ${x.winMin} min</div>`;
      else if (r.kino && this._on(r.kino)) ex = `<div class="x acc">${ic('film')}Kino läuft</div>`;
      else if (r.fan && this._on(r.fan)) ex = `<div class="x acc">${ic('fan')}Luftreiniger an</div>`;
      else if (x.t != null && x.soll != null && x.valve != null && x.valve >= 30 && x.t < x.soll) ex = `<div class="x heat">${ic('flame')}heizt auf ${de(x.soll)} °C</div>`;
      else if (r.cover && this._s(r.cover) === 'closed') ex = `<div class="x">${ic('blind')}Rollo zu</div>`;
      else if (r.dev && r.dev.some(([id]) => this._s(id) === 'on' || this._s(id) === 'heat')) { const dv = r.dev.find(([id]) => this._s(id) === 'on' || this._s(id) === 'heat'); ex = `<div class="x acc">${ic(dv[2])}${dv[1]} an</div>`; }
      else ex = `<div class="x">${x.soll != null ? `Soll ${de(x.soll)} °C` : `${r.L.length} ${r.L.length > 1 ? 'Leuchten' : 'Leuchte'}`}</div>`;
      const t = x.t != null ? `<div class="t">${de(x.t)} °C${x.hum != null ? `<small>${Math.round(x.hum)} %</small>` : ''}</div>` : `<div class="t none">–</div>`;
      const n = x.on.length, busy = this._isBusy('rl' + r.id);
      return `<div class="room"><button class="open" data-room="${r.id}" aria-label="${r.n} öffnen"><span class="nm">${ic(r.ic)}<span>${r.n}</span></span>${t}${ex}</button>
        <button class="lbtn ${n ? 'on' : ''} ${busy ? 'busy' : ''}" data-rl="${r.id}" aria-label="Licht ${r.n} ${n ? 'aus' : 'an'}">${ic('light')}${n ? n + ' an' : 'aus'}</button></div>`;
    }).join('');

    // Läuft gerade
    const runs = [];
    if (this._s('sensor.prusa_xl') === 'printing') {
      const p = this._n('sensor.prusa_xl_fortschritt') || 0, end = hhmm(this._s('sensor.prusa_xl_druck_fertig'));
      runs.push(`<button class="run" data-nav="/dashboard-fabrication"><span class="mini" style="color:var(--accent)">${ring(p, 'var(--accent)')}${ic('printer')}</span><span>Prusa XL <b>${Math.round(p)} %</b><small>${end ? 'fertig ca. ' + end : 'druckt'}</small></span></button>`);
    }
    WASH.forEach(([k, n, i, c]) => {
      const st = this._s(`sensor.${k}_zustand`);
      if (this._on(`binary_sensor.${k}_lauft`) || ['running', 'starting', 'ending', 'paused', 'user_paused', 'delay_wait'].includes(st)) {
        const p = this._n(`sensor.${k}_fortschritt`), rem = this._n(`sensor.${k}_verbleibende_zeit`);
        runs.push(`<button class="run" data-nav="/dashboard-haushalt/uebersicht"><span class="mini" style="color:${c}">${p ? ring(p, c) : ''}${ic(i)}</span><span>${n}<small>${rem != null ? 'noch ' + Math.round(rem) + ' min' : 'läuft'}</small></span></button>`);
      } else if (['finished', 'anti_wrinkle', 'clean'].includes(st)) {
        runs.push(`<button class="run" data-nav="/dashboard-haushalt/uebersicht"><span class="mini" style="color:var(--good)">${ic(i)}</span><span>${n} <b style="color:var(--good)">fertig</b><small>seit ${hhmm(this._o(`sensor.${k}_zustand`).last_changed)}</small></span></button>`);
      }
    });
    const vs = this._s('vacuum.p50_pro_ultra');
    if (['cleaning', 'returning', 'paused'].includes(vs)) {
      const p = this._a('vacuum.p50_pro_ultra', 'cleaning_progress') || 0;
      runs.push(`<button class="run" data-nav="/dashboard-haushalt/saugroboter"><span class="mini" style="color:var(--vac)">${p ? ring(p, 'var(--vac)') : ''}${ic('vac')}</span><span>Mova<small>${vs === 'returning' ? 'fährt zurück' : vs === 'paused' ? 'pausiert' : 'saugt'}${p ? ' · ' + p + ' %' : ''}</small></span></button>`);
    }
    KINO.forEach(([id, n, i]) => { if (this._on(id)) runs.push(`<button class="run" data-nav="/dashboard-beleuctung/media-control"><span class="mini" style="color:var(--accent)">${ic(i)}</span><span>${n}<small>läuft</small></span></button>`); });
    if (this._on('fan.luftreiniger_schlafzimmer')) runs.push(`<button class="run" data-room="sz"><span class="mini" style="color:var(--air)">${ic('fan')}</span><span>Luftreiniger<small>Schlafzimmer · ${this._a('fan.luftreiniger_schlafzimmer', 'percentage') || 0} %</small></span></button>`);
    if (this._on('switch.kaffeemaschine')) runs.push(`<button class="run" data-room="ku"><span class="mini" style="color:var(--brew)">${ic('coffee')}</span><span>Kaffeemaschine<small>an · ${Math.round(this._n('sensor.kaffeemaschine_leistung') || 0)} W</small></span></button>`);
    if (this._s('climate.proficook_pc_wks_1167g_kettle') === 'heat') runs.push(`<button class="run" data-room="ku"><span class="mini" style="color:var(--kettle)">${ic('kettle')}</span><span>Wasserkocher<small>${Math.round(this._a('climate.proficook_pc_wks_1167g_kettle', 'current_temperature') || 0)} von ${this._a('climate.proficook_pc_wks_1167g_kettle', 'temperature')} °C</small></span></button>`);

    const body = `
      <div class="card s12"><div class="statusbar">${pills.join('')}</div></div>
      <div class="card s12"><div class="ch"><h3>Aktionen</h3><span class="sub">Knopf = einmal ausführen · Schalter = an/aus</span></div><div class="acts">${acts}</div></div>
      <div class="sec"><h3>Räume</h3><span class="sub">Raum antippen öffnet Details · rechts Licht schalten</span></div>
      <div class="rooms">${tiles}</div>
      ${runs.length ? `<div class="card s12"><div class="ch"><h3>Läuft gerade</h3></div><div class="running">${runs.join('')}</div></div>` : ''}`;

    // Popup merken: Scrollposition im Sheet erhalten
    const oldSheet = this.shadowRoot.querySelector('.sheet');
    const sc = oldSheet ? oldSheet.scrollTop : 0;
    this.shadowRoot.innerHTML = `<style>${this._css(dark)}</style><div class="view">${body}</div>${this._room ? this._sheet(this._room, info) : ''}`;
    const ns = this.shadowRoot.querySelector('.sheet');
    if (ns && sc) ns.scrollTop = sc;
  }

  _sheet(id, info) {
    const r = ROOMS.find((x) => x.id === id), x = info[id];
    const th = r.cl && x.soll != null ? `<div class="thermo"><button class="tbtn" data-th="${r.cl}|-" aria-label="kälter">−</button><div class="mid" data-mi="${r.cl}"><b>${de(x.soll)} °C</b><small>Ist ${x.t != null ? de(x.t) + ' °C' : '–'}${x.valve != null ? ' · Ventil ' + Math.round(x.valve) + ' %' : ''}${x.hum != null ? ' · ' + Math.round(x.hum) + ' % Feuchte' : ''}</small></div><button class="tbtn" data-th="${r.cl}|+" aria-label="wärmer">+</button></div>`
      : x.t != null ? `<div class="thermo one"><div class="mid"><b>${de(x.t)} °C</b><small>${x.valve != null ? 'Ventil ' + Math.round(x.valve) + ' % · ' : ''}kein Thermostat-Sollwert</small></div></div>` : '';
    const lights = r.L.map((l) => {
      const on = this._on(l), br = on ? Math.round(((this._a(l, 'brightness') || 255) / 255) * 100) : 0;
      const dim = (this._a(l, 'supported_color_modes') || []).some((m) => m !== 'onoff');
      return `<div class="lrow ${on ? 'on' : ''}"><button class="lic" data-mi="${l}" aria-label="${LN[l]} Einstellungen">${ic(l.includes('teelicht') ? 'candle' : 'light')}</button><button class="lname" data-lt="${l}">${LN[l]}<small>${this._s(l) === 'unavailable' ? 'nicht erreichbar' : on ? (dim ? br + ' %' : 'an') : 'aus'}</small></button><button class="tog ${on ? 'on' : ''}" data-lt="${l}" aria-label="${LN[l]} schalten"></button>${dim ? `<button class="bar" data-br="${l}" aria-label="${LN[l]} Helligkeit"><i style="width:${br}%"></i></button>` : ''}</div>`;
    }).join('');
    const extra = [];
    if (r.sel) {
      const opts = this._a(r.sel, 'options') || [], cur = this._s(r.sel);
      extra.push(`<div class="blk"><div class="lbl">${ic('candle')}Teelichter-Modus</div><div class="chips">${opts.map((o) => `<button class="chip ${o === cur ? 'on' : ''}" data-sel="${r.sel}|${esc(o)}">${esc(o)}</button>`).join('')}</div></div>`);
    }
    if (r.cover) {
      const cs = this._s(r.cover), pos = this._a(r.cover, 'current_position');
      extra.push(`<div class="blk"><div class="lbl">${ic('blind')}Rollo <small>${cs === 'closed' ? 'zu' : cs === 'open' ? 'offen' : cs === 'opening' ? 'fährt hoch' : cs === 'closing' ? 'fährt runter' : cs}${pos != null && cs === 'open' ? ' · ' + pos + ' %' : ''}</small></div><div class="chips"><button class="chip" data-cv="${r.cover}|open_cover">${ic('up')}Hoch</button><button class="chip" data-cv="${r.cover}|stop_cover">${ic('stop')}Stopp</button><button class="chip" data-cv="${r.cover}|close_cover">${ic('down')}Runter</button></div></div>`);
    }
    if (r.fan) {
      const on = this._on(r.fan), pm = this._n(r.pm), filt = this._on('binary_sensor.luftreiniger_schlafzimmer_replace_filter');
      extra.push(`<div class="drow ${on ? 'on' : ''}" style="--c:var(--air)">${ic('fan')}<button class="lname" data-mi="${r.fan}">Luftreiniger<small>${on ? (this._a(r.fan, 'preset_mode') === 'auto' ? 'Auto' : (this._a(r.fan, 'percentage') || 0) + ' %') : 'aus'}${pm != null ? ' · PM2,5 ' + Math.round(pm) : ''}${filt ? ' · Filter wechseln' : ''}</small></button><button class="tog ${on ? 'on' : ''}" data-tg="${r.fan}" aria-label="Luftreiniger schalten"></button></div>`);
    }
    (r.dev || []).forEach(([did, n, i]) => {
      const st = this._s(did), on = st === 'on' || st === 'heat';
      let sub = on ? 'an' : 'aus';
      if (did.startsWith('climate.')) sub = on ? `${Math.round(this._a(did, 'current_temperature') || 0)} von ${this._a(did, 'temperature')} °C` : `aus · ${Math.round(this._a(did, 'current_temperature') || 0)} °C`;
      if (did === 'switch.kaffeemaschine' && on) sub = `an · ${Math.round(this._n('sensor.kaffeemaschine_leistung') || 0)} W`;
      if (st === 'unavailable') sub = 'nicht erreichbar';
      extra.push(`<div class="drow ${on ? 'on' : ''}">${ic(i)}<button class="lname" data-mi="${did}">${n}<small>${sub}</small></button><button class="tog ${on ? 'on' : ''}" data-tg="${did}" aria-label="${n} schalten"></button></div>`);
    });
    if (r.kino) {
      const on = this._on(r.kino);
      extra.push(`<div class="drow ${on ? 'on' : ''}">${ic(r.id === 'wz' ? 'film' : 'proj')}<button class="lname" data-nav="/dashboard-beleuctung/media-control">Heimkino<small>${on ? 'läuft · Medien öffnen' : 'aus · Medien öffnen'}</small></button><button class="tog ${on ? 'on' : ''}" data-tg="${r.kino}" aria-label="Heimkino schalten"></button></div>`);
    }
    if (r.lock) {
      const ls = this._s(r.lock);
      extra.push(`<div class="drow">${ic(ls === 'locked' ? 'lock' : 'unlock')}<button class="lname" data-mi="${r.lock}">Wohnungstür<small>${ls === 'locked' ? 'abgeschlossen' : ls === 'open' ? 'offen' : 'nicht abgeschlossen'}</small></button>${ls !== 'locked' ? `<button class="go" data-lock="${r.lock}">${this._arm === 'lock' ? 'Nochmal tippen' : 'Abschließen'}</button>` : ''}</div>`);
    }
    const kv = r.w ? `<span class="pill ${x.win ? 'crit' : 'ok'}">${ic('window')}${r.wn || 'Fenster'} ${x.win ? 'offen seit ' + x.winMin + ' min' : 'zu'}</span>` : '';
    return `<div class="scrim"><div class="sheet" role="dialog" aria-label="${r.n}"><header>${ic(r.ic)}<h3>${r.n}</h3><button class="x" data-close aria-label="Schließen">${ic('x')}</button></header>
      ${th}<div class="lights">${lights}</div>${extra.join('')}${kv ? `<div class="kv">${kv}</div>` : ''}</div></div>`;
  }

  _css(dark) {
    const p = dark
      ? { accent: '#4a9be8', accentSoft: '#1b2c3e', good: '#3fbf85', goodSoft: '#15291f', warn: '#e2a93b', warnSoft: '#2e2412', crit: '#ec6a5f', critSoft: '#331a18', lamp: '#f2b632', lampSoft: '#33280f', heat: '#f07a45', vac: '#33c09f', air: '#8aa2f2', brew: '#c48a63', kettle: '#f06a4c' }
      : { accent: '#1f78d1', accentSoft: '#e3effb', good: '#1a9c62', goodSoft: '#e2f4eb', warn: '#b97700', warnSoft: '#fbf0d9', crit: '#c8382e', critSoft: '#fbe6e4', lamp: '#e9a516', lampSoft: '#fdf1d4', heat: '#e0612a', vac: '#16a085', air: '#5f7ee0', brew: '#8b5a3c', kettle: '#d1492e' };
    return `
:host{display:block;container-type:inline-size;--card:var(--ha-card-background,var(--card-background-color,#fff));--ink:var(--primary-text-color);--ink2:var(--secondary-text-color);--muted:var(--secondary-text-color);--line:var(--divider-color,rgba(127,127,127,.25));--sunk:rgba(127,127,127,.09);
  --accent:${p.accent};--accent-soft:${p.accentSoft};--good:${p.good};--good-soft:${p.goodSoft};--warn:${p.warn};--warn-soft:${p.warnSoft};--crit:${p.crit};--crit-soft:${p.critSoft};--lamp:${p.lamp};--lamp-soft:${p.lampSoft};--heat:${p.heat};--vac:${p.vac};--air:${p.air};--brew:${p.brew};--kettle:${p.kettle};
  --fd:"Space Grotesk",var(--ha-font-family-body,system-ui),sans-serif;--fb:"Inter",var(--ha-font-family-body,system-ui),sans-serif}
*{box-sizing:border-box}
button{font:inherit;color:inherit;appearance:none;-webkit-tap-highlight-color:transparent}
button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
h3{font-family:var(--fd);font-weight:600;margin:0}
svg.i{width:18px;height:18px;flex:none;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
.view{max-width:1400px;margin:0 auto;padding:20px 24px;display:grid;gap:14px;grid-template-columns:repeat(12,minmax(0,1fr));align-content:start;font-family:var(--fb);font-size:14px;line-height:1.5;color:var(--ink)}
.s12{grid-column:1/-1}
.card{background:var(--card);border:1px solid var(--line);border-radius:var(--ha-card-border-radius,14px);padding:14px 16px;display:grid;gap:10px;align-content:start;min-width:0}
.ch{display:flex;align-items:baseline;justify-content:space-between;gap:10px;flex-wrap:wrap}
.ch h3{font-size:14.5px}
.sub{font-size:12px;color:var(--muted)}
.sec{grid-column:1/-1;display:flex;align-items:baseline;gap:10px;padding:6px 2px 0;flex-wrap:wrap}
.sec h3{font-size:15px}
.statusbar{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.pill{display:inline-flex;align-items:center;gap:7px;padding:6px 11px;border-radius:999px;background:var(--sunk);font-size:13px;color:var(--ink2);white-space:nowrap;border:0}
button.pill{cursor:pointer}
.pill b{color:var(--ink);font-weight:600}
.pill.ok svg{color:var(--good)}
.pill.warn{background:var(--warn-soft);color:var(--warn)}.pill.warn b{color:var(--warn)}
.pill.crit{background:var(--crit-soft);color:var(--crit)}.pill.crit b{color:var(--crit)}
.pill.lamp{background:var(--lamp-soft)}.pill.lamp svg{color:var(--lamp)}
.acts{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
.act{border:1px solid var(--line);background:var(--sunk);border-radius:12px;padding:11px 12px;display:grid;grid-template-columns:auto 1fr;gap:2px 10px;align-items:center;text-align:left;cursor:pointer;min-height:58px}
.act svg{grid-row:span 2;color:var(--accent)}
.act b{font-size:13px;font-weight:600}
.act small{font-size:11.5px;color:var(--muted);line-height:1.3}
.act.busy small{color:var(--accent)}
.act.arm{border-color:var(--warn);background:var(--warn-soft)}.act.arm small{color:var(--warn);font-weight:600}
.act.state{background:var(--card);grid-template-columns:auto 1fr auto}
.act.state svg{color:var(--ink2)}
.act.state .sw{grid-row:span 2;grid-column:3;grid-row-start:1;width:34px;height:20px;border-radius:999px;background:var(--line);position:relative;justify-self:end}
.act.state .sw::after{content:"";position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:var(--card);transition:left .15s}
.act.state.on{border-color:var(--accent);background:var(--accent-soft)}
.act.state.on svg{color:var(--accent)}
.act.state.on .sw{background:var(--accent)}.act.state.on .sw::after{left:16px}
.rooms{grid-column:1/-1;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
.room{background:var(--card);border:1px solid var(--line);border-radius:var(--ha-card-border-radius,14px);display:grid;grid-template-columns:1fr auto;align-items:stretch;min-width:0;overflow:hidden}
.room .open{border:0;background:none;text-align:left;padding:11px 4px 11px 12px;cursor:pointer;display:grid;gap:3px;min-width:0}
.room .nm{display:flex;align-items:center;gap:7px;font-weight:600;font-size:13.5px;min-width:0}
.room .nm span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.room .nm svg{color:var(--muted);width:16px;height:16px}
.room .t{font-family:var(--fd);font-size:19px;font-weight:600;font-variant-numeric:tabular-nums;line-height:1.2}
.room .t.none{color:var(--muted);font-size:15px}
.room .t small{font-family:var(--fb);font-size:11.5px;font-weight:500;color:var(--muted);margin-left:5px}
.room .x{font-size:11.5px;color:var(--muted);display:flex;align-items:center;gap:5px;min-height:17px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.room .x svg{width:14px;height:14px}
.room .x.heat{color:var(--heat)}.room .x.crit{color:var(--crit);font-weight:600}.room .x.acc{color:var(--accent)}
.lbtn{border:0;border-left:1px solid var(--line);background:var(--sunk);width:56px;display:grid;place-items:center;align-content:center;gap:2px;cursor:pointer;color:var(--muted);font-size:10.5px;font-weight:600}
.lbtn.on{background:var(--lamp-soft);color:var(--lamp)}
.lbtn.on svg{filter:drop-shadow(0 0 6px var(--lamp))}
.lbtn.busy{opacity:.6}
.running{display:flex;flex-wrap:wrap;gap:8px}
.run{display:inline-flex;align-items:center;gap:9px;padding:7px 12px 7px 8px;border-radius:12px;background:var(--sunk);font-size:13px;border:0;cursor:pointer;text-align:left}
.run small{display:block;color:var(--muted);font-size:12px}
.mini{position:relative;width:30px;height:30px;display:grid;place-items:center;flex:none}
.mini svg.ring{position:absolute;inset:0;width:30px;height:30px}
.mini svg.i{width:15px;height:15px}
.scrim{position:fixed;inset:0;background:rgba(10,12,15,.45);display:grid;place-items:center;z-index:9;padding:16px;font-family:var(--fb);font-size:14px;line-height:1.5;color:var(--ink)}
.sheet{background:var(--card);border-radius:18px;width:100%;max-width:460px;padding:16px;display:grid;gap:12px;box-shadow:0 18px 50px rgba(0,0,0,.3);max-height:calc(100vh - 32px);overflow:auto}
.sheet header{display:flex;align-items:center;gap:10px}
.sheet header h3{font-size:17px}
.sheet header .x{margin-left:auto;border:0;background:var(--sunk);width:34px;height:34px;border-radius:50%;cursor:pointer;display:grid;place-items:center}
.thermo{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:12px;background:var(--sunk);border-radius:12px;padding:10px 12px}
.thermo.one{grid-template-columns:1fr}
.tbtn{width:46px;height:46px;border-radius:12px;border:1px solid var(--line);background:var(--card);display:grid;place-items:center;font-size:22px;cursor:pointer}
.thermo .mid{text-align:center;cursor:pointer}
.thermo .mid b{font-family:var(--fd);font-size:24px}
.thermo .mid small{display:block;color:var(--muted);font-size:12px}
.lights{display:grid}
.lrow,.drow{display:grid;grid-template-columns:auto 1fr auto;gap:4px 10px;align-items:center;padding:7px 0;border-top:1px solid var(--line)}
.lights .lrow:first-child{border-top:0}
.lic{border:0;background:var(--sunk);width:36px;height:36px;border-radius:10px;display:grid;place-items:center;cursor:pointer;color:var(--muted)}
.lrow.on .lic{background:var(--lamp-soft);color:var(--lamp)}
.drow>svg{width:36px;color:var(--muted)}
.drow.on>svg{color:var(--accent)}
.lname{border:0;background:none;text-align:left;cursor:pointer;padding:0;font-size:13.5px;font-weight:500;min-width:0}
.lname small{display:block;color:var(--muted);font-size:11.5px;font-weight:400}
.tog{width:42px;height:24px;border-radius:999px;background:var(--line);position:relative;flex:none;border:0;cursor:pointer}
.tog::after{content:"";position:absolute;top:2px;left:2px;width:20px;height:20px;border-radius:50%;background:var(--card);transition:left .15s}
.tog.on{background:var(--lamp)}.tog.on::after{left:20px}
.drow .tog.on{background:var(--accent)}
.bar{grid-column:2/-1;height:10px;border-radius:999px;background:var(--sunk);overflow:hidden;border:0;padding:0;cursor:pointer;margin-bottom:2px}
.bar i{display:block;height:100%;background:var(--lamp);border-radius:999px}
.blk{display:grid;gap:6px;padding-top:8px;border-top:1px solid var(--line)}
.lbl{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:500}
.lbl svg{color:var(--muted)}
.lbl small{color:var(--muted);font-weight:400}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chip{display:inline-flex;align-items:center;gap:5px;border:1px solid var(--line);background:none;border-radius:999px;padding:5px 11px;font-size:12.5px;cursor:pointer}
.chip svg{width:15px;height:15px}
.chip.on{background:var(--accent-soft);border-color:var(--accent);color:var(--accent);font-weight:600}
.go{border:1px solid var(--line);background:none;color:var(--ink2);font-size:12.5px;font-weight:500;padding:6px 11px;border-radius:8px;cursor:pointer;white-space:nowrap}
.kv{display:flex;flex-wrap:wrap;gap:6px}
@container (max-width:900px){.rooms{grid-template-columns:repeat(2,minmax(0,1fr))}}
@container (max-width:620px){.view{padding:12px;gap:12px}.acts{grid-template-columns:repeat(2,minmax(0,1fr))}.rooms{gap:8px}.lbtn{width:50px}.sec .sub{display:none}}
`;
  }
}
customElements.define('zuhause-card', ZuhauseCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: 'zuhause-card', name: 'Zuhause Übersicht', description: 'Räume, Aktionen und Status für das Dashboard Zuhause' });
