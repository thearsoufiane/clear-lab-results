import type { CSSProperties, ReactNode } from "react";

/** Mono, uppercase, wide-tracked label. `bracket` wraps it as [ LIKE THIS ]. */
export function Eyebrow({
  children,
  bracket = false,
  color = "var(--whisper)",
  style,
}: {
  children: ReactNode;
  bracket?: boolean;
  color?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        fontFamily: "var(--mono)",
        fontSize: 11,
        letterSpacing: ".2em",
        textTransform: "uppercase",
        color,
        ...style,
      }}
    >
      {bracket ? <>[ {children} ]</> : children}
    </span>
  );
}
