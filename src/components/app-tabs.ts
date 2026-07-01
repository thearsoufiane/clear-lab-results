import { useNavigate } from "@tanstack/react-router";
import type { TabItem } from "@/components/lr";

type Nav = ReturnType<typeof useNavigate>;

/** The single app tab bar, shared across every rebuilt screen so the tabs never
 *  drift. `active` is the key of the current tab. */
export function appTabs(nav: Nav, active: string): TabItem[] {
  const t = (key: string, label: string, icon: string, to: string): TabItem => ({
    key, label, icon, active: key === active, onClick: () => nav({ to }),
  });
  return [
    t("home", "Home", "◉", "/dashboard"),
    t("protocol", "Protocol", "◈", "/protocol"),
    t("challenges", "Challenges", "◆", "/challenges"),
    t("anna", "Anna", "✦", "/chat"),
    t("you", "You", "◐", "/family"),
  ];
}
