import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/logo";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/learn/ferritin")({
  head: () => ({
    meta: [
      {
        title:
          "What Does Low Ferritin Mean? A Plain-English Guide to Your Iron Levels | labread",
      },
      {
        name: "description",
        content:
          "Low ferritin explained simply: what the number means, why you can feel exhausted with 'normal' labs, common causes, and what to ask your doctor. Free plain-English guide.",
      },
      {
        property: "og:title",
        content: "What Does Low Ferritin Mean? A Plain-English Guide",
      },
      {
        property: "og:description",
        content:
          "Why you can feel exhausted, foggy and cold even when your bloodwork reads 'normal' — and what to do about it.",
      },
      { property: "og:type", content: "article" },
    ],
    links: [
      { rel: "canonical", href: "https://labread.health/learn/ferritin" },
    ],
  }),
  component: FerritinPage,
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

function FerritinPage() {
  return (
    <div className="min-h-screen" style={{ background: "#0a0f12" }}>
      {/* ── Top bar ── */}
      <header
        className="border-b"
        style={{ borderColor: line }}
      >
        <div className="max-w-[720px] mx-auto px-7 py-5 flex items-center justify-between">
          <Link to="/" className="no-underline">
            <Logo />
          </Link>
          <Link
            to="/auth"
            search={{ mode: "signup" }}
            className="text-sm font-semibold no-underline rounded-lg px-4 py-2 transition-colors"
            style={{
              color: teal,
              border: `1px solid rgba(63,214,196,0.35)`,
            }}
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
          Learn &middot; Iron &amp; Ferritin
        </div>

        {/* Title */}
        <h1
          className="font-serif leading-[1.08] tracking-tight mb-6"
          style={{ fontSize: "clamp(2.1rem, 6vw, 3.1rem)" }}
        >
          What Does Low Ferritin Mean?
        </h1>

        {/* Lede */}
        <p className="text-lg leading-relaxed mb-4" style={{ color: "#eef3f2" }}>
          <strong className="font-semibold text-white">
            Ferritin is the protein that stores iron in your body — it's the
            single best measure of your iron reserves.
          </strong>{" "}
          When ferritin is low, your iron "tank" is running near empty, which
          can leave you exhausted, foggy, and cold long before a standard
          anemia test ever flags a problem.
        </p>
        <p className="text-lg leading-relaxed mb-4" style={{ color: "#eef3f2" }}>
          That's why so many people are told their bloodwork is "normal" while
          they still feel drained. Here's what the number actually means — and
          what to do about it.
        </p>

        {/* Updated line */}
        <div
          className="text-sm pb-7 mb-10 border-b"
          style={{ color: inkFaint, borderColor: line }}
        >
          Plain-English guide &middot; reviewed for accuracy &middot; not a
          substitute for medical advice
        </div>

        {/* ── Section: What ferritin measures ── */}
        <SectionHeading>What ferritin actually measures</SectionHeading>
        <P>
          Most blood tests measure the iron circulating in your blood right
          now. Ferritin is different: it measures your <B>stored</B> iron — the
          reserve your body draws on when intake falls short. Because the body
          empties these stores <em>before</em> levels in the blood drop,
          ferritin is usually the <B>first marker to fall</B> when you're
          heading toward iron deficiency, and the first to recover when you fix
          it.
        </P>
        <P>
          In practice, that makes a low ferritin one of the earliest warning
          signs that something's off — often while a standard CBC (the test
          used to diagnose anemia) still looks completely normal.
        </P>

        {/* ── Section: Normal vs optimal ── */}
        <SectionHeading>
          "Normal" vs "optimal": the gap that confuses everyone
        </SectionHeading>
        <P>
          Here's the part most people are never told. Lab reference ranges are
          wide, and the bottom of "normal" is set very low — low enough that
          you can technically pass the test while running on fumes. Many
          clinicians find that symptoms can appear at ferritin levels that a lab
          still marks as in-range.
        </P>

        {/* Table */}
        <div
          className="rounded-[14px] overflow-hidden my-6"
          style={{ background: panel, border: `1px solid ${line}` }}
        >
          <TableRow head>
            <Cell>Ferritin level (ng/mL)</Cell>
            <Cell>Typical lab label</Cell>
            <Cell>What many clinicians note</Cell>
          </TableRow>
          <TableRow>
            <Cell label>Under 15-30</Cell>
            <Cell muted>Flagged low</Cell>
            <Cell muted>Iron deficiency likely</Cell>
          </TableRow>
          <TableRow>
            <Cell label>30-50</Cell>
            <Cell muted>"Normal"</Cell>
            <Cell opt>Symptoms still common</Cell>
          </TableRow>
          <TableRow last>
            <Cell label>50-100+</Cell>
            <Cell muted>"Normal"</Cell>
            <Cell opt>Often where people feel best</Cell>
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
            <strong style={{ color: warm }}>Important:</strong> these figures
            are general orientation, not a diagnosis. Reference ranges vary by
            lab, and they differ by sex, age, pregnancy, and whether
            inflammation is present. The "optimal" thresholds above reflect a
            clinical view that's{" "}
            <strong className="text-white">widely used but still debated</strong>{" "}
            — your doctor interprets your number in the context of <em>you</em>.
          </p>
        </div>

        {/* ── Section: Why you feel awful ── */}
        <SectionHeading>Why you can feel awful with "normal" labs</SectionHeading>
        <P>
          Iron does far more than prevent anemia — it carries oxygen, fuels
          your cells' energy production, and supports your thyroid, brain, and
          muscles. When stores run low, the effects show up everywhere, often
          well before anemia appears:
        </P>

        {/* Symptom chips */}
        <div className="flex flex-wrap gap-2.5 my-2 mb-6">
          {[
            "Persistent fatigue",
            "Hair shedding",
            "Cold hands & feet",
            "Brain fog",
            "Breathlessness on exertion",
            "Restless legs",
            "Low mood",
            "Poor exercise tolerance",
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
          If that list feels familiar and your doctor said your blood was
          "fine," it's worth asking specifically about your{" "}
          <B>ferritin number</B> — not just whether you're anemic.
        </P>

        {/* ── Section: Common causes ── */}
        <SectionHeading>Common causes of low ferritin</SectionHeading>
        <BulletList
          items={[
            [
              "Heavy periods",
              " — one of the most common causes in menstruating people, and frequently overlooked.",
            ],
            [
              "Not enough dietary iron",
              " — especially on plant-based diets, where iron is harder to absorb.",
            ],
            [
              "Poor absorption",
              " — conditions like celiac disease, or low stomach acid, can block uptake even with enough intake.",
            ],
            [
              "Blood loss in the gut",
              " — sometimes silent; an important reason unexplained iron deficiency should always be investigated.",
            ],
            ["Pregnancy", " — iron demand rises sharply."],
            [
              "Endurance training",
              " — heavy runners and athletes lose iron through several routes.",
            ],
          ]}
        />

        {/* ── Section: What to ask ── */}
        <SectionHeading>
          What to ask your doctor (and what to test next)
        </SectionHeading>
        <P>
          If your ferritin is low or low-normal and you have symptoms, a useful
          next step is a <B>full iron panel</B> rather than ferritin alone. That
          typically includes:
        </P>
        <BulletList
          items={[
            ["Serum iron", " — iron currently in your blood"],
            ["TIBC / transferrin", " — your body's iron-carrying capacity"],
            ["Transferrin saturation", " — how \"full\" that capacity is"],
            ["CBC", " — to check whether anemia has developed"],
          ]}
        />
        <P>
          Two questions worth asking directly:{" "}
          <B>"What's my actual ferritin number?"</B> and{" "}
          <B>"If it's low, what's the cause?"</B> Supplementing without finding
          the <em>why</em> can mask a problem that needs attention — which is
          exactly why iron should be looked at <B>with a doctor</B>, not
          self-treated from a number alone.
        </P>

        {/* ── Section: High ferritin ── */}
        <SectionHeading>What about high ferritin?</SectionHeading>
        <P>
          Ferritin can also be <B>elevated</B> — sometimes from iron overload
          (such as hemochromatosis), but often simply because ferritin rises
          with inflammation, infection, or other stress in the body. A high
          reading isn't automatically an iron problem, which is another reason
          the number needs proper interpretation rather than a quick glance.
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
          <h3
            className="font-serif text-2xl mb-2"
            style={{ color: "#eef3f2" }}
          >
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
            Explain my results — free <ArrowRight size={15} className="inline ml-1" />
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
                href: "/learn/vitamin-d",
                q: "What does low vitamin D mean?",
                a: 'Why "normal" and "optimal" are far apart',
              },
              {
                href: "/learn/tsh-thyroid",
                q: "TSH normal but still tired?",
                a: "Why one thyroid number isn't the whole story",
              },
              {
                href: "/learn/crp",
                q: "What does high CRP mean?",
                a: "The quiet inflammation marker most people miss",
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
                style={{
                  background: bgSoft,
                  border: `1px solid ${line}`,
                }}
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
            diagnosis, or treatment. Lab ranges and what they mean vary between
            people. Always discuss your results and any symptoms with a
            qualified healthcare professional before making changes to
            supplements, diet, or medication.
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
    <p className="leading-relaxed mb-4" style={{ color: inkSoft, fontSize: "1.06rem" }}>
      {children}
    </p>
  );
}

function B({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold" style={{ color: "#eef3f2" }}>{children}</strong>;
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
  const color = opt
    ? teal
    : label
      ? "#eef3f2"
      : muted
        ? inkSoft
        : "#eef3f2";
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
