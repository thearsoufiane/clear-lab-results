import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ShieldCheck, FlaskConical, Lock, Compass, ArrowRight } from "lucide-react";
import { BlogHeader, BlogFooter, tokens } from "@/blog/blog-ui";

const { teal, tealDim, ink, inkSoft, bgSoft, line } = tokens;

export const Route = createFileRoute("/trust-center")({
  head: () => ({
    meta: [
      { title: "Trust Center — how labread handles your data, accuracy, and security | labread" },
      {
        name: "description",
        content:
          "How labread protects your data, validates the accuracy of its results, secures the platform, and where we're taking it next.",
      },
      { property: "og:title", content: "labread Trust Center" },
      {
        property: "og:description",
        content:
          "Data & privacy, accuracy validation, security practices, and our roadmap — the trust behind labread.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://labread.health/trust-center" }],
  }),
  component: TrustCenter,
});

function TrustCenter() {
  return (
    <div className="min-h-screen" style={{ background: tokens.bg }}>
      <BlogHeader />

      <main className="max-w-[820px] mx-auto px-7 pt-14 pb-10">
        {/* ── Hero ── */}
        <div
          className="text-xs uppercase tracking-[0.16em] mb-5"
          style={{ color: tealDim }}
        >
          Trust Center
        </div>

        <h1
          className="font-serif leading-[1.08] tracking-tight mb-6"
          style={{ fontSize: "clamp(2.1rem, 6vw, 3.1rem)" }}
        >
          What we collect, how we protect it, and how we make sure the answers
          are right.
        </h1>
        <p
          className="text-lg leading-relaxed pb-9 mb-10 border-b"
          style={{ color: inkSoft, borderColor: line }}
        >
          labread is built on one principle: show the test, don't just claim the
          result.
        </p>

        {/* ── 2×2 card grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TrustCard icon={ShieldCheck} title="Data & Privacy">
            Your reports are yours. We collect only what's needed to generate
            your analysis. We never sell health data, and we never use your
            reports to train models without explicit opt-in. Data is encrypted in
            transit and at rest. You can request full deletion at any time.
          </TrustCard>

          <TrustCard icon={FlaskConical} title="How We Validate Accuracy">
            Most AI health tools ask one model to decide what's abnormal and
            explain it in the same breath. We don't. A deterministic rules engine
            decides status by comparing your values against reference ranges — no
            AI involved in that decision. The AI's only job is explaining a
            result that's already been determined by code.
          </TrustCard>

          <TrustCard icon={Lock} title="Security Practices">
            Encrypted data in transit (TLS) and at rest. Access to production
            systems is restricted and logged. We follow the principle of least
            privilege for any team member or system accessing user data.
          </TrustCard>

          <TrustCard icon={Compass} title="Where We're Headed">
            We're a small, early-stage team. We haven't pursued formal
            certifications like SOC 2 yet — that's a deliberate sequencing
            choice, not an oversight, and we'll pursue it as we scale. What we
            commit to today: transparent practices and engineering rigor you can
            verify yourself.
          </TrustCard>
        </div>

        {/* ── Callout linking to the engineering deep-dive ── */}
        <div
          className="rounded-2xl p-7 my-12"
          style={{
            background:
              "linear-gradient(150deg, rgba(63,214,196,0.10), rgba(63,214,196,0.03))",
            border: "1px solid rgba(63,214,196,0.3)",
          }}
        >
          <h3 className="font-serif text-xl mb-2" style={{ color: ink }}>
            Proof, not promises
          </h3>
          <p className="leading-relaxed mb-4" style={{ color: inkSoft, fontSize: "1.02rem" }}>
            Want to see the engineering behind it? Read how we found and fixed 3
            real bugs before this system went live.
          </p>
          <Link
            to="/blog/$slug"
            params={{ slug: "deterministic-flagging-bugs" }}
            className="inline-flex items-center text-sm font-semibold no-underline"
            style={{ color: teal }}
          >
            We Found 3 Bugs That Could Have Hurt Someone
            <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>

        <BlogFooter />
      </main>
    </div>
  );
}

function TrustCard({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof ShieldCheck;
  title: string;
  children: ReactNode;
}) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: bgSoft, border: `1px solid ${line}` }}
    >
      <div
        className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-xl"
        style={{
          background: "rgba(63,214,196,0.10)",
          border: "1px solid rgba(63,214,196,0.25)",
        }}
      >
        <Icon size={20} style={{ color: teal }} />
      </div>
      <h3 className="font-serif text-xl mb-2" style={{ color: ink }}>
        {title}
      </h3>
      <p className="text-sm leading-relaxed m-0" style={{ color: inkSoft }}>
        {children}
      </p>
    </div>
  );
}
