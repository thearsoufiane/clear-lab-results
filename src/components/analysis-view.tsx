import { useState } from "react";
import { ChevronDown, Stethoscope, AlertCircle, Info, MessageSquare, Beaker } from "lucide-react";
import type { Analysis } from "@/lib/supabase";

// Map of common medical abbreviations to full names (used for trend matching)
function normalizeName(name: string): string {
  const abbrevMap: Record<string, string> = {
    wbc: "white blood cell",
    rbc: "red blood cell",
    hgb: "hemoglobin",
    hct: "hematocrit",
    mcv: "mean corpuscular volume",
    plt: "platelet",
    bun: "blood urea nitrogen",
    creatinine: "creatinine",
    ast: "aspartate aminotransferase",
    alt: "alanine aminotransferase",
    ggt: "gamma glutamyl transferase",
    ldh: "lactate dehydrogenase",
    tsh: "thyroid stimulating hormone",
    t3: "triiodothyronine",
    t4: "thyroxine",
    tg: "triglyceride",
    ldl: "low density lipoprotein",
    hdl: "high density lipoprotein",
    vldl: "very low density lipoprotein",
    "fasting glucose": "glucose",
    "blood glucose": "glucose",
    "blood sugar": "glucose",
    "total cholesterol": "cholesterol",
  };

  let normalized = name
    .toLowerCase()
    .trim()
    .replace(/\s*\([^)]*\)/g, "")
    .trim();

  for (const [abbrev, full] of Object.entries(abbrevMap)) {
    if (normalized === abbrev || normalized.includes(` ${abbrev}`) || normalized.includes(`${abbrev} `)) {
      normalized = normalized.replace(new RegExp(`\\b${abbrev}\\b`, "gi"), full);
    }
  }

  normalized = normalized.replace(/\s+/g, " ").trim();
  return normalized;
}

export { normalizeName };

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
        {dir} {sign}
        {pct.toFixed(1)}%<span className="opacity-70"> (was {prev})</span>
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
  if (s === "low" || s === "high") return { dot: "dot-warn", badge: "badge-warn", label: s.charAt(0).toUpperCase() + s.slice(1), color: "text-warning" };
  return { dot: "dot-bad", badge: "badge-bad", label: s.charAt(0).toUpperCase() + s.slice(1), color: "text-danger" };
}

function Summary({ n, label, tone }: { n: number; label: string; tone: "normal" | "warn" | "bad" }) {
  const c = tone === "normal" ? "text-success" : tone === "warn" ? "text-warning" : "text-danger";
  return (
    <div>
      <div className={`text-3xl font-serif ${c}`}>{n}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

/**
 * Shared analysis renderer used by both the logged-in report page and guest
 * demo mode — identical output, no restrictions.
 *
 * @param analysis   The analysis object to render.
 * @param dateLabel  Eyebrow label above the title (e.g. a formatted date).
 * @param prevValues Optional map of normalized-name → value for trend deltas.
 */
export function AnalysisView({
  analysis: a,
  dateLabel,
  prevValues,
}: {
  analysis: Analysis;
  dateLabel?: string;
  prevValues?: Map<string, string>;
}) {
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const flagged = a.values.filter((v) => v.status !== "normal").length;

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-8">
      <div>
        <div className="mb-8 relative">
          <div className="relative z-10">
            {dateLabel && (
              <div className="text-xs text-muted-foreground mb-2 uppercase tracking-[0.18em]">{dateLabel}</div>
            )}
            <h1 className="text-5xl mb-3 gradient-text leading-tight">{a.title}</h1>
            <p className="text-muted-foreground">
              {a.values.length} values analyzed
              {flagged > 0 && <span className="text-warning"> · {flagged} flagged</span>}
            </p>
          </div>
        </div>

        <div className="glass p-5 mb-6">
          <div className="text-sm text-muted-foreground mb-3">Summary</div>
          <div className="grid grid-cols-3 gap-4">
            <Summary n={a.values.filter((v) => v.status === "normal").length} label="Normal" tone="normal" />
            <Summary n={a.values.filter((v) => v.status === "low" || v.status === "high").length} label="Off-range" tone="warn" />
            <Summary n={a.values.filter((v) => v.status === "elevated" || v.status === "deficient").length} label="Concerning" tone="bad" />
          </div>
        </div>

        <div className="space-y-2">
          {a.values.map((v, i) => {
            const t = statusTone(v.status);
            const isOpen = open[i] ?? v.status !== "normal";
            return (
              <div key={i} className="glass overflow-hidden hover:border-accent/20 transition-colors">
                <button
                  onClick={() => setOpen((o) => ({ ...o, [i]: !isOpen }))}
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/[0.03] transition"
                >
                  <span className={`dot ${t.dot}`} />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{v.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 tabular-nums">
                      {v.value}
                      {(() => {
                        const prev = prevValues?.get(normalizeName(v.name));
                        return prev ? <ValueDelta current={v.value} prev={prev} /> : null;
                      })()}
                    </div>
                  </div>
                  <span className={`badge-status ${t.badge}`}>{t.label}</span>
                  <ChevronDown size={16} className={`text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-0 text-sm text-muted-foreground border-t border-border/40">
                    <div className="pt-3 leading-relaxed">{v.explanation}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Cancer Screening Flags */}
        {a.cancer_screening_flags && a.cancer_screening_flags.length > 0 ? (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <Beaker size={18} className="text-danger" />
              <h2 className="text-lg font-medium">
                🔬 Cancer Screening Flags
              </h2>
            </div>
            <div className="space-y-3">
              {a.cancer_screening_flags.map((flag, i) => (
                <div
                  key={i}
                  className="glass overflow-hidden border-l-4"
                  style={{ borderLeftColor: "#e85d5d" }}
                >
                  <div className="p-4">
                    <h3 className="font-medium text-sm mb-2">{flag.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {flag.explanation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-8 glass p-4">
            <p className="text-sm text-muted-foreground">
              ✓ No cancer screening flags detected based on your current panel.
            </p>
          </div>
        )}

        {/* Questions for Your Doctor */}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare size={18} className="text-[#64a0ff]" />
            <h2 className="text-lg font-medium">Questions for Your Doctor</h2>
          </div>
          {a.doctor_questions && a.doctor_questions.length > 0 ? (
            <div className="space-y-3">
              {a.doctor_questions.map((question, i) => (
                <div
                  key={i}
                  className="glass overflow-hidden border-l-4"
                  style={{ borderLeftColor: "#64a0ff" }}
                >
                  <div className="p-4 flex gap-3">
                    <div className="w-6 h-6 rounded-md bg-[#64a0ff]/20 flex items-center justify-center text-[#64a0ff] text-xs font-medium shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-sm leading-relaxed">{question}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass p-4 border-l-4" style={{ borderLeftColor: "#64a0ff" }}>
              <p className="text-sm text-muted-foreground">
                All your values are normal. Ask your doctor about: (1) monitoring frequency for your age and risk factors, (2) when to retest, and (3) any preventive measures specific to your health history.
              </p>
            </div>
          )}
        </div>
      </div>

      <aside className="lg:sticky lg:top-24 self-start space-y-4">
        <div className="glass p-5">
          <div className="flex items-center gap-2 mb-4">
            <Stethoscope size={16} className="text-accent" />
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
                    <Icon size={14} className={urgent ? "text-danger mt-0.5" : s.urgency === "routine" ? "text-warning mt-0.5" : "text-accent mt-0.5"} />
                    <div className="min-w-0">
                      <div className="text-sm font-medium">{s.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{s.detail}</div>
                      <span className={`inline-block mt-2 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${urgent ? "bg-danger/15 text-danger" : s.urgency === "routine" ? "bg-warning/15 text-warning" : "bg-accent/15 text-accent"}`}>
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
}
