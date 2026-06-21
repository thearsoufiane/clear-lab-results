import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase, type Report } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "@/components/logo";
import { HistorySidebar } from "@/components/history-sidebar";
import { AnalysisView, normalizeName } from "@/components/analysis-view";
import { ProtocolCTA } from "@/components/protocol-cta";
import { PaywallModal } from "@/components/paywall-modal";
import { ArrowLeft, User, Download } from "lucide-react";

export const Route = createFileRoute("/report/$id")({
  head: () => ({
    meta: [
      { title: "Your blood test report | labread.health" },
      { name: "description", content: "View your personalized blood test analysis and recommendations." },
      { name: "robots", content: "noindex" },
    ],
    links: [
      { rel: "canonical", href: "https://labread.health/report" },
    ],
  }),
  component: ReportView,
});

function ReportView() {
  const { id } = Route.useParams();
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => { if (!loading && !user) nav({ to: "/auth" }); }, [user, loading]);

  // Open the paywall once the report loads, unless it's already unlocked.
  useEffect(() => { if (report) setShowPaywall(!report.is_paid); }, [report]);

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
        <div className="flex items-center gap-1">
          {report && user && (
            <button
              onClick={async () => {
                const { generateReportPDF } = await import("@/lib/pdf-generator");
                generateReportPDF(report, user.email || "");
              }}
              className="text-muted-foreground hover:text-foreground p-2.5 rounded-full hover:bg-white/5 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Download PDF"
            >
              <Download size={16}/>
            </button>
          )}
          <Link to="/profile" className="text-muted-foreground hover:text-foreground p-2.5 rounded-full hover:bg-white/5 transition min-h-[44px] min-w-[44px] flex items-center justify-center" title="Profile">
            <User size={16}/>
          </Link>
          <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md min-h-[44px]">
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
          // TEMP: paywall disabled — force isPaid so every section renders for free.
          // Re-enable later by restoring `isPaid={report.is_paid}`.
          return (
            <AnalysisView
              analysis={report.analysis}
              dateLabel={dateLabel}
              prevValues={prevMap}
              isPaid={true}
              ctaSlot={<ProtocolCTA userId={user.id} reportId={report.id} analysis={report.analysis} />}
            />
          );
        })()}
        </main>
      </div>

      {/* TEMP: paywall disabled — all reports free for now. Re-enable by uncommenting. */}
      {/* {report && (
        <PaywallModal
          open={showPaywall}
          onClose={() => setShowPaywall(false)}
          reportId={report.id}
          onUnlock={() => {
            // reveal paid sections immediately without a reload
            setReport((r) => (r ? { ...r, is_paid: true } : r));
            setShowPaywall(false);
          }}
        />
      )} */}
    </div>
  );
}
