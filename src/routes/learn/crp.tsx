import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/logo";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/learn/crp")({
  head: () => ({
    meta: [
      {
        title:
          "What Does High CRP Mean? The Inflammation Marker Most People Miss | labread",
      },
      {
        name: "description",
        content:
          "High CRP explained: what chronic inflammation actually means, why it matters more than you think, and what to do about it. Plain-English guide to C-reactive protein.",
      },
      {
        property: "og:title",
        content: "What Does High CRP Mean? The Inflammation Marker Most People Miss",
      },
      {
        property: "og:description",
        content:
          "CRP is the inflammation marker that predicts disease — and most people have never heard of it.",
      },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: "https://labread.health/learn/crp" }],
  }),
  component: CrpPage,
});

const teal = "#3fd6c4";
const tealDim = "#2ba596";
const warm = "#f2c14e";
const inkSoft = "#9fb0b2";
const inkFaint = "#61716f";
const panel = "#131c21";
const bgSoft = "#0f161a";
const line = "rgba(238, 243, 242, 0.09)";

function CrpPage() {
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
          Learn &middot; Inflammation
        </div>

        <h1
          className="font-serif leading-[1.08] tracking-tight mb-6"
          style={{ fontSize: "clamp(2.1rem, 6vw, 3.1rem)" }}
        >
          What Does High CRP Mean? The Inflammation Marker Most People Miss
        </h1>

        <p className="text-lg leading-relaxed mb-4" style={{ color: "#eef3f2" }}>
          <strong className="font-semibold text-white">
            CRP (C-reactive protein) measures chronic inflammation — a quiet
            fire running in your body that predicts heart disease, stroke,
            diabetes, and autoimmune problems years before symptoms show.
          </strong>{" "}
          Yet most people have never heard of it, and most doctors don't order
          it.
        </p>
        <p className="text-lg leading-relaxed mb-4" style={{ color: "#eef3f2" }}>
          That's a gap you need to know about. Here's what CRP actually
          measures, why it matters more than most markers, and what to do if
          it's elevated.
        </p>

        <div
          className="text-sm pb-7 mb-10 border-b"
          style={{ color: inkFaint, borderColor: line }}
        >
          Plain-English guide &middot; reviewed for accuracy &middot; not a
          substitute for medical advice
        </div>

        <SectionHeading>What CRP measures (and why it's so useful)</SectionHeading>
        <P>
          <B>
            CRP is an inflammatory protein your liver makes in response to
            inflammation anywhere in your body.
          </B>{" "}
          Unlike blood sugar or cholesterol, CRP is agnostic — it rises when
          your body is inflamed, period. That inflammation could be from an
          infection, arthritis, a bad diet, chronic stress, poor sleep, obesity,
          or smoking.
        </P>
        <P>
          What makes CRP powerful: <B>it predicts future disease.</B> Studies
          show that high CRP correlates with heart attack and stroke risk{" "}
          <em>independent of cholesterol</em>. It predicts diabetes, Alzheimer's,
          and even certain cancers. And most people have no idea their CRP is
          high because they never get tested.
        </P>

        <SectionHeading>
          The normal range (and what "normal" actually means)
        </SectionHeading>
        <P>
          Standard lab ranges say CRP under 3.0 mg/L is "normal." But that range
          was set including sick and healthy people — it's not optimal, it's
          just "not acutely inflamed." Many cardiologists and longevity-focused
          doctors argue for a lower threshold:
        </P>

        <div
          className="rounded-[14px] overflow-hidden my-6"
          style={{ background: panel, border: `1px solid ${line}` }}
        >
          <TableRow head>
            <Cell head>CRP level (mg/L)</Cell>
            <Cell head>Typical label</Cell>
            <Cell head>Cardiovascular risk</Cell>
          </TableRow>
          <TableRow>
            <Cell label>Under 1.0</Cell>
            <Cell muted>Low</Cell>
            <Cell opt>Low risk</Cell>
          </TableRow>
          <TableRow>
            <Cell label>1.0-3.0</Cell>
            <Cell muted>"Normal"</Cell>
            <Cell muted>Moderate risk</Cell>
          </TableRow>
          <TableRow>
            <Cell label>3.0-10.0</Cell>
            <Cell muted>Elevated</Cell>
            <Cell muted>Higher risk</Cell>
          </TableRow>
          <TableRow last>
            <Cell label>Over 10</Cell>
            <Cell muted>High</Cell>
            <Cell muted>Significant risk</Cell>
          </TableRow>
        </div>

        <Callout>
          <strong style={{ color: warm }}>The nuance:</strong> CRP under 1.0 is
          what many cardiologists consider truly "optimal" for long-term health,
          though{" "}
          <strong className="text-white">this threshold is still being debated.</strong>{" "}
          For now, the key is knowing your actual number and understanding what's
          driving it if it's elevated.
        </Callout>

        <SectionHeading>
          What causes high CRP (and what to do about it)
        </SectionHeading>
        <P>CRP rises with almost any inflammatory state. The common culprits:</P>
        <BulletList
          items={[
            <>
              <B>Poor diet</B> — ultra-processed foods, refined carbs, seed oils.
              The single biggest driver for many people.
            </>,
            <>
              <B>Chronic stress and poor sleep</B> — inflammation is your body's
              stress response.
            </>,
            <>
              <B>Lack of movement</B> — sedentary life drives inflammation;
              exercise reduces it.
            </>,
            <>
              <B>Infection or autoimmune disease</B> — CRP rises while your body
              fights something.
            </>,
            <>
              <B>Obesity</B> — fat tissue produces inflammatory cytokines.
            </>,
            <>
              <B>Smoking</B> — major inflammatory trigger.
            </>,
          ]}
        />
        <P>
          The good news: CRP is{" "}
          <B>one of the most responsive markers to lifestyle change.</B> Diet,
          sleep, exercise, and stress management all lower it. Unlike genetics,
          you can actually move the needle here.
        </P>

        <SectionHeading>What to ask your doctor</SectionHeading>
        <P>
          Ask for <B>"high-sensitivity CRP" (hs-CRP)</B> — it's more precise than
          standard CRP. Many doctors will order it once you ask. If your CRP is
          elevated and you want to understand why, the conversation then shifts
          to ruling out acute infection (which your doctor will do) and
          addressing chronic lifestyle factors (which is mostly on you).
        </P>
        <P>
          If your CRP is persistently elevated despite lifestyle changes, your
          doctor may investigate for underlying autoimmune or inflammatory
          conditions.
        </P>

        <SectionHeading>Why so few people know about CRP</SectionHeading>
        <P>
          CRP isn't part of standard bloodwork — you have to specifically request
          it. And most doctors don't routine order it because standard medicine
          focuses on acute illness, not prevention. You have to be the one who
          knows it matters.
        </P>

        <CtaBox />

        <RelatedGrid
          items={[
            { href: "/learn/ferritin", q: "What does low ferritin mean?", a: "Iron deficiency explained" },
            { href: "/learn/vitamin-d", q: "Vitamin D deficiency", a: 'Why "normal" misses the problem' },
            { href: "/learn/tsh-thyroid", q: "TSH normal but tired?", a: "The incomplete thyroid picture" },
            { href: "/learn/a1c", q: "What is pre-diabetic A1c?", a: "The window where changes matter most" },
          ]}
        />

        <Disclaimer>
          This guide is for general education only and is not medical advice,
          diagnosis, or treatment. CRP should be interpreted in context with
          other markers and your health history. Always discuss your results
          with a qualified healthcare professional before making changes based
          on this information.
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
