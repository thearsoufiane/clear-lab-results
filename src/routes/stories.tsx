import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useActiveMember } from "@/contexts/active-member";
import { supabase } from "@/lib/supabase";
import { LivingGlow, GlassCard, Pill, Eyebrow, EmberButton, TabBar } from "@/components/lr";
import { appTabs } from "@/components/app-tabs";
import { X } from "lucide-react";

export const Route = createFileRoute("/stories")({
  head: () => ({
    meta: [
      { title: "Stories | labread.health" },
      { name: "description", content: "Real people, real reports — stories from the 90-day protocol." },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://labread.health/stories" }],
  }),
  component: StoriesPage,
});

type Story = {
  id: string; title: string; body: string | null; image_url: string | null; likes: number; featured: boolean;
  name?: string; city?: string; result?: string; headline?: string; accent?: string; theme?: string;
};

const STORY_GRAD: Record<string, string> = {
  iron: "radial-gradient(120% 90% at 30% 20%, #ff8a2c, transparent 60%),linear-gradient(160deg,#c2410c,#3a1505 80%)",
  energy: "radial-gradient(120% 90% at 30% 20%, #FFB066, transparent 60%),linear-gradient(160deg,#B23A0C,#2a1206 80%)",
  thyroid: "radial-gradient(120% 90% at 30% 20%, #FF9D45, transparent 60%),linear-gradient(160deg,#7A2D0B,#2a1206 80%)",
};
const TOPICS = [
  { key: "energy", label: "energy ⚡" }, { key: "iron", label: "iron 🩸" }, { key: "sleep", label: "sleep 🌙" },
  { key: "thyroid", label: "thyroid 🦋" }, { key: "gut", label: "gut 🌿" }, { key: "stress", label: "stress 🧠" },
];

function StoriesPage() {
  const { user, loading } = useAuth();
  const { activeMember } = useActiveMember();
  const nav = useNavigate();

  const [stories, setStories] = useState<Story[]>([]);
  const [topic, setTopic] = useState<string>("thyroid");
  const [composeOpen, setComposeOpen] = useState(false);

  useEffect(() => { if (!loading && !user) nav({ to: "/auth" }); }, [user, loading]);

  const load = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from("stories").select("*").order("created_at", { ascending: false });
    setStories((data as Story[]) ?? []);
  }, [user]);
  useEffect(() => { load(); }, [load]);

  if (loading || !user) return null;

  return (
    <div style={{ minHeight: "100dvh", background: "var(--void)", color: "var(--bone)", fontFamily: "var(--sans)" }}>
      <LivingGlow />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 440, margin: "0 auto", padding: "calc(env(safe-area-inset-top) + 22px) 18px 130px" }}>
        <Eyebrow bracket>real people · real reports</Eyebrow>
        <h1 style={{ fontFamily: "var(--serif)", fontWeight: 500, fontSize: 26, lineHeight: 1.05, marginTop: 8 }}>
          Stories from<br />the protocol
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
          {stories.map((s) => (
            <GlassCard key={s.id} style={{ padding: 9 }}>
              {/* cinematic image area */}
              <div style={{ height: 130, borderRadius: 16, position: "relative", overflow: "hidden", display: "flex", alignItems: "flex-end", padding: 12, background: STORY_GRAD[s.theme ?? "iron"] ?? STORY_GRAD.iron }}>
                <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,transparent,rgba(8,5,3,.7))" }} />
                <div style={{ position: "relative", zIndex: 2, fontFamily: "var(--serif)", fontWeight: 500, fontSize: 17, lineHeight: 1.05, textTransform: "uppercase" }}>
                  {s.headline}
                  <br />
                  <em style={{ fontStyle: "italic", textTransform: "none", color: "#ffd9b0" }}>{s.accent}</em>
                </div>
              </div>
              {/* byline */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 9 }}>
                <span style={{ width: 24, height: 24, borderRadius: "50%", flex: "none", display: "grid", placeItems: "center", fontSize: 10, fontFamily: "var(--mono)", fontWeight: 600, color: "#1a0e06", background: "linear-gradient(135deg,#FF9D45,#B23A0C)" }}>
                  {(s.name ?? "·")[0]}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 600 }}>{s.name}{s.city ? ` · ${s.city}` : ""}</div>
                  <Eyebrow style={{ fontSize: 8.5 }}>{s.result}</Eyebrow>
                </div>
                <Pill style={{ padding: "4px 9px", fontSize: 10 }}>♡ {s.likes}</Pill>
              </div>
            </GlassCard>
          ))}
        </div>

        <Eyebrow style={{ display: "block", margin: "20px 0 8px" }}>what people are working on</Eyebrow>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {TOPICS.map((tp) => (
            <Pill as="button" key={tp.key} active={topic === tp.key} onClick={() => setTopic(tp.key)}>{tp.label}</Pill>
          ))}
        </div>

        <EmberButton style={{ marginTop: 18, width: "100%" }} onClick={() => setComposeOpen(true)}>Share your story →</EmberButton>
        <div style={{ textAlign: "center", marginTop: 8 }}>
          <Eyebrow>featured stories appear on labread.health</Eyebrow>
        </div>
      </div>

      <TabBar items={appTabs(nav, "stories")} />

      {composeOpen && (
        <ComposeStory
          userId={user.id}
          authorName={activeMember?.name}
          onClose={() => setComposeOpen(false)}
          onSaved={(s) => { setStories((prev) => [s, ...prev]); setComposeOpen(false); }}
        />
      )}
    </div>
  );
}

function ComposeStory({
  userId, authorName, onClose, onSaved,
}: {
  userId: string; authorName?: string; onClose: () => void; onSaved: (s: Story) => void;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const inputStyle: React.CSSProperties = {
    width: "100%", boxSizing: "border-box", background: "rgba(0,0,0,.3)", border: "1px solid var(--line)",
    borderRadius: 12, padding: "11px 13px", color: "var(--bone)", fontSize: 14, fontFamily: "var(--sans)", outline: "none",
  };

  async function save() {
    if (!title.trim()) { setErr("Give your story a title."); return; }
    if (!userId) return;
    setSaving(true); setErr(null);
    // Stories are account-level (profile_id). featured:false — you flag the best.
    const { data, error } = await supabase.from("stories")
      .insert({ profile_id: userId, title: title.trim(), body: body.trim() || null, image_url: null, likes: 0, featured: false })
      .select("*").maybeSingle();
    setSaving(false);
    if (error) { setErr(error.message); return; }
    const first = (title.trim().split(/\s+/)[0] ?? "MY").toUpperCase();
    onSaved({
      id: (data as { id?: string } | null)?.id ?? `st-${Date.now()}`,
      title: title.trim(), body: body.trim() || null, image_url: null, likes: 0, featured: false,
      name: authorName ?? "You", city: "", result: "just shared", headline: first, accent: title.trim(), theme: "iron",
    });
  }

  return (
    <div className="lr-ui" onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 70, display: "grid", placeItems: "end center", padding: 0, background: "rgba(6,5,3,.72)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}>
      <GlassCard onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 440, borderRadius: "20px 20px 0 0", padding: "20px 18px calc(20px + env(safe-area-inset-bottom))", background: "rgba(20,14,10,.92)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontFamily: "var(--serif)", fontSize: 21 }}>Share your story</span>
          <button onClick={onClose} aria-label="Close" style={{ all: "unset", cursor: "pointer", width: 32, height: 32, borderRadius: 9, border: "1px solid var(--line)", display: "grid", placeItems: "center", color: "var(--smoke)" }}><X size={16} /></button>
        </div>

        <Eyebrow>title</Eyebrow>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="From exhausted to finally myself" autoFocus style={{ ...inputStyle, marginTop: 6 }} />

        <Eyebrow style={{ display: "block", marginTop: 12 }}>your story</Eyebrow>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} placeholder="What changed over your 90 days?" style={{ ...inputStyle, marginTop: 6, resize: "none" }} />

        <button style={{ ...inputStyle, marginTop: 12, textAlign: "left", color: "var(--whisper)", cursor: "pointer", background: "rgba(255,122,24,.05)", borderStyle: "dashed", borderColor: "var(--line-warm)" }}>
          ＋ Add a photo (optional)
        </button>

        {err && <p style={{ color: "var(--ember-glow)", fontSize: 13, marginTop: 10 }}>{err}</p>}

        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button onClick={onClose} style={{ flex: 1, ...inputStyle, textAlign: "center", cursor: "pointer", color: "var(--smoke)", borderRadius: 999 }}>Cancel</button>
          <EmberButton style={{ flex: 2 }} onClick={save} disabled={saving}>{saving ? "Sharing…" : "Share story"}</EmberButton>
        </div>
        <div style={{ textAlign: "center", marginTop: 10 }}>
          <Eyebrow>featured stories appear on labread.health</Eyebrow>
        </div>
      </GlassCard>
    </div>
  );
}
