import { useEffect, useId, useState } from "react";
import { clamp, useCountUp, useReducedMotion } from "./hooks";

/**
 * 0–100 score as a glowing full ring (ember gradient + soft bloom). Distinct
 * from the half-arc Gauge. Reference: design-vision vitality ring.
 */
export function VitalityRing({
  score,
  size = 118,
  label = "VITALITY",
  caption,
}: {
  score: number;
  size?: number;
  label?: string;
  caption?: string;
}) {
  const uid = useId().replace(/[:]/g, "");
  const grad = `vr-${uid}`;
  const glow = `vrg-${uid}`;
  const reduced = useReducedMotion();
  const pct = clamp(score, 0, 100);
  const [off, setOff] = useState(reduced ? 100 - pct : 100);
  useEffect(() => {
    if (reduced) {
      setOff(100 - pct);
      return;
    }
    const r = requestAnimationFrame(() => setOff(100 - pct));
    return () => cancelAnimationFrame(r);
  }, [pct, reduced]);
  const display = useCountUp(Math.round(pct));

  return (
    <svg viewBox="0 0 118 118" width={size} height={size} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={grad} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFB066" />
          <stop offset="1" stopColor="#B23A0C" />
        </linearGradient>
        <filter id={glow}>
          <feGaussianBlur stdDeviation="3.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle cx="59" cy="59" r="48" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="7" />
      <circle
        cx="59"
        cy="59"
        r="48"
        fill="none"
        stroke={`url(#${grad})`}
        strokeWidth="7"
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray={100}
        strokeDashoffset={off}
        transform="rotate(-90 59 59)"
        filter={`url(#${glow})`}
        className="lr-arc"
      />
      <text x="59" y={caption ? 54 : 58} textAnchor="middle" fontFamily="var(--serif)" fontSize="30" fill="var(--bone)">
        {display}
      </text>
      <text x="59" y={caption ? 70 : 73} textAnchor="middle" fontFamily="var(--mono)" fontSize="7.5" letterSpacing="1.5" fill="var(--smoke)">
        {label}
      </text>
      {caption && (
        <text x="59" y="84" textAnchor="middle" fontFamily="var(--mono)" fontSize="6.5" fill="var(--whisper)">
          {caption}
        </text>
      )}
    </svg>
  );
}
