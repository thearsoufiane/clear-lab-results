import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/logo";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/learn/tsh-thyroid")({
  head: () => ({
    meta: [
      { title: "TSH Normal But Still Tired? Here's What You're Missing | labread" },
      {
        name: "description",
        content:
          "Why TSH normal doesn't mean your thyroid is fine. Learn what Free T3, Free T4, and thyroid antibodies reveal — and why one number misses the whole story.",
      },
      {
        property: "og:title",
        content: "TSH Normal But Still Tired? Here's What You're Missing",
      },
      {
        property: "og:description",
        content: "The thyroid number most doctors rely on is hiding half the picture.",
      },
      { property: "og:type", content: "article" },
    ],
    links: [
      { rel: "canonical", href: "https://labread.health/learn/tsh-thyroid" },
    ],
  }),
  component: TshPage,
});

const teal = "#3fd6c4";
const tealDim = "#2ba596";
const warm = "#f2c14e";
const inkSoft = "#9fb0b2";
const inkFaint = "#61716f";
const panel = "#131c21";
const bgSoft = "#0f161a";
const line = "rgba(238, 243, 242, 0.09)";

function TshPage() {
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
          Learn &middot; Thyroid
        </div>

        <h1
          className="font-serif leading-[1.08] tracking-tight mb-6"
          style={{ fontSize: "clamp(2.1rem, 6vw, 3.1rem)" }}
        >
          TSH Normal But Still Tired? Here's What You're Missing
        </h1>

        <p className="text-lg leading-relaxed mb-4" style={{ color: "#eef3f2" }}>
          <strong className="font-semibold text-white">
            TSH is the most ordered thyroid test — and it's also the most
            incomplete picture of how your thyroid is actually working.
          </strong>{" "}
          Your doctor can look at TSH alone and declare you "fine," while you're
          still exhausted, cold, and struggling to lose weight.
        </p>
        <p className="text-lg leading-relaxed mb-4" style={{ color: "#eef3f2" }}>
          The reason: TSH is a signal from your pituitary, not a direct measure
          of the thyroid hormones actually circulating in your blood. Here's why
          that gap matters — and what tests you need to fill it.
        </p>

        <div
          className="text-sm pb-7 mb-10 border-b"
          style={{ color: inkFaint, borderColor: line }}
        >
          Plain-English guide &middot; reviewed for accuracy &middot; not a
          substitute for medical advice
        </div>

        <SectionHeading>What TSH actually measures</SectionHeading>
        <P>
          <B>
            TSH (thyroid-stimulating hormone) is made by your pituitary gland,
            not your thyroid.
          </B>{" "}
          It's a signal that tells your thyroid "make more hormones." When your
          actual thyroid hormones are high, TSH drops (negative feedback). When
          they're low, TSH rises to try to kick the thyroid into action.
        </P>
        <P>
          The catch: TSH can stay "normal" even when your actual thyroid
          hormones (T3 and T4) are low or out of balance. Your pituitary is
          still saying "you're fine," but your cells aren't getting the hormones
          they need.
        </P>

        <SectionHeading>
          The three thyroid numbers that matter (and why doctors miss them)
        </SectionHeading>
        <P>
          A complete thyroid picture includes four things. Most labs only order
          one:
        </P>
        <BulletList
          items={[
            <>
              <B>TSH</B> — the signal from your pituitary. Normal range:
              ~0.4-4.0 mIU/L, but many clinicians note symptoms below 2.
            </>,
            <>
              <B>Free T4</B> — the actual thyroid hormone available to your cells
              (the "free" part means not bound to proteins). Normal range varies
              widely by lab.
            </>,
            <>
              <B>Free T3</B> — the active hormone your cells actually use.
              Critically important, rarely tested.
            </>,
            <>
              <B>Thyroid antibodies</B> — TPO and thyroglobulin antibodies detect
              autoimmune thyroid disease (Hashimoto's / Graves'). Can explain why
              you feel bad even with "normal" hormones.
            </>,
          ]}
        />

        <div
          className="rounded-[14px] overflow-hidden my-6"
          style={{ background: panel, border: `1px solid ${line}` }}
        >
          <TableRow head>
            <Cell head>Test</Cell>
            <Cell head>What it tells you</Cell>
            <Cell head>Usually ordered?</Cell>
          </TableRow>
          <TableRow>
            <Cell label>TSH</Cell>
            <Cell muted>Pituitary signal</Cell>
            <Cell muted>Yes, always</Cell>
          </TableRow>
          <TableRow>
            <Cell label>Free T4</Cell>
            <Cell muted>Thyroid hormone output</Cell>
            <Cell opt>Sometimes</Cell>
          </TableRow>
          <TableRow>
            <Cell label>Free T3</Cell>
            <Cell muted>Active hormone in cells</Cell>
            <Cell opt>Rarely</Cell>
          </TableRow>
          <TableRow last>
            <Cell label>TPO antibodies</Cell>
            <Cell muted>Autoimmune thyroid</Cell>
            <Cell opt>Not routine</Cell>
          </TableRow>
        </div>

        <Callout>
          <strong style={{ color: warm }}>Why this matters:</strong> You can
          have a "normal" TSH while your Free T3 is low, your T4 is falling, and
          autoimmune antibodies are slowly destroying your thyroid. Clinicians
          who rely solely on TSH will miss all of this.
        </Callout>

        <SectionHeading>
          Why you can feel terrible with "normal" TSH
        </SectionHeading>
        <P>
          Hypothyroid symptoms show up even when TSH looks fine, because TSH is
          delayed in rising — your actual hormones can be falling for months
          before TSH reacts. Or, your Free T3 (the active hormone) is low while
          T4 is adequate — you're not converting efficiently. Or you have
          Hashimoto's antibodies silently attacking your thyroid.
        </P>
        <P>The constellation of symptoms is familiar:</P>
        <Chips
          items={[
            "Fatigue",
            "Cold hands & feet",
            "Brain fog",
            "Weight gain",
            "Dry skin",
            "Hair shedding",
            "Constipation",
            "Low mood",
          ]}
        />

        <SectionHeading>What to ask your doctor</SectionHeading>
        <P>
          If your TSH is "normal" but you have symptoms, ask directly:{" "}
          <B>
            "Can we test my Free T4, Free T3, and thyroid antibodies (TPO and
            thyroglobulin)?"
          </B>{" "}
          Many doctors will happily do it once you ask. Some will resist,
          claiming it's unnecessary — but it's standard in functional medicine
          and thyroid-specific care.
        </P>
        <P>Once you have those numbers:</P>
        <BulletList
          items={[
            <>
              Look for Free T3 in the <B>upper half</B> of the range (not just
              "in range").
            </>,
            <>
              Look for Free T4 similarly — upper half usually feels better than
              lower half.
            </>,
            <>
              Negative TPO antibodies is good; positive means autoimmune disease
              is present.
            </>,
          ]}
        />

        <SectionHeading>The conversion problem (T4 to T3)</SectionHeading>
        <P>
          Your thyroid makes mostly T4, which is inactive. Your body converts it
          to T3, the active hormone. If you're low in selenium, zinc, iron, or
          iodine — or if you're under chronic stress — this conversion fails. You
          can supplement T4 all day and still feel hypothyroid because your Free
          T3 stays low. This is why the full panel matters.
        </P>

        <CtaBox />

        <RelatedGrid
          items={[
            { href: "/learn/ferritin", q: "What does low ferritin mean?", a: "Iron deficiency explained" },
            { href: "/learn/vitamin-d", q: "Vitamin D deficiency explained", a: 'Why "normal" misses the problem' },
            { href: "/learn/crp", q: "What does high CRP mean?", a: "The quiet inflammation marker" },
            { href: "/learn/a1c", q: "What is pre-diabetic A1c?", a: "The window where changes matter most" },
          ]}
        />

        <Disclaimer>
          This guide is for general education only and is not medical advice,
          diagnosis, or treatment. Thyroid function and what constitutes
          "optimal" varies between people. Always discuss your results and
          symptoms with a qualified healthcare professional before making
          changes to medications or supplements.
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

function Chips({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2.5 my-2 mb-6">
      {items.map((s) => (
        <span
          key={s}
          className="rounded-full px-4 py-2 text-sm"
          style={{ background: bgSoft, border: `1px solid ${line}`, color: "#eef3f2" }}
        >
          {s}
        </span>
      ))}
    </div>
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
