import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase, type Report, type Analysis } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { useActiveMember } from "@/contexts/active-member";
import { normalizeName } from "@/components/analysis-view";
import { ArrowLeft } from "lucide-react";
import {
  LivingGlow, GlassCard, VitalityRing, AuroraChart, Gauge, Pill, Eyebrow, EmberButton,
  type AuroraSeries,
} from "@/components/lr";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Your progress | labread.health" },
      { name: "description", content: "Your vitality, multi-marker trends, and where each biomarker sits today." },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://labread.health/progress" }],
  }),
  component: ProgressPage,
});

const DAY_MS = 86_400_000;
const MARKER_COLORS = ["#FF7A18", "#FFB066", "#B23A0C", "#FF9D45"];

type FocusArea = { biomarker?: string };
type Protocol = { id: string; title: string | null; starts_at: string | null; focus_areas: FocusArea[] | null };
type CheckinRow = { checkin_date: string; completed_habit_ids: unknown };
type AnalysisValue = Analysis["values"][number];

function localDateStr(d: Date): string {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}
function parseDate(s: string): Date { return new Date(`${s}T00:00:00`); }
function midnight(d: Date): Date { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
function numFrom(value: string): number | null { const m = String(value ?? "").match(/-?[\d.]+/); return m ? parseFloat(m[0]) : null; }
function unitFrom(value: string): string { const m = String(value ?? "").match(/^\s*-?[\d.]+\s*(.*)$/); return m ? m[1].trim() : ""; }
function clampN(n: number, lo: number, hi: number): number { return Math.max(lo, Math.min(hi, n)); }

function streakOf(doneSet: Set<string>): number {
  const cur = midnight(new Date());
  if (!doneSet.has(localDateStr(cur))) cur.setDate(cur.getDate() - 1);
  let s = 0;
  while (doneSet.has(localDateStr(cur))) { s++; cur.setDate(cur.getDate() - 1); }
  return s;
}

type MarkerTrend = {
  name: string; color: string; raw: number[]; current: number; prev: number | null;
  unit: string; low: number; high: number; status: AnalysisValue["status"];
};

function ProgressPage() {
  const { user, loading } = useAuth();
  const { activeMemberId } = useActiveMember();
  const nav = useNavigate();
  const todayStr = useMemo(() => localDateStr(new Date()), []);

  const [dataLoaded, setDataLoaded] = useState(false);
  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [checkins, setCheckins] = useState<CheckinRow[]>([]);
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => { if (!loading && !user) nav({ to: "/auth" }); }, [user, loading]);

  const loadData = useCallback(async () => {
    if (!user || !activeMemberId) return;
    setDataLoaded(false);
    const { data: proto } = await supabase
      .from("health_protocols").select("id, title, starts_at, focus_areas")
      .eq("member_id", activeMemberId).eq("status", "active")
      .order("created_at", { ascending: false }).limit(1).maybeSingle();
    const { data: reps } = await supabase.from("reports").select("*").eq("member_id", activeMemberId).order("created_at", { ascending: true });
    setReports((reps as Report[]) ?? []);
    setProtocol((proto as Protocol) ?? null);

    if (proto) {
      const startsAt = (proto as Protocol).starts_at ?? todayStr;
      const { data: rows } = await supabase
        .from("daily_checkins").select("checkin_date, completed_habit_ids")
        .eq("member_id", activeMemberId).gte("checkin_date", startsAt).order("checkin_date", { ascending: true });
      setCheckins((rows as CheckinRow[]) ?? []);
    } else {
      setCheckins([]);
    }
    setDataLoaded(true);
  }, [user, activeMemberId, todayStr]);

  useEffect(() => { loadData(); }, [loadData]);

  if (loading || !user) return null;

  const startsAt = protocol?.starts_at ?? null;
  const elapsed = startsAt ? clampN(Math.floor((midnight(new Date()).getTime() - midnight(parseDate(startsAt)).getTime()) / DAY_MS), 0, 90) : 0;
  const dayX = startsAt ? clampN(elapsed + 1, 1, 90) : null;
  const retestDays = startsAt ? Math.max(0, 90 - elapsed) : null;

  const doneSet = new Set<string>();
  for (const r of checkins) if (Array.isArray(r.completed_habit_ids) && r.completed_habit_ids.length > 0) doneSet.add(r.checkin_date);
  const streak = streakOf(doneSet);

  // latest report + per-marker trends across all reports
  const latest = reports.length ? reports[reports.length - 1] : null;
  const latestValues = ((latest?.analysis?.values as AnalysisValue[]) ?? []).filter(
    (v) => !(v as { unrecognized?: boolean }).unrecognized && !(v as { qualitative?: boolean }).qualitative,
  );
  const inOptimal = (v: AnalysisValue) => {
    const n = numFrom(v.value); const o = v.optimal_range;
    return n != null && o ? n >= o.min && n <= o.max : v.status === "normal";
  };
  const vitality = latestValues.length ? Math.round((latestValues.filter(inOptimal).length / latestValues.length) * 100) : null;

  const markers: MarkerTrend[] = [];
  let ci = 0;
  for (const v of latestValues) {
    const r = v.optimal_range ?? v.normal_range;
    const cur = numFrom(v.value);
    if (!r || cur == null) continue;
    const norm = normalizeName(v.name);
    const raw: number[] = [];
    for (const rep of reports) {
      const m = ((rep.analysis?.values as AnalysisValue[]) ?? []).find((x) => {
        const xn = normalizeName(x.name);
        return xn === norm || xn.includes(norm) || norm.includes(xn);
      });
      const n = m ? numFrom(m.value) : null;
      if (n != null) raw.push(n);
    }
    markers.push({
      name: v.name, color: MARKER_COLORS[ci % MARKER_COLORS.length], raw,
      current: cur, prev: raw.length >= 2 ? raw[raw.length - 2] : null,
      unit: unitFrom(v.value), low: r.min, high: r.max, status: v.status,
    });
    ci++;
  }

  // aurora: raw values on a shared scale (same treatment as the Dashboard card),
  // capped to 3 comparable-scale markers so the ridges layer instead of a
  // mix of huge/tiny units crossing corner-to-corner.
  const auroraSeries: AuroraSeries[] = markers
    .filter((m) => m.raw.length >= 2)
    .slice(0, 3)
    .map((m) => ({ name: m.name, color: m.color, points: m.raw }));

  const gaugeStatus = (s: AnalysisValue["status"]) => (s === "normal" ? "optimal" : s);
  const gaugeLabel = (s: AnalysisValue["status"]) => (s === "normal" ? "optimal" : s);

  return (
    <div style={{ minHeight: "100dvh", background: "var(--void)", color: "var(--bone)", fontFamily: "var(--sans)" }}>
      <LivingGlow />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 440, margin: "0 auto", padding: "calc(env(safe-area-inset-top) + 18px) 18px 60px" }}>
        <Link to="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--mono)", fontSize: 12, color: "var(--smoke)", textDecoration: "none" }}>
          <ArrowLeft size={14} /> Dashboard
        </Link>

        <div style={{ marginTop: 18 }}>
          <Eyebrow>your protocol</Eyebrow>
          <h1 style={{ fontFamily: "var(--serif)", fontWeight: 500, fontSize: 34, lineHeight: 1, marginTop: 8 }}>Your progress</h1>
        </div>

        {!dataLoaded ? (
          <p style={{ color: "var(--smoke)", marginTop: 30, fontSize: 14 }}>Loading…</p>
        ) : !latest ? (
          <GlassCard style={{ marginTop: 26, textAlign: "center", padding: 24 }}>
            <p style={{ color: "var(--smoke)", fontSize: 14, marginBottom: 16 }}>Upload a blood test to start tracking your progress.</p>
            <EmberButton style={{ width: "100%" }} onClick={() => nav({ to: "/dashboard" })}>Upload a report →</EmberButton>
          </GlassCard>
        ) : (
          <>
            {/* vitality hero */}
            <div style={{ display: "flex", justifyContent: "center", margin: "24px 0 6px" }}>
              <VitalityRing score={vitality ?? 0} size={168} caption={dayX ? `day ${dayX} of 90` : undefined} />
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
              {streak > 0 && <Pill active>🔥 {streak}-day streak</Pill>}
              {retestDays != null && <Pill>⟳ retest in {retestDays} days</Pill>}
            </div>

            {/* multi-marker trend ridges (larger than the dashboard card) */}
            {auroraSeries.length > 0 && (
              <>
                <Eyebrow style={{ display: "block", margin: "26px 0 8px" }}>marker trends · since day 1</Eyebrow>
                <GlassCard>
                  <AuroraChart series={auroraSeries} height={96} />
                </GlassCard>
              </>
            )}

            {/* per-biomarker gauges — where each sits today */}
            <Eyebrow style={{ display: "block", margin: "22px 0 8px" }}>where you sit today</Eyebrow>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {markers.map((m) => {
                const trend = m.prev == null ? null : m.current > m.prev ? "↑" : m.current < m.prev ? "↓" : "→";
                return (
                  <GlassCard key={m.name} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <Gauge value={m.current} rangeLow={m.low} rangeHigh={m.high} status={gaugeStatus(m.status)} size={132} showLabel={false} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "var(--serif)", fontSize: 18 }}>{m.name}</div>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--smoke)", marginTop: 4 }}>
                        {m.current}{m.unit ? ` ${m.unit}` : ""}
                        {trend && m.prev != null && <span style={{ color: "var(--ember-glow)" }}> · {trend} from {m.prev}</span>}
                      </div>
                      <div style={{ marginTop: 6 }}>
                        <Eyebrow>{gaugeLabel(m.status)} {m.low}–{m.high}</Eyebrow>
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>

            <p style={{ marginTop: 20, textAlign: "center", fontFamily: "var(--mono)", fontSize: 9, letterSpacing: ".08em", color: "var(--whisper)" }}>
              labread is informational and not a medical diagnosis.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
