// wecker-card: Unterseite /dashboard-beleuctung/wecker (25.11.2026). Wecker des Echo Spot Schlafzimmer
// über Alexa Media Player stellen, ändern (= neu anlegen + alten löschen), an/aus, löschen.
// Pausiert-Anzeige: automation.wecker_bei_abwesenheit_pausieren (Helfer input_boolean/input_text unten).
// Quelle: Smarthome/ha/wecker-card.js
const WK = {
  s: 'sensor.echo_spot_schlafzimmer_nachster_alarm',
  mp: 'media_player.echo_spot_schlafzimmer',
  p: 'input_boolean.wecker_abwesenheit_pausiert',
  ids: 'input_text.wecker_pausierte_ids',
};
const TAG = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
const RR = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 };
const ESC = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const P2 = (n) => String(n).padStart(2, '0');

// Wochentage (0 = So) eines Weckers, null = einmalig
function wkDays(a) {
  const p = a.recurringPattern;
  const rr = a.rRuleData && (a.rRuleData.byWeekDays || a.rRuleData.byDay);
  if (Array.isArray(rr) && rr.length) return rr.map((d) => RR[String(d).slice(0, 2).toUpperCase()]).filter((d) => d != null);
  if (!p) return null;
  if (p === 'P1D' || p === 'XXXX-WXX') return [0, 1, 2, 3, 4, 5, 6];
  if (p === 'XXXX-WD') return [1, 2, 3, 4, 5];
  if (p === 'XXXX-WE') return [0, 6];
  const m = p.match(/^XXXX-WXX-([1-7](?:,[1-7])*)$/);
  if (m) return m[1].split(',').map((n) => +n % 7);
  return [];
}
function wkRule(a) {
  const d = wkDays(a);
  if (d === null) return 'Einmalig';
  const k = [...new Set(d)].sort().join('');
  if (k === '0123456') return 'Täglich';
  if (k === '12345') return 'Mo–Fr';
  if (k === '06') return 'Sa + So';
  if (!k) return a.recurringPattern || 'Wiederholt';
  return [1, 2, 3, 4, 5, 6, 0].filter((x) => d.includes(x)).map((x) => TAG[x]).join(', ');
}
// nächstes Klingeln (ms) ab `from`, null = keins mehr
function wkNext(a, from) {
  const [H, M] = String(a.originalTime || '').split(':').map(Number);
  const days = wkDays(a);
  if (!isFinite(H) || (days && !days.length)) { const t = Date.parse(a.date_time); return isFinite(t) && t >= from ? t : null; }
  if (days === null) {
    const [y, mo, d] = String(a.originalDate || '').split('-').map(Number);
    const t = new Date(y, mo - 1, d, H, M).getTime();
    return isFinite(t) && t >= from ? t : null;
  }
  const base = new Date(from);
  for (let i = 0; i < 8; i++) {
    const c = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i, H, M);
    if (days.includes(c.getDay()) && c.getTime() >= from) return c.getTime();
  }
  return null;
}
function wkDayTxt(t) {
  const d0 = new Date(t); d0.setHours(0, 0, 0, 0);
  const t0 = new Date(); t0.setHours(0, 0, 0, 0);
  const n = Math.round((d0 - t0) / 864e5);
  const d = new Date(t);
  return n === 0 ? 'heute' : n === 1 ? 'morgen' : `${TAG[d.getDay()]} ${d.getDate()}.${d.getMonth() + 1}.`;
}
function wkList(hass) {
  const o = hass.states[WK.s];
  return ((o && o.attributes.sorted_all) || []).filter((a) => a && a.type === 'Alarm' && a.status !== 'DELETED');
}
function wkPaused(hass) {
  const b = hass.states[WK.p], t = hass.states[WK.ids];
  return b && b.state === 'on' ? String((t && t.state) || '').split(',').map((x) => x.trim()).filter(Boolean) : [];
}

const I = {
  alarm: 'M12 21a8 8 0 1 0 0-16a8 8 0 0 0 0 16M12 9v4l2.5 2M5 3 2 6M19 3l3 3',
  off: 'M12 21a8 8 0 1 0 0-16a8 8 0 0 0 0 16M12 9v4l2.5 2M5 3 2 6M19 3l3 3M3 3l18 18',
  plus: 'M12 5v14M5 12h14',
  edit: 'M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  home: 'M3 11l9-7 9 7v9H3zM9 20v-6h6v6',
  x: 'M6 6l12 12M18 6 6 18',
};
const ic = (k) => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="${I[k]}"/></svg>`;
const MODES = [['once', 'Einmalig'], ['weekdays', 'Mo–Fr'], ['everyday', 'Täglich'], ['weekends', 'Sa + So'], ['custom', 'Eigene Tage']];
const DAYKEY = [['mon', 'Mo'], ['tue', 'Di'], ['wed', 'Mi'], ['thu', 'Do'], ['fri', 'Fr'], ['sat', 'Sa'], ['sun', 'So']];

class WeckerCard extends HTMLElement {
  setConfig(c) { this._c = c || {}; this._form = null; this._busy = 0; this._arm = null; this._msg = ''; }
  getCardSize() { return 8; }

  set hass(h) {
    const first = !this._hass;
    this._hass = h;
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.addEventListener('click', (e) => this._click(e));
      this.shadowRoot.addEventListener('change', (e) => this._change(e));
    }
    // Formular nicht bei jedem Zustandswechsel neu zeichnen (Auswahl bleibt erhalten)
    const sig = JSON.stringify([h.states[WK.s] && h.states[WK.s].last_updated, h.states[WK.p] && h.states[WK.p].state, h.states[WK.ids] && h.states[WK.ids].state, h.themes && h.themes.darkMode]);
    if (first || sig !== this._sig) {
      if (this._busy && this._sig && sig !== this._sig) this._busy = 0;
      this._sig = sig; this._render();
    }
  }

  _svc(s, data) { return this._hass.callService('alexa_media', s, Object.assign({ entity_id: WK.mp }, data)); }
  _refresh() { setTimeout(() => this._hass.callService('homeassistant', 'update_entity', { entity_id: WK.s }).catch(() => {}), 2500); }
  _work(p, msg) {
    this._busy = Date.now(); this._msg = msg; this._render();
    Promise.resolve(p).then(() => this._refresh()).catch((e) => { this._busy = 0; this._msg = 'Fehler: ' + (e && e.message ? e.message : e); this._render(); });
    setTimeout(() => { if (this._busy && Date.now() - this._busy >= 19000) { this._busy = 0; this._render(); } }, 20000);
  }

  _click(e) {
    const el = e.target.closest('[data-a]');
    if (!el) return;
    const { a, id } = el.dataset;
    const list = wkList(this._hass);
    const al = list.find((x) => x.id === id);
    if (a === 'new' || a === 'edit') {
      const [H, M] = al ? String(al.originalTime).split(':').map(Number) : [6, 30];
      let mode = 'once', days = [];
      if (al) {
        const d = wkDays(al), r = wkRule(al);
        mode = d === null ? 'once' : r === 'Mo–Fr' ? 'weekdays' : r === 'Täglich' ? 'everyday' : r === 'Sa + So' ? 'weekends' : 'custom';
        days = d ? d.map((x) => DAYKEY[(x + 6) % 7][0]) : [];
      }
      this._form = { id: al ? al.id : null, h: H, m: M, mode, days };
      this._arm = null; this._render(); return;
    }
    if (a === 'cancel') { this._form = null; this._render(); return; }
    if (a === 'mode') { this._form.mode = el.dataset.v; this._render(); return; }
    if (a === 'day') { const f = this._form, v = el.dataset.v; f.days = f.days.includes(v) ? f.days.filter((x) => x !== v) : [...f.days, v]; this._render(); return; }
    if (a === 'save') {
      const f = this._form;
      const data = { time: `${P2(f.h)}:${P2(f.m)}:00` };
      if (f.mode === 'custom') { if (!f.days.length) { this._msg = 'Mindestens einen Tag wählen.'; this._render(); return; } data.days = DAYKEY.map((d) => d[0]).filter((d) => f.days.includes(d)); }
      else if (f.mode !== 'once') data.days = [f.mode];
      const old = f.id;
      this._form = null;
      this._work(this._svc('create_alarm', data).then(() => (old ? this._svc('delete_alarm', { alarm_id: old }) : null)), old ? 'Wecker wird geändert …' : 'Wecker wird gestellt …');
      return;
    }
    if (a === 'tog' && al) { this._work(this._svc(al.status === 'ON' ? 'disable_alarm' : 'enable_alarm', { alarm_id: al.id }), al.status === 'ON' ? 'Wecker wird ausgeschaltet …' : 'Wecker wird eingeschaltet …'); return; }
    if (a === 'del' && al) {
      if (this._arm !== al.id) { this._arm = al.id; clearTimeout(this._armT); this._armT = setTimeout(() => { this._arm = null; this._render(); }, 4000); this._render(); return; }
      this._arm = null; this._work(this._svc('delete_alarm', { alarm_id: al.id }), 'Wecker wird gelöscht …'); return;
    }
  }
  _change(e) {
    const t = e.target;
    if (!this._form || !t.dataset.f) return;
    this._form[t.dataset.f] = +t.value;
  }

  _render() {
    const h = this._hass;
    if (!h || !this.shadowRoot) return;
    const dark = !!(h.themes && h.themes.darkMode);
    const now = Date.now();
    const paused = wkPaused(h);
    const list = wkList(h).map((a) => ({ a, t: wkNext(a, now - 60000), p: paused.includes(a.id) && a.status !== 'ON' }))
      .sort((x, y) => (x.a.originalTime || '').localeCompare(y.a.originalTime || ''));
    const sensorOk = !!h.states[WK.s] && h.states[WK.s].state !== 'unavailable';

    const banner = paused.length
      ? `<div class="note crit">${ic('off')}<div><b>Wecker pausiert: ihr seid beide weg und die Wohnungstür ist abgeschlossen.</b><small>Sobald jemand heimkommt oder die Tür aufgeschlossen wird, gehen die Wecker wieder an.</small></div></div>`
      : '';
    const rows = list.length ? list.map(({ a, t, p }) => {
      const on = a.status === 'ON';
      const cls = p ? 'paused' : on ? 'on' : '';
      const next = p ? 'pausiert (Abwesenheit)' : on ? (t ? `klingelt ${wkDayTxt(t)}` : 'abgelaufen') : 'aus';
      return `<div class="al ${cls}">
        <button class="tm" data-a="edit" data-id="${ESC(a.id)}" aria-label="Wecker ändern"><b>${String(a.originalTime || '').slice(0, 5)}</b><small>${ESC(wkRule(a))} · ${next}</small></button>
        <button class="ib" data-a="edit" data-id="${ESC(a.id)}" aria-label="Ändern">${ic('edit')}</button>
        <button class="ib ${this._arm === a.id ? 'arm' : ''}" data-a="del" data-id="${ESC(a.id)}" aria-label="Löschen">${this._arm === a.id ? 'Löschen?' : ic('trash')}</button>
        <button class="tog ${on || p ? 'on' : ''}" data-a="tog" data-id="${ESC(a.id)}" aria-label="Wecker an/aus" ${p ? 'disabled' : ''}></button>
      </div>`;
    }).join('') : `<div class="empty">${sensorOk ? 'Kein Wecker auf dem Echo Spot gestellt.' : 'Alexa Media Player liefert gerade keine Daten.'}</div>`;

    let form = '';
    if (this._form) {
      const f = this._form;
      const hs = Array.from({ length: 24 }, (_, i) => `<option value="${i}" ${i === f.h ? 'selected' : ''}>${P2(i)}</option>`).join('');
      const mins = [...new Set([...Array.from({ length: 12 }, (_, i) => i * 5), f.m])].sort((x, y) => x - y);
      const ms = mins.map((i) => `<option value="${i}" ${i === f.m ? 'selected' : ''}>${P2(i)}</option>`).join('');
      form = `<div class="card form">
        <h3>${f.id ? 'Wecker ändern' : 'Neuer Wecker'}</h3>
        <div class="time"><select data-f="h" aria-label="Stunde">${hs}</select><span>:</span><select data-f="m" aria-label="Minute">${ms}</select><small>Uhr</small></div>
        <div class="lbl">Wiederholen</div>
        <div class="chips">${MODES.map(([k, n]) => `<button class="chip ${f.mode === k ? 'on' : ''}" data-a="mode" data-v="${k}">${n}</button>`).join('')}</div>
        ${f.mode === 'custom' ? `<div class="chips">${DAYKEY.map(([k, n]) => `<button class="chip day ${f.days.includes(k) ? 'on' : ''}" data-a="day" data-v="${k}">${n}</button>`).join('')}</div>` : ''}
        ${f.mode === 'once' ? '<div class="sub">Klingelt einmal zum nächsten Mal dieser Uhrzeit.</div>' : ''}
        <div class="row"><button class="btn" data-a="cancel">Abbrechen</button><button class="btn pri" data-a="save">${f.id ? 'Speichern' : 'Wecker stellen'}</button></div>
        ${f.id ? '<div class="sub">Ändern legt den Wecker neu an und löscht den alten.</div>' : ''}
      </div>`;
    }

    const status = this._busy ? `<div class="note acc">${ESC(this._msg)}</div>` : this._msg && this._msg.startsWith('Fehler') || this._msg.startsWith('Mindestens') ? `<div class="note crit">${ESC(this._msg)}</div>` : '';
    this.shadowRoot.innerHTML = `<style>${this._css(dark)}</style><div class="view">
      <div class="head">${ic('alarm')}<div><h2>Wecker</h2><div class="sub">Echo Spot Schlafzimmer</div></div>
        ${this._form ? '' : `<button class="btn pri" data-a="new">${ic('plus')}Neuer Wecker</button>`}</div>
      ${banner}${status}${form}
      <div class="card list">${rows}</div>
      <div class="sub foot">Sind Marcel und Sarah beide weg und ist die Wohnungstür seit 30 Minuten abgeschlossen, schaltet Home Assistant die Wecker aus und bei Rückkehr wieder ein. Alexa übernimmt Änderungen nach wenigen Sekunden.</div>
    </div>`;
    this._msg = this._busy ? this._msg : (this._msg && (this._msg.startsWith('Fehler') || this._msg.startsWith('Mindestens')) ? this._msg : '');
  }

  _css(dark) {
    const p = dark
      ? { accent: '#4a9be8', accentSoft: '#1b2c3e', good: '#3fbf85', goodSoft: '#15291f', crit: '#ec6a5f', critSoft: '#331a18' }
      : { accent: '#1f78d1', accentSoft: '#e3effb', good: '#1a9c62', goodSoft: '#e2f4eb', crit: '#c8382e', critSoft: '#fbe6e4' };
    return `
:host{display:block;--card:var(--ha-card-background,var(--card-background-color,#fff));--ink:var(--primary-text-color);--muted:var(--secondary-text-color);--line:var(--divider-color,rgba(127,127,127,.25));--sunk:rgba(127,127,127,.09);
  --accent:${p.accent};--accent-soft:${p.accentSoft};--good:${p.good};--good-soft:${p.goodSoft};--crit:${p.crit};--crit-soft:${p.critSoft};
  --fd:"Space Grotesk",var(--ha-font-family-body,system-ui),sans-serif;--fb:"Inter",var(--ha-font-family-body,system-ui),sans-serif}
*{box-sizing:border-box}
button,select{font:inherit;color:inherit;-webkit-tap-highlight-color:transparent}
button{appearance:none}
button:focus-visible,select:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
h2,h3{font-family:var(--fd);font-weight:600;margin:0}
h2{font-size:20px}h3{font-size:15px}
svg.i{width:20px;height:20px;flex:none;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
.view{max-width:640px;margin:0 auto;padding:20px 16px;display:grid;gap:12px;font-family:var(--fb);font-size:14px;line-height:1.5;color:var(--ink)}
.head{display:flex;align-items:center;gap:12px}
.head>svg{width:28px;height:28px;color:var(--good)}
.head .btn{margin-left:auto}
.sub{font-size:12px;color:var(--muted)}
.foot{padding:0 4px}
.card{background:var(--card);border:1px solid var(--line);border-radius:var(--ha-card-border-radius,14px);padding:6px 16px}
.form{padding:14px 16px;display:grid;gap:10px}
.al{display:grid;grid-template-columns:1fr auto auto auto;gap:8px;align-items:center;padding:10px 0;border-top:1px solid var(--line)}
.al:first-child{border-top:0}
.tm{border:0;background:none;text-align:left;cursor:pointer;padding:0;min-width:0}
.tm b{display:block;font-family:var(--fd);font-size:30px;font-weight:600;font-variant-numeric:tabular-nums;line-height:1.15;color:var(--muted)}
.tm small{font-size:12.5px;color:var(--muted)}
.al.on .tm b{color:var(--ink)}
.al.on .tm small{color:var(--good)}
.al.paused .tm b{text-decoration:line-through;color:var(--crit)}
.al.paused .tm small{color:var(--crit)}
.ib{border:0;background:var(--sunk);height:36px;min-width:36px;padding:0 8px;border-radius:10px;display:grid;place-items:center;cursor:pointer;color:var(--muted);font-size:12.5px;font-weight:600}
.ib.arm{background:var(--crit-soft);color:var(--crit)}
.tog{width:46px;height:26px;border-radius:999px;background:var(--line);position:relative;border:0;cursor:pointer}
.tog::after{content:"";position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:var(--card);transition:left .15s}
.tog.on{background:var(--good)}.tog.on::after{left:23px}
.al.paused .tog{background:var(--crit);opacity:.6;cursor:default}
.empty{padding:14px 0;color:var(--muted)}
.time{display:flex;align-items:center;gap:6px}
.time select{font-family:var(--fd);font-size:30px;font-weight:600;background:var(--sunk);border:1px solid var(--line);border-radius:10px;padding:4px 8px;font-variant-numeric:tabular-nums}
.time span{font-family:var(--fd);font-size:28px;font-weight:600}
.time small{color:var(--muted);margin-left:4px}
.lbl{font-size:13px;font-weight:500}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chip{border:1px solid var(--line);background:none;border-radius:999px;padding:6px 12px;font-size:13px;cursor:pointer}
.chip.day{min-width:44px}
.chip.on{background:var(--accent-soft);border-color:var(--accent);color:var(--accent);font-weight:600}
.row{display:flex;gap:8px;justify-content:flex-end}
.btn{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--line);background:none;border-radius:10px;padding:8px 14px;font-size:13.5px;font-weight:500;cursor:pointer}
.btn svg{width:17px;height:17px}
.btn.pri{background:var(--accent);border-color:var(--accent);color:#fff}
.note{display:flex;gap:10px;align-items:flex-start;padding:10px 12px;border-radius:12px;font-size:13px}
.note small{display:block;font-size:12px}
.note.crit{background:var(--crit-soft);color:var(--crit)}
.note.acc{background:var(--accent-soft);color:var(--accent)}
`;
  }
}
customElements.define('wecker-card', WeckerCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: 'wecker-card', name: 'Wecker (Echo Spot)', description: 'Alexa-Wecker stellen, ändern, an/aus' });
