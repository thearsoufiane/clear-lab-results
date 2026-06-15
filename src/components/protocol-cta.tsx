import { useEffect, useState } from "react";
import { supabase, type Analysis } from "@/lib/supabase";
import { generateProtocol } from "@/lib/generate-protocol";
import { Loader2, Sparkles, ArrowRight } from "lucide-react";

type ExistingProtocol = { id: string; starts_at: string | null };

function dayOfProtocol(startsAt: string | null): number {
  if (!startsAt) return 1;
  const start = new Date(`${startsAt}T00:00:00`);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - start.getTime()) / 86_400_000);
  return Math.min(90, Math.max(1, diffDays + 1));
}

export function ProtocolCTA({
  userId,
  reportId,
  analysis,
}: {
  userId: string;
  reportId: string;
  analysis: Analysis;
}) {
  const [checking, setChecking] = useState(true);
  const [protocol, setProtocol] = useState<ExistingProtocol | null>(null);
  const [justCreated, setJustCreated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Is there already an active protocol linked to this report?
  useEffect(() => {
    let active = true;
    supabase
      .from("health_protocols")
      .select("id, starts_at")
      .eq("created_from_report_id", reportId)
      .eq("user_id", userId)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }: { data: ExistingProtocol | null }) => {
        if (!active) return;
        if (data) setProtocol(data);
        setChecking(false);
      });
    return () => {
      active = false;
    };
  }, [reportId, userId]);

  async function handleGenerate() {
    setGenerating(true);
    setError(null);
    try {
      const id = await generateProtocol(userId, reportId, analysis);
      setProtocol({ id, starts_at: new Date().toISOString().slice(0, 10) });
      setJustCreated(true);
    } catch (e) {
      setError((e as Error).message || "Something went wrong. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  // Avoid a flash of the CTA before we know whether a protocol already exists.
  if (checking) return null;

  // --- Protocol exists ------------------------------------------------------
  if (protocol) {
    return (
      <div className="glass rounded-2xl p-6 mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold flex items-center gap-2">
            <span className="text-success" aria-hidden>✓</span>
            {justCreated ? "Your 90-day plan is ready" : "90-day plan active"}
          </h3>
          {!justCreated && (
            <p className="text-sm text-muted-foreground mt-1">
              Day {dayOfProtocol(protocol.starts_at)} of 90
            </p>
          )}
        </div>
        <a
          href="/checkin"
          className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground font-medium rounded-full px-6 py-3 transition-colors min-h-[44px] whitespace-nowrap"
        >
          Go to daily check-in <ArrowRight size={16} />
        </a>
      </div>
    );
  }

  // --- No protocol yet — offer to generate one ------------------------------
  return (
    <div className="glass rounded-2xl p-6 mt-8">
      <h3 className="text-lg font-semibold">Ready to improve these numbers?</h3>
      <p className="text-sm text-muted-foreground mt-1">
        We'll build you a 90-day plan based on your flagged results.
      </p>
      <button
        onClick={handleGenerate}
        disabled={generating}
        className="mt-4 inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground font-medium rounded-full px-6 py-3 transition-colors disabled:opacity-40 min-h-[44px]"
      >
        {generating ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Building your plan...
          </>
        ) : (
          <>
            <Sparkles size={16} /> Generate my 90-day plan
          </>
        )}
      </button>
      {error && <p className="text-sm text-danger mt-3">{error}</p>}
    </div>
  );
}
