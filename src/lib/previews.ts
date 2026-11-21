import type { PreviewKind } from '../data/projects';

/** Deterministic pseudo-random in [0, 1) so previews look the same on every build. */
const seed = (i: number) => {
  const x = Math.sin(i * 91.7 + 3.1) * 15731.743;
  return x - Math.floor(x);
};

/** Small illustrative SVGs shown beside the cursor in the "More projects" list. */
export function previewSvg(kind: PreviewKind): string {
  if (kind === 'anomaly') {
    const spikes: Record<number, number> = { 9: 34, 24: 150, 33: 40 };
    const pts: string[] = [];
    const outs: string[] = [];
    for (let i = 0; i < 41; i++) {
      const x = 16 + i * 6.2;
      const y = spikes[i] ?? 94 + Math.sin(i * 0.7) * 9 + (seed(i) - 0.5) * 12;
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
      if (spikes[i]) outs.push(`<circle class="pv-out" cx="${x.toFixed(1)}" cy="${y}" r="4.5"/>`);
    }
    return `<svg viewBox="0 0 280 180"><rect class="pv-bg" width="280" height="180"/>
      <rect class="pv-band" x="16" y="72" width="248" height="44" rx="4"/>
      <polyline class="pv-line" points="${pts.join(' ')}"/>${outs.join('')}
      <text class="pv-t" x="16" y="22">DAILY SALES · MAD BAND</text>
      <text class="pv-t" x="264" y="170" text-anchor="end">3 ANOMALIES</text></svg>`;
  }
  if (kind === 'segments') {
    const centers = [[60, 60], [70, 132], [140, 96], [210, 56], [212, 136]];
    let dots = '';
    centers.forEach(([cx, cy], k) => {
      for (let j = 0; j < 13; j++) {
        const a = seed(k * 40 + j) * Math.PI * 2;
        const r = 4 + seed(k * 40 + j + 17) * 20;
        dots += `<circle class="pv-k${k}" cx="${(cx + Math.cos(a) * r).toFixed(1)}" cy="${(cy + Math.sin(a) * r).toFixed(1)}" r="3.6"/>`;
      }
    });
    return `<svg viewBox="0 0 280 180"><rect class="pv-bg" width="280" height="180"/>
      <line class="pv-axis" x1="24" y1="166" x2="264" y2="166"/><line class="pv-axis" x1="24" y1="20" x2="24" y2="166"/>
      ${dots}
      <text class="pv-t" x="264" y="160" text-anchor="end">INCOME →</text>
      <text class="pv-t" x="30" y="16">SPENDING ↑ · K = 5</text></svg>`;
  }
  return `<svg viewBox="0 0 280 180"><rect class="pv-bg" width="280" height="180"/>
    <rect class="pv-bub-me" x="118" y="28" width="146" height="30" rx="12"/>
    <text class="pv-txt-me" x="130" y="47">I'm having a rough day</text>
    <rect class="pv-tag" x="16" y="70" width="152" height="20" rx="6"/>
    <text class="pv-tag-t" x="24" y="84">NO INTENT · SENTIMENT −0.6</text>
    <rect class="pv-bub" x="16" y="98" width="208" height="46" rx="12"/>
    <text class="pv-txt" x="28" y="117">Sorry to hear that. Want to</text>
    <text class="pv-txt" x="28" y="134">talk about what happened?</text></svg>`;
}
