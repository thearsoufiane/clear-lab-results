import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/logo";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/learn/vitamin-d")({
  head: () => ({
    meta: [
      {
        title: "Vitamin D Deficiency: What Low Levels Actually Mean | labread",
      },
      {
        name: "description",
        content:
          "Low vitamin D explained in plain English: what the number means, why 'normal' labs miss deficiency, symptoms, causes, and what to ask your doctor. Free guide.",
      },
      {
        property: "og:title",
        content: "Vitamin D Deficiency: What Low Levels Actually Mean",
      },
      {
        property: "og:description",
        content:
          "Why you can have 'normal' vitamin D and still feel exhausted, depressed, and weak — and what to do about it.",
      },
      { property: "og:type", content: "article" },
    ],
    links: [
      { rel: "canonical", href: "https://labread.health/learn/vitamin-d" },
    ],
  }),
  component: VitaminDPage,
});

/* ── teal accent colour used throughout this editorial page ── */
const teal = "#3fd6c4";
const tealDim = "#2ba596";
const warm = "#f2c14e";
const inkSoft = "#9fb0b2";
const inkFaint = "#61716f";
const panel = "#131c21";
const bgSoft = "#0f161a";
const line = "rgba(238, 243, 242, 0.09)";

function VitaminDPage() {
  return (
    <div className="min-h-screen" style={{ background: "#0a0f12" }}>
      {/* ── Top bar ── */}
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

      {/* ── Article ── */}
      <article className="max-w-[720px] mx-auto px-7 pt-14 pb-10">
        {/* Breadcrumb */}
        <div
          className="text-xs uppercase tracking-[0.16em] mb-5"
          style={{ color: tealDim }}
        >
          Learn &middot; Vitamin D
        </div>

        {/* Title */}
        <h1
          className="font-serif leading-[1.08] tracking-tight mb-6"
          style={{ fontSize: "clamp(2.1rem, 6vw, 3.1rem)" }}
        >
          Vitamin D Deficiency: What Low Levels Actually Mean
        </h1>

        {/* Lede */}
        <p className="text-lg leading-relaxed mb-4" style={{ color: "#eef3f2" }}>
          <strong className="font-semibold text-white">
            Vitamin D is the hormone that governs mood, bone strength, immune
            function, and inflammation.
          </strong>{" "}
          When levels are low, the effects ripple through your entire body —
          fatigue, depression, weak bones, and slow recovery from illness are
          the most common complaints.
        </p>
        <p className="text-lg leading-relaxed mb-4" style={{ color: "#eef3f2" }}>
          Yet most people who feel these things get told their vitamin D is
          "normal." Here's what the number actually means — and why "normal"
          often misses the problem.
        </p>

        {/* Updated line */}
        <div
          className="text-sm pb-7 mb-10 border-b"
          style={{ color: inkFaint, borderColor: line }}
        >
          Plain-English guide &middot; reviewed for accuracy &middot; not a
          substitute for medical advice
        </div>

        {/* ── Section: What vitamin D does ── */}
        <SectionHeading>What vitamin D actually does</SectionHeading>
        <P>
          Vitamin D isn't just about bone health (though that's part of it). It
          regulates{" "}
          <B>
            immune function, mood, inflammation, and how your cells respond to
            stress.
          </B>{" "}
          Most of your tissues have vitamin D receptors, so when levels fall
          short, the effects show up almost everywhere — mood takes a hit,
          infections linger longer, and general fatigue sets in.
        </P>
        <P>
          The challenge: vitamin D status isn't obvious from the outside. People
          can have critically low levels and still look and act "fine" until
          symptoms pile up enough to notice. By then, the deficiency has usually
          been building for months.
        </P>

        {/* ── Section: Normal vs optimal ── */}
        <SectionHeading>
          "Normal" vs "optimal": the gap nobody talks about
        </SectionHeading>
        <P>
          This is the same issue as with ferritin and most other biomarkers.
          Lab reference ranges are set wide, and "normal" means "not yet a
          diagnosed disease" — not "optimal for feeling well." For vitamin D
          especially, the gap between lab-normal and clinically-optimal is huge.
        </P>

        {/* Table */}
        <div
          className="rounded-[14px] overflow-hidden my-6"
          style={{ background: panel, border: `1px solid ${line}` }}
        >
          <TableRow head>
            <Cell head>Vitamin D level (ng/mL)</Cell>
            <Cell head>Typical lab label</Cell>
            <Cell head>What clinicians often note</Cell>
          </TableRow>
          <TableRow>
            <Cell label>Under 20</Cell>
            <Cell muted>Deficient</Cell>
            <Cell muted>Clearly problematic</Cell>
          </TableRow>
          <TableRow>
            <Cell label>20-29</Cell>
            <Cell muted>"Insufficient"</Cell>
            <Cell muted>Symptoms likely</Cell>
          </TableRow>
          <TableRow>
            <Cell label>30-50</Cell>
            <Cell muted>"Normal"</Cell>
            <Cell opt>Symptoms still common</Cell>
          </TableRow>
          <TableRow last>
            <Cell label>50-80+</Cell>
            <Cell muted>"Normal"</Cell>
            <Cell opt>Where most people feel best</Cell>
          </TableRow>
        </div>

        {/* Callout */}
        <div
          className="rounded-xl p-5 my-7"
          style={{
            background: "rgba(242,193,78,0.07)",
            border: "1px solid rgba(242,193,78,0.28)",
          }}
        >
          <p className="text-sm leading-relaxed m-0" style={{ color: "#eef3f2" }}>
            <strong style={{ color: warm }}>Important:</strong> vitamin D
            reference ranges vary slightly by lab, and optimal levels are still
            debated among clinicians. These numbers reflect a clinical view
            that's <strong className="text-white">widely used but not absolute.</strong>{" "}
            The key is tracking <em>your</em> number and how you feel at
            different levels.
          </p>
        </div>

        {/* ── Section: Why you feel terrible ── */}
        <SectionHeading>
          Why you can feel terrible with "normal" vitamin D
        </SectionHeading>
        <P>
          Vitamin D deficiency doesn't announce itself loudly. Instead, it
          creeps up as a constellation of vague symptoms that most people chalk
          up to aging, stress, or just life:
        </P>

        {/* Symptom chips */}
        <div className="flex flex-wrap gap-2.5 my-2 mb-6">
          {[
            "Persistent fatigue",
            "Depression or low mood",
            "Muscle aches",
            "Slow wound healing",
            "Frequent infections",
            "Poor exercise tolerance",
            "Bone pain",
            "Impaired focus",
          ].map((s) => (
            <span
              key={s}
              className="rounded-full px-4 py-2 text-sm"
              style={{
                background: bgSoft,
                border: `1px solid ${line}`,
                color: "#eef3f2",
              }}
            >
              {s}
            </span>
          ))}
        </div>

        <P>
          If that list feels familiar and your bloodwork came back "normal,"
          it's worth asking specifically for your <B>vitamin D number</B> — not
          just whether you're flagged as deficient.
        </P>

        {/* ── Section: Why so many are low ── */}
        <SectionHeading>Why so many people are low</SectionHeading>
        <BulletList
          items={[
            [
              "Limited sun exposure",
              " — your skin makes vitamin D from UVB sunlight, which means winter, indoor work, and sunscreen all reduce production.",
            ],
            [
              "Geography",
              " — people above ~40° latitude (most of North America and Europe) can't produce meaningful vitamin D from the sun half the year.",
            ],
            [
              "Darker skin",
              " — higher melanin reduces vitamin D synthesis from sunlight (which is why deficiency is more common in people with darker skin, especially those at northern latitudes).",
            ],
            [
              "Diet",
              " — very few foods naturally contain vitamin D; it's mostly in fatty fish, egg yolks, and mushrooms exposed to sunlight.",
            ],
            [
              "Absorption problems",
              " — conditions like celiac disease or Crohn's can block vitamin D absorption even if intake is adequate.",
            ],
          ]}
        />

        {/* ── Section: What to ask ── */}
        <SectionHeading>What to ask your doctor</SectionHeading>
        <P>
          If your vitamin D is in the "normal" range but you have symptoms, a
          useful question is:{" "}
          <B>"What's my actual number, and would you recommend supplementing?"</B>{" "}
          Some clinicians will proactively suggest it; many wait for you to ask.
        </P>
        <P>If you do supplement, a few things matter:</P>
        <BulletList
          items={[
            [
              "Form",
              " — vitamin D3 (cholecalciferol) is generally more effective than D2 (ergocalciferol).",
            ],
            [
              "Dose",
              " — typical supplementation ranges from 1,000-4,000 IU daily for maintenance; correcting a deficiency often needs more.",
            ],
            [
              "Retest",
              " — vitamin D takes 8-12 weeks to shift meaningfully, so retest after that window to see if you've corrected it.",
            ],
            [
              "Context",
              " — vitamin D works best with adequate calcium, magnesium, and K2, though the science on this is still evolving.",
            ],
          ]}
        />

        {/* ── Section: Too much ── */}
        <SectionHeading>
          One important note: too much vitamin D is also a problem
        </SectionHeading>
        <P>
          While deficiency is far more common, it's possible to get too much
          vitamin D, especially from supplements. Very high levels (over 100
          ng/mL) can cause toxicity. This is why supplementing makes sense only
          after testing, not preemptively — you want to know where you actually
          are.
        </P>

        {/* ── CTA Box ── */}
        <div
          className="rounded-2xl p-8 my-12 text-center"
          style={{
            background:
              "linear-gradient(150deg, rgba(63,214,196,0.10), rgba(63,214,196,0.03))",
            border: "1px solid rgba(63,214,196,0.3)",
          }}
        >
          <h3 className="font-serif text-2xl mb-2" style={{ color: "#eef3f2" }}>
            Want your whole panel explained like this?
          </h3>
          <p className="mb-5" style={{ color: inkSoft, fontSize: "1.02rem" }}>
            Upload your blood test and get every value in plain English — what's
            normal, what's not, and what to ask your doctor. Takes about 30
            seconds.
          </p>
          <Link
            to="/auth"
            search={{ mode: "signup" }}
            className="inline-block font-bold text-base no-underline rounded-xl px-8 py-4 transition-colors"
            style={{ background: teal, color: "#04100e" }}
          >
            Explain my results — free{" "}
            <ArrowRight size={15} className="inline ml-1" />
          </Link>
          <p className="text-xs mt-3" style={{ color: inkFaint }}>
            No signup required &middot; your data is processed and not stored
          </p>
        </div>

        {/* ── Related articles ── */}
        <div className="border-t pt-9 mt-12" style={{ borderColor: line }}>
          <h2
            className="font-serif tracking-tight mb-5"
            style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)" }}
          >
            Keep reading
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                href: "/learn/ferritin",
                q: "What does low ferritin mean?",
                a: "Iron deficiency explained",
              },
              {
                href: "/learn/tsh-thyroid",
                q: "TSH normal but still tired?",
                a: "Why one thyroid number isn't the whole story",
              },
              {
                href: "/learn/crp",
                q: "What does high CRP mean?",
                a: "The quiet inflammation marker",
              },
              {
                href: "/learn/a1c",
                q: "What is a pre-diabetic A1c?",
                a: "The window where changes matter most",
              },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="no-underline rounded-xl p-5 block transition-colors"
                style={{ background: bgSoft, border: `1px solid ${line}` }}
              >
                <span
                  className="font-semibold block mb-1"
                  style={{ color: "#eef3f2", fontSize: "1.02rem" }}
                >
                  {item.q}
                </span>
                <span className="text-sm" style={{ color: inkFaint }}>
                  {item.a}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* ── Disclaimer ── */}
        <div
          className="rounded-xl p-5 mt-11"
          style={{ background: bgSoft, border: `1px solid ${line}` }}
        >
          <p className="text-sm leading-relaxed m-0" style={{ color: inkFaint }}>
            This guide is for general education only and is not medical advice,
            diagnosis, or treatment. Vitamin D levels and their meaning vary
            between people. Always discuss your results and any symptoms with a
            qualified healthcare professional before starting supplements or
            making other changes.
          </p>
        </div>

        {/* ── Footer ── */}
        <footer
          className="border-t mt-12 pt-7 pb-12 text-center"
          style={{ borderColor: line }}
        >
          <p className="text-sm m-0" style={{ color: inkFaint }}>
            &copy; {new Date().getFullYear()}{" "}
            <Link to="/" className="no-underline" style={{ color: teal }}>
              labread.health
            </Link>{" "}
            &middot; Understand your bloodwork in plain English
          </p>
        </footer>
      </article>
    </div>
  );
}

/* ── Tiny helper components for the editorial layout ── */

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
    <p
      className="leading-relaxed mb-4"
      style={{ color: inkSoft, fontSize: "1.06rem" }}
    >
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

function BulletList({ items }: { items: [string, string][] }) {
  return (
    <ul className="list-none mb-5 space-y-0">
      {items.map(([bold, rest]) => (
        <li
          key={bold}
          className="relative pl-7 py-2"
          style={{ color: inkSoft, fontSize: "1.06rem" }}
        >
          <span
            className="absolute left-1 top-[14px] w-[7px] h-[7px] rounded-full"
            style={{ background: teal }}
          />
          <strong className="font-semibold" style={{ color: "#eef3f2" }}>
            {bold}
          </strong>
          {rest}
        </li>
      ))}
    </ul>
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
      {opt ? (
        <span style={{ color: teal, fontWeight: 600 }}>{children}</span>
      ) : (
        children
      )}
    </div>
  );
}
