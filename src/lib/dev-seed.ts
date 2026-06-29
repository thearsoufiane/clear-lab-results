// DEV-ONLY MOCK DATA LAYER
//
// A fake Supabase client + realistic fixtures so the real app screens render
// with a living dataset (Day 47, ferritin climbing 22 -> 38, an active 90-day
// protocol, a 12-day streak) WITHOUT touching any real database or needing auth.
//
// Enabled only when BOTH:
//   • import.meta.env.DEV  (never in a production build), and
//   • VITE_SEED === "true" (set in the gitignored .env.local).
//
// supabase.ts swaps the real client for `mockSupabase` when SEED is on. This is
// the harness for rendered-to-rendered screen audits during the vision rebuild.

export const SEED =
  typeof import.meta !== "undefined" &&
  (import.meta as { env?: Record<string, unknown> }).env?.DEV === true &&
  (import.meta as { env?: Record<string, unknown> }).env?.VITE_SEED === "true";

const USER_ID = "00000000-0000-0000-0000-000000000001";
const MEMBER_ID = "11111111-1111-1111-1111-111111111111";

export const fakeUser = {
  id: USER_ID,
  email: "amine@example.com",
  user_metadata: { full_name: "Amine" },
  app_metadata: {},
  aud: "authenticated",
  created_at: new Date().toISOString(),
};

export const fakeSession = {
  access_token: "seed-access-token",
  refresh_token: "seed-refresh-token",
  token_type: "bearer",
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  user: fakeUser,
};

const DAY = 86_400_000;
const iso = (daysAgo: number) => new Date(Date.now() - daysAgo * DAY).toISOString();
const dateStr = (daysAgo: number) =>
  new Date(Date.now() - daysAgo * DAY - new Date().getTimezoneOffset() * 60_000).toISOString().slice(0, 10);

const HABIT_IDS = ["h1", "h2", "h3", "h4"];

/** Ferritin climbing across three reports tells the dashboard's "your ferritin
 *  is climbing" story; other markers give a believable "% in range". */
function report(daysAgo: number, ferritin: number, vitD: number, crp: number, ferStatus: "low" | "normal", vitDStatus: "low" | "normal") {
  return {
    id: `report-${daysAgo}`,
    user_id: USER_ID,
    member_id: MEMBER_ID,
    title: "Complete Blood Panel",
    file_name: `panel-${dateStr(daysAgo)}.pdf`,
    created_at: iso(daysAgo),
    patient_id: null,
    analysis: {
      title: "Complete Blood Panel",
      summary: "Iron stores recovering; inflammation low.",
      values: [
        {
          name: "Ferritin",
          value: `${ferritin} ng/mL`,
          status: ferStatus,
          explanation: "Ferritin reflects your iron stores — your body's iron savings account.",
          normal_range: { min: 15, max: 200 },
          optimal_range: { min: 30, max: 120 },
        },
        {
          name: "Vitamin D",
          value: `${vitD} ng/mL`,
          status: vitDStatus,
          explanation: "Vitamin D supports energy, mood and bone health.",
          normal_range: { min: 20, max: 80 },
          optimal_range: { min: 40, max: 60 },
        },
        {
          name: "CRP",
          value: `${crp} mg/L`,
          status: "normal",
          explanation: "C-reactive protein is a marker of inflammation. Yours is low.",
          normal_range: { min: 0, max: 3 },
          optimal_range: { min: 0, max: 1 },
        },
        {
          name: "Vitamin B12",
          value: "365 pg/mL",
          status: "normal",
          explanation: "B12 supports energy and nerve function.",
          normal_range: { min: 200, max: 900 },
          optimal_range: { min: 400, max: 800 },
        },
      ],
      screenings: [],
    },
  };
}

// ascending (oldest -> newest); ferritin 22 -> 30 -> 38
const REPORTS = [
  report(90, 22, 24, 1.2, "low", "low"),
  report(45, 30, 29, 1.0, "normal", "low"),
  report(3, 38, 44, 0.8, "normal", "normal"),
];

const PROTOCOLS = [
  {
    id: "protocol-1",
    user_id: USER_ID,
    member_id: MEMBER_ID,
    title: "Iron & Energy Reset",
    status: "active",
    starts_at: dateStr(46), // -> Day 47 of 90
    ends_at: dateStr(-44),
    focus_areas: [{ biomarker: "Ferritin", label: "Iron" }],
    created_at: iso(46),
  },
];

const HABITS = [
  { id: "h1", protocol_id: "protocol-1", member_id: MEMBER_ID, title: "Iron-rich breakfast", category: "nutrition", frequency: "daily", icon: null, sort_order: 1 },
  { id: "h2", protocol_id: "protocol-1", member_id: MEMBER_ID, title: "10k steps", category: "movement", frequency: "daily", icon: null, sort_order: 2 },
  { id: "h3", protocol_id: "protocol-1", member_id: MEMBER_ID, title: "Vitamin D + K2", category: "supplement", frequency: "daily", icon: null, sort_order: 3 },
  { id: "h4", protocol_id: "protocol-1", member_id: MEMBER_ID, title: "Sleep before 23:00", category: "sleep", frequency: "daily", icon: null, sort_order: 4 },
];

const TODAY_CHECKIN = { member_id: MEMBER_ID, checkin_date: dateStr(0), completed_habit_ids: ["h1", "h2"] };
// 12 consecutive completed days (today + 11) -> 12-day streak
const RECENT_CHECKINS = Array.from({ length: 12 }, (_, i) => ({
  member_id: MEMBER_ID,
  checkin_date: dateStr(i),
  completed_habit_ids: i === 0 ? ["h1", "h2"] : HABIT_IDS,
}));

const MOM_ID = "22222222-2222-2222-2222-222222222222";
const MEMBERS = [
  { id: MEMBER_ID, owner_user_id: USER_ID, name: "Amine", relationship: "self", dob: null, age: 28, sex: "male", color: "#FF7A18", created_at: iso(120), consent_at: iso(120) },
  // a second profile so Family shows the You · Mom · Add row + "1 slot left".
  // Member-only (no reports/protocol) — the mock client can't filter .eq by
  // member, so seeding her data would leak into Amine's screens.
  { id: MOM_ID, owner_user_id: USER_ID, name: "Mom", relationship: "parent", dob: null, age: 58, sex: "female", color: "#FFB066", created_at: iso(60), consent_at: iso(60) },
];

const PROFILES = [{ id: USER_ID, user_id: USER_ID, plan: "personal" }];

// A short Anna exchange — the first turn names "Ferritin" so the chat surface
// drops an inline gauge mid-conversation (data-in-dialogue).
const CHAT_MESSAGES = [
  { role: "assistant", content: "Your Ferritin came back at 38. Three weeks ago you were at 22 — that's real movement.", created_at: new Date(Date.now() - 3 * 60_000).toISOString(), member_id: MEMBER_ID },
  { role: "user", content: "is that good?", created_at: new Date(Date.now() - 2 * 60_000).toISOString(), member_id: MEMBER_ID },
  { role: "assistant", content: "It's comfortably in range now. Let's keep it climbing — stay with the iron-rich dinners a little longer.", created_at: new Date(Date.now() - 1 * 60_000).toISOString(), member_id: MEMBER_ID },
];

const TABLES: Record<string, Record<string, unknown>[]> = {
  members: MEMBERS,
  reports: REPORTS,
  health_protocols: PROTOCOLS,
  protocol_habits: HABITS,
  daily_checkins: RECENT_CHECKINS,
  profiles: PROFILES,
  health_chat_messages: CHAT_MESSAGES,
};

// Minimal chainable query builder: filters are ignored (single seeded member),
// awaiting the chain yields all rows; maybeSingle/single yield the first row.
// Tables needing a specific single row (today's checkin, profile) are special-cased.
function builder(table: string) {
  let single: Record<string, unknown> | null | undefined;
  if (table === "daily_checkins") single = TODAY_CHECKIN; // maybeSingle = today
  // Fixtures are stored ascending by their sort column; honor descending
  // .order() so callers that take [0]/maybeSingle as "newest" get the newest.
  let desc = false;
  const rows = () => {
    const r = (TABLES[table] ?? []).slice();
    return desc ? r.reverse() : r;
  };
  const first = () => (single !== undefined ? single : rows()[0] ?? null);

  const api: Record<string, unknown> = {
    select: () => api,
    eq: () => api,
    neq: () => api,
    not: () => api,
    is: () => api,
    in: () => api,
    gte: () => api,
    lte: () => api,
    order: (_col: string, opts?: { ascending?: boolean }) => {
      if (opts && opts.ascending === false) desc = true;
      return api;
    },
    limit: () => api,
    range: () => api,
    maybeSingle: async () => ({ data: first(), error: null }),
    single: async () => ({ data: first(), error: null }),
    insert: (vals: Record<string, unknown>) => ({
      select: () => ({
        single: async () => ({ data: { id: MEMBER_ID, ...vals }, error: null }),
        maybeSingle: async () => ({ data: { id: MEMBER_ID, ...vals }, error: null }),
      }),
    }),
    update: () => ({ eq: async () => ({ data: null, error: null }) }),
    upsert: async () => ({ data: null, error: null }),
    delete: () => ({ eq: async () => ({ data: null, error: null }) }),
    // make the chain awaitable -> resolves to the full table
    then: (resolve: (v: { data: unknown; error: null }) => unknown) => resolve({ data: rows(), error: null }),
  };
  return api;
}

export const mockSupabase = {
  from: (table: string) => builder(table),
  auth: {
    getSession: async () => ({ data: { session: fakeSession }, error: null }),
    getUser: async () => ({ data: { user: fakeUser }, error: null }),
    onAuthStateChange: (cb: (event: string, session: typeof fakeSession) => void) => {
      setTimeout(() => cb("SIGNED_IN", fakeSession), 0);
      return { data: { subscription: { unsubscribe() {} } } };
    },
    signInWithPassword: async () => ({ data: { session: fakeSession, user: fakeUser }, error: null }),
    signOut: async () => ({ error: null }),
  },
};
