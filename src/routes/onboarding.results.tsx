import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useActiveMember } from "@/contexts/active-member";
import { supabase, type Report, type Analysis } from "@/lib/supabase";
import { LivingGlow, GlassCard, Gauge, AnnaOrb, EmberButton, Eyebrow } from "@/components/lr";

export const Route = createFileRoute("/onboarding/results")({
  head: () => ({ meta: [{ title: "Your results | labread.health" }, { name: "robots", content: "noindex" }] }),
  component: ResultsStep,
});

type AnalysisValue = Analysis["values"][number];
function numFrom(v: string): number | null { const m = String(v ?? "").match(/-?[\d.]+/); return m ? parseFloat(m[0]) : null; }
function unitFrom(v: string): string { const m = String(v ?? "").match(/^\s*-?[\d.]+\s*(.*)$/); return m ? m[1].trim() : ""; }
const isFlagged = (v: AnalysisValue) => !(v as { unrecognized?: boolean }).unrecognized && !(v as { qualitative?: boolean }).qualitative && v.status !== "normal";
const isGraded = (v: AnalysisValue) => !(v as { unrecognized?: boolean }).unrecognized && !(v as { qualitative?: boolean }).qualitative;
function rank(v: AnalysisValue): number {
  if (!isGraded(v)) return 3;      // qualitative / unrecognized last
  if (v.status !== "normal") return 0; // flagged first
  return 1;                         // optimal
}
const statusLabel = (v: AnalysisValue) => (v.status === "normal" ? "optimal" : v.status);

function ResultsStep() {
  const { user, loading } = useAuth();
  const { activeMemberId } = useActiveMember();
  const nav = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [values, setValues] = useState<AnalysisValue[]>([]);

  useEffect(() => { if (!loading && !user) nav({ to: "/auth" }); }, [user, loading]);

  const load = useCallback(async () => {
    if (!user || !activeMemberId) return;
    // the report the analyzing step just created (latest for this member)
    const { data } = await supabase.from("reports").select("*").eq("member_id", activeMemberId).order("created_at", { ascending: false }).limit(1).maybeSingle();
    const vals = ((data as Report | null)?.analysis?.values as AnalysisValue[]) ?? [];
    setValues([...vals].sort((a, b) => rank(a) - rank(b)));
    setLoaded(true);
  }, [user, activeMemberId]);
  useEffect(() => { load(); }, [load]);

  if (loading || !user) return null;

  const graded = values.filter(isGraded);
  const flaggedCount = graded.filter((v) => v.status !== "normal").length;
  const annaSummary = graded.length
    ? flaggedCount > 0
      ? `Found ${graded.length} markers. ${flaggedCount} ${flaggedCount === 1 ? "is" : "are"} flagged — here's what to focus on.`
      : `Found ${graded.length} markers, and every one is in a healthy range. Nice.`
    : "I've read your panel — here's every marker, in plain words.";

  return (
    <div style={{ minHeight: "100dvh", background: "var(--void)", color: "var(--bone)", fontFamily: "var(--sans)" }}>
      <LivingGlow />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 440, margin: "0 auto", padding: "calc(env(safe-area-inset-top) + 26px) 18px 32px" }}>
        <Eyebrow bracket>your results</Eyebrow>
        <h1 style={{ fontFamily: "var(--serif)", fontWeight: 500, fontSize: 28, lineHeight: 1.05, marginTop: 8 }}>Here's what<br />we found.</h1>

        {/* Anna's summary */}
        <GlassCard emphasis style={{ marginTop: 16, display: "flex", gap: 11, alignItems: "center" }}>
          <AnnaOrb size={34} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <Eyebrow color="var(--ember-glow)">anna</Eyebrow>
            <div style={{ fontFamily: "var(--serif)", fontSize: 14, lineHeight: 1.35, marginTop: 3 }}>{annaSummary}</div>
          </div>
        </GlassCard>

        {!loaded ? (
          <p style={{ color: "var(--smoke)", marginTop: 20, fontSize: 14 }}>Reading your panel…</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
            {values.map((v, i) => {
              const flagged = isFlagged(v);
              const num = numFrom(v.value);
              const range = v.optimal_range ?? v.normal_range ?? null;
              const unit = unitFrom(v.value);
              const hasGauge = num != null && range != null;
              return (
                <GlassCard key={`${v.name}-${i}`} emphasis={flagged} style={{ display: "flex", gap: 13, alignItems: "center" }}>
                  {hasGauge ? (
                    <div style={{ flex: "none" }}>
                      <Gauge value={num!} rangeLow={range!.min} rangeHigh={range!.max} status={v.status === "normal" ? "optimal" : v.status} size={116} showLabel={false} />
                    </div>
                  ) : (
                    <span style={{ width: 10, height: 10, borderRadius: "50%", flex: "none", background: flagged ? "var(--ember-hot)" : "var(--ember-glow)" }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--serif)", fontSize: 16, fontWeight: 500 }}>{v.name}</div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--smoke)", marginTop: 3 }}>
                      {num ?? v.value}{unit ? ` ${unit}` : ""} · <span style={{ color: flagged ? "var(--ember-hot)" : "var(--ember-glow)" }}>{statusLabel(v)}</span>
                      {range ? ` · optimal ${range.min}–${range.max}` : ""}
                    </div>
                    {v.explanation && <div style={{ fontSize: 12.5, color: "var(--smoke)", marginTop: 6, lineHeight: 1.5 }}>{v.explanation}</div>}
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}

        <EmberButton style={{ marginTop: 18, width: "100%" }} onClick={() => nav({ to: "/onboarding/about-you" })}>
          Continue to your protocol →
        </EmberButton>

        <p style={{ marginTop: 16, textAlign: "center", fontFamily: "var(--mono)", fontSize: 9, letterSpacing: ".08em", color: "var(--whisper)" }}>
          labread is informational and not a medical diagnosis.
        </p>
      </div>
    </div>
  );
}
