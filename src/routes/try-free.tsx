import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Upload, FileText, Image as ImageIcon, Loader2, ArrowRight, Lock, Sparkles } from "lucide-react";
import { Logo } from "@/components/logo";
import { AnalysisView } from "@/components/analysis-view";
import { fileToBase64 } from "@/lib/pdf";
import { SUPABASE_ANON_KEY, SUPABASE_URL, type Analysis } from "@/lib/supabase";
import { track, markGuestAnalysis } from "@/lib/analytics";

export const Route = createFileRoute("/try-free")({
  head: () => ({
    meta: [
      { title: "Try labread free — explain your blood test, no signup | labread" },
      {
        name: "description",
        content:
          "Upload one blood test and get a full plain-English explanation of every value instantly — free, no signup required.",
      },
    ],
    links: [
      { rel: "canonical", href: "https://labread.health/try-free" },
    ],
  }),
  component: GuestDemo,
});

const STEPS = ["Extracting values", "Checking ranges", "Writing explanations", "Building recommendations"];

function GuestDemo() {
  const [tab, setTab] = useState<"pdf" | "image">("pdf");
  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const [phase, setPhase] = useState<"idle" | "running" | "done" | "error">("idle");
  const [step, setStep] = useState(0);
  const [err, setErr] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (phase !== "running") return;
    const t = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length)), 1800);
    return () => clearInterval(t);
  }, [phase]);

  const accept = tab === "pdf" ? "application/pdf,.pdf" : "image/*";
  const pickFile = (f: File | null) => { if (f) { setFile(f); setErr(null); } };

  const submit = async () => {
    if (!file) return;
    setPhase("running"); setStep(0); setErr(null);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 180_000);
    try {
      const { base64, mimeType, fileName } = await fileToBase64(file);
      // Guest call: no user session. The analyze-report function has
      // verify_jwt=false, so the anon key authorizes it. Same model, same output.
      const response = await fetch(`${SUPABASE_URL}/functions/v1/analyze-report`, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ base64, mimeType, mediaType: mimeType, fileName }),
      });
      const responseText = await response.text();
      if (!response.ok) throw new Error(`Analysis service ${response.status}: ${responseText || response.statusText}`);
      let parsed: Analysis;
      try {
        parsed = JSON.parse(responseText) as Analysis;
      } catch {
        throw new Error("The analysis service returned an unexpected response. Please try again.");
      }
      if (!parsed || !Array.isArray((parsed as any).values)) {
        throw new Error("No data returned. Try again or use a clearer image.");
      }
      setAnalysis(parsed);
      setPhase("done");
      markGuestAnalysis();
      track("guest_analysis_completed", { values: parsed.values.length });
    } catch (e: any) {
      const msg = e?.name === "AbortError"
        ? "The analysis took too long (over 3 minutes) and was cancelled. Please try a smaller or clearer file."
        : (e?.message || String(e));
      setErr(msg);
      setPhase("error");
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const reset = () => { setPhase("idle"); setFile(null); setErr(null); setStep(0); };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-4 border-b border-border/50 flex items-center justify-between sticky top-0 bg-background z-30">
        <Link to="/" className="no-underline"><Logo /></Link>
        <div className="flex items-center gap-2">
          <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2.5 rounded-md min-h-[44px] flex items-center">
            Sign in
          </Link>
          <Link
            to="/auth"
            search={{ mode: "signup", from: "demo" }}
            className="text-[13px] sm:text-sm px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-accent text-accent-foreground font-medium min-h-[44px] flex items-center whitespace-nowrap"
          >
            Sign up to save results
          </Link>
        </div>
      </header>

      <main className="flex-1 min-w-0 px-6 py-10 max-w-6xl mx-auto w-full">
        {/* ── Upload (idle) ── */}
        {phase === "idle" && (
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 text-xs text-muted-foreground glass px-3 py-1.5 rounded-full mb-5">
                <Sparkles size={12} className="text-accent" /> Free · no signup required
              </div>
              <h1 className="text-3xl md:text-4xl tracking-tight mb-3">Explain my blood test</h1>
              <p className="text-muted-foreground">
                Upload one report and get every value explained in plain English — instantly.
              </p>
            </div>

            <div className="glass p-6">
              <div className="flex gap-1 mb-4 p-1 bg-input/50 rounded-full text-sm">
                {(["pdf", "image"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setTab(t); setFile(null); }}
                    className={`flex-1 py-2 rounded-full transition flex items-center justify-center gap-2 ${tab === t ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {t === "pdf" ? <FileText size={14} /> : <ImageIcon size={14} />}
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
                    <div className="text-muted-foreground mt-1">{(file.size / 1024).toFixed(0)} KB</div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">Drag & drop, or click to choose a {tab.toUpperCase()}</div>
                )}
                <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => pickFile(e.target.files?.[0] ?? null)} />
              </div>
              <button
                disabled={!file}
                onClick={submit}
                className="w-full mt-5 bg-accent text-accent-foreground font-medium rounded-full py-3 transition-colors disabled:opacity-40"
              >
                Analyze for free
              </button>
              <p className="text-center text-xs text-muted-foreground mt-3">
                Your file is processed and immediately deleted. Nothing is stored.
              </p>
            </div>
          </div>
        )}

        {/* ── Running ── */}
        {phase === "running" && (
          <div className="max-w-lg mx-auto glass p-8">
            <div className="flex items-center gap-2 mb-6">
              <Loader2 size={18} className="text-accent animate-spin" />
              <h2 className="text-xl">Analyzing</h2>
            </div>
            <div className="space-y-3">
              {STEPS.map((s, i) => (
                <div key={s} className={`flex items-center gap-3 text-sm ${i < step ? "text-muted-foreground" : i === step ? "text-foreground" : "text-muted-foreground/50"}`}>
                  <span className={`dot ${i < step ? "dot-normal" : i === step ? "dot-warn" : ""}`} style={i > step ? { background: "#2a2e36" } : undefined} />
                  {s}
                </div>
              ))}
            </div>
            {step >= STEPS.length && (
              <div className="mt-5 text-xs text-muted-foreground">Still working — large reports can take up to a couple of minutes.</div>
            )}
          </div>
        )}

        {/* ── Error ── */}
        {phase === "error" && (
          <div className="max-w-lg mx-auto glass p-8">
            <h2 className="text-xl mb-2">Analysis failed</h2>
            <pre className="text-xs bg-danger/10 border border-danger/30 rounded-lg p-3 text-danger whitespace-pre-wrap break-words max-h-60 overflow-auto">{err}</pre>
            <button onClick={reset} className="w-full mt-4 bg-accent text-accent-foreground py-2.5 rounded-full text-sm font-medium">Try again</button>
          </div>
        )}

        {/* ── Done: full results + upsell ── */}
        {phase === "done" && analysis && (
          <>
            <AnalysisView analysis={analysis} dateLabel="Your free analysis" />

            <div className="mt-12 max-w-3xl mx-auto">
              <div
                className="rounded-3xl p-8 md:p-10 text-center"
                style={{
                  background: "linear-gradient(150deg, rgba(200,240,216,0.10), rgba(200,240,216,0.03))",
                  border: "1px solid rgba(200,240,216,0.3)",
                }}
              >
                <div className="inline-flex items-center gap-2 text-xs text-muted-foreground mb-4">
                  <Lock size={13} className="text-accent" /> Free analysis complete
                </div>
                <h2 className="text-2xl md:text-3xl tracking-tight mb-3">
                  Want to save this as a PDF and run more analyses?
                </h2>
                <p className="text-muted-foreground mb-7 max-w-md mx-auto">
                  Create a free account to download this report as a PDF, track your results over
                  time, and analyze as many reports as you like.
                </p>
                <Link
                  to="/auth"
                  search={{ mode: "signup", from: "demo" }}
                  onClick={() => track("guest_signup_clicked", { source: "results_upsell" })}
                  className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-7 py-4 rounded-full font-medium transition-colors"
                >
                  Save as PDF + run more analyses <ArrowRight size={16} />
                </Link>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5"><Lock size={12} className="text-accent" /> PDF export</span>
                  <span className="inline-flex items-center gap-1.5"><Lock size={12} className="text-accent" /> Saved history</span>
                  <span className="inline-flex items-center gap-1.5"><Lock size={12} className="text-accent" /> Unlimited analyses</span>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
