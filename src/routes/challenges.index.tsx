import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { LivingGlow, GlassCard, Pill, Eyebrow, TabBar } from "@/components/lr";
import { appTabs } from "@/components/app-tabs";
import { type Challenge, type Enrollment, ICON_GRAD, challengeIcon, loadPoints } from "@/lib/challenges";

export const Route = createFileRoute("/challenges/")({
  head: () => ({
    meta: [
      { title: "Challenges | labread.health" },
      { name: "description", content: "Short, winnable challenges that build habits and pay you back in points and offers." },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://labread.health/challenges" }],
  }),
  component: ChallengesHub,
});

function ChallengesHub() {
  const { user, loading } = useAuth();
  const nav = useNavigate();

  const [loaded, setLoaded] = useState(false);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [points, setPoints] = useState(0);

  useEffect(() => { if (!loading && !user) nav({ to: "/auth" }); }, [user, loading]);

  const load = useCallback(async () => {
    if (!user) return;
    const [{ data: ch }, { data: en }, pts] = await Promise.all([
      supabase.from("challenges").select("*").order("length_days", { ascending: true }),
      supabase.from("enrollments").select("*").eq("profile_id", user.id).eq("status", "active").order("started_at", { ascending: false }).limit(1).maybeSingle(),
      loadPoints(user.id),
    ]);
    setChallenges((ch as Challenge[]) ?? []);
    setEnrollment((en as Enrollment) ?? null);
    setPoints(pts);
    setLoaded(true);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  if (loading || !user) return null;

  const active = enrollment ? challenges.find((c) => c.id === enrollment.challenge_id) ?? null : null;
  const activePct = active && enrollment ? Math.round((enrollment.current_day / active.length_days) * 100) : 0;
  const explore = challenges.filter((c) => c.id !== enrollment?.challenge_id);

  return (
    <div style={{ minHeight: "100dvh", background: "var(--void)", color: "var(--bone)", fontFamily: "var(--sans)" }}>
      <LivingGlow />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 440, margin: "0 auto", padding: "calc(env(safe-area-inset-top) + 22px) 18px 130px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <h1 style={{ fontFamily: "var(--serif)", fontWeight: 500, fontSize: 30, lineHeight: 1 }}>Challenges</h1>
          <Pill as="button" active onClick={() => nav({ to: "/rewards" })}>◆ {points.toLocaleString()} pts</Pill>
        </div>

        {!loaded ? (
          <p style={{ color: "var(--smoke)", marginTop: 24, fontSize: 14 }}>Loading…</p>
        ) : (
          <>
            {active && enrollment && (
              <>
                <Eyebrow bracket style={{ display: "block", margin: "16px 0 6px" }}>in progress</Eyebrow>
                <button
                  onClick={() => nav({ to: "/challenges/$id", params: { id: active.id } })}
                  style={{
                    all: "unset", cursor: "pointer", display: "block", width: "100%", boxSizing: "border-box",
                    position: "relative", borderRadius: 18, overflow: "hidden", padding: 14,
                    border: "1px solid rgba(255,190,130,.30)",
                    background: "radial-gradient(120% 115% at 18% -5%, #FFB865, transparent 52%), radial-gradient(95% 95% at 88% 105%, #6E1C04, transparent 60%), linear-gradient(145deg, #F26A1B 8%, #B23A0C 55%, #6E1C04)",
                    boxShadow: "0 16px 44px -14px rgba(255,110,20,.60), 0 0 0 0.5px rgba(255,180,120,.4) inset, inset 0 1px 0 rgba(255,225,190,.30)",
                  }}
                >
                  <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: ".16em", textTransform: "uppercase", color: "rgba(255,255,255,.72)" }}>
                    day {enrollment.current_day} of {active.length_days}
                  </div>
                  <div style={{ fontFamily: "var(--serif)", fontSize: 18, marginTop: 3 }}>{active.name}</div>
                  <div style={{ height: 5, borderRadius: 5, background: "rgba(0,0,0,.3)", marginTop: 9, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${activePct}%`, background: "#FFD9B0" }} />
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 9, flexWrap: "wrap" }}>
                    <ChTag>+{active.points_reward.toLocaleString()} pts</ChTag>
                    <ChTag>unlocks {active.offer_pct}% off</ChTag>
                  </div>
                </button>
              </>
            )}

            <Eyebrow bracket style={{ display: "block", margin: "16px 0 8px" }}>explore</Eyebrow>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {explore.map((c) => {
                const big = c.offer_pct >= 90;
                return (
                  <GlassCard
                    key={c.id}
                    emphasis={big}
                    onClick={() => nav({ to: "/challenges/$id", params: { id: c.id } })}
                    style={{ display: "flex", alignItems: "center", gap: 11, padding: 11, cursor: "pointer" }}
                  >
                    <span style={{ width: 34, height: 34, borderRadius: "50%", flex: "none", display: "grid", placeItems: "center", fontSize: 15, background: ICON_GRAD[c.theme ?? "iron"] ?? ICON_GRAD.iron }}>
                      {challengeIcon(c)}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600 }}>{c.name}</div>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 8.5, letterSpacing: ".08em", textTransform: "uppercase", color: big ? "var(--ember-glow)" : "var(--whisper)", marginTop: 3 }}>
                        {big ? "the big one · 90% off" : `+${c.points_reward.toLocaleString()} pts · ${c.offer_pct}% off`}
                      </div>
                    </div>
                    <Pill active={big} style={{ padding: "4px 9px", fontSize: 10 }}>{c.length_days}d</Pill>
                  </GlassCard>
                );
              })}
            </div>

            <button onClick={() => nav({ to: "/rewards" })} style={{ all: "unset", cursor: "pointer", display: "block", textAlign: "center", width: "100%", marginTop: 16 }}>
              <Eyebrow color="var(--ember-glow)">see your rewards →</Eyebrow>
            </button>
          </>
        )}
      </div>

      <TabBar items={appTabs(nav, "challenges")} />
    </div>
  );
}

function ChTag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontFamily: "var(--mono)", fontSize: 8, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--bone)", background: "rgba(0,0,0,.28)", border: "1px solid rgba(255,255,255,.16)", borderRadius: 999, padding: "3px 7px" }}>
      {children}
    </span>
  );
}
