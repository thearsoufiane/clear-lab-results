import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { Logo } from "@/components/logo";
import { ArrowLeft, Save, Check } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your profile | labread.health" },
      { name: "description", content: "Manage your labread account settings and health information." },
      { name: "robots", content: "noindex" },
    ],
    links: [
      { rel: "canonical", href: "https://labread.health/profile" },
    ],
  }),
  component: ProfilePage,
});

const CONDITIONS = [
  { key: "diabetes", label: "Diabetes" },
  { key: "heart_disease", label: "Heart disease" },
  { key: "high_blood_pressure", label: "High blood pressure" },
  { key: "cancer_history", label: "Cancer history" },
  { key: "smoking", label: "Smoking" },
] as const;

type ConditionKey = typeof CONDITIONS[number]["key"];

function ProfilePage() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [age, setAge] = useState<string>("");
  const [sex, setSex] = useState<"male" | "female" | "">("");
  const [flags, setFlags] = useState<Record<ConditionKey, boolean>>({
    diabetes: false, heart_disease: false, high_blood_pressure: false,
    cancer_history: false, smoking: false,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetched, setFetched] = useState(false);

  useEffect(() => { if (!loading && !user) nav({ to: "/auth" }); }, [user, loading]);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else if (data) {
          setAge(data.age?.toString() ?? "");
          setSex((data.biological_sex as "male" | "female") ?? "");
          setFlags({
            diabetes: !!data.diabetes,
            heart_disease: !!data.heart_disease,
            high_blood_pressure: !!data.high_blood_pressure,
            cancer_history: !!data.cancer_history,
            smoking: !!data.smoking,
          });
        }
        setFetched(true);
      });
  }, [user]);

  const toggle = (k: ConditionKey) =>
    setFlags((f) => ({ ...f, [k]: !f[k] }));

  const save = async () => {
    if (!user) return;
    setSaving(true); setError(null); setSaved(false);
    const payload = {
      id: user.id,
      age: age ? parseInt(age, 10) : null,
      biological_sex: sex || null,
      ...flags,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from("profiles").upsert(payload, { onConflict: "id" });
    setSaving(false);
    if (error) setError(error.message);
    else { setSaved(true); setTimeout(() => setSaved(false), 2000); }
  };

  if (loading || !user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-4 border-b border-border/50 flex items-center justify-between sticky top-0 bg-background z-30">
        <Logo />
        <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md min-h-[44px]">
          <ArrowLeft size={14}/> Dashboard
        </Link>
      </header>

      <main className="flex-1 px-6 py-10">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl tracking-tight mb-2">Your <span className="italic gradient-text">profile</span></h1>
            <p className="text-muted-foreground text-sm">Helps us tailor screenings and explanations to you.</p>
          </div>

          {!fetched ? (
            <div className="text-muted-foreground text-sm">Loading…</div>
          ) : (
            <div className="space-y-6">
              <div className="glass p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">Age</label>
                  <input type="number" min={0} max={120} value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-32 bg-background/50 border border-border rounded-lg px-3 py-2 text-base focus:outline-none focus:border-accent transition" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Biological sex</label>
                  <div className="flex gap-2">
                    {(["male","female"] as const).map((s) => (
                      <button key={s} type="button" onClick={() => setSex(s)}
                        className={`px-5 py-2.5 rounded-full text-sm border transition capitalize min-h-[44px] flex items-center ${
                          sex === s
                            ? "bg-accent text-accent-foreground border-accent"
                            : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
                        }`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="glass p-6">
                <label className="block text-sm font-medium mb-3">Existing conditions</label>
                <div className="grid sm:grid-cols-2 gap-2">
                  {CONDITIONS.map((c) => {
                    const on = flags[c.key];
                    return (
                      <button key={c.key} type="button" onClick={() => toggle(c.key)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm transition ${
                          on ? "border-accent/60 bg-accent/10" : "border-border hover:border-foreground/30"
                        }`}>
                        <span className={`w-5 h-5 rounded-md border grid place-items-center transition ${
                          on ? "bg-accent border-accent text-accent-foreground" : "border-border"
                        }`}>
                          {on && <Check size={14} />}
                        </span>
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {error && (
                <div className="glass p-4 text-sm text-danger border-danger/30">
                  {error}
                  <div className="text-muted-foreground mt-2 text-xs">
                    If you still see a schema cache error, go to Supabase → API settings and click "Reload schema", or wait ~30s for PostgREST to refresh.
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <button onClick={save} disabled={saving}
                  className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-5 py-2.5 rounded-full text-sm font-medium transition-colors disabled:opacity-60">
                  <Save size={14}/> {saving ? "Saving…" : "Save profile"}
                </button>
                {saved && <span className="text-sm text-success inline-flex items-center gap-1.5"><Check size={14}/> Saved</span>}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
