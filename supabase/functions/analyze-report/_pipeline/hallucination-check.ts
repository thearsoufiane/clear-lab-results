// hallucination-check.ts
// Cheap, deterministic post-check on the LLM's output. Doesn't need another
// model call — just string/set comparison against what was actually sent in.
// Run this before returning the report to the user. If it fails, either
// retry the LLM call once, or strip the offending biomarker entry and flag
// it for manual review rather than serving a silently wrong report.

import { FlaggedBiomarker } from "./flag-biomarkers.ts";

export interface LlmBiomarkerOutput {
  name: string;
  status: string;
  explanation: string;
  action_steps?: string[];
  references?: string[];
  follow_up: string | null;
}

export interface LlmReportOutput {
  summary: string;
  biomarkers: LlmBiomarkerOutput[];
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  // Biomarkers that passed validation and are safe to show
  cleanBiomarkers: LlmBiomarkerOutput[];
}

export function validateLlmOutput(
  flaggedInput: FlaggedBiomarker[],
  llmOutput: LlmReportOutput
): ValidationResult {
  const errors: string[] = [];
  const cleanBiomarkers: LlmBiomarkerOutput[] = [];

  const allowedNames = new Set(
    flaggedInput.map((b) => (b.canonicalName ?? b.rawName).toLowerCase())
  );
  const statusByName = new Map(
    flaggedInput.map((b) => [(b.canonicalName ?? b.rawName).toLowerCase(), b.status])
  );

  for (const item of llmOutput.biomarkers) {
    const key = item.name.toLowerCase();

    if (!allowedNames.has(key)) {
      errors.push(`LLM mentioned "${item.name}" which was not in the input — dropped.`);
      continue; // don't include it in clean output
    }

    const expectedStatus = statusByName.get(key);
    if (expectedStatus && item.status !== expectedStatus) {
      errors.push(
        `LLM changed status for "${item.name}" from "${expectedStatus}" to "${item.status}" — overriding back to deterministic value.`
      );
      cleanBiomarkers.push({ ...item, status: expectedStatus });
      continue;
    }

    cleanBiomarkers.push(item);
  }

  // Check for biomarkers that were flagged but the LLM silently dropped —
  // not a hallucination, but a completeness issue worth surfacing.
  for (const flagged of flaggedInput) {
    const key = (flagged.canonicalName ?? flagged.rawName).toLowerCase();
    const present = llmOutput.biomarkers.some((b) => b.name.toLowerCase() === key);
    if (!present) {
      errors.push(`LLM did not return an explanation for "${flagged.rawName}" — missing from output.`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    cleanBiomarkers,
  };
}
