import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { Logo } from "@/components/logo";
import { ArrowRight, Sparkles, ShieldCheck, FileText } from "lucide-react";

export const Route = createFileRoute("/")({ component: Landing });

function Landing() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    if (!loading && user) nav({ to: "/dashboard" });
  }, [user, loading]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(200,240,216,0.10), transparent 60%), radial-gradient(40% 40% at 80% 80%, rgba(200,240,216,0.06), transparent 70%)",
        }}
      />
      <header className="px-6 py-5 flex items-center justify-between max-w-6xl mx-auto">
        <Logo />
        <Link
          to="/auth"
          className="text-sm px-4 py-2 rounded-full glass hover:bg-white/5 transition"
        >
          Sign in
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-20 pb-24 text-center animate-fade-up">
        <div className="inline-flex items-center gap-2 text-xs text-muted-foreground glass px-3 py-1.5 rounded-full mb-8">
          <Sparkles size={12} className="text-accent" />
          AI-powered medical clarity
        </div>
        <h1 className="text-5xl md:text-6xl leading-[1.05] mb-6">
          Your blood test,<br />
          <span className="italic" style={{ color: "#c8f0d8" }}>finally explained.</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
          Upload any lab report — PDF or photo — and labread instantly translates
          every value into plain language, flags what matters, and recommends screenings.
        </p>
        <Link
          to="/auth"
          className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3.5 rounded-full font-medium accent-glow hover:scale-[1.02] transition"
        >
          Get started <ArrowRight size={16} />
        </Link>

        <div className="grid sm:grid-cols-3 gap-4 mt-20 text-left">
          {[
            { icon: FileText, t: "Any lab, any country", d: "Bloodwork, panels, hormones — we read them all." },
            { icon: Sparkles, t: "Plain-language insights", d: "No jargon. Just what each value means for you." },
            { icon: ShieldCheck, t: "Private by design", d: "Your reports are yours. Encrypted and isolated." },
          ].map((f, i) => (
            <div key={i} className="glass glass-glow p-5">
              <f.icon size={18} className="text-accent mb-3" />
              <div className="font-medium mb-1">{f.t}</div>
              <div className="text-sm text-muted-foreground">{f.d}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
