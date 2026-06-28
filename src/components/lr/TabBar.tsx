import type { ReactNode } from "react";

export type TabItem = {
  key: string;
  label: string;
  icon: ReactNode;
  active?: boolean;
  onClick?: () => void;
};

/**
 * Floating glass tab bar inset from the bottom edge, rounded + blurred; the
 * active tab glows ember-glow. Used at ALL breakpoints (replaces the desktop
 * sidebar). Reference: design-vision .tabbar.
 */
export function TabBar({ items }: { items: TabItem[] }) {
  return (
    <nav
      style={{
        position: "fixed",
        left: "50%",
        transform: "translateX(-50%)",
        bottom: "max(12px, env(safe-area-inset-bottom))",
        width: "min(440px, calc(100% - 28px))",
        height: 58,
        borderRadius: 24,
        background: "rgba(20,14,10,.6)",
        border: "1px solid var(--line)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        zIndex: 50,
      }}
    >
      {items.map((it) => (
        <button
          key={it.key}
          onClick={it.onClick}
          aria-current={it.active ? "page" : undefined}
          style={{
            all: "unset",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            fontFamily: "var(--mono)",
            fontSize: 9,
            letterSpacing: ".06em",
            textTransform: "uppercase",
            color: it.active ? "var(--ember-glow)" : "var(--whisper)",
          }}
        >
          <span style={{ fontSize: 16, lineHeight: 1, filter: it.active ? "drop-shadow(0 0 6px rgba(255,150,60,.9))" : undefined }}>
            {it.icon}
          </span>
          {it.label}
        </button>
      ))}
    </nav>
  );
}
