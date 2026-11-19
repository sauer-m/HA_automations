// briefing-card: Tagesbriefing als strukturierte Ansicht (Mockup claude.ai/artifact/5KujK5xZcFVBEnfAMxgSzL).
// Liest den Markdown-Text aus dem Attribut "voll" des Briefing-Sensors (A.R.E.S.) und zerlegt ihn in Abschnitte.
// Unbekannte Abschnitte erscheinen als einfache Liste, leere werden ausgeblendet.
// Quelle: Smarthome/ha/briefing-card.js
//
// type: custom:briefing-card
// entity: sensor.briefing
// push:    [{ label: Werktag, time: input_datetime.x, on: input_boolean.y }, ...]
// targets: [{ label: Samsung, on: input_boolean.z }, ...]

const BI = {
  cloud: 'M7 18a5 5 0 1 1 9.5-3H17a3.5 3.5 0 0 1 0 7z',
  sun: 'M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  rain: 'M7 15a5 5 0 1 1 9.5-3H17a3.5 3.5 0 0 1 0 7H7zM9 21l1-2M13 21l1-2',
  cal: 'M4 5h16v16H4zM4 10h16M9 3v4M15 3v4',
  car: 'M5 16h14M6 16l1.5-6h9L18 16M7 19v-3M17 19v-3',
  mail: 'M3 6h18v12H3zM3 6l9 7 9-7',
  thermo: 'M10 14V5a2 2 0 0 1 4 0v9a4 4 0 1 1-4 0z',
  phone: 'M7 2h10v20H7zM11 18h2',
  battery: 'M3 7h15v10H3zM21 10v4M6 10v4',
  gift: 'M3 10h18v4H3zM5 14h14v7H5zM12 10v11M12 10c-2-4-6-4-6-1.5S10 10 12 10c2 0 6 1 6-1.5S14 6 12 10',
  sync: 'M20 11a8 8 0 0 0-14.5-4.5M4 4v3h3M4 13a8 8 0 0 0 14.5 4.5M20 20v-3h-3',
  spark: 'M12 3l2 7 7 2-7 2-2 7-2-7-7-2 7-2z',
  bell: 'M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4',
  home: 'M3 10.5 12 3l9 7.5V21H3z',
  dot: 'M12 10a2 2 0 1 0 0 4a2 2 0 1 0 0-4',
  info: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18M12 11v6M12 7.5h.01',
  chev: 'M9 6l6 6-6 6',
};
const bic = (k) => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="${BI[k] || BI.dot}"/></svg>`;
const besc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const bnum = (s, d = 1) => { const v = parseFloat(String(s).replace(',', '.')); return isFinite(v) ? v.toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }) : s; };
const BTAGE = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
const BTAGK = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
const BMON = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
const WXICON = (t) => /regen|schauer|niesel/i.test(t) ? 'rain' : /sonn|klar|heiter/i.test(t) ? 'sun' : 'cloud';
const EMPTY = /^(keine|nichts)\b/i;

class BriefingCard extends HTMLElement {
  setConfig(c) {
    if (!c || !c.entity) throw new Error('entity fehlt (z. B. sensor.briefing)');
    this._c = c; this._open = false; this._sig = '';
  }
  getCardSize() { return 12; }

  set hass(h) {
    this._hass = h;
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.addEventListener('click', (e) => this._click(e));
      if (!document.getElementById('wk-fonts')) {
        const l = document.createElement('link');
        l.id = 'wk-fonts'; l.rel = 'stylesheet';
        l.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600&display=swap';
        document.head.appendChild(l);
      }
    }
    const ids = [this._c.entity, ...(this._c.push || []).flatMap((p) => [p.time, p.on]), ...(this._c.targets || []).map((t) => t.on)];
    const sig = ids.map((id) => { const o = h.states[id]; return o ? o.last_updated : '-'; }).join('|') + '|' + (h.themes && h.themes.darkMode) + '|' + Math.floor(Date.now() / 60000);
    if (sig !== this._sig) { this._sig = sig; this._render(); }
  }

  _o(id) { return this._hass.states[id]; }
  _s(id) { const o = this._o(id); return o ? o.state : 'unavailable'; }
  _a(id, k) { const o = this._o(id); return o ? o.attributes[k] : undefined; }

  _click(e) {
    const el = e.target.closest('[data-mi],[data-tg],summary');
    if (!el) return;
    if (el.tagName === 'SUMMARY') { e.preventDefault(); this._open = !this._open; this._render(); return; }
    if (el.dataset.tg) { this._hass.callService('input_boolean', 'toggle', { entity_id: el.dataset.tg }); return; }
    const ev = new Event('hass-more-info', { bubbles: true, composed: true });
    ev.detail = { entityId: el.dataset.mi };
    this.dispatchEvent(ev);
  }

  // Markdown → { datum, sections: { Name: { items: [], subs: [{ title, items }] } }, order: [] }
  _parse(md) {
    const out = { datum: null, sections: {}, order: [] };
    let cur = null, sub = null;
    String(md || '').split('\n').forEach((raw) => {
      const line = raw.replace(/\s+$/, '');
      let m;
      if ((m = line.match(/^#\s+.*?(\d{4}-\d{2}-\d{2})/))) { out.datum = m[1]; return; }
      if ((m = line.match(/^##\s+(.+)/))) { cur = { items: [], subs: [] }; sub = null; out.sections[m[1].trim()] = cur; out.order.push(m[1].trim()); return; }
      if ((m = line.match(/^###\s+(.+)/)) && cur) { sub = { title: m[1].trim(), items: [] }; cur.subs.push(sub); return; }
      if ((m = line.match(/^\s*[-*]\s+(.+)/)) && cur) { const t = m[1].replace(/\\([!*_#])/g, '$1').trim(); (sub ? sub.items : cur.items).push(t); }
    });
    return out;
  }

  _render() {
    const h = this._hass, c = this._c;
    if (!h || !this.shadowRoot) return;
    const dark = !!(h.themes && h.themes.darkMode);
    const voll = this._a(c.entity, 'voll');
    const first = ((h.user && h.user.name) || '').split(' ')[0];
    const erstellt = this._a(c.entity, 'erstellt_um');
    const tStand = erstellt ? new Date(erstellt) : null;
    const hhmm = (d) => d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

    if (!voll) {
      this.shadowRoot.innerHTML = `<style>${this._css(dark)}</style><div class="view"><div class="card empty">${bic('info')}<div><b>Noch kein Briefing abgerufen.</b><small>Home Assistant holt es werktags ab 05:15 von A.R.E.S.</small></div></div>${this._push()}</div>`;
      return;
    }

    const P = this._parse(voll);
    const S = (n) => P.sections[n] || { items: [], subs: [] };
    const used = new Set();
    const take = (n) => { used.add(n); return S(n); };
    const datum = P.datum ? new Date(P.datum + 'T12:00:00') : new Date();
    const today = new Date(); const isToday = datum.toDateString() === today.toDateString();

    // Kopf
    const imp = take('Tagesimpuls').items.join(' ');
    const head = `<header class="head"><span class="eyebrow">${BTAGE[datum.getDay()]}, ${datum.getDate()}. ${BMON[datum.getMonth()]}${tStand ? ` · Stand ${hhmm(tStand)} Uhr` : ''}${isToday ? '' : ' · <span class="old">nicht von heute</span>'}</span>
      <h2>Dein Tag${first ? ', ' + besc(first) : ''}</h2>${imp ? `<p class="impuls">${bic('spark')}<span>${besc(imp)}</span></p>` : ''}</header>`;

    // Wetter
    const W = take('Wetter').items; const wf = (k) => (W.find((x) => x.startsWith(k + ':')) || '').slice(k.length + 1).trim();
    const dr = wf('Draußen'); const drm = dr.match(/(-?[\d.,]+)\s*°C,\s*([^(,]+)/);
    const hm = wf('Heute').match(/maximal\s*(-?[\d.,]+).*?minimal\s*(-?[\d.,]+)/);
    const wind = wf('Wind').match(/([\d.,]+)\s*km\/h/);
    const sonne = W.find((x) => /^Sonnenaufgang/.test(x)); const sm = sonne && sonne.match(/(\d\d:\d\d).*?(\d\d:\d\d)/);
    const wKpi = drm || hm ? `<div class="card kpi">${'<div class="ico">' + bic(WXICON(drm ? drm[2] : '')) + '</div>'}<span class="lab">Wetter</span>
      <span class="big">${drm ? `${bnum(drm[1])} °C · ${besc(drm[2].trim())}` : '–'}</span>
      <span class="sub">${hm ? `${bnum(hm[2])} bis ${bnum(hm[1])} °C` : ''}${wind ? ` · Wind ${Math.round(parseFloat(wind[1]))} km/h` : ''}${sm ? ` · ☀ ${sm[1]}–${sm[2]}` : ''}</span></div>` : '';

    // Termine
    const T = take('Termine heute').items.filter((x) => !EMPTY.test(x));
    const allday = [], ev = [];
    T.forEach((x) => {
      let m;
      if ((m = x.match(/^(\d\d:\d\d)\s*-\s*(\d\d:\d\d)\s*-\s*(.+)$/))) ev.push({ von: m[1], bis: m[2], t: m[3] });
      else if ((m = x.match(/^(\d\d:\d\d)\s*-\s*(.+)$/))) ev.push({ von: m[1], bis: '', t: m[2] });
      else allday.push(x.replace(/^Ganztägig\s*-\s*/i, ''));
    });
    const nowHM = hhmm(today);
    const nextIdx = isToday ? ev.findIndex((e) => (e.bis || e.von) > nowHM) : -1;
    const tKpi = `<div class="card kpi"><div class="ico">${bic('cal')}</div><span class="lab">${nextIdx >= 0 ? 'Nächster Termin' : 'Termine'}</span>
      <span class="big">${nextIdx >= 0 ? `${ev[nextIdx].von} ${besc(ev[nextIdx].t)}` : ev.length ? 'alle vorbei' : allday.length ? 'nur ganztägig' : 'frei'}</span>
      <span class="sub">${ev.length} mit Uhrzeit${allday.length ? `, ${allday.length} ganztägig` : ''}</span></div>`;
    const termine = `<section class="card"><div class="ch"><h3>Termine heute</h3></div>
      ${allday.length ? `<div class="allday">${allday.map((a) => `<span class="chip">Ganztägig · ${besc(a)}</span>`).join('')}</div>` : ''}
      ${ev.length ? `<div class="tl">${ev.map((e, i) => `<div class="ev${i === nextIdx ? ' next' : ''}${nextIdx >= 0 && i < nextIdx ? ' past' : ''}"><time>${e.von}</time><span class="dot"></span><div><b>${besc(e.t)}</b>${i === nextIdx ? '<span class="tag">als Nächstes</span>' : ''}${e.bis ? `<small>bis ${e.bis}</small>` : ''}</div></div>`).join('')}</div>` : allday.length ? '' : '<p class="muted">Keine Termine.</p>'}</section>`;

    // Verkehr
    const V = take('Verkehr').items; const vm = V.map((x) => x.match(/^Zu\s+(.+?):\s*ca\.\s*([\d.,]+)\s*min(?:,\s*([\d.,]+)\s*km)?/)).find(Boolean);
    const vq = (V.find((x) => /^Quelle/.test(x)) || '').replace(/^Quelle:\s*/, '').replace(/Home Assistant \/\s*/, '').replace(/\.$/, '');
    const vKpi = vm ? `<div class="card kpi"><div class="ico">${bic('car')}</div><span class="lab">Arbeitsweg</span>
      <span class="big">${Math.round(parseFloat(vm[2]))} min${vm[3] ? ` · ${bnum(vm[3])} km` : ''}</span><span class="sub">${besc(vm[1])}${vq ? ' · ' + besc(vq) : ''}</span></div>`
      : V.length ? `<div class="card kpi"><div class="ico">${bic('car')}</div><span class="lab">Verkehr</span><span class="sub">${besc(V[0])}</span></div>` : '';

    // Demnächst: Ausblick + Geburtstage
    const addDays = (n) => { const d = new Date(datum); d.setDate(d.getDate() + n); return d; };
    const dLab = (d) => `${BTAGK[d.getDay()]} ${d.getDate()}.${d.getMonth() + 1}.`;
    const dem = [];
    const A = take('Ausblick');
    A.subs.forEach((s) => {
      const n = /^morgen$/i.test(s.title) ? 1 : /^übermorgen$/i.test(s.title) ? 2 : (s.title.match(/(\d+)\s*Tag/) || [])[1];
      const d = n != null ? addDays(+n) : null;
      s.items.filter((x) => !EMPTY.test(x)).forEach((x) => {
        const m = x.match(/^(?:(Ganztägig)|(\d\d:\d\d)(?:\s*-\s*\d\d:\d\d)?)\s*-\s*(.+)$/i);
        dem.push({ ic: 'cal', t: m ? m[3] : x, when: d ? dLab(d) : s.title, extra: m ? (m[1] ? 'ganztägig' : m[2]) : '', sort: n != null ? +n : 99 });
      });
    });
    A.items.filter((x) => !EMPTY.test(x)).forEach((x) => dem.push({ ic: 'cal', t: x, when: '', extra: '', sort: 98 }));
    take('Geburtstage').items.filter((x) => !EMPTY.test(x)).forEach((x) => {
      const m = x.match(/^(\d{1,2})\.(\d{1,2})\.\s*(?:\([^)]*\))?\s*-\s*(.+)$/);
      if (!m) { dem.push({ ic: 'gift', t: x, when: '', extra: '', sort: 97 }); return; }
      const d = new Date(datum.getFullYear(), +m[2] - 1, +m[1], 12); if (d < datum - 864e5) d.setFullYear(d.getFullYear() + 1);
      const n = Math.round((d - datum) / 864e5);
      dem.push({ ic: 'gift', t: 'Geburtstag ' + m[3], when: dLab(d), extra: n === 0 ? 'heute' : n === 1 ? 'morgen' : `in ${n} Tagen`, sort: n });
    });
    dem.sort((a, b) => a.sort - b.sort);
    const demn = dem.length ? `<section class="card"><div class="ch"><h3>Demnächst</h3></div><div class="rows">${dem.map((x) => `<div class="row">${bic(x.ic)}<span>${besc(x.t)}</span><span class="v">${x.when ? `<b>${besc(x.when)}</b>` : ''}${x.when && x.extra ? ' · ' : ''}${besc(x.extra)}</span></div>`).join('')}</div></section>` : '';

    // Postfach
    const PF = take('Postfach').items; const pm = PF.join(' ').match(/Ungelesen[^:]*:\s*(\d+)(?:.*?wichtig[^:]*:\s*(\d+))?/i);
    const post = PF.length ? `<section class="card"><div class="ch"><h3>Postfach</h3><span class="sub">letzte 24 h</span></div>${pm
      ? `<div class="mail"><span class="n">${pm[1]}</span><p>ungelesen${pm[2] && +pm[2] > 0 ? `, davon <span class="pill p-warn">${pm[2]} wichtig</span>` : ''}</p></div>`
      : `<div class="rows">${PF.map((x) => `<div class="row">${bic('mail')}<span>${besc(x)}</span><span></span></div>`).join('')}</div>`}</section>` : '';

    // Zuhause + System: "Label: Wert"
    const kv = (x) => { const i = x.indexOf(':'); return i < 0 ? [x, ''] : [x.slice(0, i).trim(), x.slice(i + 1).trim()]; };
    const zIc = (l) => /handy|smartphone|telefon/i.test(l) ? 'phone' : /batter/i.test(l) ? 'battery' : /zimmer|bad|küche|flur|büro/i.test(l) ? 'thermo' : 'home';
    const zRow = (x) => {
      const [l, v] = kv(x);
      if (/^niedrige batterien/i.test(l)) {
        const [dev, pct] = kv(v.replace(/\s*Batterie(stand)?\s*:/i, ':'));
        return `<div class="row">${bic('battery')}<span>${besc(dev)}</span><span class="v"><span class="pill p-warn">Batterie ${besc(pct || v)}</span></span></div>`;
      }
      const vv = v.replace(/(-?\d+)\.(\d)/g, '$1,$2').replace(/\s*bei\s*/, ' · ').replace(/\s*Luftfeuchtigkeit/, '');
      const lab = l.replace(/^Smartphone\s+\S+$/i, 'Smartphone');
      return `<div class="row">${bic(zIc(l))}<span>${besc(lab)}</span><span class="v"><b>${besc(vv.split(' · ')[0])}</b>${vv.includes(' · ') ? ' · ' + besc(vv.split(' · ').slice(1).join(' · ')) : ''}</span></div>`;
    };
    const Z = take('Zuhause').items;
    const zuhause = Z.length ? `<section class="card"><div class="ch"><h3>Zuhause</h3></div><div class="rows">${Z.map(zRow).join('')}</div></section>` : '';
    const SY = take('Systemhinweise').items.filter((x) => !EMPTY.test(x));
    const sRow = (x) => {
      const m = x.match(/^(.+?)\s+zuletzt:\s*(\d{1,2}\.\d{1,2}\.)\s*(\d\d:\d\d)(?:\s*\((\d+)\s*\w+,\s*(\d+)\s*\w+\))?/);
      if (m) return `<div class="row">${bic('sync')}<span>${besc(m[1])}</span><span class="v"><span class="pill p-ok">${m[3]}${m[4] ? ` · ${+m[4] + +m[5]} Termine` : ''}</span></span></div>`;
      const [l, v] = kv(x);
      return `<div class="row">${bic('info')}<span>${besc(l)}</span><span class="v">${besc(v)}</span></div>`;
    };
    const system = SY.length ? `<section class="card"><div class="ch"><h3>System</h3></div><div class="rows">${SY.map(sRow).join('')}</div></section>` : '';

    // Übrige Abschnitte (z. B. Laufende Ereignisse) generisch, leere weg
    const rest = P.order.filter((n) => !used.has(n)).map((n) => {
      const s = S(n); const items = [...s.items, ...s.subs.flatMap((x) => x.items.map((i) => `${x.title}: ${i}`))].filter((x) => !EMPTY.test(x));
      return items.length ? `<section class="card"><div class="ch"><h3>${besc(n)}</h3></div><div class="rows">${items.map((x) => `<div class="row">${bic('dot')}<span>${besc(x)}</span><span></span></div>`).join('')}</div></section>` : '';
    }).join('');

    const kpis = [wKpi, tKpi, vKpi].filter(Boolean);
    const aus = this._a(c.entity, 'ausloeser');
    const foot = `<p class="foot">${aus === 'manual' ? 'Manuell abgerufen' : 'Automatisch erstellt'}${tStand ? ' ' + hhmm(tStand) : ''} · Quelle A.R.E.S.</p>`;

    this.shadowRoot.innerHTML = `<style>${this._css(dark)}</style><div class="view">${head}
      <section class="kpis k${kpis.length}">${kpis.join('')}</section>
      <div class="main"><div class="col">${termine}${demn}</div><div class="col">${post}${zuhause}${system}${rest}</div></div>
      ${this._push()}${foot}</div>`;
  }

  _push() {
    const c = this._c; const P = c.push || [], T = c.targets || [];
    if (!P.length && !T.length) return '';
    const tm = (id) => (this._s(id) || '').slice(0, 5);
    const on = (id) => this._s(id) === 'on';
    const sumP = P.filter((p) => on(p.on)).map((p) => `${p.short || p.label} ${tm(p.time)}`).join(' · ') || 'aus';
    const sumT = T.filter((t) => on(t.on)).map((t) => t.label).join(', ') || 'kein Gerät';
    return `<details class="push"${this._open ? ' open' : ''}><summary>${bic('bell')}<span><b>Push-Nachricht</b> · ${besc(sumP)} · an ${besc(sumT)}</span>${bic('chev')}</summary>
      <div class="pushgrid">${P.map((p) => `<div class="pg"><span>${besc(p.label)}</span><b data-mi="${p.time}" title="Uhrzeit ändern">${tm(p.time)}</b><i class="sw${on(p.on) ? ' on' : ''}" data-tg="${p.on}" role="switch" aria-checked="${on(p.on)}"></i></div>`).join('')}
      ${T.map((t) => `<div class="pg"><span>${besc(t.label)}</span><i class="sw${on(t.on) ? ' on' : ''}" data-tg="${t.on}" role="switch" aria-checked="${on(t.on)}"></i></div>`).join('')}</div></details>`;
  }

  _css(dark) {
    const p = dark
      ? { accent: '#4a9be8', accentSoft: '#1b2c3e', good: '#3fbf85', goodSoft: '#15291f', warn: '#e2a93b', warnSoft: '#2e2412' }
      : { accent: '#1f78d1', accentSoft: '#e3effb', good: '#1a9c62', goodSoft: '#e2f4eb', warn: '#b97700', warnSoft: '#fbf0d9' };
    return `
:host{display:block;container-type:inline-size;--card:var(--ha-card-background,var(--card-background-color,#fff));--ink:var(--primary-text-color);--ink2:var(--secondary-text-color);--muted:var(--secondary-text-color);--line:var(--divider-color,rgba(127,127,127,.25));--sunk:rgba(127,127,127,.09);
  --accent:${p.accent};--accent-soft:${p.accentSoft};--good:${p.good};--good-soft:${p.goodSoft};--warn:${p.warn};--warn-soft:${p.warnSoft};
  --fd:"Space Grotesk",var(--ha-font-family-body,system-ui),sans-serif;--fb:"Inter",var(--ha-font-family-body,system-ui),sans-serif}
*{box-sizing:border-box}
h2,h3{font-family:var(--fd);font-weight:600;margin:0;text-wrap:balance}
p{margin:0}
svg.i{width:18px;height:18px;flex:none;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
.view{max-width:1200px;margin:0 auto;padding:22px 28px;display:grid;gap:14px;font-family:var(--fb);font-size:14px;line-height:1.5;color:var(--ink)}
.muted{color:var(--muted)}
[data-mi],[data-tg],summary{cursor:pointer}
.card{background:var(--card);border:1px solid var(--line);border-radius:var(--ha-card-border-radius,14px);padding:14px 16px;min-width:0}
.ch{display:flex;align-items:baseline;justify-content:space-between;gap:8px;margin-bottom:8px}
.ch h3{font-size:15px}.ch .sub{font-size:12px;color:var(--muted)}
.head{display:grid;gap:4px;padding:4px 2px}
.eyebrow{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);font-weight:600}
.old{color:var(--warn)}
.head h2{font-size:28px;letter-spacing:-.015em}
.impuls{display:flex;gap:10px;align-items:flex-start;color:var(--ink2);max-width:76ch;margin-top:4px;font-size:15px}
.impuls svg{color:var(--accent);margin-top:3px}
.kpis{display:grid;gap:12px;grid-template-columns:repeat(3,minmax(0,1fr))}
.kpis.k2{grid-template-columns:repeat(2,minmax(0,1fr))}.kpis.k1{grid-template-columns:minmax(0,1fr)}
.kpi{display:grid;grid-template-columns:auto 1fr;gap:2px 12px;align-items:center}
.kpi .ico{grid-row:span 3;width:42px;height:42px;border-radius:10px;display:grid;place-items:center;background:var(--accent-soft);color:var(--accent)}
.kpi .ico svg{width:22px;height:22px}
.lab{font-size:11.5px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;font-weight:600}
.big{font-family:var(--fd);font-size:22px;font-weight:600;font-variant-numeric:tabular-nums;line-height:1.2;overflow-wrap:anywhere}
.kpi .sub{color:var(--ink2);font-size:13px}
.main{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:12px;align-items:start}
.col{display:grid;gap:12px;min-width:0}
.allday{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px}
.chip{font-size:12px;padding:3px 9px;border-radius:99px;background:var(--sunk);color:var(--ink2);border:1px solid var(--line)}
.ev{display:grid;grid-template-columns:52px 14px 1fr;gap:0 10px;align-items:start;padding:6px 0}
.ev time{font-variant-numeric:tabular-nums;color:var(--ink2);font-size:13px;text-align:right;padding-top:1px}
.ev .dot{width:10px;height:10px;border-radius:50%;border:2px solid var(--accent);background:var(--card);margin-top:5px;position:relative}
.ev .dot::after{content:"";position:absolute;left:2px;top:12px;width:2px;height:30px;background:var(--line)}
.ev:last-child .dot::after{display:none}
.ev b{font-weight:600}.ev small{display:block;color:var(--muted);font-size:12px}
.ev.past{opacity:.55}
.ev.next .dot{background:var(--accent)}
.tag{margin-left:8px;font-size:11px;font-weight:600;color:var(--accent);background:var(--accent-soft);padding:1px 7px;border-radius:99px;vertical-align:1px}
.rows{display:grid}
.row{display:grid;grid-template-columns:20px 1fr auto;gap:10px;align-items:center;padding:8px 0;border-top:1px solid var(--line)}
.row:first-child{border-top:0}
.row svg{color:var(--muted)}
.row .v{color:var(--ink2);font-variant-numeric:tabular-nums;text-align:right;font-size:13px}
.row .v b{color:var(--ink);font-weight:600}
.pill{font-size:11px;font-weight:600;padding:2px 8px;border-radius:99px;white-space:nowrap}
.p-warn{background:var(--warn-soft);color:var(--warn)}.p-ok{background:var(--good-soft);color:var(--good)}
.mail{display:flex;align-items:baseline;gap:14px}
.mail .n{font-family:var(--fd);font-size:30px;font-weight:600;font-variant-numeric:tabular-nums}
.mail p{color:var(--ink2)}
.empty{display:flex;gap:12px;align-items:center}.empty svg{color:var(--accent)}.empty small{display:block;color:var(--muted)}
details.push{background:var(--card);border:1px solid var(--line);border-radius:var(--ha-card-border-radius,14px)}
summary{padding:12px 16px;display:flex;align-items:center;gap:10px;list-style:none;color:var(--ink2)}
summary::-webkit-details-marker{display:none}
summary>span{flex:1;min-width:0}
summary b{color:var(--ink);font-weight:600}
summary svg{color:var(--muted)}
details[open] summary svg:last-child{transform:rotate(90deg)}
.pushgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px;padding:0 16px 16px}
.pg{background:var(--sunk);border-radius:10px;padding:10px 12px;display:flex;justify-content:space-between;align-items:center;gap:8px}
.pg span{color:var(--ink2);font-size:13px;flex:1}
.pg b{font-variant-numeric:tabular-nums;font-weight:600;border-bottom:1px dashed var(--line)}
.sw{width:32px;height:18px;border-radius:99px;background:var(--line);position:relative;flex:none}
.sw::after{content:"";position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:var(--card);transition:left .15s}
.sw.on{background:var(--accent)}.sw.on::after{left:16px}
.foot{font-size:12px;color:var(--muted);padding:0 2px}
@media (prefers-reduced-motion:reduce){.sw::after{transition:none}}
@container (max-width:780px){
  .view{padding:14px}
  .kpis,.kpis.k2,.main{grid-template-columns:minmax(0,1fr)}
  .head h2{font-size:24px}
}`;
  }
}
customElements.define('briefing-card', BriefingCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: 'briefing-card', name: 'Briefing', description: 'Tagesbriefing von A.R.E.S. als strukturierte Ansicht' });
