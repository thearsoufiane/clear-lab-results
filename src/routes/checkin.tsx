import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "@/components/logo";
import { ArrowLeft, Check, Loader2, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/checkin")({
  head: () => ({
    meta: [
      { title: "Daily check-in | labread.health" },
      { name: "description", content: "Track your 90-day health protocol with a daily check-in." },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://labread.health/checkin" }],
  }),
  component: CheckinPage,
});

type Protocol = { id: string; title: string | null; starts_at: string | null; status: string };
type Habit = {
  id: string;
  category: string;
  title: string;
  why: string | null;
  frequency: string | null;
  icon: string | null;
  sort_order: number;
};
type CheckinRow = {
  checkin_date: string;
  completed_habit_ids: unknown;
};

const ENERGY_OPTIONS = [
  { emoji: "😴", value: 1 },
  { emoji: "😕", value: 2 },
  { emoji: "😐", value: 3 },
  { emoji: "😊", value: 4 },
  { emoji: "⚡", value: 5 },
];

const SLEEP_OPTIONS = [
  { label: "5h", value: 5 },
  { label: "6h", value: 6 },
  { label: "7h", value: 7 },
  { label: "8h", value: 8 },
  { label: "9h", value: 9 },
  { label: "9h+", value: 9.5 },
];

/** Local-timezone calendar date as YYYY-MM-DD (so read/write stay consistent). */
function localDateStr(d: Date): string {
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

function isCompletedDay(ids: unknown): boolean {
  return Array.isArray(ids) && ids.length > 0;
}

/** Consecutive completed days ending today (or yesterday if today isn't done yet). */
function computeStreak(rows: CheckinRow[]): number {
  const done = new Set(rows.filter((r) => isCompletedDay(r.completed_habit_ids)).map((r) => r.checkin_date));
  const cur = new Date();
  cur.setHours(0, 0, 0, 0);
  if (!done.has(localDateStr(cur))) cur.setDate(cur.getDate() - 1);
  let streak = 0;
  while (done.has(localDateStr(cur))) {
    streak++;
    cur.setDate(cur.getDate() - 1);
  }
  return streak;
}

function CheckinPage() {
  const { user, loading } = useAuth();
  const nav = useNavigate();

  const todayStr = useMemo(() => localDateStr(new Date()), []);
  const dateLabel = useMemo(
    () => new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }),
    [],
  );

  const [dataLoaded, setDataLoaded] = useState(false);
  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  const [energy, setEnergy] = useState<number | null>(null);
  const [sleep, setSleep] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);

  const [alreadyCheckedIn, setAlreadyCheckedIn] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!loading && !user) nav({ to: "/auth" });
  }, [user, loading]);

  const loadData = useCallback(async () => {
    if (!user) return;

    const { data: proto } = await supabase
      .from("health_protocols")
      .select("id, title, starts_at, status")
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

    const { data: hb } = await supabase
      .from("protocol_habits")
      .select("*")
      .eq("protocol_id", (proto as Protocol).id)
      .order("sort_order", { ascending: true });
    setHabits((hb as Habit[]) ?? []);

    const { data: today } = await supabase
      .from("daily_checkins")
      .select("*")
      .eq("user_id", user.id)
      .eq("checkin_date", todayStr)
      .maybeSingle();

    if (today) {
      setCompleted(Array.isArray(today.completed_habit_ids) ? (today.completed_habit_ids as string[]) : []);
      setEnergy(today.energy_level ?? null);
      setSleep(today.sleep_hours ?? null);
      setAlreadyCheckedIn(true);
    }

    const { data: recent } = await supabase
      .from("daily_checkins")
      .select("checkin_date, completed_habit_ids")
      .eq("user_id", user.id)
      .order("checkin_date", { ascending: false })
      .limit(120);
    setStreak(computeStreak((recent as CheckinRow[]) ?? []));

    setDataLoaded(true);
  }, [user, todayStr]);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // No active protocol yet → poll every 5s until one appears.
  useEffect(() => {
    if (!user || protocol) return;
    const t = setInterval(loadData, 5000);
    return () => clearInterval(t);
  }, [user, protocol, loadData]);

  useEffect(() => () => { if (savedTimer.current) clearTimeout(savedTimer.current); }, []);

  const readOnly = alreadyCheckedIn && !editing;

  const toggleHabit = (id: string) => {
    if (readOnly) return;
    setCompleted((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
  };

  const handleSave = async () => {
    if (!user || !protocol) return;
    setSaving(true);
    setError(null);
    const { error: saveError } = await supabase.from("daily_checkins").upsert(
      {
        user_id: user.id,
        protocol_id: protocol.id,
        checkin_date: todayStr,
        completed_habit_ids: completed,
        energy_level: energy,
        sleep_hours: sleep,
      },
      { onConflict: "user_id,checkin_date" },
    );
    setSaving(false);

    if (saveError) {
      setError(saveError.message);
      return;
    }

    setAlreadyCheckedIn(true);
    setEditing(false);
    setSaved(true);
    savedTimer.current = setTimeout(() => setSaved(false), 1500);

    // Refresh streak from the freshly saved data.
    const { data: recent } = await supabase
      .from("daily_checkins")
      .select("checkin_date, completed_habit_ids")
      .eq("user_id", user.id)
      .order("checkin_date", { ascending: false })
      .limit(120);
    setStreak(computeStreak((recent as CheckinRow[]) ?? []));
  };

  if (loading || !user) return null;

  const total = habits.length;
  const doneCount = completed.length;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-4 border-b border-border/50 flex items-center justify-between sticky top-0 bg-background z-30">
        <Logo />
        <div className="flex items-center gap-1">
          <Link
            to="/progress"
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md min-h-[44px]"
          >
            <TrendingUp size={14} /> Progress
          </Link>
          <Link
            to="/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md min-h-[44px]"
          >
            <ArrowLeft size={14} /> Dashboard
          </Link>
        </div>
      </header>

      <main className="flex-1 px-5 py-8">
        <div className="max-w-[480px] mx-auto">
          {!dataLoaded ? (
            <div className="text-muted-foreground text-sm">Loading…</div>
          ) : !protocol ? (
            // ---- No active protocol -------------------------------------
            <div className="py-24 text-center">
              <p className="text-lg text-muted-foreground animate-pulse">Your plan is being prepared…</p>
            </div>
          ) : (
            <>
              {/* ---- Section 1: Header ------------------------------------ */}
              <div className="mb-7">
                {readOnly && (
                  <div className="mb-5 rounded-2xl border border-success/30 bg-success/10 px-4 py-3 flex items-center justify-between">
                    <span className="text-success text-sm font-medium">You're done for today ✓</span>
                    <button
                      onClick={() => setEditing(true)}
                      className="text-xs text-muted-foreground hover:text-foreground underline min-h-[44px] px-1"
                    >
                      Edit
                    </button>
                  </div>
                )}

                <div className="font-mono text-xs text-muted-foreground uppercase tracking-wider">{dateLabel}</div>
                <h1 className="text-3xl tracking-tight mt-1">Today's habits</h1>
                <div className="text-sm text-muted-foreground mt-2">🔥 {streak}-day streak</div>

                <div className="mt-4 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-[width] duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="mt-1.5 text-xs text-muted-foreground">
                  {doneCount} of {total} done today
                </div>
              </div>

              {/* ---- Section 2: Habit cards ------------------------------- */}
              <div className="space-y-2.5">
                {habits.map((h) => {
                  const done = completed.includes(h.id);
                  return (
                    <button
                      key={h.id}
                      onClick={() => toggleHabit(h.id)}
                      disabled={readOnly}
                      className={`w-full text-left flex items-center gap-3.5 rounded-2xl border p-3.5 transition-colors duration-150 ${
                        done
                          ? "border-success/45 bg-success/15"
                          : "border-border bg-card hover:border-foreground/30"
                      } ${readOnly ? "cursor-default" : "cursor-pointer"}`}
                    >
                      <span className="w-10 h-10 flex-none rounded-xl grid place-items-center text-xl bg-accent/15">
                        {h.icon || "•"}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block font-medium text-[15px] leading-snug">{h.title}</span>
                        {h.why && <span className="block text-xs text-muted-foreground mt-0.5 leading-snug">{h.why}</span>}
                      </span>
                      <span
                        className={`w-7 h-7 flex-none rounded-full border grid place-items-center transition-colors ${
                          done ? "bg-accent border-accent text-accent-foreground" : "border-border"
                        }`}
                      >
                        {done && <Check size={16} strokeWidth={3} />}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* ---- Section 3: Feeling check + save --------------------- */}
              <div className="mt-9">
                <h2 className="text-2xl tracking-tight">How are you feeling?</h2>

                {/* Energy */}
                <div className="mt-5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-medium">Energy</span>
                    <span className="text-xs text-muted-foreground">(optional)</span>
                  </div>
                  <div className="mt-2.5 flex gap-2">
                    {ENERGY_OPTIONS.map((o) => {
                      const sel = energy === o.value;
                      return (
                        <button
                          key={o.value}
                          onClick={() => !readOnly && setEnergy(sel ? null : o.value)}
                          disabled={readOnly}
                          className={`flex-1 h-12 rounded-full grid place-items-center text-xl border transition-colors ${
                            sel ? "bg-accent border-accent" : "bg-card border-border hover:border-foreground/30"
                          } ${readOnly ? "cursor-default" : "cursor-pointer"}`}
                        >
                          {o.emoji}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sleep */}
                <div className="mt-5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-medium">Sleep last night</span>
                    <span className="text-xs text-muted-foreground">(optional)</span>
                  </div>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {SLEEP_OPTIONS.map((o) => {
                      const sel = sleep === o.value;
                      return (
                        <button
                          key={o.label}
                          onClick={() => !readOnly && setSleep(sel ? null : o.value)}
                          disabled={readOnly}
                          className={`px-4 py-2.5 rounded-full text-sm border transition-colors min-h-[44px] ${
                            sel
                              ? "bg-accent text-accent-foreground border-accent"
                              : "bg-card border-border text-muted-foreground hover:border-foreground/30"
                          } ${readOnly ? "cursor-default" : "cursor-pointer"}`}
                        >
                          {o.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Save */}
                {!readOnly && (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className={`mt-7 w-full rounded-full py-3.5 font-medium transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-60 ${
                        saved ? "bg-success text-[#0a0c0f]" : "bg-accent text-accent-foreground"
                      }`}
                    >
                      {saved ? (
                        <>
                          <Check size={16} strokeWidth={3} /> Saved ✓
                        </>
                      ) : saving ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> Saving…
                        </>
                      ) : (
                        "Save check-in"
                      )}
                    </button>
                    {error && <p className="mt-3 text-sm text-danger">{error}</p>}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
