import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase, type Report } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "@/components/logo";
import { HistorySidebar } from "@/components/history-sidebar";
import { ArrowLeft, ChevronDown, Stethoscope, AlertCircle, Info, User, Download } from "lucide-react";

export const Route = createFileRoute("/report/$id")({ component: ReportView });

function normalizeName(name: string): string {
  // Map of common medical abbreviations to full names
  const abbrevMap: Record<string, string> = {
    "wbc": "white blood cell",
    "rbc": "red blood cell",
    "hgb": "hemoglobin",
    "hct": "hematocrit",
    "mcv": "mean corpuscular volume",
    "plt": "platelet",
    "bun": "blood urea nitrogen",
    "creatinine": "creatinine",
    "ast": "aspartate aminotransferase",
    "alt": "alanine aminotransferase",
    "ggt": "gamma glutamyl transferase",
    "ldh": "lactate dehydrogenase",
    "tsh": "thyroid stimulating hormone",
    "t3": "triiodothyronine",
    "t4": "thyroxine",
    "tg": "triglyceride",
    "ldl": "low density lipoprotein",
    "hdl": "high density lipoprotein",
    "vldl": "very low density lipoprotein",
    "fasting glucose": "glucose",
    "blood glucose": "glucose",
    "blood sugar": "glucose",
    "total cholesterol": "cholesterol",
  };

  let normalized = name
    .toLowerCase()
    .trim()
    // Strip parentheses and content inside: "Hemoglobin (Hgb)" → "Hemoglobin "
    .replace(/\s*\([^)]*\)/g, "")
    .trim();

  // Replace known abbreviations
  for (const [abbrev, full] of Object.entries(abbrevMap)) {
    if (normalized === abbrev || normalized.includes(` ${abbrev}`) || normalized.includes(`${abbrev} `)) {
      normalized = normalized.replace(new RegExp(`\\b${abbrev}\\b`, "gi"), full);
    }
  }

  // Clean up multiple spaces
  normalized = normalized.replace(/\s+/g, " ").trim();

  return normalized;
}

function parseNumeric(s: string): number | null {
  const m = s.replace(/[<>]/g, "").match(/[\d.]+/);
  return m ? parseFloat(m[0]) : null;
}

function ValueDelta({ current, prev }: { current: string; prev: string }) {
  const cn = parseNumeric(current);
  const cp = parseNumeric(prev);
  if (cn !== null && cp !== null && cp !== 0) {
    const pct = ((cn - cp) / cp) * 100;
    const dir = Math.abs(pct) < 0.1 ? "→" : pct > 0 ? "↑" : "↓";
    const sign = pct > 0 ? "+" : "";
    return (
      <span className="ml-2 tabular-nums text-muted-foreground/60">
        {dir} {sign}{pct.toFixed(1)}%
        <span className="opacity-70"> (was {prev})</span>
      </span>
    );
  }
  if (prev !== current) {
    return <span className="ml-2 text-muted-foreground/60">→ was {prev}</span>;
  }
  return null;
}

function statusTone(s: string) {
  if (s === "normal") return { dot: "dot-normal", badge: "badge-normal", label: "Normal", color: "text-success" };
  if (s === "low" || s === "high") return { dot: "dot-warn", badge: "badge-warn", label: s.charAt(0).toUpperCase()+s.slice(1), color: "text-warning" };
  return { dot: "dot-bad", badge: "badge-bad", label: s.charAt(0).toUpperCase()+s.slice(1), color: "text-danger" };
}

function ReportView() {
  const { id } = Route.useParams();
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<Record<number, boolean>>({});

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
      <header className="px-6 py-4 border-b border-border/50 flex items-center justify-between sticky top-0 bg-background/70 backdrop-blur-md z-30">
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
        <main className="flex-1 min-w-0 px-6 py-10 animate-fade-up max-w-6xl mx-auto w-full">
        {error && <div className="glass p-4 text-danger border-danger/30">{error}</div>}
        {!report && !error && <div className="text-muted-foreground">Loading report…</div>}

        {report && (() => {
          const a = report.analysis;
          const flagged = a.values.filter(v => v.status !== "normal").length;
          const prevReport = reports.find(r => r.created_at < report.created_at) ?? null;
          const prevMap = new Map<string, string>(
            (prevReport?.analysis.values ?? []).map(v => [normalizeName(v.name), v.value])
          );
          return (
            <div className="grid lg:grid-cols-[1fr_320px] gap-8">
              <div>
                <div className="mb-8 relative">
                  <div className="aurora opacity-60" />
                  <div className="relative z-10">
                    <div className="text-xs text-muted-foreground mb-2 uppercase tracking-[0.18em]">{new Date(report.created_at).toLocaleDateString(undefined, { dateStyle: "long" })}</div>
                    <h1 className="text-5xl mb-3 gradient-text leading-tight">{a.title}</h1>
                    <p className="text-muted-foreground">{a.values.length} values analyzed{flagged>0 && <span className="text-warning"> · {flagged} flagged</span>}</p>
                  </div>
                </div>

                <div className="glass glass-glow p-5 mb-6">
                  <div className="text-sm text-muted-foreground mb-3">Summary</div>
                  <div className="grid grid-cols-3 gap-4">
                    <Summary n={a.values.filter(v=>v.status==="normal").length} label="Normal" tone="normal"/>
                    <Summary n={a.values.filter(v=>v.status==="low"||v.status==="high").length} label="Off-range" tone="warn"/>
                    <Summary n={a.values.filter(v=>v.status==="elevated"||v.status==="deficient").length} label="Concerning" tone="bad"/>
                  </div>
                </div>

                <div className="space-y-2 stagger">
                  {a.values.map((v, i) => {
                    const t = statusTone(v.status);
                    const isOpen = open[i] ?? v.status !== "normal";
                    return (
                      <div key={i} className="glass overflow-hidden hover:border-accent/20 transition-colors">
                        <button
                          onClick={() => setOpen(o => ({...o, [i]: !isOpen}))}
                          className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/[0.03] transition"
                        >
                          <span className={`dot ${t.dot}`} />
                          <div className="min-w-0 flex-1">
                            <div className="font-medium truncate">{v.name}</div>
                            <div className="text-xs text-muted-foreground mt-0.5 tabular-nums">
                              {v.value}
                              {(() => {
                                const prev = prevMap.get(normalizeName(v.name));
                                return prev ? <ValueDelta current={v.value} prev={prev} /> : null;
                              })()}
                            </div>
                          </div>
                          <span className={`badge-status ${t.badge}`}>{t.label}</span>
                          <ChevronDown size={16} className={`text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}/>
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 pt-0 text-sm text-muted-foreground border-t border-border/40 animate-fade-up">
                            <div className="pt-3 leading-relaxed">{v.explanation}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <aside className="lg:sticky lg:top-24 self-start space-y-4">
                <div className="glass glass-glow p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Stethoscope size={16} className="text-accent"/>
                    <h3 className="text-base">Recommended screenings</h3>
                  </div>
                  {a.screenings.length === 0 && (
                    <p className="text-sm text-muted-foreground">No additional screenings recommended.</p>
                  )}
                  <div className="space-y-3">
                    {a.screenings.map((s, i) => {
                      const urgent = s.urgency === "urgent";
                      const Icon = urgent ? AlertCircle : Info;
                      return (
                        <div key={i} className="border border-border/60 rounded-xl p-3">
                          <div className="flex items-start gap-2">
                            <Icon size={14} className={urgent ? "text-danger mt-0.5" : s.urgency === "routine" ? "text-warning mt-0.5" : "text-accent mt-0.5"}/>
                            <div className="min-w-0">
                              <div className="text-sm font-medium">{s.name}</div>
                              <div className="text-xs text-muted-foreground mt-1">{s.detail}</div>
                              <span className={`inline-block mt-2 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${urgent?"bg-danger/15 text-danger":s.urgency==="routine"?"bg-warning/15 text-warning":"bg-accent/15 text-accent"}`}>
                                {s.urgency}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground px-2">
                  This is an AI-generated explanation, not medical advice. Always discuss results with your doctor.
                </div>
              </aside>
            </div>
          );
        })()}
        </main>
      </div>
    </div>
  );
}

function Summary({ n, label, tone }: { n: number; label: string; tone: "normal"|"warn"|"bad" }) {
  const c = tone === "normal" ? "text-success" : tone === "warn" ? "text-warning" : "text-danger";
  return (
    <div>
      <div className={`text-3xl font-serif ${c}`}>{n}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
