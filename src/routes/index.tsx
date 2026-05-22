import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { Logo } from "@/components/logo";
import {
  ArrowRight, Sparkles, ShieldCheck, FileText, Stethoscope,
  Upload, Brain, HeartPulse, Check, Globe2, Crown,
} from "lucide-react";

const PRO_URL = "https://labread.gumroad.com/l/dfaiip";
const FOUNDING_URL = "https://labread.gumroad.com/l/lckhjt";

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
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated mesh background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="aurora opacity-70" />
      </div>

      <header className="px-6 py-5 flex items-center justify-between max-w-6xl mx-auto sticky top-0 z-30 backdrop-blur-md bg-background/40">
        <Logo />
        <div className="flex items-center gap-3">
          <Link
            to="/auth"
            className="text-sm text-muted-foreground hover:text-foreground transition px-3 py-2"
          >
            Sign in
          </Link>
          <Link
            to="/auth"
            className="text-sm px-4 py-2 rounded-full bg-accent text-accent-foreground font-medium accent-glow hover:scale-[1.02] transition"
          >
            Get started free
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6">
        <section className="relative pt-20 pb-24 text-center animate-fade-up">
          <div className="absolute inset-0 -z-10">
            <div className="animated-gradient" />
          </div>
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground glass px-3 py-1.5 rounded-full mb-8">
            <Sparkles size={12} className="text-accent" />
            AI-powered medical clarity
          </div>
          <h1 className="text-5xl md:text-7xl leading-[1.02] mb-7 tracking-tight">
            Your blood test,<br />
            <span className="italic gradient-text">finally explained.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Upload any lab report — PDF or photo — and labread instantly translates
            every value into plain language, flags what matters, and recommends screenings.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-7 py-4 rounded-full font-medium accent-glow hover:scale-[1.03] transition text-base"
            >
              Get started free <ArrowRight size={16} />
            </Link>
            <a
              href="#how"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-full glass hover:bg-white/5 transition text-sm text-muted-foreground hover:text-foreground"
            >
              See how it works
            </a>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Check size={12} className="text-success"/> Free to start</span>
            <span className="inline-flex items-center gap-1.5"><Check size={12} className="text-success"/> No card needed</span>
            <span className="inline-flex items-center gap-1.5"><Check size={12} className="text-success"/> Private by design</span>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-16 animate-fade-up">
          <div className="text-center mb-12">
            <div className="text-[11px] uppercase tracking-[0.2em] text-accent mb-3">Pricing</div>
            <h2 className="text-3xl md:text-4xl tracking-tight">Choose your plan.</h2>
            <p className="text-muted-foreground mt-3 max-w-md mx-auto">Simple pricing. Cancel anytime, or own it forever.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto stagger">
            {/* Pro */}
            <div className="glass glass-glow p-8 relative flex flex-col">
              <div className="badge-status badge-normal absolute -top-3 left-6">Most Popular</div>
              <div className="mb-6">
                <div className="text-sm text-muted-foreground mb-2">Pro</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-serif tracking-tight">$12.99</span>
                  <span className="text-muted-foreground text-sm">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-3">Full access to everything. Cancel anytime.</p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "Unlimited reports",
                  "Plain-language explanations of every value",
                  "Trend tracking over time",
                  "PDF export",
                  "Personalized cancer screening recommendations",
                  "Priority support",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check size={14} className="text-accent mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href={PRO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-full glass hover:bg-white/5 transition text-sm font-medium border border-accent/30 hover:border-accent/60"
              >
                Start 7-day free trial <ArrowRight size={14} />
              </a>
            </div>

            {/* Founding Member */}
            <div className="glass glow-normal p-8 relative flex flex-col accent-glow">
              <div className="animated-gradient opacity-50" />
              <div className="badge-status badge-normal absolute -top-3 left-6">
                <Crown size={11} /> Limited — 200 spots only
              </div>
              <div className="mb-6 relative z-10">
                <div className="text-sm text-accent mb-2 inline-flex items-center gap-1.5">
                  <Crown size={13} /> Founding Member
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-serif tracking-tight gradient-text">$99</span>
                  <span className="text-muted-foreground text-sm">one-time</span>
                </div>
                <p className="text-sm text-muted-foreground mt-3">Pay once. Own it forever. Never pay again.</p>
              </div>
              <ul className="space-y-3 mb-8 flex-1 relative z-10">
                {[
                  "Everything in Pro",
                  "Lifetime access",
                  "All future features included",
                  "Founding member badge",
                  "Lock in before price increases",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check size={14} className="text-accent mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href={FOUNDING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 inline-flex items-center justify-center gap-2 w-full bg-accent text-accent-foreground px-6 py-3.5 rounded-full font-medium accent-glow hover:scale-[1.02] transition text-sm"
              >
                Get Lifetime Access <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 animate-fade-up">
          <div className="text-center mb-12">
            <div className="text-[11px] uppercase tracking-[0.2em] text-accent mb-3">Why labread</div>
            <h2 className="text-3xl md:text-4xl tracking-tight">Built for clarity. Designed for you.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
            {[
              { icon: Globe2, t: "Any lab, any country", d: "Bloodwork, panels, hormones — we read them all, in any language." },
              { icon: Brain, t: "Plain-language insights", d: "No jargon. Just what each value means for your body, today." },
              { icon: HeartPulse, t: "Flagged automatically", d: "Color-coded results so abnormal values are impossible to miss." },
              { icon: Stethoscope, t: "Screening recommendations", d: "Personalized next steps and tests worth discussing with your doctor." },
              { icon: FileText, t: "Beautiful history", d: "Every report saved, searchable, and easy to compare over time." },
              { icon: ShieldCheck, t: "Private by design", d: "Your reports are yours. Encrypted, isolated, never shared." },
            ].map((f, i) => (
              <div key={i} className="glass glass-glow p-6 hover:-translate-y-0.5 hover:border-accent/30 transition-all duration-300">
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
        <section id="how" className="py-20 animate-fade-up">
          <div className="text-center mb-12">
            <div className="text-[11px] uppercase tracking-[0.2em] text-accent mb-3">How it works</div>
            <h2 className="text-3xl md:text-4xl tracking-tight">Three steps to clarity.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4 relative stagger">
            {[
              { n: "01", icon: Upload, t: "Upload", d: "Drop a PDF or snap a photo of your lab report." },
              { n: "02", icon: Brain, t: "Analyze", d: "Our AI reads every value and references against medical ranges." },
              { n: "03", icon: HeartPulse, t: "Understand", d: "Get plain-language explanations and screening guidance." },
            ].map((s, i) => (
              <div key={i} className="glass glass-glow p-6 relative">
                <div className="text-[11px] font-mono text-accent mb-4 tracking-wider">{s.n}</div>
                <s.icon size={22} className="text-accent mb-3" />
                <div className="font-medium mb-1.5">{s.t}</div>
                <div className="text-sm text-muted-foreground">{s.d}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 animate-fade-up">
          <div className="glass glass-glow p-10 md:p-14 text-center relative overflow-hidden rounded-3xl">
            <div className="animated-gradient" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl mb-4 tracking-tight">
                Ready to <span className="italic gradient-text">understand</span> your bloodwork?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Join thousands taking control of their health, one lab at a time.
              </p>
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-7 py-4 rounded-full font-medium accent-glow hover:scale-[1.03] transition"
              >
                Get started free <ArrowRight size={16} />
              </Link>
            </div>
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
