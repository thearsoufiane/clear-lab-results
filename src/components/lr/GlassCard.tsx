import type { ElementType, HTMLAttributes, ReactNode } from "react";

/**
 * Floating glass surface: white-at-low-opacity + backdrop-blur + 1px warm
 * hairline, 20px radius. Never a flat/dark box. Reference: design-vision .gcard.
 */
export function GlassCard({
  emphasis = false,
  as,
  children,
  className,
  style,
  ...rest
}: {
  emphasis?: boolean;
  as?: ElementType;
  children?: ReactNode;
} & HTMLAttributes<HTMLElement>) {
  const As = (as ?? "div") as ElementType;
  return (
    <As
      className={className}
      style={{
        position: "relative",
        background: "var(--glass)",
        border: `1px solid ${emphasis ? "var(--line-warm)" : "var(--line)"}`,
        borderRadius: 20,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        padding: 16,
        ...style,
      }}
      {...rest}
    >
      {children}
    </As>
  );
}
