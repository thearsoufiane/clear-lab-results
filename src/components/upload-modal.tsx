import { useEffect, useState, useRef } from "react";
import { X, Upload, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import { fileToBase64 } from "@/lib/pdf";
import { analyzeLabReport } from "@/lib/analyze.functions";
import { useServerFn } from "@tanstack/react-start";
import { supabase, type Analysis } from "@/lib/supabase";

const STEPS = [
  "Extracting values",
  "Checking ranges",
  "Writing explanations",
  "Building recommendations",
];

export function UploadModal({
  open, onClose, userId, onCreated,
}: {
  open: boolean; onClose: () => void; userId: string; onCreated: (id: string) => void;
}) {
  const [tab, setTab] = useState<"pdf" | "image">("pdf");
  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const [phase, setPhase] = useState<"idle" | "running" | "error">("idle");
  const [step, setStep] = useState(0);
  const [err, setErr] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const analyze = useServerFn(analyzeLabReport);

  useEffect(() => {
    if (!open) { setFile(null); setPhase("idle"); setErr(null); setStep(0); }
  }, [open]);

  useEffect(() => {
    if (phase !== "running") return;
    const t = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 1800);
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
    try {
      const { base64, mimeType, fileName } = await fileToBase64(file);
      const analysis = (await analyze({ data: { base64, mimeType, fileName } })) as Analysis;
      const { data, error } = await supabase
        .from("reports")
        .insert({ user_id: userId, title: analysis.title || file.name, analysis, file_name: file.name })
        .select("id").single();
      if (error) throw error;
      onCreated(data.id);
    } catch (e: any) {
      setErr(e?.message || String(e));
      setPhase("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/70 backdrop-blur-sm animate-fade-up" onClick={onClose}>
      <div className="glass glass-glow w-full max-w-lg p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"><X size={18} /></button>

        {phase === "idle" && (
          <>
            <h3 className="text-2xl mb-1">Upload your report</h3>
            <p className="text-sm text-muted-foreground mb-5">PDF or image. Bloodwork from any lab.</p>
            <div className="flex gap-1 mb-4 p-1 bg-input/50 rounded-full text-sm">
              {(["pdf", "image"] as const).map((t) => (
                <button key={t} onClick={() => { setTab(t); setFile(null); }}
                  className={`flex-1 py-2 rounded-full transition flex items-center justify-center gap-2 ${tab === t ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  {t === "pdf" ? <FileText size={14}/> : <ImageIcon size={14}/>}
                  {t === "pdf" ? "PDF" : "Image"}
                </button>
              ))}
            </div>
            <div
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => { e.preventDefault(); setDrag(false); pickFile(e.dataTransfer.files?.[0] ?? null); }}
              onClick={() => inputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition ${drag ? "border-accent bg-accent/5" : "border-border hover:border-accent/60"}`}
            >
              <Upload size={28} className="mx-auto mb-3 text-accent" />
              {file ? (
                <div className="text-sm">
                  <div className="text-foreground font-medium truncate">{file.name}</div>
                  <div className="text-muted-foreground mt-1">{(file.size/1024).toFixed(0)} KB</div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">Drag & drop, or click to choose a {tab.toUpperCase()}</div>
              )}
              <input ref={inputRef} type="file" accept={accept} className="hidden"
                onChange={(e) => pickFile(e.target.files?.[0] ?? null)} />
            </div>
            <button
              disabled={!file}
              onClick={submit}
              className="w-full mt-5 bg-accent text-accent-foreground font-medium rounded-full py-3 accent-glow hover:scale-[1.01] transition disabled:opacity-40 disabled:hover:scale-100"
            >
              Analyze report
            </button>
          </>
        )}

        {phase === "running" && (
          <div className="py-6">
            <div className="flex items-center gap-2 mb-6">
              <Loader2 size={18} className="text-accent animate-spin" />
              <h3 className="text-xl">Analyzing</h3>
              <span className="ml-1 inline-flex gap-1">
                {[0,1,2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce-dot" style={{animationDelay: `${i*0.15}s`}}/>)}
              </span>
            </div>
            <div className="space-y-3">
              {STEPS.map((s, i) => (
                <div key={s} className={`flex items-center gap-3 text-sm transition ${i < step ? "text-muted-foreground" : i === step ? "text-foreground" : "text-muted-foreground/50"}`}>
                  <span className={`dot ${i < step ? "dot-normal" : i === step ? "dot-warn" : ""}`} style={i > step ? {background:"#2a2e36"} : undefined}/>
                  {s}
                </div>
              ))}
            </div>
          </div>
        )}

        {phase === "error" && (
          <div className="py-2">
            <h3 className="text-xl mb-2">Analysis failed</h3>
            <pre className="text-xs bg-danger/10 border border-danger/30 rounded-lg p-3 text-danger whitespace-pre-wrap break-words max-h-60 overflow-auto">{err}</pre>
            <div className="flex gap-2 mt-4">
              <button onClick={() => { setPhase("idle"); setErr(null); }} className="flex-1 glass py-2.5 rounded-full text-sm hover:bg-white/5">Try again</button>
              <button onClick={onClose} className="flex-1 bg-accent text-accent-foreground py-2.5 rounded-full text-sm">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
