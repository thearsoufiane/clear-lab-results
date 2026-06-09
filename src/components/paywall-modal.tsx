import { useState } from "react";
import { supabase } from "@/lib/supabase";

/* ------------------------------------------------------------------
   labread.health — Paywall Modal
   Premium, matches the landing/report theme (warm orange · Fraunces +
   Hanken Grotesk). Self-contained: inline styles + a scoped <style> for
   :hover / entrance animation, so it looks right anywhere it mounts.

   NOTE: replace GUMROAD_URL with your real Gumroad product link.
   NOTE: the "I've paid" button sets reports.is_paid = true — that column
   must exist on the `reports` table for the update to succeed.
   ------------------------------------------------------------------ */

// Gumroad checkout link for the one-time report unlock
const GUMROAD_URL = "https://labread.gumroad.com/l/ejtfmg";

const FEATURES = [
  "Your marker trends — is ferritin improving?",
  "Questions to ask your doctor",
  "Screening recommendations worth discussing",
];

export function PaywallModal({
  open,
  onClose,
  reportId,
  onUnlock,
}: {
  open: boolean;
  onClose: () => void;
  reportId: string;
  onUnlock?: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (!open) return null;

  const openCheckout = () => {
    window.open(GUMROAD_URL, "_blank", "noopener,noreferrer");
  };

  const confirmPaid = async () => {
    setBusy(true);
    setErr(null);
    const { error } = await supabase.from("reports").update({ is_paid: true }).eq("id", reportId);
    setBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    onUnlock?.();
    onClose();
  };

  return (
    <div
      className="lr-paywall"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lr-paywall-title"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700&family=Hanken+Grotesk:wght@400;500;600;700&display=swap');
        @keyframes lrPaywallIn { from { opacity: 0; transform: translateY(10px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .lr-paywall .lr-pw-box { animation: lrPaywallIn .28s cubic-bezier(.22,1,.36,1) both; }
        .lr-paywall .lr-pw-primary { transition: opacity .2s, transform .2s, box-shadow .2s; }
        .lr-paywall .lr-pw-primary:hover { opacity: .9; transform: scale(1.02); box-shadow: 0 12px 30px rgba(245,133,31,.35); }
        .lr-paywall .lr-pw-secondary { transition: border-color .2s, color .2s; }
        .lr-paywall .lr-pw-secondary:hover { border-color: #f5a04a !important; color: #f5a04a !important; }
        .lr-paywall .lr-pw-primary:disabled, .lr-paywall .lr-pw-secondary:disabled { opacity: .55; cursor: default; transform: none; box-shadow: none; }
      `}</style>

      <div
        className="lr-pw-box"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "#141210",
          border: "1px solid #f5a04a33",
          borderRadius: "20px",
          padding: "32px",
          color: "#f7f3ec",
          fontFamily: "'Hanken Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          boxShadow: "0 30px 80px -20px rgba(0,0,0,.6)",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* Header */}
        <div>
          <div style={{ fontSize: "1.8rem", lineHeight: 1, marginBottom: "12px" }} aria-hidden="true">🔓</div>
          <h2
            id="lr-paywall-title"
            style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#f7f3ec", margin: 0, letterSpacing: "-0.01em" }}
          >
            Unlock Full Report
          </h2>
          <p style={{ fontSize: "0.95rem", color: "rgba(247,243,236,0.65)", margin: "6px 0 0", lineHeight: 1.5 }}>
            See what your markers are trending toward
          </p>
        </div>

        {/* Features */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingLeft: "2px" }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "11px" }}>
              <span
                aria-hidden="true"
                style={{
                  flexShrink: 0,
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  background: "rgba(127,214,163,0.12)",
                  color: "#7fd6a3",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: 700,
                  marginTop: "1px",
                }}
              >
                ✓
              </span>
              <span style={{ fontSize: "0.95rem", color: "#f7f3ec", lineHeight: 1.5 }}>{f}</span>
            </div>
          ))}
        </div>

        {/* Price */}
        <div>
          <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "2rem", fontWeight: 700, color: "#ffc06a", lineHeight: 1 }}>$4.99</div>
          <div style={{ fontSize: "0.85rem", color: "rgba(247,243,236,0.55)", marginTop: "4px" }}>One-time unlock</div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button
            type="button"
            className="lr-pw-primary"
            onClick={openCheckout}
            disabled={busy}
            style={{
              background: "linear-gradient(135deg, #ffc06a, #f5851f)",
              color: "#2a1402",
              padding: "14px 32px",
              border: "none",
              borderRadius: "12px",
              fontFamily: "'Hanken Grotesk', -apple-system, sans-serif",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Unlock Report $4.99
          </button>

          <button
            type="button"
            className="lr-pw-secondary"
            onClick={confirmPaid}
            disabled={busy}
            style={{
              background: "transparent",
              border: "1px solid rgba(247,243,236,0.2)",
              color: "rgba(247,243,236,0.7)",
              padding: "12px 32px",
              borderRadius: "12px",
              fontFamily: "'Hanken Grotesk', -apple-system, sans-serif",
              fontSize: "0.9rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {busy ? "Unlocking…" : "I've paid, unlock my report"}
          </button>

          {err && (
            <div style={{ fontSize: "0.82rem", color: "#f06a5a", textAlign: "center", marginTop: "2px" }}>
              Couldn't unlock: {err}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
