import type { ReactNode } from "react";

/**
 * Anna speaks in Fraunces, no bubble, with an optional mono "anna" eyebrow and
 * an italic ember accent word (pass <em> in children). Reference: anna-vision
 * .a-msg.
 */
export function AnnaMessage({ children, who = true }: { children: ReactNode; who?: boolean }) {
  return (
    <div style={{ fontFamily: "var(--serif)", fontSize: 16, lineHeight: 1.35, color: "var(--bone)", maxWidth: "88%", margin: "12px 0 0" }}>
      {who && (
        <span style={{ display: "block", fontFamily: "var(--mono)", fontSize: 8, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--ember-glow)", marginBottom: 5 }}>
          anna
        </span>
      )}
      {children}
    </div>
  );
}

/** The user's quiet, right-aligned glass reply. Reference: anna-vision .u-msg. */
export function UserMessage({ children }: { children: ReactNode }) {
  return (
    <div style={{ alignSelf: "flex-end", textAlign: "right", fontSize: 13, color: "var(--smoke)", margin: "14px 0 0", maxWidth: "78%", marginLeft: "auto" }}>
      <span
        style={{
          background: "var(--glass)",
          border: "1px solid var(--line)",
          borderRadius: "14px 14px 4px 14px",
          padding: "7px 11px",
          display: "inline-block",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        {children}
      </span>
    </div>
  );
}

/** Three pulsing dots while Anna composes. */
export function ThinkingDots() {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center", marginTop: 12 }} aria-label="Anna is typing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="lr-think-dot"
          style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--ember-glow)", animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
}
