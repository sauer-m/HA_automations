// status-glow-card v1 – legt einen leuchtenden Rand um die Section, in der die Karte steht.
// Die Karte selbst ist unsichtbar. Registriert als Inline-Ressource in HA (Fabrication-Dashboard).
//
// type: custom:status-glow-card
// entity: sensor.prusa_xl            # Druckstatus
// power: switch.prusa_xl_keller       # optional: Steckdose aus => "off"
// running: [printing, busy, paused]   # optional, sonst Standardliste
// error: [error, attention]           # optional
// colors: {off: '#9e9e9e', idle: '#43a047', running: '#ff9800', error: '#e53935'}
const DEF_RUNNING = ['printing', 'busy', 'paused', 'prepare', 'running', 'pause', 'slicing', 'init'];
const DEF_ERROR = ['error', 'attention', 'failed'];
const DEF_OFF = ['unavailable', 'unknown', 'offline', 'off', ''];
const DEF_COLORS = { off: '#9e9e9e', idle: '#43a047', running: '#ff9800', error: '#e53935' };

class StatusGlowCard extends HTMLElement {
  setConfig(c) {
    if (!c || !c.entity) throw new Error('status-glow-card: entity fehlt');
    this._c = c;
    this._apply();
  }
  set hass(h) { this._h = h; this._apply(); }
  connectedCallback() { this._target = null; setTimeout(() => this._apply(), 0); setTimeout(() => this._apply(), 800); }
  disconnectedCallback() { this._clear(); }
  getCardSize() { return 0; }
  getGridOptions() { return { columns: 'full', rows: 'auto', min_rows: 0 }; }

  _status() {
    const h = this._h, c = this._c;
    if (!h || !c) return null;
    if (c.power) {
      const p = h.states[c.power];
      if (!p || p.state === 'off' || p.state === 'unavailable') return 'off';
    }
    const st = h.states[c.entity] ? h.states[c.entity].state : 'unavailable';
    if ((c.off || DEF_OFF).includes(st)) return 'off';
    if ((c.error || DEF_ERROR).includes(st)) return 'error';
    if ((c.running || DEF_RUNNING).includes(st)) return 'running';
    return 'idle';
  }

  _walk() {
    // vom Karten-Element über Shadow-Grenzen nach oben bis zur Section
    const chain = [];
    let n = this;
    for (let i = 0; i < 40 && n; i++) {
      n = n.parentElement || (n.getRootNode && n.getRootNode().host) || null;
      if (n) chain.push(n);
    }
    return chain;
  }

  _apply() {
    const s = this._status();
    if (!s) return;
    const chain = this._walk();
    const edit = chain.some((e) => /EDIT-MODE|CARD-OPTIONS|PREVIEW|DIALOG/.test(e.tagName));
    const hc = chain.find((e) => e.tagName === 'HUI-CARD');
    if (hc && !edit) {
      hc.style.display = 'none';
      // Grid-Zelle um die Karte ebenfalls ausblenden, damit keine Lücke bleibt
      const w = hc.parentElement;
      if (w && w.childElementCount === 1 && w.getRootNode().host && w.getRootNode().host.tagName === 'HUI-GRID-SECTION') w.style.display = 'none';
    }
    this.style.display = edit ? 'block' : 'none';
    if (edit) this.innerHTML = `<div style="padding:4px 8px;font-size:12px;opacity:.6">Status-Glow: ${s}</div>`;
    const t = chain.find((e) => e.tagName === 'HUI-GRID-SECTION') || chain.find((e) => e.tagName === 'HUI-SECTION');
    if (!t) return;
    this._target = t;
    const col = Object.assign({}, DEF_COLORS, this._c.colors || {})[s];
    const strong = s === 'running' || s === 'error';
    t.style.display = 'block';
    t.style.borderRadius = 'var(--ha-card-border-radius, 12px)';
    t.style.transition = 'box-shadow .6s ease';
    t.style.boxShadow = strong
      ? `0 0 0 2px ${col}, 0 0 18px 4px ${col}99`
      : `0 0 0 2px ${col}${s === 'off' ? '66' : 'cc'}, 0 0 12px 2px ${col}${s === 'off' ? '22' : '55'}`;
  }

  _clear() {
    if (this._target) { this._target.style.boxShadow = ''; this._target = null; }
  }
}
if (!customElements.get('status-glow-card')) customElements.define('status-glow-card', StatusGlowCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: 'status-glow-card', name: 'Status-Glow', description: 'Leuchtender Section-Rand je nach Gerätestatus' });
