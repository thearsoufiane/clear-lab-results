import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase, type Report } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "@/components/logo";
import { HistorySidebar } from "@/components/history-sidebar";
import { AnalysisView, normalizeName } from "@/components/analysis-view";
import { ArrowLeft, User, Download } from "lucide-react";

export const Route = createFileRoute("/report/$id")({ component: ReportView });

function ReportView() {
  const { id } = Route.useParams();
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { if (!loading && !user) nav({ to: "/auth" }); }, [user, loading]);

  useEffect(() => {
    if (!user) return;
    supabase.from("reports").select("*").eq("id", id).single().then(({ data, error }) => {
      if (error) setError(error.message);
      else setReport(data as Report);
    });
    supabase.from("reports").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setReports(data as Report[]);
    });
  }, [user, id]);

  if (loading || !user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-4 border-b border-border/50 flex items-center justify-between sticky top-0 bg-background z-30">
        <Logo />
        <div className="flex items-center gap-2">
          {report && user && (
            <button
              onClick={async () => {
                const { generateReportPDF } = await import("@/lib/pdf-generator");
                generateReportPDF(report, user.email || "");
              }}
              className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-white/5 transition"
              title="Download PDF"
            >
              <Download size={16}/>
            </button>
          )}
          <Link to="/profile" className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-white/5 transition" title="Profile">
            <User size={16}/>
          </Link>
          <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 px-2">
            <ArrowLeft size={14}/> Dashboard
          </Link>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        <HistorySidebar reports={reports} currentId={id} />
        <main className="flex-1 min-w-0 px-6 py-10 max-w-6xl mx-auto w-full">
        {error && <div className="glass p-4 text-danger border-danger/30">{error}</div>}
        {!report && !error && <div className="text-muted-foreground">Loading report…</div>}

        {report && (() => {
          const prevReport = reports.find(r => r.created_at < report.created_at) ?? null;
          const prevMap = new Map<string, string>(
            (prevReport?.analysis.values ?? []).map(v => [normalizeName(v.name), v.value])
          );
          const dateLabel = new Date(report.created_at).toLocaleDateString(undefined, { dateStyle: "long" });
          return <AnalysisView analysis={report.analysis} dateLabel={dateLabel} prevValues={prevMap} />;
        })()}
        </main>
      </div>
    </div>
  );
}
