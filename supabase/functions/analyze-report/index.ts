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

    const systemPrompt = `You are a medical lab report interpreter personalizing analysis to a specific patient.

PATIENT PROFILE:
${patient}

Use the patient's age, biological sex and existing conditions to:
- Apply age- and sex-appropriate reference ranges when relevant
- Tailor each explanation to what the value means for THIS patient given their conditions
- Prioritize screenings that are specifically recommended for their age, sex and risk factors (e.g. mammography, colonoscopy, lipid panel cadence, A1c monitoring for diabetics, BP follow-up for hypertensives, lung cancer screening for smokers, cardiac workup for heart disease history)

Respond ONLY with this exact JSON structure, no markdown:
{
  "title": "short descriptive title of the report",
  "values": [
    { "name": "lab value name", "value": "number with unit", "status": "normal or low or high or elevated or deficient", "explanation": "2-3 sentences in plain language, personalized to the patient when relevant" }
  ],
  "screenings": [
    { "name": "screening name", "detail": "why recommended for THIS patient (reference their age/sex/conditions when applicable)", "urgency": "urgent or routine or informational" }
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
