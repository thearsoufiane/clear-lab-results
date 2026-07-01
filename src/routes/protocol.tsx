import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useActiveMember } from "@/contexts/active-member";
import { supabase } from "@/lib/supabase";
import { LivingGlow, GlassCard, VitalityRing, Pill, Eyebrow, EmberButton, TabBar } from "@/components/lr";
import { appTabs } from "@/components/app-tabs";

export const Route = createFileRoute("/protocol")({
  head: () => ({
    meta: [
      { title: "Your 90-day protocol | labread.health" },
      { name: "description", content: "Your personalized 90-day health protocol — daily actions, streak and points." },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://labread.health/protocol" }],
  }),
  component: ProtocolScreen,
});

const DAY_MS = 86_400_000;
const PTS_PER_ACTION = 25; // 4 actions/day ≈ 100 pts/day (challenges-vision economy)

type Protocol = { id: string; title: string | null; starts_at: string | null };
type Habit = { id: string; title: string; category: string | null; frequency: string | null };
type CheckinRow = { checkin_date: string; completed_habit_ids: unknown };

function localDateStr(d: Date): string {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}
function clampN(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}
function idsOf(v: unknown): string[] {
  return Array.isArray(v) ? (v as string[]) : [];
}

/**
 * Streak rule (per the economy): a day counts only when ALL of that day's
 * actions were completed. Missing any action means the day doesn't extend the
 * streak — it resets to 0 — but earned points are never deducted (points are a
 * monotonic sum over past completed actions). `todayDone` feeds live state so
 * checking the last action bumps the streak on screen.
 */
function streakAllDone(recent: CheckinRow[], todayStr: string, todayCount: number, habitCount: number): number {
  const done = new Set(recent.filter((r) => idsOf(r.completed_habit_ids).length >= habitCount && habitCount > 0).map((r) => r.checkin_date));
  if (habitCount > 0 && todayCount >= habitCount) done.add(todayStr);
  else done.delete(todayStr);
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

function ProtocolScreen() {
  const { user, loading } = useAuth();
  const { activeMemberId } = useActiveMember();
  const nav = useNavigate();

  const todayStr = useMemo(() => localDateStr(new Date()), []);
  const [loaded, setLoaded] = useState(false);
  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  const [recent, setRecent] = useState<CheckinRow[]>([]);

  useEffect(() => {
    if (!loading && !user) nav({ to: "/auth" });
  }, [user, loading, nav]);

  const load = useCallback(async () => {
    if (!user || !activeMemberId) return;
    setLoaded(false);
    const { data: proto } = await supabase
      .from("health_protocols").select("id, title, starts_at")
      .eq("member_id", activeMemberId).eq("status", "active")
      .order("created_at", { ascending: false }).limit(1).maybeSingle();
    setProtocol((proto as Protocol) ?? null);
    setHabits([]); setCompleted([]); setRecent([]);
    if (proto) {
      const [{ data: hb }, { data: today }, { data: rec }] = await Promise.all([
        supabase.from("protocol_habits").select("id, title, category, frequency").eq("protocol_id", (proto as Protocol).id).order("sort_order", { ascending: true }),
        supabase.from("daily_checkins").select("completed_habit_ids").eq("member_id", activeMemberId).eq("checkin_date", todayStr).maybeSingle(),
        supabase.from("daily_checkins").select("checkin_date, completed_habit_ids").eq("member_id", activeMemberId).order("checkin_date", { ascending: false }).limit(120),
      ]);
      setHabits((hb as Habit[]) ?? []);
      setCompleted(idsOf(today?.completed_habit_ids));
      setRecent((rec as CheckinRow[]) ?? []);
    }
    setLoaded(true);
  }, [user, activeMemberId, todayStr]);

  useEffect(() => { load(); }, [load]);

  const toggleHabit = useCallback(
    async (habitId: string) => {
      if (!user || !protocol || !activeMemberId) return;
      const next = completed.includes(habitId) ? completed.filter((x) => x !== habitId) : [...completed, habitId];
      setCompleted(next); // optimistic — moves points + (on full day) streak live
      const { error } = await supabase.from("daily_checkins").upsert(
        { user_id: user.id, member_id: activeMemberId, protocol_id: protocol.id, checkin_date: todayStr, completed_habit_ids: next },
        { onConflict: "member_id,checkin_date" },
      );
      if (error) setCompleted(completed); // revert
    },
    [user, protocol, completed, todayStr, activeMemberId],
  );

  if (loading || !user) return null;

  const startsAt = protocol?.starts_at ?? null;
  const elapsed = startsAt ? clampN(Math.floor((Date.now() - new Date(`${startsAt}T00:00:00`).getTime()) / DAY_MS), 0, 90) : 0;
  const dayX = startsAt ? clampN(elapsed + 1, 1, 90) : null;
  const pct = startsAt ? Math.round((elapsed / 90) * 100) : 0;

  // points: monotonic sum over all completed actions (history excl. today) + today's live count
  const historicalActions = recent.filter((r) => r.checkin_date !== todayStr).reduce((sum, r) => sum + idsOf(r.completed_habit_ids).length, 0);
  const points = (historicalActions + completed.length) * PTS_PER_ACTION;
  const streak = streakAllDone(recent, todayStr, completed.length, habits.length);
  const doneCount = completed.length;
  const allDone = habits.length > 0 && doneCount >= habits.length;

  return (
    <div style={{ minHeight: "100dvh", background: "var(--void)", color: "var(--bone)", fontFamily: "var(--sans)" }}>
      <LivingGlow />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 440, margin: "0 auto", padding: "calc(env(safe-area-inset-top) + 22px) 18px 130px" }}>
        {/* header — title + prominent streak */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <h1 style={{ fontFamily: "var(--serif)", fontWeight: 500, fontSize: 30, lineHeight: 1 }}>Protocol</h1>
          {protocol && <Pill active>🔥 {streak}-day streak</Pill>}
        </div>

        {!loaded ? (
          <p style={{ color: "var(--smoke)", marginTop: 24, fontSize: 14 }}>Loading…</p>
        ) : protocol ? (
          <>
            {/* day-of-90 ring + points-to-reward */}
            <GlassCard style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 16 }}>
              <VitalityRing score={pct} display={`${dayX}`} label="/ 90" size={92} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <Eyebrow>days complete</Eyebrow>
                <div style={{ fontFamily: "var(--serif)", fontSize: 16, marginTop: 3, lineHeight: 1.2 }}>{pct}% toward your 90-day reward</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--ember-glow)", marginTop: 6 }}>{points.toLocaleString()} pts earned</div>
              </div>
            </GlassCard>

            {/* today's actions — ember checklist, each check moves points (+streak when complete) */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "18px 0 8px" }}>
              <Eyebrow>{dayX ? `today · day ${dayX}` : "today"}</Eyebrow>
              <Eyebrow color="var(--ember-glow)">+{PTS_PER_ACTION} pts each</Eyebrow>
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
                        display: "flex", alignItems: "center", gap: 11, padding: "12px 0",
                        borderTop: i === 0 ? "none" : "1px solid var(--line)",
                      }}
                    >
                      <span
                        style={{
                          width: 22, height: 22, borderRadius: "50%", flex: "none", display: "grid", placeItems: "center",
                          fontSize: 12, color: "#1a0e06",
                          border: done ? "none" : "1.5px solid var(--whisper)",
                          background: done ? "linear-gradient(135deg,var(--ember-core),var(--ember-deep))" : "transparent",
                          boxShadow: done ? "0 0 12px rgba(255,150,60,.5)" : "none",
                        }}
                      >
                        {done ? "✓" : ""}
                      </span>
                      <span style={{ flex: 1, fontSize: 14.5, color: done ? "var(--smoke)" : "var(--bone)", textDecoration: done ? "line-through" : "none", textDecorationColor: "var(--whisper)" }}>
                        {h.title}
                      </span>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--whisper)" }}>{(h.frequency || h.category || "").replace(/_/g, " ")}</span>
                    </button>
                  );
                })
              ) : (
                <p style={{ color: "var(--smoke)", fontSize: 13 }}>No actions in this protocol yet.</p>
              )}
            </GlassCard>

            {habits.length > 0 && (
              <GlassCard style={{ marginTop: 10, textAlign: "center", padding: 12 }}>
                <Eyebrow color={allDone ? "var(--ember-glow)" : "var(--whisper)"}>
                  {allDone ? `all ${habits.length} done — streak kept ✦ +${doneCount * PTS_PER_ACTION} pts today` : `complete all ${habits.length} to keep your streak`}
                </Eyebrow>
              </GlassCard>
            )}

            <p style={{ marginTop: 18, textAlign: "center", fontFamily: "var(--mono)", fontSize: 9, letterSpacing: ".08em", color: "var(--whisper)" }}>
              labread is informational and not a medical diagnosis.
            </p>
          </>
        ) : (
          <GlassCard style={{ marginTop: 26, textAlign: "center", padding: 24 }}>
            <div style={{ fontFamily: "var(--serif)", fontSize: 20 }}>No active protocol yet</div>
            <p style={{ color: "var(--smoke)", fontSize: 14, margin: "10px 0 18px", lineHeight: 1.5 }}>
              Upload a blood test and Anna builds your 90-day plan from your flagged results.
            </p>
            <EmberButton style={{ width: "100%" }} onClick={() => nav({ to: "/dashboard" })}>Upload a blood test →</EmberButton>
          </GlassCard>
        )}
      </div>

      <TabBar items={appTabs(nav, "protocol")} />
    </div>
  );
}
