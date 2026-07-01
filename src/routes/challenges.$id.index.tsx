import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useActiveMember } from "@/contexts/active-member";
import { supabase } from "@/lib/supabase";
import { LivingGlow, GlassCard, DayGrid, Pill, Eyebrow } from "@/components/lr";
import { ArrowLeft } from "lucide-react";
import { type Challenge, type Enrollment, CHALLENGE_ACTIONS } from "@/lib/challenges";

export const Route = createFileRoute("/challenges/$id/")({
  head: () => ({ meta: [{ title: "Active challenge | labread.health" }, { name: "robots", content: "noindex" }] }),
  component: ActiveChallenge,
});

function ActiveChallenge() {
  const { user, loading } = useAuth();
  const { activeMemberId } = useActiveMember();
  const { id } = useParams({ from: "/challenges/$id/" });
  const nav = useNavigate();

  const [loaded, setLoaded] = useState(false);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [done, setDone] = useState<boolean[]>([]);

  useEffect(() => { if (!loading && !user) nav({ to: "/auth" }); }, [user, loading]);

  const load = useCallback(async () => {
    if (!user || !activeMemberId) return;
    const [{ data: chs }, { data: en }] = await Promise.all([
      supabase.from("challenges").select("*").order("sort_order", { ascending: true }),
      supabase.from("enrollments").select("*").eq("member_id", activeMemberId).eq("status", "active").order("started_at", { ascending: false }).limit(1).maybeSingle(),
    ]);
    const ch = ((chs as Challenge[]) ?? []).find((c) => c.id === id) ?? null;
    setChallenge(ch);
    setEnrollment((en as Enrollment) ?? null);
    const actions = CHALLENGE_ACTIONS[ch?.theme ?? "iron"] ?? CHALLENGE_ACTIONS.iron;
    setDone(actions.map((_, i) => i === 0)); // first done, per the reference
    setLoaded(true);
  }, [user, activeMemberId, id]);

  useEffect(() => { load(); }, [load]);

  if (loading || !user) return null;

  const actions = CHALLENGE_ACTIONS[challenge?.theme ?? "iron"] ?? CHALLENGE_ACTIONS.iron;
  const day = enrollment?.current_day ?? 1;
  const total = challenge?.length_days ?? 21;
  const daysToReward = Math.max(0, total - day);
  const shortName = (challenge?.name ?? "challenge").replace(/^\d+-Day\s+/, "").toLowerCase();

  return (
    <div style={{ minHeight: "100dvh", background: "var(--void)", color: "var(--bone)", fontFamily: "var(--sans)" }}>
      <LivingGlow />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 440, margin: "0 auto", padding: "calc(env(safe-area-inset-top) + 18px) 18px 60px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <button onClick={() => nav({ to: "/challenges" })} aria-label="Back" style={{ all: "unset", cursor: "pointer", display: "grid", placeItems: "center", width: 32, height: 32, color: "var(--smoke)" }}>
            <ArrowLeft size={18} />
          </button>
          <Eyebrow>{shortName}</Eyebrow>
          {enrollment && <Pill active style={{ padding: "4px 10px" }}>🔥 {enrollment.streak}</Pill>}
        </div>

        {!loaded ? (
          <p style={{ color: "var(--smoke)", marginTop: 24, fontSize: 14 }}>Loading…</p>
        ) : !challenge ? (
          <GlassCard style={{ marginTop: 24, textAlign: "center", padding: 24 }}>
            <div style={{ fontFamily: "var(--serif)", fontSize: 18 }}>Challenge not found.</div>
          </GlassCard>
        ) : (
          <>
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <div style={{ fontFamily: "var(--serif)", fontWeight: 500, fontSize: 32, lineHeight: 1 }}>
                Day {day}<span style={{ color: "var(--smoke)", fontSize: 18 }}> / {total}</span>
              </div>
              <Eyebrow style={{ display: "block", marginTop: 6 }}>{daysToReward} days to {challenge.offer_pct}% off</Eyebrow>
            </div>

            <GlassCard style={{ marginTop: 16 }}>
              <Eyebrow>your streak</Eyebrow>
              <div style={{ marginTop: 8 }}>
                <DayGrid total={total} current={day} />
              </div>
            </GlassCard>

            <Eyebrow style={{ display: "block", margin: "16px 0 8px" }}>today · 100 pts</Eyebrow>
            <GlassCard>
              {actions.map((a, i) => {
                const isDone = done[i];
                return (
                  <button
                    key={a}
                    onClick={() => setDone((d) => d.map((v, j) => (j === i ? !v : v)))}
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
                        border: isDone ? "none" : "1.5px solid var(--whisper)",
                        background: isDone ? "linear-gradient(135deg,var(--ember-core),var(--ember-deep))" : "transparent",
                        boxShadow: isDone ? "0 0 12px rgba(255,150,60,.5)" : "none",
                      }}
                    >
                      {isDone ? "✓" : ""}
                    </span>
                    <span style={{ flex: 1, fontSize: 14, color: isDone ? "var(--smoke)" : "var(--bone)", textDecoration: isDone ? "line-through" : "none", textDecorationColor: "var(--whisper)" }}>
                      {a}
                    </span>
                  </button>
                );
              })}
            </GlassCard>

            <p style={{ marginTop: 18, textAlign: "center", fontFamily: "var(--mono)", fontSize: 9, letterSpacing: ".08em", color: "var(--whisper)" }}>
              labread is informational and not a medical diagnosis.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
