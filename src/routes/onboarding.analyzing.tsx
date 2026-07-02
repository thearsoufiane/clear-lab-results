import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { LivingGlow, GlassCard, AnnaOrb, Pill, Eyebrow } from "@/components/lr";
import { analyzeReport, BIOMARKERS_FOUND } from "@/lib/analyze-report";

export const Route = createFileRoute("/onboarding/analyzing")({
  head: () => ({ meta: [{ title: "Reading your blood… | labread.health" }, { name: "robots", content: "noindex" }] }),
  component: AnalyzingStep,
});

function AnalyzingStep() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [panelsDone, setPanelsDone] = useState(false);

  useEffect(() => { if (!loading && !user) nav({ to: "/auth" }); }, [user, loading]);

  useEffect(() => {
    if (!user) return;
    // the seam: stub now, real analyze-report pipeline later.
    analyzeReport().catch(() => {});
    const flip = setTimeout(() => setPanelsDone(true), 1600);
    const go = setTimeout(() => nav({ to: "/onboarding/about-you" }), 3200);
    return () => { clearTimeout(flip); clearTimeout(go); };
  }, [user, nav]);

  if (loading || !user) return null;

  return (
    <div style={{ minHeight: "100dvh", background: "var(--void)", color: "var(--bone)", fontFamily: "var(--sans)" }}>
      <LivingGlow intensity="hero" />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 440, margin: "0 auto", padding: "calc(env(safe-area-inset-top) + 34px) 20px 28px" }}>
        <Eyebrow bracket color="var(--ember-glow)">reading</Eyebrow>
        <h1 style={{ fontFamily: "var(--serif)", fontWeight: 500, fontSize: 26, lineHeight: 1.08, marginTop: 8 }}>Making sense<br />of your blood.</h1>

        {/* faux report + sweeping scan-line — the magical beat */}
        <div style={{ position: "relative", height: 156, borderRadius: 16, overflow: "hidden", marginTop: 18, padding: 16, border: "1px solid var(--line)", background: "linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.02))" }}>
          {[60, 90, 75, 85, 50, 70].map((w, i) => (
            <div key={i} style={{ height: 6, borderRadius: 4, background: "rgba(246,236,225,.14)", marginBottom: 10, width: `${w}%` }} />
          ))}
          <div className="lr-scanline" aria-hidden style={{ position: "absolute", left: 0, right: 0, height: 34, background: "linear-gradient(180deg,transparent,rgba(255,150,60,.45),transparent)", boxShadow: "0 0 24px rgba(255,150,60,.6)" }} />
        </div>

        {/* Anna's read */}
        <GlassCard style={{ marginTop: 16, display: "flex", gap: 11, alignItems: "center" }}>
          <AnnaOrb size={34} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <Eyebrow color="var(--ember-glow)">anna</Eyebrow>
            <div style={{ fontFamily: "var(--serif)", fontSize: 14, lineHeight: 1.3, marginTop: 3 }}>
              Found <b style={{ fontStyle: "normal", fontWeight: 600 }}>{BIOMARKERS_FOUND} biomarkers.</b> Flagging what needs attention…
            </div>
          </div>
        </GlassCard>

        {/* panel progress */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 14 }}>
          <Pill active style={{ justifyContent: "center" }}>✓ Iron panel</Pill>
          <Pill active style={{ justifyContent: "center" }}>✓ Thyroid</Pill>
          <Pill active={panelsDone} style={{ justifyContent: "center" }}>{panelsDone ? "✓ Vitamins" : "◴ Vitamins…"}</Pill>
          <Pill active={panelsDone} style={{ justifyContent: "center" }}>{panelsDone ? "✓ Lipids" : "◴ Lipids…"}</Pill>
        </div>
      </div>
    </div>
  );
}
