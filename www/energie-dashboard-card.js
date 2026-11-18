// energie-dashboard-card: Energie-Übersicht nach Mockup v1 (17.11.2026), Live-Daten aus HA
const PRICE = 'input_number.energy_costs_electricity';
const CATS = ['3D-Druck', 'Spülen', 'Waschen & Trocknen', 'Kaffee', 'Licht'];
const S = (x) => 'sensor.' + x;
const DEV = [
  ['Prusa XL', 'Werkstatt', 0, 'prusa_xl_keller'],
  ['Spülmaschine', 'Küche', 1, 'spuhlmaschine', 'kuche_spulmaschine'],
  ['Waschmaschine', 'HWR', 2, 'waschmaschine', 'hwr_waschmaschine'],
  ['Trockner', 'HWR', 2, 'trockner', 'hwr_trockner'],
  ['Kaffeemaschine', 'Küche', 3, 'kaffeemaschine'],
  ['Esszimmerlicht', 'Esszimmer', 4, 'schalter_wohnzimmerlicht'],
  ['Wohnzimmerlicht', 'Wohnzimmer', 4, 'schalter_esszimmerlicht'],
  ['Badezimmerlicht', 'Bad', 4, 'badezimmer_schaltausgang_badezimmerlicht'],
  ['Flurlicht', 'Flur', 4, 'schalter_flurlicht'],
].map(([name, area, cat, k, cyc]) => ({ name, area, cat, e: S(k + '_energie'), p: S(k + '_leistung'), cyc }));
const AREAS = [['Werkstatt', [0]], ['Küche', [1, 4]], ['HWR', [2, 3]], ['Licht', [5, 6, 7, 8], '4 Leuchten']];
const PRUSA_ST = { printing: 'druckt', paused: 'pausiert', finished: 'fertig', idle: 'bereit', ready: 'bereit', busy: 'beschäftigt', attention: 'Achtung', error: 'Fehler', stopped: 'gestoppt' };
const MON = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
const WD = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
const fmt = (v, d = 2) => (isFinite(v) ? v : 0).toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

class EnergieDashboardCard extends HTMLElement {
  setConfig(c) { this._c = c || {}; this._per = 'tag'; this._rv = 'donut'; }
  getCardSize() { return 20; }
  getGridOptions() { return { columns: 'full' }; }
  connectedCallback() {
    if (!document.getElementById('edc-fonts')) {
      const l = document.createElement('link');
      l.id = 'edc-fonts'; l.rel = 'stylesheet';
      l.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap';
      document.head.appendChild(l);
    }
    this._timer = setInterval(() => this._load(), 300000);
  }
  disconnectedCallback() { clearInterval(this._timer); }
  set hass(h) {
    this._hass = h;
    if (!this.shadowRoot) { this.attachShadow({ mode: 'open' }); this._load(); }
    const now = Date.now();
    if (!this._last || now - this._last > 5000) { this._last = now; this._render(); }
  }
  _st(id) { const s = this._hass.states[id]; return s ? s.state : undefined; }
  _n(id) { const v = parseFloat(this._st(id)); return isFinite(v) ? v : 0; }

  async _load() {
    if (!this._hass) return;
    const now = new Date();
    const d0 = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    const m0 = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    const ids = DEV.map((d) => d.e);
    try {
      const [day, mon, hr] = await Promise.all([
        this._hass.callWS({ type: 'recorder/statistics_during_period', start_time: d0.toISOString(), period: 'day', statistic_ids: ids, types: ['change'] }),
        this._hass.callWS({ type: 'recorder/statistics_during_period', start_time: m0.toISOString(), period: 'month', statistic_ids: ids, types: ['change'] }),
        this._hass.callWS({ type: 'recorder/statistics_during_period', start_time: new Date(now - 7 * 864e5).toISOString(), period: 'hour', statistic_ids: [S('energie_leistung_erfasst')], types: ['mean'] }),
      ]);
      const days = [], months = [];
      for (let i = 0; i < 8; i++) days.push(new Date(d0.getFullYear(), d0.getMonth(), d0.getDate() + i));
      for (let i = 0; i < 12; i++) months.push(new Date(m0.getFullYear(), m0.getMonth() + i, 1));
      const pick = (res, slots, same) => DEV.map((d) => slots.map((t) => {
        const r = (res[d.e] || []).find((x) => same(new Date(x.start), t));
        return r && r.change > 0 ? r.change : 0;
      }));
      this._days = days;
      this._months = months;
      this._dayK = pick(day, days, (a, b) => a.toDateString() === b.toDateString());
      this._monK = pick(mon, months, (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth());
      const means = (hr[S('energie_leistung_erfasst')] || []).map((r) => r.mean).filter((v) => isFinite(v));
      this._base = means.length >= 6 ? Math.min(...means) : null;
      this._err = null;
    } catch (e) { this._err = String((e && e.message) || e); }
    this._last = 0; if (this._hass) this.hass = this._hass;
  }

  _render() {
    const h = this._hass;
    if (!h || !this.shadowRoot) return;
    const P = this._n(PRICE) || 0;
    const dark = h.themes && h.themes.darkMode;
    const col = dark ? ['#3987e5', '#d95926', '#199e70', '#c98500', '#d55181'] : ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4'];
    const ok = !!this._dayK;
    const mi = 11; // aktueller Monat im Monats-Array
    const monDev = ok ? DEV.map((d, i) => this._monK[i][mi]) : DEV.map(() => 0);
    const monTot = monDev.reduce((a, b) => a + b, 0);
    const prevTot = ok ? this._monK.reduce((a, r) => a + r[mi - 1], 0) : 0;
    const dayTot = ok ? this._days.map((_, j) => this._dayK.reduce((a, r) => a + r[j], 0)) : [];
    const avg7 = ok ? dayTot.slice(0, 7).reduce((a, b) => a + b, 0) / 7 : 0;
    const now = new Date();
    const ytd = ok ? this._months.reduce((a, t, j) => a + (t.getFullYear() === now.getFullYear() ? this._monK.reduce((s, r) => s + r[j], 0) : 0), 0) : 0;

    // Live
    const live = DEV.map((d) => ({ ...d, w: this._n(d.p) })).filter((d) => d.w >= 5).sort((a, b) => b.w - a.w);
    const liveW = this._n(S('energie_leistung_erfasst')) || live.reduce((a, d) => a + d.w, 0);
    const stateTxt = (d) => d.cat === 4 ? 'an' : d.name === 'Prusa XL' ? (PRUSA_ST[this._st(S('prusa_xl'))] || 'läuft') : 'läuft';

    // KPI je Zeitraum
    const todayK = this._n(S('energie_erfasst_heute')), monK = this._n(S('energie_erfasst_monat'));
    const fc = this._n(S('stromkosten_prognose_monat'));
    const wkK = ok ? dayTot.slice(1).reduce((a, b) => a + b, 0) : 0;
    const yFrac = (now - new Date(now.getFullYear(), 0, 1)) / (new Date(now.getFullYear() + 1, 0, 1) - new Date(now.getFullYear(), 0, 1));
    const delta = (a, b) => b > 0 ? `<span class="delta ${a > b ? 'up' : 'down'}">${a > b ? '▲' : '▼'} ${Math.round(Math.abs(a / b - 1) * 100)} %</span>` : '';
    const PER = {
      tag: ['Heute bisher', this._n(S('stromkosten_heute')), `${fmt(todayK)} kWh · Ø 7 Tage: ${fmt(avg7 * P)} € pro Tag`],
      woche: ['Letzte 7 Tage', wkK * P, `${fmt(wkK, 1)} kWh · Ø ${fmt(wkK * P / 7)} € pro Tag`],
      monat: [`${MON[now.getMonth()]} bisher`, this._n(S('stromkosten_monat')), `${fmt(monK, 1)} kWh · ${delta(monK, prevTot)} ggü. ${MON[(now.getMonth() + 11) % 12]} gesamt`],
      jahr: [`${now.getFullYear()} bisher`, ytd * P, `${fmt(ytd, 0)} kWh · nur erfasste Geräte`],
    };
    const per = PER[this._per];
    const isY = this._per === 'jahr';
    const fcV = isY ? (yFrac > 0 ? ytd / yFrac * P : 0) : fc;
    const fcDone = isY ? ytd * P : this._n(S('stromkosten_monat'));
    const fcL = isY ? `Prognose ${now.getFullYear()}` : `Prognose ${MON[now.getMonth()]}`;
    const fcD = isY ? `${fmt(ytd * P)} € bis heute · nur erfasste Geräte` : `${fmt(fcDone)} € bis heute · ${MON[(now.getMonth() + 11) % 12]}: ${fmt(prevTot * P)} €`;
    const base = this._base;

    // Ranking
    const rank = DEV.map((d, i) => ({ n: d.name, k: monDev[i], c: col[d.cat] })).sort((a, b) => b.k - a.k);
    const rows = rank.slice(0, 5);
    const rest = rank.slice(5).reduce((a, r) => a + r.k, 0);
    if (rest > 0) rows.push({ n: `${rank.length - 5} weitere`, k: rest, c: 'var(--muted)' });
    const maxK = Math.max(0.001, ...rows.map((r) => r.k));

    // Hinweise
    const top = rank[0];
    const cyc = DEV.filter((d) => d.cyc).map((d) => `${d.name.replace('maschine', '')}: <b>${fmt(this._n(S(d.cyc + '_kosten_des_letzten_zyklus')))} €</b>`).join(' · ');
    const ins = [
      ['var(--s1)', 'M4 20V10M10 20V4M16 20v-7M22 20H2', monTot > 0 ? `${esc(top.n)} = ${Math.round(top.k / monTot * 100)} % deiner erfassten Kosten` : 'Noch keine Werte in diesem Monat', `${fmt(top.k * P)} € im ${MON[now.getMonth()]}, ${fmt(top.k, 1)} kWh.`],
      ['var(--s3)', 'M4 4h16v16H4zM12 7a6 6 0 1 0 0 12a6 6 0 1 0 0-12', 'Kosten pro Durchlauf', `Letzter Zyklus laut Miele: ${cyc}.`],
      ['var(--serious)', 'M12 3v10M12 17v.5M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20', base != null ? `Grundlast ca. ${Math.round(base)} W` : 'Grundlast wird noch ermittelt', base != null ? `Das sind rund ${fmt(base * 8.76 * P, 0)} € im Jahr. Der Prusa XL schaltet sich 30 min nach Druckende ab.` : 'Braucht ein paar Stunden Messwerte.'],
      ['var(--muted)', 'M3 12h4l3-8 4 16 3-8h4', 'Rund drei Viertel des Hauses fehlen', 'Ohne Hauszähler bleiben Kühlschrank, Herd und Server unsichtbar.'],
    ];

    this.shadowRoot.innerHTML = `<style>${this._css(col, dark)}</style>
<div class="wrap">
  <div class="top">
    <div class="t"><div class="logo"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg></div>
      <div><div class="h1">Energie</div><div class="muted sm">Strompreis <a class="price" data-mi="${PRICE}">${fmt(P, 3)} €/kWh</a></div></div></div>
    <span class="tag run"><span class="dot"></span>Live</span>
  </div>
  <div class="bar-row">
    <div class="seg">${[['tag', 'Heute'], ['woche', 'Woche'], ['monat', 'Monat'], ['jahr', 'Jahr']].map(([k, l]) => `<button data-p="${k}" aria-pressed="${this._per === k}">${l}</button>`).join('')}</div>
    <span class="muted sm">${this._err ? 'Statistik nicht geladen: ' + esc(this._err) : 'Werte nur für erfasste Geräte, bis der Hauszähler da ist'}</span>
  </div>
  <div class="grid">
    <div class="card c3 kpi" data-mi="${S('energie_leistung_erfasst')}"><div class="eb">Jetzt</div><div class="v">${Math.round(liveW)}<small>W</small></div><div class="d">${live.length} ${live.length === 1 ? 'Gerät läuft' : 'Geräte laufen'} · ca. <b>${fmt(liveW / 1000 * P)} €</b>/h</div></div>
    <div class="card c3 kpi"><div class="eb">${per[0]}</div><div class="v">${fmt(per[1])}<small>€</small></div><div class="d">${per[2]}</div></div>
    <div class="card c3 kpi" data-mi="${S('stromkosten_prognose_monat')}"><div class="eb">${fcL}</div><div class="v">${fmt(fcV)}<small>€</small></div>
      <div class="fc"><em></em><span style="width:${fcV > 0 ? Math.min(100, fcDone / fcV * 100).toFixed(0) : 0}%"></span></div><div class="d">${fcD}</div></div>
    <div class="card c3 kpi" data-mi="${S('energie_leistung_erfasst')}"><div class="eb">Grundlast (Standby)</div><div class="v">${base != null ? Math.round(base) : '–'}<small>W</small></div><div class="d">${base != null ? `Minimum der letzten 7 Tage · ≈ <b>${fmt(base * 8.76 * P, 0)} €</b> pro Jahr` : 'wird aus Stundenwerten ermittelt'}</div></div>

    <div class="card c5"><div class="ch"><div class="h2">Läuft gerade</div><span class="sub">blendet sich unter 5 W aus</span></div>
      <div class="stack">${live.map((d) => `<div style="width:${(d.w / Math.max(1, live.reduce((a, x) => a + x.w, 0)) * 100).toFixed(1)}%;background:${col[d.cat]}" title="${esc(d.name)}: ${Math.round(d.w)} W"></div>`).join('')}</div>
      <div class="running">${live.length ? live.map((d) => `<div class="run" data-mi="${d.p}"><span class="sw" style="background:${col[d.cat]}"></span><div><b>${esc(d.name)}</b> <span class="muted sm">· ${esc(d.area)} · ${stateTxt(d)}</span></div><span class="w">${Math.round(d.w)} W</span></div>`).join('') : '<div class="muted">Gerade läuft nichts.</div>'}</div></div>

    <div class="card c7"><div class="ch"><div class="h2">Wohin der Strom geht</div><span class="sub">${MON[now.getMonth()]} bis heute · ${fmt(monTot, 1)} kWh erfasst</span></div>
      ${this._sankey(monDev, col, P)}</div>

    <div class="card c7 tgl" id="rankcard" title="Klicken zum Umschalten"><div class="ch"><div class="h2">Größte Verbraucher</div><span class="sub">${MON[now.getMonth()]} · ${this._rv === 'list' ? 'kWh · Euro' : 'Anteil'} <span class="sw2">${this._rv === 'list' ? '◔ Diagramm' : '☰ Liste'}</span></span></div>
      ${this._rv === 'list'
        ? `<div class="rank">${rows.map((r) => `<div class="rk"><span>${esc(r.n)}</span><div class="track"><div class="fill" style="width:${(r.k / maxK * 100).toFixed(1)}%;background:${r.c}"></div></div><span class="r">${fmt(r.k, 1)} kWh</span><span class="r e">${fmt(r.k * P)} €</span></div>`).join('')}</div>`
        : this._donut(rows, monTot, P)}</div>

    <div class="card c5"><div class="ch"><div class="h2">Hinweise</div><span class="sub">aus deinen Daten abgeleitet</span></div>
      <div class="ins">${ins.map(([c, p, t, x]) => `<div class="insight"><div class="ic"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${p}"/></svg></div><div><b>${t}</b><p>${x}</p></div></div>`).join('')}</div></div>

    <div class="card c12"><div class="ch"><div class="h2">Letzte 8 Tage</div><span class="sub">Kosten pro Tag, gestapelt nach Kategorie</span></div>
      <div class="legend">${CATS.map((c, i) => `<span><i style="background:${col[i]}"></i>${c}</span>`).join('')}</div>
      ${ok ? this._days8(col, P) : '<div class="muted">Lade Statistik …</div>'}</div>
  </div>
</div>`;
    this.shadowRoot.querySelectorAll('.seg button').forEach((b) => b.addEventListener('click', () => { this._per = b.dataset.p; this._render(); }));
    const rc = this.shadowRoot.getElementById('rankcard');
    if (rc) rc.addEventListener('click', () => { this._rv = this._rv === 'list' ? 'donut' : 'list'; this._render(); });
    this.shadowRoot.querySelectorAll('[data-mi]').forEach((el) => el.addEventListener('click', () => {
      const ev = new Event('hass-more-info', { bubbles: true, composed: true });
      ev.detail = { entityId: el.dataset.mi };
      this.dispatchEvent(ev);
    }));
  }

  _donut(rows, tot, P) {
    if (!(tot > 0)) return '<div class="muted">Noch keine Werte in diesem Monat.</div>';
    const R = 80, r = 54, cx = 100, cy = 100, gapA = rows.length > 1 ? 0.025 : 0;
    let a = -Math.PI / 2, segs = '';
    const pt = (rad, ang) => `${(cx + rad * Math.cos(ang)).toFixed(2)},${(cy + rad * Math.sin(ang)).toFixed(2)}`;
    rows.forEach((x) => {
      const sw = x.k / tot * Math.PI * 2;
      if (sw <= gapA) { a += sw; return; }
      const a0 = a + gapA / 2, a1 = a + sw - gapA / 2, big = a1 - a0 > Math.PI ? 1 : 0;
      segs += sw >= Math.PI * 2 - 1e-6
        ? `<circle cx="${cx}" cy="${cy}" r="${(R + r) / 2}" fill="none" stroke="${x.c}" stroke-width="${R - r}"><title>${esc(x.n)}</title></circle>`
        : `<path d="M${pt(R, a0)} A${R},${R} 0 ${big} 1 ${pt(R, a1)} L${pt(r, a1)} A${r},${r} 0 ${big} 0 ${pt(r, a0)} Z" fill="${x.c}"><title>${esc(x.n)}: ${fmt(x.k, 1)} kWh · ${fmt(x.k * P)} €</title></path>`;
      a += sw;
    });
    return `<div class="donut"><svg viewBox="0 0 200 200" role="img" aria-label="Anteile der Verbraucher">${segs}
      <text x="100" y="96" text-anchor="middle" class="dv">${fmt(tot * P)} €</text><text x="100" y="118" text-anchor="middle" class="lbl">${fmt(tot, 1)} kWh</text></svg>
      <div class="dl">${rows.map((x) => `<div><i style="background:${x.c}"></i><span>${esc(x.n)}</span><b>${Math.round(x.k / tot * 100)} %</b></div>`).join('')}</div></div>`;
  }

  _sankey(monDev, col, P) {
    const tot = monDev.reduce((a, b) => a + b, 0);
    if (!(tot > 0)) return '<div class="muted">Noch keine Werte in diesem Monat.</div>';
    const H = 250, top0 = 24, gap = 10, nw = 10, x0 = 110, x1 = 310, x2 = 500;
    const k = (H - gap * (AREAS.length - 1)) / tot;
    let o = `<text x="0" y="12" class="lbl">Erfasst</text><text x="${x1}" y="12" class="lbl">Raum</text><text x="${x2}" y="12" class="lbl">Gerät</text>`;
    o += `<rect x="${x0}" y="${top0}" width="${nw}" height="${H}" rx="3" fill="var(--ink2)"/><text x="${x0 - 8}" y="${top0 + 14}" text-anchor="end" class="ls">Haus</text><text x="${x0 - 8}" y="${top0 + 34}" text-anchor="end" class="lbl">${fmt(tot, 1)} kWh</text>`;
    const band = (xa, ya, xb, yb, h) => `M${xa},${ya} C${(xa + xb) / 2},${ya} ${(xa + xb) / 2},${yb} ${xb},${yb} L${xb},${yb + h} C${(xa + xb) / 2},${yb + h} ${(xa + xb) / 2},${ya + h} ${xa},${ya + h} Z`;
    let ys = top0, ya = top0, yd = top0;
    const labels = [];
    AREAS.forEach(([an, idx, collapse]) => {
      const v = idx.reduce((a, i) => a + monDev[i], 0), h = v * k, c = col[DEV[idx[0]].cat];
      o += `<path d="${band(x0 + nw, ys, x1, ya, h)}" fill="${c}" fill-opacity=".28"><title>${an}: ${fmt(v, 1)} kWh · ${fmt(v * P)} €</title></path>`;
      o += `<rect x="${x1}" y="${ya}" width="${nw}" height="${Math.max(h, 2)}" rx="2" fill="${c}"/><text x="${x1 + 16}" y="${ya + Math.max(h, 2) / 2 + 5}" class="lm">${an}</text>`;
      let yaa = ya;
      const items = collapse ? [{ name: collapse, v, cat: 4 }] : idx.map((i) => ({ name: DEV[i].name, v: monDev[i], cat: DEV[i].cat }));
      items.forEach((d) => {
        const hh = d.v * k;
        o += `<path d="${band(x1 + nw, yaa, x2, yd, hh)}" fill="${col[d.cat]}" fill-opacity=".28"><title>${d.name}: ${fmt(d.v)} kWh · ${fmt(d.v * P)} €</title></path>`;
        o += `<rect x="${x2}" y="${yd}" width="${nw}" height="${Math.max(hh, 2)}" rx="2" fill="${col[d.cat]}"/>`;
        labels.push([yd + Math.max(hh, 2) / 2, `${d.name} · ${fmt(d.v * P)} €`]);
        yaa += hh; yd += hh + 4;
      });
      ys += h; ya += h + gap; yd += gap - 4;
    });
    let last = -99;
    labels.forEach(([y, t]) => { const yy = Math.max(y + 5, last + 18); last = yy; o += `<text x="${x2 + 16}" y="${yy}" class="lm">${t}</text>`; });
    const gy = Math.max(ya, yd, last) + 10;
    o += `<rect x="${x0}" y="${gy}" width="${nw}" height="14" rx="3" fill="none" stroke="var(--muted)" stroke-dasharray="3 3"/><text x="${x0 + 18}" y="${gy + 11}" class="lbl">Nicht erfasst: unbekannt, Hauszähler fehlt</text>`;
    return `<svg class="sankey" viewBox="0 0 680 ${Math.ceil(gy + 24)}">${o}</svg>`;
  }

  _days8(col, P) {
    const W = 900, Hh = 230, m = { l: 48, r: 10, t: 18, b: 28 }, iw = W - m.l - m.r, ih = Hh - m.t - m.b;
    const ser = this._days.map((_, j) => { const r = [0, 0, 0, 0, 0]; DEV.forEach((d, i) => { r[d.cat] += this._dayK[i][j] * P; }); return r; });
    const tots = ser.map((r) => r.reduce((a, b) => a + b, 0));
    const step = [0.25, 0.5, 1, 2, 5, 10].find((s) => Math.max(...tots) <= s * 5) || 20;
    const max = Math.max(step, Math.ceil(Math.max(...tots) / step) * step);
    const y = (v) => m.t + ih - v / max * ih;
    let o = '';
    for (let v = 0; v <= max + 1e-9; v += step) o += `<line x1="${m.l}" x2="${W - m.r}" y1="${y(v)}" y2="${y(v)}" class="${v === 0 ? 'base' : 'gl'}"/><text x="${m.l - 8}" y="${y(v) + 4}" text-anchor="end" class="lbl">${fmt(v)} €</text>`;
    const bw = iw / 8, barW = Math.min(56, bw * 0.56);
    this._days.forEach((t, i) => {
      const cx = m.l + bw * i + bw / 2;
      const segs = ser[i].map((v, j) => ({ v, j })).filter((s) => s.v > 0);
      let acc = 0;
      segs.forEach((s, si) => {
        const isTop = si === segs.length - 1, h = s.v / max * ih, yy = y(acc + s.v), hh = Math.max(h - (isTop ? 0 : 2), 0.6);
        if (isTop) { const r = Math.min(4, hh); o += `<path d="M${cx - barW / 2},${yy + hh} V${yy + r} Q${cx - barW / 2},${yy} ${cx - barW / 2 + r},${yy} H${cx + barW / 2 - r} Q${cx + barW / 2},${yy} ${cx + barW / 2},${yy + r} V${yy + hh} Z" fill="${col[s.j]}"/>`; }
        else o += `<rect x="${cx - barW / 2}" y="${yy}" width="${barW}" height="${hh}" fill="${col[s.j]}"/>`;
        acc += s.v;
      });
      const today = i === 7;
      o += `<text x="${cx}" y="${Hh - 8}" text-anchor="middle" class="${today ? 'ls' : 'lbl'}">${today ? 'Heute' : WD[t.getDay()] + ' ' + t.getDate() + '.'}</text>`;
      if (tots[i] > 0) o += `<text x="${cx}" y="${y(tots[i]) - 6}" text-anchor="middle" class="lm">${fmt(tots[i])} €</text>`;
      o += `<rect x="${m.l + bw * i}" y="${m.t}" width="${bw}" height="${ih}" fill="transparent"><title>${today ? 'Heute bis jetzt' : WD[t.getDay()] + ' ' + t.getDate() + '.'}\n${ser[i].map((v, j) => v > 0 ? `${CATS[j]}: ${fmt(v)} €` : '').filter(Boolean).join('\n')}\nSumme: ${fmt(tots[i])} €</title></rect>`;
    });
    return `<svg class="days" viewBox="0 0 ${W} ${Hh}">${o}</svg>`;
  }

  _css(col, dark) {
    return `
:host{--card:var(--ha-card-background,var(--card-background-color,#fff));--ink:var(--primary-text-color);--ink2:var(--secondary-text-color);--muted:var(--secondary-text-color);--line:var(--divider-color,rgba(127,127,127,.25));--sunk:rgba(127,127,127,.09);--accent:${dark ? '#8b85f0' : '#4f46e5'};--accent-soft:${dark ? 'rgba(139,133,240,.18)' : '#e9e8fd'};--s1:${col[0]};--s3:${col[2]};--serious:#ec835a;--good:#0ca30c;--crit:#d03b3b;--fd:"Space Grotesk",var(--ha-font-family-body,system-ui),sans-serif;--fb:"Inter",var(--ha-font-family-body,system-ui),sans-serif;display:block}
*{box-sizing:border-box}
.wrap{max-width:1240px;margin:0 auto;padding:16px;display:grid;gap:16px;font-family:var(--fb);font-size:14px;line-height:1.5;color:var(--ink)}
.top{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}.t{display:flex;align-items:center;gap:10px}
.logo{width:30px;height:30px;border-radius:8px;background:var(--ink);color:var(--card);display:grid;place-items:center}
.h1{font-family:var(--fd);font-size:20px;font-weight:600;line-height:1.2}.h2{font-family:var(--fd);font-size:18px;font-weight:600}
.muted{color:var(--muted)}.sm{font-size:12px}.price{color:var(--ink2);cursor:pointer;text-decoration:underline dotted}
.tag{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;padding:3px 10px;border-radius:999px}
.tag.run{color:var(--accent);background:var(--accent-soft)}
.dot{width:8px;height:8px;border-radius:50%;background:var(--good);animation:p 2s infinite}
@keyframes p{0%{box-shadow:0 0 0 0 rgba(12,163,12,.5)}70%{box-shadow:0 0 0 7px rgba(12,163,12,0)}100%{box-shadow:0 0 0 0 rgba(12,163,12,0)}}
@media (prefers-reduced-motion:reduce){.dot{animation:none}}
.bar-row{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
.seg{display:inline-flex;background:var(--sunk);border:1px solid var(--line);border-radius:10px;padding:3px;gap:2px}
.seg button{appearance:none;border:0;background:none;font:inherit;font-size:13px;font-weight:600;color:var(--ink2);padding:5px 12px;border-radius:7px;cursor:pointer}
.seg button[aria-pressed="true"]{background:var(--card);color:var(--ink);box-shadow:0 1px 2px rgba(0,0,0,.2)}
.grid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:16px}
.c12{grid-column:span 12}.c7{grid-column:span 7}.c5{grid-column:span 5}.c3{grid-column:span 3}
.card{background:var(--card);border:1px solid var(--line);border-radius:var(--ha-card-border-radius,14px);padding:16px;display:grid;gap:12px;align-content:start;min-width:0}
.ch{display:flex;justify-content:space-between;align-items:baseline;gap:8px;flex-wrap:wrap}.sub{font-size:12px;color:var(--muted)}
.kpi{gap:2px}.kpi[data-mi]{cursor:pointer}
.eb{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);font-weight:600}
.v{font-family:var(--fd);font-size:30px;font-weight:600;line-height:1.15;font-variant-numeric:tabular-nums}.v small{font-size:15px;font-weight:500;color:var(--ink2);margin-left:3px}
.d{font-size:12.5px;color:var(--ink2)}.delta{font-weight:600}.delta.up{color:var(--crit)}.delta.down{color:var(--good)}
.fc{height:8px;border-radius:4px;background:var(--sunk);overflow:hidden;position:relative;border:1px solid var(--line);margin:6px 0 2px}
.fc span{position:absolute;inset:0 auto 0 0;background:var(--accent);border-radius:4px}
.fc em{position:absolute;inset:0;background:repeating-linear-gradient(135deg,var(--accent-soft) 0 4px,transparent 4px 8px)}
.stack{display:flex;height:14px;border-radius:5px;overflow:hidden;gap:2px;background:var(--sunk)}.stack div{height:100%}
.running{display:grid;gap:8px}
.run{display:grid;grid-template-columns:10px minmax(0,1fr) auto;gap:10px;align-items:center;padding:8px 10px;border-radius:10px;background:var(--sunk);cursor:pointer}
.sw{width:10px;height:10px;border-radius:3px}.w{font-weight:600;font-variant-numeric:tabular-nums}
.rank{display:grid;gap:10px}
.tgl{cursor:pointer}.sw2{margin-left:8px;padding:2px 8px;border:1px solid var(--line);border-radius:999px}
.donut{display:grid;grid-template-columns:minmax(150px,200px) 1fr;gap:20px;align-items:center}.donut svg{width:100%;height:auto}
.donut .lbl{font-size:13px}
.dv{font:600 20px 'Space Grotesk',sans-serif;fill:var(--ink)}
.dl{display:grid;gap:9px}.dl div{display:grid;grid-template-columns:12px 1fr auto;gap:10px;align-items:center}.dl i{width:12px;height:12px;border-radius:3px}.dl b{font-variant-numeric:tabular-nums}
@media(max-width:500px){.donut{grid-template-columns:1fr}.donut svg{max-width:200px;margin:auto}}
.rk{display:grid;grid-template-columns:minmax(90px,140px) minmax(0,1fr) 64px 58px;gap:10px;align-items:center;font-size:13px}
.track{height:12px;background:var(--sunk);border-radius:0 4px 4px 0;overflow:hidden}.fill{height:100%;border-radius:0 4px 4px 0}
.r{text-align:right;font-variant-numeric:tabular-nums}.r.e{font-weight:600}
.ins{display:grid;gap:10px}
.insight{display:grid;grid-template-columns:28px minmax(0,1fr);gap:10px;padding:12px;border-radius:12px;background:var(--sunk);border:1px solid var(--line)}
.ic{width:28px;height:28px;border-radius:8px;display:grid;place-items:center;background:var(--card);border:1px solid var(--line)}
.insight b{display:block;margin-bottom:2px}.insight p{margin:0;color:var(--ink2);font-size:13px}.insight p b{display:inline;margin:0}
svg{display:block;width:100%;height:auto}
.lbl{fill:var(--muted);font-size:11px;font-family:var(--fb)}.ls{fill:var(--ink);font-size:12px;font-weight:600;font-family:var(--fb)}.lm{fill:var(--ink2);font-size:11px;font-family:var(--fb)}
.sankey .lbl,.sankey .lm{font-size:15px}.sankey .ls{font-size:16px}
.gl{stroke:var(--line);stroke-width:1}.base{stroke:var(--ink2);stroke-width:1}
.legend{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:12px;color:var(--ink2)}.legend span{display:inline-flex;align-items:center;gap:6px}.legend i{width:10px;height:10px;border-radius:3px;display:inline-block}
@media (max-width:980px){.c7,.c5{grid-column:span 12}.c3{grid-column:span 6}}
@media (max-width:560px){.c3{grid-column:span 12}.wrap{padding:12px}.rk{grid-template-columns:minmax(80px,110px) minmax(0,1fr) 54px 50px;gap:8px}.v{font-size:26px}}`;
  }
}
customElements.define('energie-dashboard-card', EnergieDashboardCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: 'energie-dashboard-card', name: 'Energie-Dashboard', description: 'Energie-Übersicht mit Kosten, Live-Verbrauch, Sankey und Verlauf' });
