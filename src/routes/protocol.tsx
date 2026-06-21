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
              <Eyebrow style={{ marginTop: 30, display: "block", marginBottom: 12 }}>The plan</Eyebrow>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 10 }}>
                {[
                  { w: "Weeks 1–4", t: "Kickstart", d: "Targeted food & supplements", lo: 1, hi: 30 },
                  { w: "Weeks 5–8", t: "Build", d: "Daily habits that move markers", lo: 31, hi: 60 },
                  { w: "Weeks 9–12", t: "Re-test", d: "Confirm your numbers moved", lo: 61, hi: 90 },
                ].map((ph) => {
                  const active = dayX != null && dayX >= ph.lo && dayX <= ph.hi;
                  const done = dayX != null && dayX > ph.hi;
                  return (
                    <GlassPanel key={ph.w} style={{ padding: "14px 15px", ...(active ? { borderColor: "var(--amber)", background: "rgba(245,133,63,.06)" } : {}) }}>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 9.5, letterSpacing: ".1em", textTransform: "uppercase", color: active ? "var(--amber-lite)" : "var(--faint)" }}>{ph.w}</div>
                      <div style={{ fontFamily: "var(--serif)", fontSize: 17, marginTop: 6 }}>{ph.t}</div>
                      <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 5, lineHeight: 1.4 }}>{ph.d}</div>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 9, marginTop: 8, color: active ? "var(--amber)" : done ? "var(--green)" : "var(--faint)" }}>
                        {active ? "● CURRENT" : done ? "✓ DONE" : "UPCOMING"}
                      </div>
                    </GlassPanel>
                  );
                })}
              </div>
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
