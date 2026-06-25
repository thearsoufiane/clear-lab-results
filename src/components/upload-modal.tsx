import { useEffect, useState, useRef } from "react";
import { X, Upload, FileText, Image as ImageIcon } from "lucide-react";
import { fileToBase64 } from "@/lib/pdf";
import { supabase, SUPABASE_ANON_KEY, FUNCTIONS_URL, type Analysis } from "@/lib/supabase";
import { LR_UI_CSS, LR_FONT_LINKS, LrDefs, GlassPanel, GradientButton, Gauge } from "@/components/lr-ui";

const STEPS = [
  "Extracting values",
  "Checking ranges",
  "Writing explanations",
  "Building recommendations",
];

const modalCss = `
  .lr-ui .um-ov{position:fixed;inset:0;z-index:60;display:grid;place-items:center;padding:16px;
    background:rgba(6,5,3,.72);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);animation:umFade .2s ease}
  @keyframes umFade{from{opacity:0}to{opacity:1}}
  .lr-ui .um-modal{position:relative;width:100%;max-width:560px;padding:36px;border-radius:20px;animation:umIn .26s cubic-bezier(.2,.8,.2,1)}
  @keyframes umIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:none}}
  .lr-ui .um-close{position:absolute;top:16px;right:16px;width:36px;height:36px;border-radius:10px;border:1px solid var(--line-soft);
    background:rgba(255,255,255,.02);color:var(--muted);display:grid;place-items:center;cursor:pointer;transition:.15s}
  .lr-ui .um-close:hover{color:var(--cream);border-color:var(--line)}
  .lr-ui .um-close:focus-visible{outline:2px solid var(--amber-lite);outline-offset:2px}
  .lr-ui .um-title{font-size:26px}
  .lr-ui .um-sub{font-family:var(--mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--faint);margin-top:7px}
  .lr-ui .um-seg{display:flex;gap:6px;margin:22px 0 18px;background:var(--surface-2);border:1px solid var(--line-soft);border-radius:999px;padding:5px}
  .lr-ui .um-seg button{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;border:none;background:none;color:var(--muted);
    font-family:var(--sans);font-size:14px;font-weight:500;padding:10px;border-radius:999px;cursor:pointer;transition:.15s}
  .lr-ui .um-seg button.on{background:var(--grad);color:#1a0f02;font-weight:600}
  .lr-ui .um-seg button svg{width:15px;height:15px}
  .lr-ui .um-drop{min-height:200px;border:1.5px dashed var(--line);border-radius:16px;display:flex;flex-direction:column;
    align-items:center;justify-content:center;gap:13px;text-align:center;padding:24px;cursor:pointer;transition:.18s;background:rgba(255,255,255,.01)}
  .lr-ui .um-drop:hover,.lr-ui .um-drop.drag{border-color:var(--amber);background:rgba(245,133,63,.06)}
  .lr-ui .um-drop .glyph{width:54px;height:54px;border-radius:14px;background:rgba(245,133,63,.1);border:1px solid var(--line);display:grid;place-items:center}
  .lr-ui .um-drop .glyph svg{width:26px;height:26px;color:var(--amber-lite)}
  .lr-ui .um-drop .dz-main{font-size:15px;color:var(--cream)}
  .lr-ui .um-drop .dz-sub{font-family:var(--mono);font-size:11px;color:var(--faint)}
  .lr-ui .um-file{font-size:15px;font-weight:600;color:var(--cream)}
  .lr-ui .um-file small{display:block;font-family:var(--mono);font-size:11px;color:var(--faint);font-weight:400;margin-top:4px}
  .lr-ui .um-cta{width:100%;margin-top:22px}
  .lr-ui .um-ahead{display:flex;align-items:center;gap:13px;margin-bottom:24px}
  .lr-ui .um-checklist{display:flex;flex-direction:column;gap:15px}
  .lr-ui .um-cstep{display:flex;align-items:center;gap:13px;font-size:15px;transition:.2s}
  .lr-ui .um-cstep .ic{width:24px;height:24px;border-radius:50%;flex-shrink:0;display:grid;place-items:center;border:1.5px solid var(--line)}
  .lr-ui .um-cstep.pending{color:var(--faint)}
  .lr-ui .um-cstep.active{color:var(--cream)}
  .lr-ui .um-cstep.done{color:var(--muted)}
  .lr-ui .um-cstep.active .ic{border-color:var(--amber)}
  .lr-ui .um-cstep.active .ic i{width:9px;height:9px;border-radius:50%;background:var(--grad);display:block}
  .lr-ui .um-cstep.done .ic{background:rgba(111,207,151,.15);border-color:rgba(111,207,151,.4)}
  .lr-ui .um-cstep.done .ic svg{width:13px;height:13px;stroke:var(--green);fill:none;stroke-width:3}
  .lr-ui .um-bar{height:6px;border-radius:99px;background:rgba(255,255,255,.06);overflow:hidden;position:relative;margin:26px 0 14px}
  .lr-ui .um-bar i{position:absolute;top:0;bottom:0;width:40%;border-radius:99px;background:var(--grad);animation:umBar 1.4s ease-in-out infinite}
  @keyframes umBar{0%{left:-42%}100%{left:100%}}
  .lr-ui .um-help{font-size:13px;color:var(--faint);line-height:1.5}
  .lr-ui .um-err{font-family:var(--mono);font-size:12px;color:var(--red);background:rgba(224,112,106,.08);border:1px solid rgba(224,112,106,.3);
    border-radius:12px;padding:13px;white-space:pre-wrap;word-break:break-word;max-height:240px;overflow:auto;margin-top:6px}
  .lr-ui .um-row{display:flex;gap:10px;margin-top:16px}
  .lr-ui .um-ghost{flex:1;border:1px solid var(--line);background:rgba(255,255,255,.02);color:var(--cream);border-radius:999px;padding:12px;font-size:14px;cursor:pointer;font-family:var(--sans)}
  .lr-ui .um-ghost:hover{border-color:rgba(245,166,35,.4)}
  @media(prefers-reduced-motion:reduce){.lr-ui .um-bar i{animation:none;width:100%;left:0;opacity:.5}}
  @media(max-width:560px){
    .lr-ui .um-ov{place-items:end center;padding:0}
    .lr-ui .um-modal{max-width:none;border-radius:20px 20px 0 0;padding:26px 20px calc(26px + env(safe-area-inset-bottom));animation:umSheet .28s cubic-bezier(.2,.8,.2,1)}
    @keyframes umSheet{from{transform:translateY(100%)}to{transform:none}}
  }
`;

export function UploadModal({
  open, onClose, userId, onCreated, patientId, memberId,
}: {
  open: boolean; onClose: () => void; userId: string; onCreated: (id: string) => void;
  /** When set (clinician flow), the created report is linked to this patient. */
  patientId?: string | null;
  /** When set (personal flow), the created report is linked to this family member. */
  memberId?: string | null;
}) {
  const [tab, setTab] = useState<"pdf" | "image">("pdf");
  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const [phase, setPhase] = useState<"idle" | "running" | "error">("idle");
  const [step, setStep] = useState(0);
  const [err, setErr] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) { setFile(null); setPhase("idle"); setErr(null); setStep(0); }
  }, [open]);

  useEffect(() => {
    if (phase !== "running") return;
    const t = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length)), 1800);
    return () => clearInterval(t);
  }, [phase]);

  if (!open) return null;

  const accept = tab === "pdf" ? "application/pdf,.pdf" : "image/*";

  const pickFile = (f: File | null) => {
    if (!f) return;
    setFile(f); setErr(null);
  };

  const submit = async () => {
    if (!file) return;
    setPhase("running"); setStep(0); setErr(null);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 180_000); // 3 min hard cap
    try {
      console.log("[analyze] preparing file", file.name, file.size);
      const { base64, mimeType, fileName } = await fileToBase64(file);
      const { data: profile } = await supabase
        .from("profiles").select("age,biological_sex,diabetes,heart_disease,high_blood_pressure,cancer_history,smoking")
        .eq("id", userId).maybeSingle();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error("Your session expired. Please sign in again and retry.");
      }
      console.log("[analyze] invoking edge function", { mimeType, hasSession: true });
      const t0 = performance.now();
      const response = await fetch(`${FUNCTIONS_URL}/analyze-report`, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          base64,
          mimeType,
          mediaType: mimeType,
          fileName,
          profile: profile ?? undefined,
        }),
      });
      const responseText = await response.text();
      console.log("[analyze] edge function returned in", Math.round(performance.now() - t0), "ms", { status: response.status });
      if (!response.ok) {
        throw new Error(`Edge function ${response.status}: ${responseText || response.statusText}`);
      }
      let analysis: Analysis;
      try {
        analysis = JSON.parse(responseText) as Analysis;
      } catch {
        throw new Error(`Edge function returned invalid JSON: ${responseText.slice(0, 400)}`);
      }
      if (!analysis || !Array.isArray((analysis as any).values)) {
        throw new Error("The analysis function returned no data. Try again or use a clearer image.");
      }
      const { data, error } = await supabase
        .from("reports")
        .insert({ user_id: userId, title: analysis.title || file.name, analysis, file_name: file.name, ...(patientId ? { patient_id: patientId } : {}), ...(memberId ? { member_id: memberId } : {}) })
        .select("id").single();
      if (error) throw error;
      onCreated(data.id);
    } catch (e: any) {
      console.error("[analyze] failed", e);
      const msg = e?.name === "AbortError"
        ? "The analysis took too long (over 3 minutes) and was cancelled. Please try a smaller or clearer file."
        : (e?.message || String(e));
      setErr(msg);
      setPhase("error");
    } finally {
      clearTimeout(timeoutId);
    }
  };

  return (
    <div className="lr-ui">
      <style dangerouslySetInnerHTML={{ __html: LR_UI_CSS + modalCss }} />
      {LR_FONT_LINKS.map((l, i) => <link key={i} {...l} />)}
      <LrDefs />

      <div className="um-ov" onClick={onClose}>
        <GlassPanel className="um-modal">
          <div onClick={(e) => e.stopPropagation()}>
            {phase !== "running" && (
              <button className="um-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
            )}

            {phase === "idle" && (
              <>
                <h3 className="um-title">Upload your report</h3>
                <div className="um-sub">PDF or image · bloodwork from any lab</div>

                <div className="um-seg" role="tablist">
                  {(["pdf", "image"] as const).map((t) => (
                    <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? "on" : ""} onClick={() => { setTab(t); setFile(null); }}>
                      {t === "pdf" ? <FileText /> : <ImageIcon />}
                      {t === "pdf" ? "PDF" : "Image"}
                    </button>
                  ))}
                </div>

                <div
                  className={"um-drop" + (drag ? " drag" : "")}
                  role="button"
                  tabIndex={0}
                  onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                  onDragLeave={() => setDrag(false)}
                  onDrop={(e) => { e.preventDefault(); setDrag(false); pickFile(e.dataTransfer.files?.[0] ?? null); }}
                  onClick={() => inputRef.current?.click()}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); inputRef.current?.click(); } }}
                >
                  <span className="glyph"><Upload /></span>
                  {file ? (
                    <div className="um-file">{file.name}<small>{(file.size / 1024).toFixed(0)} KB · click to replace</small></div>
                  ) : (
                    <>
                      <div className="dz-main">Drag &amp; drop, or click to choose</div>
                      <div className="dz-sub">{tab.toUpperCase()} · max 3 min to analyze</div>
                    </>
                  )}
                  <input ref={inputRef} type="file" accept={accept} className="sr-only" style={{ display: "none" }}
                    onChange={(e) => pickFile(e.target.files?.[0] ?? null)} />
                </div>

                <GradientButton className="um-cta" disabled={!file} onClick={submit}>Analyze report</GradientButton>
              </>
            )}

            {phase === "running" && (
              <>
                <div className="um-ahead">
                  <Gauge size={30} stroke={4} spin pct={72} />
                  <h3 className="um-title" style={{ fontSize: 24 }}>Analyzing</h3>
                </div>
                <div className="um-checklist">
                  {STEPS.map((s, i) => {
                    const state = i < step ? "done" : i === step ? "active" : "pending";
                    return (
                      <div key={s} className={`um-cstep ${state}`}>
                        <span className="ic">
                          {state === "done"
                            ? <svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
                            : state === "active" ? <i className="lr-pulse" /> : null}
                        </span>
                        {s}
                      </div>
                    );
                  })}
                </div>
                <div className="um-bar"><i /></div>
                <div className="um-help">Still working — large reports can take a couple of minutes.</div>
              </>
            )}

            {phase === "error" && (
              <>
                <h3 className="um-title" style={{ fontSize: 22 }}>Analysis failed</h3>
                <div className="um-sub" style={{ marginBottom: 10 }}>Something went wrong reading that file</div>
                <pre className="um-err">{err}</pre>
                <div className="um-row">
                  <button className="um-ghost" onClick={() => { setPhase("idle"); setErr(null); }}>Try again</button>
                  <GradientButton style={{ flex: 1 }} onClick={onClose}>Close</GradientButton>
                </div>
              </>
            )}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
