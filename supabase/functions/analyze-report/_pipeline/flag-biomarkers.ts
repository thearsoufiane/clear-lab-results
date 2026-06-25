// flag-biomarkers.ts
// Pure, deterministic. No LLM calls happen in this file.
// This is the layer that replaces "ask the LLM to judge if 58 is normal HDL"
// with "math decides the status, the LLM only explains it."

import {
  normalizeBiomarkerName,
  getStaticRange,
  normalizeUnit,
  convertValue,
  RangeDef,
} from "./reference-ranges.ts";

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
  /** Set when status is "unrecognized" for a diagnosable reason (e.g. a unit
   *  mismatch with no known conversion), so the explanation/UI can say why. */
  reason?: string;
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

  // Display the value in whatever unit it was reported in — we only convert
  // internally for comparison, never for what the user sees.
  const base = {
    rawName: raw.name,
    canonicalName,
    value: raw.value,
    unit: raw.unit ?? staticDef?.unit ?? "",
  };

  // 1. Prefer the range printed on the report. It sits on the same row as the
  //    value, so it's in the value's own unit — the value/range comparison
  //    needs no conversion. But the static critical/panic thresholds are in
  //    the canonical unit, so only apply them if we know the units agree;
  //    otherwise fall back to the far-outside inference on the reported range.
  if (raw.reportedRange) {
    const parsed = parseReportedRange(raw.reportedRange);
    if (parsed) {
      const criticalSafe =
        !staticDef ||
        !raw.unit ||
        normalizeUnit(raw.unit) === normalizeUnit(staticDef.unit);
      return {
        ...base,
        rangeUsed: { ...parsed, source: "reported" },
        status: statusFromRange(raw.value, parsed, criticalSafe ? staticDef : null),
      };
    }
  }

  // 2. Fall back to the static DB range. This lives in the marker's canonical
  //    unit, so the value must be in that unit — convert it if it isn't, and
  //    refuse to compare (unrecognized) if we have no known conversion. This is
  //    the guard against "0.93 mmol/L HDL vs a 40 mg/dL floor -> critical_low".
  if (staticDef) {
    let compareValue = raw.value;
    if (raw.unit && normalizeUnit(raw.unit) !== normalizeUnit(staticDef.unit)) {
      const converted = canonicalName
        ? convertValue(canonicalName, raw.value, raw.unit, staticDef.unit)
        : null;
      if (converted === null) {
        return {
          ...base,
          rangeUsed: { source: "none" },
          status: "unrecognized",
          reason:
            `unit mismatch: reported in "${raw.unit}", reference range is in ` +
            `"${staticDef.unit}", and no known conversion exists — not flagged ` +
            `to avoid a false abnormal result`,
        };
      }
      compareValue = converted;
    }
    return {
      ...base,
      rangeUsed: { low: staticDef.low, high: staticDef.high, source: "static" },
      status: statusFromRange(compareValue, { low: staticDef.low, high: staticDef.high }, staticDef),
    };
  }

  // 3. Nothing to compare against — unknown marker, no printed range.
  return { ...base, rangeUsed: { source: "none" }, status: "unrecognized" };
}

export function flagAllBiomarkers(raws: RawBiomarker[]): FlaggedBiomarker[] {
  return raws.map(flagBiomarker);
}
