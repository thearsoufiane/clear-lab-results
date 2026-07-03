import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useActiveMember } from "@/contexts/active-member";
import { supabase, SUPABASE_ANON_KEY, FUNCTIONS_URL, type Analysis } from "@/lib/supabase";
import { fileToBase64 } from "@/lib/pdf";
import { getPendingFile, clearPendingFile } from "@/lib/onboarding-file";
import { analyzeReport, BIOMARKERS_FOUND } from "@/lib/analyze-report";
import { SEED } from "@/lib/dev-seed";
import { LivingGlow, GlassCard, EmberButton, AnnaOrb, Pill, Eyebrow } from "@/components/lr";

export const Route = createFileRoute("/onboarding/analyzing")({
  head: () => ({ meta: [{ title: "Reading your blood… | labread.health" }, { name: "robots", content: "noindex" }] }),
  component: AnalyzingStep,
});

function AnalyzingStep() {
  const { user, loading } = useAuth();
  const { activeMemberId } = useActiveMember();
  const nav = useNavigate();
  const [panelsDone, setPanelsDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ran = useRef(false);

  useEffect(() => { if (!loading && !user) nav({ to: "/auth" }); }, [user, loading]);

  useEffect(() => {
    if (!user || ran.current) return;
    ran.current = true;
    const flip = setTimeout(() => setPanelsDone(true), 1400);

    (async () => {
      const started = Date.now();
      try {
        let analysis: Analysis;
        const file = getPendingFile();

        if (SEED) {
          analysis = await analyzeReport(file); // dev-only seeded stub
        } else {
          if (!file) { nav({ to: "/onboarding" }); return; } // no file → back to step 1
          const { base64, mimeType, fileName } = await fileToBase64(file);
          const { data: profile } = await supabase
            .from("profiles").select("age,biological_sex,diabetes,heart_disease,high_blood_pressure,cancer_history,smoking")
            .eq("id", user.id).maybeSingle();
          const { data: { session } } = await supabase.auth.getSession();
          if (!session?.access_token) throw new Error("Your session expired. Please sign in again.");

          const res = await fetch(`${FUNCTIONS_URL}/analyze-report`, {
            method: "POST",
            headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${session.access_token}` },
            body: JSON.stringify({ base64, mimeType, mediaType: mimeType, fileName, profile: profile ?? undefined }),
          });
          const text = await res.text();
          if (!res.ok) throw new Error(`Analysis failed (${res.status}). Try a clearer file.`);
          analysis = JSON.parse(text) as Analysis;
          if (!analysis || !Array.isArray(analysis.values)) throw new Error("Couldn't read that file. Try a clearer scan or PDF.");
        }

        // persist the report so the Dashboard guard passes and results show
        const { error: insErr } = await supabase.from("reports").insert({
          user_id: user.id, member_id: activeMemberId,
          title: analysis.title || file?.name || "Blood panel", analysis, file_name: file?.name ?? "report",
        });
        if (insErr) throw insErr;
        clearPendingFile();

        // let the scan-line breathe (min ~1.6s) even if the analysis was fast
        const wait = Math.max(0, 1600 - (Date.now() - started));
        setTimeout(() => nav({ to: "/onboarding/about-you" }), wait);
      } catch (e) {
        setError((e as Error).message || "Something went wrong reading your file.");
      }
    })();

    return () => clearTimeout(flip);
  }, [user, activeMemberId, nav]);

  if (loading || !user) return null;

  return (
    <div style={{ minHeight: "100dvh", background: "var(--void)", color: "var(--bone)", fontFamily: "var(--sans)" }}>
      <LivingGlow intensity="hero" />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 440, margin: "0 auto", padding: "calc(env(safe-area-inset-top) + 34px) 20px 28px" }}>
        <Eyebrow bracket color="var(--ember-glow)">{error ? "hmm" : "reading"}</Eyebrow>
        <h1 style={{ fontFamily: "var(--serif)", fontWeight: 500, fontSize: 26, lineHeight: 1.08, marginTop: 8 }}>
          {error ? <>Let's try<br />that again.</> : <>Making sense<br />of your blood.</>}
        </h1>

        {/* faux report + sweeping scan-line — the magical beat */}
        <div style={{ position: "relative", height: 156, borderRadius: 16, overflow: "hidden", marginTop: 18, padding: 16, border: "1px solid var(--line)", background: "linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.02))" }}>
          {[60, 90, 75, 85, 50, 70].map((w, i) => (
            <div key={i} style={{ height: 6, borderRadius: 4, background: "rgba(246,236,225,.14)", marginBottom: 10, width: `${w}%` }} />
          ))}
          {!error && <div className="lr-scanline" aria-hidden style={{ position: "absolute", left: 0, right: 0, height: 34, background: "linear-gradient(180deg,transparent,rgba(255,150,60,.45),transparent)", boxShadow: "0 0 24px rgba(255,150,60,.6)" }} />}
        </div>

        {error ? (
          <>
            <GlassCard emphasis style={{ marginTop: 16 }}>
              <Eyebrow color="var(--ember-glow)">anna</Eyebrow>
              <div style={{ fontFamily: "var(--serif)", fontSize: 14, lineHeight: 1.3, marginTop: 3 }}>{error}</div>
            </GlassCard>
            <EmberButton style={{ marginTop: 14, width: "100%" }} onClick={() => nav({ to: "/onboarding" })}>Try another file →</EmberButton>
          </>
        ) : (
          <>
            <GlassCard style={{ marginTop: 16, display: "flex", gap: 11, alignItems: "center" }}>
              <AnnaOrb size={34} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <Eyebrow color="var(--ember-glow)">anna</Eyebrow>
                <div style={{ fontFamily: "var(--serif)", fontSize: 14, lineHeight: 1.3, marginTop: 3 }}>
                  Found <b style={{ fontStyle: "normal", fontWeight: 600 }}>{BIOMARKERS_FOUND} biomarkers.</b> Flagging what needs attention…
                </div>
              </div>
            </GlassCard>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 14 }}>
              <Pill active style={{ justifyContent: "center" }}>✓ Iron panel</Pill>
              <Pill active style={{ justifyContent: "center" }}>✓ Thyroid</Pill>
              <Pill active={panelsDone} style={{ justifyContent: "center" }}>{panelsDone ? "✓ Vitamins" : "◴ Vitamins…"}</Pill>
              <Pill active={panelsDone} style={{ justifyContent: "center" }}>{panelsDone ? "✓ Lipids" : "◴ Lipids…"}</Pill>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
