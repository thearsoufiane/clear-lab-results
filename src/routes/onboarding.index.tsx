import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useActiveMember } from "@/contexts/active-member";
import { supabase } from "@/lib/supabase";
import { LivingGlow, GlassCard, EmberButton, Eyebrow } from "@/components/lr";

export const Route = createFileRoute("/onboarding/")({
  head: () => ({
    meta: [
      { title: "Add your blood test | labread.health" },
      { name: "description", content: "Hand labread your blood test — scan, PDF or photo." },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://labread.health/onboarding" }],
  }),
  component: UploadStep,
});

const ROWS = [
  { key: "scan", icon: "⊡", ember: true, title: "Scan with camera", sub: "point at the printout" },
  { key: "pdf", icon: "▤", ember: false, title: "Upload a PDF", sub: "from files or email" },
  { key: "photo", icon: "▦", ember: false, title: "Choose a photo", sub: "from your library" },
];

function UploadStep() {
  const { user, loading } = useAuth();
  const { activeMemberId } = useActiveMember();
  const nav = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (!loading && !user) nav({ to: "/auth" }); }, [user, loading]);

  const advance = useCallback(async () => {
    setBusy(true);
    try {
      if (file && user && activeMemberId) {
        // best-effort: store the file + create a pending report; the analysis
        // itself happens on the next screen (analyzeReport stub / real pipeline).
        try {
          if (supabase.storage) await supabase.storage.from("reports").upload(`${user.id}/${Date.now()}-${file.name}`, file);
        } catch { /* storage optional in dev */ }
        await supabase.from("reports").insert({ user_id: user.id, member_id: activeMemberId, title: file.name, file_name: file.name, status: "pending" });
      }
    } catch { /* keep the flow moving even if a write fails */ }
    nav({ to: "/onboarding/analyzing" });
  }, [file, user, activeMemberId, nav]);

  if (loading || !user) return null;

  return (
    <div style={{ minHeight: "100dvh", background: "var(--void)", color: "var(--bone)", fontFamily: "var(--sans)" }}>
      <LivingGlow intensity="hero" />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 440, margin: "0 auto", minHeight: "100dvh", display: "flex", flexDirection: "column", padding: "calc(env(safe-area-inset-top) + 28px) 20px 28px" }}>
        <Eyebrow bracket>step 1 of 3</Eyebrow>
        <h1 style={{ fontFamily: "var(--serif)", fontWeight: 500, fontSize: 28, lineHeight: 1.05, marginTop: 8 }}>Add your<br />blood test</h1>

        <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,image/*,application/pdf" style={{ display: "none" }} onChange={(e) => setFile(e.target.files?.[0] ?? null)} />

        {/* drop-zone */}
        <button
          onClick={() => fileRef.current?.click()}
          style={{
            all: "unset", cursor: "pointer", boxSizing: "border-box", width: "100%", marginTop: 16,
            border: "1.5px dashed var(--line-warm)", borderRadius: 22, padding: "26px 14px", textAlign: "center",
            background: "radial-gradient(80% 70% at 50% 30%, rgba(255,122,24,.16), transparent 70%)",
          }}
        >
          <span style={{ width: 58, height: 58, borderRadius: "50%", margin: "0 auto 12px", display: "grid", placeItems: "center", fontSize: 22, color: "#1a0e06", background: "linear-gradient(135deg,#FF9D45,#B23A0C)", boxShadow: "0 0 26px rgba(255,140,50,.5)" }}>⤒</span>
          <div style={{ fontFamily: "var(--serif)", fontSize: 15 }}>{file ? file.name : "Drop it here"}</div>
          <div style={{ marginTop: 4 }}><Eyebrow>pdf · jpg · png</Eyebrow></div>
        </button>

        {/* three ways in */}
        <GlassCard style={{ marginTop: 12, padding: "4px 13px" }}>
          {ROWS.map((r, i) => (
            <button
              key={r.key}
              onClick={() => fileRef.current?.click()}
              style={{ all: "unset", cursor: "pointer", width: "100%", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 10, padding: "11px 0", borderTop: i === 0 ? "none" : "1px solid var(--line)" }}
            >
              <span style={{ width: 30, height: 30, borderRadius: "50%", flex: "none", display: "grid", placeItems: "center", fontSize: 12, color: r.ember ? "#1a0e06" : "var(--bone)", background: r.ember ? "linear-gradient(135deg,#FF9D45,#B23A0C)" : "var(--glass-2)", border: r.ember ? "0" : "1px solid var(--line)" }}>{r.icon}</span>
              <span style={{ flex: 1 }}>
                <span style={{ display: "block", fontSize: 11, fontWeight: 600 }}>{r.title}</span>
                <span style={{ display: "block", fontSize: 9, color: "var(--smoke)" }}>{r.sub}</span>
              </span>
            </button>
          ))}
        </GlassCard>

        <div style={{ textAlign: "center", marginTop: 12 }}><Eyebrow>we read 30+ common lab formats</Eyebrow></div>

        <EmberButton style={{ marginTop: "auto", width: "100%" }} onClick={advance} disabled={busy}>
          {busy ? "One sec…" : "Continue"}
        </EmberButton>
      </div>
    </div>
  );
}
