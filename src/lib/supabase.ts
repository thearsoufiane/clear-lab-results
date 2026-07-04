import { createClient } from "@supabase/supabase-js";
import { SEED, mockSupabase } from "./dev-seed";

const env = (typeof import.meta !== "undefined" ? (import.meta as { env?: Record<string, string> }).env : undefined) ?? {};

// Project URL + anon key come from VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
// (.env.local for dev, deploy env for prod). The literals are a fallback so the
// app still boots if the vars aren't set.
export const SUPABASE_URL =
  env.VITE_SUPABASE_URL || "https://lxbpwjktchbdoyphnbvt.supabase.co";
export const SUPABASE_ANON_KEY =
  env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4YnB3amt0Y2hiZG95cGhuYnZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMzE4MTMsImV4cCI6MjA5MzgwNzgxM30.V8svnORZiLD2Ttvfv9obxVbPCYBEOHiAxQVB0t9csjE";

/** Base URL for edge-function calls. Override with VITE_FUNCTIONS_URL (in a
 *  .env.local read by `vite dev`) to point a local frontend at a locally-served
 *  function — e.g. VITE_FUNCTIONS_URL=http://localhost:54321/functions/v1
 *  while running `supabase functions serve analyze-report`. Defaults to remote. */
export const FUNCTIONS_URL: string = env.VITE_FUNCTIONS_URL || `${SUPABASE_URL}/functions/v1`;

// Only initialize Supabase on the client side to avoid SSR WebSocket issues
export const supabase = (() => {
  // Dev-only seeded mock client (see dev-seed.ts) — never active in prod builds.
  if (SEED) return mockSupabase as any;
  if (typeof window === "undefined") {
    // SSR: return a dummy client that will be replaced on the client
    return {
      from: () => ({ select: () => Promise.resolve({ data: null, error: null }) }),
      auth: { signOut: () => Promise.resolve() },
    } as any;
  }
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, storageKey: "labread-auth" },
  });
})();

export type Report = {
  id: string;
  user_id: string;
  title: string;
  analysis: Analysis;
  file_name: string;
  created_at: string;
  is_paid?: boolean;
  patient_id?: string | null;
  member_id?: string | null;
};

export type Analysis = {
  title: string;
  summary?: string;
  health_score?: number;
  is_paid?: boolean;
  values: Array<{
    name: string;
    value: string;
    status: "normal" | "low" | "high" | "elevated" | "deficient";
    explanation: string;
    action_steps?: string[];
    references?: string[];
    normal_range?: { min: number; max: number };
    optimal_range?: { min: number; max: number };
    /** Deterministic flagger: value is in the critical/panic zone (rendered as an
     *  urgent indicator on top of the normal high/low pill). Enum stays unchanged. */
    critical?: boolean;
    /** Deterministic flagger: couldn't classify this marker (no known range +
     *  no printed range) — surfaced in a "review manually" group, not as normal. */
    unrecognized?: boolean;
    /** Non-numeric/qualitative result (e.g. "Negative") passed through unjudged;
     *  shown in its own group and excluded from "% in range" math. */
    qualitative?: boolean;
  }>;
  screenings: Array<{
    name: string;
    detail: string;
    urgency: "urgent" | "routine" | "informational";
  }>;
  doctor_questions?: string[];
  cancer_screening_flags?: Array<{
    title: string;
    explanation: string;
    action_steps?: string[];
    references?: string[];
  }>;
};
