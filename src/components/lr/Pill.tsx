import type { ElementType, HTMLAttributes, ReactNode } from "react";

/** Full-radius glass pill with an active ember state. Used for mood chips,
 *  tags, suggested prompts and full-width CTAs. Reference: design-vision .pill. */
export function Pill({
  active = false,
  as,
  children,
  className,
  style,
  ...rest
}: {
  active?: boolean;
  as?: ElementType;
  children?: ReactNode;
} & HTMLAttributes<HTMLElement>) {
  const As = (as ?? "span") as ElementType;
  return (
    <As
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        borderRadius: 999,
        padding: "6px 12px",
        fontSize: 12,
        lineHeight: 1.2,
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: `1px solid ${active ? "var(--line-warm)" : "var(--line)"}`,
        background: active
          ? "linear-gradient(120deg,rgba(255,122,24,.34),rgba(178,58,12,.22))"
          : "var(--glass-2)",
        color: active ? "var(--bone)" : "var(--smoke)",
        cursor: rest.onClick ? "pointer" : undefined,
        ...style,
      }}
      {...rest}
    >
      {children}
    </As>
  );
}
