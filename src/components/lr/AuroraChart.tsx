import { useId } from "react";

export type AuroraSeries = { name: string; color: string; points: number[] };

/**
 * Multi-marker trends as translucent layered ridges with a faint glow stroke —
 * NOT a line chart. Reference: design-vision "marker trends" card.
 */
export function AuroraChart({
  series,
  width = 232,
  height = 60,
  showLegend = true,
}: {
  series: AuroraSeries[];
  width?: number;
  height?: number;
  showLegend?: boolean;
}) {
  const uid = useId().replace(/[:]/g, "");
  const blur = `aur-${uid}`;

  // normalize all series across a shared min/max so ridges share a baseline
  const all = series.flatMap((s) => s.points);
  const min = Math.min(...all, 0);
  const max = Math.max(...all, 1);
  const span = max - min || 1;
  const pad = 6;

  const coords = (pts: number[]) =>
    pts.map((v, i) => {
      const x = (i / Math.max(1, pts.length - 1)) * width;
      const y = height - pad - ((v - min) / span) * (height - pad * 2);
      return [x, y] as const;
    });

  // smooth-ish path via simple midpoint curves
  const linePath = (c: ReadonlyArray<readonly [number, number]>) => {
    if (!c.length) return "";
    let d = `M${c[0][0].toFixed(1)},${c[0][1].toFixed(1)}`;
    for (let i = 1; i < c.length; i++) {
      const [px, py] = c[i - 1];
      const [x, y] = c[i];
      const mx = (px + x) / 2;
      d += ` Q${px.toFixed(1)},${py.toFixed(1)} ${mx.toFixed(1)},${((py + y) / 2).toFixed(1)}`;
      d += ` T${x.toFixed(1)},${y.toFixed(1)}`;
    }
    return d;
  };

  return (
    <div>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ display: "block" }}>
        <defs>
          {series.map((s, i) => (
            <linearGradient key={i} id={`${uid}-fill-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={s.color} stopOpacity="0.5" />
              <stop offset="1" stopColor={s.color} stopOpacity="0" />
            </linearGradient>
          ))}
          <filter id={blur}>
            <feGaussianBlur stdDeviation="1.4" />
          </filter>
        </defs>
        {series.map((s, i) => {
          const c = coords(s.points);
          const line = linePath(c);
          const area = `${line} L${width},${height} L0,${height} Z`;
          return (
            <g key={i}>
              <path d={area} fill={`url(#${uid}-fill-${i})`} filter={`url(#${blur})`} />
              <path d={line} fill="none" stroke={s.color} strokeWidth="1.4" opacity="0.85" />
            </g>
          );
        })}
      </svg>
      {showLegend && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginTop: 9 }}>
          {series.map((s, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 9, color: "var(--smoke)" }}>
              <i style={{ width: 6, height: 6, borderRadius: "50%", background: s.color }} />
              {s.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
