import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase, type Report, type Analysis } from "@/lib/supabase";
import { useActiveMember } from "@/contexts/active-member";
import { MemberSwitcher } from "@/components/member-switcher";
import {
  LivingGlow, GlassCard, VitalityRing, AuroraChart, AnnaOrb, Pill, EmberButton, Eyebrow, TabBar,
  type AuroraSeries,
} from "@/components/lr";
import { appTabs } from "@/components/app-tabs";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Today | labread.health" },
      { name: "description", content: "Your daily health dashboard — protocol, habits and progress." },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://labread.health/dashboard" }],
  }),
  component: Dashboard,
});

/* ============================ data helpers ============================ */
const DAY_MS = 86_400_000;
function localDateStr(d: Date): string {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}
function parseDate(s: string): Date {
  return new Date(`${s}T00:00:00`);
}
function numFrom(value: string): number | null {
  const m = String(value ?? "").match(/-?[\d.]+/);
  return m ? parseFloat(m[0]) : null;
}
function unitFrom(value: string): string {
  const m = String(value ?? "").match(/^\s*-?[\d.]+\s*(.*)$/);
  return m ? m[1].trim() : "";
}
function clampN(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}
function isInRange(status: string): boolean {
  return status === "normal";
}

type Protocol = {
  id: string;
  title: string | null;
  starts_at: string | null;
  ends_at: string | null;
  focus_areas: Array<{ biomarker?: string; label?: string }> | null;
};
type Habit = { id: string; title: string; category: string; frequency: string | null; icon: string | null; sort_order: number };
type CheckinRow = { checkin_date: string; completed_habit_ids: unknown };
type AnalysisValue = Analysis["values"][number];

function consecutiveStreak(rows: CheckinRow[]): number {
  const done = new Set(
    rows.filter((r) => Array.isArray(r.completed_habit_ids) && r.completed_habit_ids.length > 0).map((r) => r.checkin_date),
  );
  const cur = new Date();
  cur.setHours(0, 0, 0, 0);
  if (!done.has(localDateStr(cur))) cur.setDate(cur.getDate() - 1);
  let s = 0;
  while (done.has(localDateStr(cur))) {
    s++;
    cur.setDate(cur.getDate() - 1);
  }
  return s;
}

/* normalize a biomarker name for matching across reports */
function norm(name: string): string {
  return String(name ?? "").toLowerCase().replace(/\s*\([^)]*\)/g, "").replace(/\s+/g, " ").trim();
}

/** all numeric values of a marker across reports (oldest -> newest) */
function markerSeries(reports: Report[], name: string): number[] {
  const out: number[] = [];
  for (const r of reports) {
    const v = ((r.analysis?.values as AnalysisValue[]) ?? []).find((x) => norm(x.name) === norm(name));
    const n = v ? numFrom(v.value) : null;
    if (n != null) out.push(n);
  }
  return out;
}

function inOptimal(v: AnalysisValue): boolean {
  const n = numFrom(v.value);
  const o = v.optimal_range;
  return n != null && o ? n >= o.min && n <= o.max : isInRange(v.status);
}

type Mood = "drained" | "steady" | "charged";

function Dashboard() {
  const { user, loading } = useAuth();
  const { activeMember, activeMemberId } = useActiveMember();
  const nav = useNavigate();

  const todayStr = useMemo(() => localDateStr(new Date()), []);
  const [loaded, setLoaded] = useState(false);
  const [mood, setMood] = useState<Mood>("steady");

  const [reports, setReports] = useState<Report[]>([]); // ascending (oldest → newest)
  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (!loading && !user) nav({ to: "/auth" });
  }, [user, loading]);

  // Role gate: doctor/clinic accounts belong on the clinician dashboard.
  useEffect(() => {
    if (loading || !user) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase.from("profiles").select("plan").eq("id", user.id).maybeSingle();
      const plan = (data as { plan?: string } | null)?.plan;
      if (!cancelled && (plan === "professional" || plan === "clinic" || plan === "doctor")) {
        nav({ to: "/clinician" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, loading, nav]);

  const loadAll = useCallback(async () => {
    if (!user || !activeMemberId) return;
    setLoaded(false);

    const [{ data: reps }, { data: proto }] = await Promise.all([
      supabase.from("reports").select("*").eq("member_id", activeMemberId).order("created_at", { ascending: true }),
      supabase
        .from("health_protocols")
        .select("id, title, starts_at, ends_at, focus_areas")
        .eq("member_id", activeMemberId)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);
    setReports((reps as Report[]) ?? []);
    setProtocol((proto as Protocol) ?? null);
    setHabits([]);
    setCompleted([]);
    setStreak(0);

    if (proto) {
      const [{ data: hb }, { data: today }, { data: recent }] = await Promise.all([
        supabase.from("protocol_habits").select("id, title, category, frequency, icon, sort_order").eq("protocol_id", (proto as Protocol).id).order("sort_order", { ascending: true }),
        supabase.from("daily_checkins").select("completed_habit_ids").eq("member_id", activeMemberId).eq("checkin_date", todayStr).maybeSingle(),
        supabase.from("daily_checkins").select("checkin_date, completed_habit_ids").eq("member_id", activeMemberId).order("checkin_date", { ascending: false }).limit(120),
      ]);
      setHabits((hb as Habit[]) ?? []);
      setCompleted(Array.isArray(today?.completed_habit_ids) ? (today!.completed_habit_ids as string[]) : []);
      setStreak(consecutiveStreak((recent as CheckinRow[]) ?? []));
    }
    setLoaded(true);
  }, [user, todayStr, activeMemberId]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const toggleHabit = useCallback(
    async (habitId: string) => {
      if (!user || !protocol || !activeMemberId) return;
      const next = completed.includes(habitId) ? completed.filter((x) => x !== habitId) : [...completed, habitId];
      setCompleted(next); // optimistic
      const { error } = await supabase.from("daily_checkins").upsert(
        { user_id: user.id, member_id: activeMemberId, protocol_id: protocol.id, checkin_date: todayStr, completed_habit_ids: next },
        { onConflict: "member_id,checkin_date" },
      );
      if (error) {
        setCompleted(completed); // revert
      } else if (next.length > 0 && streak === 0) {
        setStreak(1);
      }
    },
    [user, protocol, completed, todayStr, streak, activeMemberId],
  );

  // New-user guard: the Dashboard is not for users without bloodwork. Once data
  // has settled, if this member has no report, send them into onboarding. Runs
  // on every load, not just after signup.
  useEffect(() => {
    if (loaded && reports.length === 0) nav({ to: "/onboarding" });
  }, [loaded, reports.length, nav]);

  if (loading || !user || !activeMember) return null;

  /* ---------- derived values ---------- */
  const startsAt = protocol?.starts_at ?? null;
  const elapsed = startsAt ? clampN(Math.floor((Date.now() - parseDate(startsAt).getTime()) / DAY_MS), 0, 90) : 0;
  const dayX = startsAt ? clampN(elapsed + 1, 1, 90) : null;

  const latest = reports.length ? reports[reports.length - 1] : null;
  const latestValues: AnalysisValue[] = (latest?.analysis?.values as AnalysisValue[]) ?? [];
  const gradedValues = latestValues.filter((v) => !(v as { unrecognized?: boolean }).unrecognized && !(v as { qualitative?: boolean }).qualitative);
  const markersInRange = gradedValues.length ? Math.round((gradedValues.filter((v) => isInRange(v.status)).length / gradedValues.length) * 100) : null;
  // Vitality = share of graded markers sitting in their OPTIMAL range (a UI
  // aggregate over the validated ranges — not new medical logic).
  const vitality = gradedValues.length ? Math.round((gradedValues.filter(inOptimal).length / gradedValues.length) * 100) : null;

  // focus marker: protocol's top focus area, else first flagged, else first value
  const focus: AnalysisValue | null = (() => {
    if (!latestValues.length) return null;
    const target = protocol?.focus_areas?.[0]?.biomarker ? norm(protocol.focus_areas[0].biomarker!) : null;
    if (target) {
      const hit = latestValues.find((v) => norm(v.name) === target || norm(v.name).includes(target) || target.includes(norm(v.name)));
      if (hit) return hit;
    }
    return latestValues.find((v) => !isInRange(v.status)) ?? latestValues[0];
  })();

  const prevValue: string | null = (() => {
    if (!focus) return null;
    for (let i = reports.length - 2; i >= 0; i--) {
      const v = ((reports[i].analysis?.values as AnalysisValue[]) ?? []).find((x) => norm(x.name) === norm(focus.name));
      if (v) return v.value;
    }
    return null;
  })();
  const focusNum = focus ? numFrom(focus.value) : null;
  const prevNum = prevValue ? numFrom(prevValue) : null;
  const trendUp = focusNum != null && prevNum != null ? focusNum > prevNum : null;

  const auroraSeries: AuroraSeries[] = [
    { name: "Ferritin", color: "#FF7A18", points: markerSeries(reports, "Ferritin") },
    { name: "Vitamin D", color: "#FFB066", points: markerSeries(reports, "Vitamin D") },
    { name: "CRP", color: "#B23A0C", points: markerSeries(reports, "CRP") },
  ].filter((s) => s.points.length >= 2);

  const annaLine = focus
    ? `Your ${focus.name.toLowerCase()} is ${trendUp == null ? "holding steady" : trendUp ? "climbing" : "easing"}.`
    : "";
  // Anna gives a short, actionable nudge — not a definition. Templated per
  // marker for now (the brief's constrained-explanation pattern).
  const FOCUS_ACTION: Record<string, string> = {
    "ferritin": "Keep the iron-rich dinners going.",
    "vitamin d": "Keep the midday sun and your D3 going.",
    "vitamin b12": "Keep B12-rich foods on the plate.",
    "crp": "Keep the anti-inflammatory habits steady.",
  };
  const annaAction = focus ? (FOCUS_ACTION[norm(focus.name)] ?? "Stay with the habits that are working.") : "";

  const doneCount = completed.length;

  return (
    <div style={{ minHeight: "100vh", background: "var(--void)", color: "var(--bone)", fontFamily: "var(--sans)" }}>
      <LivingGlow />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 440, margin: "0 auto", padding: "calc(env(safe-area-inset-top) + 22px) 18px 130px" }}>
        {/* header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontFamily: "var(--serif)", fontWeight: 500, fontSize: 40, lineHeight: 1 }}>
              {dayX ? `Day ${dayX}` : "Welcome"}
            </div>
            <Eyebrow style={{ display: "block", marginTop: 7 }}>{dayX ? "of your 90-day protocol" : "let's begin"}</Eyebrow>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Link to="/chat" aria-label="Talk to Anna"><AnnaOrb size={34} halo={false} pulse={false} /></Link>
            <MemberSwitcher variant="appbar" />
          </div>
        </div>

        {latest ? (
          <>
            {/* vitality hero */}
            <div style={{ display: "flex", justifyContent: "center", margin: "26px 0 8px" }}>
              <VitalityRing score={vitality ?? 0} size={172} caption={markersInRange != null ? `${markersInRange}% in range` : undefined} />
            </div>

            {/* mood check-in */}
            <div style={{ textAlign: "center", marginBottom: 10 }}>
              <Eyebrow>how do you feel today?</Eyebrow>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              <Pill as="button" active={mood === "drained"} onClick={() => setMood("drained")}>◴ Drained</Pill>
              <Pill as="button" active={mood === "steady"} onClick={() => setMood("steady")}>◑ Steady</Pill>
              <Pill as="button" active={mood === "charged"} onClick={() => setMood("charged")}>◉ Charged</Pill>
            </div>

            {/* aurora trends */}
            {auroraSeries.length > 0 && (
              <GlassCard style={{ marginTop: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Eyebrow>marker trends</Eyebrow>
                  <Eyebrow>90d</Eyebrow>
                </div>
                <div style={{ marginTop: 10 }}>
                  <AuroraChart series={auroraSeries} />
                </div>
              </GlassCard>
            )}

            {/* Anna note */}
            {focus && (
              <GlassCard emphasis onClick={() => nav({ to: "/chat" })} style={{ marginTop: 12, display: "flex", gap: 11, alignItems: "center", cursor: "pointer" }}>
                <AnnaOrb size={34} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Eyebrow color="var(--ember-glow)">anna</Eyebrow>
                  <div style={{ fontFamily: "var(--serif)", fontSize: 15, lineHeight: 1.3, marginTop: 3 }}>
                    {annaLine} {annaAction}
                  </div>
                </div>
              </GlassCard>
            )}
          </>
        ) : (
          // empty state — no bloodwork yet
          <GlassCard style={{ marginTop: 26, textAlign: "center", padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}><AnnaOrb size={72} /></div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 20, lineHeight: 1.2 }}>
              Hand me your first <em style={{ fontStyle: "italic", color: "var(--ember-hot)" }}>blood test.</em>
            </div>
            <p style={{ color: "var(--smoke)", fontSize: 13, margin: "8px 0 16px" }}>I'll read it and build your 90-day plan.</p>
            <EmberButton style={{ width: "100%" }} onClick={() => nav({ to: "/onboarding" })}>Upload your first blood test →</EmberButton>
          </GlassCard>
        )}

        {/* today's habits */}
        {protocol && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "18px 0 8px" }}>
              <Eyebrow>{dayX ? `today · day ${dayX}` : "today"}</Eyebrow>
              {streak > 0 && <Pill active>🔥 {streak}-day streak</Pill>}
            </div>
            <GlassCard>
              {habits.length ? (
                habits.map((h, i) => {
                  const done = completed.includes(h.id);
                  return (
                    <button
                      key={h.id}
                      onClick={() => toggleHabit(h.id)}
                      style={{
                        all: "unset", cursor: "pointer", width: "100%", boxSizing: "border-box",
                        display: "flex", alignItems: "center", gap: 11, padding: "11px 0",
                        borderTop: i === 0 ? "none" : "1px solid var(--line)",
                      }}
                    >
                      <span
                        style={{
                          width: 20, height: 20, borderRadius: "50%", flex: "none", display: "grid", placeItems: "center",
                          fontSize: 11, color: "#1a0e06",
                          border: done ? "none" : "1.5px solid var(--whisper)",
                          background: done ? "linear-gradient(135deg,var(--ember-core),var(--ember-deep))" : "transparent",
                        }}
                      >
                        {done ? "✓" : ""}
                      </span>
                      <span style={{ flex: 1, fontSize: 14, color: done ? "var(--smoke)" : "var(--bone)", textDecoration: done ? "line-through" : "none", textDecorationColor: "var(--whisper)" }}>
                        {h.title}
                      </span>
                    </button>
                  );
                })
              ) : (
                <p style={{ color: "var(--smoke)", fontSize: 13 }}>{loaded ? "No habits scheduled today." : "Loading today's plan…"}</p>
              )}
            </GlassCard>
            {habits.length > 0 && (
              <div style={{ textAlign: "center", marginTop: 10 }}>
                <Eyebrow>{doneCount >= habits.length ? "all done — streak kept ✦" : `complete all ${habits.length} to keep your streak`}</Eyebrow>
              </div>
            )}
          </>
        )}

        {/* disclaimer — always where results appear */}
        <p style={{ marginTop: 20, textAlign: "center", fontFamily: "var(--mono)", fontSize: 9, letterSpacing: ".08em", color: "var(--whisper)", lineHeight: 1.5 }}>
          labread is informational and not a medical diagnosis.
        </p>
      </div>

      <TabBar items={appTabs(nav, "home")} />
    </div>
  );
}
