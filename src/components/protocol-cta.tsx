import { useEffect, useState } from "react";
import { supabase, type Analysis } from "@/lib/supabase";
import { generateProtocol } from "@/lib/generate-protocol";
import { Loader2, Sparkles, ArrowRight } from "lucide-react";
import { LrUi, GradientButton, Eyebrow, Gauge, Reveal, LR_FONT_LINKS } from "@/components/lr-ui";

type ExistingProtocol = { id: string; starts_at: string | null };

function dayOfProtocol(startsAt: string | null): number {
  if (!startsAt) return 1;
  const start = new Date(`${startsAt}T00:00:00`);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - start.getTime()) / 86_400_000);
  return Math.min(90, Math.max(1, diffDays + 1));
}

const ctaCss = `
  .lr-ui .pc-band{position:relative;margin:8px 0;border-radius:22px;overflow:hidden;padding:clamp(24px,4vw,36px);
    background:var(--surface);border:1px solid var(--line);box-shadow:0 24px 60px rgba(0,0,0,.4)}
  .lr-ui .pc-band::before{content:"";position:absolute;top:-130px;right:-90px;width:500px;height:400px;
    background:radial-gradient(ellipse at center,rgba(245,133,63,.18),transparent 64%);filter:blur(28px);pointer-events:none}
  .lr-ui .pc-in{position:relative;z-index:1}
  .lr-ui .pc-h{font-family:var(--serif);font-weight:500;font-size:clamp(24px,3.6vw,34px);line-height:1.06}
  .lr-ui .pc-h .i{font-style:italic;color:var(--amber-lite)}
  .lr-ui .pc-sub{color:var(--muted);font-size:16px;margin-top:11px;max-width:460px;line-height:1.5}
  .lr-ui .pc-timeline{display:flex;gap:10px;margin:22px 0 6px;flex-wrap:wrap}
  .lr-ui .pc-pill{flex:1;min-width:130px;border:1px solid var(--line);border-radius:13px;padding:13px 15px;background:rgba(255,255,255,.015)}
  .lr-ui .pc-pill .w{font-family:var(--mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--amber)}
  .lr-ui .pc-pill .t{font-size:13px;color:var(--cream);margin-top:6px;line-height:1.4}
  .lr-ui .pc-err{color:var(--red);font-size:13px;margin-top:12px}
  .lr-ui .pc-row{display:flex;align-items:center;gap:22px;flex-wrap:wrap}
`;

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

  if (checking) return null;

  // --- Protocol exists ------------------------------------------------------
  if (protocol) {
    const day = dayOfProtocol(protocol.starts_at);
    return (
      <LrUi revealDeps={[true]} style={{ margin: "34px 0 8px" }}>
        {LR_FONT_LINKS.map((l, i) => <link key={i} {...l} />)}
        <style dangerouslySetInnerHTML={{ __html: ctaCss }} />
        <Reveal>
          <div className="pc-band">
            <div className="pc-in pc-row">
              <Gauge pct={(day / 90) * 100} size={86} stroke={7}>
                <div>
                  <div style={{ fontFamily: "var(--serif)", fontSize: 20, lineHeight: 1 }}>{day}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--muted)", letterSpacing: ".08em" }}>/ 90</div>
                </div>
              </Gauge>
              <div style={{ flex: 1, minWidth: 200 }}>
                <h3 className="pc-h" style={{ fontSize: 24 }}>{justCreated ? "Your 90-day plan is ready" : "90-day plan active"}</h3>
                {!justCreated && <p className="pc-sub" style={{ fontSize: 14.5, marginTop: 6 }}>Day {day} of 90 — keep your daily habits going.</p>}
                <a href="/checkin" className="lr-gbtn" style={{ marginTop: 14, textDecoration: "none" }}>
                  Go to daily check-in <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </LrUi>
    );
  }

  // --- No protocol yet — the hero moment ------------------------------------
  return (
    <LrUi revealDeps={[checking]} style={{ margin: "34px 0 8px" }}>
      {LR_FONT_LINKS.map((l, i) => <link key={i} {...l} />)}
      <style dangerouslySetInnerHTML={{ __html: ctaCss }} />
      <Reveal>
        <div className="pc-band">
          <div className="pc-in">
            <Eyebrow style={{ marginBottom: 14 }}>Your next step</Eyebrow>
            <h3 className="pc-h">Ready to improve these <span className="i">numbers?</span></h3>
            <p className="pc-sub">We'll build you a 90-day plan from your flagged results — food, supplements, and daily habits matched to exactly what your body needs.</p>
            <div className="pc-timeline">
              <div className="pc-pill"><div className="w">Weeks 1–4</div><div className="t">Kickstart — targeted food &amp; supplements</div></div>
              <div className="pc-pill"><div className="w">Weeks 5–8</div><div className="t">Build — daily habits that move markers</div></div>
              <div className="pc-pill"><div className="w">Weeks 9–12</div><div className="t">Re-test — watch your numbers move</div></div>
            </div>
            <GradientButton onClick={handleGenerate} disabled={generating} style={{ marginTop: 18 }}>
              {generating ? (
                <><Loader2 size={16} className="lr-spin" /> Building your plan…</>
              ) : (
                <><Sparkles size={16} /> Generate my 90-day plan</>
              )}
            </GradientButton>
            {error && <p className="pc-err">{error}</p>}
          </div>
        </div>
      </Reveal>
    </LrUi>
  );
}
