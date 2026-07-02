import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useActiveMember } from "@/contexts/active-member";
import { supabase } from "@/lib/supabase";
import { LivingGlow, GlassCard, EmberButton, Eyebrow, FieldRow, Pill } from "@/components/lr";

export const Route = createFileRoute("/onboarding/about-you")({
  head: () => ({ meta: [{ title: "A little about you | labread.health" }, { name: "robots", content: "noindex" }] }),
  component: AboutYouStep,
});

const GOALS = [
  { key: "energy", label: "Energy ⚡" }, { key: "sleep", label: "Sleep 🌙" }, { key: "iron", label: "Iron 🩸" },
  { key: "heart", label: "Heart ♥" }, { key: "hormones", label: "Hormones ◐" }, { key: "longevity", label: "Longevity ✦" },
];

const bareInput: React.CSSProperties = {
  width: "100%", background: "transparent", border: "none", outline: "none", color: "var(--bone)",
  fontSize: 12, fontWeight: 600, fontFamily: "var(--sans)", padding: 0,
};

function AboutYouStep() {
  const { user, loading } = useAuth();
  const { activeMember, activeMemberId, reload } = useActiveMember();
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState<"male" | "female" | "">("");
  const [goals, setGoals] = useState<Set<string>>(new Set(["energy", "iron"]));
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (!loading && !user) nav({ to: "/auth" }); }, [user, loading]);
  useEffect(() => {
    if (activeMember) {
      setName(activeMember.name ?? "");
      setAge(activeMember.age != null ? String(activeMember.age) : "");
      setSex((activeMember.sex as "male" | "female") ?? "");
    }
  }, [activeMember]);

  if (loading || !user) return null;

  const toggleGoal = (k: string) => setGoals((g) => { const n = new Set(g); n.has(k) ? n.delete(k) : n.add(k); return n; });

  async function save() {
    setBusy(true);
    const ageNum = age ? parseInt(age, 10) : null;
    try {
      if (activeMemberId) {
        await supabase.from("members").update({ name: name.trim() || "Me", age: ageNum, sex: sex || null }).eq("id", activeMemberId);
      }
      if (user) {
        // profiles carries the account-level range inputs + goals (as conditions).
        await supabase.from("profiles").upsert(
          { user_id: user.id, age: ageNum, sex: sex || null, conditions: { goals: [...goals] } },
          { onConflict: "user_id" },
        );
      }
      await reload();
    } catch { /* keep the flow moving even if a write fails (e.g. dev seed) */ }
    nav({ to: "/dashboard" });
  }

  return (
    <div style={{ minHeight: "100dvh", background: "var(--void)", color: "var(--bone)", fontFamily: "var(--sans)" }}>
      <LivingGlow intensity="hero" />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 440, margin: "0 auto", minHeight: "100dvh", display: "flex", flexDirection: "column", padding: "calc(env(safe-area-inset-top) + 28px) 20px 28px" }}>
        <Eyebrow bracket>step 3 of 3</Eyebrow>
        <h1 style={{ fontFamily: "var(--serif)", fontWeight: 500, fontSize: 28, lineHeight: 1.05, marginTop: 8 }}>A little<br />about you</h1>
        <div style={{ marginTop: 6 }}><Eyebrow>this sharpens every range we show you</Eyebrow></div>

        <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 14 }}>
          <FieldRow label="name">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" style={bareInput} />
          </FieldRow>
          <FieldRow label="age">
            <input value={age} onChange={(e) => setAge(e.target.value.replace(/[^\d]/g, ""))} placeholder="—" inputMode="numeric" style={bareInput} />
          </FieldRow>

          <div style={{ padding: "12px 13px", background: "var(--glass)", border: "1px solid var(--line)", borderRadius: 14, backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}>
            <Eyebrow>biological sex</Eyebrow>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <Pill as="button" active={sex === "male"} onClick={() => setSex("male")}>Male</Pill>
              <Pill as="button" active={sex === "female"} onClick={() => setSex("female")}>Female</Pill>
            </div>
          </div>
        </div>

        <div style={{ margin: "14px 0 8px" }}><Eyebrow>what matters to you?</Eyebrow></div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {GOALS.map((g) => (
            <Pill as="button" key={g.key} active={goals.has(g.key)} onClick={() => toggleGoal(g.key)}>{g.label}</Pill>
          ))}
        </div>

        <EmberButton style={{ marginTop: "auto", width: "100%" }} onClick={save} disabled={busy}>
          {busy ? "Setting up…" : "Meet your results →"}
        </EmberButton>
      </div>
    </div>
  );
}
