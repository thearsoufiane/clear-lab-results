import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useActiveMember } from "@/contexts/active-member";
import { supabase, type Report, type Analysis } from "@/lib/supabase";
import { LivingGlow, GlassCard, Gauge, EmberButton, Eyebrow } from "@/components/lr";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/biomarker/$name")({
  head: () => ({ meta: [{ title: "Biomarker | labread.health" }, { name: "robots", content: "noindex" }] }),
  component: BiomarkerDetail,
});

type AnalysisValue = Analysis["values"][number];
const DAY_MS = 86_400_000;
const RETEST_DAYS = 90;

function numFrom(v: string): number | null { const m = String(v ?? "").match(/-?[\d.]+/); return m ? parseFloat(m[0]) : null; }
function unitFrom(v: string): string { const m = String(v ?? "").match(/^\s*-?[\d.]+\s*(.*)$/); return m ? m[1].trim() : ""; }
function norm(s: string): string { return String(s ?? "").toLowerCase().replace(/\s*\([^)]*\)/g, "").replace(/\s+/g, " ").trim(); }
function statusWord(s: AnalysisValue["status"]): string {
  return s === "low" || s === "deficient" ? "low" : s === "high" || s === "elevated" ? "high" : "steady";
}
const DESC: Record<string, string> = {
  ferritin: "iron stores", "vitamin d": "vitamin D", "vitamin b12": "energy & nerves",
  crp: "inflammation", tsh: "thyroid signal",
};

function BiomarkerDetail() {
  const { user, loading } = useAuth();
  const { activeMemberId } = useActiveMember();
  const { name } = useParams({ from: "/biomarker/$name" });
  const nav = useNavigate();

  const [loaded, setLoaded] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => { if (!loading && !user) nav({ to: "/auth" }); }, [user, loading]);

  const load = useCallback(async () => {
    if (!user || !activeMemberId) return;
    const { data } = await supabase.from("reports").select("*").eq("member_id", activeMemberId).order("created_at", { ascending: true });
    setReports((data as Report[]) ?? []);
    setLoaded(true);
  }, [user, activeMemberId]);
  useEffect(() => { load(); }, [load]);

  if (loading || !user) return null;

  const target = norm(decodeURIComponent(name));
  const find = (r: Report) => ((r.analysis?.values as AnalysisValue[]) ?? []).find((v) => {
    const vn = norm(v.name);
    return vn === target || vn.includes(target) || target.includes(vn);
  });
  const latest = reports.length ? reports[reports.length - 1] : null;
  const current = latest ? find(latest) : null;
  // first report that has this marker (for the "you sat low in March" narrative)
  let firstVal: AnalysisValue | null = null; let firstReport: Report | null = null;
  for (const r of reports) { const v = find(r); if (v) { firstVal = v; firstReport = r; break; } }

  const range = current?.optimal_range ?? current?.normal_range ?? null;
  const norm2 = current?.normal_range ?? null;
  const value = current ? numFrom(current.value) : null;
  const unit = current ? unitFrom(current.value) : "";
  const inRange = current?.status === "normal";

  const retestDays = latest ? Math.max(0, RETEST_DAYS - Math.floor((Date.now() - new Date(latest.created_at).getTime()) / DAY_MS)) : null;

  // Anna's read — templated, one italic accent; defers out-of-range to a clinician.
  const read = (() => {
    if (!current) return null;
    if (firstVal && firstReport && firstVal.status !== "normal" && inRange) {
      const month = new Date(firstReport.created_at).toLocaleDateString(undefined, { month: "long" });
      const elapsed = Math.max(1, Math.round((Date.now() - new Date(firstReport.created_at).getTime()) / DAY_MS));
      return { lead: `You sat ${statusWord(firstVal.status)} in ${month}. ${elapsed} days of protocol later, you're `, accent: "comfortably in range", tail: "." };
    }
    if (inRange) return { lead: "Right where it should be — ", accent: "comfortably optimal", tail: "." };
    return { lead: `Sitting a little ${statusWord(current.status)}. `, accent: "worth a chat with your doctor", tail: "." };
  })();

  return (
    <div style={{ minHeight: "100dvh", background: "var(--void)", color: "var(--bone)", fontFamily: "var(--sans)" }}>
      <LivingGlow />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 440, margin: "0 auto", padding: "calc(env(safe-area-inset-top) + 18px) 18px 40px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => nav({ to: "/progress" })} aria-label="Back" style={{ all: "unset", cursor: "pointer", display: "grid", placeItems: "center", width: 32, height: 32, color: "var(--smoke)" }}>
            <ArrowLeft size={18} />
          </button>
          <Eyebrow>biomarker</Eyebrow>
          <span style={{ width: 32 }} />
        </div>

        {!loaded ? (
          <p style={{ color: "var(--smoke)", marginTop: 24, fontSize: 14 }}>Loading…</p>
        ) : !current || value == null || !range ? (
          <GlassCard style={{ marginTop: 24, textAlign: "center", padding: 24 }}>
            <div style={{ fontFamily: "var(--serif)", fontSize: 18 }}>No reading for this marker yet.</div>
          </GlassCard>
        ) : (
          <>
            <h1 style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: 26, marginTop: 14 }}>{current.name}</h1>
            <div style={{ marginTop: 3 }}>
              <Eyebrow>{DESC[norm(current.name)] ?? current.name.toLowerCase()} · {retestDays != null ? `expires in ${retestDays} days` : "re-test soon"}</Eyebrow>
            </div>

            <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
              <Gauge value={value} unit={unit} rangeLow={range.min} rangeHigh={range.max} status={current.status === "normal" ? "optimal" : current.status} label={inRange ? "OPTIMAL" : current.status.toUpperCase()} size={240} />
            </div>

            {/* range strip */}
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--mono)", fontSize: 9, color: "var(--whisper)", padding: "0 6px", marginTop: 2 }}>
              <span>{norm2 ? `${norm2.min} low` : "low"}</span>
              <span>{range.min}–{range.max} optimal</span>
              <span>{norm2 ? `${norm2.max} high` : "high"}</span>
            </div>

            {read && (
              <GlassCard emphasis style={{ marginTop: 16 }}>
                <Eyebrow color="var(--ember-glow)">anna's read</Eyebrow>
                <div style={{ fontFamily: "var(--serif)", fontSize: 14, lineHeight: 1.4, marginTop: 7 }}>
                  {read.lead}<em style={{ fontStyle: "italic", color: "var(--ember-hot)" }}>{read.accent}</em>{read.tail}
                </div>
              </GlassCard>
            )}

            <EmberButton style={{ marginTop: 14, width: "100%" }} onClick={() => nav({ to: "/onboarding" })}>
              ⟳ Re-test recommended · book reminder
            </EmberButton>

            <p style={{ marginTop: 18, textAlign: "center", fontFamily: "var(--mono)", fontSize: 9, letterSpacing: ".08em", color: "var(--whisper)" }}>
              labread is informational and not a medical diagnosis.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
