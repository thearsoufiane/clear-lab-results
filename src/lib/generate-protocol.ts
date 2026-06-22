import { supabase, type Analysis } from "@/lib/supabase";

/**
 * Generates a structured 90-day health protocol from a blood test analysis.
 *
 * The OpenAI call + database writes happen server-side in the
 * `generate-protocol` Supabase Edge Function (which holds the OpenAI key as a
 * secret and writes with the service-role key after verifying the caller's
 * JWT). This client helper just invokes it and returns the new protocol id.
 */

/** A biomarker the plan is focused on (only flagged ones). */
export type ProtocolFocusArea = {
  biomarker: string;
  current_value: string;
  target_value: string;
  label: string;
};

/** A single actionable habit in the protocol. */
export type ProtocolHabit = {
  category: "supplement" | "diet" | "sleep" | "exercise" | "lifestyle";
  title: string;
  why: string;
  frequency: "daily" | "weekly" | "with_meals" | string;
  icon: string;
  sort_order: number;
};

/**
 * Generate, persist (server-side), and return the id of a new 90-day protocol.
 *
 * @param userId         The owner's auth.users id.
 * @param reportId       The blood-test report that triggered this protocol.
 * @param analysisResult The analysis JSON (the `Analysis` object from the report).
 * @returns              The created `health_protocols.id`.
 */
export async function generateProtocol(
  userId: string,
  reportId: string,
  analysisResult: Analysis | Record<string, unknown>,
  memberId?: string | null,
): Promise<string> {
  const { data, error } = await supabase.functions.invoke("generate-protocol", {
    body: { userId, reportId, analysisResult, memberId },
  });

  // A non-2xx from the function surfaces here; try to read the server's {error}.
  if (error) {
    let message = error.message || "Failed to generate protocol.";
    const ctx = (error as { context?: Response }).context;
    if (ctx && typeof ctx.json === "function") {
      try {
        const body = await ctx.json();
        if (body?.error) message = body.error;
      } catch {
        // keep the generic message
      }
    }
    throw new Error(message);
  }

  if (data?.error) throw new Error(data.error);
  if (!data?.protocolId) throw new Error("No protocol id returned from generate-protocol.");

  return data.protocolId as string;
}
