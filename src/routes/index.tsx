import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { Logo } from "@/components/logo";
import {
  ArrowRight, Sparkles, ShieldCheck, FileText, Stethoscope,
  Upload, Brain, HeartPulse, Check, Globe2, BookOpen,
} from "lucide-react";

// Illustrative sample biomarkers for the landing-page report preview.
// Uses the same dot/badge classes as the real analysis view.
const SAMPLE_REPORT = [
  {
    name: "Ferritin",
    value: "18 ng/mL",
    status: "Low",
    dot: "dot-warn",
    badge: "badge-warn",
    note: "Your iron stores are running low — a common cause of fatigue, brain fog, and feeling cold.",
  },
  {
    name: "Vitamin D",
    value: "22 ng/mL",
    status: "Low",
    dot: "dot-warn",
    badge: "badge-warn",
    note: "Below the optimal range, which is often linked to low energy, low mood, and weaker immunity.",
  },
  {
    name: "TSH",
    value: "2.1 mIU/L",
    status: "Normal",
    dot: "dot-normal",
    badge: "badge-normal",
    note: "Your thyroid signal is in range — though one number doesn't capture the full thyroid picture.",
  },
  {
    name: "CRP",
    value: "4.2 mg/L",
    status: "Elevated",
    dot: "dot-bad",
    badge: "badge-bad",
    note: "A marker of inflammation that's mildly raised — worth understanding what's driving it.",
  },
];

// Educational biomarker guides. Flip `live` to true as each /learn page ships.
const GUIDES = [
  { href: "/learn/ferritin", title: "What Does Low Ferritin Mean?", blurb: "Iron deficiency, explained in plain English.", live: true },
  { href: "/learn/vitamin-d", title: "Vitamin D Deficiency Explained", blurb: "Why “normal” and “optimal” are far apart.", live: true },
  { href: "/learn/tsh-thyroid", title: "TSH Normal But Still Tired?", blurb: "Why one thyroid number isn’t the whole story.", live: true },
  { href: "/learn/crp", title: "What Does High CRP Mean?", blurb: "The quiet inflammation marker most people miss.", live: true },
  { href: "/learn/a1c", title: "What Is Pre-Diabetic A1c?", blurb: "The window where changes matter most.", live: true },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "labread.health — Your blood test, finally explained." },
      { name: "description", content: "Upload any blood test, in any language, from any lab. Get instant, plain-language explanations and personalized screening recommendations." },
      { property: "og:title", content: "labread.health — Your blood test, finally explained." },
      { property: "og:description", content: "AI-powered medical clarity for your bloodwork." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    if (!loading && user) nav({ to: "/dashboard" });
  }, [user, loading]);

  return (
    <div className="min-h-screen relative">

      <header className="px-6 py-5 flex items-center justify-between max-w-6xl mx-auto sticky top-0 z-30 bg-background/95">
        <Logo />
        <div className="flex items-center gap-3">
          <a
            href="#learn"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
          >
            Learn
          </a>
          <Link
            to="/auth"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
          >
            Sign in
          </Link>
          <Link
            to="/try-free"
            className="text-sm px-4 py-2 rounded-full bg-accent text-accent-foreground font-medium"
          >
            Try for free
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6">
        <section className="relative pt-20 pb-24 text-center">
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground glass px-3 py-1.5 rounded-full mb-8">
            <Sparkles size={12} className="text-accent" />
            AI-powered medical clarity
          </div>
          <h1 className="text-5xl md:text-7xl leading-[1.02] mb-7 tracking-tight">
            Your blood test,<br />
            <span className="italic gradient-text">finally explained.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Paste your numbers. We tell you what's normal, what's not, and what to ask your doctor. Plain English. 30 seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/try-free"
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-7 py-4 rounded-full font-medium text-base"
            >
              Try for free <ArrowRight size={16} />
            </Link>
            <Link
              to="/auth" search={{ mode: "signup" }}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-full glass hover:bg-white/5 transition-colors text-sm text-muted-foreground hover:text-foreground"
            >
              Sign up to save results
            </Link>
          </div>
          <div className="mt-6 inline-flex items-center gap-2 text-xs text-muted-foreground glass px-4 py-2 rounded-full">
            <ShieldCheck size={13} className="text-success shrink-0" />
            Your data is never stored. Results are processed and immediately deleted. HIPAA-compliant.
          </div>
          <div className="mt-4 flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Check size={12} className="text-success"/> Free to start</span>
            <span className="inline-flex items-center gap-1.5"><Check size={12} className="text-success"/> No card needed</span>
          </div>
        </section>

        {/* Sample report preview */}
        <section className="pb-16">
          <div className="text-center mb-10">
            <div className="text-[11px] uppercase tracking-[0.2em] text-accent mb-3">Sample report</div>
            <h2 className="text-3xl md:text-4xl tracking-tight">Here's what your report looks like</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SAMPLE_REPORT.map((b) => (
              <div key={b.name} className="glass p-5 flex flex-col">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`dot ${b.dot}`} />
                    <span className="font-medium truncate">{b.name}</span>
                  </div>
                  <span className={`badge-status ${b.badge}`}>{b.status}</span>
                </div>
                <div className="text-sm text-muted-foreground tabular-nums mb-2">{b.value}</div>
                <div className="text-sm text-muted-foreground leading-relaxed">{b.note}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/auth" search={{ mode: "signup" }}
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-7 py-4 rounded-full font-medium transition-colors"
            >
              Get yours free <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* Testimonials */}
        <section className="pb-16">
          <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <div className="glass p-6 rounded-2xl">
              <p className="text-sm leading-relaxed mb-4 text-foreground/90">"Useful and actually explains my blood test in language I can understand."</p>
              <div className="text-xs text-muted-foreground">&mdash; Alix</div>
            </div>
            <div className="glass p-6 rounded-2xl">
              <p className="text-sm leading-relaxed mb-4 text-foreground/90">"I finally understand my blood test."</p>
              <div className="text-xs text-muted-foreground">&mdash; Rechi</div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16">
          <div className="text-center mb-12">
            <div className="text-[11px] uppercase tracking-[0.2em] text-accent mb-3">Why labread</div>
            <h2 className="text-3xl md:text-4xl tracking-tight">Built for clarity. Designed for you.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Globe2, t: "Any lab, any country", d: "Bloodwork, panels, hormones — we read them all, in any language." },
              { icon: Brain, t: "Plain-language insights", d: "No jargon. Just what each value means for your body, today." },
              { icon: HeartPulse, t: "Flagged automatically", d: "Color-coded results so abnormal values are impossible to miss." },
              { icon: Stethoscope, t: "Screening recommendations", d: "Personalized next steps and tests worth discussing with your doctor." },
              { icon: FileText, t: "Beautiful history", d: "Every report saved, searchable, and easy to compare over time." },
              { icon: ShieldCheck, t: "Zero data stored", d: "Your results are processed and immediately deleted. Nothing is saved. HIPAA-compliant." },
            ].map((f, i) => (
              <div key={i} className="glass p-6">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent/25 to-accent/5 grid place-items-center text-accent mb-4 border border-accent/15">
                  <f.icon size={18} />
                </div>
                <div className="font-medium mb-1.5">{f.t}</div>
                <div className="text-sm text-muted-foreground leading-relaxed">{f.d}</div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="py-20">
          <div className="text-center mb-12">
            <div className="text-[11px] uppercase tracking-[0.2em] text-accent mb-3">How it works</div>
            <h2 className="text-3xl md:text-4xl tracking-tight">Three steps to clarity.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4 relative">
            {[
              { n: "01", icon: Upload, t: "Upload", d: "Drop a PDF or snap a photo of your lab report." },
              { n: "02", icon: Brain, t: "Analyze", d: "Our AI reads every value and references against medical ranges." },
              { n: "03", icon: HeartPulse, t: "Understand", d: "Get plain-language explanations and screening guidance." },
            ].map((s, i) => (
              <div key={i} className="glass p-6 relative">
                <div className="text-[11px] font-mono text-accent mb-4 tracking-wider">{s.n}</div>
                <s.icon size={22} className="text-accent mb-3" />
                <div className="font-medium mb-1.5">{s.t}</div>
                <div className="text-sm text-muted-foreground">{s.d}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="glass p-10 md:p-14 text-center relative overflow-hidden rounded-3xl">
            <h2 className="text-3xl md:text-5xl mb-4 tracking-tight">
              Ready to <span className="italic gradient-text">understand</span> your bloodwork?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Join thousands taking control of their health, one lab at a time.
            </p>
            <Link
              to="/try-free"
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-7 py-4 rounded-full font-medium transition-colors"
            >
              Try for free <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* Learn / Resources */}
        <section id="learn" className="py-16">
          <div className="text-center mb-12">
            <div className="text-[11px] uppercase tracking-[0.2em] text-accent mb-3">Learn</div>
            <h2 className="text-3xl md:text-4xl tracking-tight">Understand your results.</h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              Plain-English guides to the biomarkers people ask about most — what the numbers mean, and what to do next.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GUIDES.map((g) =>
              g.live ? (
                <a
                  key={g.href}
                  href={g.href}
                  className="glass p-6 flex flex-col group hover:bg-white/[0.04] hover:border-accent/30 transition-colors"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent/25 to-accent/5 grid place-items-center text-accent mb-4 border border-accent/15">
                    <BookOpen size={18} />
                  </div>
                  <div className="font-medium mb-1.5">{g.title}</div>
                  <div className="text-sm text-muted-foreground leading-relaxed flex-1">{g.blurb}</div>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-accent">
                    Read guide <ArrowRight size={14} />
                  </span>
                </a>
              ) : (
                <div key={g.href} className="glass p-6 flex flex-col opacity-55">
                  <div className="w-11 h-11 rounded-xl bg-white/[0.04] grid place-items-center text-muted-foreground mb-4 border border-border/40">
                    <BookOpen size={18} />
                  </div>
                  <div className="font-medium mb-1.5">{g.title}</div>
                  <div className="text-sm text-muted-foreground leading-relaxed flex-1">{g.blurb}</div>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
                    Coming soon
                  </span>
                </div>
              )
            )}
          </div>
        </section>

        <footer className="py-10 border-t border-border/40 mt-10 flex items-center justify-between text-xs text-muted-foreground">
          <Logo />
          <div>© {new Date().getFullYear()} labread.health · Not medical advice.</div>
        </footer>
      </main>
    </div>
  );
}
