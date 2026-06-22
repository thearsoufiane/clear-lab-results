import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { useActiveMember, RELATIONSHIP_LABEL, type Member } from "@/contexts/active-member";
import { MemberAvatar, AddEditMemberModal, loadMemberMeta } from "@/components/member-switcher";
import { LrUi, GlassPanel, Eyebrow, Gauge, Reveal, LR_FONT_LINKS } from "@/components/lr-ui";
import { ArrowLeft, Plus } from "lucide-react";

export const Route = createFileRoute("/family")({
  head: () => ({
    meta: [
      { title: "Your family | labread.health" },
      { name: "description", content: "Everyone under one roof — each profile's health at a glance." },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://labread.health/family" }, ...LR_FONT_LINKS],
  }),
  component: FamilyPage,
});

const DAY_MS = 86_400_000;
type Meta = { flagged: number; total: number; inRange: number; last: string | null };

const css = `
  .lr-ui .fam-hero{position:relative;text-align:center;padding:8px 0 4px}
  .lr-ui .fam-hero::before{content:"";position:absolute;top:-80px;left:50%;transform:translateX(-50%);width:560px;max-width:120%;height:360px;
    background:radial-gradient(ellipse at center,rgba(245,133,63,.16),transparent 64%);filter:blur(26px);pointer-events:none;z-index:0}
  .lr-ui .fam-hero > *{position:relative;z-index:1}
  .lr-ui .fam-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px;margin-top:26px}
  .lr-ui .fam-card{padding:22px;text-align:center;position:relative;transition:.2s}
  .lr-ui .fam-card:hover{transform:translateY(-3px);border-color:rgba(245,166,35,.3)}
  .lr-ui .fam-nm{font-family:var(--serif);font-size:20px;margin-top:14px}
  .lr-ui .fam-rel{font-family:var(--mono);font-size:10px;color:var(--faint);text-transform:uppercase;letter-spacing:.08em;margin-top:3px}
  .lr-ui .fam-pill{font-family:var(--mono);font-size:10px;border-radius:999px;padding:4px 10px;border:1px solid;display:inline-block;margin-top:12px}
  .lr-ui .fam-pill.ok{color:var(--green);border-color:rgba(111,207,151,.3);background:rgba(111,207,151,.08)}
  .lr-ui .fam-pill.flag{color:var(--red);border-color:rgba(224,112,106,.3);background:rgba(224,112,106,.08)}
  .lr-ui .fam-pill.none{color:var(--faint);border-color:var(--line-soft)}
  .lr-ui .fam-meta{font-family:var(--mono);font-size:10px;color:var(--faint);margin-top:10px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
  .lr-ui .fam-meta b{color:var(--amber-lite);font-weight:500}
  .lr-ui .fam-switch{margin-top:16px;width:100%;border:1px solid var(--line);background:rgba(255,255,255,.02);color:var(--cream);border-radius:999px;
    padding:11px;font-size:13.5px;cursor:pointer;font-family:inherit;transition:.15s}
  .lr-ui .fam-switch:hover{border-color:rgba(245,166,35,.45);background:rgba(245,133,63,.06)}
  .lr-ui .fam-switch.active{background:var(--grad);color:#1a0f02;font-weight:600;border-color:transparent}
  .lr-ui .fam-add{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;min-height:230px;border:1px dashed var(--line);
    border-radius:18px;cursor:pointer;color:var(--amber-lite);background:rgba(255,255,255,.01);transition:.15s;font-family:inherit;font-size:14px}
  .lr-ui .fam-add:hover{border-color:rgba(245,166,35,.5);background:rgba(245,133,63,.04)}
  .lr-ui .fam-add .ic{width:48px;height:48px;border-radius:14px;background:rgba(245,133,63,.1);border:1px solid var(--line);display:grid;place-items:center}
`;

function FamilyPage() {
  const { user, loading } = useAuth();
  const { members, setActiveMember } = useActiveMember();
  const nav = useNavigate();
  const [meta, setMeta] = useState<Map<string, Meta>>(new Map());
  const [protoDay, setProtoDay] = useState<Map<string, number>>(new Map());
  const [loaded, setLoaded] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => { if (!loading && !user) nav({ to: "/auth" }); }, [user, loading, nav]);

  const load = useCallback(async () => {
    if (!user) return;
    const m = await loadMemberMeta();
    setMeta(m);
    const { data: protos } = await supabase
      .from("health_protocols").select("member_id, starts_at").eq("status", "active").order("created_at", { ascending: false });
    const pd = new Map<string, number>();
    for (const p of (protos as { member_id: string | null; starts_at: string | null }[]) ?? []) {
      if (!p.member_id || pd.has(p.member_id) || !p.starts_at) continue;
      const elapsed = Math.floor((Date.now() - new Date(`${p.starts_at}T00:00:00`).getTime()) / DAY_MS);
      pd.set(p.member_id, Math.max(1, Math.min(90, elapsed + 1)));
    }
    setProtoDay(pd);
    setLoaded(true);
  }, [user]);

  useEffect(() => { load(); }, [load, members.length]);

  if (loading || !user) return null;

  const switchTo = (m: Member) => { setActiveMember(m.id); nav({ to: "/dashboard" }); };

  return (
    <LrUi style={{ minHeight: "100vh", background: "var(--bg)" }} revealDeps={[loaded, members.length]}>
      {LR_FONT_LINKS.map((l, i) => <link key={i} {...l} />)}
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div style={{ maxWidth: 940, margin: "0 auto", padding: "22px 18px 80px" }}>
        <Link to="/dashboard" style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 6 }}>
          <ArrowLeft size={14} /> Dashboard
        </Link>

        <div className="fam-hero" style={{ marginTop: 24 }}>
          <Eyebrow>One account, the whole household</Eyebrow>
          <h1 style={{ fontSize: "clamp(32px,6vw,52px)", marginTop: 12 }}>Your <span style={{ fontStyle: "italic", color: "var(--amber-lite)" }}>family.</span></h1>
          <p style={{ color: "var(--muted)", fontSize: 16, marginTop: 12, maxWidth: 440, marginLeft: "auto", marginRight: "auto", lineHeight: 1.5 }}>
            Everyone under one roof. Each profile keeps its own results, protocol, and progress — private and encrypted.
          </p>
        </div>

        <div className="fam-grid">
          {members.map((m) => {
            const md = meta.get(m.id);
            const inRange = md ? md.inRange : 0;
            const day = protoDay.get(m.id);
            return (
              <Reveal key={m.id}>
                <GlassPanel className="fam-card">
                  <Gauge pct={inRange} size={104} stroke={7} ticks>
                    <MemberAvatar member={m} size={60} />
                  </Gauge>
                  <div className="fam-nm">{m.name}</div>
                  <div className="fam-rel">{RELATIONSHIP_LABEL[m.relationship]}</div>
                  <div>
                    {md ? (
                      <span className={"fam-pill " + (md.flagged === 0 ? "ok" : "flag")}>{md.flagged === 0 ? "all normal" : `${md.flagged} flagged`}</span>
                    ) : (
                      <span className="fam-pill none">no test yet</span>
                    )}
                  </div>
                  <div className="fam-meta">
                    {md ? <span><b>{inRange}%</b> in range</span> : <span>—</span>}
                    {md?.last && <span>· {new Date(md.last).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>}
                    {day && <span>· <b>Day {day}</b>/90</span>}
                  </div>
                  <button className="fam-switch" onClick={() => switchTo(m)}>View {m.relationship === "self" ? "yourself" : m.name.split(" ")[0]}</button>
                </GlassPanel>
              </Reveal>
            );
          })}

          <Reveal>
            <button className="fam-add" onClick={() => setAddOpen(true)}>
              <span className="ic"><Plus size={22} style={{ color: "var(--amber-lite)" }} /></span>
              Add a family member
            </button>
          </Reveal>
        </div>
      </div>

      {addOpen && <AddEditMemberModal member={null} standalone onClose={() => setAddOpen(false)} afterSave={() => setAddOpen(false)} />}
    </LrUi>
  );
}
