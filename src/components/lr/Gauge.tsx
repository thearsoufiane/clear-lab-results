import { useEffect, useId, useState } from "react";
import { clamp, useCountUp, useReducedMotion } from "./hooks";

type Status = "low" | "optimal" | "high" | "normal" | "elevated" | "deficient";

/**
 * Biomarker as light: a glowing semicircular arc (NEVER a bar) with a bright
 * bloom at the value's position. The arc runs cool -> hot; out-of-range simply
 * sits toward the cool end of the same arc (no red). Reference: design-vision
 * biomarker gauge + anna-vision inline gauge.
 */
export function Gauge({
  value,
  unit,
  rangeLow,
  rangeHigh,
  scaleMin = 0,
  scaleMax,
  status = "optimal",
  label,
  size = 180,
  showValue = true,
  showLabel = true,
}: {
  value: number;
  unit?: string;
  rangeLow: number;
  rangeHigh: number;
  scaleMin?: number;
  scaleMax?: number;
  status?: Status;
  label?: string;
  size?: number;
  showValue?: boolean;
  showLabel?: boolean;
}) {
  const uid = useId().replace(/[:]/g, "");
  const grad = `g-${uid}`;
  const glow = `gl-${uid}`;
  const reduced = useReducedMotion();
  const max = scaleMax ?? Math.max(rangeHigh * 1.8, value * 1.2);
  const f = clamp((value - scaleMin) / (max - scaleMin || 1), 0, 1);

  // pathLength normalized to 100 so dashoffset math is geometry-independent.
  const [off, setOff] = useState(reduced ? 100 * (1 - f) : 100);
  useEffect(() => {
    if (reduced) {
      setOff(100 * (1 - f));
      return;
    }
    const r = requestAnimationFrame(() => setOff(100 * (1 - f)));
    return () => cancelAnimationFrame(r);
  }, [f, reduced]);

  // bloom position on the arc (center 80,90 · r 64 · 180deg -> 0deg)
  const ang = ((180 - 180 * f) * Math.PI) / 180;
  const bx = 80 + 64 * Math.cos(ang);
  const by = 90 - 64 * Math.sin(ang);

  const display = useCountUp(value, { decimals: value % 1 === 0 ? 0 : 1 });
  const statusLabel = label ?? status.toUpperCase();

  return (
    <svg viewBox="0 0 160 100" width={size} height={(size * 100) / 160} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={grad} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#B23A0C" />
          <stop offset="0.5" stopColor="#FF7A18" />
          <stop offset="1" stopColor="#FFB066" />
        </linearGradient>
        <filter id={glow} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path d="M16,90 A64,64 0 0 1 144,90" fill="none" stroke="rgba(255,255,255,.09)" strokeWidth="9" strokeLinecap="round" />
      <path
        d="M16,90 A64,64 0 0 1 144,90"
        fill="none"
        stroke={`url(#${grad})`}
        strokeWidth="9"
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray={100}
        strokeDashoffset={off}
        filter={`url(#${glow})`}
        className="lr-arc"
      />
      <circle cx={bx} cy={by} r="5" fill="#fff" filter={`url(#${glow})`} />
      {showValue && (
        <>
          <text x="80" y={showLabel ? 74 : 82} textAnchor="middle" fontFamily="var(--serif)" fontSize="30" fill="var(--bone)">
            {display}
          </text>
          {showLabel && (
            <text x="80" y="90" textAnchor="middle" fontFamily="var(--mono)" fontSize="8" fill="var(--smoke)">
              {unit ? `${unit} · ` : ""}
              {statusLabel}
            </text>
          )}
        </>
      )}
    </svg>
  );
}
