// status-glow-card v2 – unsichtbare Karte, die der vorherigen sichtbaren Karte in der Section
// einen leuchtenden Rand je nach Gerätestatus gibt. Quelle: Smarthome\dashboards\status-glow-card.js
//
// type: custom:status-glow-card
// entity: sensor.prusa_xl              # Druckstatus
// power: switch.prusa_xl_keller         # optional: Steckdose aus => off
// skip: [picture-entity, picture]       # optional: diese Kartentypen beim Rückwärtssuchen überspringen
// running / error / off: [...]          # optional: eigene Zustandslisten
// colors: {off, idle, running, error}   # optional
const DEF_RUNNING = ['printing', 'busy', 'paused', 'prepare', 'running', 'pause', 'slicing', 'init'];
const DEF_ERROR = ['error', 'attention', 'failed'];
const DEF_OFF = ['unavailable', 'unknown', 'offline', 'off', ''];
const DEF_COLORS = { off: '#9e9e9e', idle: '#43a047', running: '#fdd835', error: '#e53935' };

class StatusGlowCard extends HTMLElement {
  setConfig(c) {
    if (!c || !c.entity) throw new Error('status-glow-card: entity fehlt');
    this._c = c;
    this._apply();
  }
  set hass(h) {
    this._h = h;
    this._apply();
    clearTimeout(this._tm);
    this._tm = setTimeout(() => this._apply(), 150); // nach Sichtbarkeitswechsel der Nachbarkarten
  }
  connectedCallback() {
    [0, 300, 1000].forEach((t) => setTimeout(() => this._apply(), t));
  }
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

  _chain() {
    const chain = [];
    let n = this;
    for (let i = 0; i < 40 && n; i++) {
      n = n.parentElement || (n.getRootNode && n.getRootNode().host) || null;
      if (n) chain.push(n);
    }
    return chain;
  }

  _findTarget(wrap) {
    const skip = (this._c.skip || []).map((s) => 'HUI-' + s.toUpperCase() + '-CARD');
    let w = wrap.previousElementSibling;
    for (let i = 0; i < 30 && w; i++, w = w.previousElementSibling) {
      if (w.classList.contains('hidden') || w.style.display === 'none') continue;
      const hc = w.querySelector('hui-card');
      const card = hc && hc.firstElementChild;
      if (!card || hc.hidden || hc.style.display === 'none') continue;
      if (card.tagName === 'STATUS-GLOW-CARD' || skip.includes(card.tagName)) continue;
      return (card.shadowRoot && card.shadowRoot.querySelector('ha-card')) || card;
    }
    return null;
  }

  _apply() {
    const s = this._status();
    if (!s) return;
    const chain = this._chain();
    const edit = chain.some((e) => /EDIT-MODE|CARD-OPTIONS|PREVIEW|DIALOG/.test(e.tagName));
    const hc = chain.find((e) => e.tagName === 'HUI-CARD');
    const wrap = hc && hc.parentElement;
    this.style.display = edit ? 'block' : 'none';
    if (edit) this.innerHTML = `<div style="padding:4px 8px;font-size:12px;opacity:.6">Status-Glow: ${s}</div>`;
    if (!hc || !wrap) return;
    if (!edit) { hc.style.display = 'none'; if (wrap.childElementCount === 1) wrap.style.display = 'none'; }
    const t = this._findTarget(wrap);
    if (t !== this._target) this._clear();
    if (!t) return;
    this._target = t;
    const col = Object.assign({}, DEF_COLORS, this._c.colors || {})[s];
    const strong = s === 'running' || s === 'error';
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
window.customCards.push({ type: 'status-glow-card', name: 'Status-Glow', description: 'Leuchtender Rand um die vorherige Karte je nach Gerätestatus' });
