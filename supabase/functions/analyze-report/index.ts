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

    const systemPrompt = `You are a medical lab report interpreter. Generate a comprehensive, plain-English analysis with range bars, actionable steps, cancer screening checks, and doctor questions.

PATIENT PROFILE:
${patient}

For EACH biomarker:
1. State the value and status (normal/low/high/elevated/deficient)
2. Include normal_range and optimal_range (as numbers: {min, max})
3. Explain in plain language what the value means for THIS patient
4. For High/Low: add 2-3 SPECIFIC action_steps (not generic)
5. Add 1-2 references (PubMed IDs or guideline names)

HEALTH SCORE: Calculate a 0-100 wellness score based on:
- Number of normal/optimal markers (40% weight)
- Presence of high-risk biomarkers (30% weight)
- Cancer screening flags (20% weight)
- Age/sex-appropriate risk factors (10% weight)

SUMMARY: Write a 2-3 sentence plain-English overview of their overall health.

ACTION STEPS (for High/Low only):
- Specific tests: "Request iron saturation (TIBC) test"
- Supplements: "Take 5,000 IU D3 daily with K2 (MK-7)"
- Lifestyle: "Reduce red meat, walk 30 min 5x/week"
- Include timelines: "Retest in 8 weeks"
NEVER generic advice.

REFERENCES: Format as "PMID: 31722bhg" or "AHA Guidelines 2023"

CANCER SCREENING FLAGS - Cross-reference combinations:
- Ferritin >250 + elevated LDH → lymphoma, liver disease
- Iron deficiency in males/post-menopausal → GI malignancy
- Calcium + PTH elevated → parathyroid/malignancy
- PSA >4.0 → prostate screening
- GGT+ALP elevated, ALT normal → pancreatic/biliary
- ESR+CRP elevated + weight loss → malignancy workup
- Ferritin >1000 → urgent hematologic workup
- PSA baseline for men 30-40 (save for trends)

For each flag: (1) what was found, (2) what it indicates, (3) screening recommended.

DOCTOR QUESTIONS: Generate 3-5 specific questions referencing their actual values, ordered by urgency.

Respond ONLY with this JSON (no markdown):
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
