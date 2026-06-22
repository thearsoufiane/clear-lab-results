// analyze-report-pipeline.ts
// Example of how this slots into your existing Supabase edge function
// (e.g. analyze-report). Your extraction/OCR step stays exactly as-is —
// this only replaces what happens AFTER you have parsed biomarker values.
//
// Before: parse PDF -> ask OpenAI "here's the raw text, interpret it" (one shot)
// After:  parse PDF -> flag deterministically -> ask OpenAI to explain only -> validate

import { flagAllBiomarkers, RawBiomarker } from "./flag-biomarkers.ts";
import { buildExplanationPrompt } from "./explanation-prompt.ts";
import { validateLlmOutput, LlmReportOutput } from "./hallucination-check.ts";

// Replace with however you currently call OpenAI in your edge function.
async function callOpenAI(systemPrompt: string, userPrompt: string): Promise<LlmReportOutput> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini", // swap for whichever model you're already using
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2, // low temp — this is explanation, not creative writing
    }),
  });

  const data = await response.json();
  const content = data.choices[0].message.content;
  return JSON.parse(content) as LlmReportOutput;
}

export async function analyzeReport(rawBiomarkers: RawBiomarker[]) {
  // 1. DETERMINISTIC — no LLM, can't hallucinate, instant
  const flagged = flagAllBiomarkers(rawBiomarkers);

  // 2. Build constrained prompt from only the flagged data
  const { systemPrompt, userPrompt } = buildExplanationPrompt(flagged);

  // 3. LLM explains only — does not decide status
  const llmOutput = await callOpenAI(systemPrompt, userPrompt);

  // 4. Guardrail — catch invented biomarkers or altered statuses
  const validation = validateLlmOutput(flagged, llmOutput);

  if (!validation.valid) {
    // Log for monitoring — don't silently swallow. Decide your own policy:
    // retry once, or serve cleanBiomarkers with a manual-review flag.
    console.warn("Hallucination/completeness check failed:", validation.errors);
  }

  return {
    summary: llmOutput.summary,
    biomarkers: validation.cleanBiomarkers,
    // surface unrecognized markers explicitly rather than letting the LLM guess
    unrecognized: flagged.filter((b) => b.status === "unrecognized"),
    needsReview: !validation.valid,
  };
}

// --- Example usage ---
// const rawBiomarkers: RawBiomarker[] = [
//   { name: "Glucosio", value: 144, unit: "mg/dL", reportedRange: "70-110" },
//   { name: "HDL", value: 58, unit: "mg/dL" }, // no reportedRange -> falls back to static db
// ];
// const result = await analyzeReport(rawBiomarkers);
