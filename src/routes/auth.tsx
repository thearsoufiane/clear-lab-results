import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "@/components/logo";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth")({ component: AuthPage });

function AuthPage() {
  const { user, loading: authLoading } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => { if (!authLoading && user) nav({ to: "/dashboard" }); }, [user, authLoading]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null); setInfo(null); setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin + "/dashboard" },
        });
        if (error) throw error;
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

  return (
    <div className="min-h-screen grid place-items-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 -z-10"
        style={{ background: "radial-gradient(50% 50% at 50% 30%, rgba(200,240,216,0.10), transparent 60%)" }} />
      <div className="w-full max-w-md animate-fade-up">
        <div className="flex justify-center mb-8"><Logo size={36} /></div>
        <div className="glass glass-glow p-8">
          <h2 className="text-2xl mb-1">{mode === "signin" ? "Welcome back" : "Create your account"}</h2>
          <p className="text-sm text-muted-foreground mb-6">
            {mode === "signin" ? "Sign in to view your reports." : "Start understanding your bloodwork."}
          </p>
          <form onSubmit={submit} className="space-y-3">
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-input/60 border border-border rounded-xl px-4 py-3 outline-none focus:border-accent/60 transition"
            />
            <input
              type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-input/60 border border-border rounded-xl px-4 py-3 outline-none focus:border-accent/60 transition"
            />
            {err && <div className="text-sm text-danger bg-danger/10 border border-danger/30 rounded-lg px-3 py-2">{err}</div>}
            {info && <div className="text-sm text-accent bg-accent/10 border border-accent/30 rounded-lg px-3 py-2">{info}</div>}
            <button
              type="submit" disabled={loading}
              className="w-full bg-accent text-accent-foreground font-medium rounded-xl py-3 accent-glow hover:scale-[1.01] active:scale-[0.99] transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>
          <button
            onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setErr(null); setInfo(null); }}
            className="text-sm text-muted-foreground hover:text-foreground mt-5 w-full text-center transition"
          >
            {mode === "signin" ? "No account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
