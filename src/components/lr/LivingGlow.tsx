import type { CSSProperties } from "react";

const STOPS: Record<"ambient" | "hero", string> = {
  // Lit-from-within by fire: bright warm blooms covering the upper third + lower
  // corners. Matches the reference intensity in design-reference/app/.
  ambient:
    "radial-gradient(85% 65% at 50% 4%, rgba(255,122,24,.40), transparent 66%)," +
    "radial-gradient(60% 52% at 12% 58%, rgba(178,58,12,.34), transparent 66%)," +
    "radial-gradient(60% 52% at 90% 74%, rgba(255,176,102,.22), transparent 66%)",
  hero:
    "radial-gradient(85% 70% at 50% 18%, rgba(255,122,24,.46), transparent 70%)," +
    "radial-gradient(52% 44% at 26% 50%, rgba(178,58,12,.40), transparent 72%)," +
    "radial-gradient(52% 44% at 74% 44%, rgba(255,176,102,.26), transparent 72%)",
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
