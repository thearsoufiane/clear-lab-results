import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";

export type Relationship = "self" | "partner" | "child" | "parent" | "other";

export type Member = {
  id: string;
  owner_user_id: string;
  name: string;
  relationship: Relationship;
  dob: string | null;
  age: number | null;
  sex: string | null;
  color: string;
  created_at: string;
};

/** Brand accent palette offered in the add/edit member modal. */
export const MEMBER_COLORS = ["#F5A623", "#6FCF97", "#E0706A", "#5B8DEF", "#B57EDC", "#E3A94A", "#4FD1C5", "#F58FB4"];

type Ctx = {
  members: Member[];
  activeMember: Member | null;
  activeMemberId: string | null;
  loading: boolean;
  setActiveMember: (id: string) => void;
  reload: () => Promise<Member[]>;
};

const ActiveMemberContext = createContext<Ctx | null>(null);
const LS_KEY = "labread:active-member";

export function ActiveMemberProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [activeId, setActiveIdState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async (): Promise<Member[]> => {
    if (!user) {
      setMembers([]);
      setActiveIdState(null);
      setLoading(false);
      return [];
    }
    const { data } = await supabase
      .from("members").select("*").eq("owner_user_id", user.id).order("created_at", { ascending: true });
    let list = (data as Member[]) ?? [];

    // Ensure a "self" member exists — new signups have none yet. The partial
    // unique index (one self per owner) protects against insert races.
    if (!list.some((m) => m.relationship === "self")) {
      const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
      const name = (meta.full_name as string) || (user.email ? user.email.split("@")[0] : "") || "Me";
      const { data: created } = await supabase
        .from("members")
        .insert({ owner_user_id: user.id, name, relationship: "self", color: "#F5A623" })
        .select("*").maybeSingle();
      if (created) {
        list = [created as Member, ...list];
      } else {
        const r = await supabase.from("members").select("*").eq("owner_user_id", user.id).order("created_at", { ascending: true });
        list = (r.data as Member[]) ?? list;
      }
    }

    setMembers(list);
    let stored: string | null = null;
    try { stored = localStorage.getItem(LS_KEY); } catch { /* ignore */ }
    const next =
      stored && list.some((m) => m.id === stored)
        ? stored
        : (list.find((m) => m.relationship === "self")?.id ?? list[0]?.id ?? null);
    setActiveIdState(next);
    setLoading(false);
    return list;
  }, [user]);

  useEffect(() => {
    if (!authLoading) reload();
  }, [authLoading, reload]);

  const setActiveMember = useCallback((id: string) => {
    setActiveIdState(id);
    try { localStorage.setItem(LS_KEY, id); } catch { /* ignore */ }
  }, []);

  const activeMember = members.find((m) => m.id === activeId) ?? null;

  return (
    <ActiveMemberContext.Provider value={{ members, activeMember, activeMemberId: activeId, loading, setActiveMember, reload }}>
      {children}
    </ActiveMemberContext.Provider>
  );
}

export function useActiveMember(): Ctx {
  const ctx = useContext(ActiveMemberContext);
  if (!ctx) throw new Error("useActiveMember must be used within ActiveMemberProvider");
  return ctx;
}

/* ---- small shared helpers for member UI ---- */
export function memberInitials(name: string): string {
  const ii = String(name ?? "").trim().split(/\s+/).slice(0, 2).map((p) => p[0] || "").join("").toUpperCase();
  return ii || "·";
}
export const RELATIONSHIP_LABEL: Record<Relationship, string> = {
  self: "You", partner: "Partner", child: "Child", parent: "Parent", other: "Family",
};
