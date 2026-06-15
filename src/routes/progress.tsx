import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "@/components/logo";
import { ArrowLeft, Upload } from "lucide-react";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Your progress | labread.health" },
      { name: "description", content: "Track your 90-day health protocol progress, streak, and habits." },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://labread.health/progress" }],
  }),
  component: ProgressPage,
});

type FocusArea = { biomarker?: string; current_value?: string; target_value?: string; label?: string };
type Protocol = {
  id: string;
  title: string | null;
  starts_at: string | null;
  ends_at: string | null;
  focus_areas: FocusArea[] | null;
};
type CheckinRow = { checkin_date: string; completed_habit_ids: unknown };

const DAY_MS = 86_400_000;
const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

function localDateStr(d: Date): string {
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}
function parseDate(s: string): Date {
  return new Date(`${s}T00:00:00`);
}
function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function midnight(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function completedCount(ids: unknown): number {
  return Array.isArray(ids) ? ids.length : 0;
}

/** Consecutive completed days ending today (or yesterday if today isn't done yet). */
function currentStreak(doneSet: Set<string>): number {
  const cur = midnight(new Date());
  if (!doneSet.has(localDateStr(cur))) cur.setDate(cur.getDate() - 1);
  let s = 0;
  while (doneSet.has(localDateStr(cur))) {
    s++;
    cur.setDate(cur.getDate() - 1);
  }
  return s;
}

/** Longest consecutive run of completed days anywhere in the history. */
function bestStreak(doneSet: Set<string>): number {
  const dates = [...doneSet].sort();
  let best = 0;
  let run = 0;
  let prev: Date | null = null;
  for (const ds of dates) {
    const d = parseDate(ds);
    if (prev && Math.round((d.getTime() - prev.getTime()) / DAY_MS) === 1) run++;
    else run = 1;
    if (run > best) best = run;
    prev = d;
  }
  return best;
}

/** Mon–Sun of the current week. */
function currentWeekDays(): Date[] {
  const today = midnight(new Date());
  const dow = (today.getDay() + 6) % 7; // Mon=0 … Sun=6
  const monday = addDays(today, -dow);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

function ProgressPage() {
  const { user, loading } = useAuth();
  const nav = useNavigate();

  const todayStr = useMemo(() => localDateStr(new Date()), []);

  const [dataLoaded, setDataLoaded] = useState(false);
  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [checkins, setCheckins] = useState<CheckinRow[]>([]);
  const [totalHabits, setTotalHabits] = useState(0);

  useEffect(() => {
    if (!loading && !user) nav({ to: "/auth" });
  }, [user, loading]);

  const loadData = useCallback(async () => {
    if (!user) return;

    const { data: proto } = await supabase
      .from("health_protocols")
      .select("id, title, starts_at, ends_at, focus_areas")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!proto) {
      setProtocol(null);
      setDataLoaded(true);
      return;
    }
    setProtocol(proto as Protocol);

    const { count } = await supabase
      .from("protocol_habits")
      .select("id", { count: "exact", head: true })
      .eq("protocol_id", (proto as Protocol).id);
    setTotalHabits(count ?? 0);

    const startsAt = (proto as Protocol).starts_at ?? todayStr;
    const { data: rows } = await supabase
      .from("daily_checkins")
      .select("checkin_date, completed_habit_ids")
      .eq("user_id", user.id)
      .gte("checkin_date", startsAt)
      .order("checkin_date", { ascending: true });
    setCheckins((rows as CheckinRow[]) ?? []);

    setDataLoaded(true);
  }, [user, todayStr]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading || !user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-4 border-b border-border/50 flex items-center justify-between sticky top-0 bg-background z-30">
        <Logo />
        <Link
          to="/dashboard"
          className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md min-h-[44px]"
        >
          <ArrowLeft size={14} /> Dashboard
        </Link>
      </header>

      <main className="flex-1 px-5 pt-8 pb-20">
        <div className="max-w-[480px] mx-auto">
          {!dataLoaded ? (
            <ProgressSkeleton />
          ) : !protocol ? (
            <div className="py-24 text-center">
              <p className="text-muted-foreground">Upload a blood test to start your progress tracking.</p>
              <Link
                to="/dashboard"
                className="mt-5 inline-flex items-center gap-2 bg-accent text-accent-foreground px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
              >
                <Upload size={14} /> Upload a report
              </Link>
            </div>
          ) : (
            <ProgressContent protocol={protocol} checkins={checkins} totalHabits={totalHabits} todayStr={todayStr} />
          )}
        </div>
      </main>
    </div>
  );
}

function ProgressContent({
  protocol,
  checkins,
  totalHabits,
  todayStr,
}: {
  protocol: Protocol;
  checkins: CheckinRow[];
  totalHabits: number;
  todayStr: string;
}) {
  const startsAt = protocol.starts_at ?? todayStr;

  // counts/sets derived from check-ins
  const dateToCount = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of checkins) m.set(r.checkin_date, completedCount(r.completed_habit_ids));
    return m;
  }, [checkins]);
  const doneSet = useMemo(() => {
    const s = new Set<string>();
    dateToCount.forEach((c, d) => {
      if (c > 0) s.add(d);
    });
    return s;
  }, [dateToCount]);

  // --- Section 1: timeline ---------------------------------------------------
  const rawElapsed = Math.floor((midnight(new Date()).getTime() - midnight(parseDate(startsAt)).getTime()) / DAY_MS);
  const dayX = Math.max(0, Math.min(90, rawElapsed));
  const retestDays = Math.max(0, 90 - dayX);
  const inLast14 = dayX >= 76;
  const timelinePct = Math.round((dayX / 90) * 100);
  const retestDate = addDays(parseDate(startsAt), 90);
  const retestDateLabel = retestDate.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

  // --- Section 2: streak -----------------------------------------------------
  const streak = currentStreak(doneSet);
  const best = bestStreak(doneSet);

  // --- Section 3: week grid --------------------------------------------------
  const week = currentWeekDays();
  const weekDoneCount = week.filter((d) => doneSet.has(localDateStr(d))).length;

  // --- Section 5: weekly completion rate ------------------------------------
  const todayMid = midnight(new Date());
  const weekCheckinDays = week.filter((d) => d <= todayMid && dateToCount.has(localDateStr(d)));
  const weekNumerator = weekCheckinDays.reduce((a, d) => a + (dateToCount.get(localDateStr(d)) ?? 0), 0);
  const weekDenominator = totalHabits * weekCheckinDays.length;
  const weeklyPct = weekDenominator > 0 ? Math.round((weekNumerator / weekDenominator) * 100) : 0;
  const feedback =
    weeklyPct >= 90
      ? "Exceptional. You're in the top tier of consistency."
      : weeklyPct >= 70
        ? "Strong week. Keep this rhythm."
        : weeklyPct >= 50
          ? "Solid start. Even one more habit per day compounds."
          : "Every day is a reset. Tomorrow counts.";

  const focusAreas = Array.isArray(protocol.focus_areas) ? protocol.focus_areas : [];

  return (
    <div className="space-y-8">
      {/* ===== Section 1: Header ===== */}
      <section>
        <h1 className="text-3xl tracking-tight">Your progress</h1>
        <div className={`font-mono text-xs mt-1.5 ${inLast14 ? "text-warning" : "text-muted-foreground"}`}>
          {inLast14 ? `${retestDays} days until your retest` : `Day ${dayX} of 90`}
        </div>
        <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full bg-accent rounded-full transition-[width] duration-500" style={{ width: `${timelinePct}%` }} />
        </div>
      </section>

      {/* ===== Section 2: Streak card ===== */}
      <section
        className="glass p-6 flex items-end justify-between"
        style={streak > 0 ? { boxShadow: "0 0 0 1px rgba(245,160,74,0.14), 0 24px 60px -28px rgba(245,160,74,0.45)" } : undefined}
      >
        {streak > 0 ? (
          <div>
            <div className="text-[64px] leading-none font-serif text-accent tabular-nums">{streak}</div>
            <div className="text-sm text-muted-foreground mt-1">day streak</div>
          </div>
        ) : (
          <div className="text-2xl font-serif text-foreground/90 max-w-[14rem] leading-tight">Start your streak today</div>
        )}
        <div className="text-sm text-muted-foreground">Best: {best} {best === 1 ? "day" : "days"}</div>
      </section>

      {/* ===== Section 3: 7-day grid ===== */}
      <section>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">This week</div>
        <div className="mt-3 grid grid-cols-7 gap-1.5">
          {week.map((d, i) => {
            const ds = localDateStr(d);
            const isToday = ds === todayStr;
            const isPast = d < todayMid;
            const isCompleted = doneSet.has(ds);
            return (
              <div key={ds} className="flex flex-col items-center gap-2">
                <span className={`font-mono text-[11px] ${isToday ? "text-accent" : "text-muted-foreground"}`}>
                  {DAY_LABELS[i]}
                </span>
                <span
                  className={`w-7 h-7 rounded-full border ${
                    isCompleted
                      ? "bg-accent border-accent"
                      : isPast
                        ? "bg-transparent border-border"
                        : "bg-white/10 border-transparent"
                  }`}
                />
              </div>
            );
          })}
        </div>
        <div className="mt-3 text-xs text-muted-foreground">{weekDoneCount}/7 days this week</div>
      </section>

      {/* ===== Section 4: Focus areas ===== */}
      <section>
        <h2 className="text-2xl tracking-tight mb-4">What you're working on</h2>
        {focusAreas.length === 0 ? (
          <div className="glass p-5 text-sm text-muted-foreground">No focus areas recorded for this plan.</div>
        ) : (
          <div className="space-y-3">
            {focusAreas.map((f, i) => (
              <div key={`${f.biomarker ?? "area"}-${i}`} className="glass p-5">
                <div className="font-semibold">{f.biomarker ?? "Biomarker"}</div>
                {f.current_value && <div className="text-xs text-muted-foreground mt-1">Started at {f.current_value}</div>}
                {f.target_value && <div className="text-xs text-muted-foreground mt-0.5">Target: {f.target_value}</div>}
                <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: "0%" }} />
                </div>
                <div className="mt-1.5 text-xs text-muted-foreground">Retest in {retestDays} days</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ===== Section 5: Weekly completion rate ===== */}
      <section className="glass p-6">
        <div className="text-5xl font-serif text-foreground tabular-nums">{weeklyPct}%</div>
        <div className="text-sm text-muted-foreground mt-1">habits completed this week</div>
        <div className="text-sm mt-3">{feedback}</div>
      </section>

      {/* ===== Section 6: Retest reminder ===== */}
      <section className={`glass p-6 flex items-center justify-between gap-4 ${inLast14 ? "border-warning/50" : ""}`}>
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Next retest</div>
          <div className="font-mono text-base mt-1">{retestDateLabel}</div>
        </div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-5 py-2.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap min-h-[44px]"
        >
          <Upload size={14} /> Upload new results
        </Link>
      </section>
    </div>
  );
}

function ProgressSkeleton() {
  const Block = ({ h }: { h: number }) => (
    <div className="animate-pulse rounded-2xl bg-white/5" style={{ height: h }} />
  );
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="animate-pulse h-8 w-40 rounded-lg bg-white/5" />
        <div className="animate-pulse h-1.5 w-full rounded-full bg-white/5" />
      </div>
      <Block h={120} />
      <Block h={90} />
      <Block h={150} />
      <Block h={110} />
      <Block h={90} />
    </div>
  );
}
