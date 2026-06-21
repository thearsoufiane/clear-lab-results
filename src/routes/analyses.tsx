import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase, type Report, type Analysis } from "@/lib/supabase";
import { LrUi, GlassPanel, Eyebrow, Reveal, LR_FONT_LINKS } from "@/components/lr-ui";
import { ArrowLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/analyses")({
  head: () => ({
    meta: [
      { title: "Analyses | labread.health" },
      { name: "description", content: "Every analysis across your patients." },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://labread.health/analyses" }, ...LR_FONT_LINKS],
  }),
  component: AnalysesPage,
});

type Patient = { id: string; full_name: string; initials: string | null };

function initialsOf(name: string, fallback = "·"): string {
  const ii = String(name ?? "").trim().split(/\s+/).slice(0, 2).map((p) => p[0] || "").join("").toUpperCase();
  return ii || fallback;
}
function abnormalCount(r: Report): number {
  return ((r.analysis?.values as Analysis["values"]) ?? []).filter((v) => v.status !== "normal").length;
}
function paramCount(r: Report): number {
  return ((r.analysis?.values as Analysis["values"]) ?? []).length;
}
function fmtDate(iso: string): string {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

const css = `
  .lr-ui button.an-row{appearance:none;font-family:inherit;color:inherit;border-radius:13px}
  .lr-ui .an-row{display:flex;align-items:center;gap:14px;padding:14px 16px;cursor:pointer;transition:.15s;width:100%;text-align:left}
  .lr-ui .an-row:hover{border-color:rgba(245,166,35,.3);transform:translateX(2px)}
  .lr-ui .an-row:focus-visible{outline:2px solid var(--amber-lite);outline-offset:2px}
  .lr-ui .an-av{width:40px;height:40px;border-radius:11px;flex-shrink:0;display:grid;place-items:center;font-family:var(--mono);font-weight:600;
    font-size:13px;background:rgba(245,133,63,.14);color:var(--amber-lite)}
  .lr-ui .an-nm{font-size:14.5px;font-weight:600}
  .lr-ui .an-meta{font-family:var(--mono);font-size:10.5px;color:var(--faint);margin-top:2px;letter-spacing:.03em}
  .lr-ui .an-right{margin-left:auto;display:flex;align-items:center;gap:12px}
  .lr-ui .an-params{font-family:var(--mono);font-size:11px;color:var(--muted)}
  .lr-ui .an-pill{font-family:var(--mono);font-size:10px;color:var(--red);border:1px solid rgba(224,112,106,.32);background:rgba(224,112,106,.08);border-radius:999px;padding:4px 9px;white-space:nowrap}
  .lr-ui .an-pill.ok{color:var(--green);border-color:rgba(111,207,151,.32);background:rgba(111,207,151,.08)}
  .lr-ui .an-chev{color:var(--faint);flex-shrink:0}
`;

function AnalysesPage() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [patients, setPatients] = useState<Map<string, Patient>>(new Map());
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => { if (!loading && !user) nav({ to: "/auth" }); }, [user, loading, nav]);

  const load = useCallback(async () => {
    if (!user) return;
    const [{ data: pts }, { data: reps }] = await Promise.all([
      supabase.from("patients").select("id, full_name, initials").eq("clinician_id", user.id),
      supabase.from("reports").select("*").not("patient_id", "is", null).order("created_at", { ascending: false }),
    ]);
    const m = new Map<string, Patient>();
    ((pts as Patient[]) ?? []).forEach((p) => m.set(p.id, p));
    setPatients(m);
    setReports((reps as Report[]) ?? []);
    setLoaded(true);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  if (loading || !user) return null;

  return (
    <LrUi style={{ minHeight: "100vh", background: "var(--bg)" }} revealDeps={[loaded]}>
      {LR_FONT_LINKS.map((l, i) => <link key={i} {...l} />)}
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "22px 18px 80px" }}>
        <Link to="/clinician" style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 6 }}>
          <ArrowLeft size={14} /> Patients
        </Link>

        <div style={{ marginTop: 22, marginBottom: 18 }}>
          <Eyebrow>Across all patients</Eyebrow>
          <h1 style={{ fontSize: "clamp(30px,5vw,42px)", marginTop: 10 }}>Analyses</h1>
        </div>

        {!loaded ? (
          <p style={{ color: "var(--muted)" }}>Loading…</p>
        ) : reports.length === 0 ? (
          <GlassPanel style={{ padding: 30, textAlign: "center", color: "var(--muted)" }}>
            <p style={{ fontSize: 15 }}>No analyses yet.</p>
            <p style={{ fontSize: 13.5, marginTop: 6 }}>Upload an analysis from a patient to see it here.</p>
          </GlassPanel>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {reports.map((r) => {
              const pid = (r as Report & { patient_id?: string }).patient_id;
              const p = pid ? patients.get(pid) : undefined;
              const name = p?.full_name ?? "Patient";
              const ab = abnormalCount(r);
              const ok = ab === 0;
              return (
                <Reveal key={r.id}>
                  <button
                    className="lr-glass an-row"
                    onClick={() => nav({ to: "/report/$id", params: { id: r.id } })}
                    aria-label={`Open ${name} analysis from ${fmtDate(r.created_at)}`}
                  >
                    <span className="an-av">{p?.initials || initialsOf(name)}</span>
                    <span>
                      <span className="an-nm" style={{ display: "block" }}>{name}</span>
                      <span className="an-meta" style={{ display: "block" }}>{fmtDate(r.created_at)} · {r.title || "Lab report"}</span>
                    </span>
                    <span className="an-right">
                      <span className="an-params">{paramCount(r)} params</span>
                      <span className={"an-pill" + (ok ? " ok" : "")}>{ok ? "all normal" : `${ab} flagged`}</span>
                      <ChevronRight size={16} className="an-chev" />
                    </span>
                  </button>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </LrUi>
  );
}
