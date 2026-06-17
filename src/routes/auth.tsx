import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "@/components/logo";
import { Loader2, Sparkles } from "lucide-react";
import { track, hasGuestAnalysis, clearGuestAnalysis } from "@/lib/analytics";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { mode?: "signup"; from?: "demo" } => ({
    ...(search.mode === "signup" ? { mode: "signup" as const } : {}),
    ...(search.from === "demo" ? { from: "demo" as const } : {}),
  }),
  head: () => ({
    meta: [
      { title: "Sign in or create account | labread.health" },
      { name: "description", content: "Sign in to your labread account or create a new one to save and track your blood test analyses." },
    ],
    links: [
      { rel: "canonical", href: "https://labread.health/auth" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { user, loading: authLoading } = useAuth();
  const nav = useNavigate();
  const searchParams = Route.useSearch();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">(
    searchParams.mode === "signup" ? "signup" : "signin"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const fromDemo = searchParams.from === "demo";

  // A guest who reached signup after running a free analysis.
  useEffect(() => {
    if (fromDemo && hasGuestAnalysis()) track("guest_signup_viewed");
  }, [fromDemo]);

  useEffect(() => { if (!authLoading && user) nav({ to: "/dashboard" }); }, [user, authLoading]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null); setInfo(null); setLoading(true);
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + "/auth",
        });
        if (error) throw error;
        setInfo("Password reset email sent! **Check your spam folder** if you don't see it within 2 minutes.");
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin + "/dashboard" },
        });
        if (error) throw error;
        // Count guest → signup conversion (they ran a free analysis, then signed up).
        if (hasGuestAnalysis()) {
          track("guest_signup_converted");
          clearGuestAnalysis();
        }
        setInfo("Check your email to confirm your account, then sign in.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        nav({ to: "/dashboard" });
      }
    } catch (e: any) {
      setErr(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  const title = mode === "forgot"
    ? "Reset your password"
    : mode === "signin"
      ? "Welcome back"
      : "Create your account";

  const subtitle = mode === "forgot"
    ? "Enter your email and we'll send you a reset link."
    : mode === "signin"
      ? "Sign in to view your reports."
      : "Start understanding your bloodwork today.";

  const buttonLabel = mode === "forgot"
    ? "Send reset link"
    : mode === "signin"
      ? "Sign in"
      : "Create account";

  return (
    <div className="min-h-screen grid place-items-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 -z-10"
        style={{ background: "radial-gradient(50% 50% at 50% 30%, rgba(200,240,216,0.10), transparent 60%)" }} />
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8"><Logo /></div>
        {fromDemo && (
          <div className="glass p-4 mb-4 flex items-start gap-3 border-accent/30">
            <Sparkles size={16} className="text-accent mt-0.5 shrink-0" />
            <p className="text-sm text-foreground/90">
              You just ran a free analysis. Create an account to save it as a PDF and run more.
            </p>
          </div>
        )}
        <div className="glass p-8">
          <h2 className="text-2xl mb-1">{title}</h2>
          <p className="text-sm text-muted-foreground mb-6">{subtitle}</p>
          <form onSubmit={submit} className="space-y-3">
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-input/60 border border-border rounded-xl px-4 py-3 outline-none focus:border-accent/60 transition-colors"
            />
            {mode !== "forgot" && (
              <input
                type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 6 characters)"
                className="w-full bg-input/60 border border-border rounded-xl px-4 py-3 outline-none focus:border-accent/60 transition-colors"
              />
            )}
            {err && <div className="text-sm text-danger bg-danger/10 border border-danger/30 rounded-lg px-3 py-2">{err}</div>}
            {info && (
              <div className="text-sm text-accent bg-accent/10 border border-accent/30 rounded-lg px-3 py-2">
                {info.split(/\*\*(.*?)\*\*/).map((part, i) =>
                  i % 2 === 1 ? <strong key={i} className="font-semibold text-foreground">{part}</strong> : part
                )}
              </div>
            )}
            <button
              type="submit" disabled={loading}
              className="w-full bg-accent text-accent-foreground font-medium rounded-xl py-3 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {buttonLabel}
            </button>
          </form>

          {/* Forgot password link (only on sign-in mode) */}
          {mode === "signin" && (
            <button
              onClick={() => { setMode("forgot"); setErr(null); setInfo(null); }}
              className="text-xs text-muted-foreground hover:text-accent mt-3 w-full text-center transition-colors"
            >
              Forgot your password?
            </button>
          )}

          {/* Mode toggle */}
          <div className="mt-4 text-center">
            {mode === "forgot" ? (
              <button
                onClick={() => { setMode("signin"); setErr(null); setInfo(null); }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to sign in
              </button>
            ) : (
              <button
                onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setErr(null); setInfo(null); }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {mode === "signin"
                  ? "Don't have an account? Create one"
                  : "Already have an account? Sign in"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
