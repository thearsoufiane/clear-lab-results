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
    aliases: ["egfr", "estimated gfr", "glomerular filtration rate"],
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

export function normalizeBiomarkerName(raw: string): string | null {
  const cleaned = raw
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, " ");
  return ALIAS_INDEX[cleaned] ?? null;
}

export function getStaticRange(canonicalKey: string): RangeDef | null {
  return REFERENCE_RANGES[canonicalKey] ?? null;
}
