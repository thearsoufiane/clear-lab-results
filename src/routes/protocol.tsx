import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { LrUi, GlassPanel, GradientButton, Eyebrow, Gauge, Reveal, LR_FONT_LINKS } from "@/components/lr-ui";

export const Route = createFileRoute("/protocol")({
  head: () => ({
    meta: [
      { title: "Your 90-day protocol | labread.health" },
      { name: "description", content: "Your personalized 90-day health protocol." },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://labread.health/protocol" }, ...LR_FONT_LINKS],
  }),
  component: ProtocolScreen,
});

const DAY_MS = 86_400_000;
type Protocol = { id: string; title: string | null; starts_at: string | null };
type Habit = { id: string; title: string; category: string | null; frequency: string | null };

function ProtocolScreen() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    if (!loading && !user) nav({ to: "/auth" });
  }, [user, loading, nav]);

  const load = useCallback(async () => {
    if (!user) return;
    const { data: proto } = await supabase
      .from("health_protocols")
      .select("id, title, starts_at")
      .eq("user_id", user.id).eq("status", "active")
      .order("created_at", { ascending: false }).limit(1).maybeSingle();
    setProtocol((proto as Protocol) ?? null);
    if (proto) {
      const { data: hb } = await supabase
        .from("protocol_habits")
        .select("id, title, category, frequency")
        .eq("protocol_id", (proto as Protocol).id).order("sort_order", { ascending: true });
      setHabits((hb as Habit[]) ?? []);
    }
    setLoaded(true);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  if (loading || !user) return null;

  const startsAt = protocol?.starts_at ?? null;
  const elapsed = startsAt ? Math.max(0, Math.min(90, Math.floor((Date.now() - new Date(`${startsAt}T00:00:00`).getTime()) / DAY_MS))) : 0;
  const dayX = startsAt ? Math.min(elapsed + 1, 90) : null;
  const pct = startsAt ? Math.round((elapsed / 90) * 100) : 0;

  return (
    <LrUi style={{ minHeight: "100vh", background: "var(--bg)" }} revealDeps={[loaded]}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "26px 20px 80px" }}>
        <Link to="/dashboard" style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)", textDecoration: "none" }}>← Back</Link>

        <div style={{ marginTop: 22 }}>
          <Eyebrow>90-day protocol</Eyebrow>
          <h1 style={{ fontSize: "clamp(30px,5vw,44px)", marginTop: 10 }}>
            {protocol?.title || "Your 90-day plan"}
          </h1>
        </div>

        {!loaded ? (
          <p style={{ color: "var(--muted)", marginTop: 24 }}>Loading…</p>
        ) : protocol ? (
          <>
            <Reveal>
              <GlassPanel style={{ display: "flex", alignItems: "center", gap: 24, padding: 24, marginTop: 24, flexWrap: "wrap" }}>
                <Gauge pct={pct} size={132} stroke={10}>
                  <div>
                    <div style={{ fontFamily: "var(--serif)", fontSize: 26, lineHeight: 1 }}>{dayX}</div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", letterSpacing: ".1em", marginTop: 3 }}>/ 90 DAYS</div>
                  </div>
                </Gauge>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: 22 }}>Day {dayX} of 90</div>
                  <p style={{ color: "var(--muted)", fontSize: 14.5, marginTop: 6, lineHeight: 1.5 }}>
                    {pct}% through your protocol. Keep your daily habits going — small, consistent moves are what shift your markers.
                  </p>
                  <Link to="/progress" style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--amber-lite)", display: "inline-block", marginTop: 10 }}>
                    See progress →
                  </Link>
                </div>
              </GlassPanel>
            </Reveal>

            <Reveal>
              <Eyebrow style={{ marginTop: 30, display: "block" }}>Your habits</Eyebrow>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
                {habits.length ? habits.map((h) => (
                  <GlassPanel key={h.id} style={{ padding: "15px 18px", display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--grad)", flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 15 }}>{h.title}</span>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--faint)" }}>{(h.frequency || h.category || "").replace(/_/g, " ")}</span>
                  </GlassPanel>
                )) : (
                  <GlassPanel style={{ padding: 18, color: "var(--muted)" }}>No habits in this protocol yet.</GlassPanel>
                )}
              </div>
            </Reveal>
          </>
        ) : (
          <Reveal>
            <GlassPanel style={{ padding: 30, marginTop: 26, textAlign: "center" }}>
              <h3 style={{ fontSize: 22 }}>No active protocol yet</h3>
              <p style={{ color: "var(--muted)", fontSize: 15, margin: "10px auto 22px", maxWidth: 400, lineHeight: 1.55 }}>
                Upload a blood test and we'll build you a 90-day plan from your flagged results.
              </p>
              <GradientButton onClick={() => nav({ to: "/dashboard" })}>
                Upload a blood test
                <svg viewBox="0 0 24 24" fill="none" stroke="#1a0f02" strokeWidth={2.4}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </GradientButton>
            </GlassPanel>
          </Reveal>
        )}
      </div>
    </LrUi>
  );
}
