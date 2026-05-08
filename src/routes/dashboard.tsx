import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase, type Report } from "@/lib/supabase";
import { Logo } from "@/components/logo";
import { UploadModal } from "@/components/upload-modal";
import { FileText, AlertTriangle, Stethoscope, Plus, LogOut, ChevronRight } from "lucide-react";

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
    <div className="min-h-screen">
      <header className="px-6 py-5 border-b border-border/50 flex items-center justify-between sticky top-0 bg-background/70 backdrop-blur-md z-30">
        <Logo />
        <div className="flex items-center gap-3">
          <button onClick={() => setOpen(true)}
            className="hidden sm:inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-medium accent-glow hover:scale-[1.02] transition">
            <Plus size={14}/> New report
          </button>
          <button onClick={() => supabase.auth.signOut()}
            className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-white/5 transition" title="Sign out">
            <LogOut size={16}/>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 animate-fade-up relative">
        <div className="relative mb-10">
          <div className="aurora" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent accent-glow" />
              labread.health
            </div>
            <h1 className="text-5xl md:text-6xl mb-3 leading-[1.05] tracking-tight">
              {greeting},<br/>
              <span className="italic gradient-text">{name}</span>.
            </h1>
            <p className="text-muted-foreground text-lg">Here's the state of your bloodwork.</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-10 stagger">
          <Stat icon={FileText} label="Reports" value={reports.length} />
          <Stat icon={AlertTriangle} label="Flagged values" value={flagged} tone={flagged>0?"warn":"normal"} />
          <Stat icon={Stethoscope} label="Screenings due" value={screenings} tone={screenings>0?"warn":"normal"} />
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
          <div className="space-y-3">
            {reports.map((r) => {
              const flagCount = r.analysis?.values?.filter(v => v.status !== "normal").length ?? 0;
              return (
                <Link key={r.id} to="/report/$id" params={{ id: r.id }}
                  className="glass glass-glow p-4 flex items-center gap-4 hover:bg-white/[0.03] transition group">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 grid place-items-center text-accent shrink-0">
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
                  <ChevronRight size={16} className="text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 transition"/>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      <UploadModal open={open} onClose={() => setOpen(false)} userId={user.id}
        onCreated={(id) => { setOpen(false); nav({ to: "/report/$id", params: { id } }); }} />
    </div>
  );
}

function Stat({ icon: Icon, label, value, tone = "normal" }: { icon: any; label: string; value: number; tone?: "normal"|"warn" }) {
  return (
    <div className="glass glass-glow p-5">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
        <Icon size={14} className={tone === "warn" ? "text-warning" : "text-accent"} />
        {label}
      </div>
      <div className="text-3xl font-serif">{value}</div>
    </div>
  );
}

function UploadZone({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="w-full glass glass-glow border-dashed border-2 border-border/80 hover:border-accent/60 transition rounded-2xl p-8 text-center group">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-accent/10 text-accent mb-3 group-hover:scale-110 transition">
        <Plus size={20}/>
      </div>
      <div className="font-medium">Upload a new report</div>
      <div className="text-sm text-muted-foreground mt-1">Drag & drop a PDF or photo, or click to browse</div>
    </button>
  );
}
