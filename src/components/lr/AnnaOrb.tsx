import { useId } from "react";
import type { CSSProperties } from "react";

/**
 * Anna as a presence of light: a layered ember radial-gradient sphere with a
 * blur halo and a soft top-left highlight (never a face). Gently pulses unless
 * reduced motion. Scales hero (150) -> avatar (22). Reference: anna-vision orb.
 */
export function AnnaOrb({
  size = 120,
  halo = true,
  pulse = true,
  className,
  style,
}: {
  size?: number;
  halo?: boolean;
  pulse?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const uid = useId().replace(/[:]/g, "");
  const core = `core-${uid}`;
  const haloId = `halo-${uid}`;
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={(pulse ? "lr-orb-pulse" : "") + (className ? " " + className : "")}
      style={{ display: "block", overflow: "visible", ...style }}
      aria-hidden
    >
      <defs>
        <radialGradient id={core} cx="42%" cy="38%" r="62%">
          <stop offset="0" stopColor="#FFE8C8" />
          <stop offset="0.38" stopColor="#FF9D45" />
          <stop offset="0.74" stopColor="#C2410C" />
          <stop offset="1" stopColor="#5E2208" />
        </radialGradient>
        <filter id={haloId}>
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>
      {halo && <circle cx="100" cy="100" r="86" fill="#FF7A18" opacity="0.28" filter={`url(#${haloId})`} />}
      <circle cx="100" cy="100" r="60" fill={`url(#${core})`} />
      <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(255,232,200,.5)" strokeWidth="1" />
      <ellipse cx="80" cy="76" rx="20" ry="13" fill="#FFF4E2" opacity="0.55" filter={`url(#${haloId})`} />
    </svg>
  );
}
