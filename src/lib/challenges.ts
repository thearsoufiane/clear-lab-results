import { supabase } from "./supabase";

export type Challenge = {
  id: string; name: string; length_days: number; points_reward: number;
  offer_pct: number; theme: string | null; icon: string | null; sort_order: number;
};
export type Enrollment = { id: string; challenge_id: string; current_day: number; streak: number; status: string };

/** Per-theme icon gradient for the explore list + active header. */
export const ICON_GRAD: Record<string, string> = {
  energy: "linear-gradient(135deg,#FF9D45,#B23A0C)",
  metabolic: "linear-gradient(135deg,#FFB066,#C2410C)",
  transformation: "linear-gradient(135deg,#FF7A18,#5E2208)",
  iron: "linear-gradient(135deg,#FF7A18,#B23A0C)",
};

/** Per-theme daily actions (no challenge_actions table yet — templated). */
export const CHALLENGE_ACTIONS: Record<string, string[]> = {
  iron: ["Iron-rich meal", "Vitamin C with dinner"],
  energy: ["Morning sunlight + movement", "Protein-forward breakfast"],
  metabolic: ["Walk after meals", "Nothing to eat after 20:00"],
  transformation: ["Complete today's protocol", "Note how you're feeling"],
};

/** Points balance = sum of the member's points_ledger. */
export async function loadPoints(memberId: string | null): Promise<number> {
  if (!memberId) return 0;
  const { data } = await supabase.from("points_ledger").select("points").eq("member_id", memberId);
  return ((data as { points: number }[]) ?? []).reduce((s, r) => s + (r.points ?? 0), 0);
}
