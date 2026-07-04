import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { LivingGlow, GlassCard, Pill, Eyebrow, TabBar } from "@/components/lr";
import { appTabs } from "@/components/app-tabs";
import { loadPoints } from "@/lib/challenges";

export const Route = createFileRoute("/rewards")({
  head: () => ({
    meta: [
      { title: "Your rewards | labread.health" },
      { name: "description", content: "Your points and the offer ladder you're unlocking." },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://labread.health/rewards" }],
  }),
  component: RewardsWallet,
});

type Offer = { pct: number; source: string | null; unlocked_at: string | null; redeemed_at: string | null };

const TIERS = [
  { pct: 20, label: "First reset", sub: "Iron Reset complete" },
  { pct: 30, label: "Building momentum", sub: "30-day challenge" },
  { pct: 50, label: "Metabolic shift", sub: "60-day challenge" },
  { pct: 90, label: "Transformation", sub: "90 days · 3 paid months" },
];

function RewardsWallet() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [points, setPoints] = useState(0);
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => { if (!loading && !user) nav({ to: "/auth" }); }, [user, loading]);

  const load = useCallback(async () => {
    if (!user) return;
    const [pts, { data: offs }] = await Promise.all([
      loadPoints(user.id),
      supabase.from("offers").select("pct, source, unlocked_at, redeemed_at").eq("profile_id", user.id),
    ]);
    setPoints(pts);
    setOffers((offs as Offer[]) ?? []);
    setLoaded(true);
  }, [user]);
  useEffect(() => { load(); }, [load]);

  if (loading || !user) return null;

  const isUnlocked = (pct: number) => offers.some((o) => o.pct === pct && o.unlocked_at && !o.redeemed_at);
  const redeemable = TIERS.filter((t) => isUnlocked(t.pct)).sort((a, b) => a.pct - b.pct)[0] ?? null;

  return (
    <div style={{ minHeight: "100dvh", background: "var(--void)", color: "var(--bone)", fontFamily: "var(--sans)" }}>
      <LivingGlow />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 440, margin: "0 auto", padding: "calc(env(safe-area-inset-top) + 22px) 18px 130px" }}>
        <Eyebrow bracket>your rewards</Eyebrow>

        <div style={{ textAlign: "center", marginTop: 12 }}>
          <div style={{ fontFamily: "var(--serif)", fontWeight: 500, fontSize: 44, lineHeight: 1 }}>{loaded ? points.toLocaleString() : "—"}</div>
          <Eyebrow style={{ display: "block", marginTop: 4 }}>points earned</Eyebrow>
        </div>

        <Eyebrow style={{ display: "block", margin: "18px 0 6px" }}>offer ladder</Eyebrow>
        <GlassCard style={{ padding: "4px 16px" }}>
          {TIERS.map((t, i) => {
            const unlocked = isUnlocked(t.pct);
            return (
              <div key={t.pct} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 0", borderTop: i === 0 ? "none" : "1px solid var(--line)", opacity: unlocked ? 1 : 0.5 }}>
                <div style={{ fontFamily: "var(--serif)", fontSize: 20, width: 48, flex: "none", color: unlocked ? "var(--ember-hot)" : "var(--bone)" }}>{t.pct}%</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 600 }}>{t.label}</div>
                  <div style={{ fontSize: 9, color: "var(--smoke)", marginTop: 1 }}>{t.sub}</div>
                </div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 8.5, letterSpacing: ".1em", textTransform: "uppercase", color: unlocked ? "var(--ember-glow)" : "var(--whisper)" }}>
                  {unlocked ? "ready ◆" : "locked"}
                </div>
              </div>
            );
          })}
        </GlassCard>

        <GlassCard emphasis style={{ marginTop: 10, padding: 13 }}>
          <Eyebrow color="var(--ember-glow)">how 90% works</Eyebrow>
          <div style={{ fontSize: 11, color: "var(--smoke)", marginTop: 5, lineHeight: 1.45 }}>
            Stay subscribed 3 months and finish the 90-day challenge → claim <b style={{ color: "var(--bone)", fontWeight: 600 }}>one month at 90% off.</b> You've already paid for three; the discount rewards the loyalty.
          </div>
        </GlassCard>

        {redeemable && (
          <Pill as="button" active style={{ marginTop: 12, width: "100%", justifyContent: "center", padding: 12, fontFamily: "var(--serif)", fontSize: 13 }}>
            Redeem {redeemable.pct}% off →
          </Pill>
        )}
      </div>

      <TabBar items={appTabs(nav, "challenges")} />
    </div>
  );
}
