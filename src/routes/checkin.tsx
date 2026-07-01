import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { useActiveMember } from "@/contexts/active-member";
import { LivingGlow, GlassCard, AnnaOrb, Pill, Eyebrow, EmberButton, TabBar } from "@/components/lr";
import { appTabs } from "@/components/app-tabs";

export const Route = createFileRoute("/checkin")({
  head: () => ({
    meta: [
      { title: "Daily check-in | labread.health" },
      { name: "description", content: "A morning moment with Anna — how you're arriving, and the one thing that matters today." },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://labread.health/checkin" }],
  }),
  component: CheckinPage,
});

type Protocol = { id: string; title: string | null; starts_at: string | null; focus_areas: Array<{ biomarker?: string; label?: string }> | null };
type Habit = { id: string; title: string; sort_order: number };
type CheckinRow = { checkin_date: string; completed_habit_ids: unknown };
type Mood = "drained" | "steady" | "charged";

const DAY_MS = 86_400_000;
function localDateStr(d: Date): string {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}
function parseDate(s: string): Date {
  return new Date(`${s}T00:00:00`);
}
function clampN(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}
function isCompletedDay(ids: unknown): boolean {
  return Array.isArray(ids) && ids.length > 0;
}
function computeStreak(rows: CheckinRow[]): number {
  const done = new Set(rows.filter((r) => isCompletedDay(r.completed_habit_ids)).map((r) => r.checkin_date));
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
const MOOD_ENERGY: Record<Mood, number> = { drained: 2, steady: 3, charged: 5 };
function energyToMood(e: number | null | undefined): Mood | null {
  if (e == null) return null;
  if (e <= 2) return "drained";
  if (e >= 5) return "charged";
  return "steady";
}

function CheckinPage() {
  const { user, loading } = useAuth();
  const { activeMemberId } = useActiveMember();
  const nav = useNavigate();

  const todayStr = useMemo(() => localDateStr(new Date()), []);
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    return h < 12 ? "good morning" : h < 18 ? "good afternoon" : "good evening";
  }, []);

  const [dataLoaded, setDataLoaded] = useState(false);
  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  const [mood, setMood] = useState<Mood | null>(null);
  const [streak, setStreak] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) nav({ to: "/auth" });
  }, [user, loading]);

  const loadData = useCallback(async () => {
    if (!user || !activeMemberId) return;
    setMood(null); setCompleted([]); setStreak(0);
    const { data: proto } = await supabase
      .from("health_protocols").select("id, title, starts_at, focus_areas")
      .eq("member_id", activeMemberId).eq("status", "active")
      .order("created_at", { ascending: false }).limit(1).maybeSingle();
    setProtocol((proto as Protocol) ?? null);

    if (proto) {
      const [{ data: hb }, { data: today }, { data: recent }] = await Promise.all([
        supabase.from("protocol_habits").select("id, title, sort_order").eq("protocol_id", (proto as Protocol).id).order("sort_order", { ascending: true }),
        supabase.from("daily_checkins").select("completed_habit_ids, energy_level").eq("member_id", activeMemberId).eq("checkin_date", todayStr).maybeSingle(),
        supabase.from("daily_checkins").select("checkin_date, completed_habit_ids").eq("member_id", activeMemberId).order("checkin_date", { ascending: false }).limit(120),
      ]);
      setHabits((hb as Habit[]) ?? []);
      setCompleted(Array.isArray(today?.completed_habit_ids) ? (today!.completed_habit_ids as string[]) : []);
      setMood(energyToMood((today as { energy_level?: number } | null)?.energy_level));
      setStreak(computeStreak((recent as CheckinRow[]) ?? []));
    }
    setDataLoaded(true);
  }, [user, todayStr, activeMemberId]);

  useEffect(() => { loadData(); }, [loadData]);

  const pickMood = useCallback(
    async (m: Mood) => {
      setMood(m);
      if (!user || !protocol || !activeMemberId) return;
      setSaving(true);
      await supabase.from("daily_checkins").upsert(
        { user_id: user.id, member_id: activeMemberId, protocol_id: protocol.id, checkin_date: todayStr, completed_habit_ids: completed, energy_level: MOOD_ENERGY[m] },
        { onConflict: "member_id,checkin_date" },
      );
      setSaving(false);
    },
    [user, protocol, activeMemberId, todayStr, completed],
  );

  if (loading || !user) return null;

  const startsAt = protocol?.starts_at ?? null;
  const elapsed = startsAt ? clampN(Math.floor((Date.now() - parseDate(startsAt).getTime()) / DAY_MS), 0, 90) : 0;
  const dayX = startsAt ? clampN(elapsed + 1, 1, 90) : null;

  const oneFocus = habits[0]?.title
    ? `Get your ${habits[0].title.toLowerCase()} in before noon — it's the lever that's working.`
    : protocol?.focus_areas?.[0]?.label || protocol?.focus_areas?.[0]?.biomarker
      ? `Keep your ${(protocol!.focus_areas![0].label || protocol!.focus_areas![0].biomarker)!.toLowerCase()} momentum today.`
      : "One small, steady step today. That's all.";

  return (
    <div style={{ minHeight: "100dvh", background: "var(--void)", color: "var(--bone)", fontFamily: "var(--sans)" }}>
      <LivingGlow intensity="hero" />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 440, margin: "0 auto", minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "calc(env(safe-area-inset-top) + 32px) 22px 130px" }}>
        <Eyebrow bracket>{greeting}</Eyebrow>
        <div style={{ marginTop: 18 }}><AnnaOrb size={92} /></div>

        <div style={{ fontFamily: "var(--serif)", fontSize: 24, lineHeight: 1.25, marginTop: 18, maxWidth: 280 }}>
          {dayX ? `Day ${dayX}. ` : ""}How are you <em style={{ fontStyle: "italic", color: "var(--ember-hot)" }}>arriving</em> today?
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
          <Pill as="button" active={mood === "drained"} onClick={() => pickMood("drained")}>◴ Drained</Pill>
          <Pill as="button" active={mood === "steady"} onClick={() => pickMood("steady")}>◑ Steady</Pill>
          <Pill as="button" active={mood === "charged"} onClick={() => pickMood("charged")}>◉ Charged</Pill>
        </div>
        {mood && <div style={{ marginTop: 10 }}><Eyebrow>{saving ? "saving…" : "noted ✦"}</Eyebrow></div>}

        {protocol ? (
          <GlassCard emphasis style={{ marginTop: 24, width: "100%", textAlign: "left" }}>
            <Eyebrow color="var(--ember-glow)">anna's one focus today</Eyebrow>
            <div style={{ fontFamily: "var(--serif)", fontSize: 15, lineHeight: 1.35, marginTop: 7 }}>{oneFocus}</div>
            {streak > 0 && <div style={{ marginTop: 10 }}><Pill active>🔥 {streak}-day streak</Pill></div>}
          </GlassCard>
        ) : (
          dataLoaded && (
            <GlassCard style={{ marginTop: 24, width: "100%" }}>
              <div style={{ fontFamily: "var(--serif)", fontSize: 16 }}>Your plan is being prepared…</div>
              <p style={{ color: "var(--smoke)", fontSize: 13, marginTop: 6 }}>Upload a blood test and I'll build your 90-day protocol.</p>
            </GlassCard>
          )
        )}

        <EmberButton style={{ marginTop: 20, width: "100%" }} onClick={() => nav({ to: "/chat" })}>
          Talk it through with Anna →
        </EmberButton>

        <p style={{ marginTop: "auto", paddingTop: 20, fontFamily: "var(--mono)", fontSize: 9, letterSpacing: ".08em", color: "var(--whisper)" }}>
          labread is informational and not a medical diagnosis.
        </p>
      </div>

      <TabBar items={appTabs(nav, "anna")} />
    </div>
  );
}
