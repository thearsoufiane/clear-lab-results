import type { ReactNode } from "react";
import type { Analysis } from "@/lib/supabase";

/* ------------------------------------------------------------------
   labread.health — Analysis View (redesigned to match landing theme)
   Warm orange palette · Fraunces + Hanken Grotesk · premium medical UI
   Drop-in replacement: same props, same data fields, normalizeName kept.
   ------------------------------------------------------------------ */

const C = {
  bg:        "#0b0a09",
  card:      "#141210",
  card2:     "#100e0c",
  glowCore:  "#ffc06a",
  glowMid:   "#f5851f",
  accent:    "#f5a04a",
  accentSoft:"rgba(245,160,74,0.14)",
  text:      "#f7f3ec",
  textDim:   "rgba(247,243,236,0.62)",
  textFaint: "rgba(247,243,236,0.36)",
  hairline:  "rgba(247,243,236,0.12)",
  low:       "#f0a93a",
  normal:    "#7fd6a3",
  elevated:  "#f06a5a",
  info:      "#9fc7ff",
  display:   "'Fraunces', Georgia, serif",
  body:      "'Hanken Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

function normalizeName(name: string): string {
  const abbrevMap: Record<string, string> = {
    wbc: "white blood cell", rbc: "red blood cell", hgb: "hemoglobin", hct: "hematocrit",
    mcv: "mean corpuscular volume", plt: "platelet", bun: "blood urea nitrogen",
    creatinine: "creatinine", ast: "aspartate aminotransferase", alt: "alanine aminotransferase",
    ggt: "gamma glutamyl transferase", ldh: "lactate dehydrogenase", tsh: "thyroid stimulating hormone",
    t3: "triiodothyronine", t4: "thyroxine", tg: "triglyceride", ldl: "low density lipoprotein",
    hdl: "high density lipoprotein", vldl: "very low density lipoprotein",
    "fasting glucose": "glucose", "blood glucose": "glucose", "blood sugar": "glucose",
    "total cholesterol": "cholesterol",
  };
  let normalized = name.toLowerCase().trim().replace(/\s*\([^)]*\)/g, "").trim();
  for (const [abbrev, full] of Object.entries(abbrevMap)) {
    if (normalized === abbrev || normalized.includes(` ${abbrev}`) || normalized.includes(`${abbrev} `)) {
      normalized = normalized.replace(new RegExp(`\\b${abbrev}\\b`, "gi"), full);
    }
  }
  return normalized.replace(/\s+/g, " ").trim();
}

export { normalizeName };

type MarkerValue = Analysis["values"][number];

function statusColor(status: string) {
  if (status === "high" || status === "elevated") return C.elevated;
  if (status === "low" || status === "deficient") return C.low;
  return C.normal;
}
function statusLabel(status: string) {
  if (status === "high") return "High";
  if (status === "elevated") return "Elevated";
  if (status === "low") return "Low";
  if (status === "deficient") return "Deficient";
  return "Optimal";
}
function pubmedHref(ref: string) {
  return ref.startsWith("PMID") ? `https://pubmed.ncbi.nlm.nih.gov/${ref.split(":")[1]}` : "#";
}

function SectionHead({ icon, title, count, tint }: { icon: string; title: string; count?: number; tint: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "8px 0 18px" }}>
      <div style={{ width: "30px", height: "30px", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", background: `${tint}1f`, border: `1px solid ${tint}3a` }}>{icon}</div>
      <div style={{ fontFamily: C.display, fontSize: "1.35rem", fontWeight: 600, letterSpacing: "-0.02em" }}>{title}</div>
      {typeof count === "number" && (
        <div style={{ marginLeft: "auto", fontSize: "12px", color: C.textDim, background: C.card2, padding: "4px 12px", borderRadius: "20px", border: `1px solid ${C.hairline}` }}>{count} markers</div>
      )}
    </div>
  );
}

export function AnalysisView({
  analysis: a,
  dateLabel,
  prevValues,
  isPaid,
  ctaSlot,
}: {
  analysis: Analysis;
  dateLabel?: string;
  prevValues?: Map<string, string>;
  isPaid?: boolean;
  /** Rendered after the markers but before the educational disclaimer (the 90-day CTA). */
  ctaSlot?: ReactNode;
}) {
  // Unrecognized markers (deterministic flagger couldn't classify) get their own
  // group; they're excluded from the normal/attention buckets rather than faked.
  const unrecognized = a.values.filter(v => v.unrecognized);
  const needsAttention = a.values.filter(v => !v.unrecognized && ["low", "high", "elevated", "deficient"].includes(v.status));
  const lookingGood = a.values.filter(v => !v.unrecognized && v.status === "normal");
  // Trends ("was X") are a paid feature — only surface previous values when unlocked.
  const trendValues = isPaid ? prevValues : undefined;
  const reportDate = dateLabel || new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  const title = a.title || "Your blood test, explained";

  return (
    <div style={{
      position: "relative",
      background: `radial-gradient(900px 600px at 92% -4%, rgba(245,133,31,0.12), transparent 58%), ${C.bg}`,
      color: C.text, fontFamily: C.body, padding: "36px 24px 48px", maxWidth: "720px", margin: "0 auto", borderRadius: "20px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Hanken+Grotesk:wght@400;500;600;700&display=swap');
        @keyframes lrRise { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:translateY(0) } }
        @keyframes lrGrow { from { transform: scaleX(0) } to { transform: scaleX(1) } }
        .lr-stagger > * { opacity:0; animation: lrRise .5s cubic-bezier(.22,1,.36,1) forwards; }
        .lr-stagger > *:nth-child(1){animation-delay:.04s}
        .lr-stagger > *:nth-child(2){animation-delay:.09s}
        .lr-stagger > *:nth-child(3){animation-delay:.14s}
        .lr-stagger > *:nth-child(4){animation-delay:.19s}
        .lr-stagger > *:nth-child(5){animation-delay:.24s}
        .lr-stagger > *:nth-child(6){animation-delay:.29s}
        .lr-stagger > *:nth-child(n+7){animation-delay:.34s}
        .lr-card { transition: border-color .25s, transform .25s, box-shadow .25s; }
        .lr-card:hover { transform: translateY(-2px); border-color: rgba(247,243,236,0.26) !important; box-shadow: 0 10px 34px rgba(0,0,0,.34); }
        .lr-ref:hover { color: ${C.accent} !important; border-color: ${C.accent}66 !important; }
      `}</style>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "20px", borderBottom: `1px solid ${C.hairline}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "11px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, ${C.glowCore}, ${C.glowMid})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: C.display, fontWeight: 600, color: "#1a0e02", fontSize: "15px", boxShadow: "0 0 20px rgba(245,133,31,0.5)" }}>l</div>
          <div style={{ fontFamily: C.display, fontSize: "1.1rem", fontWeight: 600 }}>labread<span style={{ color: C.textDim, fontWeight: 400 }}>.health</span></div>
        </div>
        <div style={{ fontSize: "13px", color: C.textFaint }}>{reportDate}</div>
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "16px", padding: "26px 0 22px", borderBottom: `1px solid ${C.hairline}`, marginBottom: "30px" }}>
        <div>
          <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.18em", color: C.accent, fontWeight: 600, marginBottom: "8px" }}>Your report</div>
          <h1 style={{ fontFamily: C.display, fontSize: "clamp(1.7rem, 4vw, 2.4rem)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.05, margin: 0 }}>{title}</h1>
        </div>
        {typeof a.health_score === "number" && (
          <div style={{ background: C.card, border: `1px solid ${C.hairline}`, borderRadius: "14px", padding: "10px 18px", textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: C.textDim, marginBottom: "2px" }}>Health score</div>
            <div style={{ fontFamily: C.display, fontSize: "1.7rem", fontWeight: 700, color: C.accent, lineHeight: 1 }}>{a.health_score}</div>
          </div>
        )}
      </div>

      {a.summary && (
        <div style={{ background: C.accentSoft, border: `1px solid ${C.accent}3a`, borderRadius: "16px", padding: "22px", marginBottom: "32px" }}>
          <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.16em", color: C.accent, marginBottom: "10px", fontWeight: 600 }}>Plain-English summary</div>
          <div style={{ fontSize: "1.02rem", color: C.text, lineHeight: 1.7 }}>{a.summary}</div>
        </div>
      )}

      {needsAttention.length > 0 && (
        <div style={{ marginBottom: "10px" }}>
          <SectionHead icon="!" title="Needs attention" count={needsAttention.length} tint={C.low} />
          <div className="lr-stagger">
            {needsAttention.map((v, i) => <BiomarkerCard key={i} value={v} prevValues={trendValues} />)}
          </div>
          <hr style={{ border: "none", borderTop: `1px solid ${C.hairline}`, margin: "30px 0" }} />
        </div>
      )}

      {lookingGood.length > 0 && (
        <div style={{ marginBottom: "10px" }}>
          <SectionHead icon="✓" title="Looking good" count={lookingGood.length} tint={C.normal} />
          <div className="lr-stagger">
            {lookingGood.map((v, i) => <BiomarkerCard key={i} value={v} prevValues={trendValues} />)}
          </div>
          <hr style={{ border: "none", borderTop: `1px solid ${C.hairline}`, margin: "30px 0" }} />
        </div>
      )}

      {unrecognized.length > 0 && (
        <div style={{ marginBottom: "10px" }}>
          <SectionHead icon="?" title="Couldn't auto-classify" count={unrecognized.length} tint={C.textDim} />
          <div style={{ fontSize: "13px", color: C.textFaint, margin: "-6px 0 14px" }}>
            We couldn't match these to a known reference range — review them with your provider.
          </div>
          <div className="lr-stagger">
            {unrecognized.map((v, i) => <BiomarkerCard key={i} value={v} prevValues={trendValues} />)}
          </div>
          <hr style={{ border: "none", borderTop: `1px solid ${C.hairline}`, margin: "30px 0" }} />
        </div>
      )}

      {a.screenings && a.screenings.length > 0 && (
        <div style={{ marginBottom: "10px" }}>
          <SectionHead icon="🩺" title="Recommended screenings" tint={C.accent} />
          <div className="lr-stagger">
            {a.screenings.map((s, i) => {
              const tint = s.urgency === "urgent" ? C.elevated : s.urgency === "routine" ? C.low : C.normal;
              const label = s.urgency === "urgent" ? "Worth prioritizing" : s.urgency === "routine" ? "Routine" : "Informational";
              return (
                <div key={i} className="lr-card" style={{ background: C.card, border: `1px solid ${C.hairline}`, borderLeft: `3px solid ${tint}`, borderRadius: "14px", padding: "18px 20px", marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "6px" }}>
                    <div style={{ fontWeight: 600, fontSize: "1rem" }}>{s.name}</div>
                    <div style={{ fontSize: "11px", fontWeight: 600, color: tint, background: `${tint}1f`, border: `1px solid ${tint}3a`, padding: "4px 10px", borderRadius: "100px", whiteSpace: "nowrap" }}>{label}</div>
                  </div>
                  <div style={{ fontSize: "0.95rem", color: C.textDim, lineHeight: 1.6 }}>{s.detail}</div>
                </div>
              );
            })}
          </div>
          <hr style={{ border: "none", borderTop: `1px solid ${C.hairline}`, margin: "30px 0" }} />
        </div>
      )}

      {isPaid && a.cancer_screening_flags && a.cancer_screening_flags.length > 0 && (
        <div style={{ marginBottom: "10px" }}>
          <SectionHead icon="🔬" title="Worth discussing with a doctor" tint={C.elevated} />
          <div style={{ fontSize: "13px", color: C.textDim, lineHeight: 1.6, marginBottom: "16px", marginTop: "-6px" }}>
            These are patterns that are sometimes worth a conversation with your doctor — they are <strong style={{ color: C.text }}>not a diagnosis</strong> and do not mean anything is wrong. Only a clinician can interpret them in context.
          </div>
          <div className="lr-stagger">
            {a.cancer_screening_flags.map((flag, i) => (
              <div key={i} className="lr-card" style={{ background: C.card, border: `1px solid ${C.hairline}`, borderLeft: `3px solid ${C.elevated}`, borderRadius: "14px", padding: "18px 20px", marginBottom: "12px" }}>
                <div style={{ fontWeight: 600, fontSize: "1rem", marginBottom: "6px" }}>{flag.title}</div>
                <div style={{ fontSize: "0.95rem", color: C.textDim, lineHeight: 1.6 }}>{flag.explanation}</div>
                {flag.action_steps && flag.action_steps.length > 0 && (
                  <div style={{ marginTop: "12px" }}>
                    {flag.action_steps.map((step, j) => (
                      <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: "9px", marginBottom: "7px", fontSize: "0.9rem", color: C.textDim }}>
                        <span style={{ color: C.accent, fontSize: "12px", marginTop: "3px", flexShrink: 0 }}>→</span>
                        <span style={{ lineHeight: 1.55 }}>{step}</span>
                      </div>
                    ))}
                  </div>
                )}
                {flag.references && flag.references.length > 0 && (
                  <div style={{ marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {flag.references.map((ref, j) => (
                      <a key={j} href={pubmedHref(ref)} target="_blank" rel="noopener noreferrer" className="lr-ref" style={{ fontSize: "11px", color: C.textFaint, border: `1px solid ${C.hairline}`, padding: "3px 9px", borderRadius: "100px", textDecoration: "none", transition: "color .2s, border-color .2s" }}>{ref}</a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <hr style={{ border: "none", borderTop: `1px solid ${C.hairline}`, margin: "30px 0" }} />
        </div>
      )}

      {isPaid && a.doctor_questions && a.doctor_questions.length > 0 && (
        <div style={{ marginBottom: "10px" }}>
          <SectionHead icon="💬" title="Questions for your doctor" tint={C.info} />
          <div style={{ fontSize: "13px", color: C.textDim, lineHeight: 1.6, marginBottom: "16px", marginTop: "-6px" }}>
            Bring these to your next appointment — they turn your results into a focused conversation.
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.hairline}`, borderLeft: `3px solid ${C.info}`, borderRadius: "14px", padding: "20px 22px" }}>
            {a.doctor_questions.map((q, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: i < a.doctor_questions!.length - 1 ? "14px" : "0" }}>
                <div style={{ fontFamily: C.display, fontSize: "13px", fontWeight: 600, color: C.info, background: `${C.info}1f`, width: "24px", height: "24px", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>{i + 1}</div>
                <div style={{ fontSize: "0.98rem", color: C.text, lineHeight: 1.55 }}>{q}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {ctaSlot}

      <div style={{ textAlign: "center", paddingTop: "28px", borderTop: `1px solid ${C.hairline}`, marginTop: "34px" }}>
        <div style={{ fontSize: "12px", color: C.textFaint, lineHeight: 1.7, marginBottom: "12px" }}>
          This report is educational and does not constitute medical advice or a diagnosis.<br />
          Always consult a qualified healthcare provider before making health decisions.
        </div>
        <div style={{ fontSize: "13px", color: C.textDim, fontWeight: 500 }}>
          <span style={{ color: C.accent }}>labread</span>.health · Bloodwork, translated. · © 2026
        </div>
      </div>
    </div>
  );
}

function BiomarkerCard({ value: v, prevValues }: { value: MarkerValue; prevValues?: Map<string, string> }) {
  const color = statusColor(v.status);
  const calculateDotPosition = (userValue: number, min: number, max: number) => {
    const range = max - min;
    if (range <= 0) return 50;
    return Math.max(0, Math.min(100, ((userValue - min) / range) * 100));
  };
  const userValue = v.normal_range ? parseFloat(v.value.match(/[\d.]+/)?.[0] || "0") : null;
  const dotPos = userValue !== null && v.normal_range ? calculateDotPosition(userValue, v.normal_range.min, v.normal_range.max) : null;
  const prev = prevValues?.get(normalizeName(v.name));

  return (
    <div className="lr-card" style={{ background: C.card, border: `1px solid ${C.hairline}`, borderLeft: `3px solid ${color}`, borderRadius: "14px", padding: "18px 20px", marginBottom: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px", marginBottom: "4px" }}>
        <div style={{ fontWeight: 600, fontSize: "1.02rem" }}>{v.name}</div>
        <div style={{ fontFamily: C.display, fontSize: "1.25rem", fontWeight: 600, color, lineHeight: 1, whiteSpace: "nowrap" }}>{v.value}</div>
      </div>
      {prev && prev !== v.value && (
        <div style={{ fontSize: "12px", color: C.textFaint, marginBottom: "8px" }}>was {prev}</div>
      )}
      {v.normal_range && (
        <div style={{ fontSize: "12px", color: C.textDim, marginBottom: "12px" }}>
          Normal {v.normal_range.min}–{v.normal_range.max}
          {v.optimal_range && <> · Optimal {v.optimal_range.min}–{v.optimal_range.max}</>}
        </div>
      )}
      {dotPos !== null && v.normal_range && (
        <div style={{ position: "relative", height: "7px", background: "rgba(247,243,236,0.08)", borderRadius: "4px", marginBottom: "14px", overflow: "visible" }}>
          {v.optimal_range && (
            <div style={{
              position: "absolute", height: "100%", background: `${C.normal}3a`, borderRadius: "4px",
              left: `${Math.max(0, ((v.optimal_range.min - v.normal_range.min) / (v.normal_range.max - v.normal_range.min)) * 100)}%`,
              width: `${Math.min(100, ((v.optimal_range.max - v.optimal_range.min) / (v.normal_range.max - v.normal_range.min)) * 100)}%`,
              transformOrigin: "left", animation: "lrGrow .6s cubic-bezier(.22,1,.36,1) both",
            }} />
          )}
          <div style={{ position: "absolute", top: "50%", left: `${dotPos}%`, transform: "translate(-50%, -50%)", width: "14px", height: "14px", borderRadius: "50%", border: `3px solid ${C.bg}`, background: color, boxShadow: `0 0 0 1px ${color}, 0 0 12px ${color}88` }} />
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "10px", flexWrap: "wrap" }}>
        <span style={{ display: "inline-block", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: "4px 10px", borderRadius: "100px", background: v.unrecognized ? "rgba(158,147,132,0.14)" : `${color}1f`, border: `1px solid ${v.unrecognized ? "rgba(158,147,132,0.4)" : `${color}3a`}`, color: v.unrecognized ? C.textDim : color }}>
          {v.unrecognized ? "Review manually" : statusLabel(v.status)}
        </span>
        {v.critical && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: "4px 10px", borderRadius: "100px", background: "rgba(224,112,106,0.16)", border: "1px solid rgba(224,112,106,0.55)", color: C.low }}>
            ⚠ Critical
          </span>
        )}
      </div>
      <div style={{ fontSize: "0.96rem", color: C.text, opacity: 0.86, lineHeight: 1.65 }}>{v.explanation}</div>
      {v.action_steps && v.action_steps.length > 0 && (
        <div style={{ marginTop: "12px" }}>
          {v.action_steps.map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "9px", marginBottom: "7px", fontSize: "0.9rem", color: C.textDim }}>
              <span style={{ color: C.accent, fontSize: "12px", marginTop: "3px", flexShrink: 0 }}>→</span>
              <span style={{ lineHeight: 1.55 }}>{step}</span>
            </div>
          ))}
        </div>
      )}
      {v.references && v.references.length > 0 && (
        <div style={{ marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {v.references.map((ref, i) => (
            <a key={i} href={pubmedHref(ref)} target="_blank" rel="noopener noreferrer" className="lr-ref" style={{ fontSize: "11px", color: C.textFaint, border: `1px solid ${C.hairline}`, padding: "3px 9px", borderRadius: "100px", textDecoration: "none", transition: "color .2s, border-color .2s" }}>{ref}</a>
          ))}
        </div>
      )}
    </div>
  );
}
