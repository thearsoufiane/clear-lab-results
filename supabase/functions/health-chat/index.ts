import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-auth",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

type ChatMessage = { role: string; content: string };
type AnalysisValue = { name?: string; value?: string; status?: string };

function jsonError(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function buildSystemPrompt(
  flagged: AnalysisValue[],
  focusAreas: Array<Record<string, unknown>>,
  habitTitles: string[],
): string {
  const flaggedList = flagged.length
    ? flagged.map((v) => `- ${v.name ?? "Unknown"}: ${v.value ?? "n/a"}`).join("\n")
    : "- None flagged.";

  const focusList = focusAreas.length
    ? focusAreas
        .map((f) => {
          const name = (f.biomarker as string) ?? "Unknown";
          const label = f.label ? ` (${f.label as string})` : "";
          return `- ${name}${label}`;
        })
        .join("\n")
    : "- None.";

  const habitList = habitTitles.length ? habitTitles.map((t) => `- ${t}`).join("\n") : "- None yet.";

  return `You are Lab Coach, a personal health coach built into labread.health. You have access to this user's blood test results and their active 90-day health protocol.

Their flagged biomarkers:
${flaggedList}

Their protocol focus areas:
${focusList}

Their active habits:
${habitList}

Rules:
- Maximum 2-3 sentences. Be direct. Never write a paragraph.
- Always cite their actual number — "Your ferritin is at 487" not "Ferritin is a protein that..."
- Be warm and specific, never clinical or textbook. You're a coach, not a Wikipedia article.
- Never start with a definition. Start with their number, then what it means for them.
- Defer anything clinical: "Worth discussing with your doctor" — never diagnose, never dose, never alarm.
- If a value is out of range, stay calm: "That's elevated" or "That's on the low side" — no scary language.
- If asked something unrelated to health, gently redirect.
- Never add a sign-off or closing. End naturally with your last sentence.
- Speak like a knowledgeable friend, not a medical textbook.`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") return jsonError("Method not allowed", 405);

    // --- Auth: verify the caller's JWT (same pattern as generate-protocol) ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return jsonError("Missing Authorization header.", 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !anonKey || !serviceRoleKey) return jsonError("Supabase environment is not configured.", 500);

    const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } } });
    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();
    if (userError || !user) return jsonError("Not authenticated.", 401);
    const ownerId = user.id;

    // --- Parse body ---------------------------------------------------------
    let body: { message?: string; conversationHistory?: ChatMessage[]; memberId?: string | null };
    try {
      body = await req.json();
    } catch {
      return jsonError("Invalid JSON body.", 400);
    }
    const memberId = body.memberId ?? null;
    const message = (body.message ?? "").trim();
    if (!message) return jsonError("Missing 'message'.", 400);
    const history = Array.isArray(body.conversationHistory) ? body.conversationHistory : [];
    const userCreatedAt = new Date().toISOString();

    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) return jsonError("OPENAI_API_KEY is not configured in Supabase secrets.", 500);

    // --- Gather the user's context with the service-role client -------------
    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Scope context to the active member when provided (falls back to the
    // account owner for older clients that don't send memberId yet).
    const protocolQuery = admin
      .from("health_protocols")
      .select("id, focus_areas")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1);
    const { data: protocol } = await (memberId ? protocolQuery.eq("member_id", memberId) : protocolQuery.eq("user_id", ownerId)).maybeSingle();

    let habitTitles: string[] = [];
    let focusAreas: Array<Record<string, unknown>> = [];
    if (protocol) {
      focusAreas = Array.isArray(protocol.focus_areas) ? protocol.focus_areas : [];
      const { data: habits } = await admin
        .from("protocol_habits")
        .select("title, sort_order")
        .eq("protocol_id", protocol.id)
        .order("sort_order", { ascending: true });
      habitTitles = (habits ?? []).map((h: { title: string }) => h.title).filter(Boolean);
    }

    const reportQuery = admin
      .from("reports")
      .select("analysis")
      .order("created_at", { ascending: false })
      .limit(1);
    const { data: report } = await (memberId ? reportQuery.eq("member_id", memberId) : reportQuery.eq("user_id", ownerId)).maybeSingle();

    const values: AnalysisValue[] = Array.isArray(report?.analysis?.values) ? report.analysis.values : [];
    const flagged = values.filter((v) => v.status && v.status !== "normal");

    const systemPrompt = buildSystemPrompt(flagged, focusAreas, habitTitles);

    // --- OpenAI streaming call ----------------------------------------------
    const messages = [
      { role: "system", content: systemPrompt },
      ...history
        .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
        .slice(-20)
        .map((m) => ({ role: m.role, content: m.content })),
    ];

    const openAiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o",
        temperature: 0.4,
        max_tokens: 400,
        stream: true,
        messages,
      }),
    });

    if (!openAiResp.ok || !openAiResp.body) {
      return jsonError(`OpenAI ${openAiResp.status}: ${await openAiResp.text()}`, 500);
    }

    // --- Transform OpenAI SSE into a plain-text token stream ----------------
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = openAiResp.body!.getReader();
        let buffer = "";
        let assistantText = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";
            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith("data:")) continue;
              const data = trimmed.slice(5).trim();
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                const delta: string | undefined = parsed.choices?.[0]?.delta?.content;
                if (delta) {
                  assistantText += delta;
                  controller.enqueue(encoder.encode(delta));
                }
              } catch {
                // ignore non-JSON keep-alive lines
              }
            }
          }
        } catch {
          // streaming interrupted — still persist whatever we have
        }

        // Persist both turns after streaming completes. Explicit timestamps
        // (user captured at request time, assistant after streaming) keep the
        // user turn strictly before the assistant turn on reload.
        const assistantCreatedAt = new Date().toISOString();
        try {
          await admin.from("health_chat_messages").insert([
            { user_id: ownerId, member_id: memberId, role: "user", content: message, context_type: "general", created_at: userCreatedAt },
            { user_id: ownerId, member_id: memberId, role: "assistant", content: assistantText, context_type: "general", created_at: assistantCreatedAt },
          ]);
        } catch {
          // best-effort; don't break the response
        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" },
    });
  } catch (err) {
    return jsonError((err as Error)?.message || String(err), 500);
  }
});
