// flag-biomarkers.ts
// Pure, deterministic. No LLM calls happen in this file.
// This is the layer that replaces "ask the LLM to judge if 58 is normal HDL"
// with "math decides the status, the LLM only explains it."

import { normalizeBiomarkerName, getStaticRange, RangeDef } from "./reference-ranges.ts";

export type FlagStatus = "low" | "normal" | "high" | "critical_low" | "critical_high" | "unrecognized";

export interface RawBiomarker {
  name: string;          // as it appeared on the report, e.g. "Glucosio"
  value: number;
  unit?: string;
  reportedRange?: string; // e.g. "70-110", "< 200", "> 40" — straight from the PDF/CSV if your extraction step captures it
}

export interface FlaggedBiomarker {
  rawName: string;
  canonicalName: string | null; // null if we couldn't match it to anything known
  value: number;
  unit: string;
  rangeUsed: { low?: number; high?: number; source: "reported" | "static" | "none" };
  status: FlagStatus;
}

// If a value is this many multiples beyond the range edge, and no explicit
// critical threshold exists for that biomarker, treat it as critical anyway.
// e.g. range high = 100, value = 260 -> 2.6x the edge -> critical.
const FAR_OUTSIDE_MULTIPLIER = 2.5;

/**
 * Parses report-printed range strings into {low, high}.
 * Handles: "70-110", "70 - 110", "< 200", "<200", "> 40", ">=40", "40+"
 */
export function parseReportedRange(rangeStr: string): { low?: number; high?: number } | null {
  const s = rangeStr.trim();

  const dash = s.match(/^(-?\d+\.?\d*)\s*-\s*(-?\d+\.?\d*)$/);
  if (dash) {
    return { low: parseFloat(dash[1]), high: parseFloat(dash[2]) };
  }

  const lessThan = s.match(/^<\s*=?\s*(-?\d+\.?\d*)$/);
  if (lessThan) {
    return { high: parseFloat(lessThan[1]) };
  }

  const greaterThan = s.match(/^>\s*=?\s*(-?\d+\.?\d*)$/);
  if (greaterThan) {
    return { low: parseFloat(greaterThan[1]) };
  }

  const plus = s.match(/^(-?\d+\.?\d*)\s*\+$/);
  if (plus) {
    return { low: parseFloat(plus[1]) };
  }

  return null; // unrecognized format — caller should fall back to static range
}

function statusFromRange(
  value: number,
  range: { low?: number; high?: number },
  staticDef: RangeDef | null
): FlagStatus {
  const { low, high } = range;
  const criticalLow = staticDef?.criticalLow;
  const criticalHigh = staticDef?.criticalHigh;

  if (criticalLow !== undefined && value <= criticalLow) return "critical_low";
  if (criticalHigh !== undefined && value >= criticalHigh) return "critical_high";

  if (low !== undefined && value < low) {
    // no explicit critical threshold -> infer from how far outside
    if (criticalLow === undefined && value <= low / FAR_OUTSIDE_MULTIPLIER) return "critical_low";
    return "low";
  }
  if (high !== undefined && value > high) {
    if (criticalHigh === undefined && value >= high * FAR_OUTSIDE_MULTIPLIER) return "critical_high";
    return "high";
  }
  return "normal";
}

export function flagBiomarker(raw: RawBiomarker): FlaggedBiomarker {
  const canonicalName = normalizeBiomarkerName(raw.name);
  const staticDef = canonicalName ? getStaticRange(canonicalName) : null;

  let rangeUsed: FlaggedBiomarker["rangeUsed"];
  let parsedRange: { low?: number; high?: number } | null = null;

  if (raw.reportedRange) {
    parsedRange = parseReportedRange(raw.reportedRange);
    if (parsedRange) {
      rangeUsed = { ...parsedRange, source: "reported" };
    }
  }

  if (!parsedRange && staticDef) {
    parsedRange = { low: staticDef.low, high: staticDef.high };
    rangeUsed = { ...parsedRange, source: "static" };
  }

  if (!parsedRange) {
    rangeUsed = { source: "none" };
  }

  const status: FlagStatus =
    !canonicalName && !parsedRange
      ? "unrecognized"
      : parsedRange
      ? statusFromRange(raw.value, parsedRange, staticDef)
      : "unrecognized";

  return {
    rawName: raw.name,
    canonicalName,
    value: raw.value,
    unit: raw.unit ?? staticDef?.unit ?? "",
    rangeUsed: rangeUsed!,
    status,
  };
}

export function flagAllBiomarkers(raws: RawBiomarker[]): FlaggedBiomarker[] {
  return raws.map(flagBiomarker);
}
