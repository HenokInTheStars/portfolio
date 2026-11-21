import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SCORES_ARE_SIMULATED, SPAM_SCORES } from '../data/spamScores';

const MIN = 5;
const MAX = 95;
const MEASURED = 50;
const H = 200;
const PAD_L = 14;
const PAD_R = 14;
const TOP = 30;
const ROW_H = 52;
const GAP = 24;
const AXIS_Y = TOP + ROW_H * 2 + GAP + 10;

type Cls = 'spam' | 'ham';
interface Point { s: number; cls: Cls; x: number; y: number }

const jitter = (i: number) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};
const pct = (v: number) => (Number.isFinite(v) ? `${(v * 100).toFixed(2)}%` : '–');
const cssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

function confusion(t: number) {
  const tp = SPAM_SCORES.spam.filter((s) => s >= t - 1e-9).length;
  const fp = SPAM_SCORES.ham.filter((s) => s >= t - 1e-9).length;
  const fn = SPAM_SCORES.spam.length - tp;
  const tn = SPAM_SCORES.ham.length - fp;
  const precision = tp + fp ? tp / (tp + fp) : NaN;
  const recall = tp / SPAM_SCORES.spam.length;
  const f1 = precision + recall ? (2 * precision * recall) / (precision + recall) : NaN;
  return { tp, fp, fn, tn, precision, recall, f1 };
}

/** Interactive precision/recall trade-off for the SMS spam classifier. */
export default function ThresholdDemo() {
  const [value, setValue] = useState(MEASURED);
  const [tip, setTip] = useState<{ x: number; y: number; text: string } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const widthRef = useRef(0);
  const dragging = useRef(false);
  const valueRef = useRef(value);
  valueRef.current = value;

  const t = value / 100;
  const m = useMemo(() => confusion(t), [t]);
  const total = SPAM_SCORES.spam.length + SPAM_SCORES.ham.length;

  const xOf = (s: number) => PAD_L + s * (widthRef.current - PAD_L - PAD_R);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const W = widthRef.current;
    if (!canvas || !W) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const th = valueRef.current / 100;
    const c = {
      spam: cssVar('--c-spam'), ham: cssVar('--c-ham'), ink: cssVar('--ink'),
      muted: cssVar('--muted'), line: cssVar('--line'), surface: cssVar('--surface'),
    };
    ctx.clearRect(0, 0, W, H);

    // Region that goes to the spam folder
    const tx = xOf(th);
    ctx.fillStyle = c.spam;
    ctx.globalAlpha = 0.07;
    ctx.fillRect(tx, TOP - 8, W - PAD_R - tx, ROW_H * 2 + GAP + 16);
    ctx.globalAlpha = 1;

    // Row labels
    ctx.font = '500 11px "JetBrains Mono", monospace';
    ctx.fillStyle = c.muted;
    ctx.textBaseline = 'bottom';
    ctx.textAlign = 'left';
    ctx.fillText('SPAM', PAD_L, TOP - 10);
    ctx.fillText('NOT SPAM', PAD_L, TOP + ROW_H + GAP - 8);

    // Score axis
    ctx.strokeStyle = c.line;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(PAD_L, AXIS_Y + 0.5);
    ctx.lineTo(W - PAD_R, AXIS_Y + 0.5);
    ctx.stroke();
    ctx.textBaseline = 'top';
    for (const v of [0, 0.25, 0.5, 0.75, 1]) {
      const x = xOf(v);
      ctx.beginPath();
      ctx.moveTo(x + 0.5, AXIS_Y);
      ctx.lineTo(x + 0.5, AXIS_Y + 4);
      ctx.stroke();
      ctx.textAlign = v === 0 ? 'left' : v === 1 ? 'right' : 'center';
      ctx.fillStyle = c.muted;
      ctx.fillText(v === 0.5 && W > 420 ? '0.5 · measured' : String(v), x, AXIS_Y + 7);
    }

    // Dots: colour = true class; flagged ones solid, delivered ones lighter
    for (const pt of pointsRef.current) {
      ctx.globalAlpha = pt.s >= th - 1e-9 ? 1 : 0.38;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = pt.cls === 'spam' ? c.spam : c.ham;
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = c.surface;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Threshold line and handle
    ctx.strokeStyle = c.ink;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(tx, TOP - 12);
    ctx.lineTo(tx, AXIS_Y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(tx, TOP - 16, 6, 0, Math.PI * 2);
    ctx.fillStyle = c.ink;
    ctx.fill();
    ctx.strokeStyle = c.surface;
    ctx.lineWidth = 2;
    ctx.stroke();
  }, []);

  const layout = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const W = wrap.clientWidth;
    if (!W) return;
    widthRef.current = W;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0);
    const rows = [TOP, TOP + ROW_H + GAP];
    pointsRef.current = [
      ...SPAM_SCORES.spam.map((s, i) => ({ s, cls: 'spam' as const, x: xOf(s), y: rows[0] + 6 + jitter(i) * (ROW_H - 12) })),
      ...SPAM_SCORES.ham.map((s, i) => ({ s, cls: 'ham' as const, x: xOf(s), y: rows[1] + 6 + jitter(i + 500) * (ROW_H - 12) })),
    ];
    draw();
  }, [draw]);

  // Size, theme and colour-scheme changes all trigger a redraw.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(layout);
    ro.observe(wrap);
    const mo = new MutationObserver(() => requestAnimationFrame(draw));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onScheme = () => requestAnimationFrame(draw);
    mq.addEventListener('change', onScheme);
    document.fonts.ready.then(draw);
    return () => {
      ro.disconnect();
      mo.disconnect();
      mq.removeEventListener('change', onScheme);
    };
  }, [layout, draw]);

  useEffect(draw, [value, draw]);

  const setFromX = (clientX: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const r = canvas.getBoundingClientRect();
    const s = (clientX - r.left - PAD_L) / (r.width - PAD_L - PAD_R);
    setValue(Math.max(MIN, Math.min(MAX, Math.round(s * 100))));
  };

  const hover = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    let best: Point | null = null;
    let bestD = 100;
    for (const pt of pointsRef.current) {
      const d = (pt.x - x) ** 2 + (pt.y - y) ** 2;
      if (d < bestD) {
        bestD = d;
        best = pt;
      }
    }
    if (!best) return setTip(null);
    const flagged = best.s >= t - 1e-9;
    setTip({
      x: Math.max(110, Math.min(widthRef.current - 110, best.x)),
      y: best.y,
      text: `${best.cls === 'spam' ? 'Spam' : 'Not spam'} · score ${best.s.toFixed(2)} · ${flagged ? 'sent to spam' : 'delivered'}`,
    });
  };

  const realLabel = m.fp === 1 ? 'real message lands' : 'real messages land';

  return (
    <section className="demo" aria-labelledby="demo-h">
      <div className="demo-intro">
        <span className="label">Interactive</span>
        <h3 id="demo-h">Move the threshold</h3>
        <p>
          The model gives every message a spam score from 0 to 1. Anything at or above the threshold goes to the spam folder. Drag
          the line or use the slider to feel the trade-off I had to make.
        </p>
      </div>

      <div className="legend" aria-hidden="true">
        <span><i style={{ background: 'var(--c-spam)' }} />Spam ({SPAM_SCORES.spam.length})</span>
        <span><i style={{ background: 'var(--c-ham)' }} />Not spam ({SPAM_SCORES.ham.length})</span>
        <span className="region"><i />Sent to spam folder</span>
      </div>

      <div className="strip-wrap" ref={wrapRef}>
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`Strip plot of ${total.toLocaleString('en')} test messages by spam score. Threshold ${t.toFixed(2)}: ${m.tp} spam caught, ${m.fn} missed, ${m.fp} real messages flagged.`}
          onPointerDown={(e) => {
            dragging.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            setTip(null);
            setFromX(e.clientX);
          }}
          onPointerMove={(e) => {
            if (dragging.current) setFromX(e.clientX);
            else if (e.pointerType === 'mouse') hover(e);
          }}
          onPointerUp={() => (dragging.current = false)}
          onPointerCancel={() => (dragging.current = false)}
          onPointerLeave={() => setTip(null)}
        />
        {tip && (
          <div className="tip" style={{ left: tip.x, top: tip.y }}>
            {tip.text}
          </div>
        )}
      </div>

      <div className="slider-row">
        <label htmlFor="thr" className="label">Threshold</label>
        <input id="thr" type="range" min={MIN} max={MAX} step={1} value={value} onChange={(e) => setValue(Number(e.target.value))} />
        <output htmlFor="thr">{t.toFixed(2)}</output>
        <button type="button" className="reset" onClick={() => setValue(MEASURED)}>Back to 0.50</button>
      </div>

      <p className="demo-sentence" aria-live="polite">
        At <b>{t.toFixed(2)}</b>, <b>{m.fp}</b> {realLabel} in spam, and <b>{m.fn}</b> of {SPAM_SCORES.spam.length} spam texts get
        through.{value === MEASURED && ' This is the measured result.'}
      </p>

      <div className="demo-grid">
        <div className="cm-wrap">
          <table className="cm">
            <caption className="label">{total.toLocaleString('en')} test messages</caption>
            <thead>
              <tr><td /><th scope="col">Sent to spam</th><th scope="col">Delivered</th></tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Actually spam</th>
                <td><b>{m.tp}</b><span>caught</span></td>
                <td><b>{m.fn}</b><span>missed</span></td>
              </tr>
              <tr>
                <th scope="row">Actually not spam</th>
                <td className={`costly${m.fp > 0 ? ' on' : ''}`}><b>{m.fp}</b><span>wrongly flagged</span></td>
                <td><b>{m.tn}</b><span>delivered</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="bars">
          {([['Precision', m.precision], ['Recall', m.recall], ['F1', m.f1]] as const).map(([label, v]) => (
            <div className="bar-row" key={label}>
              <span className="label">{label}</span>
              <div className="track"><div className="fill" style={{ width: Number.isFinite(v) ? `${v * 100}%` : '0%' }} /></div>
              <output>{pct(v)}</output>
            </div>
          ))}
        </div>
      </div>

      {SCORES_ARE_SIMULATED && (
        <p className="demo-note">
          At 0.50 the numbers are the measured test results. The individual scores are simulated to match them, so other thresholds
          are illustrative until the model's real probability scores are added.
        </p>
      )}
    </section>
  );
}
