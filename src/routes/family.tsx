import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { useActiveMember, RELATIONSHIP_LABEL, type Member } from "@/contexts/active-member";
import { MemberAvatar, AddEditMemberModal, loadMemberMeta } from "@/components/member-switcher";
import { LivingGlow, GlassCard, Pill, Eyebrow, TabBar } from "@/components/lr";
import { Plus, Check } from "lucide-react";

export const Route = createFileRoute("/family")({
  head: () => ({
    meta: [
      { title: "Your circle | labread.health" },
      { name: "description", content: "Switch profiles — each family member keeps their own private record." },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://labread.health/family" }],
  }),
  component: FamilyPage,
});

const DAY_MS = 86_400_000;
// you + 2. One config constant — lift it (or tie to a paid tier) to allow more.
const MEMBER_CAP = 3;

type Meta = { flagged: number; total: number; inRange: number; last: string | null };

function FamilyPage() {
  const { user, loading } = useAuth();
  const { members, activeMemberId, setActiveMember } = useActiveMember();
  const nav = useNavigate();
  const [meta, setMeta] = useState<Map<string, Meta>>(new Map());
  const [protoDay, setProtoDay] = useState<Map<string, number>>(new Map());
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => { if (!loading && !user) nav({ to: "/auth" }); }, [user, loading, nav]);

  const load = useCallback(async () => {
    if (!user) return;
    setMeta(await loadMemberMeta());
    const { data: protos } = await supabase
      .from("health_protocols").select("member_id, starts_at").eq("status", "active").order("created_at", { ascending: false });
    const pd = new Map<string, number>();
    for (const p of (protos as { member_id: string | null; starts_at: string | null }[]) ?? []) {
      if (!p.member_id || pd.has(p.member_id) || !p.starts_at) continue;
      const elapsed = Math.floor((Date.now() - new Date(`${p.starts_at}T00:00:00`).getTime()) / DAY_MS);
      pd.set(p.member_id, Math.max(1, Math.min(90, elapsed + 1)));
    }
    setProtoDay(pd);
  }, [user]);

  useEffect(() => { load(); }, [load, members.length]);

  if (loading || !user) return null;

  const slotsLeft = Math.max(0, MEMBER_CAP - members.length);
  const switchTo = (m: Member) => { setActiveMember(m.id); nav({ to: "/dashboard" }); };

  const statusLine = (m: Member): string => {
    const md = meta.get(m.id);
    const day = protoDay.get(m.id);
    const parts: string[] = [];
    if (day) parts.push(`Day ${day}`);
    if (md) parts.push(md.flagged === 0 ? `${md.inRange}% in range` : `${md.flagged} to watch`);
    else parts.push("no test yet");
    return parts.join(" · ");
  };

  const tab = (key: string, label: string, icon: string, to: string, active = false) => ({
    key, label, icon, active, onClick: () => nav({ to }),
  });

  return (
    <div style={{ minHeight: "100dvh", background: "var(--void)", color: "var(--bone)", fontFamily: "var(--sans)" }}>
      <LivingGlow />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 440, margin: "0 auto", padding: "calc(env(safe-area-inset-top) + 22px) 18px 130px" }}>
        <h1 style={{ fontFamily: "var(--serif)", fontWeight: 500, fontSize: 30, lineHeight: 1 }}>Your circle</h1>
        <Eyebrow style={{ display: "block", marginTop: 8 }}>switch profile · up to {MEMBER_CAP - 1} family members</Eyebrow>

        {/* switcher row */}
        <div style={{ display: "flex", gap: 14, marginTop: 18, overflowX: "auto", paddingBottom: 4 }}>
          {members.map((m) => {
            const active = m.id === activeMemberId;
            return (
              <button
                key={m.id}
                onClick={() => switchTo(m)}
                style={{ all: "unset", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: "none" }}
              >
                <span style={{ borderRadius: "50%", padding: 2, boxShadow: active ? "0 0 0 1.5px var(--ember-glow), 0 0 16px rgba(255,150,60,.45)" : "0 0 0 1.5px var(--line)" }}>
                  <MemberAvatar member={m} size={46} />
                </span>
                <span style={{ fontSize: 11, color: active ? "var(--ember-glow)" : "var(--smoke)" }}>
                  {m.relationship === "self" ? "You" : m.name.split(" ")[0]}
                </span>
              </button>
            );
          })}
          {slotsLeft > 0 && (
            <button
              onClick={() => setAddOpen(true)}
              style={{ all: "unset", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: "none" }}
            >
              <span style={{ width: 46, height: 46, borderRadius: "50%", display: "grid", placeItems: "center", border: "1.5px dashed var(--line-warm)", color: "var(--ember-glow)" }}>
                <Plus size={20} />
              </span>
              <span style={{ fontSize: 11, color: "var(--ember-glow)" }}>Add</span>
            </button>
          )}
        </div>

        <Eyebrow style={{ display: "block", margin: "22px 0 8px" }}>members</Eyebrow>

        {/* member rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {members.map((m) => {
            const active = m.id === activeMemberId;
            const isSelf = m.relationship === "self";
            return (
              <GlassCard
                key={m.id}
                emphasis={active}
                onClick={() => switchTo(m)}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: 13, cursor: "pointer" }}
              >
                <MemberAvatar member={m} size={40} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>
                    {m.name}{isSelf ? " · you" : ""}
                  </div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 10.5, color: "var(--smoke)", marginTop: 2 }}>{statusLine(m)}</div>
                </div>
                {isSelf ? (
                  <Pill style={{ padding: "3px 9px", fontSize: 10 }}>owner</Pill>
                ) : active ? (
                  <Check size={16} style={{ color: "var(--ember-glow)" }} />
                ) : (
                  <span style={{ color: "var(--whisper)" }}>›</span>
                )}
              </GlassCard>
            );
          })}

          {/* empty slot */}
          {slotsLeft > 0 && (
            <button
              onClick={() => setAddOpen(true)}
              style={{
                all: "unset", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, padding: 13,
                border: "1.5px dashed var(--line-warm)", borderRadius: 16, background: "rgba(255,122,24,.05)",
              }}
            >
              <span style={{ width: 40, height: 40, borderRadius: "50%", flex: "none", display: "grid", placeItems: "center", border: "1.5px dashed var(--line-warm)", color: "var(--ember-glow)" }}>
                <Plus size={18} />
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ember-glow)" }}>Add a family member</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10.5, color: "var(--smoke)", marginTop: 2 }}>{slotsLeft} slot{slotsLeft === 1 ? "" : "s"} left</div>
              </div>
            </button>
          )}
        </div>

        {/* their data, their consent */}
        <GlassCard emphasis style={{ marginTop: 14, padding: 14 }}>
          <Eyebrow color="var(--ember-glow)">their data, their consent</Eyebrow>
          <div style={{ fontSize: 12.5, color: "var(--smoke)", marginTop: 6, lineHeight: 1.5 }}>
            Each member has their own private record, protocol and progress. Adding someone captures their consent first — you manage, you don't merge.
          </div>
        </GlassCard>

        <p style={{ marginTop: 18, textAlign: "center", fontFamily: "var(--mono)", fontSize: 9, letterSpacing: ".08em", color: "var(--whisper)" }}>
          labread is informational and not a medical diagnosis.
        </p>
      </div>

      <TabBar
        items={[
          tab("home", "Home", "◉", "/dashboard"),
          tab("protocol", "Protocol", "◈", "/protocol"),
          tab("anna", "Anna", "✦", "/chat"),
          tab("you", "You", "◐", "/family", true),
        ]}
      />

      {addOpen && <AddEditMemberModal member={null} standalone onClose={() => setAddOpen(false)} afterSave={() => setAddOpen(false)} />}
    </div>
  );
}
