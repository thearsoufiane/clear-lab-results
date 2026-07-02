import type { Analysis } from "./supabase";

// Number of markers the onboarding "reading" beat reports finding.
export const BIOMARKERS_FOUND = 24;

/**
 * STUB. Returns seeded mock biomarkers for the onboarding flow. This does NOT
 * decide what any result "means" — it just returns pre-seeded data so the
 * first-run experience is alive. The real validated pipeline (the Supabase
 * `analyze-report` edge function: deterministic flagging + constrained
 * explanation) plugs in here later. Do not add medical logic to this stub.
 */
export async function analyzeReport(_file?: File | null): Promise<Analysis> {
  await new Promise((r) => setTimeout(r, 200));
  return {
    title: "Complete Blood Panel",
    summary: "Iron stores recovering; inflammation low.",
    values: [
      { name: "Ferritin", value: "38 ng/mL", status: "normal", explanation: "Iron stores — your body's iron savings account.", optimal_range: { min: 30, max: 120 }, normal_range: { min: 15, max: 200 } },
      { name: "Vitamin D", value: "44 ng/mL", status: "normal", explanation: "Supports energy, mood and bone health.", optimal_range: { min: 40, max: 60 }, normal_range: { min: 20, max: 80 } },
      { name: "Vitamin B12", value: "365 pg/mL", status: "low", explanation: "Supports energy and nerve function.", optimal_range: { min: 400, max: 800 }, normal_range: { min: 200, max: 900 } },
      { name: "CRP", value: "0.8 mg/L", status: "normal", explanation: "A marker of inflammation. Yours is low.", optimal_range: { min: 0, max: 1 }, normal_range: { min: 0, max: 3 } },
      { name: "TSH", value: "2.1 mIU/L", status: "normal", explanation: "Thyroid signal — in a healthy band.", optimal_range: { min: 0.5, max: 2.5 }, normal_range: { min: 0.4, max: 4 } },
    ],
    screenings: [],
  };
}
