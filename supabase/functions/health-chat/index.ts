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
  values: AnalysisValue[],
  focusAreas: Array<Record<string, unknown>>,
  habitTitles: string[],
): string {
  const markers = values.filter((v) => v.name);
  const markerList = markers.length
    ? markers
        .map((v) => {
          const status = v.status && v.status !== "normal" ? v.status : "in range";
          return `- ${v.name}: ${v.value ?? "n/a"} (${status})`;
        })
        .join("\n")
    : "- No blood test on file yet.";

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

  return `You are Anna, a warm health guide inside labread. You speak like a knowledgeable older sister — caring, direct, never clinical.

Here is every marker in this person's latest blood test — this is the ONLY source for their numbers. If they ask about a marker that is NOT in this list, you don't have it: say so and never invent a value.
${markerList}

Their protocol focus areas:
${focusList}

Their active habits:
${habitList}

VOICE RULES (follow these exactly):
- Talk like a friend, not a doctor. "Your hemoglobin is solid at 12.7 — that means your blood is doing its job carrying oxygen around." NOT "Hemoglobin is at the heart of your blood's ability to carry oxygen."
- ALWAYS start with their actual number if they have one. "Yours is at 12.7" not "Hemoglobin is..."
- If they don't have a number for that marker, say so: "I don't see hemoglobin in your latest report. Want to upload a new one?"
- Maximum 2 sentences. Then stop. Don't over-explain.
- Never start a sentence with the marker name as a definition. Wrong: "Hemoglobin is a protein that..." Right: "Yours is at 12.7 — that's right where you want it."
- Use "you" and "your" constantly. This is about THEM, not about biology in general.
- Be encouraging when things are good: "Nailed it." "That's solid." "Nothing to worry about here."
- Be calm and specific when things are off: "Yours is a bit low at 8.2. Worth chatting with your doctor about — could be as simple as adding more iron-rich meals."
- Never say "It's essential for..." or "It plays a crucial role in..." — that's textbook language.
- Never end with "If you have any concerns, discuss with your doctor" as a generic sign-off. Only mention a doctor when something is actually flagged.
- Use contractions: "that's", "you're", "it's" — not formal language.
- One emoji maximum per message. Only if it feels natural. Usually none.`;
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

    const systemPrompt = buildSystemPrompt(values, focusAreas, habitTitles);

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
