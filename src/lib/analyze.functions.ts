import { createServerFn } from "@tanstack/react-start";

type Profile = {
  age?: number | null;
  biological_sex?: string | null;
  diabetes?: boolean | null;
  heart_disease?: boolean | null;
  high_blood_pressure?: boolean | null;
  cancer_history?: boolean | null;
  smoking?: boolean | null;
} | null;

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

export const analyzeLabReport = createServerFn({ method: "POST" })
  .inputValidator((data: { base64: string; mimeType: string; fileName?: string; profile?: Profile }) => data)
  .handler(async ({ data }) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY is not configured on the server.");

    const patient = profileSummary(data.profile ?? null);

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

    const isPdf = data.mimeType === "application/pdf";
    const dataUrl = `data:${data.mimeType};base64,${data.base64}`;

    const userContent: any[] = [
      { type: "text", text: `Analyze this lab report for the patient described in the system message and return the JSON described.` },
    ];
    if (isPdf) {
      userContent.push({
        type: "file",
        file: {
          filename: data.fileName || "report.pdf",
          file_data: dataUrl,
        },
      });
    } else {
      userContent.push({ type: "image_url", image_url: { url: dataUrl } });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120_000);

    let res: Response;
    try {
      res = await fetch("https://api.openai.com/v1/chat/completions", {
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

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenAI ${res.status}: ${errText}`);
    }

    const json = await res.json();
    const raw = json.choices?.[0]?.message?.content ?? "";
    const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();

    try {
      return JSON.parse(cleaned);
    } catch {
      throw new Error(`Failed to parse model JSON. Raw: ${cleaned.slice(0, 500)}`);
    }
  });
