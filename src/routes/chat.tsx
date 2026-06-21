import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { supabase, SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { ArrowLeft, ArrowUp } from "lucide-react";
import { LR_UI_CSS, LR_FONT_LINKS, LrDefs } from "@/components/lr-ui";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Anna | labread.health" },
      { name: "description", content: "Chat with Anna, your lab coach, about your blood test results and your health protocol." },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://labread.health/chat" }],
  }),
  component: ChatPage,
});

type FocusArea = { biomarker?: string; label?: string };
type Msg = { role: "user" | "assistant"; content: string; created_at: string; streaming?: boolean };

const CHAT_URL = `${SUPABASE_URL}/functions/v1/health-chat`;

function timeLabel(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const annaCss = `
  .anna-wrap{height:100dvh;display:flex;flex-direction:column;max-width:520px;margin:0 auto;width:100%;
    background:var(--bg);padding-bottom:calc(64px + env(safe-area-inset-bottom))}
  .anna-top{padding:14px 16px;border-bottom:1px solid var(--line-soft);background:rgba(11,9,7,.9);backdrop-filter:blur(10px)}
  .anna-top-row{display:flex;align-items:center;gap:10px}
  .anna-back{width:40px;height:40px;margin-left:-6px;border-radius:999px;display:grid;place-items:center;color:var(--muted);transition:.15s}
  .anna-back:hover{color:var(--cream);background:rgba(255,255,255,.04)}
  .anna-top h1{font-family:var(--serif);font-size:22px}
  .anna-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
  .anna-chips .fc{font-family:var(--mono);font-size:10.5px;color:var(--muted);background:rgba(255,255,255,.04);border:1px solid var(--line-soft);border-radius:999px;padding:4px 10px}

  /* orbit avatar — warm amber, native to labread */
  .anna-orb{border-radius:50%;background:radial-gradient(circle at 35% 30%,#241a0d,#0a0806);border:1px solid var(--line);
    display:grid;place-items:center;position:relative;flex-shrink:0}
  .anna-orb::before{content:"";position:absolute;inset:0;border-radius:50%;box-shadow:0 0 16px rgba(245,166,35,.5)}
  .anna-orb i{border-radius:50%;background:var(--amber-lite);animation:lrspin 4.2s linear infinite}

  .anna-msgs{flex:1;overflow-y:auto;padding:18px 16px;display:flex;flex-direction:column;gap:14px}
  .anna-empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 6px}
  .anna-empty h2{font-family:var(--serif);font-size:30px;margin-top:18px}
  .anna-empty .sub{color:var(--muted);font-size:15px;margin-top:8px;max-width:20rem;line-height:1.5}
  .anna-empty .sub b{color:var(--amber-lite);font-weight:600}
  .anna-sugs{width:100%;display:flex;flex-direction:column;gap:9px;margin-top:26px}
  .anna-chip{width:100%;text-align:left;background:var(--surface);border:1px solid var(--line);border-radius:999px;padding:12px 16px;
    font-size:14px;color:var(--cream);cursor:pointer;transition:.15s;font-family:var(--sans)}
  .anna-chip:hover{border-color:rgba(245,166,35,.45);background:rgba(245,133,63,.06)}

  .anna-u{align-self:flex-end;max-width:82%;background:rgba(245,133,63,.16);border:1px solid rgba(245,166,35,.25);color:var(--cream);
    border-radius:16px 16px 5px 16px;padding:11px 14px;font-size:15px;line-height:1.5;white-space:pre-wrap;word-break:break-word}
  .anna-arow{align-self:flex-start;max-width:88%;display:flex;gap:9px;align-items:flex-end}
  .anna-a{background:var(--surface);border:1px solid var(--line);border-radius:16px 16px 16px 5px;padding:12px 15px;font-size:15px;
    line-height:1.55;white-space:pre-wrap;word-break:break-word}
  .anna-a b{color:var(--amber-lite)}
  .anna-ts{font-family:var(--mono);font-size:9.5px;color:var(--faint);margin:3px 4px 0}
  .anna-dots{display:inline-flex;gap:4px;padding:3px 0}
  .anna-dots span{width:6px;height:6px;border-radius:50%;background:var(--amber-lite);animation:annaDot 1.1s ease-in-out infinite}
  @keyframes annaDot{0%,60%,100%{transform:translateY(0);opacity:.5}30%{transform:translateY(-4px);opacity:1}}
  @media(prefers-reduced-motion:reduce){.anna-dots span{animation:none}}

  .anna-input{border-top:1px solid var(--line-soft);background:rgba(11,9,7,.95);padding:12px 14px}
  .anna-err{font-size:13px;color:var(--red);margin:0 2px 8px}
  .anna-row{display:flex;align-items:flex-end;gap:9px}
  .anna-field{flex:1;resize:none;background:rgba(0,0,0,.3);border:1px solid var(--line);border-radius:18px;padding:12px 16px;
    font-size:15px;color:var(--cream);font-family:var(--sans);max-height:128px;transition:.15s}
  .anna-field::placeholder{color:var(--faint)}
  .anna-field:focus{outline:none;border-color:var(--amber)}
  .anna-field:disabled{opacity:.6}
  .anna-send{width:44px;height:44px;flex-shrink:0;border-radius:50%;border:none;background:var(--grad);color:#1a0f02;
    display:grid;place-items:center;cursor:pointer;transition:.15s;box-shadow:0 0 22px rgba(245,133,63,.3)}
  .anna-send:hover:not(:disabled){transform:translateY(-1px)}
  .anna-send:disabled{opacity:.4;cursor:not-allowed;box-shadow:none}
`;

function AnnaOrb({ size = 34 }: { size?: number }) {
  const dot = Math.max(3, Math.round(size * 0.11));
  const off = Math.round(size * 0.24);
  return (
    <span className="anna-orb" style={{ width: size, height: size }}>
      <i style={{ width: dot, height: dot, boxShadow: `${off}px 0 0 var(--amber), -${off}px 0 0 var(--amber-lite), 0 ${off}px 0 var(--green), 0 -${off}px 0 var(--amber)` }} />
    </span>
  );
}

function ChatPage() {
  const { user, loading } = useAuth();
  const nav = useNavigate();

  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [focusAreas, setFocusAreas] = useState<FocusArea[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const endRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!loading && !user) nav({ to: "/auth" });
  }, [user, loading]);

  useEffect(() => {
    if (!user) return;
    let active = true;
    (async () => {
      const { data: rows } = await supabase
        .from("health_chat_messages")
        .select("role, content, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);
      const { data: proto } = await supabase
        .from("health_protocols")
        .select("focus_areas")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!active) return;
      const ordered = ((rows as Msg[]) ?? []).slice().sort((a, b) => {
        if (a.created_at !== b.created_at) return a.created_at < b.created_at ? -1 : 1;
        if (a.role === b.role) return 0;
        return a.role === "user" ? -1 : 1;
      });
      setMessages(ordered);
      setFocusAreas(Array.isArray(proto?.focus_areas) ? (proto.focus_areas as FocusArea[]) : []);
      setHistoryLoaded(true);
    })();
    return () => {
      active = false;
    };
  }, [user]);

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
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) throw new Error("Your session expired. Please sign in again.");

        const res = await fetch(CHAT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ message: trimmed, conversationHistory: history }),
        });

        if (!res.ok || !res.body) {
          let msg = `Request failed (${res.status}).`;
          try {
            const body = await res.json();
            if (body?.error) msg = body.error;
          } catch {
            /* keep generic */
          }
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
    [messages, streaming, user],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  if (loading || !user) return null;

  const topBiomarker = focusAreas[0]?.biomarker ?? "my results";
  const suggestions = [
    `Why does ${topBiomarker} matter?`,
    "I've been feeling tired — is that related?",
    `What should I eat to help my ${topBiomarker}?`,
  ];

  const showEmpty = historyLoaded && messages.length === 0;

  return (
    <div className="lr-ui">
      <style dangerouslySetInnerHTML={{ __html: LR_UI_CSS + annaCss }} />
      {LR_FONT_LINKS.map((l, i) => <link key={i} {...l} />)}
      <LrDefs />

      <div className="anna-wrap">
        {/* TOP BAR */}
        <header className="anna-top">
          <div className="anna-top-row">
            <Link to="/dashboard" className="anna-back" title="Back"><ArrowLeft size={18} /></Link>
            <AnnaOrb size={32} />
            <h1>Anna</h1>
          </div>
          {focusAreas.length > 0 && (
            <div className="anna-chips">
              {focusAreas.slice(0, 4).map((f, i) => (
                <span key={`${f.biomarker ?? "area"}-${i}`} className="fc">{f.biomarker ?? "Focus"}</span>
              ))}
            </div>
          )}
        </header>

        {/* MESSAGES */}
        <div className="anna-msgs">
          {showEmpty ? (
            <div className="anna-empty">
              <AnnaOrb size={60} />
              <h2>Anna</h2>
              <p className="sub">Your lab coach. <b>I know your numbers.</b> Ask me what a marker means, why it changed, or what to do next.</p>
              <div className="anna-sugs">
                {suggestions.map((s) => (
                  <button key={s} className="anna-chip" onClick={() => send(s)}>{s}</button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((m, i) =>
                m.role === "user" ? (
                  <div key={i} style={{ alignSelf: "flex-end", display: "flex", flexDirection: "column", alignItems: "flex-end", maxWidth: "82%" }}>
                    <div className="anna-u">{m.content}</div>
                    <span className="anna-ts">{timeLabel(m.created_at)}</span>
                  </div>
                ) : (
                  <div key={i} style={{ alignSelf: "flex-start", maxWidth: "88%" }}>
                    <div className="anna-arow">
                      <AnnaOrb size={26} />
                      <div className="anna-a">{m.content === "" && m.streaming ? <TypingDots /> : m.content}</div>
                    </div>
                    {m.content !== "" && <span className="anna-ts" style={{ marginLeft: 35 }}>{timeLabel(m.created_at)}</span>}
                  </div>
                ),
              )}
              <div ref={endRef} />
            </>
          )}
        </div>

        {/* INPUT BAR */}
        <div className="anna-input">
          {error && <p className="anna-err">{error}</p>}
          <div className="anna-row">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={streaming}
              placeholder="Ask Anna about your results…"
              className="anna-field"
            />
            <button className="anna-send" onClick={() => send(input)} disabled={streaming || !input.trim()} title="Send">
              <ArrowUp size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="anna-dots">
      <span style={{ animationDelay: "0s" }} />
      <span style={{ animationDelay: ".15s" }} />
      <span style={{ animationDelay: ".3s" }} />
    </span>
  );
}
