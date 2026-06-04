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

export function AnalysisView({
  analysis: a,
  dateLabel,
}: {
  analysis: Analysis;
  dateLabel?: string;
}) {
  // Separate biomarkers by status
  const needsAttention = a.values.filter(v => ["low", "high", "elevated", "deficient"].includes(v.status));
  const lookingGood = a.values.filter(v => v.status === "normal");

  // Format date
  const reportDate = dateLabel || new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  // Calculate user initials (placeholder - would come from user context)
  const initials = "JM";

  return (
    <div style={{ background: "#0a0f0d", color: "#e8ede9", fontFamily: "'DM Sans', sans-serif", padding: "32px 24px", maxWidth: "680px", margin: "0 auto" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", paddingBottom: "20px", borderBottom: "1px solid #1a2620" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", background: "#7dd4a3", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", color: "#0a0f0d", fontSize: "14px" }}>lr</div>
          <div style={{ fontSize: "16px", fontWeight: "600", letterSpacing: "-0.3px" }}>labread.health</div>
        </div>
        <div style={{ fontSize: "13px", color: "#7a8a80", fontFamily: "'DM Mono', monospace" }}>{reportDate}</div>
      </div>

      {/* Patient Bar */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 0 24px", borderBottom: "1px solid #1a2620", marginBottom: "28px" }}>
        <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "linear-gradient(135deg, #3a6b50, #7dd4a3)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "16px", color: "#0a0f0d" }}>
          {initials}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: "600", fontSize: "15px" }}>User</div>
          <div style={{ fontSize: "13px", color: "#7a8a80" }}>Bloodwork Analysis</div>
        </div>
        <div style={{ background: "#111916", border: "1px solid #1a2620", borderRadius: "12px", padding: "8px 16px", textAlign: "center" }}>
          <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1.2px", color: "#7a8a80", marginBottom: "2px" }}>Health Score</div>
          <div style={{ fontSize: "22px", fontWeight: "700", color: "#7dd4a3", fontFamily: "'DM Mono', monospace" }}>{a.health_score || "—"}</div>
        </div>
      </div>

      {/* Summary Card */}
      {a.summary && (
        <div style={{ background: "rgba(125, 212, 163, 0.08)", border: "1px solid #3a6b50", borderRadius: "12px", padding: "20px", marginBottom: "28px" }}>
          <div style={{ fontSize: "13px", textTransform: "uppercase", letterSpacing: "1.2px", color: "#7dd4a3", marginBottom: "8px", fontWeight: "600" }}>📋 Plain-English Summary</div>
          <div style={{ fontSize: "15px", color: "#e8ede9", lineHeight: "1.7" }}>{a.summary}</div>
        </div>
      )}

      {/* Needs Attention Section */}
      {needsAttention.length > 0 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", marginTop: "8px" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", background: "rgba(232, 184, 77, 0.12)" }}>⚠️</div>
            <div style={{ fontSize: "16px", fontWeight: "700", letterSpacing: "-0.3px" }}>Needs Attention</div>
            <div style={{ marginLeft: "auto", fontSize: "12px", color: "#7a8a80", fontFamily: "'DM Mono', monospace", background: "#111916", padding: "3px 10px", borderRadius: "20px", border: "1px solid #1a2620" }}>{needsAttention.length} markers</div>
          </div>

          {needsAttention.map((v, i) => (
            <BiomarkerCard key={i} value={v} />
          ))}

          <hr style={{ border: "none", borderTop: "1px solid #1a2620", margin: "28px 0" }} />
        </>
      )}

      {/* Looking Good Section */}
      {lookingGood.length > 0 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", marginTop: "8px" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", background: "rgba(93, 232, 138, 0.12)" }}>✓</div>
            <div style={{ fontSize: "16px", fontWeight: "700", letterSpacing: "-0.3px" }}>Looking Good</div>
            <div style={{ marginLeft: "auto", fontSize: "12px", color: "#7a8a80", fontFamily: "'DM Mono', monospace", background: "#111916", padding: "3px 10px", borderRadius: "20px", border: "1px solid #1a2620" }}>{lookingGood.length} markers</div>
          </div>

          {lookingGood.map((v, i) => (
            <BiomarkerCard key={i} value={v} />
          ))}

          <hr style={{ border: "none", borderTop: "1px solid #1a2620", margin: "28px 0" }} />
        </>
      )}

      {/* Cancer Screening Flags */}
      {a.cancer_screening_flags && a.cancer_screening_flags.length > 0 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", marginTop: "8px" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", background: "rgba(232, 93, 93, 0.12)" }}>🔬</div>
            <div style={{ fontSize: "16px", fontWeight: "700", letterSpacing: "-0.3px" }}>Cancer Screening Flags</div>
            <div style={{ marginLeft: "auto", fontSize: "12px", color: "#7a8a80", fontFamily: "'DM Mono', monospace", background: "#111916", padding: "3px 10px", borderRadius: "20px", border: "1px solid #1a2620" }}>{a.cancer_screening_flags.length} flags</div>
          </div>

          {a.cancer_screening_flags.map((flag, i) => (
            <div key={i} style={{ background: "#111916", border: "1px solid #3a2020", borderLeft: "3px solid #e85d5d", borderRadius: "12px", padding: "18px 20px", marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                <div style={{ fontWeight: "600", fontSize: "14px" }}>{flag.title}</div>
                <div style={{ color: "#e85d5d", fontFamily: "'DM Mono', monospace", fontSize: "14px", fontWeight: "600" }}>Flagged</div>
              </div>
              <div style={{ fontSize: "14px", color: "#a3b5a9", lineHeight: "1.6" }}>{flag.explanation}</div>
              {flag.action_steps && flag.action_steps.length > 0 && (
                <div style={{ marginTop: "10px" }}>
                  {flag.action_steps.map((step, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "6px", fontSize: "13px", color: "#a3b5a9" }}>
                      <span style={{ color: "#7dd4a3", fontSize: "11px", marginTop: "4px", flexShrink: 0 }}>→</span>
                      {step}
                    </div>
                  ))}
                </div>
              )}
              {flag.references && flag.references.length > 0 && (
                <div style={{ marginTop: "8px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {flag.references.map((ref, j) => (
                    <a key={j} href={ref.startsWith("PMID") ? `https://pubmed.ncbi.nlm.nih.gov/${ref.split(":")[1]}` : "#"} target="_blank" rel="noopener noreferrer" style={{ fontSize: "10px", color: "#3a6b50", fontFamily: "'DM Mono', monospace", cursor: "pointer", textDecoration: "none" }}>
                      [{ref}]
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          <hr style={{ border: "none", borderTop: "1px solid #1a2620", margin: "28px 0" }} />
        </>
      )}

      {/* Doctor Questions */}
      {a.doctor_questions && a.doctor_questions.length > 0 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", marginTop: "8px" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", background: "rgba(100, 160, 255, 0.12)" }}>💬</div>
            <div style={{ fontSize: "16px", fontWeight: "700", letterSpacing: "-0.3px" }}>Questions for Your Doctor</div>
          </div>

          <div style={{ background: "#111916", border: "1px solid #1a2620", borderLeft: "3px solid #64a0ff", borderRadius: "12px", padding: "18px 20px", marginBottom: "12px" }}>
            {a.doctor_questions.map((q, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: i < a.doctor_questions.length - 1 ? "10px" : "0" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", color: "#64a0ff", background: "rgba(100, 160, 255, 0.1)", width: "22px", height: "22px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>
                  {i + 1}
                </div>
                <div style={{ fontSize: "14px", color: "#e8ede9", lineHeight: "1.5" }}>{q}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Footer */}
      <div style={{ textAlign: "center", paddingTop: "24px", borderTop: "1px solid #1a2620", marginTop: "32px" }}>
        <div style={{ fontSize: "12px", color: "#7a8a80", lineHeight: "1.6", marginBottom: "12px" }}>
          This report is educational and does not constitute medical advice.<br />
          Always consult a qualified healthcare provider before making health decisions.<br />
          References available for all flagged markers.
        </div>
        <div style={{ fontSize: "13px", color: "#7a8a80", fontWeight: "500" }}>
          <span style={{ color: "#7dd4a3" }}>labread</span>.health · Bloodwork, translated. · © 2026
        </div>
      </div>
    </div>
  );
}

function BiomarkerCard({ value: v }: { value: any }) {
  const getColorClass = (status: string) => {
    if (status === "high") return "#e85d5d";
    if (status === "low") return "#e8b84d";
    return "#5de88a";
  };

  const getDotColor = (status: string) => {
    if (status === "high") return "#e85d5d";
    if (status === "low") return "#e8b84d";
    return "#5de88a";
  };

  const getStatusLabel = (status: string) => {
    if (status === "high") return "High";
    if (status === "low") return "Low";
    return "Optimal";
  };

  const calculateDotPosition = (userValue: number, min: number, max: number) => {
    const range = max - min;
    return Math.max(0, Math.min(100, ((userValue - min) / range) * 100));
  };

  const userValue = v.normal_range ? parseFloat(v.value.match(/[\d.]+/)?.[0] || "0") : null;
  const dotPos = userValue && v.normal_range ? calculateDotPosition(userValue, v.normal_range.min, v.normal_range.max) : null;

  return (
    <div style={{ background: "#111916", border: "1px solid #1a2620", borderRadius: "12px", padding: "18px 20px", marginBottom: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
        <div style={{ fontWeight: "600", fontSize: "14px" }}>{v.name}</div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "14px", fontWeight: "600", color: getColorClass(v.status) }}>{v.value}</div>
      </div>

      {v.normal_range && (
        <div style={{ fontSize: "12px", color: "#7a8a80", marginBottom: "10px", fontFamily: "'DM Mono', monospace" }}>
          Normal: {v.normal_range.min}–{v.normal_range.max} · Optimal: {v.optimal_range?.min || v.normal_range.min}–{v.optimal_range?.max || v.normal_range.max}
        </div>
      )}

      {dotPos !== null && (
        <div style={{ position: "relative", height: "6px", background: "#1a2620", borderRadius: "3px", marginBottom: "12px", overflow: "visible" }}>
          {v.optimal_range && (
            <div style={{ position: "absolute", height: "100%", background: "rgba(125, 212, 163, 0.25)", borderRadius: "3px", left: `${((v.optimal_range.min - v.normal_range!.min) / (v.normal_range!.max - v.normal_range!.min)) * 100}%`, width: `${((v.optimal_range.max - v.optimal_range.min) / (v.normal_range!.max - v.normal_range!.min)) * 100}%` }} />
          )}
          <div style={{ position: "absolute", top: "50%", transform: "translate(-50%, -50%)", left: `${dotPos}%`, width: "12px", height: "12px", borderRadius: "50%", border: "2px solid #0a0f0d", background: getDotColor(v.status) }} />
        </div>
      )}

      <div style={{ display: "inline-block", fontSize: "10px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.8px", padding: "3px 8px", borderRadius: "4px", marginBottom: "8px", background: v.status === "high" ? "rgba(232, 93, 93, 0.12)" : v.status === "low" ? "rgba(232, 184, 77, 0.12)" : "rgba(93, 232, 138, 0.12)", color: getColorClass(v.status) }}>
        {getStatusLabel(v.status)}
      </div>

      <div style={{ fontSize: "14px", color: "#a3b5a9", lineHeight: "1.6" }}>{v.explanation}</div>

      {v.action_steps && v.action_steps.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          {v.action_steps.map((step: string, i: number) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "6px", fontSize: "13px", color: "#a3b5a9" }}>
              <span style={{ color: "#7dd4a3", fontSize: "11px", marginTop: "4px", flexShrink: 0 }}>→</span>
              {step}
            </div>
          ))}
        </div>
      )}

      {v.references && v.references.length > 0 && (
        <div style={{ marginTop: "8px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {v.references.map((ref: string, i: number) => (
            <a key={i} href={ref.startsWith("PMID") ? `https://pubmed.ncbi.nlm.nih.gov/${ref.split(":")[1]}` : "#"} target="_blank" rel="noopener noreferrer" style={{ fontSize: "10px", color: "#3a6b50", fontFamily: "'DM Mono', monospace", cursor: "pointer", textDecoration: "none" }}>
              [{ref}]
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
