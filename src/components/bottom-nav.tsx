import { Link, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { Home, CheckCircle2, TrendingUp, MessageCircle } from "lucide-react";

const TABS = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/checkin", label: "Today", icon: CheckCircle2 },
  { to: "/progress", label: "Progress", icon: TrendingUp },
  { to: "/chat", label: "Coach", icon: MessageCircle },
] as const;

/**
 * Persistent bottom tab bar for the four main app screens.
 * Renders only when the user is authenticated AND on one of the tab routes
 * (so it's hidden on /, /auth, and non-tab pages like /report or /profile).
 */
export function BottomNav() {
  const { user } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const activeTab = TABS.find((t) => pathname === t.to || pathname.startsWith(`${t.to}/`));
  if (!user || !activeTab) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 bg-card border-t border-border/60">
      <div className="max-w-[480px] mx-auto grid grid-cols-4 h-16 sm:h-14">
        {TABS.map((t) => {
          const active = t.to === activeTab.to;
          const Icon = t.icon;
          return (
            <Link
              key={t.to}
              to={t.to}
              className={`flex flex-col items-center justify-center gap-1 transition-colors duration-150 ${
                active ? "text-accent" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] leading-none">{t.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
