const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-auth",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

type Profile = {
  age?: number | null;
  biological_sex?: string | null;
  diabetes?: boolean | null;
  heart_disease?: boolean | null;
  high_blood_pressure?: boolean | null;
  cancer_history?: boolean | null;
  smoking?: boolean | null;
} | null;

type AnalyzePayload = {
  base64: string;
  mimeType?: string;
  mediaType?: string;
  fileName?: string;
  profile?: Profile;
};

function profileSummary(p: Profile): string {
  if (!p) return "No patient profile provided. Give general guidance.";
  const parts: string[] = [];
  if (p.age != null) parts.push(`Age: ${p.age}`);
  if (p.biological_sex) parts.push(`Biological sex: ${p.biological_sex}`);
  const conds = [
    p.diabetes && "diabetes",
    p.heart_disease && "heart disease",
    p.high_blood_pressure && "high blood pressure",
    p.cancer_history && "history of cancer",
    p.smoking && "current smoker",
  ].filter(Boolean) as string[];
  parts.push(`Existing conditions: ${conds.length ? conds.join(", ") : "none reported"}`);
  return parts.join(" · ");
}

Deno.serve(async (req) => {
  // Always handle CORS preflight FIRST, before any auth/validation
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "OPENAI_API_KEY is not configured in Supabase secrets." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let payload: AnalyzePayload;
    try {
      payload = (await req.json()) as AnalyzePayload;
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const mimeType = payload?.mimeType || payload?.mediaType;
    if (!payload?.base64 || !mimeType) {
      return new Response(JSON.stringify({ error: "Missing required fields: base64 and mimeType/mediaType." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const patient = profileSummary(payload.profile ?? null);

    const systemPrompt = `You are a medical lab report interpreter. CRITICAL: You MUST return ALL fields in the JSON output below. Do NOT omit any fields.

PATIENT PROFILE:
${patient}

REQUIRED OUTPUT FIELDS - YOU MUST INCLUDE ALL OF THESE:

1. health_score: integer 0-100 (required, never omit)
2. summary: string with 2-3 sentences (required, never omit)
3. For EACH biomarker in values array, you MUST include:
   - normal_range: {min: number, max: number} (required)
   - optimal_range: {min: number, max: number} (required)
   - action_steps: string[] with 2-3 steps for High/Low (required, empty array for Normal)
   - references: string[] with 1-2 citations (required)
4. doctor_questions: string[] with 3-5 specific questions (required, NEVER empty)
5. cancer_screening_flags: array with 1-3 flags if found (required, empty if none)

CANCER SCREENING RULES - Cross-reference these combinations:
- Ferritin >250 + elevated LDH → lymphoma, liver disease
- Iron deficiency in males/post-menopausal → GI malignancy
- Calcium + PTH elevated → parathyroid/malignancy
- PSA >4.0 → prostate screening
- GGT+ALP elevated, ALT normal → pancreatic/biliary
- ESR+CRP elevated + weight loss → malignancy workup
- Ferritin >1000 → urgent hematologic workup

ACTION STEPS must be specific, not generic:
- Bad: "get exercise" | Good: "walk 30 min 5x/week"
- Bad: "take vitamin" | Good: "take 5,000 IU D3 daily with K2 MK-7"
- Bad: "see a doctor" | Good: "Request iron saturation (TIBC) test"

REFERENCES format: "PMID: 12345678" or "AHA Guidelines 2023"

DOCTOR QUESTIONS: generate an array of 3-5 specific, personalized questions the patient
should ask their doctor, based on their out-of-range markers. Make them specific to THIS
person's results, not generic.
Example: "My ferritin is 18 — should I be tested for the cause of low iron?"

Respond with ONLY this JSON structure (no markdown, no extra text):
{
  "title": "report title",
  "summary": "2-3 sentence overview",
  "health_score": 72,
  "values": [
    {
      "name": "Ferritin",
      "value": "487 ng/mL",
      "status": "high",
      "normal_range": { "min": 20, "max": 250 },
      "optimal_range": { "min": 40, "max": 150 },
      "explanation": "Your ferritin is nearly 2x the upper limit...",
      "action_steps": ["Request iron saturation test...", "Check CRP + liver enzymes...", "Reduce red meat..."],
      "references": ["PMID: 31722bhg", "AHA Guidelines 2023"]
    }
  ],
  "screenings": [
    { "name": "screening name", "detail": "why for THIS patient", "urgency": "urgent or routine or informational" }
  ],
  "cancer_screening_flags": [
    {
      "title": "Ferritin + Elevated LDH",
      "explanation": "Elevated ferritin combined with high LDH can signal lymphoma, liver disease...",
      "action_steps": ["Discuss with doctor: CBC with differential...", "Consider CT if symptoms persist"],
      "references": ["PMID: 12345678"]
    }
  ],
  "doctor_questions": [
    "My ferritin is 487. Can we test iron saturation and TIBC to check for hemochromatosis?",
    "..."
  ]
}`;

    const dataUrl = `data:${mimeType};base64,${payload.base64}`;
    const userContent: Array<Record<string, unknown>> = [
      {
        type: "text",
        text: "Analyze this lab report for the patient described in the system message and return the JSON described.",
      },
    ];

    if (mimeType === "application/pdf") {
      userContent.push({
        type: "file",
        file: {
          filename: payload.fileName || "report.pdf",
          file_data: dataUrl,
        },
      });
    } else {
      userContent.push({
        type: "image_url",
        image_url: { url: dataUrl },
      });
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
          model: "gpt-4o-mini",
          temperature: 0.2,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userContent },
          ],
        }),
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!openAiResponse.ok) {
      return new Response(
        JSON.stringify({ error: `OpenAI ${openAiResponse.status}: ${await openAiResponse.text()}` }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const json = await openAiResponse.json();
    const raw = json.choices?.[0]?.message?.content ?? "";
    const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();

    try {
      const parsed = JSON.parse(cleaned);
      return new Response(JSON.stringify(parsed), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch {
      return new Response(JSON.stringify({ error: `Failed to parse model JSON. Raw: ${cleaned.slice(0, 500)}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error)?.message || String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
