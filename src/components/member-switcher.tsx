import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase, type Analysis } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import {
  useActiveMember, memberInitials, MEMBER_COLORS, RELATIONSHIP_LABEL,
  type Member, type Relationship,
} from "@/contexts/active-member";
import { LR_UI_CSS, LR_FONT_LINKS, LrDefs, GlassPanel, GradientButton } from "@/components/lr-ui";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";

const css = `
  .lr-ui .ms-ov{position:fixed;inset:0;z-index:70;display:grid;place-items:center;padding:16px;background:rgba(6,5,3,.72);
    backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);animation:msFade .18s ease}
  @keyframes msFade{from{opacity:0}to{opacity:1}}
  .lr-ui .ms-panel{width:100%;max-width:420px;padding:22px;border-radius:20px;animation:msIn .24s cubic-bezier(.2,.8,.2,1)}
  @keyframes msIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:none}}
  .lr-ui .ms-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
  .lr-ui .ms-title{font-family:var(--serif);font-size:21px}
  .lr-ui .ms-x{width:32px;height:32px;border-radius:9px;border:1px solid var(--line-soft);background:rgba(255,255,255,.02);color:var(--muted);display:grid;place-items:center;cursor:pointer}
  .lr-ui .ms-x:hover{color:var(--cream)}
  .lr-ui .ms-row{display:flex;align-items:center;gap:13px;padding:11px;border-radius:13px;cursor:pointer;transition:.14s;width:100%;text-align:left;border:1px solid transparent;background:none;font-family:inherit;color:inherit}
  .lr-ui .ms-row:hover{background:rgba(255,255,255,.03)}
  .lr-ui .ms-row.on{border-color:var(--line);background:rgba(245,133,63,.07)}
  .lr-ui .ms-av{border-radius:50%;display:grid;place-items:center;font-family:var(--mono);font-weight:600;color:#1a0f02;flex-shrink:0}
  .lr-ui .ms-nm{font-size:15px;font-weight:600}
  .lr-ui .ms-rel{font-family:var(--mono);font-size:10px;color:var(--faint);text-transform:uppercase;letter-spacing:.06em;margin-top:2px}
  .lr-ui .ms-right{margin-left:auto;display:flex;flex-direction:column;align-items:flex-end;gap:5px;flex-shrink:0}
  .lr-ui .ms-pill{font-family:var(--mono);font-size:9.5px;border-radius:999px;padding:3px 8px;border:1px solid;white-space:nowrap}
  .lr-ui .ms-pill.ok{color:var(--green);border-color:rgba(111,207,151,.3);background:rgba(111,207,151,.08)}
  .lr-ui .ms-pill.flag{color:var(--red);border-color:rgba(224,112,106,.3);background:rgba(224,112,106,.08)}
  .lr-ui .ms-pill.none{color:var(--faint);border-color:var(--line-soft)}
  .lr-ui .ms-date{font-family:var(--mono);font-size:9.5px;color:var(--faint)}
  .lr-ui .ms-check{color:var(--amber-lite);flex-shrink:0}
  .lr-ui .ms-edit{font-family:var(--mono);font-size:9.5px;color:var(--faint);cursor:pointer;text-decoration:underline}
  .lr-ui .ms-add{width:100%;margin-top:10px;border:1px dashed var(--line);border-radius:13px;padding:13px;display:flex;align-items:center;justify-content:center;gap:8px;
    font-size:13.5px;color:var(--amber-lite);cursor:pointer;background:none;font-family:inherit;transition:.15s}
  .lr-ui .ms-add:hover{border-color:rgba(245,166,35,.45);background:rgba(245,133,63,.04)}

  .lr-ui .mf{margin-bottom:13px}
  .lr-ui .mf label{display:block;font-family:var(--mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--faint);margin-bottom:6px}
  .lr-ui .mf input,.lr-ui .mf select{width:100%;background:rgba(0,0,0,.3);border:1px solid var(--line-soft);border-radius:10px;padding:11px 13px;color:var(--cream);font-size:14px;font-family:var(--sans)}
  .lr-ui .mf input:focus,.lr-ui .mf select:focus{outline:none;border-color:var(--amber)}
  .lr-ui .mf-row{display:flex;gap:10px}.lr-ui .mf-row .mf{flex:1}
  .lr-ui .swatches{display:flex;gap:9px;flex-wrap:wrap}
  .lr-ui .swatch{width:30px;height:30px;border-radius:50%;cursor:pointer;border:2px solid transparent;transition:.12s}
  .lr-ui .swatch.on{border-color:var(--cream);transform:scale(1.08)}
  .lr-ui .ms-actions{display:flex;gap:10px;margin-top:18px}
  .lr-ui .ms-cancel{flex:1;border:1px solid var(--line-soft);background:none;border-radius:999px;padding:12px;color:var(--muted);cursor:pointer;font-family:inherit;font-size:14px}
  .lr-ui .ms-danger{font-family:var(--mono);font-size:11px;color:var(--red);cursor:pointer;margin-top:16px;background:none;border:none;padding:0}
  .lr-ui .ms-warn{border:1px solid rgba(224,112,106,.35);background:rgba(224,112,106,.07);border-radius:12px;padding:13px;margin-top:14px;font-size:13px;color:var(--cream);line-height:1.5}
  .lr-ui .ms-err{color:var(--red);font-size:13px;margin-top:10px}
  @media(max-width:560px){
    .lr-ui .ms-ov{place-items:end center;padding:0}
    .lr-ui .ms-panel{max-width:none;border-radius:20px 20px 0 0;padding:20px 18px calc(20px + env(safe-area-inset-bottom));animation:msSheet .26s cubic-bezier(.2,.8,.2,1)}
    @keyframes msSheet{from{transform:translateY(100%)}to{transform:none}}
  }
`;

type MemberMeta = { flagged: number; total: number; inRange: number; last: string | null };

export function MemberAvatar({ member, size = 42 }: { member: Member; size?: number }) {
  return (
    <span
      className="ms-av"
      style={{ width: size, height: size, fontSize: size * 0.34, background: member.color, boxShadow: `0 0 0 2px var(--bg), 0 0 0 4px ${member.color}55` }}
    >
      {memberInitials(member.name)}
    </span>
  );
}

function shortDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/** Reusable: fetch latest-report meta per member (flagged / in-range / last test). */
export async function loadMemberMeta(): Promise<Map<string, MemberMeta>> {
  const { data } = await supabase
    .from("reports").select("member_id, created_at, analysis").not("member_id", "is", null).order("created_at", { ascending: false });
  const m = new Map<string, MemberMeta>();
  for (const r of (data as { member_id: string; created_at: string; analysis: Analysis }[]) ?? []) {
    if (!r.member_id || m.has(r.member_id)) continue; // first per member = latest
    const vals = (r.analysis?.values as Analysis["values"]) ?? [];
    const flagged = vals.filter((v) => v.status !== "normal").length;
    m.set(r.member_id, { flagged, total: vals.length, inRange: vals.length ? Math.round(((vals.length - flagged) / vals.length) * 100) : 0, last: r.created_at });
  }
  return m;
}

export function MemberSwitcher({ variant = "sidebar" }: { variant?: "sidebar" | "appbar" }) {
  const { members, activeMember, activeMemberId, setActiveMember } = useActiveMember();
  const [open, setOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [meta, setMeta] = useState<Map<string, MemberMeta>>(new Map());

  useEffect(() => {
    if (!open) return;
    loadMemberMeta().then(setMeta);
  }, [open]);

  if (!activeMember) return null;

  const Trigger =
    variant === "appbar" ? (
      <button onClick={() => setOpen(true)} aria-label="Switch member" style={{ all: "unset", cursor: "pointer", display: "grid", placeItems: "center" }}>
        <MemberAvatar member={activeMember} size={30} />
      </button>
    ) : (
      <button className="s-prof" onClick={() => setOpen(true)} style={{ all: "unset", display: "flex", alignItems: "center", gap: 11, cursor: "pointer", width: "100%", paddingBottom: 16 }}>
        <MemberAvatar member={activeMember} size={42} />
        <span style={{ minWidth: 0 }}>
          <span className="s-name" style={{ display: "block" }}>{activeMember.name}</span>
          <span className="s-handle" style={{ display: "flex", alignItems: "center", gap: 5 }}>
            {RELATIONSHIP_LABEL[activeMember.relationship]} <ChevronsUpDown size={11} />
          </span>
        </span>
      </button>
    );

  return (
    <>
      {Trigger}

      {(open || addOpen) && (
        <div className="lr-ui">
          <style dangerouslySetInnerHTML={{ __html: LR_UI_CSS + css }} />
          {LR_FONT_LINKS.map((l, i) => <link key={i} {...l} />)}
          <LrDefs />

          {open && !addOpen && (
            <div className="ms-ov" onClick={() => setOpen(false)}>
              <GlassPanel className="ms-panel" >
                <div onClick={(e) => e.stopPropagation()}>
                  <div className="ms-head">
                    <span className="ms-title">Who are we looking at?</span>
                    <button className="ms-x" onClick={() => setOpen(false)} aria-label="Close"><X size={16} /></button>
                  </div>

                  {members.map((m) => {
                    const md = meta.get(m.id);
                    const active = m.id === activeMemberId;
                    return (
                      <div key={m.id} className={"ms-row" + (active ? " on" : "")} role="button" tabIndex={0}
                        onClick={() => { setActiveMember(m.id); setOpen(false); }}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActiveMember(m.id); setOpen(false); } }}>
                        <MemberAvatar member={m} size={42} />
                        <span style={{ minWidth: 0 }}>
                          <span className="ms-nm" style={{ display: "block" }}>{m.name}</span>
                          <span className="ms-rel" style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            {RELATIONSHIP_LABEL[m.relationship]}
                            <button className="ms-edit" onClick={(e) => { e.stopPropagation(); setEditing(m); setAddOpen(true); }}>edit</button>
                          </span>
                        </span>
                        <span className="ms-right">
                          {md ? (
                            <span className={"ms-pill " + (md.flagged === 0 ? "ok" : "flag")}>{md.flagged === 0 ? "all normal" : `${md.flagged} flagged`}</span>
                          ) : (
                            <span className="ms-pill none">no test</span>
                          )}
                          <span className="ms-date">{md ? shortDate(md.last) : "—"}</span>
                        </span>
                        {active && <Check size={18} className="ms-check" />}
                      </div>
                    );
                  })}

                  <button className="ms-add" onClick={() => { setEditing(null); setAddOpen(true); }}>
                    <Plus size={15} /> Add family member
                  </button>
                </div>
              </GlassPanel>
            </div>
          )}

          {addOpen && (
            <AddEditMemberModal
              member={editing}
              onClose={() => { setAddOpen(false); setEditing(null); }}
              afterSave={() => { setAddOpen(false); setEditing(null); setOpen(false); }}
            />
          )}
        </div>
      )}
    </>
  );
}

/* Branded add/edit member modal. Renders its own .lr-ui when standalone (e.g. /family),
   or composes inside MemberSwitcher's wrapper. */
export function AddEditMemberModal({
  member, onClose, afterSave, standalone = false,
}: {
  member: Member | null;
  onClose: () => void;
  afterSave?: (id: string, isNew: boolean) => void;
  standalone?: boolean;
}) {
  const { user } = useAuth();
  const { reload, setActiveMember } = useActiveMember();
  const nav = useNavigate();
  const isEdit = !!member;

  const [name, setName] = useState(member?.name ?? "");
  const [rel, setRel] = useState<Relationship>(member?.relationship ?? "child");
  const [dob, setDob] = useState(member?.dob ?? "");
  const [age, setAge] = useState(member?.age != null ? String(member.age) : "");
  const [sex, setSex] = useState(member?.sex ?? "");
  const [color, setColor] = useState(member?.color ?? MEMBER_COLORS[0]);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [confirmRemove, setConfirmRemove] = useState(false);

  async function save() {
    if (!user) return;
    if (!name.trim()) { setErr("Please enter a name."); return; }
    setSaving(true); setErr(null);
    // TODO: enforce plan limits (Personal 1 / Family up to 5 / Household more)
    const payload = {
      name: name.trim(), relationship: rel,
      dob: dob || null, age: age ? parseInt(age, 10) : null, sex: sex || null, color,
    };
    try {
      if (isEdit && member) {
        const { error } = await supabase.from("members").update(payload).eq("id", member.id);
        if (error) throw error;
        await reload();
        afterSave?.(member.id, false);
        onClose();
      } else {
        const { data, error } = await supabase.from("members")
          .insert({ owner_user_id: user.id, ...payload }).select("id").single();
        if (error) throw error;
        await reload();
        setActiveMember(data.id as string);
        afterSave?.(data.id as string, true);
        onClose();
        // prompt to upload their first report
        nav({ to: "/dashboard" });
      }
    } catch (e: any) {
      setErr(e?.message || String(e));
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!member) return;
    setSaving(true); setErr(null);
    try {
      const { error } = await supabase.from("members").delete().eq("id", member.id); // cascade deletes their data
      if (error) throw error;
      const list = await reload();
      const self = list.find((m) => m.relationship === "self");
      if (self) setActiveMember(self.id);
      afterSave?.(member.id, false);
      onClose();
    } catch (e: any) {
      setErr(e?.message || String(e));
    } finally {
      setSaving(false);
    }
  }

  const body = (
    <div className="ms-ov" onClick={onClose}>
      <GlassPanel className="ms-panel">
        <div onClick={(e) => e.stopPropagation()}>
          <div className="ms-head">
            <span className="ms-title">{isEdit ? "Edit member" : "Add a family member"}</span>
            <button className="ms-x" onClick={onClose} aria-label="Close"><X size={16} /></button>
          </div>

          <div className="mf">
            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sara" autoFocus />
          </div>
          <div className="mf-row">
            <div className="mf">
              <label>Relationship</label>
              <select value={rel} onChange={(e) => setRel(e.target.value as Relationship)} disabled={member?.relationship === "self"}>
                {member?.relationship === "self" && <option value="self">Self</option>}
                <option value="partner">Partner</option>
                <option value="child">Child</option>
                <option value="parent">Parent</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="mf">
              <label>Sex</label>
              <select value={sex} onChange={(e) => setSex(e.target.value)}>
                <option value="">—</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="mf-row">
            <div className="mf">
              <label>Date of birth</label>
              <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
            </div>
            <div className="mf">
              <label>or Age</label>
              <input value={age} onChange={(e) => setAge(e.target.value.replace(/[^\d]/g, ""))} placeholder="—" inputMode="numeric" />
            </div>
          </div>
          <div className="mf">
            <label>Accent color</label>
            <div className="swatches">
              {MEMBER_COLORS.map((c) => (
                <button key={c} type="button" aria-label={`color ${c}`} className={"swatch" + (color === c ? " on" : "")} style={{ background: c }} onClick={() => setColor(c)} />
              ))}
            </div>
          </div>

          {err && <p className="ms-err">{err}</p>}

          <div className="ms-actions">
            <button className="ms-cancel" onClick={onClose}>Cancel</button>
            <GradientButton style={{ flex: 2 }} onClick={save} disabled={saving}>
              {saving ? "Saving…" : isEdit ? "Save changes" : "Add member"}
            </GradientButton>
          </div>

          {isEdit && member?.relationship !== "self" && (
            confirmRemove ? (
              <div className="ms-warn">
                Remove <b>{member?.name}</b>? This permanently deletes their reports, protocol and progress.
                <div className="ms-actions" style={{ marginTop: 12 }}>
                  <button className="ms-cancel" onClick={() => setConfirmRemove(false)}>Keep</button>
                  <button className="ms-cancel" style={{ flex: 2, borderColor: "rgba(224,112,106,.5)", color: "var(--red)" }} onClick={remove} disabled={saving}>
                    {saving ? "Removing…" : "Delete forever"}
                  </button>
                </div>
              </div>
            ) : (
              <button className="ms-danger" onClick={() => setConfirmRemove(true)}>Remove this member</button>
            )
          )}
        </div>
      </GlassPanel>
    </div>
  );

  if (!standalone) return body;
  return (
    <div className="lr-ui">
      <style dangerouslySetInnerHTML={{ __html: LR_UI_CSS + css }} />
      {LR_FONT_LINKS.map((l, i) => <link key={i} {...l} />)}
      <LrDefs />
      {body}
    </div>
  );
}
