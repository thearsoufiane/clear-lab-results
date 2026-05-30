import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/logo";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/learn/a1c")({
  head: () => ({
    meta: [
      {
        title:
          "What Is Pre-Diabetic A1c? The Window Where Lifestyle Changes Actually Work | labread",
      },
      {
        name: "description",
        content:
          "Pre-diabetic A1c explained: what 5.7–6.4 actually means, why this is the critical window for change, and how to reverse it. Plain-English guide to blood sugar control.",
      },
      {
        property: "og:title",
        content: "What Is Pre-Diabetic A1c? The Window Where Changes Work",
      },
      {
        property: "og:description",
        content: "A1c 5.7–6.4 is not a diagnosis — it's a warning with an expiration date.",
      },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: "https://labread.health/learn/a1c" }],
  }),
  component: A1cPage,
});

const teal = "#3fd6c4";
const tealDim = "#2ba596";
const warm = "#f2c14e";
const inkSoft = "#9fb0b2";
const inkFaint = "#61716f";
const panel = "#131c21";
const bgSoft = "#0f161a";
const line = "rgba(238, 243, 242, 0.09)";

function A1cPage() {
  return (
    <div className="min-h-screen" style={{ background: "#0a0f12" }}>
      <header className="border-b" style={{ borderColor: line }}>
        <div className="max-w-[720px] mx-auto px-7 py-5 flex items-center justify-between">
          <Link to="/" className="no-underline">
            <Logo />
          </Link>
          <Link
            to="/auth"
            search={{ mode: "signup" }}
            className="text-sm font-semibold no-underline rounded-lg px-4 py-2 transition-colors"
            style={{ color: teal, border: `1px solid rgba(63,214,196,0.35)` }}
          >
            Explain my results <ArrowRight size={14} className="inline ml-1" />
          </Link>
        </div>
      </header>

      <article className="max-w-[720px] mx-auto px-7 pt-14 pb-10">
        <div className="text-xs uppercase tracking-[0.16em] mb-5" style={{ color: tealDim }}>
          Learn &middot; Blood Sugar
        </div>

        <h1
          className="font-serif leading-[1.08] tracking-tight mb-6"
          style={{ fontSize: "clamp(2.1rem, 6vw, 3.1rem)" }}
        >
          What Is Pre-Diabetic A1c? The Window Where Changes Actually Work
        </h1>

        <p className="text-lg leading-relaxed mb-4" style={{ color: "#eef3f2" }}>
          <strong className="font-semibold text-white">
            An A1c of 5.7-6.4% isn't a diabetes diagnosis — it's an urgent
            message with an expiration date.
          </strong>{" "}
          This is the window where lifestyle changes <em>actually work</em>,
          where you can still reverse the trajectory. Most people get told
          they're "prediabetic" and do nothing. That's the mistake.
        </p>
        <p className="text-lg leading-relaxed mb-4" style={{ color: "#eef3f2" }}>
          Here's what A1c actually means, why the prediabetic range is critical,
          and what changes actually move the needle.
        </p>

        <div
          className="text-sm pb-7 mb-10 border-b"
          style={{ color: inkFaint, borderColor: line }}
        >
          Plain-English guide &middot; reviewed for accuracy &middot; not a
          substitute for medical advice
        </div>

        <SectionHeading>What A1c measures</SectionHeading>
        <P>
          <B>
            A1c (hemoglobin A1c) is the percentage of your red blood cells coated
            with glucose — a measure of your average blood sugar over the past
            2-3 months.
          </B>{" "}
          Unlike a fasting glucose test (which shows your blood sugar{" "}
          <em>right now</em>), A1c shows your trend, which is far more
          informative.
        </P>
        <P>
          Think of it this way: fasting glucose is a snapshot; A1c is a movie.
          A1c tells you how often your blood sugar has been elevated over months,
          which is what actually damages your vessels and increases disease risk.
        </P>

        <SectionHeading>The ranges that matter</SectionHeading>
        <div
          className="rounded-[14px] overflow-hidden my-6"
          style={{ background: panel, border: `1px solid ${line}` }}
        >
          <TableRow head>
            <Cell head>A1c range (%)</Cell>
            <Cell head>What it means</Cell>
            <Cell head>Time window</Cell>
          </TableRow>
          <TableRow>
            <Cell label>Below 5.7</Cell>
            <Cell opt>Normal blood sugar</Cell>
            <Cell muted>You're good</Cell>
          </TableRow>
          <TableRow>
            <Cell label>5.7-6.4</Cell>
            <Cell opt>Prediabetic</Cell>
            <Cell opt>Reversible window</Cell>
          </TableRow>
          <TableRow last>
            <Cell label>6.5+</Cell>
            <Cell muted>Diabetic range</Cell>
            <Cell muted>Diagnosis; harder to reverse</Cell>
          </TableRow>
        </div>

        <Callout>
          <strong style={{ color: warm }}>The critical thing:</strong> between
          5.7 and 6.4, your damage is minimal and almost completely reversible
          with lifestyle change. Once you hit 6.5, you have a diabetes diagnosis,
          and reversing it gets{" "}
          <strong className="text-white">much harder (though still possible).</strong>{" "}
          The prediabetic zone is your window of opportunity.
        </Callout>

        <SectionHeading>
          Why most people ignore the prediabetic warning
        </SectionHeading>
        <P>
          People get told "you're prediabetic" and hear it as "not as bad as
          diabetes." So they do nothing. But the data is clear: if your A1c is
          6.0 and you keep living the same way, within 3-5 years you'll likely
          hit 6.5 and have a diagnosis.
        </P>
        <P>
          The issue: unlike high cholesterol or high blood pressure, prediabetes
          has no symptoms. You feel fine. So there's no urgency. And most doctors
          don't aggressively counsel on reversal — they wait until you're
          diabetic, then prescribe medication.
        </P>
        <P>
          <B>This is backwards.</B> The prediabetic window is where you actually
          have leverage to change the trajectory.
        </P>

        <SectionHeading>
          What actually drives A1c up (and how to reverse it)
        </SectionHeading>
        <P>A1c rises when your blood sugar is chronically elevated. The causes:</P>
        <BulletList
          items={[
            <>
              <B>Refined carbohydrates and sugar</B> — bread, pasta, juice,
              desserts, processed foods. The biggest driver for most people.
            </>,
            <>
              <B>Lack of movement</B> — muscle uses glucose; sedentary life means
              glucose stays in blood longer.
            </>,
            <>
              <B>Chronic stress</B> — cortisol raises baseline blood sugar.
            </>,
            <>
              <B>Poor sleep</B> — sleep deprivation impairs glucose handling.
            </>,
            <>
              <B>Excess weight</B> — especially abdominal fat, which drives
              insulin resistance.
            </>,
          ]}
        />
        <P>
          To reverse it, you're doing the opposite:{" "}
          <B>
            fewer refined carbs, more movement, better sleep, stress management,
            and weight loss if needed.
          </B>{" "}
          Studies show that even moderate lifestyle change can drop A1c by 1-2% —
          enough to take you from 6.0 down to 4.8-5.0.
        </P>

        <SectionHeading>What to ask your doctor</SectionHeading>
        <P>
          If your A1c is in the prediabetic range, ask:{" "}
          <B>"What's my fasting glucose and 2-hour glucose after a meal?"</B>{" "}
          These give you more detail about <em>when</em> your blood sugar is
          spiking, which helps you target the fix. Also ask about checking lipids
          and inflammation, since prediabetes often comes with high triglycerides
          and elevated CRP.
        </P>
        <P>
          Then, ask for a referral to a dietitian or lifestyle program. You don't
          need medication yet — you need a plan to move the dial back.
        </P>

        <SectionHeading>The timeline for reversal</SectionHeading>
        <P>
          A1c takes 2-3 months to shift meaningfully because it's an average over
          that time. So:
        </P>
        <BulletList
          items={[
            "Make changes now",
            "Retest in 3 months",
            "If you've moved the needle (even 0.2-0.3%), keep going",
            "By 6 months of consistent lifestyle change, most people see 0.5-1.5% drops",
          ]}
        />
        <P>
          The point: you have data-driven feedback on whether your changes are
          working. Most people never test again, so they don't know if they're
          making progress. Don't be that person.
        </P>

        <CtaBox />

        <RelatedGrid
          items={[
            { href: "/learn/ferritin", q: "What does low ferritin mean?", a: "Iron deficiency explained" },
            { href: "/learn/vitamin-d", q: "Vitamin D deficiency", a: 'Why "normal" misses the problem' },
            { href: "/learn/tsh-thyroid", q: "TSH normal but tired?", a: "The incomplete thyroid picture" },
            { href: "/learn/crp", q: "What does high CRP mean?", a: "The inflammation marker most people miss" },
          ]}
        />

        <Disclaimer>
          This guide is for general education only and is not medical advice,
          diagnosis, or treatment. A1c interpretation and treatment
          recommendations should come from a qualified healthcare professional
          who understands your full health picture.
        </Disclaimer>

        <LearnFooter />
      </article>
    </div>
  );
}

/* ── Shared editorial primitives (mirrors the other /learn pages) ── */

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-serif leading-[1.15] tracking-tight mt-12 mb-4"
      style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)" }}
    >
      {children}
    </h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="leading-relaxed mb-4" style={{ color: inkSoft, fontSize: "1.06rem" }}>
      {children}
    </p>
  );
}

function B({ children }: { children: React.ReactNode }) {
  return (
    <strong className="font-semibold" style={{ color: "#eef3f2" }}>
      {children}
    </strong>
  );
}

function BulletList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="list-none mb-5 space-y-0">
      {items.map((node, i) => (
        <li key={i} className="relative pl-7 py-2" style={{ color: inkSoft, fontSize: "1.06rem" }}>
          <span
            className="absolute left-1 top-[14px] w-[7px] h-[7px] rounded-full"
            style={{ background: teal }}
          />
          {node}
        </li>
      ))}
    </ul>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-5 my-7"
      style={{
        background: "rgba(242,193,78,0.07)",
        border: "1px solid rgba(242,193,78,0.28)",
      }}
    >
      <p className="text-sm leading-relaxed m-0" style={{ color: "#eef3f2" }}>
        {children}
      </p>
    </div>
  );
}

function CtaBox() {
  return (
    <div
      className="rounded-2xl p-8 my-12 text-center"
      style={{
        background: "linear-gradient(150deg, rgba(63,214,196,0.10), rgba(63,214,196,0.03))",
        border: "1px solid rgba(63,214,196,0.3)",
      }}
    >
      <h3 className="font-serif text-2xl mb-2" style={{ color: "#eef3f2" }}>
        Want your whole panel explained like this?
      </h3>
      <p className="mb-5" style={{ color: inkSoft, fontSize: "1.02rem" }}>
        Upload your blood test and get every value in plain English — what's
        normal, what's not, and what to ask your doctor. Takes about 30 seconds.
      </p>
      <Link
        to="/auth"
        search={{ mode: "signup" }}
        className="inline-block font-bold text-base no-underline rounded-xl px-8 py-4 transition-colors"
        style={{ background: teal, color: "#04100e" }}
      >
        Explain my results — free <ArrowRight size={15} className="inline ml-1" />
      </Link>
      <p className="text-xs mt-3" style={{ color: inkFaint }}>
        No signup required &middot; your data is processed and not stored
      </p>
    </div>
  );
}

function RelatedGrid({ items }: { items: { href: string; q: string; a: string }[] }) {
  return (
    <div className="border-t pt-9 mt-12" style={{ borderColor: line }}>
      <h2
        className="font-serif tracking-tight mb-5"
        style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)" }}
      >
        Keep reading
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="no-underline rounded-xl p-5 block transition-colors"
            style={{ background: bgSoft, border: `1px solid ${line}` }}
          >
            <span className="font-semibold block mb-1" style={{ color: "#eef3f2", fontSize: "1.02rem" }}>
              {item.q}
            </span>
            <span className="text-sm" style={{ color: inkFaint }}>
              {item.a}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

function Disclaimer({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-5 mt-11"
      style={{ background: bgSoft, border: `1px solid ${line}` }}
    >
      <p className="text-sm leading-relaxed m-0" style={{ color: inkFaint }}>
        {children}
      </p>
    </div>
  );
}

function LearnFooter() {
  return (
    <footer className="border-t mt-12 pt-7 pb-12 text-center" style={{ borderColor: line }}>
      <p className="text-sm m-0" style={{ color: inkFaint }}>
        &copy; {new Date().getFullYear()}{" "}
        <Link to="/" className="no-underline" style={{ color: teal }}>
          labread.health
        </Link>{" "}
        &middot; Understand your bloodwork in plain English
      </p>
    </footer>
  );
}

/* ── Table components ── */

function TableRow({
  head,
  last,
  children,
}: {
  head?: boolean;
  last?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-[1.3fr_1fr_1fr]"
      style={{
        borderBottom: last ? "none" : `1px solid ${line}`,
        background: head ? "rgba(63,214,196,0.06)" : "transparent",
      }}
    >
      {children}
    </div>
  );
}

function Cell({
  children,
  label,
  muted,
  head,
  opt,
}: {
  children?: React.ReactNode;
  label?: boolean;
  muted?: boolean;
  head?: boolean;
  opt?: boolean;
}) {
  const color = opt ? teal : label ? "#eef3f2" : muted ? inkSoft : "#eef3f2";
  const weight = label || opt ? 600 : head ? 700 : 400;
  const fontSize = head ? "0.86rem" : "0.96rem";
  return (
    <div
      className="px-4 py-3.5 text-sm sm:border-r last:border-r-0"
      style={{
        color,
        fontWeight: weight,
        fontSize,
        borderColor: line,
        letterSpacing: head ? "0.02em" : undefined,
        textTransform: head ? "uppercase" : undefined,
      }}
    >
      {opt ? <span style={{ color: teal, fontWeight: 600 }}>{children}</span> : children}
    </div>
  );
}
