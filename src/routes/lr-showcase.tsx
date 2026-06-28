import { createFileRoute } from "@tanstack/react-router";
import {
  LivingGlow, GlassCard, Gauge, VitalityRing, AuroraChart, AnnaOrb,
  TabBar, Pill, EmberButton, Eyebrow, DayGrid, AnnaMessage, UserMessage, ThinkingDots, FieldRow,
} from "@/components/lr";

// DEV-ONLY visual harness for the lr/* primitives (Phase 1). Gated with the
// rest of the app behind the coming-soon worker entry; never linked in prod.
export const Route = createFileRoute("/lr-showcase")({
  head: () => ({ meta: [{ title: "lr primitives", name: "robots", content: "noindex" }] }),
  component: Showcase,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 26 }}>
      <Eyebrow bracket>{title}</Eyebrow>
      <div style={{ marginTop: 10 }}>{children}</div>
    </div>
  );
}

function Showcase() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--void)", color: "var(--bone)", fontFamily: "var(--sans)" }}>
      <LivingGlow intensity="hero" />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 420, margin: "0 auto", padding: "40px 20px 140px" }}>
        <Eyebrow color="var(--ember-glow)">labread · primitives</Eyebrow>
        <h1 style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: 40, lineHeight: 1, margin: "10px 0 0" }}>
          Biology as <em style={{ fontStyle: "italic", color: "var(--ember-hot)" }}>light.</em>
        </h1>

        <Section title="vitality ring + anna orb">
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <VitalityRing score={74} />
            <AnnaOrb size={92} />
          </div>
        </Section>

        <Section title="gauge — biomarker as light">
          <GlassCard>
            <Gauge value={38} unit="ng/mL" rangeLow={30} rangeHigh={120} status="optimal" label="OPTIMAL" size={220} />
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--mono)", fontSize: 8, color: "var(--whisper)", padding: "0 6px" }}>
              <span>15 low</span><span>30–120 optimal</span><span>200 high</span>
            </div>
          </GlassCard>
        </Section>

        <Section title="aurora ridges">
          <GlassCard>
            <AuroraChart
              series={[
                { name: "Ferritin", color: "#FF7A18", points: [22, 26, 30, 34, 38] },
                { name: "Vit D", color: "#FFB066", points: [24, 26, 29, 32, 44] },
                { name: "CRP", color: "#B23A0C", points: [1.2, 1.1, 1.0, 0.9, 0.8] },
              ]}
            />
          </GlassCard>
        </Section>

        <Section title="glass + pills + button">
          <GlassCard emphasis>
            <Eyebrow color="var(--ember-glow)">anna's read</Eyebrow>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap", margin: "10px 0" }}>
              <Pill>◴ Drained</Pill>
              <Pill active>◑ Steady</Pill>
              <Pill>◉ Charged</Pill>
            </div>
            <EmberButton style={{ width: "100%" }}>Meet your results →</EmberButton>
          </GlassCard>
        </Section>

        <Section title="day grid (challenge streak)">
          <GlassCard>
            <DayGrid total={21} current={14} />
          </GlassCard>
        </Section>

        <Section title="anna conversation">
          <GlassCard>
            <AnnaMessage>
              Your ferritin came back at 38. Three weeks ago you were at 22 — that's <em style={{ fontStyle: "italic", color: "var(--ember-hot)" }}>real movement.</em>
            </AnnaMessage>
            <UserMessage>is that good?</UserMessage>
            <ThinkingDots />
          </GlassCard>
        </Section>

        <Section title="field row">
          <FieldRow label="biological sex" chevron>Male</FieldRow>
        </Section>
      </div>

      <TabBar
        items={[
          { key: "home", label: "Home", icon: "◉", active: true },
          { key: "protocol", label: "Protocol", icon: "◈" },
          { key: "anna", label: "Anna", icon: "✦" },
          { key: "you", label: "You", icon: "◐" },
        ]}
      />
    </div>
  );
}
