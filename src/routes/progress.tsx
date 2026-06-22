import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase, type Report, type Analysis } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { useActiveMember } from "@/contexts/active-member";
import { normalizeName } from "@/components/analysis-view";
import { LrUi, GlassPanel, GradientButton, Eyebrow, Gauge, Reveal, LR_FONT_LINKS } from "@/components/lr-ui";
import { ArrowLeft, Upload, Flame } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ReferenceArea, ResponsiveContainer } from "recharts";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Your progress | labread.health" },
      { name: "description", content: "Track your 90-day health protocol progress, streak, and biomarker trends." },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://labread.health/progress" }, ...LR_FONT_LINKS],
  }),
  component: ProgressPage,
});

type FocusArea = { biomarker?: string; current_value?: string; target_value?: string; label?: string };
type Protocol = { id: string; title: string | null; starts_at: string | null; ends_at: string | null; focus_areas: FocusArea[] | null };
type CheckinRow = { checkin_date: string; completed_habit_ids: unknown };
type AnalysisValue = Analysis["values"][number];

const DAY_MS = 86_400_000;

function localDateStr(d: Date): string {
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}
function parseDate(s: string): Date { return new Date(`${s}T00:00:00`); }
function addDays(d: Date, n: number): Date { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
function midnight(d: Date): Date { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
function completedCount(ids: unknown): number { return Array.isArray(ids) ? ids.length : 0; }
function numFrom(value: string): number | null { const m = String(value ?? "").match(/-?[\d.]+/); return m ? parseFloat(m[0]) : null; }
function shortDate(iso: string): string { return new Date(iso).toLocaleDateString(undefined, { month: "short" }); }
function rangeFrom(text?: string): [number, number] | null {
  const nums = String(text ?? "").match(/-?[\d.]+/g);
  if (nums && nums.length >= 2) return [parseFloat(nums[0]), parseFloat(nums[1])];
  return null;
}

function currentStreak(doneSet: Set<string>): number {
  const cur = midnight(new Date());
  if (!doneSet.has(localDateStr(cur))) cur.setDate(cur.getDate() - 1);
  let s = 0;
  while (doneSet.has(localDateStr(cur))) { s++; cur.setDate(cur.getDate() - 1); }
  return s;
}
function bestStreak(doneSet: Set<string>): number {
  const dates = [...doneSet].sort();
  let best = 0, run = 0; let prev: Date | null = null;
  for (const ds of dates) {
    const d = parseDate(ds);
    if (prev && Math.round((d.getTime() - prev.getTime()) / DAY_MS) === 1) run++; else run = 1;
    if (run > best) best = run;
    prev = d;
  }
  return best;
}
function currentWeekDays(): Date[] {
  const today = midnight(new Date());
  const dow = (today.getDay() + 6) % 7;
  const monday = addDays(today, -dow);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

function ProgressPage() {
  const { user, loading } = useAuth();
  const { activeMemberId } = useActiveMember();
  const nav = useNavigate();
  const todayStr = useMemo(() => localDateStr(new Date()), []);

  const [dataLoaded, setDataLoaded] = useState(false);
  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [checkins, setCheckins] = useState<CheckinRow[]>([]);
  const [totalHabits, setTotalHabits] = useState(0);
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => { if (!loading && !user) nav({ to: "/auth" }); }, [user, loading]);

  const loadData = useCallback(async () => {
    if (!user || !activeMemberId) return;
    setDataLoaded(false);
    const { data: proto } = await supabase
      .from("health_protocols").select("id, title, starts_at, ends_at, focus_areas")
      .eq("member_id", activeMemberId).eq("status", "active")
      .order("created_at", { ascending: false }).limit(1).maybeSingle();

    // reports power the per-marker trend charts (ascending = oldest → newest)
    const { data: reps } = await supabase.from("reports").select("*").eq("member_id", activeMemberId).order("created_at", { ascending: true });
    setReports((reps as Report[]) ?? []);

    if (!proto) { setProtocol(null); setCheckins([]); setTotalHabits(0); setDataLoaded(true); return; }
    setProtocol(proto as Protocol);

    const { count } = await supabase
      .from("protocol_habits").select("id", { count: "exact", head: true }).eq("protocol_id", (proto as Protocol).id);
    setTotalHabits(count ?? 0);

    const startsAt = (proto as Protocol).starts_at ?? todayStr;
    const { data: rows } = await supabase
      .from("daily_checkins").select("checkin_date, completed_habit_ids")
      .eq("member_id", activeMemberId).gte("checkin_date", startsAt).order("checkin_date", { ascending: true });
    setCheckins((rows as CheckinRow[]) ?? []);
    setDataLoaded(true);
  }, [user, todayStr, activeMemberId]);

  useEffect(() => { loadData(); }, [loadData]);

  if (loading || !user) return null;

  return (
    <LrUi style={{ minHeight: "100vh", background: "var(--bg)" }} revealDeps={[dataLoaded]}>
      {LR_FONT_LINKS.map((l, i) => <link key={i} {...l} />)}
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "22px 18px calc(84px + env(safe-area-inset-bottom))" }}>
        <Link to="/dashboard" style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 6 }}>
          <ArrowLeft size={14} /> Dashboard
        </Link>

        {!dataLoaded ? (
          <p style={{ color: "var(--muted)", marginTop: 40 }}>Loading…</p>
        ) : !protocol ? (
          <GlassPanel style={{ padding: 30, marginTop: 40, textAlign: "center" }}>
            <p style={{ color: "var(--muted)", fontSize: 15 }}>Upload a blood test to start tracking your progress.</p>
            <GradientButton style={{ marginTop: 18 }} onClick={() => nav({ to: "/dashboard" })}>
              <Upload size={15} /> Upload a report
            </GradientButton>
          </GlassPanel>
        ) : (
          <ProgressContent protocol={protocol} checkins={checkins} totalHabits={totalHabits} reports={reports} todayStr={todayStr} />
        )}
      </div>
    </LrUi>
  );
}

function ProgressContent({
  protocol, checkins, totalHabits, reports, todayStr,
}: {
  protocol: Protocol; checkins: CheckinRow[]; totalHabits: number; reports: Report[]; todayStr: string;
}) {
  const startsAt = protocol.starts_at ?? todayStr;

  const dateToCount = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of checkins) m.set(r.checkin_date, completedCount(r.completed_habit_ids));
    return m;
  }, [checkins]);
  const doneSet = useMemo(() => {
    const s = new Set<string>();
    dateToCount.forEach((c, d) => { if (c > 0) s.add(d); });
    return s;
  }, [dateToCount]);

  const rawElapsed = Math.floor((midnight(new Date()).getTime() - midnight(parseDate(startsAt)).getTime()) / DAY_MS);
  const elapsed = Math.max(0, Math.min(90, rawElapsed));
  const dayX = Math.max(1, Math.min(90, rawElapsed + 1));
  const retestDays = Math.max(0, 90 - elapsed);
  const pct = Math.round((elapsed / 90) * 100);
  const inLast14 = elapsed >= 76;
  const retestDate = addDays(parseDate(startsAt), 90);
  const retestDateLabel = retestDate.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

  const streak = currentStreak(doneSet);
  const best = bestStreak(doneSet);
  const streakPct = Math.min(100, (streak / 30) * 100);

  const week = currentWeekDays();
  const todayMid = midnight(new Date());
  const weekCheckinDays = week.filter((d) => d <= todayMid && dateToCount.has(localDateStr(d)));
  const weekNumerator = weekCheckinDays.reduce((a, d) => a + (dateToCount.get(localDateStr(d)) ?? 0), 0);
  const weekDenominator = totalHabits * weekCheckinDays.length;
  const weeklyPct = weekDenominator > 0 ? Math.round((weekNumerator / weekDenominator) * 100) : 0;
  const feedback = weeklyPct >= 90 ? "Exceptional. You're in the top tier of consistency."
    : weeklyPct >= 70 ? "Strong week. Keep this rhythm."
    : weeklyPct >= 50 ? "Solid start. Even one more habit per day compounds."
    : "Every day is a reset. Tomorrow counts.";

  const focusAreas = Array.isArray(protocol.focus_areas) ? protocol.focus_areas : [];

  return (
    <div style={{ marginTop: 22 }}>
      {/* Header */}
      <Eyebrow>Your protocol</Eyebrow>
      <h1 style={{ fontSize: "clamp(30px,6vw,40px)", marginTop: 8 }}>Your progress</h1>

      {/* 90-day ring + streak */}
      <Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 22 }}>
          <GlassPanel style={{ padding: 20, textAlign: "center" }}>
            <Gauge pct={pct} size={116} stroke={9} ticks>
              <div>
                <div style={{ fontFamily: "var(--serif)", fontSize: 30, lineHeight: 1 }}>{dayX}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--muted)", letterSpacing: ".1em", marginTop: 3 }}>/ 90 DAYS</div>
              </div>
            </Gauge>
            <div className={inLast14 ? "" : ""} style={{ fontFamily: "var(--mono)", fontSize: 11, color: inLast14 ? "var(--warn)" : "var(--faint)", marginTop: 10, letterSpacing: ".05em" }}>
              {inLast14 ? `${retestDays} DAYS TO RETEST` : `DAY ${dayX} OF 90`}
            </div>
          </GlassPanel>

          <GlassPanel style={{ padding: 20, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
            <Gauge pct={streakPct} size={92} stroke={8}>
              <Flame size={26} style={{ color: streak > 0 ? "var(--amber-lite)" : "var(--faint)" }} />
            </Gauge>
            <div style={{ fontFamily: "var(--serif)", fontSize: 34, lineHeight: 1, marginTop: 12, color: "var(--amber-lite)" }}>{streak}</div>
            <div style={{ fontSize: 13, color: "var(--muted)" }}>day streak</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--faint)", marginTop: 6, letterSpacing: ".06em" }}>
              BEST · {best} {best === 1 ? "DAY" : "DAYS"}
            </div>
          </GlassPanel>
        </div>
      </Reveal>

      {/* What you're working on — real trend charts */}
      <h2 style={{ fontSize: 24, marginTop: 34, marginBottom: 4 }}>What you're working on</h2>
      {focusAreas.length === 0 ? (
        <GlassPanel style={{ padding: 18, color: "var(--muted)", marginTop: 12 }}>No focus areas recorded for this plan.</GlassPanel>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
          {focusAreas.map((f, i) => (
            <Reveal key={`${f.biomarker ?? "area"}-${i}`}>
              <MarkerCard focus={f} reports={reports} retestDays={retestDays} />
            </Reveal>
          ))}
        </div>
      )}

      {/* Weekly completion */}
      <Reveal>
        <GlassPanel style={{ padding: 22, marginTop: 26 }}>
          <div style={{ fontFamily: "var(--serif)", fontSize: 44, lineHeight: 1 }}>{weeklyPct}<span style={{ fontSize: 22, color: "var(--muted)" }}>%</span></div>
          <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 4 }}>habits completed this week</div>
          <div style={{ fontSize: 14.5, marginTop: 12 }}>{feedback}</div>
        </GlassPanel>
      </Reveal>

      {/* Retest reminder */}
      <Reveal>
        <GlassPanel style={{ padding: 20, marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap", ...(inLast14 ? { borderColor: "rgba(227,169,74,.5)" } : {}) }}>
          <div>
            <Eyebrow>Next retest</Eyebrow>
            <div style={{ fontFamily: "var(--mono)", fontSize: 16, marginTop: 5 }}>{retestDateLabel}</div>
          </div>
          <Link to="/dashboard" className="lr-gbtn" style={{ textDecoration: "none", whiteSpace: "nowrap" }}>
            <Upload size={15} /> Upload new results
          </Link>
        </GlassPanel>
      </Reveal>
    </div>
  );
}

function MarkerCard({ focus, reports, retestDays }: { focus: FocusArea; reports: Report[]; retestDays: number }) {
  const name = focus.biomarker ?? "Biomarker";
  const norm = normalizeName(name);

  // build the value series across this user's reports
  const series: { label: string; value: number }[] = [];
  let latestVal: AnalysisValue | null = null;
  for (const r of reports) {
    const v = ((r.analysis?.values as AnalysisValue[]) ?? []).find((x) => {
      const xn = normalizeName(x.name);
      return xn === norm || xn.includes(norm) || norm.includes(xn);
    });
    const n = v ? numFrom(v.value) : null;
    if (v && n != null) { series.push({ label: shortDate(r.created_at), value: n }); latestVal = v; }
  }

  const optimal = latestVal?.optimal_range
    ? [latestVal.optimal_range.min, latestVal.optimal_range.max] as [number, number]
    : (rangeFrom(focus.target_value) ?? (latestVal?.normal_range ? [latestVal.normal_range.min, latestVal.normal_range.max] as [number, number] : null));
  const unit = latestVal ? (String(latestVal.value).match(/[a-zA-Z/%µ]+.*/)?.[0] ?? "").trim() : "";
  const current = series.length ? series[series.length - 1].value : null;

  // y domain padding so the area sits nicely with the band
  const ys = series.map((s) => s.value).concat(optimal ?? []);
  const lo = ys.length ? Math.min(...ys) : 0;
  const hi = ys.length ? Math.max(...ys) : 1;
  const pad = (hi - lo || 1) * 0.18;

  return (
    <GlassPanel style={{ padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div>
          <div style={{ fontFamily: "var(--serif)", fontSize: 19 }}>{name}</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--faint)", textTransform: "uppercase", letterSpacing: ".06em", marginTop: 3 }}>
            {focus.current_value ? `Started ${focus.current_value}` : ""}{focus.current_value && focus.target_value ? " · " : ""}{focus.target_value ? `Target ${focus.target_value}` : ""}
          </div>
        </div>
        {current != null && (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "var(--serif)", fontSize: 24, color: "var(--green)" }}>{current}</div>
            {unit && <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)" }}>{unit}</div>}
          </div>
        )}
      </div>

      {series.length >= 2 ? (
        <div style={{ width: "100%", height: 150 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ top: 6, right: 6, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="mkArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#FFC069" stopOpacity={0.35} />
                  <stop offset="1" stopColor="#FFC069" stopOpacity={0} />
                </linearGradient>
              </defs>
              {optimal && <ReferenceArea y1={optimal[0]} y2={optimal[1]} fill="#6FCF97" fillOpacity={0.12} stroke="none" />}
              <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#6F6557", fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <YAxis hide domain={[lo - pad, hi + pad]} />
              <Area
                type="monotone" dataKey="value" stroke="url(#lrGaugeGrad)" strokeWidth={2.6} fill="url(#mkArea)"
                isAnimationActive={false}
                dot={(props: any) => {
                  const last = props.index === series.length - 1;
                  return last
                    ? <circle key={props.index} cx={props.cx} cy={props.cy} r={5} fill="#0B0907" stroke="#6FCF97" strokeWidth={2.6} />
                    : <g key={props.index} />;
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--faint)", padding: "16px 0" }}>
          {current != null ? "One reading so far — upload your retest to chart the trend." : "No reading yet for this marker."}
        </div>
      )}

      <div style={{ fontFamily: "var(--mono)", fontSize: 10.5, color: "var(--faint)", marginTop: 6, letterSpacing: ".04em" }}>
        {optimal ? <span style={{ color: "var(--green)" }}>● optimal {optimal[0]}–{optimal[1]}{unit ? " " + unit : ""} · </span> : null}
        retest in {retestDays} days
      </div>
    </GlassPanel>
  );
}
