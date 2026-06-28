import type { ButtonHTMLAttributes, ReactNode } from "react";

/** Primary CTA: ember-gradient fill, dark ink, soft ember glow. */
export function EmberButton({
  children,
  className,
  style,
  ...rest
}: { children?: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 9,
        fontFamily: "var(--sans)",
        fontWeight: 600,
        fontSize: 15,
        border: "none",
        borderRadius: 999,
        padding: "13px 24px",
        cursor: "pointer",
        color: "#1a0e06",
        background: "linear-gradient(135deg,#FFB066,#FF7A18,#B23A0C)",
        boxShadow: "0 0 30px rgba(255,122,24,.30)",
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
