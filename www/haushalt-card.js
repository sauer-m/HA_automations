// haushalt-card: Reiter "Übersicht" im Dashboard Haushalt (dashboard-haushalt), nach Mockup
// claude.ai/artifact/PjTdVWtvjrdK1hwRLiAfTP (24.11.2026). Quelle: Smarthome/ha/haushalt-card.js
const I = {
  wash: 'M4 2h16v20H4zM12 9a5 5 0 1 0 0 10a5 5 0 1 0 0-10M8 5h.01M11 5h.01',
  dry: 'M4 2h16v20H4zM12 9a5 5 0 1 0 0 10a5 5 0 1 0 0-10M10 12.5c1 .8 3 .8 4 0M10 15.5c1 .8 3 .8 4 0M8 5h.01',
  dish: 'M4 2h16v20H4zM4 7h16M8 4.5h.01M7 11h10M7 15h10M9 11v8M15 11v8',
  vac: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18M12 8a2 2 0 1 0 0 4a2 2 0 1 0 0-4M7 16h10',
  coffee: 'M4 8h12v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM16 10h2a2 2 0 0 1 0 4h-2M8 3v2M12 3v2',
  kettle: 'M6 9h11l-1 11H7zM8 9V7a4 4 0 0 1 8 0v2M17 11l3-1v5l-3 1M10 4h4',
  fan: 'M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0M12 10c0-4 1-7 4-7s2 5-2 7M14 12c4 0 7 1 7 4s-5 2-7-2M12 14c0 4-1 7-4 7s-2-5 2-7M10 12c-4 0-7-1-7-4s5-2 7 2',
  mow: 'M3 17h18M5 17l2-7h9l3 7M9 10V6h5M7 20a2 2 0 1 0 0-.01M17 20a2 2 0 1 0 0-.01',
  cart: 'M3 4h2l2.5 11h11L21 7H6.5M9 20h.01M18 20h.01',
  check: 'M5 12.5l4.5 4.5L19 7', wrench: 'M14.5 6.5a4 4 0 0 0 5 5L11 20a2.1 2.1 0 0 1-3-3z',
  alert: 'M12 3 2 20h20zM12 10v4M12 17h.01', bolt: 'M13 2 4 14h7l-1 8 9-12h-7z', list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  home: 'M3 10.5 12 3l9 7.5V21H3z', play: 'M7 4l13 8-13 8z', battery: 'M3 7h15v10H3zM21 10v4M6 10v4',
  x: 'M6 6l12 12M18 6 6 18', dot: 'M12 10a2 2 0 1 0 0 4a2 2 0 1 0 0-4',
};
const ic = (k, cls = 'i') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${I[k] || I.dot}"/></svg>`;
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const de = (v, d = 2) => Number(v).toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });
const hhmm = (t) => { const d = new Date(t); return isNaN(d) ? '' : d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }); };
const TAGK = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
const dday = (t) => { const d = new Date(t); return isNaN(d) ? '' : `${TAGK[d.getDay()]} ${d.getDate()}.${d.getMonth() + 1}.`; };
const ring = (p, w = 3) => { const r = 28, c = 2 * Math.PI * r;
  return `<svg class="ring" viewBox="0 0 62 62" aria-hidden="true"><circle cx="31" cy="31" r="${r}" fill="none" stroke="var(--line)" stroke-width="${w}"/><circle cx="31" cy="31" r="${r}" fill="none" stroke="var(--c)" stroke-width="${w}" stroke-linecap="round" stroke-dasharray="${(c * Math.max(0, Math.min(100, p)) / 100).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 31 31)"/></svg>`; };

const TODO = 'todo.haushalt';
const LISTS = [['todo.einkaufsliste_2', 'Einkaufsliste'], ['todo.hl', 'HL'], ['todo.rossmann', 'Rossmann'], ['todo.mealprep', 'Mealprep'], ['todo.baumarkt', 'Baumarkt']];
const RUN = ['running', 'starting', 'ending', 'paused', 'user_paused', 'delay_wait'];
const FANM = { auto: 'Auto', medium: 'Mittel', fast: 'Schnell', sleep: 'Schlaf', turbo: 'Turbo' };
const DONE =['finished', 'anti_wrinkle', 'clean'];
const ERR = ['interrupted', 'force_stopped'];
const MOW_ERR = { upside_down: 'umgedreht', lifted: 'angehoben', trapped: 'festgefahren', outside_wire: 'außerhalb des Begrenzungsdrahts', wire_missing: 'Begrenzungsdraht fehlt', battery_low: 'Akku leer', rain_delay: 'Regenverzögerung', close_door_to_mow: 'Klappe schließen', close_door_to_go_home: 'Klappe schließen', blade_motor_blocked: 'Messermotor blockiert', wheel_motor_blocked: 'Radmotor blockiert', locked: 'gesperrt' };
// Geräte: key, Name, Icon, Farbe (hell, dunkel), Maintenance-Präfix, Stichworte für Haushaltsaufgaben
const DEVS = [
  { k: 'waschmaschine', h: 'hwr_waschmaschine', n: 'Waschmaschine', ic: 'wash', c: ['#2f86e0', '#58a2ee'], kw: /waschmaschine|60-grad/i, wd: true },
  { k: 'trockner', h: 'hwr_trockner', n: 'Trockner', ic: 'dry', c: ['#e08a1f', '#f0a040'], kw: /trockner/i, wd: true },
  { k: 'spulmaschine', h: 'kuche_spulmaschine', n: 'Spülmaschine', ic: 'dish', c: ['#14a3b8', '#33bfd3'], kw: /spülmaschine|geschirrspüler/i, wd: true },
  { k: 'mova', h: 'flur_p50_pro_ultra', n: 'Mova', ic: 'vac', c: ['#16a085', '#33c09f'], kw: /mova|saugroboter/i, e: 'vacuum.p50_pro_ultra' },
  { k: 'kaffee', n: 'Kaffee', ic: 'coffee', c: ['#8b5a3c', '#c48a63'], kw: /kaffee|kapsel|siebträger|espresso/i, e: 'switch.kaffeemaschine' },
  { k: 'kocher', n: 'Wasserkocher', ic: 'kettle', c: ['#d1492e', '#f06a4c'], kw: /wasserkocher/i, e: 'climate.proficook_pc_wks_1167g_kettle' },
  { k: 'luftwz', n: 'Luft WZ', ic: 'fan', c: ['#5f7ee0', '#8aa2f2'], kw: /luftreiniger wohnzimmer|philips/i, e: 'fan.ac1715_cloud_luftreiniger', pm: 'sensor.ac1715_cloud_pm2_5', loc: 'Wohnzimmer' },
  { k: 'luft', n: 'Luft SZ', ic: 'fan', c: ['#5f7ee0', '#8aa2f2'], kw: /luftreiniger schlafzimmer|starkvind/i, e: 'fan.luftreiniger_schlafzimmer', pm: 'sensor.0x348d13fffe52a975_pm25', loc: 'Schlafzimmer' },
  { k: 'mower', n: 'Landroid', ic: 'mow', c: ['#4c9a2a', '#79c255'], kw: /landroid|mähroboter|rasenmäher/i, e: 'lawn_mower.m500p' },
];

class HaushaltCard extends HTMLElement {
  setConfig(c) { this._c = c || {}; this._dev = null; this._items = []; this._done = {}; this._busy = {}; }
  getCardSize() { return 12; }

  set hass(h) {
    const prev = this._hass;
    this._hass = h;
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.addEventListener('click', (e) => this._click(e));
      this._kd = (e) => { if (e.key === 'Escape' && this._dev) { this._dev = null; this._render(); } };
      document.addEventListener('keydown', this._kd);
      if (!document.getElementById('wk-fonts')) {
        const l = document.createElement('link');
        l.id = 'wk-fonts'; l.rel = 'stylesheet';
        l.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600&display=swap';
        document.head.appendChild(l);
      }
    }
    // Aufgaben neu laden, wenn sich die Liste geändert hat
    const o = h.states[TODO];
    if (!prev || !this._loaded || (o && prev.states[TODO] !== o)) this._load();
    const now = Date.now();
    if (!this._t || now - this._t > 1000) { this._t = now; this._render(); }
    else if (!this._pend) this._pend = setTimeout(() => { this._pend = null; this._t = Date.now(); this._render(); }, 1000);
  }
  connectedCallback() { this._iv = setInterval(() => this._render(), 30000); if (this._kd) document.addEventListener('keydown', this._kd); }
  disconnectedCallback() { clearInterval(this._iv); document.removeEventListener('keydown', this._kd); }

  async _load() {
    this._loaded = true;
    try {
      const r = await this._hass.callWS({ type: 'todo/item/list', entity_id: TODO });
      this._items = (r.items || []).filter((i) => i.status === 'needs_action');
    } catch (e) { this._items = []; }
    this._render();
  }

  _o(id) { return this._hass.states[id]; }
  _s(id) { const o = this._o(id); return o ? o.state : 'unavailable'; }
  _n(id) { const v = parseFloat(this._s(id)); return isFinite(v) ? v : null; }
  _a(id, k) { const o = this._o(id); return o ? o.attributes[k] : undefined; }
  _on(id) { return this._s(id) === 'on'; }
  _svc(d, s, data) { return this._hass.callService(d, s, data); }
  _mi(id) { const ev = new Event('hass-more-info', { bubbles: true, composed: true }); ev.detail = { entityId: id }; this.dispatchEvent(ev); }
  _nav(p) { history.pushState(null, '', p); window.dispatchEvent(new CustomEvent('location-changed', { detail: { replace: false } })); }

  // Fällige Wartungssensoren (binary_sensor.*_uberfallig = on)
  _maint() {
    return Object.keys(this._hass.states).filter((id) => id.startsWith('binary_sensor.') && id.endsWith('_uberfallig') && this._on(id))
      .map((id) => ({ id, n: String(this._a(id, 'friendly_name') || id).replace(/ überfällig$/, '').replace(/^P50 Pro Ultra /, 'Mova: ').replace(/^IO Series 4C27 /, 'Zahnbürste: ').replace(/^Batterie-Flotte /, ''), btn: id.replace('binary_sensor.', 'button.').replace(/_uberfallig$/, '_abschliessen') }));
  }
  _due(it) { return it.due ? new Date(it.due.length === 10 ? it.due + 'T23:59:59' : it.due) : null; }

  _devState(d, dark, maint, late) {
    const col = d.c[dark ? 1 : 0];
    const dots = maint.filter((m) => d.h && m.id.startsWith('binary_sensor.' + d.h + '_')).map((m) => ({ n: m.n, btn: m.btn }))
      .concat(late.filter((t) => d.kw.test(t.summary)).map((t) => ({ n: t.summary, uid: t.uid })));
    let st = 'off', p = null, txt = '', prog = '', src = d.e;
    if (d.wd) {
      src = `sensor.${d.k}_zustand`;
      const z = this._s(src);
      const last = this._a(`sensor.${d.h}_kosten_des_letzten_zyklus`, 'ended_at');
      if (this._on(`binary_sensor.${d.k}_lauft`) || RUN.includes(z)) {
        st = 'run'; p = this._n(`sensor.${d.k}_fortschritt`);
        const rem = this._n(`sensor.${d.k}_verbleibende_zeit`), el = this._n(`sensor.${d.k}_verstrichene_zeit`);
        if (rem != null) txt = `noch ${rem >= 60 ? Math.floor(rem / 60) + ':' + String(Math.round(rem % 60)).padStart(2, '0') + ' h' : Math.round(rem) + ' min'} · ${hhmm(Date.now() + rem * 60000)}`;
        else { p = null; txt = el ? `läuft seit ${Math.floor(el / 60)}:${String(Math.round(el % 60)).padStart(2, '0')} h` : 'läuft'; }
        const pr = this._s(`sensor.${d.k}_programm`), ph = this._s(`sensor.${d.k}_aktuelle_phase`);
        prog = [pr, ph].filter((x) => x && !['off', 'unknown', 'unavailable', 'none'].includes(x)).join(' · ');
        if (z === 'paused' || z === 'user_paused') txt = 'pausiert';
      } else if (DONE.includes(z)) { st = 'done'; txt = 'Fertig · ausräumen'; prog = `fertig ${hhmm(this._o(src).last_changed)}`; }
      else if (ERR.includes(z)) { st = 'err'; txt = 'abgebrochen'; }
      else if (z === 'unavailable') { st = 'idle'; txt = 'offline'; }
      else txt = last ? `zuletzt ${dday(last)}` : 'aus';
    } else if (d.k === 'mova') {
      const v = this._s(d.e), err = this._a(d.e, 'error');
      if (['cleaning', 'returning', 'paused'].includes(v)) { st = 'run'; p = this._a(d.e, 'cleaning_progress') || null; txt = v === 'returning' ? 'fährt zurück' : v === 'paused' ? 'pausiert' : `saugt${p ? ' · ' + p + ' %' : ''}`; }
      else if (v === 'error' || (err && err !== 'No error')) { st = 'err'; txt = `Fehler: ${err || 'unbekannt'}`; }
      else if (v === 'unavailable') { st = 'idle'; txt = 'offline'; }
      else txt = `${v === 'docked' ? 'angedockt' : v === 'idle' ? 'bereit' : v} · ${this._a(d.e, 'battery') ?? '–'} %`;
      if (this._a(d.e, 'low_water')) dots.push({ n: 'Frischwasser nachfüllen' });
    } else if (d.k === 'kaffee') {
      const v = this._s(d.e);
      if (v === 'on') { st = 'run'; txt = `an · ${Math.round(this._n('sensor.kaffeemaschine_leistung') || 0)} W`; }
      else if (v === 'unavailable') { st = 'idle'; txt = 'offline'; } else txt = 'aus';
    } else if (d.k === 'kocher') {
      const v = this._s(d.e), cur = this._a(d.e, 'current_temperature'), tgt = this._a(d.e, 'temperature'), er = this._s('sensor.proficook_pc_wks_1167g_kettle_error');
      if (er && !['OK', 'unknown', 'unavailable'].includes(er)) { st = 'err'; txt = `Fehler: ${er}`; }
      else if (v === 'heat') { st = 'run'; p = tgt ? Math.round((cur / tgt) * 100) : null; txt = `${Math.round(cur || 0)} von ${tgt} °C`; }
      else if (v === 'unavailable') { st = 'idle'; txt = 'offline'; } else txt = `aus · ${Math.round(cur || 0)} °C`;
    } else if (d.k === 'luft' || d.k === 'luftwz') {
      const v = this._s(d.e), pm = this._n(d.pm), m = this._a(d.e, 'preset_mode');
      if (v === 'on') { st = 'run'; txt = `${m ? (FANM[m] || m) : (this._a(d.e, 'percentage') || 0) + ' %'}${pm != null ? ' · PM2,5 ' + Math.round(pm) : ''}`; }
      else if (v === 'unavailable') { st = 'idle'; txt = 'offline'; } else txt = `aus · ${d.loc}`;
      if (d.k === 'luft' && this._on('binary_sensor.luftreiniger_schlafzimmer_replace_filter')) dots.push({ n: 'Filter wechseln' });
      if (d.k === 'luftwz') {
        const fc = this._n('sensor.ac1715_cloud_filterreinigung_verbleibend'), fw = this._n('sensor.ac1715_cloud_filterwechsel_verbleibend');
        if (fw != null && fw <= 72) dots.push({ n: `Filter wechseln (noch ${Math.round(fw)} h)`, btn: 'button.ac1715_cloud_filterwechsel_timer_zurucksetzen' });
        else if (fc != null && fc <= 24) dots.push({ n: `Vorfilter reinigen (noch ${Math.round(fc)} h)`, btn: 'button.ac1715_cloud_filterreinigungs_timer_zurucksetzen' });
      }
    } else if (d.k === 'mower') {
      const v = this._s(d.e), er = this._s('sensor.m500p_fehler');
      if (v === 'unavailable') { st = 'idle'; txt = new Date().getMonth() >= 10 || new Date().getMonth() <= 1 ? 'Winterpause' : 'offline'; }
      else if (er && !['no_error', 'unknown', 'unavailable', 'none'].includes(er)) { st = 'err'; txt = `Fehler: ${MOW_ERR[er] || er}`; }
      else if (v === 'mowing') { st = 'run'; txt = 'mäht'; }
      else txt = v === 'docked' ? 'in der Station' : v;
    }
    return { ...d, col, st, p, txt, prog, dots, src };
  }

  _click(e) {
    const t = e.target;
    if (this._dev && (t.classList.contains('scrim') || t.closest('[data-close]'))) { this._dev = null; this._render(); return; }
    const el = t.closest('[data-dev],[data-task],[data-nav],[data-mi],[data-btn],[data-tg],[data-svc],[data-dismiss]');
    if (!el) return;
    const d = el.dataset;
    if (d.dev) { this._dev = d.dev; this._render(); return; }
    if (d.mi) { this._mi(d.mi); return; }
    if (d.nav) { this._dev = null; this._nav(d.nav); return; }
    if (d.task) {
      const it = this._items.find((x) => x.uid === d.task);
      if (!it) return;
      this._done[d.task] = true; this._render();
      this._svc('todo', 'update_item', { entity_id: TODO, item: it.uid, status: 'completed' }).catch(() => { delete this._done[d.task]; this._render(); });
      return;
    }
    if (d.btn) { this._svc('button', 'press', { entity_id: d.btn }); this._busy[d.btn] = 1; this._render(); return; }
    if (d.tg) {
      const id = d.tg;
      if (id.startsWith('climate.')) this._svc('climate', 'set_hvac_mode', { entity_id: id, hvac_mode: this._s(id) === 'off' ? 'heat' : 'off' });
      else this._svc(id.split('.')[0] === 'fan' ? 'fan' : 'homeassistant', 'toggle', { entity_id: id });
      return;
    }
    if (d.svc) {
      const [dom, s, id] = d.svc.split('|');
      if (this._arm !== d.svc) { this._arm = d.svc; clearTimeout(this._armT); this._armT = setTimeout(() => { this._arm = null; this._render(); }, 4000); this._render(); return; }
      this._arm = null; this._svc(dom, s, { entity_id: id }); this._render(); return;
    }
    if (d.dismiss) { try { localStorage.setItem('hh-dismiss-' + d.dismiss.split('|')[0], d.dismiss.split('|')[1]); } catch (x) { /* egal */ } this._render(); }
  }
  _dismissed(src) { try { return localStorage.getItem('hh-dismiss-' + src) === this._o(src).last_changed; } catch (x) { return false; } }

  _render() {
    const h = this._hass;
    if (!h || !this.shadowRoot) return;
    const dark = !!(h.themes && h.themes.darkMode);
    const now = new Date();
    const sunday = new Date(now); sunday.setDate(now.getDate() + ((7 - now.getDay()) % 7)); sunday.setHours(23, 59, 59, 0);
    const today = new Date(now); today.setHours(0, 0, 0, 0);
    const open = this._items.filter((i) => !this._done[i.uid]);
    const late = open.filter((i) => { const d = this._due(i); return d && d < today; });
    const soon = open.filter((i) => { const d = this._due(i); return d && d >= today && d <= sunday; });
    const maint = this._maint();
    const devs = DEVS.map((d) => this._devState(d, dark, maint, late));
    this._devs = devs;

    // Hinweise oben: Störungen, dann Fertig
    const alerts = [];
    devs.filter((d) => d.st === 'err').forEach((d) => alerts.push(`<div class="alert crit"><div class="ic">${ic(d.ic)}</div><div><b>${d.n}: ${esc(d.txt)}</b><small>${d.k === 'mower' ? 'Mähroboter aufrichten, dann Fehler in der App quittieren' : 'Gerät prüfen'}</small></div><button class="go" data-dev="${d.k}">Details →</button></div>`));
    devs.filter((d) => d.st === 'done' && !this._dismissed(d.src)).forEach((d) => alerts.push(`<div class="alert ok"><div class="ic">${ic(d.ic)}</div><div><b>${d.n} fertig</b><small>${d.prog} · verschwindet beim nächsten Lauf</small></div><button class="go" data-dismiss="${d.src}|${this._o(d.src).last_changed}">Erledigt</button></div>`));

    const nRun = devs.filter((d) => d.st === 'run').length;
    const devRow = devs.map((d) => {
      const cls = d.st === 'idle' ? 'off idle' : d.st;
      return `<button class="dev ${cls}" style="--c:${d.col}" data-dev="${d.k}" aria-label="${d.n}: ${esc(d.txt)}"><span class="orb">${d.st === 'run' && d.p != null ? ring(d.p) : ''}${ic(d.ic)}${d.dots.length ? `<span class="dot" title="${esc(d.dots.map((x) => x.n).join(', '))}"></span>` : ''}</span><b>${d.n}</b><small>${esc(d.txt)}</small></button>`;
    }).join('');

    const fmtDue = (i) => { const d = this._due(i); if (!d) return ''; const days = Math.round((d - today) / 86400000); return d < today ? `${d.getDate()}.${d.getMonth() + 1}.` : days === 0 ? 'heute' : days === 1 ? 'morgen' : `${TAGK[d.getDay()]} ${d.getDate()}.${d.getMonth() + 1}.`; };
    const show = [...late, ...soon].sort((a, b) => this._due(a) - this._due(b));
    const MAX = 10;
    const taskRows = show.slice(0, MAX).map((i) => { const isLate = late.includes(i);
      return `<div class="task"><button class="chk" data-task="${esc(i.uid)}" aria-label="${esc(i.summary)} abhaken">${ic('check')}</button><span class="n">${esc(i.summary)}${i.description ? `<small>${esc(i.description.split('\n')[0]).slice(0, 80)}</small>` : ''}</span><span class="due ${isLate ? 'late' : ''}">${fmtDue(i)}</span></div>`; }).join('');
    const tasks = show.length ? `<div class="tasks">${taskRows}</div>${show.length > MAX ? `<button class="more" data-nav="/dashboard-haushalt/aufgaben">+ ${show.length - MAX} weitere</button>` : ''}`
      : `<div class="quiet">${ic('check')}Nichts fällig bis Sonntag.</div>`;

    let total = 0;
    const lists = LISTS.map(([id, n]) => { const c = parseInt(this._s(id), 10) || 0; total += c;
      return `<button class="list ${c ? '' : 'empty'}" data-nav="/todo?entity_id=${id}">${ic('cart')}<span>${n}</span><span class="c">${c}</span></button>`; }).join('');

    const nMaint = parseInt(this._s('todo.maintenance'), 10) || 0;
    const wrows = maint.map((m) => `<div class="wrow">${ic('wrench')}<span>${esc(m.n)}</span>${this._o(m.btn) ? `<button class="go" data-btn="${m.btn}">${this._busy[m.btn] ? 'erledigt' : 'Erledigt'}</button>` : '<span class="v">überfällig</span>'}</div>`).join('')
      + (nMaint ? `<button class="wrow lnk" data-nav="/todo?entity_id=todo.maintenance">${ic('list')}<span>Wartungsliste</span><span class="v">${nMaint} offen →</span></button>` : '');

    const body = `
      ${alerts.length ? `<div class="alerts">${alerts.join('')}</div>` : ''}
      <div class="card s12"><div class="ch"><h3>Geräte</h3><span class="sub">${nRun ? nRun + (nRun === 1 ? ' läuft' : ' laufen') : 'alles aus'} · leuchtet = läuft · Ring = Fortschritt · Punkt = Pflege fällig</span></div><div class="devs">${devRow}</div></div>
      <div class="card s7"><div class="ch"><h3>Fällig</h3><span class="sub">${late.length} überfällig · ${soon.length} bis Sonntag · ${open.length} offen gesamt</span></div>${tasks}</div>
      <div class="s5 col">
        <div class="card"><div class="ch"><h3>Einkaufen</h3><span class="sub">${total} Artikel</span></div><div class="lists">${lists}</div></div>
        <div class="card"><div class="ch"><h3>Pflege & Verschleiß</h3><button class="lnk sub" data-nav="/dashboard-haushalt/wartung">alles →</button></div>
          ${maint.length || nMaint ? `<div class="wrows">${wrows}</div>` : `<div class="quiet">${ic('check')}Alles gepflegt.</div>`}</div>
      </div>`;

    const oldSheet = this.shadowRoot.querySelector('.sheet');
    const sc = oldSheet ? oldSheet.scrollTop : 0;
    this.shadowRoot.innerHTML = `<style>${this._css(dark)}</style><div class="view">${body}</div>${this._dev ? this._sheet(devs.find((x) => x.k === this._dev)) : ''}`;
    const ns = this.shadowRoot.querySelector('.sheet');
    if (ns && sc) ns.scrollTop = sc;
  }

  _sheet(d) {
    if (!d) return '';
    const head = d.st === 'run'
      ? `<div class="hero"><span class="dev run" style="--c:${d.col}"><span class="orb">${d.p != null ? ring(d.p) : ''}${ic(d.ic)}</span></span><div><b>${d.p != null ? Math.round(d.p) + ' %' : 'läuft'}</b><small>${esc(d.txt)}${d.prog ? ' · ' + esc(d.prog) : ''}</small></div></div>`
      : `<div class="quiet">${ic(d.ic)}${esc(d.txt)}${d.prog ? ' · ' + esc(d.prog) : ''}</div>`;
    const dots = d.dots.map((x) => `<div class="alert warn"><div class="ic">${ic('wrench')}</div><div><b>${esc(x.n)}</b><small>${x.uid ? 'Haushaltsaufgabe überfällig' : 'Wartung fällig'}</small></div>${x.uid ? `<button class="go" data-task="${esc(x.uid)}">Abhaken</button>` : x.btn && this._o(x.btn) ? `<button class="go" data-btn="${x.btn}">Erledigt</button>` : ''}</div>`).join('');
    const facts = [];
    if (d.wd) {
      const c = this._o(`sensor.${d.h}_kosten_des_letzten_zyklus`);
      if (c && c.attributes.started_at) {
        const min = Math.round((new Date(c.attributes.ended_at) - new Date(c.attributes.started_at)) / 60000);
        facts.push(`Letzter Lauf ${dday(c.attributes.ended_at)} · ${de(parseFloat(c.state))} € · ${min} min`);
      }
      const n = this._s(`sensor.${d.k}_zyklusanzahl`); if (n && n !== 'unknown') facts.push(`${n} Läufe erfasst`);
    }
    if (d.k === 'mova') {
      const a = (k) => this._a(d.e, k);
      facts.push(`Akku ${a('battery')} % · zuletzt ${a('cleaned_area')} m² in ${a('cleaning_time')} min`);
      facts.push(`Hauptbürste ${a('main_brush_left')} % · Seitenbürste ${a('side_brush_left')} % · Filter ${a('filter_left')} %`);
    }
    if (d.k === 'kaffee') facts.push(`Verbrauch gesamt ${de(this._n('sensor.kaffeemaschine_energie') || 0, 1)} kWh`);
    if (d.k === 'luft') { const pm = this._n('sensor.0x348d13fffe52a975_pm25'), voc = this._n('sensor.0x348d13fffe52a975_voc_index');
      facts.push(`IKEA Starkvind · Schlafzimmer${pm != null ? ' · PM2,5 ' + Math.round(pm) + ' µg/m³' : ''}${voc != null ? ' · VOC ' + Math.round(voc) : ''}`); }
    if (d.k === 'luftwz') { const pm = this._n(d.pm), ix = this._n('sensor.ac1715_cloud_innenraumluftindex'), fc = this._n('sensor.ac1715_cloud_filterreinigung_verbleibend'), fw = this._n('sensor.ac1715_cloud_filterwechsel_verbleibend');
      facts.push(`Philips 1000i · Wohnzimmer${pm != null ? ' · PM2,5 ' + Math.round(pm) + ' µg/m³' : ''}${ix != null ? ' · Luftindex ' + ix : ''}`);
      facts.push(`Vorfilter reinigen in ${fc != null ? Math.round(fc / 24) + ' Tagen' : '–'} · Filterwechsel in ${fw != null ? Math.round(fw / 24) + ' Tagen' : '–'}`); facts.push('Steuerung über die Philips-Cloud'); }
    if (d.k === 'mower') { const nx = this._s('sensor.m500p_nachster_zeitplan'); if (nx && !['unknown', 'unavailable'].includes(nx)) facts.push(`Nächster Plan ${dday(nx)} ${hhmm(nx)}`); const er = this._s('sensor.m500p_fehler'); if (er && er !== 'no_error') facts.push(`Letzte Fehlermeldung: ${MOW_ERR[er] || er}`); }
    const btn = (i, b, s, attr) => `<button class="act" ${attr}>${ic(i)}<b>${b}</b><small>${s}</small></button>`;
    let acts = '';
    if (d.wd) acts = btn('list', 'Verlauf & Kosten', 'Geräte-Reiter', 'data-nav="/dashboard-haushalt/geraete"') + btn('bolt', 'Details', 'Zustand und Programm', `data-mi="${d.src}"`);
    else if (d.k === 'mova') { const k = 'vacuum|return_to_base|' + d.e, s = 'vacuum|start|' + d.e;
      acts = btn('play', this._arm === s ? 'Nochmal tippen' : 'Starten', 'ganze Wohnung', `data-svc="${s}"`) + btn('home', this._arm === k ? 'Nochmal tippen' : 'Zur Station', 'zurückfahren', `data-svc="${k}"`) + btn('vac', 'Saugroboter', 'Räume, Modi, Karte', 'data-nav="/dashboard-haushalt/saugroboter"'); }
    else if (d.k === 'mower') acts = btn('mow', 'Details', 'Mähroboter', `data-mi="${d.e}"`);
    else acts = btn('bolt', ['on', 'heat'].includes(this._s(d.e)) ? 'Ausschalten' : 'Einschalten', d.k === 'kocher' ? `auf ${this._a(d.e, 'temperature')} °C` : d.k === 'kaffee' ? 'Steckdose' : d.loc, `data-tg="${d.e}"`) + (d.k === 'luft' || d.k === 'luftwz'
      ? btn('list', 'Zeitplan', `Nachtmodus ${this._on(d.k === 'luftwz' ? 'input_boolean.luftreiniger_wz_zeitplan' : 'input_boolean.luftreiniger_sz_zeitplan') ? 'an' : 'aus'}`, 'data-nav="/dashboard-beleuctung/luftreiniger"')
      : btn('list', 'Details', 'Verlauf, Einstellungen', `data-mi="${d.e}"`));
    return `<div class="scrim"><div class="sheet" role="dialog" aria-label="${d.n}" style="--c:${d.col}"><header>${ic(d.ic)}<h3>${d.n}</h3><button class="x" data-close aria-label="Schließen">${ic('x')}</button></header>
      ${head}${dots}${facts.length ? `<div class="facts">${facts.map((f) => `<div>${esc(f)}</div>`).join('')}</div>` : ''}<div class="acts">${acts}</div></div></div>`;
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
button{font:inherit;color:inherit;appearance:none;-webkit-tap-highlight-color:transparent}
button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
h3{font-family:var(--fd);font-weight:600;margin:0}
svg.i{width:18px;height:18px;flex:none;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
.view{max-width:1400px;margin:0 auto;padding:20px 24px;display:grid;gap:14px;grid-template-columns:repeat(12,minmax(0,1fr));align-content:start;font-family:var(--fb);font-size:14px;line-height:1.5;color:var(--ink)}
.s12{grid-column:1/-1}.s7{grid-column:span 7}.s5{grid-column:span 5}
.col{display:grid;gap:14px;align-content:start}
.card{background:var(--card);border:1px solid var(--line);border-radius:var(--ha-card-border-radius,14px);padding:14px 16px;display:grid;gap:10px;align-content:start;min-width:0}
.ch{display:flex;align-items:baseline;justify-content:space-between;gap:10px;flex-wrap:wrap}
.ch h3{font-size:14.5px}
.sub{font-size:12px;color:var(--muted)}
.lnk{border:0;background:none;cursor:pointer;padding:0}
.devs{display:grid;grid-template-columns:repeat(9,minmax(0,1fr));gap:6px}
.dev{border:0;background:none;display:grid;justify-items:center;gap:6px;text-align:center;cursor:pointer;padding:6px 2px;border-radius:12px;min-width:0}
.dev .orb{position:relative;width:62px;height:62px;border-radius:50%;display:grid;place-items:center;background:var(--sunk);color:var(--muted);transition:box-shadow .3s,background .3s}
.dev .orb svg.i{width:26px;height:26px;stroke-width:1.7}
.dev .orb svg.ring{position:absolute;inset:-5px;width:calc(100% + 10px);height:calc(100% + 10px)}
.dev.run .orb{background:color-mix(in srgb,var(--c) 16%,var(--card));color:var(--c);box-shadow:0 0 0 1px color-mix(in srgb,var(--c) 40%,transparent),0 0 22px color-mix(in srgb,var(--c) 45%,transparent)}
.dev.done .orb{background:var(--good-soft);color:var(--good);box-shadow:0 0 0 2px var(--good)}
.dev.err .orb{background:var(--crit-soft);color:var(--crit);box-shadow:0 0 0 2px var(--crit)}
.dev.idle .orb{opacity:.45}
.dev .dot{position:absolute;top:1px;right:1px;width:14px;height:14px;border-radius:50%;background:var(--warn);border:2px solid var(--card)}
.dev b{font-size:12px;font-weight:600;line-height:1.2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}
.dev small{font-size:11px;color:var(--muted);line-height:1.25;min-height:28px}
.dev.run small{color:var(--c);font-weight:500}
.dev.done small{color:var(--good);font-weight:600}
.dev.err small{color:var(--crit);font-weight:600}
@media (prefers-reduced-motion:no-preference){.dev.done .orb{animation:pulse 2.2s ease-in-out infinite}
  @keyframes pulse{0%,100%{box-shadow:0 0 0 2px var(--good)}50%{box-shadow:0 0 0 2px var(--good),0 0 0 8px var(--good-soft)}}}
.alerts{grid-column:1/-1;display:grid;gap:8px}
.alert{display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:10px 14px}
.alert .ic{width:32px;height:32px;border-radius:9px;display:grid;place-items:center}
.alert.crit .ic{background:var(--crit-soft);color:var(--crit)}.alert.warn .ic{background:var(--warn-soft);color:var(--warn)}.alert.ok .ic{background:var(--good-soft);color:var(--good)}
.alert b{display:block;font-weight:600;font-size:13.5px}
.alert small{color:var(--ink2);font-size:12.5px}
.go{border:1px solid var(--line);background:none;color:var(--ink2);font-size:12.5px;font-weight:500;padding:6px 11px;border-radius:8px;cursor:pointer;white-space:nowrap}
.tasks{display:grid}
.task{display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center;padding:8px 0;border-top:1px solid var(--line)}
.task:first-child{border-top:0}
.chk{width:28px;height:28px;border-radius:8px;border:1.5px solid var(--line);background:none;cursor:pointer;display:grid;place-items:center;color:transparent}
.chk:hover{color:var(--muted)}
.task .due{font-size:12px;color:var(--muted);font-variant-numeric:tabular-nums;white-space:nowrap}
.task .due.late{color:var(--crit);font-weight:600}
.task .n{font-size:13.5px;min-width:0}
.task .n small{display:block;color:var(--muted);font-size:11.5px}
.more{border:0;background:none;color:var(--accent);font-size:12.5px;font-weight:500;cursor:pointer;justify-self:start;padding:2px 0}
.lists{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.list{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;background:var(--sunk);font-size:13px;font-weight:500;border:0;cursor:pointer;text-align:left;min-width:0}
.list svg{color:var(--accent)}
.list .c{margin-left:auto;font-family:var(--fd);font-weight:600;font-size:15px;font-variant-numeric:tabular-nums}
.list.empty{opacity:.55}
.wrows{display:grid}
.wrow{display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center;padding:7px 0;border-top:1px solid var(--line);font-size:13px;text-align:left;width:100%}
.wrow:first-child{border-top:0}
.wrow.lnk{border-left:0;border-right:0;border-bottom:0;padding:7px 0}
.wrow svg{color:var(--warn)}
.wrow .v{font-size:12px;color:var(--muted)}
.quiet{font-size:12.5px;color:var(--muted);display:flex;align-items:center;gap:8px}
.quiet svg{color:var(--good)}
.scrim{position:fixed;inset:0;background:rgba(10,12,15,.45);display:grid;place-items:center;z-index:9;padding:16px;font-family:var(--fb);font-size:14px;line-height:1.5;color:var(--ink)}
.sheet{background:var(--card);border-radius:18px;width:100%;max-width:460px;padding:16px;display:grid;gap:12px;box-shadow:0 18px 50px rgba(0,0,0,.3);max-height:calc(100vh - 32px);overflow:auto}
.sheet header{display:flex;align-items:center;gap:10px}
.sheet header>svg{color:var(--c)}
.sheet header h3{font-size:17px}
.sheet header .x{margin-left:auto;border:0;background:var(--sunk);width:34px;height:34px;border-radius:50%;cursor:pointer;display:grid;place-items:center}
.sheet .quiet svg{color:var(--muted)}
.hero{display:grid;grid-template-columns:auto 1fr;gap:14px;align-items:center;background:var(--sunk);border-radius:12px;padding:10px 12px}
.hero .dev{cursor:default}
.hero b{font-family:var(--fd);font-size:20px}
.hero small{display:block;color:var(--muted)}
.facts{display:grid;gap:3px;font-size:12.5px;color:var(--ink2)}
.acts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.act{border:1px solid var(--line);background:var(--sunk);border-radius:12px;padding:10px 12px;display:grid;grid-template-columns:auto 1fr;gap:2px 10px;align-items:center;text-align:left;cursor:pointer}
.act svg{grid-row:span 2;color:var(--accent)}
.act b{font-size:13px;font-weight:600}
.act small{font-size:11.5px;color:var(--muted)}
@container (max-width:900px){.devs{grid-template-columns:repeat(5,minmax(0,1fr));row-gap:12px}.s7,.s5{grid-column:1/-1}}
@container (max-width:620px){.view{padding:12px;gap:12px}.dev .orb{width:54px;height:54px}.dev .orb svg.i{width:23px;height:23px}}
`;
  }
}
customElements.define('haushalt-card', HaushaltCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: 'haushalt-card', name: 'Haushalt Übersicht', description: 'Geräte-Reihe, fällige Aufgaben, Einkauf und Wartung' });
