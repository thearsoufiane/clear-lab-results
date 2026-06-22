// analyze-report — deterministic flagging pipeline.
//
// Before: one vision call extracted biomarkers AND decided status AND explained.
// After:  (1) vision call EXTRACTS only (name/value/unit + the range printed on
//             the report) plus report-level context (screenings, cancer flags,
//             doctor questions) — it does NOT judge biomarker status.
//         (2) math (./_pipeline/flag-biomarkers) decides low/normal/high/critical.
//         (3) a second text call EXPLAINS the already-decided statuses only.
//         (4) a cheap string check catches the LLM inventing/altering markers.
//         (5) an adapter maps the result back to the frontend `Analysis` contract.
//
// The frontend contract (src/lib/supabase.ts `Analysis`) is preserved: value is a
// string ("487 ng/mL"), status stays in the existing enum, ranges are {min,max}.
// Two NEW optional per-value fields are added: `critical` and `unrecognized`.

import { flagAllBiomarkers, type RawBiomarker, type FlaggedBiomarker } from "./_pipeline/flag-biomarkers.ts";
import { buildExplanationPrompt } from "./_pipeline/explanation-prompt.ts";
import { validateLlmOutput, type LlmReportOutput } from "./_pipeline/hallucination-check.ts";

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

/** What the extraction (vision) call returns — extraction only, NO status. */
type ExtractionResult = {
  title?: string;
  biomarkers?: Array<{ name?: string; value?: number | string; unit?: string; reportedRange?: string | null }>;
  screenings?: Array<{ name: string; detail: string; urgency: string }>;
  cancer_screening_flags?: Array<{ title: string; explanation: string; action_steps?: string[]; references?: string[] }>;
  doctor_questions?: string[];
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

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}

// ── STEP 1 prompt: EXTRACTION ONLY (no status judgments) ────────────────────
function extractionSystemPrompt(patient: string): string {
  return `You are a lab-report EXTRACTION engine for labread.health. You read the report and pull out structured data. You do NOT decide whether any value is normal, high, or low — a separate deterministic engine does that. Do not output any status, interpretation, or explanation for individual biomarkers.

PATIENT PROFILE:
${patient}

Extract EVERY biomarker / test result that appears, including normal-looking ones. For each, capture:
- "name": the marker name exactly as printed (e.g. "Ferritin", "Glucosio").
- "value": the NUMERIC result as a number only (e.g. 487, 5.4). If the result is non-numeric/qualitative (e.g. "Negative", "Trace"), OMIT that marker entirely — do not invent a number.
- "unit": the unit as printed (e.g. "ng/mL"), or "" if none.
- "reportedRange": the reference range PRINTED ON THE REPORT next to this value, copied verbatim as a string (e.g. "20-250", "< 200", "> 40"). If no range is printed for that marker, use null. Do NOT supply a range from your own knowledge — only what the report shows.

You MAY still produce these report-level items (these legitimately require judgment and are kept):
- "title": a short title for the report.
- "screenings": age/sex-appropriate screening reminders.
- "cancer_screening_flags": cross-marker red flags (e.g. ferritin>250 + elevated LDH). Each: {title, explanation, action_steps[], references[]}.
- "doctor_questions": 3-5 specific questions referencing the actual values.

Respond ONLY with this JSON (no markdown):
{
  "title": "string",
  "biomarkers": [ { "name": "Ferritin", "value": 487, "unit": "ng/mL", "reportedRange": "20-250" } ],
  "screenings": [ { "name": "string", "detail": "why for THIS patient", "urgency": "urgent|routine|informational" } ],
  "cancer_screening_flags": [ { "title": "string", "explanation": "string", "action_steps": ["..."], "references": ["PMID: 12345678"] } ],
  "doctor_questions": ["..."]
}`;
}

async function callOpenAI(apiKey: string, body: Record<string, unknown>, timeoutMs: number): Promise<unknown> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      signal: controller.signal,
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
    const json = await res.json();
    const raw = json.choices?.[0]?.message?.content ?? "";
    const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
    return JSON.parse(cleaned);
  } finally {
    clearTimeout(timeout);
  }
}

// ── adapter: pipeline (FlaggedBiomarker + explanations) → frontend Analysis ──
type CleanBiomarker = { name: string; status: string; explanation: string; action_steps?: string[]; references?: string[]; follow_up?: string | null };

function toFrontendStatus(s: FlaggedBiomarker["status"]): { status: string; critical: boolean; unrecognized: boolean } {
  switch (s) {
    case "normal": return { status: "normal", critical: false, unrecognized: false };
    case "low": return { status: "low", critical: false, unrecognized: false };
    case "high": return { status: "high", critical: false, unrecognized: false };
    case "critical_low": return { status: "low", critical: true, unrecognized: false };
    case "critical_high": return { status: "high", critical: true, unrecognized: false };
    case "unrecognized": return { status: "normal", critical: false, unrecognized: true };
  }
}

function deterministicHealthScore(flagged: FlaggedBiomarker[]): number | null {
  if (!flagged.length) return null;
  const w = flagged.map((b) =>
    b.status === "normal" || b.status === "unrecognized" ? 1
    : b.status === "critical_low" || b.status === "critical_high" ? 0
    : 0.5,
  );
  return Math.round((100 * w.reduce((a, c) => a + c, 0)) / w.length);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { status: 200, headers: corsHeaders });

  try {
    if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) return jsonResponse({ error: "OPENAI_API_KEY is not configured in Supabase secrets." }, 500);

    let payload: AnalyzePayload;
    try { payload = (await req.json()) as AnalyzePayload; } catch { return jsonResponse({ error: "Invalid JSON body." }, 400); }

    const mimeType = payload?.mimeType || payload?.mediaType;
    if (!payload?.base64 || !mimeType) return jsonResponse({ error: "Missing required fields: base64 and mimeType/mediaType." }, 400);

    const patient = profileSummary(payload.profile ?? null);

    // ── STEP 1: EXTRACTION (vision) ─────────────────────────────────────────
    const dataUrl = `data:${mimeType};base64,${payload.base64}`;
    const userContent: Array<Record<string, unknown>> = [
      { type: "text", text: "Extract the structured data from this lab report following the system message and schema. Do not judge whether values are normal/abnormal." },
    ];
    if (mimeType === "application/pdf") {
      userContent.push({ type: "file", file: { filename: payload.fileName || "report.pdf", file_data: dataUrl } });
    } else {
      userContent.push({ type: "image_url", image_url: { url: dataUrl } });
    }

    let extracted: ExtractionResult;
    try {
      extracted = (await callOpenAI(apiKey, {
        model: "gpt-4o-mini",
        temperature: 0.1,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: extractionSystemPrompt(patient) },
          { role: "user", content: userContent },
        ],
      }, 120_000)) as ExtractionResult;
    } catch (e) {
      return jsonResponse({ error: `Extraction failed: ${(e as Error).message}` }, 500);
    }

    // normalize the extracted biomarkers into RawBiomarker[] (numeric values only)
    const raws: RawBiomarker[] = (extracted.biomarkers ?? [])
      .map((b) => {
        const value = typeof b.value === "number" ? b.value : parseFloat(String(b.value ?? ""));
        if (!b.name || !isFinite(value)) return null;
        return {
          name: String(b.name).trim(),
          value,
          unit: b.unit ? String(b.unit).trim() : undefined,
          reportedRange: b.reportedRange ? String(b.reportedRange).trim() : undefined,
        } as RawBiomarker;
      })
      .filter((b): b is RawBiomarker => b !== null);

    if (raws.length === 0) {
      return jsonResponse({ error: "No numeric biomarkers could be extracted from this report. Try a clearer scan." }, 422);
    }

    // ── STEP 2: DETERMINISTIC FLAGGING (no LLM) ────────────────────────────
    const flagged = flagAllBiomarkers(raws);

    // ── STEP 3: EXPLANATION (text, status already decided) ─────────────────
    const { systemPrompt, userPrompt } = buildExplanationPrompt(flagged);
    let llmOutput: LlmReportOutput;
    try {
      llmOutput = (await callOpenAI(apiKey, {
        model: "gpt-4o-mini",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }, 90_000)) as LlmReportOutput;
    } catch (e) {
      return jsonResponse({ error: `Explanation step failed: ${(e as Error).message}` }, 500);
    }

    // ── STEP 4: GUARDRAIL ──────────────────────────────────────────────────
    const validation = validateLlmOutput(flagged, llmOutput);
    if (!validation.valid) console.warn("[analyze-report] hallucination/completeness check:", validation.errors);
    const explById = new Map<string, CleanBiomarker>(
      (validation.cleanBiomarkers as CleanBiomarker[]).map((b) => [b.name.toLowerCase(), b]),
    );

    // ── STEP 5: ADAPT to the frontend `Analysis` contract ──────────────────
    const values = flagged.map((b) => {
      const { status, critical, unrecognized } = toFrontendStatus(b.status);
      const key = (b.canonicalName ?? b.rawName).toLowerCase();
      const expl = explById.get(key);
      const v: Record<string, unknown> = {
        name: b.rawName,
        value: `${b.value}${b.unit ? " " + b.unit : ""}`.trim(),
        status,
        explanation: expl?.explanation ?? (unrecognized ? "This marker could not be automatically classified and should be reviewed manually." : ""),
        action_steps: expl?.action_steps ?? [],
        references: expl?.references ?? [],
      };
      if (critical) v.critical = true;
      if (unrecognized) v.unrecognized = true;
      if (b.rangeUsed.low != null && b.rangeUsed.high != null) {
        v.normal_range = { min: b.rangeUsed.low, max: b.rangeUsed.high };
      }
      return v;
    });

    const analysis = {
      title: extracted.title || payload.fileName || "Lab report",
      summary: llmOutput.summary ?? "",
      health_score: deterministicHealthScore(flagged),
      values,
      screenings: extracted.screenings ?? [],
      cancer_screening_flags: extracted.cancer_screening_flags ?? [],
      doctor_questions: extracted.doctor_questions ?? [],
      // monitoring meta (frontend may ignore): true if a marker was unrecognized
      // or the guardrail caught something.
      needs_review: !validation.valid || flagged.some((b) => b.status === "unrecognized"),
    };

    return jsonResponse(analysis);
  } catch (err) {
    return jsonResponse({ error: (err as Error)?.message || String(err) }, 500);
  }
});
