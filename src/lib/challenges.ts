import { supabase } from "./supabase";

export type Challenge = {
  id: string; name: string; length_days: number; points_reward: number;
  offer_pct: number; theme: string | null;
  // Optional — not present in every schema; icon is derived from theme.
  icon?: string | null; sort_order?: number; description?: string | null;
};
export type Enrollment = { id: string; challenge_id: string; current_day: number; streak: number; status: string };

/** Per-theme icon gradient for the explore list + active header. */
export const ICON_GRAD: Record<string, string> = {
  energy: "linear-gradient(135deg,#FF9D45,#B23A0C)",
  metabolic: "linear-gradient(135deg,#FFB066,#C2410C)",
  transformation: "linear-gradient(135deg,#FF7A18,#5E2208)",
  iron: "linear-gradient(135deg,#FF7A18,#B23A0C)",
};

/** Per-theme icon glyph (the schema has no `icon` column). */
export const THEME_ICON: Record<string, string> = {
  iron: "🩸", energy: "⚡", metabolic: "🔥", transformation: "✦",
};
export const challengeIcon = (c: Pick<Challenge, "theme" | "icon">) =>
  c.icon || THEME_ICON[c.theme ?? "iron"] || "◆";

/** Per-theme daily actions (no challenge_actions table yet — templated). */
export const CHALLENGE_ACTIONS: Record<string, string[]> = {
  iron: ["Iron-rich meal", "Vitamin C with dinner"],
  energy: ["Morning sunlight + movement", "Protein-forward breakfast"],
  metabolic: ["Walk after meals", "Nothing to eat after 20:00"],
  transformation: ["Complete today's protocol", "Note how you're feeling"],
};

/** Points balance = sum of the account's points_ledger. The economy tables
 *  (enrollments/points_ledger/offers/stories) are scoped by profile_id
 *  (= profiles.id = auth uid), i.e. account-level, not per family member. */
export async function loadPoints(profileId: string | null): Promise<number> {
  if (!profileId) return 0;
  const { data } = await supabase.from("points_ledger").select("points").eq("profile_id", profileId);
  return ((data as { points: number }[]) ?? []).reduce((s, r) => s + (r.points ?? 0), 0);
}
