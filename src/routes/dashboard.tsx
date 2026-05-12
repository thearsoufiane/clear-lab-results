import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase, type Report } from "@/lib/supabase";
import { Logo } from "@/components/logo";
import { UploadModal } from "@/components/upload-modal";
import { HistorySidebar } from "@/components/history-sidebar";
import { FileText, AlertTriangle, Stethoscope, Plus, LogOut, ChevronRight, User } from "lucide-react";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

function Dashboard() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [fetched, setFetched] = useState(false);

  useEffect(() => { if (!loading && !user) nav({ to: "/auth" }); }, [user, loading]);

  const load = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("reports").select("*").order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setReports((data ?? []) as Report[]);
    setFetched(true);
  };

  useEffect(() => { if (user) load(); }, [user]);

  if (loading || !user) return null;

  const totalValues = reports.reduce((a, r) => a + (r.analysis?.values?.length ?? 0), 0);
  const flagged = reports.reduce((a, r) =>
    a + (r.analysis?.values?.filter(v => v.status !== "normal").length ?? 0), 0);
  const screenings = reports.reduce((a, r) => a + (r.analysis?.screenings?.length ?? 0), 0);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning"; if (h < 18) return "Good afternoon"; return "Good evening";
  })();

  const name = (user.email || "").split("@")[0];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-4 border-b border-border/50 flex items-center justify-between sticky top-0 bg-background/70 backdrop-blur-md z-30">
        <Logo />
        <div className="flex items-center gap-3">
          <button onClick={() => setOpen(true)}
            className="hidden sm:inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-medium accent-glow hover:scale-[1.02] transition">
            <Plus size={14}/> New report
          </button>
          <Link to="/profile"
            className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-white/5 transition" title="Profile">
            <User size={16}/>
          </Link>
          <button onClick={() => supabase.auth.signOut()}
            className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-white/5 transition" title="Sign out">
            <LogOut size={16}/>
          </button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        <HistorySidebar reports={reports} />

        <main className="flex-1 min-w-0 px-6 py-10 animate-fade-up">
          <div className="max-w-4xl mx-auto">
            <div className="relative mb-10 rounded-3xl overflow-hidden p-8 md:p-10 border border-border/40">
              <div className="animated-gradient" />
              <div className="relative z-10 animate-fade-up">
                <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent accent-glow" />
                  labread.health
                </div>
                <h1 className="text-4xl md:text-6xl mb-3 leading-[1.05] tracking-tight">
                  {greeting},<br/>
                  <span className="italic gradient-text">{name}</span>.
                </h1>
                <p className="text-muted-foreground text-base md:text-lg">Here's the state of your bloodwork.</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mb-10 stagger">
              <Stat icon={FileText} label="Reports" value={reports.length} tone={reports.length > 0 ? "normal" : "neutral"} />
              <Stat icon={AlertTriangle} label="Flagged values"
                value={flagged}
                tone={flagged === 0 ? "normal" : flagged < 3 ? "warn" : "bad"} />
              <Stat icon={Stethoscope} label="Screenings due"
                value={screenings}
                tone={screenings === 0 ? "normal" : screenings < 2 ? "warn" : "bad"} />
            </div>

            <UploadZone onClick={() => setOpen(true)} />

            <div className="mt-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl">Recent reports</h2>
                <span className="text-xs text-muted-foreground">{reports.length} total · {totalValues} values analyzed</span>
              </div>

              {error && (
                <div className="glass p-4 text-sm text-danger border-danger/30">
                  {error}
                  <div className="text-muted-foreground mt-2 text-xs">
                    If the table doesn't exist yet, create it in your Supabase project (see SQL in README/migration).
                  </div>
                </div>
              )}
              {!error && fetched && reports.length === 0 && (
                <div className="glass p-8 text-center text-sm text-muted-foreground">
                  No reports yet. Upload your first lab to get started.
                </div>
              )}
              <div className="space-y-3 stagger">
                {reports.map((r) => {
                  const flagCount = r.analysis?.values?.filter(v => v.status !== "normal").length ?? 0;
                  return (
                    <Link key={r.id} to="/report/$id" params={{ id: r.id }}
                      className="glass glass-glow p-4 flex items-center gap-4 hover:bg-white/[0.04] hover:-translate-y-0.5 hover:border-accent/30 transition-all duration-300 group">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent/25 to-accent/5 grid place-items-center text-accent shrink-0 border border-accent/15">
                        <FileText size={18}/>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate">{r.title || r.file_name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {new Date(r.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                          {" · "}{r.analysis?.values?.length ?? 0} values
                          {flagCount > 0 && <span className="text-warning"> · {flagCount} flagged</span>}
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition"/>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>

      <UploadModal open={open} onClose={() => setOpen(false)} userId={user.id}
        onCreated={(id) => { setOpen(false); nav({ to: "/report/$id", params: { id } }); }} />
    </div>
  );
}

function Stat({ icon: Icon, label, value, tone = "normal" }: { icon: any; label: string; value: number; tone?: "normal"|"warn"|"bad"|"neutral" }) {
  const iconColor = tone === "bad" ? "text-danger" : tone === "warn" ? "text-warning" : tone === "normal" ? "text-success" : "text-muted-foreground";
  const glow = tone === "bad" ? "glow-bad" : tone === "warn" ? "glow-warn" : tone === "normal" ? "glow-normal" : "";
  const numColor = tone === "bad" ? "text-danger" : tone === "warn" ? "text-warning" : tone === "normal" ? "text-success" : "";
  return (
    <div className={`glass p-5 hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden ${glow}`}>
      <div className="relative">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Icon size={14} className={iconColor} />
          {label}
        </div>
        <div key={value} className={`text-4xl font-serif animate-count-up tabular-nums ${numColor}`}>{value}</div>
      </div>
    </div>
  );
}

function UploadZone({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="w-full glass glass-glow border-dashed border-2 border-border/80 hover:border-accent/60 hover:-translate-y-0.5 transition-all duration-300 rounded-2xl p-10 text-center group relative overflow-hidden">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "radial-gradient(circle at 50% 0%, rgba(200,240,216,0.10), transparent 60%)" }}/>
      <div className="relative">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/30 to-accent/5 text-accent mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 border border-accent/20">
          <Plus size={22}/>
        </div>
        <div className="font-medium text-base">Upload a new report</div>
        <div className="text-sm text-muted-foreground mt-1">Drag & drop a PDF or photo, or click to browse</div>
      </div>
    </button>
  );
}
