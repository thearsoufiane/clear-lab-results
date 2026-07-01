import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { LivingGlow, GlassCard, Pill, Eyebrow } from "@/components/lr";
import type { Challenge } from "@/lib/challenges";

export const Route = createFileRoute("/challenges/$id/complete")({
  head: () => ({ meta: [{ title: "Challenge complete | labread.health" }, { name: "robots", content: "noindex" }] }),
  component: ChallengeComplete,
});

function ChallengeComplete() {
  const { user, loading } = useAuth();
  const { id } = useParams({ from: "/challenges/$id/complete" });
  const nav = useNavigate();
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => { if (!loading && !user) nav({ to: "/auth" }); }, [user, loading]);

  const load = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from("challenges").select("*").order("sort_order", { ascending: true });
    setChallenges((data as Challenge[]) ?? []);
  }, [user]);
  useEffect(() => { load(); }, [load]);

  if (loading || !user) return null;

  const challenge = challenges.find((c) => c.id === id) ?? null;
  const next = challenge ? challenges.find((c) => c.sort_order === challenge.sort_order + 1) ?? null : null;
  const short = (challenge?.name ?? "Challenge").replace(/^\d+-Day\s+/, "");
  const words = short.toUpperCase().split(" ");
  const badgeL1 = words[0] ?? "";
  const badgeL2 = words.slice(1).join(" ");

  return (
    <div style={{ minHeight: "100dvh", background: "var(--void)", color: "var(--bone)", fontFamily: "var(--sans)", position: "relative", overflow: "hidden" }}>
      <LivingGlow intensity="hero" />
      {/* celebration burst */}
      <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, background: "radial-gradient(50% 38% at 50% 30%, rgba(255,150,60,.45), transparent 62%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 440, margin: "0 auto", minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "calc(env(safe-area-inset-top) + 40px) 22px 40px" }}>
        <Eyebrow bracket color="var(--ember-glow)">challenge complete</Eyebrow>

        <svg width="132" height="132" viewBox="0 0 132 132" style={{ marginTop: 16, overflow: "visible" }}>
          <defs>
            <linearGradient id="badgeGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#FFB066" /><stop offset="1" stopColor="#B23A0C" />
            </linearGradient>
            <filter id="badgeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <circle cx="66" cy="66" r="52" fill="none" stroke="url(#badgeGrad)" strokeWidth="6" filter="url(#badgeGlow)" opacity="0.9" />
          <circle cx="66" cy="66" r="40" fill="rgba(255,138,40,.10)" stroke="rgba(255,176,102,.5)" strokeWidth="1" />
          <text x="66" y={badgeL2 ? 60 : 72} textAnchor="middle" fontFamily="var(--serif)" fontSize="13" fill="#FFD9B0">{badgeL1}</text>
          {badgeL2 && <text x="66" y="78" textAnchor="middle" fontFamily="var(--serif)" fontSize="13" fill="#FFD9B0">{badgeL2}</text>}
        </svg>

        <div style={{ fontFamily: "var(--serif)", fontSize: 26, lineHeight: 1.1, marginTop: 16 }}>
          {challenge?.length_days ?? 21} days.<br />Done, and <em style={{ fontStyle: "italic", color: "var(--ember-hot)" }}>glowing.</em>
        </div>

        <GlassCard style={{ marginTop: 18, width: "100%", display: "flex", justifyContent: "space-around", alignItems: "center", textAlign: "center" }}>
          <div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 22, color: "var(--ember-hot)" }}>+{(challenge?.points_reward ?? 2100).toLocaleString()}</div>
            <Eyebrow>points</Eyebrow>
          </div>
          <div style={{ width: 1, alignSelf: "stretch", background: "var(--line)" }} />
          <div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 22, color: "var(--ember-hot)" }}>{challenge?.offer_pct ?? 20}%</div>
            <Eyebrow>off unlocked</Eyebrow>
          </div>
        </GlassCard>

        <Pill as="button" active onClick={() => nav({ to: "/challenges" })} style={{ marginTop: 16, width: "100%", justifyContent: "center", padding: 12, fontFamily: "var(--serif)", fontSize: 13 }}>
          ❝ Share your story
        </Pill>

        {next && (
          <button onClick={() => nav({ to: "/challenges/$id", params: { id: next.id } })} style={{ all: "unset", cursor: "pointer", marginTop: 10 }}>
            <Eyebrow>next: {next.name} →</Eyebrow>
          </button>
        )}
      </div>
    </div>
  );
}
