import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL = "https://lxbpwjktchbdoyphnbvt.supabase.co";
export const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4YnB3amt0Y2hiZG95cGhuYnZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMzE4MTMsImV4cCI6MjA5MzgwNzgxM30.V8svnORZiLD2Ttvfv9obxVbPCYBEOHiAxQVB0t9csjE";

// Only initialize Supabase on the client side to avoid SSR WebSocket issues
export const supabase = (() => {
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
};

export type Analysis = {
  title: string;
  values: Array<{
    name: string;
    value: string;
    status: "normal" | "low" | "high" | "elevated" | "deficient";
    explanation: string;
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
  }>;
};
