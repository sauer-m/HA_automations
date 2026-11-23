// bodyos-card: Gesundheits-Cockpit (Mockup Smarthome/bodyos-mockup.html, 23.11.2026).
// Quelle: Smarthome/ha/bodyos-card.js  ·  in HA: /config/www/bodyos-card.js, Ressource /local/bodyos-card.js?v=N
// Quellenregel: Scores, Schlaf, HRV, Temperatur, SpO2 aus Oura; Schritte/Distanz/Stockwerke/Gesamt-kcal aus
// Health Connect (Garmin, sensor.sm_f741b_*); aktive kcal aus Oura (HC liefert dort nur Einzelwerte). Nie addieren.
//
// type: custom:bodyos-card
// optional: steps_goal (7000), sport_goal (2), yoga_goal (2), kcal/protein/fat/carbs (2250/170/75/225),
//           tandoor_url (https://cookbook.sauerstofff.de, nur Essensplan), shopping_entity (todo.mealprep = Bring-Liste Mealprep),
//           meals: [{day: Mo, breakfast: .., lunch: ..}, ...]

const O = (k) => `sensor.oura_ring_${k}`;
const H = (k) => `sensor.sm_f741b_${k}`;
const E = {
  ready: O('readiness_score'), sleepScore: O('sleep_score'), act: O('activity_score'),
  hrv: O('average_sleep_hrv'), temp: O('temperature_deviation'), spo2: O('spo2_average'), ring: O('ring_battery_level'),
  sleep: O('total_sleep_duration'), deep: O('deep_sleep_duration'), rem: O('rem_sleep_duration'),
  light: O('light_sleep_duration'), awake: O('awake_time'), low: O('lowest_sleep_heart_rate'), sync: O('ring_last_sync'),
  activeKcal: O('active_calories'), breath: O('average_breathing_rate'),
  rhr: H('resting_heart_rate'), steps: H('daily_steps'), dist: H('daily_distance'), floors: H('daily_floors'),
  totalKcal: H('total_calories_burned'), weight: H('weight'), fat: H('body_fat'), lean: H('lean_body_mass'),
  weightIn: 'input_number.marcel_gewicht', fatIn: 'input_number.marcel_koerperfett',
  bb: 'sensor.garmin_connect_body_battery', bbLow: 'sensor.garmin_connect_body_battery_tiefstwert', bbHigh: 'sensor.garmin_connect_body_battery_hochstwert',
  tr: 'sensor.garmin_connect_trainingsbereitschaft', stress: 'sensor.garmin_connect_durchschnittliches_stresslevel',
  eaten: 'sensor.garmin_connect_aufgenommene_kalorien', acts: 'sensor.garmin_connect_letzte_aktivitaten',
  sport: 'counter.bodyos_sport_woche', yoga: 'counter.bodyos_yoga_woche',
};
const HIST = [E.bb, E.tr, E.stress, E.sleep, E.rhr, E.hrv, E.temp, E.weight, E.weightIn, E.fat, E.sport, E.yoga];
const C = { cyan: '#33e1ff', violet: '#9b7bff', lime: '#7dff9b', amber: '#ffbf47', pink: '#ff5fa2' };
const TAGK = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const de = (v, d = 0) => Number(v).toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });
const hm = (min) => { min = Math.round(min); return `${Math.floor(min / 60)}:${String(min % 60).padStart(2, '0')}`; };
const dayKey = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

const ICON = {
  logo: '<svg viewBox="0 0 32 32" fill="none" stroke="#33e1ff" stroke-width="2"><circle cx="16" cy="16" r="13" opacity=".35"/><path d="M4 17h6l3-7 4 13 3-8 2 2h6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  yoga: '<svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="2"/><path d="M12 7v6M6 11l6 2 6-2M8 20l4-7 4 7"/></svg>',
  sport: '<svg viewBox="0 0 24 24"><path d="M6 9v6M18 9v6M3 11v2M21 11v2M6 12h12"/></svg>',
  both: '<svg viewBox="0 0 24 24"><path d="M5 12l4 4 10-10"/></svg>',
  scale: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M8 9a5 5 0 0 1 8 0M12 9l1.5-2"/></svg>',
  cal: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  list: '<svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h10"/></svg>',
};

const CSS = `
:host{--bg:#0a0e16;--panel:rgba(16,24,38,.78);--line:rgba(120,200,255,.14);--ink:#e6f1ff;--ink2:#9fb3cc;--muted:#5f7390;
 --cyan:#33e1ff;--violet:#9b7bff;--lime:#7dff9b;--amber:#ffbf47;--pink:#ff5fa2;
 --fd:"Orbitron",system-ui,sans-serif;--fm:"JetBrains Mono",ui-monospace,monospace;--fb:"Inter",system-ui,sans-serif;display:block}
*{box-sizing:border-box}
.wrap{min-height:100%;color:var(--ink);font:14px/1.45 var(--fb);
 background:radial-gradient(600px 320px at 50% 0,rgba(51,225,255,.10),transparent 70%),
  linear-gradient(rgba(51,225,255,.035) 1px,transparent 1px) 0 0/22px 22px,
  linear-gradient(90deg,rgba(51,225,255,.035) 1px,transparent 1px) 0 0/22px 22px,var(--bg)}
.dash{max-width:1180px;margin:0 auto;padding:12px 12px 28px;display:grid;gap:12px}
@media(min-width:900px){.dash{grid-template-columns:repeat(3,1fr);padding:20px;gap:16px}.span2{grid-column:span 2}.span3{grid-column:1/-1}}
.top{display:flex;align-items:center;justify-content:space-between;gap:10px}
.logo{display:flex;align-items:center;gap:9px}.logo svg{width:28px;height:28px;filter:drop-shadow(0 0 6px var(--cyan))}
.logo b{font-family:var(--fd);font-size:18px;letter-spacing:.12em;background:linear-gradient(90deg,var(--cyan),var(--violet));-webkit-background-clip:text;background-clip:text;color:transparent}
.logo small{display:block;font-family:var(--fm);font-size:10px;color:var(--muted);letter-spacing:.12em}
.chip{font-family:var(--fm);font-size:10.5px;color:var(--ink2);border:1px solid var(--line);border-radius:999px;padding:3px 8px;display:inline-flex;gap:6px;align-items:center;white-space:nowrap}
.dot{width:7px;height:7px;border-radius:50%;background:var(--lime);box-shadow:0 0 8px var(--lime);animation:pulse 2.4s ease-in-out infinite}
.dot.warn{background:var(--amber);box-shadow:0 0 8px var(--amber)}
@keyframes pulse{50%{opacity:.5}}
.tabs{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;position:sticky;top:var(--header-height,0px);z-index:4;background:rgba(10,14,22,.88);backdrop-filter:blur(8px);padding:6px 0;margin:-6px 0 0}
.tabs::-webkit-scrollbar{display:none}
.tabs button{appearance:none;font:11px var(--fm);letter-spacing:.08em;text-transform:uppercase;color:var(--muted);background:none;padding:6px 10px;border:1px solid var(--line);border-radius:8px;white-space:nowrap;cursor:pointer}
.tabs button.on{color:var(--cyan);border-color:rgba(51,225,255,.5);box-shadow:0 0 12px rgba(51,225,255,.2) inset}
.panel{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:14px;position:relative;overflow:hidden;scroll-margin-top:calc(var(--header-height,0px) + 52px)}
.panel::after{content:"";position:absolute;top:-1px;left:16px;width:46px;height:2px;background:var(--c,var(--cyan));box-shadow:0 0 10px var(--c,var(--cyan));border-radius:2px}
.ph{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px}
.ph h2{margin:0;font-family:var(--fd);font-size:12px;letter-spacing:.16em;text-transform:uppercase}
.src{font-family:var(--fm);font-size:10px;color:var(--muted);text-align:right}
.big{font-family:var(--fd);font-weight:700;font-size:30px;line-height:1}
.unit{font-family:var(--fm);font-size:12px;color:var(--ink2);margin-left:3px}
.lbl{font-family:var(--fm);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}
.glow{text-shadow:0 0 14px currentColor}
.row{display:flex;justify-content:space-between;align-items:baseline;gap:8px}
.hero{display:grid;grid-template-columns:auto 1fr;gap:14px;align-items:center}
.ring{position:relative;width:150px;height:150px}.ring svg{width:100%;height:100%;transform:rotate(-90deg)}
.ring .center{position:absolute;inset:0;display:grid;place-content:center;text-align:center}
.legend{display:grid;gap:8px}.leg{display:grid;grid-template-columns:10px 1fr auto;gap:8px;align-items:center}
.leg i{width:10px;height:10px;border-radius:3px;background:var(--c);box-shadow:0 0 8px var(--c)}.leg b{font-family:var(--fd);font-size:16px}
.verdict{grid-column:1/-1;font-size:13px;color:var(--ink2);border-left:2px solid var(--vc,var(--lime));padding:6px 10px;background:linear-gradient(90deg,rgba(125,255,155,.08),transparent)}
.verdict b{color:var(--vc,var(--lime))}
.tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.tile{background:rgba(255,255,255,.025);border:1px solid var(--line);border-radius:12px;padding:9px 10px;display:grid;gap:3px;min-width:0}
.tile .v{font-family:var(--fd);font-size:20px;font-weight:700;white-space:nowrap}
.tile .d{font-family:var(--fm);font-size:10px}
.up{color:var(--lime)}.down{color:var(--amber)}.flat{color:var(--ink2)}
.spark{width:100%;height:22px;display:block}
.sleepbar{display:flex;height:12px;border-radius:6px;overflow:hidden;gap:2px;margin:10px 0 6px}.sleepbar span{height:100%}
.keys{display:flex;flex-wrap:wrap;gap:6px 12px;font-family:var(--fm);font-size:10.5px;color:var(--ink2)}
.keys i{display:inline-block;width:8px;height:8px;border-radius:2px;margin-right:5px}
.bars7{position:relative;display:grid;grid-template-columns:repeat(7,1fr);gap:6px;height:84px;margin-top:12px}
.bars7 div{display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:4px;height:100%}
.bars7 span{width:100%;max-width:26px;min-height:2px;border-radius:5px 5px 2px 2px;background:linear-gradient(180deg,var(--violet),rgba(155,123,255,.15));box-shadow:0 0 10px rgba(155,123,255,.35)}
.bars7 span.today{background:linear-gradient(180deg,var(--cyan),rgba(51,225,255,.15));box-shadow:0 0 12px rgba(51,225,255,.5)}
.bars7 em{font-style:normal;font-family:var(--fm);font-size:9.5px;color:var(--muted)}
.goal{position:absolute;left:0;right:0;border-top:1px dashed rgba(255,191,71,.5);font-family:var(--fm);font-size:9px;color:var(--amber);line-height:0;pointer-events:none}
.goal span{position:relative;top:-6px;background:var(--bg);padding:0 3px}
.track{height:14px;border-radius:7px;background:rgba(255,255,255,.06);position:relative;overflow:hidden}
.fill{position:absolute;inset:0 auto 0 0;border-radius:7px;background:linear-gradient(90deg,var(--c1),var(--c2));box-shadow:0 0 14px var(--c2)}
.week{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-top:10px}
.day{aspect-ratio:1;border-radius:10px;border:1px solid var(--line);display:grid;place-items:center;font-family:var(--fm);font-size:10px;color:var(--muted)}
.day.sport{border-color:rgba(51,225,255,.6);color:var(--cyan);box-shadow:0 0 10px rgba(51,225,255,.25) inset}
.day.yoga{border-color:rgba(155,123,255,.7);color:var(--violet);box-shadow:0 0 10px rgba(155,123,255,.3) inset}
.day.both{border-color:rgba(125,255,155,.7);color:var(--lime);box-shadow:0 0 10px rgba(125,255,155,.3) inset}
.day.today{outline:1px dashed var(--ink2);outline-offset:2px}
.day svg,.btn svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
.mini{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.mr{display:flex;gap:8px;align-items:center;appearance:none;background:rgba(255,255,255,.025);border:1px solid var(--line);border-radius:12px;padding:6px 8px;color:inherit;font:inherit;cursor:pointer;text-align:left;user-select:none;-webkit-user-select:none;touch-action:manipulation}
.mr:active{transform:scale(.98)}.mr svg{width:46px;height:46px;transform:rotate(-90deg);flex:none}
.mr b{font-family:var(--fd);font-size:18px}.mr .plus{margin-left:auto;font-family:var(--fd);font-size:18px;color:var(--c)}
.hint{font-size:11px;color:var(--muted);margin-top:6px}
.placeholder{border:1px dashed rgba(255,191,71,.45);border-radius:12px;padding:12px;display:grid;gap:10px;background:repeating-linear-gradient(135deg,rgba(255,191,71,.04) 0 8px,transparent 8px 16px)}
.btn{appearance:none;border:1px solid rgba(255,191,71,.6);background:rgba(255,191,71,.1);color:var(--amber);font:600 12px var(--fm);letter-spacing:.08em;text-transform:uppercase;border-radius:10px;padding:9px 12px;cursor:pointer;display:inline-flex;gap:8px;align-items:center;justify-content:center;text-decoration:none}
.btn.cyan{border-color:rgba(51,225,255,.55);background:rgba(51,225,255,.08);color:var(--cyan)}
.macro{display:grid;grid-template-columns:62px 1fr 78px;gap:8px;align-items:center}.macro .track{height:10px}
.macro .n{font-family:var(--fm);font-size:11px;color:var(--ink2);text-align:right}
.kcal{display:flex;align-items:center;gap:12px}
.meals{display:grid;gap:6px}
.meal{display:grid;grid-template-columns:30px 1fr auto;gap:8px;align-items:center;padding:7px 9px;border:1px solid var(--line);border-radius:10px;background:rgba(255,255,255,.02)}
.meal.today{border-color:rgba(51,225,255,.5);background:rgba(51,225,255,.06)}
.meal .dd{font-family:var(--fd);font-size:11px;color:var(--cyan)}
.meal .t{font-size:12.5px;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.meal .t small{display:block;color:var(--muted);font-size:11px;overflow:hidden;text-overflow:ellipsis}
.meal .k{font-family:var(--fm);font-size:10.5px;color:var(--ink2);text-align:right;white-space:nowrap}
.btns{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}
.foot{font-family:var(--fm);font-size:10px;color:var(--muted);text-align:center;letter-spacing:.08em}
.na{color:var(--muted)}
`;

function ring(r, w, val, col) {
  const c = 2 * Math.PI * r, v = Math.max(0, Math.min(100, Number(val) || 0));
  return `<circle cx="60" cy="60" r="${r}" stroke="rgba(255,255,255,.07)" stroke-width="${w}" fill="none"/>` +
    `<circle cx="60" cy="60" r="${r}" stroke="${col}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - v / 100)}" style="filter:drop-shadow(0 0 5px ${col});transition:stroke-dashoffset 1s"/>`;
}
function spark(vals, col) {
  const v = (vals || []).filter((x) => isFinite(x));
  if (v.length < 2) return '<svg class="spark"></svg>';
  const mn = Math.min(...v), mx = Math.max(...v), W = 100, Hh = 22;
  const p = v.map((x, i) => [i * W / (v.length - 1), Hh - 2 - (x - mn) / ((mx - mn) || 1) * (Hh - 4)]);
  return `<svg class="spark" viewBox="0 0 ${W} ${Hh}" preserveAspectRatio="none"><polyline points="${p.map((q) => q.join(',')).join(' ')}" fill="none" stroke="${col}" stroke-width="1.8" vector-effect="non-scaling-stroke" style="filter:drop-shadow(0 0 3px ${col})"/><circle cx="${p.at(-1)[0]}" cy="${p.at(-1)[1]}" r="2.2" fill="${col}"/></svg>`;
}

class BodyOSCard extends HTMLElement {
  setConfig(c) {
    this._c = Object.assign({ steps_goal: 7000, sport_goal: 2, yoga_goal: 2, kcal: 2250, protein: 170, fat: 75, carbs: 225,
      sleep_goal_h: 7.5, min_activity_min: 10, tandoor_url: 'https://cookbook.sauerstofff.de', shopping_entity: 'todo.mealprep', meals: [],
      breakfast_kcal: 500, breakfast_protein: 35, lunch_kcal: 750, lunch_protein: 50 }, c || {});
  }
  getCardSize() { return 30; }
  set hass(h) {
    this._hass = h;
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `<style>${CSS}</style><div class="wrap"><div class="dash" id="d"></div></div>`;
      this.shadowRoot.addEventListener('click', (e) => this._click(e));
      this._bindPress();
      if (!document.querySelector('link[data-bodyos-fonts]')) {
        const l = document.createElement('link'); l.rel = 'stylesheet'; l.dataset.bodyosFonts = '1';
        l.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Orbitron:wght@500;700&family=JetBrains+Mono:wght@400;600&display=swap';
        document.head.appendChild(l);
      }
    }
    const sig = Object.values(E).map((id) => h.states[id]?.state).join('|') + (h.states[E.acts]?.last_updated || '');
    if (sig !== this._sig) { this._sig = sig; this._render(); }
    if (!this._histAt || Date.now() - this._histAt > 15 * 60e3) this._loadHist();
  }
  async _loadHist() {
    this._histAt = Date.now();
    const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - 30);
    try {
      const r = await this._hass.callWS({ type: 'history/history_during_period', start_time: start.toISOString(), entity_ids: HIST,
        minimal_response: true, no_attributes: true, significant_changes_only: false });
      this._hist = r; this._render();
    } catch (e) { console.warn('bodyos-card history', e); }
  }
  // letzter gültiger Wert je Kalendertag (lokal) für die letzten n Tage, ältester zuerst; heute inkl. Livewert
  _daily(id, n, conv = (x) => x) {
    const rows = this._hist?.[id] || [], map = {};
    for (const r of rows) {
      const v = parseFloat(r.s); if (!isFinite(v)) continue;
      const t = r.lu ?? r.lc; map[dayKey(new Date(t * 1000))] = conv(v);
    }
    const out = [], d = new Date();
    for (let i = n - 1; i >= 0; i--) { const x = new Date(d); x.setDate(d.getDate() - i); out.push(map[dayKey(x)]); }
    const live = this._n(id); if (live != null) out[out.length - 1] = conv(live);
    return out;
  }
  _n(id) { const v = parseFloat(this._hass.states[id]?.state); return isFinite(v) ? v : null; }
  _click(e) {
    const t = e.target.closest('[data-jump],[data-more],[data-nav]'); if (!t) return;
    if (t.dataset.nav) {
      e.preventDefault();
      history.pushState(null, '', t.dataset.nav);
      window.dispatchEvent(new CustomEvent('location-changed', { detail: { replace: false } }));
    } else if (t.dataset.jump) {
      const el = this.shadowRoot.getElementById(t.dataset.jump);
      this.shadowRoot.querySelectorAll('.tabs button').forEach((b) => b.classList.toggle('on', b === t));
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (t.dataset.more) {
      this.dispatchEvent(new CustomEvent('hass-more-info', { bubbles: true, composed: true, detail: { entityId: t.dataset.more } }));
    }
  }
  // Trainingsringe: Tippen = +1, lange drücken (600 ms) = -1
  _bindPress() {
    const sr = this.shadowRoot; let timer = null, long = false, btn = null;
    sr.addEventListener('pointerdown', (e) => {
      btn = e.target.closest('[data-counter]'); if (!btn) return; long = false;
      timer = setTimeout(() => { long = true; this._count(btn.dataset.counter, 'decrement'); }, 600);
    });
    const end = (e) => {
      if (!btn) return; clearTimeout(timer);
      if (e.type === 'pointerup' && !long && e.target.closest('[data-counter]') === btn) this._count(btn.dataset.counter, 'increment');
      btn = null;
    };
    sr.addEventListener('pointerup', end); sr.addEventListener('pointercancel', end);
    sr.addEventListener('contextmenu', (e) => { if (e.target.closest('[data-counter]')) e.preventDefault(); });
  }
  _count(id, op) {
    this._hass.callService('counter', op, { entity_id: id });
    setTimeout(() => { this._histAt = 0; this._loadHist(); }, 1500);
  }

  _render() {
    if (!this._hass || !this._c) return;
    const c = this._c, n = (id) => this._n(id), d = this.shadowRoot.getElementById('d');
    const now = new Date();
    const ready = n(E.ready), sScore = n(E.sleepScore), act = n(E.act);
    const rhr = n(E.rhr), hrv = n(E.hrv), temp = n(E.temp), spo2 = n(E.spo2), ringB = n(E.ring);
    const rhrD = this._daily(E.rhr, 8), hrvD = this._daily(E.hrv, 8), tempD = this._daily(E.temp, 8);
    const avg = (a) => { const v = a.slice(0, -1).filter((x) => x != null); return v.length ? v.reduce((s, x) => s + x, 0) / v.length : null; };
    const rhrA = avg(rhrD), hrvA = avg(hrvD);

    // Urteil
    let vc = 'var(--lime)', vt = '';
    const hints = [];
    if (hrv != null && hrvA != null) hints.push(hrv >= hrvA ? 'HRV über deinem Schnitt' : 'HRV unter deinem Schnitt');
    if (rhr != null && rhrA != null && rhr > rhrA + 3) hints.push('Ruhepuls erhöht');
    if (temp != null && temp > 0.5) hints.push('Temperatur erhöht');
    if (ready == null) { vc = 'var(--muted)'; vt = '<b>Keine Readiness.</b> Ring synchronisieren.'; }
    else if (ready >= 85) vt = `<b>Grünes Licht.</b> ${hints.join(', ') || 'Gut erholt'}. Guter Tag für Krafttraining.`;
    else if (ready >= 70) { vc = 'var(--cyan)'; vt = `<b>Solide.</b> ${hints.join(', ') || 'Normal erholt'}. Training normal, nicht ans Limit.`; }
    else { vc = 'var(--amber)'; vt = `<b>Erholung zuerst.</b> ${hints.join(', ') || 'Wenig erholt'}. Heute lieber Yoga oder Spaziergang.`; }

    const tile = (lbl, v, u, dl, cls, vals, col, id) => `<div class="tile" data-more="${id}" style="cursor:pointer"><span class="lbl">${lbl}</span><span class="v">${v == null ? '<span class="na">—</span>' : v}<span class="unit">${u}</span></span><span class="d ${cls}">${dl}</span>${spark(vals, col)}</div>`;
    const delta = (v, a, unit, goodLow) => {
      if (v == null || a == null) return ['', 'flat'];
      const dd = Math.round(v - a); if (dd === 0) return ['= Ø 7 Tage', 'flat'];
      const good = goodLow ? dd < 0 : dd > 0;
      return [`${dd > 0 ? '▲' : '▼'} ${Math.abs(dd)} ggü. Ø`, good ? 'up' : 'down'];
    };
    const [rhrT, rhrC] = delta(rhr, rhrA, 'bpm', true), [hrvT, hrvC] = delta(hrv, hrvA, 'ms', false);
    const tempOk = temp == null || Math.abs(temp) < 0.3;
    const bb = n(E.bb), bbLo = n(E.bbLow), bbHi = n(E.bbHigh), trS = n(E.tr), st = n(E.stress);
    const bbD = this._daily(E.bb, 8), trD = this._daily(E.tr, 8), stD = this._daily(E.stress, 8);
    const TRL = { PRIME: 'top', HIGH: 'hoch', MODERATE: 'mittel', LOW: 'niedrig', POOR: 'schwach' };
    const trTxt = TRL[this._hass.states[E.tr]?.attributes?.level] || '';

    // Schlaf
    const sl = n(E.sleep), ph = [['Tief', n(E.deep), C.violet], ['REM', n(E.rem), C.cyan], ['Leicht', n(E.light), '#3b5a8a'], ['Wach', n(E.awake), '#5a2c40']];
    const tot = ph.reduce((s, p) => s + (p[1] || 0), 0) || 1;
    const sleepD = this._daily(E.sleep, 7), maxH = Math.max(9, ...sleepD.filter((x) => x != null));
    const barH = 64, goalPx = c.sleep_goal_h / maxH * barH + 17;

    // Aktivität
    const steps = n(E.steps), pct = steps == null ? 0 : Math.min(100, steps / c.steps_goal * 100);
    const dist = n(E.dist), floors = n(E.floors), aK = n(E.activeKcal), tK = n(E.totalKcal);

    // Training
    const monday = new Date(now); monday.setHours(0, 0, 0, 0); monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
    const marks = {};
    // Garmin-Aktivitäten dieser Woche (auch die aus MyFitnessPal): Yoga = Yoga, Gehen zählt nicht (steckt in Schritten),
    // alles andere ab min_activity_min Minuten = Sport. Zähler (Tippen) kommen für nicht erfasste Einheiten dazu.
    const actsW = (this._hass.states[E.acts]?.attributes?.last_activities || []).map((a) => {
      const t = new Date(a.startTime), ty = String(a.activityType || '').toLowerCase(), nm = String(a.activityName || '');
      const kind = ty.includes('yoga') || /yoga/i.test(nm) ? 'yoga' : (ty === 'walking' || ty.includes('walk') || (a.duration || 0) < c.min_activity_min * 60) ? null : 'sport';
      return { t, kind, name: nm.replace(/ - MyFitnessPal$/, ''), min: Math.round((a.duration || 0) / 60), mfp: / - MyFitnessPal$/.test(nm) };
    }).filter((a) => a.kind && a.t >= monday && !isNaN(a.t)).sort((a, b) => b.t - a.t);
    const gSp = actsW.filter((a) => a.kind === 'sport').length, gYo = actsW.filter((a) => a.kind === 'yoga').length;
    const sp = (n(E.sport) ?? 0) + gSp, yo = (n(E.yoga) ?? 0) + gYo;
    for (const a of actsW) { const k = dayKey(a.t); marks[k] = marks[k] && marks[k] !== a.kind ? 'both' : a.kind; }
    const lastAct = actsW[0];
    for (const [id, kind] of [[E.sport, 'sport'], [E.yoga, 'yoga']]) {
      let prev = null;
      for (const r of this._hist?.[id] || []) {
        const v = parseFloat(r.s), t = new Date((r.lu ?? r.lc) * 1000);
        if (isFinite(v) && prev != null && v > prev && t >= monday) { const k = dayKey(t); marks[k] = marks[k] && marks[k] !== kind ? 'both' : kind; }
        if (isFinite(v)) prev = v;
      }
    }
    const week = [...Array(7)].map((_, i) => {
      const x = new Date(monday); x.setDate(monday.getDate() + i);
      const m = marks[dayKey(x)] || '', today = dayKey(x) === dayKey(now);
      return `<div class="day ${m} ${today ? 'today' : ''}">${m ? ICON[m] : TAGK[x.getDay()]}</div>`;
    }).join('');
    const mr = (lbl, v, g, col, id) => `<button class="mr" data-counter="${id}" style="--c:${col}"><svg viewBox="0 0 120 120">${ring(48, 14, v / g * 100, col)}</svg><div><div class="lbl">${lbl}</div><b>${de(v)}</b><span class="unit">/ ${g}</span></div><span class="plus">+</span></button>`;

    // Körper
    let w = n(E.weight); if (w != null && w > 500) w /= 1000; if (w == null) w = n(E.weightIn);
    let fat = n(E.fat); if (fat == null) { const fi = n(E.fatIn); if (fi != null && fi > 3) fat = fi; }
    let lean = n(E.lean); if (lean != null && lean > 500) lean /= 1000; if (lean == null && w != null && fat != null) lean = w * (1 - fat / 100);
    const wD = this._daily(E.weight, 30, (x) => x > 500 ? x / 1000 : x).filter((x) => x != null);
    const wTrend = wD.length >= 2 ? wD.at(-1) - wD[0] : null;
    const body = w == null
      ? `<div class="placeholder"><div style="font-size:12px;color:var(--ink2)">Noch kein Gewicht. Ziel Rekomposition: Fett ↓, Magermasse halten oder ↑.</div><button class="btn" data-more="${E.weightIn}">${ICON.scale}Waage verbinden</button></div>`
      : `<div class="tiles">
          <div class="tile" data-more="${E.weight}" style="cursor:pointer"><span class="lbl">Gewicht</span><span class="v">${de(w, 1)}<span class="unit">kg</span></span><span class="d ${wTrend == null ? 'flat' : wTrend <= 0 ? 'up' : 'down'}">${wTrend == null ? 'Trend folgt' : `${wTrend > 0 ? '▲' : '▼'} ${de(Math.abs(wTrend), 1)} / 30 T`}</span>${spark(wD, C.amber)}</div>
          <div class="tile"><span class="lbl">Körperfett</span><span class="v">${fat == null ? '<span class="na">—</span>' : de(fat, 1)}<span class="unit">%</span></span><span class="d flat">${fat == null ? 'Waage misst noch nicht' : 'Ziel ↓'}</span></div>
          <div class="tile"><span class="lbl">Magermasse</span><span class="v">${lean == null ? '<span class="na">—</span>' : de(lean, 1)}<span class="unit">kg</span></span><span class="d flat">${lean == null ? 'braucht Körperfett' : 'Ziel halten ↑'}</span></div>
        </div>`;

    // Ernährung + Mealprep
    const eat = n(E.eaten);
    const macros = [['Eiweiß', c.protein, C.pink], ['Fett', c.fat, C.amber], ['Kohlenh.', c.carbs, C.cyan]]
      .map(([l, g, col]) => `<div class="macro"><span class="lbl">${l}</span><div class="track"><div class="fill" style="width:0%;--c1:${col};--c2:${col}"></div></div><span class="n">— / ${g} g</span></div>`).join('');
    const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr'], todayK = TAGK[now.getDay()];
    const dayKcal = c.breakfast_kcal + c.lunch_kcal, dayP = c.breakfast_protein + c.lunch_protein;
    const meals = days.map((dn) => {
      const m = (c.meals || []).find((x) => String(x.day).slice(0, 2) === dn) || {};
      const lunch = m.lunch ? esc(m.lunch) : `<span class="na">Mittag ~${c.lunch_kcal} kcal · ${c.lunch_protein} g EW</span>`;
      const br = m.breakfast ? `Frühstück: ${esc(m.breakfast)}` : `Frühstück ~${c.breakfast_kcal} kcal · ${c.breakfast_protein} g EW`;
      return `<div class="meal ${dn === todayK ? 'today' : ''}"><span class="dd">${dn.toUpperCase()}</span><span class="t">${lunch}<small>${br}</small></span><span class="k">${de(dayKcal)} kcal<br>${dayP} g EW</span></div>`;
    }).join('');
    const tu = String(c.tandoor_url).replace(/\/$/, '');
    const shopUrl = `/todo?entity_id=${encodeURIComponent(c.shopping_entity)}`, shopN = n(c.shopping_entity);

    const syncS = this._hass.states[E.sync]?.state, sync = syncS && !isNaN(Date.parse(syncS)) ? new Date(syncS) : null;
    const fmtT = (t) => t.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    const ok = (id) => this._hass.states[id] && !['unknown', 'unavailable'].includes(this._hass.states[id].state);

    d.innerHTML = `
    <div class="top span3">
      <div class="logo">${ICON.logo}<div><b>BODYOS</b><small>${TAGK[now.getDay()].toUpperCase()} ${now.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })} · ${fmtT(now)}</small></div></div>
      <span style="display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end"><span class="chip" data-more="${E.ring}" style="cursor:pointer"><span class="dot ${ringB != null && ringB < 20 ? 'warn' : ''}"></span>Ring ${ringB == null ? '—' : de(ringB)} %</span></span>
    </div>
    <nav class="tabs span3">
      <button class="on" data-jump="s-heute">Heute</button><button data-jump="s-schlaf">Schlaf</button><button data-jump="s-aktiv">Aktivität</button><button data-jump="s-koerper">Körper</button><button data-jump="s-ernaehrung">Ernährung</button>
    </nav>

    <section class="panel" id="s-heute" style="--c:var(--lime)">
      <div class="ph"><h2>Readiness</h2><span class="src">OURA</span></div>
      <div class="hero">
        <div class="ring" data-more="${E.ready}" style="cursor:pointer"><svg viewBox="0 0 120 120">${ring(54, 8, ready, C.lime)}${ring(42, 8, sScore, C.violet)}${ring(30, 8, act, C.cyan)}</svg>
          <div class="center"><span class="big glow" style="font-size:38px;color:${ready == null ? 'var(--muted)' : ready >= 70 ? C.lime : C.amber}">${ready ?? '—'}</span><span class="lbl" style="font-size:8.5px">bereit</span></div></div>
        <div class="legend">${[['Readiness', ready, C.lime, E.ready], ['Schlaf', sScore, C.violet, E.sleepScore], ['Aktivität', act, C.cyan, E.act]]
          .map(([l, v, col, id]) => `<div class="leg" style="--c:${col};cursor:pointer" data-more="${id}"><i></i><span class="lbl">${l}</span><b>${v ?? '—'}</b></div>`).join('')}</div>
        <div class="verdict" style="--vc:${vc}">${vt}</div>
      </div>
    </section>

    <section class="panel" style="--c:var(--pink)">
      <div class="ph"><h2>Vitalwerte</h2><span class="src">OURA · GARMIN</span></div>
      <div class="tiles">
        ${tile('Ruhepuls', rhr == null ? null : de(rhr), 'bpm', rhrT, rhrC, rhrD, C.pink, E.rhr)}
        ${tile('HRV', hrv == null ? null : de(hrv), 'ms', hrvT, hrvC, hrvD, C.lime, E.hrv)}
        ${tile('Temp.', temp == null ? null : (temp > 0 ? '+' : '') + de(temp, 1), '°C', temp == null ? '' : tempOk ? 'im Rahmen' : temp > 0 ? 'erhöht' : 'niedrig', tempOk ? 'flat' : 'down', tempD, C.amber, E.temp)}
      </div>
      <div class="tiles" style="margin-top:8px">
        ${tile('Body Battery', bb == null ? null : de(bb), '%', bbLo == null ? '' : `heute ${de(bbLo)}–${de(bbHi)} %`, bb == null ? 'flat' : bb >= 50 ? 'up' : 'down', bbD, C.cyan, E.bb)}
        ${tile('Bereitschaft', trS == null ? null : de(trS), '%', trTxt, trS == null ? 'flat' : trS >= 60 ? 'up' : 'down', trD, C.lime, E.tr)}
        ${tile('Stress Ø', st == null ? null : de(st), '', st == null ? '' : st <= 25 ? 'ruhig' : st <= 50 ? 'mittel' : 'hoch', st == null ? 'flat' : st <= 25 ? 'up' : st <= 50 ? 'flat' : 'down', stD, C.violet, E.stress)}
      </div>
    </section>

    <section class="panel" id="s-schlaf" style="--c:var(--violet)">
      <div class="ph"><h2>Schlaf</h2><span class="src">OURA</span></div>
      <div class="row"><div data-more="${E.sleep}" style="cursor:pointer"><span class="big glow" style="color:var(--violet)">${sl == null ? '—' : hm(sl * 60)}</span><span class="unit">h</span></div>
        <div style="text-align:right"><div class="lbl">Tiefster Puls</div><b style="font-family:var(--fd)">${n(E.low) ?? '—'}</b><span class="unit">bpm</span></div></div>
      <div class="sleepbar">${ph.map(([, h, col]) => `<span style="width:${(h || 0) / tot * 100}%;background:${col};box-shadow:0 0 8px ${col}"></span>`).join('')}</div>
      <div class="keys">${ph.map(([l, h, col]) => `<span><i style="background:${col}"></i>${l} ${h == null ? '—' : hm(h * 60)}</span>`).join('')}<span>SpO₂ ${spo2 == null ? '—' : de(spo2)} %</span></div>
      <div class="bars7">
        <div class="goal" style="bottom:${goalPx}px"><span>Ziel ${hm(c.sleep_goal_h * 60)}</span></div>
        ${sleepD.map((h, i) => { const x = new Date(now); x.setDate(now.getDate() - 6 + i);
          return `<div><span class="${i === 6 ? 'today' : ''}" style="height:${h == null ? 2 : Math.round(h / maxH * barH)}px" title="${h == null ? '' : hm(h * 60)}"></span><em>${TAGK[x.getDay()]}</em></div>`; }).join('')}
      </div>
    </section>

    <section class="panel span2" id="s-aktiv" style="--c:var(--cyan)">
      <div class="ph"><h2>Aktivität</h2><span class="src">GARMIN · HEALTH CONNECT</span></div>
      <div class="row" data-more="${E.steps}" style="cursor:pointer"><div><span class="big glow" style="color:var(--cyan)">${steps == null ? '—' : de(steps)}</span><span class="unit">/ ${de(c.steps_goal)} Schritte</span></div>
        <span class="chip">${steps == null ? '' : steps >= c.steps_goal ? 'Ziel erreicht ✓' : `noch ${de(c.steps_goal - steps)}`}</span></div>
      <div class="track" style="margin-top:6px"><div class="fill" style="width:${pct}%;--c1:#1a6fff;--c2:var(--cyan)"></div></div>
      <div class="tiles" style="margin-top:12px">
        <div class="tile"><span class="lbl">Distanz</span><span class="v">${dist == null ? '—' : de(dist / 1000, 1)}<span class="unit">km</span></span></div>
        <div class="tile"><span class="lbl">Stockwerke</span><span class="v">${floors == null ? '—' : de(floors)}</span></div>
        <div class="tile" data-more="${E.activeKcal}" style="cursor:pointer"><span class="lbl">Aktiv · Oura</span><span class="v" style="color:var(--amber)">${aK == null ? '—' : de(aK)}<span class="unit">kcal</span></span></div>
      </div>
      <div class="row" style="margin-top:8px"><span class="lbl">Verbrauch bisher heute · Garmin</span><span style="font-family:var(--fm);font-size:12px">${tK == null ? '—' : de(tK)} kcal</span></div>
    </section>

    <section class="panel" style="--c:var(--violet)">
      <div class="ph"><h2>Trainingswoche</h2><span class="src">GARMIN · ZIEL ${c.sport_goal}+${c.yoga_goal}</span></div>
      <div class="mini">${mr('Sport', sp, c.sport_goal, C.cyan, E.sport)}${mr('Yoga', yo, c.yoga_goal, C.violet, E.yoga)}</div>
      <div class="week">${week}</div>
      ${lastAct ? `<div class="row" style="margin-top:10px"><span class="lbl">Zuletzt</span><span style="font-size:12px;color:var(--ink2)">${esc(lastAct.name)} · ${TAGK[lastAct.t.getDay()]} · ${lastAct.min} min${lastAct.mfp ? ' · MFP' : ''}</span></div>` : ''}
      <div class="hint">Zählt automatisch aus Garmin (auch in MyFitnessPal eingetragene Einheiten, Gehen nicht). Tippen = nicht erfasste Einheit dazu · lange drücken = zurücknehmen</div>
    </section>

    <section class="panel" id="s-koerper" style="--c:var(--amber)">
      <div class="ph"><h2>Körper</h2><span class="src">MI SCALE 2 · HEALTH CONNECT</span></div>
      ${body}
    </section>

    <section class="panel" id="s-ernaehrung" style="--c:var(--lime)">
      <div class="ph"><h2>Ernährung</h2><span class="src">MYFITNESSPAL · ÜBER GARMIN</span></div>
      <div class="kcal">
        <div class="ring" style="width:84px;height:84px"><svg viewBox="0 0 120 120">${eat == null ? `${ring(50, 12, 0, C.lime)}<circle cx="60" cy="60" r="50" stroke="rgba(125,255,155,.35)" stroke-width="12" fill="none" stroke-dasharray="4 7"/>` : ring(50, 12, eat / c.kcal * 100, eat > c.kcal * 1.05 ? C.amber : C.lime)}</svg><div class="center" data-more="${E.eaten}" style="cursor:pointer"><span class="lbl">Ist</span><b style="font-family:var(--fd)">${eat == null ? '—' : de(eat)}</b></div></div>
        <div><div class="lbl">Tagesziel</div><span class="big" style="font-size:24px">${de(c.kcal)}</span><span class="unit">kcal</span>
          <div style="font-size:11.5px;color:${eat ? 'var(--ink2)' : 'var(--amber)'};margin-top:2px">${eat == null ? 'Keine Daten von Garmin' : eat === 0 ? 'Heute noch nichts in MyFitnessPal' : eat <= c.kcal ? `noch ${de(c.kcal - eat)} kcal frei` : `${de(eat - c.kcal)} kcal über Ziel`}</div>
          <div style="font-size:11px;color:var(--muted);margin-top:2px">Makros folgen (MFP-Brücke)</div></div>
      </div>
      <div style="display:grid;gap:8px;margin-top:12px">${macros}</div>
    </section>

    <section class="panel span2" style="--c:var(--cyan)">
      <div class="ph"><h2>Mealprep-Woche</h2><span class="src">TANDOOR · BRING</span></div>
      <div class="meals">${meals}</div>
      <div class="row" style="margin-top:10px"><span class="lbl">Vorgeplant Mo–Fr</span><span style="font-family:var(--fm);font-size:11px;color:var(--ink2)">≈ ${de(dayKcal)} kcal · ${dayP} g Eiweiß / Tag</span></div>
      <div class="btns"><a class="btn cyan" href="${esc(tu)}/mealplan" target="_blank" rel="noopener">${ICON.cal}Essensplan</a><a class="btn cyan" href="${esc(shopUrl)}" data-nav="${esc(shopUrl)}">${ICON.list}Einkaufsliste${shopN ? ` (${shopN})` : ''}</a></div>
    </section>

    <div class="foot span3">SYNC ${sync ? fmtT(sync) : '—'} · OURA ${ok(E.ready) ? '✓' : '—'} · HEALTH CONNECT ${ok(E.steps) ? '✓' : '—'} · WAAGE ${w != null ? '✓' : '—'} · MFP —</div>`;
  }
}
customElements.define('bodyos-card', BodyOSCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: 'bodyos-card', name: 'BodyOS', description: 'Gesundheits-Cockpit (Oura, Garmin, Waage, Ernährung)' });
