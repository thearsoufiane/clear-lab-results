import { createServerFn } from "@tanstack/react-start";

export const analyzeLabReport = createServerFn({ method: "POST" })
  .inputValidator((data: { base64: string; mimeType: string; fileName?: string }) => data)
  .handler(async ({ data }) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY is not configured on the server.");

    const systemPrompt = `You are a medical lab report interpreter. Analyze ALL lab values and respond ONLY with this exact JSON structure, no markdown:
{
  "title": "short descriptive title of the report",
  "values": [
    { "name": "lab value name", "value": "number with unit", "status": "normal or low or high or elevated or deficient", "explanation": "2-3 sentences in plain language" }
  ],
  "screenings": [
    { "name": "screening name", "detail": "why recommended", "urgency": "urgent or routine or informational" }
  ]
}`;

    const isPdf = data.mimeType === "application/pdf";
    const dataUrl = `data:${data.mimeType};base64,${data.base64}`;

    const userContent: any[] = [
      { type: "text", text: "Analyze this lab report and return the JSON described." },
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
