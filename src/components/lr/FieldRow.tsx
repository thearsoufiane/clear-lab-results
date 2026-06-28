import type { ReactNode } from "react";

/** Onboarding/profile field row: glass, mono uppercase label, value/control,
 *  optional chevron affordance. Reference: onboarding-family .field. */
export function FieldRow({
  label,
  children,
  onClick,
  chevron = false,
}: {
  label: string;
  children: ReactNode;
  onClick?: () => void;
  chevron?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "12px 13px",
        background: "var(--glass)",
        border: "1px solid var(--line)",
        borderRadius: 14,
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        cursor: onClick ? "pointer" : undefined,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--whisper)" }}>{label}</div>
        <div style={{ fontSize: 12, fontWeight: 600, marginTop: 2, color: "var(--bone)" }}>{children}</div>
      </div>
      {chevron && <span style={{ color: "var(--whisper)" }}>›</span>}
    </div>
  );
}
