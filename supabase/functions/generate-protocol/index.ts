import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-auth",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

const SYSTEM_PROMPT =
  "You are a precision health coach. You receive blood test results and return a structured 90-day improvement plan. Every recommendation must be directly tied to a specific flagged biomarker value — never give generic advice. Be specific with dosages, timings, and foods. Return only valid JSON, no markdown.";

type ProtocolHabit = {
  category: string;
  title: string;
  why: string;
  frequency: string;
  icon: string;
  sort_order: number;
};

type GeneratedProtocol = {
  title: string;
  focus_areas: Array<Record<string, unknown>>;
  habits: ProtocolHabit[];
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function buildUserPrompt(analysisResult: unknown): string {
  return `Here is the patient's blood test analysis as JSON:

${JSON.stringify(analysisResult, null, 2)}

Build a personalized 90-day improvement plan and return ONLY a JSON object with EXACTLY this shape:

{
  "title": "Your 90-Day [specific focus] Plan",
  "focus_areas": [
    { "biomarker": "Vitamin D", "current_value": "18 ng/mL", "target_value": "50+ ng/mL", "label": "Low" }
  ],
  "habits": [
    {
      "category": "supplement",
      "title": "Take Vitamin D3 with K2 (4,000 IU daily)",
      "why": "Your level of 18 ng/mL is well below the optimal 50+ range, which affects bone density, immunity, and mood.",
      "frequency": "daily",
      "icon": "☀️",
      "sort_order": 1
    }
  ]
}

RULES:
- Only include focus_areas for biomarkers that are flagged (out of range or borderline). Skip anything that is in range / normal.
- "title" must name the specific focus, e.g. "Your 90-Day Iron & Vitamin D Plan".
- Generate between 6 and 10 habits, spread across the categories: "supplement", "diet", "sleep", "exercise", and "lifestyle".
- Every habit's "why" field MUST mention the user's actual measured value (e.g. "Your ferritin of 18 ng/mL...").
- "category" must be one of: supplement | diet | sleep | exercise | lifestyle.
- "frequency" must be one of: daily | weekly | with_meals.
- "icon" must be a single relevant emoji.
- "sort_order" is a 1-based integer ordering the habits.
- Be specific with dosages, timings, and foods. No generic advice.
- Return ONLY the JSON object — no markdown, no commentary.`;
}

function toDateString(d: Date): string {
  return d.toISOString().slice(0, 10);
}

Deno.serve(async (req) => {
  // Always handle CORS preflight FIRST, before any auth/validation
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    // --- Auth: verify the caller via the JWT in the Authorization header -----
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return json({ error: "Missing Authorization header." }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      return json({ error: "Supabase environment is not configured." }, 500);
    }

    // User-scoped client (anon key + caller's JWT) — only to resolve identity.
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) {
      return json({ error: "Not authenticated." }, 401);
    }

    // --- Parse + validate body ----------------------------------------------
    let payload: { userId?: string; reportId?: string; analysisResult?: unknown; memberId?: string | null };
    try {
      payload = await req.json();
    } catch {
      return json({ error: "Invalid JSON body." }, 400);
    }

    const { userId, reportId, analysisResult, memberId } = payload;
    if (!reportId || !analysisResult) {
      return json({ error: "Missing required fields: reportId and analysisResult." }, 400);
    }
    // The authenticated token is the source of truth for ownership; reject any
    // attempt to create a protocol for a different user.
    if (userId && userId !== user.id) {
      return json({ error: "userId does not match the authenticated user." }, 403);
    }
    const ownerId = user.id;

    // --- OpenAI: generate the structured plan -------------------------------
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      return json({ error: "OPENAI_API_KEY is not configured in Supabase secrets." }, 500);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120_000);

    let openAiResponse: Response;
    try {
      openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: "gpt-4o",
          temperature: 0.3,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: buildUserPrompt(analysisResult) },
          ],
        }),
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!openAiResponse.ok) {
      return json({ error: `OpenAI ${openAiResponse.status}: ${await openAiResponse.text()}` }, 500);
    }

    const completion = await openAiResponse.json();
    const raw: string = completion.choices?.[0]?.message?.content ?? "";
    const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();

    let generated: GeneratedProtocol;
    try {
      generated = JSON.parse(cleaned) as GeneratedProtocol;
    } catch {
      return json({ error: `Failed to parse model JSON. Raw: ${cleaned.slice(0, 500)}` }, 500);
    }

    if (!generated?.title || !Array.isArray(generated.habits) || generated.habits.length === 0) {
      return json({ error: "Model returned an incomplete protocol (missing title or habits)." }, 500);
    }

    // --- Persist with the SERVICE ROLE client (bypasses RLS securely) -------
    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const startsAt = new Date();
    const endsAt = new Date(startsAt);
    endsAt.setDate(endsAt.getDate() + 90);

    const { data: protocol, error: protocolError } = await admin
      .from("health_protocols")
      .insert({
        user_id: ownerId,
        member_id: memberId ?? null,
        created_from_report_id: reportId,
        title: generated.title,
        focus_areas: generated.focus_areas ?? [],
        starts_at: toDateString(startsAt),
        ends_at: toDateString(endsAt),
        status: "active",
      })
      .select("id")
      .single();

    if (protocolError || !protocol) {
      return json({ error: `Failed to save protocol: ${protocolError?.message ?? "unknown error"}` }, 500);
    }

    const protocolId: string = protocol.id;

    const habitRows = generated.habits.map((habit, index) => ({
      protocol_id: protocolId,
      user_id: ownerId,
      member_id: memberId ?? null,
      category: habit.category,
      title: habit.title,
      why: habit.why,
      frequency: habit.frequency,
      icon: habit.icon,
      sort_order: typeof habit.sort_order === "number" ? habit.sort_order : index + 1,
    }));

    const { error: habitsError } = await admin.from("protocol_habits").insert(habitRows);

    if (habitsError) {
      // Roll back the orphaned protocol so the user can retry cleanly.
      await admin.from("health_protocols").delete().eq("id", protocolId);
      return json({ error: `Failed to save habits: ${habitsError.message}` }, 500);
    }

    return json({ protocolId });
  } catch (err) {
    return json({ error: (err as Error)?.message || String(err) }, 500);
  }
});
