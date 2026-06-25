// reference-ranges.ts
// Static fallback reference ranges + critical/panic values.
// IMPORTANT: these are generic adult ranges for fallback only. Always prefer
// the range printed on the actual lab report when it's available (see
// flag-biomarkers.ts — reportedRange takes priority over this database).
// Extend/correct these as you validate against real reports.

export interface RangeDef {
  low?: number;
  high?: number;
  unit: string;
  // Optional hard critical/panic thresholds (clinically dangerous values),
  // independent of the normal range. If omitted, criticality is inferred
  // generically (see flag-biomarkers.ts: FAR_OUTSIDE_MULTIPLIER).
  criticalLow?: number;
  criticalHigh?: number;
  aliases: string[]; // lowercase, no punctuation
}

export const REFERENCE_RANGES: Record<string, RangeDef> = {
  ferritin: {
    low: 20,
    high: 250,
    unit: "ng/mL",
    aliases: ["ferritin", "serum ferritin"],
  },
  vitamin_d: {
    low: 30,
    high: 100,
    unit: "ng/mL",
    criticalLow: 10,
    aliases: ["vitamin d", "25-oh vitamin d", "vitamin d3", "25 hydroxyvitamin d", "vit d"],
  },
  tsh: {
    low: 0.4,
    high: 4.0,
    unit: "mIU/L",
    criticalLow: 0.01,
    criticalHigh: 100,
    aliases: ["tsh", "thyroid stimulating hormone", "thyrotropin"],
  },
  crp: {
    low: 0,
    high: 3.0,
    unit: "mg/L",
    criticalHigh: 100,
    aliases: ["crp", "c-reactive protein", "c reactive protein", "hs-crp", "hscrp"],
  },
  a1c: {
    low: 4.0,
    high: 5.6,
    unit: "%",
    criticalHigh: 14,
    aliases: ["a1c", "hba1c", "hemoglobin a1c", "glycated hemoglobin"],
  },
  glucose: {
    low: 70,
    high: 100,
    unit: "mg/dL",
    criticalLow: 50,
    criticalHigh: 400,
    aliases: ["glucose", "blood glucose", "fasting glucose", "glucosio"],
  },
  hemoglobin: {
    low: 12.0,
    high: 17.5,
    unit: "g/dL",
    criticalLow: 7,
    criticalHigh: 20,
    aliases: ["hemoglobin", "hgb", "hb", "haemoglobin", "emoglobina"],
  },
  total_cholesterol: {
    high: 200,
    unit: "mg/dL",
    aliases: ["total cholesterol", "cholesterol total", "colesterolo totale", "cholesterol"],
  },
  ldl: {
    high: 100,
    unit: "mg/dL",
    aliases: ["ldl", "ldl cholesterol", "low density lipoprotein"],
  },
  hdl: {
    low: 40,
    unit: "mg/dL",
    aliases: ["hdl", "hdl cholesterol", "high density lipoprotein", "colesterolo hdl"],
  },
  triglycerides: {
    high: 150,
    unit: "mg/dL",
    criticalHigh: 1000,
    aliases: ["triglycerides", "trigliceridi", "tg"],
  },
  alt: {
    low: 7,
    high: 56,
    unit: "U/L",
    aliases: ["alt", "alanine aminotransferase", "sgpt"],
  },
  ast: {
    low: 10,
    high: 40,
    unit: "U/L",
    aliases: ["ast", "aspartate aminotransferase", "sgot"],
  },
  creatinine: {
    low: 0.6,
    high: 1.3,
    unit: "mg/dL",
    criticalHigh: 10,
    aliases: ["creatinine", "serum creatinine"],
  },
  egfr: {
    low: 60,
    unit: "mL/min/1.73m2",
    criticalLow: 15,
    aliases: ["egfr", "estimated gfr", "gfr", "glomerular filtration rate"],
  },
  sodium: {
    low: 135,
    high: 145,
    unit: "mEq/L",
    criticalLow: 120,
    criticalHigh: 160,
    aliases: ["sodium", "serum sodium"],
  },
  potassium: {
    low: 3.5,
    high: 5.0,
    unit: "mEq/L",
    criticalLow: 2.5,
    criticalHigh: 6.5,
    aliases: ["potassium", "serum potassium"],
  },
  calcium: {
    low: 8.5,
    high: 10.5,
    unit: "mg/dL",
    criticalLow: 6.0,
    criticalHigh: 13.0,
    aliases: ["calcium", "serum calcium", "total calcium"],
  },
  bun: {
    low: 7,
    high: 20,
    unit: "mg/dL",
    criticalHigh: 100,
    aliases: ["bun", "blood urea nitrogen", "urea nitrogen"],
  },
  wbc: {
    low: 4.0,
    high: 11.0,
    unit: "x10^3/uL",
    criticalLow: 1.0,
    criticalHigh: 30,
    aliases: ["wbc", "white blood cell", "white blood cells", "leukocytes"],
  },
  platelets: {
    low: 150,
    high: 450,
    unit: "x10^3/uL",
    criticalLow: 20,
    criticalHigh: 1000,
    aliases: ["platelets", "plt", "platelet count"],
  },
};

// Flat alias -> canonical key lookup, built once.
const ALIAS_INDEX: Record<string, string> = {};
for (const [key, def] of Object.entries(REFERENCE_RANGES)) {
  for (const alias of def.aliases) {
    ALIAS_INDEX[alias] = key;
  }
}
// Aliases sorted longest-first (by word count) for the containment pass, so a
// specific alias ("ldl cholesterol") wins over a generic one ("cholesterol").
const ALIASES_BY_SPECIFICITY = Object.keys(ALIAS_INDEX).sort(
  (a, b) => b.split(" ").length - a.split(" ").length || b.length - a.length,
);

function clean(s: string): string {
  return s.toLowerCase().trim().replace(/[^\w\s-]/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * Match a printed biomarker name to a canonical key. Handles real-world naming
 * like "Thyroid Stimulating Hormone (TSH)" or "Glomerular Filtration Rate (GFR)"
 * that the old exact-string match missed.
 *
 * 1. EXACT match on each candidate: the full cleaned name, each parenthetical
 *    abbreviation ("(TSH)" -> "tsh"), and the name with parentheticals stripped.
 * 2. Whole-token containment: an alias matches if all its words appear as a
 *    contiguous run of WHOLE words in the name. Whole-word (not substring) so
 *    "salt"/"cobalt" never match "alt" and "vitamin k" never matches a "k".
 */
export function normalizeBiomarkerName(raw: string): string | null {
  const full = clean(raw);

  const candidates = new Set<string>();
  candidates.add(full);
  for (const m of raw.matchAll(/\(([^)]+)\)/g)) candidates.add(clean(m[1]));
  candidates.add(clean(raw.replace(/\([^)]*\)/g, "")));

  for (const c of candidates) {
    if (c && ALIAS_INDEX[c]) return ALIAS_INDEX[c];
  }

  const tokens = full.split(" ").filter(Boolean);
  for (const alias of ALIASES_BY_SPECIFICITY) {
    const aw = alias.split(" ");
    if (aw.length > tokens.length) continue;
    for (let i = 0; i + aw.length <= tokens.length; i++) {
      let hit = true;
      for (let j = 0; j < aw.length; j++) {
        if (tokens[i + j] !== aw[j]) { hit = false; break; }
      }
      if (hit) return ALIAS_INDEX[alias];
    }
  }
  return null;
}

export function getStaticRange(canonicalKey: string): RangeDef | null {
  return REFERENCE_RANGES[canonicalKey] ?? null;
}

/** Normalize a unit string for comparison: lowercase, strip spaces, fold the
 *  micro sign (µ) to "u" so "µmol/L" and "umol/L" match. */
export function normalizeUnit(unit: string): string {
  return unit.toLowerCase().replace(/µ/g, "u").replace(/\s+/g, "").trim();
}

/**
 * Per-analyte unit conversion factors, keyed by canonical marker and a
 * "<from>-><to>" pair of NORMALIZED units. The factor differs per analyte
 * (it depends on molecular weight), so there is no single mmol/L<->mg/dL
 * constant — cholesterol is 38.67, glucose 18.018, triglycerides 88.57, etc.
 * Only markers that genuinely appear in two unit systems are listed; anything
 * not here returns null from convertValue() and is flagged unrecognized rather
 * than compared against a mismatched-unit threshold.
 */
const UNIT_CONVERSIONS: Record<string, Record<string, number>> = {
  // Lipid panel — mmol/L <-> mg/dL (factor 38.67 for cholesterol fractions).
  total_cholesterol: { "mmol/l->mg/dl": 38.67, "mg/dl->mmol/l": 1 / 38.67 },
  ldl: { "mmol/l->mg/dl": 38.67, "mg/dl->mmol/l": 1 / 38.67 },
  hdl: { "mmol/l->mg/dl": 38.67, "mg/dl->mmol/l": 1 / 38.67 },
  // Triglycerides use a different molecular weight -> different factor.
  triglycerides: { "mmol/l->mg/dl": 88.57, "mg/dl->mmol/l": 1 / 88.57 },
  // Glucose — mmol/L <-> mg/dL.
  glucose: { "mmol/l->mg/dl": 18.018, "mg/dl->mmol/l": 1 / 18.018 },
  // Creatinine — µmol/L <-> mg/dL (the SI unit outside the US is µmol/L).
  creatinine: { "umol/l->mg/dl": 1 / 88.42, "mg/dl->umol/l": 88.42 },
  // Calcium — mmol/L <-> mg/dL (atomic-weight based factor ~4).
  calcium: { "mmol/l->mg/dl": 4.0, "mg/dl->mmol/l": 1 / 4.0 },
  // Electrolytes — mmol/L and mEq/L are numerically identical for monovalent
  // ions (sodium, potassium), so the factor is exactly 1.
  sodium: { "mmol/l->meq/l": 1, "meq/l->mmol/l": 1 },
  potassium: { "mmol/l->meq/l": 1, "meq/l->mmol/l": 1 },
};

/**
 * Convert `value` from `fromUnit` to `toUnit` for a given canonical marker.
 * - Returns the value unchanged if the (normalized) units already match.
 * - Returns the converted value if a known factor exists for this marker.
 * - Returns null if the units differ and no conversion is known — the caller
 *   MUST NOT compare across units in that case (fall back to unrecognized).
 */
export function convertValue(
  canonicalKey: string,
  value: number,
  fromUnit: string,
  toUnit: string,
): number | null {
  const from = normalizeUnit(fromUnit);
  const to = normalizeUnit(toUnit);
  if (from === to) return value;
  const factor = UNIT_CONVERSIONS[canonicalKey]?.[`${from}->${to}`];
  if (factor === undefined) return null;
  return value * factor;
}
