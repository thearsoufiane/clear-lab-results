import type { CSSProperties } from "react";

const STOPS: Record<"ambient" | "hero", string> = {
  ambient:
    "radial-gradient(60% 50% at 50% 12%, rgba(255,122,24,.20), transparent 60%)," +
    "radial-gradient(45% 35% at 18% 62%, rgba(178,58,12,.22), transparent 62%)," +
    "radial-gradient(45% 35% at 84% 78%, rgba(255,176,102,.14), transparent 62%)",
  hero:
    "radial-gradient(60% 50% at 50% 28%, rgba(255,122,24,.34), transparent 70%)," +
    "radial-gradient(40% 30% at 30% 50%, rgba(178,58,12,.30), transparent 70%)," +
    "radial-gradient(40% 30% at 72% 44%, rgba(255,176,102,.18), transparent 70%)",
};

/**
 * The breathing ember floor every screen shares. Renders a full-bleed layer of
 * layered warm radial gradients behind content (place content in a
 * position:relative; z-index:1 column above it). Honors reduced motion via the
 * .lr-breathe CSS class. Reference: design-vision .hero::before / .glass-screen.
 */
export function LivingGlow({
  intensity = "ambient",
  fixed = true,
  className,
  style,
}: {
  intensity?: "ambient" | "hero";
  fixed?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      aria-hidden
      className={"lr-breathe" + (className ? " " + className : "")}
      style={{
        position: fixed ? "fixed" : "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        background: `${STOPS[intensity]}, linear-gradient(180deg,#140e0a,#0b0807 70%)`,
        filter: "blur(8px)",
        ...style,
      }}
    />
  );
}
