import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase, type Report } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { useActiveMember } from "@/contexts/active-member";
import { Logo } from "@/components/logo";
import { HistorySidebar } from "@/components/history-sidebar";
import { ArrowLeft, FileText, ChevronRight, AlertTriangle, User } from "lucide-react";

export const Route = createFileRoute("/history")({ component: HistoryPage });

function HistoryPage() {
  const { user, loading } = useAuth();
  const { activeMemberId } = useActiveMember();
  const nav = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fetched, setFetched] = useState(false);

  useEffect(() => { if (!loading && !user) nav({ to: "/auth" }); }, [user, loading]);

  useEffect(() => {
    if (!user || !activeMemberId) return;
    supabase
      .from("reports")
      .select("*")
      .eq("member_id", activeMemberId)
      .order("created_at", { ascending: false })
      .then(({ data, error }: { data: Report[] | null; error: { message: string } | null }) => {
        if (error) setError(error.message);
        else setReports((data ?? []) as Report[]);
        setFetched(true);
      });
  }, [user, activeMemberId]);

  if (loading || !user) return null;

  const totalFlagged = reports.reduce(
    (a, r) => a + (r.analysis?.values?.filter(v => v.status !== "normal").length ?? 0), 0
  );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-4 border-b border-border/50 flex items-center justify-between sticky top-0 bg-background z-30">
        <Logo />
        <div className="flex items-center gap-2">
          <Link to="/profile" className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-white/5 transition" title="Profile">
            <User size={16}/>
          </Link>
          <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 px-2">
            <ArrowLeft size={14}/> Dashboard
          </Link>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        <HistorySidebar reports={reports} />

        <main className="flex-1 min-w-0 px-6 py-10">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="text-xs text-muted-foreground mb-2 uppercase tracking-[0.18em]">Archive</div>
              <h1 className="text-4xl md:text-5xl mb-2 gradient-text leading-tight">Report history</h1>
              <p className="text-muted-foreground">
                {reports.length} {reports.length === 1 ? "report" : "reports"}
                {totalFlagged > 0 && <span className="text-warning"> · {totalFlagged} flagged values</span>}
              </p>
            </div>

            {error && (
              <div className="glass p-4 text-sm text-danger border-danger/30">{error}</div>
            )}

            {!error && fetched && reports.length === 0 && (
              <div className="glass p-10 text-center text-sm text-muted-foreground">
                No reports yet. Upload your first lab from the dashboard.
              </div>
            )}

            <div className="space-y-3">
              {reports.map((r) => {
                const flagCount = r.analysis?.values?.filter(v => v.status !== "normal").length ?? 0;
                return (
                  <Link
                    key={r.id}
                    to="/report/$id"
                    params={{ id: r.id }}
                    className="glass p-4 flex items-center gap-4 hover:bg-white/[0.04] hover:border-accent/30 transition-colors group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent/25 to-accent/5 grid place-items-center text-accent shrink-0 border border-accent/15">
                      <FileText size={18}/>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">{r.title || r.file_name || "Untitled report"}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {new Date(r.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                        {" · "}{r.analysis?.values?.length ?? 0} values
                      </div>
                    </div>
                    {flagCount > 0 ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-warning bg-warning/10 border border-warning/30 px-2.5 py-1 rounded-full">
                        <AlertTriangle size={12}/> {flagCount} flagged
                      </span>
                    ) : (
                      <span className="text-xs text-success">All normal</span>
                    )}
                    <ChevronRight size={16} className="text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition"/>
                  </Link>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
