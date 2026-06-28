import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { supabase, SUPABASE_URL, SUPABASE_ANON_KEY, type Analysis } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { useActiveMember } from "@/contexts/active-member";
import { ArrowLeft, ArrowUp } from "lucide-react";
import {
  LivingGlow, GlassCard, Gauge, AnnaOrb, AnnaMessage, UserMessage, ThinkingDots, Pill, Eyebrow,
} from "@/components/lr";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Anna | labread.health" },
      { name: "description", content: "Talk with Anna, your guide, about your blood test and your protocol." },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://labread.health/chat" }],
  }),
  component: ChatPage,
});

type FocusArea = { biomarker?: string; label?: string };
type Msg = { role: "user" | "assistant"; content: string; created_at: string; streaming?: boolean };
type AnalysisValue = Analysis["values"][number];

type MarkerInfo = { name: string; num: number; unit: string; low: number; high: number; status: AnalysisValue["status"] };

const CHAT_URL = `${SUPABASE_URL}/functions/v1/health-chat`;

function numFrom(value: string): number | null {
  const m = String(value ?? "").match(/-?[\d.]+/);
  return m ? parseFloat(m[0]) : null;
}
function unitFrom(value: string): string {
  const m = String(value ?? "").match(/^\s*-?[\d.]+\s*(.*)$/);
  return m ? m[1].trim() : "";
}
function norm(s: string): string {
  return String(s ?? "").toLowerCase().replace(/\s*\([^)]*\)/g, "").replace(/\s+/g, " ").trim();
}

function ChatPage() {
  const { user, loading } = useAuth();
  const { activeMemberId } = useActiveMember();
  const nav = useNavigate();

  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [focusAreas, setFocusAreas] = useState<FocusArea[]>([]);
  const [markers, setMarkers] = useState<MarkerInfo[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loading && !user) nav({ to: "/auth" });
  }, [user, loading]);

  useEffect(() => {
    if (!user || !activeMemberId) return;
    let active = true;
    setMessages([]); setFocusAreas([]); setMarkers([]); setHistoryLoaded(false);
    (async () => {
      const { data: rows } = await supabase
        .from("health_chat_messages").select("role, content, created_at")
        .eq("member_id", activeMemberId).order("created_at", { ascending: false }).limit(20);
      const { data: proto } = await supabase
        .from("health_protocols").select("focus_areas")
        .eq("member_id", activeMemberId).eq("status", "active")
        .order("created_at", { ascending: false }).limit(1).maybeSingle();
      const { data: reps } = await supabase
        .from("reports").select("analysis, created_at")
        .eq("member_id", activeMemberId).order("created_at", { ascending: false }).limit(1);
      if (!active) return;

      const ordered = ((rows as Msg[]) ?? []).slice().sort((a, b) => {
        if (a.created_at !== b.created_at) return a.created_at < b.created_at ? -1 : 1;
        if (a.role === b.role) return 0;
        return a.role === "user" ? -1 : 1;
      });
      setMessages(ordered);
      setFocusAreas(Array.isArray(proto?.focus_areas) ? (proto.focus_areas as FocusArea[]) : []);

      const vals = ((reps?.[0]?.analysis as Analysis | undefined)?.values as AnalysisValue[]) ?? [];
      const mk: MarkerInfo[] = [];
      for (const v of vals) {
        const n = numFrom(v.value);
        const r = v.optimal_range ?? v.normal_range;
        if (n != null && r) mk.push({ name: v.name, num: n, unit: unitFrom(v.value), low: r.min, high: r.max, status: v.status });
      }
      setMarkers(mk);
      setHistoryLoaded(true);
    })();
    return () => { active = false; };
  }, [user, activeMemberId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || streaming || !user) return;
      setError(null);
      setInput("");

      const now = new Date().toISOString();
      const userMsg: Msg = { role: "user", content: trimmed, created_at: now };
      const history = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }));

      setMessages((prev) => [...prev, userMsg, { role: "assistant", content: "", created_at: new Date().toISOString(), streaming: true }]);
      setStreaming(true);

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error("Your session expired. Please sign in again.");

        const res = await fetch(CHAT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${session.access_token}` },
          body: JSON.stringify({ message: trimmed, conversationHistory: history, memberId: activeMemberId }),
        });

        if (!res.ok || !res.body) {
          let msg = `Request failed (${res.status}).`;
          try { const body = await res.json(); if (body?.error) msg = body.error; } catch { /* keep generic */ }
          throw new Error(msg);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setMessages((prev) => {
            const next = prev.slice();
            const last = next[next.length - 1];
            if (last && last.role === "assistant") next[next.length - 1] = { ...last, content: acc };
            return next;
          });
        }

        setMessages((prev) => {
          const next = prev.slice();
          const last = next[next.length - 1];
          if (last && last.role === "assistant") next[next.length - 1] = { ...last, streaming: false };
          return next;
        });
      } catch (e) {
        setMessages((prev) => {
          const next = prev.slice();
          const last = next[next.length - 1];
          if (last && last.role === "assistant" && !last.content) next.pop();
          return next;
        });
        setError((e as Error).message || "Something went wrong. Please try again.");
      } finally {
        setStreaming(false);
      }
    },
    [messages, streaming, user, activeMemberId],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  if (loading || !user) return null;

  // data-in-dialogue: a marker Anna names in a message gets an inline gauge.
  const markerInText = (text: string): MarkerInfo | null => {
    const t = text.toLowerCase();
    return markers.find((m) => t.includes(norm(m.name))) ?? null;
  };
  const gaugeStatus = (s: AnalysisValue["status"]) => (s === "normal" ? "optimal" : s);
  const gaugeLabel = (s: AnalysisValue["status"]) => (s === "normal" ? "OPTIMAL" : s.toUpperCase());

  const topBiomarker = focusAreas[0]?.biomarker ?? markers[0]?.name ?? "my results";
  const suggestions = [
    `Why does ${topBiomarker} matter?`,
    "I've been feeling tired — is that related?",
    `What should I eat for my ${topBiomarker}?`,
  ];
  const showEmpty = historyLoaded && messages.length === 0;

  return (
    <div style={{ minHeight: "100dvh", background: "var(--void)", color: "var(--bone)", fontFamily: "var(--sans)" }}>
      <LivingGlow />
      <div style={{ position: "relative", zIndex: 1, height: "100dvh", display: "flex", flexDirection: "column", maxWidth: 520, margin: "0 auto", width: "100%" }}>
        {/* header — a presence, not a thread title */}
        <header style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderBottom: "1px solid var(--line)" }}>
          <Link to="/dashboard" aria-label="Back" style={{ color: "var(--smoke)", display: "grid", placeItems: "center", width: 32, height: 32, marginLeft: -4 }}>
            <ArrowLeft size={18} />
          </Link>
          <AnnaOrb size={28} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Anna</div>
            <Eyebrow color="var(--ember-glow)" style={{ fontSize: 8.5 }}>here with you</Eyebrow>
          </div>
        </header>

        {/* conversation surface */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 18px 4px", display: "flex", flexDirection: "column" }}>
          {showEmpty ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
              <AnnaOrb size={118} />
              <div style={{ fontFamily: "var(--serif)", fontSize: 22, lineHeight: 1.3, marginTop: 18, maxWidth: 260 }}>
                I read your blood, so <em style={{ fontStyle: "italic", color: "var(--ember-hot)" }}>you don't have to.</em>
              </div>
            </div>
          ) : (
            messages.map((m, i) =>
              m.role === "user" ? (
                <UserMessage key={i}>{m.content}</UserMessage>
              ) : (
                <div key={i}>
                  <AnnaMessage>{m.content === "" && m.streaming ? <ThinkingDots /> : m.content}</AnnaMessage>
                  {(() => {
                    if (m.streaming || !m.content) return null;
                    const mk = markerInText(m.content);
                    if (!mk) return null;
                    return (
                      <GlassCard style={{ marginTop: 10, padding: 12 }}>
                        <Gauge value={mk.num} unit={mk.unit} rangeLow={mk.low} rangeHigh={mk.high} status={gaugeStatus(mk.status)} label={gaugeLabel(mk.status)} size={200} />
                        <div style={{ textAlign: "center" }}>
                          <Eyebrow>{mk.unit ? `${mk.unit} · ` : ""}optimal {mk.low}–{mk.high}</Eyebrow>
                        </div>
                      </GlassCard>
                    );
                  })()}
                </div>
              ),
            )
          )}
          <div ref={endRef} />
        </div>

        {/* suggested prompts + composer */}
        <div style={{ padding: "10px 16px calc(14px + env(safe-area-inset-bottom))" }}>
          {error && <p style={{ fontSize: 13, color: "var(--ember-glow)", margin: "0 2px 8px" }}>{error}</p>}
          <div style={{ display: "flex", gap: 7, overflowX: "auto", marginBottom: 10, paddingBottom: 2 }}>
            {suggestions.map((s) => (
              <Pill as="button" key={s} onClick={() => send(s)} style={{ whiteSpace: "nowrap", flex: "none" }}>{s}</Pill>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--glass)", border: "1px solid var(--line)", borderRadius: 999, padding: "6px 6px 6px 16px", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={streaming}
              placeholder="Ask Anna anything…"
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--bone)", fontSize: 15, fontFamily: "var(--sans)" }}
            />
            <button
              onClick={() => send(input)}
              disabled={streaming || !input.trim()}
              aria-label="Send"
              style={{
                width: 38, height: 38, flex: "none", borderRadius: "50%", border: "none", cursor: streaming || !input.trim() ? "not-allowed" : "pointer",
                background: "linear-gradient(135deg,#FF9D45,#B23A0C)", color: "#1a0e06", display: "grid", placeItems: "center",
                boxShadow: "0 0 16px rgba(255,140,50,.5)", opacity: streaming || !input.trim() ? 0.45 : 1,
              }}
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
