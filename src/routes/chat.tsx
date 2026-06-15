import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { supabase, SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "@/components/logo";
import { ArrowLeft, ArrowUp } from "lucide-react";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Lab Coach | labread.health" },
      { name: "description", content: "Chat with Lab Coach about your blood test results and your health protocol." },
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

  // Load last 20 messages + protocol focus areas
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
      setMessages(((rows as Msg[]) ?? []).slice().reverse());
      setFocusAreas(Array.isArray(proto?.focus_areas) ? (proto.focus_areas as FocusArea[]) : []);
      setHistoryLoaded(true);
    })();
    return () => {
      active = false;
    };
  }, [user]);

  // Auto-scroll to bottom whenever messages change
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

      // Optimistically add the user message + an empty assistant bubble (typing).
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
        // Drop the empty assistant placeholder and surface the error.
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
    <div className="h-[100dvh] flex flex-col max-w-[480px] mx-auto w-full">
      {/* ===== TOP BAR ===== */}
      <header className="px-4 py-3 border-b border-border/50 bg-background">
        <div className="flex items-center gap-2">
          <Link
            to="/dashboard"
            className="text-muted-foreground hover:text-foreground p-2 -ml-2 rounded-full hover:bg-white/5 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Back"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-xl tracking-tight">Lab Coach</h1>
        </div>
        {focusAreas.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2 pl-0.5">
            {focusAreas.slice(0, 4).map((f, i) => (
              <span
                key={`${f.biomarker ?? "area"}-${i}`}
                className="text-[11px] text-muted-foreground bg-white/5 border border-border/60 rounded-full px-2.5 py-1"
              >
                {f.biomarker ?? "Focus"}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* ===== MESSAGES ===== */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {showEmpty ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-2">
            <div className="w-14 h-14 rounded-full bg-accent grid place-items-center text-2xl">🩺</div>
            <div className="mt-4 text-2xl font-serif">Lab Coach</div>
            <p className="mt-2 text-sm text-muted-foreground max-w-[18rem]">
              Ask me anything about your results or how your habits are working. I know your numbers.
            </p>
            <div className="mt-6 w-full space-y-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="w-full text-left text-sm glass rounded-full px-4 py-2.5 hover:border-accent/40 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="flex flex-col items-end">
                  <div className="max-w-[80%] bg-accent text-white rounded-2xl rounded-br-md px-4 py-2.5 text-[15px] whitespace-pre-wrap break-words">
                    {m.content}
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground mt-1 mr-1">{timeLabel(m.created_at)}</span>
                </div>
              ) : (
                <div key={i} className="flex flex-col items-start">
                  <div className="max-w-[85%] glass rounded-xl border-l-2 border-l-accent px-4 py-3 text-[15px] whitespace-pre-wrap break-words">
                    {m.content === "" && m.streaming ? <TypingDots /> : m.content}
                  </div>
                  {m.content !== "" && (
                    <span className="text-[10px] font-mono text-muted-foreground mt-1 ml-1">{timeLabel(m.created_at)}</span>
                  )}
                </div>
              ),
            )}
            <div ref={endRef} />
          </div>
        )}
      </div>

      {/* ===== INPUT BAR ===== */}
      <div className="border-t border-border/50 bg-background px-3 py-3">
        {error && <p className="text-sm text-danger mb-2 px-1">{error}</p>}
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={streaming}
            placeholder="Ask about your results..."
            className="flex-1 resize-none bg-input/60 border border-border rounded-2xl px-4 py-3 text-[15px] focus:outline-none focus:border-accent transition max-h-32 disabled:opacity-60"
          />
          <button
            onClick={() => send(input)}
            disabled={streaming || !input.trim()}
            className="w-11 h-11 flex-none rounded-full bg-accent text-white grid place-items-center transition disabled:opacity-40"
            title="Send"
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1">
      {[0, 0.15, 0.3].map((d) => (
        <span
          key={d}
          className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce-dot"
          style={{ animationDelay: `${d}s` }}
        />
      ))}
    </span>
  );
}
