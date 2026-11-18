// fab-icons: eigene Icons für Fabrication. Nutzung: icon: fab:laser
const ICONS = { laser: 'M11.20 2.20L11.20 16.40A0.8 0.8 0 0 0 12.80 16.40L12.80 2.20A0.8 0.8 0 0 0 11.20 2.20ZM9.40 18.40L1.60 18.40A0.8 0.8 0 0 0 1.60 20.00L9.40 20.00A0.8 0.8 0 0 0 9.40 18.40ZM14.60 20.00L22.40 20.00A0.8 0.8 0 0 0 22.40 18.40L14.60 18.40A0.8 0.8 0 0 0 14.60 20.00ZM9.80 17.29L3.09 14.16A0.8 0.8 0 0 0 2.42 15.61L9.12 18.74A0.8 0.8 0 0 0 9.80 17.29ZM14.88 18.74L21.58 15.61A0.8 0.8 0 0 0 20.91 14.16L14.20 17.29A0.8 0.8 0 0 0 14.88 18.74ZM10.78 16.34L6.97 11.46A0.8 0.8 0 0 0 5.71 12.44L9.52 17.33A0.8 0.8 0 0 0 10.78 16.34ZM14.48 17.33L18.29 12.44A0.8 0.8 0 0 0 17.03 11.46L13.22 16.34A0.8 0.8 0 0 0 14.48 17.33ZM11.94 15.90L10.55 10.69A0.8 0.8 0 0 0 9.00 11.10L10.40 16.32A0.8 0.8 0 0 0 11.94 15.90ZM13.60 16.32L15.00 11.10A0.8 0.8 0 0 0 13.45 10.69L12.06 15.90A0.8 0.8 0 0 0 13.60 16.32ZM10.70 19.20a1.3 1.3 0 1 0 2.60 0a1.3 1.3 0 1 0 -2.60 0ZM5.45 8.30a0.85 0.85 0 1 0 1.70 0a0.85 0.85 0 1 0 -1.70 0ZM17.05 10.20a0.85 0.85 0 1 0 1.70 0a0.85 0.85 0 1 0 -1.70 0Z' };
window.customIcons = window.customIcons || {};
window.customIcons.fab = {
  getIcon: async (name) => ({ path: ICONS[name] || '', viewBox: '0 0 24 24' }),
  getIconList: async () => Object.keys(ICONS).map((name) => ({ name })),
};
// Fallback: ha-icon rendert ein <iron-icon>, wenn das Icon-Set beim ersten Zeichnen noch nicht
// geladen war (z. B. Reiter-Icons). HA definiert iron-icon nicht mehr, daher ein Minimal-Element.
if (!customElements.get('iron-icon')) customElements.define('iron-icon', class extends HTMLElement {
  constructor() { super(); const v = this.icon; delete this.icon; this._i = v; }
  set icon(v) { this._i = v; this._r(); }
  get icon() { return this._i; }
  connectedCallback() { this._r(); }
  async _r() {
    const [p, n] = (this._i || '').split(':');
    const set = window.customIcons && window.customIcons[p];
    if (!set || !n) return;
    const ic = await set.getIcon(n);
    this.innerHTML = `<svg viewBox="${ic.viewBox || '0 0 24 24'}" style="width:var(--mdc-icon-size,24px);height:var(--mdc-icon-size,24px);fill:currentColor;display:block"><path d="${ic.path}"/></svg>`;
  }
});
