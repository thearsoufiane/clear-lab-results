import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase, type Report, type Analysis } from "@/lib/supabase";
import { UploadModal } from "@/components/upload-modal";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Today | labread.health" },
      { name: "description", content: "Your daily health dashboard — protocol, habits and progress." },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://labread.health/dashboard" }],
  }),
  component: Dashboard,
});

/* ===== verbatim CSS from labread-app-dashboard.html, mount-scoped via <style> ===== */
const dashCss = `
  .lr-dash *{box-sizing:border-box;margin:0;padding:0}
  body:has(.lr-dash){background:#0B0907;color:#F4ECDF;font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
  .lr-dash a{text-decoration:none;color:inherit}
  @media(min-width:901px){html:has(.lr-dash),body:has(.lr-dash){height:100%;overflow:hidden}}

  .lr-dash{--bg:#0B0907;--bg-2:#100D0A;--surface:#15110A;--surface-2:#17120C;--line:rgba(245,166,35,.13);--line-soft:rgba(245,166,35,.07);
    --cream:#F4ECDF;--muted:#9E9384;--faint:#6F6557;--amber:#F5A623;--amber-lite:#FFC069;--grad:linear-gradient(135deg,#FFC069,#F5853F,#E8743B);
    --green:#6FCF97;--warn:#E3A94A;--red:#E0706A;
    --serif:'Fraunces',Georgia,serif;--sans:'Inter',system-ui,sans-serif;--mono:'JetBrains Mono',monospace;
    color:var(--cream);font-family:var(--sans)}

  /* ===== SHELL ===== */
  .app{display:grid;grid-template-columns:262px minmax(0,1fr) 322px;grid-template-rows:minmax(0,1fr) auto;
    grid-template-areas:"side main rail" "coach coach coach";height:100vh}
  .sidebar{grid-area:side;overflow-y:auto;border-right:1px solid var(--line-soft);padding:24px 18px;display:flex;flex-direction:column;gap:18px;background:linear-gradient(180deg,var(--bg-2),var(--bg))}
  .main{grid-area:main;overflow-y:auto;padding:30px 36px}
  .rail{grid-area:rail;overflow-y:auto;border-left:1px solid var(--line-soft);padding:26px 20px;display:flex;flex-direction:column;gap:16px;background:linear-gradient(180deg,var(--bg-2),var(--bg))}
  .coachbar{grid-area:coach;display:flex;align-items:center;gap:13px;padding:15px 26px;border-top:1px solid var(--line);background:rgba(16,13,10,.9)}

  /* ===== SIDEBAR ===== */
  .s-prof{display:flex;align-items:center;gap:11px;padding-bottom:16px;border-bottom:1px solid var(--line-soft)}
  .s-av{width:42px;height:42px;border-radius:50%;background:var(--grad);display:grid;place-items:center;font-family:var(--mono);font-weight:600;color:#1a0f02;font-size:14px;flex-shrink:0}
  .s-name{font-size:15px;font-weight:600}
  .s-handle{font-family:var(--mono);font-size:10.5px;color:var(--faint)}
  .s-nav{display:flex;flex-direction:column;gap:2px}
  .s-nav a{display:flex;align-items:center;gap:12px;font-size:14px;color:var(--muted);padding:11px 12px;border-radius:10px;transition:.15s}
  .s-nav a:hover{color:var(--cream);background:rgba(255,255,255,.03)}
  .s-nav a.on{background:rgba(245,133,63,.1);color:var(--cream)}
  .s-nav a svg{width:17px;height:17px;stroke:currentColor;opacity:.75;fill:none;stroke-width:1.9}
  .s-nav a.on svg{stroke:var(--amber);opacity:1}
  .s-streak{margin-top:auto;border:1px solid var(--line);border-radius:14px;padding:14px;background:rgba(245,133,63,.05)}
  .s-streak .big{font-family:var(--serif);font-size:26px;display:flex;align-items:baseline;gap:7px}
  .s-streak .big small{font-size:12px;color:var(--muted);font-family:var(--sans)}
  .s-streak .sub{font-family:var(--mono);font-size:10px;color:var(--faint);margin-top:3px;letter-spacing:.04em}
  .s-new{border:1px dashed var(--line);border-radius:12px;padding:14px;text-align:center;font-size:13.5px;color:var(--muted);cursor:pointer;transition:.15s;background:none;width:100%;font-family:inherit}
  .s-new:hover{border-color:rgba(245,166,35,.4);color:var(--cream)}
  .s-new b{color:var(--amber-lite);font-weight:600}

  /* ===== MAIN ===== */
  .m-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:22px}
  .today{font-family:var(--serif);font-weight:500;font-size:clamp(28px,3vw,38px);letter-spacing:-.01em}
  .daychip{font-family:var(--mono);font-size:12px;color:var(--amber);letter-spacing:.08em}

  .card{border:1px solid var(--line);border-radius:18px;padding:20px 22px;background:rgba(0,0,0,.22);margin-bottom:16px}
  .f-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:15px}
  .f-name{display:flex;align-items:center;gap:10px;font-family:var(--serif);font-size:22px}
  .f-name .pt{width:9px;height:9px;border-radius:50%;background:var(--green)}
  .f-val{font-family:var(--mono);font-size:15px;color:var(--cream)}
  .f-val .up{color:var(--green)}
  .f-row{display:grid;grid-template-columns:1fr 150px;gap:24px;align-items:center}
  .bar{height:7px;border-radius:99px;background:rgba(255,255,255,.07);position:relative;margin:3px 0 8px}
  .bar .fill{position:absolute;left:0;top:0;bottom:0;border-radius:99px;background:linear-gradient(90deg,var(--warn),var(--green))}
  .bar .now{position:absolute;top:-3px;width:13px;height:13px;border-radius:50%;background:var(--cream);border:2px solid var(--bg)}
  .scale{display:flex;justify-content:space-between;font-family:var(--mono);font-size:10.5px;color:var(--faint)}
  .spark svg{width:100%;height:56px;display:block}
  .f-insight{margin-top:16px;font-size:14.5px;color:var(--muted);line-height:1.55}
  .f-insight b{color:var(--amber-lite);font-weight:600}

  .h-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
  .h-head .t{font-family:var(--mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--faint)}
  .h-head .c{font-family:var(--mono);font-size:12px;color:var(--amber)}
  .h-row{display:flex;align-items:center;gap:13px;padding:13px 0;border-top:1px solid var(--line-soft);font-size:15.5px;cursor:pointer}
  .h-row:first-of-type{border-top:none}
  .check{width:22px;height:22px;border-radius:7px;border:1.5px solid var(--line);display:grid;place-items:center;flex-shrink:0;transition:.15s}
  .check.done{background:var(--grad);border-color:transparent}
  .check svg{width:13px;height:13px;stroke:#1a0f02;stroke-width:3;fill:none;opacity:0}
  .check.done svg{opacity:1}
  .h-row.done .h-name{color:var(--muted)}
  .h-name{flex:1}
  .h-tag{font-family:var(--mono);font-size:11px;color:var(--faint)}

  /* ===== RAIL ===== */
  .ring-card{border:1px solid var(--line);border-radius:16px;padding:18px;text-align:center;background:rgba(0,0,0,.22)}
  .ring-card .ttl{font-family:var(--mono);font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--faint);margin-bottom:10px}
  .ring-card svg{width:140px;height:140px}
  .ring-card .pc{font-family:var(--serif);fill:var(--cream)}
  .ring-card .lab{font-family:var(--mono);font-size:11px;color:var(--green);margin-top:8px}
  .mini{border:1px solid var(--line);border-radius:14px;padding:15px 16px;background:rgba(0,0,0,.22)}
  .mini .t{font-family:var(--mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--faint);margin-bottom:8px}
  .mini .v{font-family:var(--serif);font-size:28px;display:flex;align-items:baseline;gap:5px}
  .mini .v small{font-size:13px;color:var(--muted);font-family:var(--sans)}
  .mini.act{border-color:rgba(245,166,35,.3);background:rgba(245,133,63,.05)}
  .mini .go{font-family:var(--mono);font-size:11px;color:var(--amber-lite);margin-top:9px;display:inline-block;cursor:pointer}

  /* ===== COACH BAR ===== */
  .c-orb{width:34px;height:34px;border-radius:50%;background:radial-gradient(circle at 40% 35%,#3a2a12,#0d0a07);border:1px solid var(--line);display:grid;place-items:center;flex-shrink:0}
  .c-orb i{width:11px;height:11px;border-radius:50%;background:var(--grad);box-shadow:0 0 12px var(--amber);animation:lrorbpulse 2.6s ease-in-out infinite}
  @keyframes lrorbpulse{0%,100%{transform:scale(1);opacity:.9}50%{transform:scale(1.25);opacity:1}}
  .c-input{flex:1;background:rgba(0,0,0,.32);border:1px solid var(--line-soft);border-radius:11px;padding:12px 16px;font-size:14px;color:var(--muted);cursor:pointer}
  .c-send{width:38px;height:38px;border-radius:10px;background:var(--grad);display:grid;place-items:center;flex-shrink:0;cursor:pointer}
  .c-send svg{width:16px;height:16px;stroke:#1a0f02;stroke-width:2.5;fill:none}

  /* ===== loading skeleton ===== */
  .skel{display:inline-block;background:linear-gradient(90deg,rgba(255,255,255,.05),rgba(255,255,255,.1),rgba(255,255,255,.05));background-size:200% 100%;border-radius:6px;animation:lrskel 1.3s ease-in-out infinite;color:transparent}
  @keyframes lrskel{0%{background-position:200% 0}100%{background-position:-200% 0}}

  /* ===== MOBILE CHROME ===== */
  .appbar-m,.tabbar{display:none}
  .logo-mark{display:inline-block}

  @media(max-width:900px){
    html:has(.lr-dash),body:has(.lr-dash){height:auto;overflow:visible}
    .appbar-m{display:flex;position:fixed;top:0;left:0;right:0;height:56px;align-items:center;justify-content:space-between;
      padding:0 16px;background:rgba(11,9,7,.86);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid var(--line-soft);z-index:40}
    .appbar-m .brand{display:flex;align-items:center;gap:9px}
    .appbar-m .logo-mark{width:30px;height:30px;filter:drop-shadow(0 0 10px rgba(245,133,63,.4))}
    .appbar-m .word{font-family:var(--serif);font-size:20px;font-weight:600}
    .appbar-m .av{width:32px;height:32px;border-radius:50%;background:var(--grad);display:grid;place-items:center;font-family:var(--mono);font-size:12px;font-weight:600;color:#1a0f02}

    .app{display:block;height:auto;padding:56px 0 150px}
    .sidebar{display:none}
    .main{overflow:visible;padding:22px 16px 6px}
    .m-head{margin-bottom:18px}
    .today{font-size:30px}
    .f-row{grid-template-columns:1fr;gap:6px}
    .spark{margin-top:4px}

    .rail{overflow:visible;border-left:none;padding:6px 16px 0;display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .ring-card{grid-column:1 / -1}

    .coachbar{position:fixed;bottom:62px;left:0;right:0;z-index:39;padding:11px 14px;border-top:1px solid var(--line)}

    .tabbar{display:grid;grid-template-columns:repeat(4,1fr);position:fixed;bottom:0;left:0;right:0;height:62px;
      background:rgba(11,9,7,.94);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-top:1px solid var(--line-soft);z-index:40}
    .tabbar a{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;color:var(--faint);
      font-family:var(--mono);font-size:9.5px;letter-spacing:.06em;text-transform:uppercase}
    .tabbar a.on{color:var(--amber)}
    .tabbar svg{width:21px;height:21px;stroke:currentColor;fill:none;stroke-width:1.9}
  }
  @media(prefers-reduced-motion:reduce){.c-orb i,.skel{animation:none}}
`;

/* ============================ data helpers ============================ */
const DAY_MS = 86_400_000;
function localDateStr(d: Date): string {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}
function parseDate(s: string): Date {
  return new Date(`${s}T00:00:00`);
}
function numFrom(value: string): number | null {
  const m = String(value ?? "").match(/-?[\d.]+/);
  return m ? parseFloat(m[0]) : null;
}
function unitFrom(value: string): string {
  const m = String(value ?? "").match(/^\s*-?[\d.]+\s*(.*)$/);
  return m ? m[1].trim() : "";
}
function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}
function isInRange(status: string): boolean {
  return status === "normal";
}

type Protocol = {
  id: string;
  title: string | null;
  starts_at: string | null;
  ends_at: string | null;
  focus_areas: Array<{ biomarker?: string; label?: string }> | null;
};
type Habit = { id: string; title: string; category: string; frequency: string | null; icon: string | null; sort_order: number };
type CheckinRow = { checkin_date: string; completed_habit_ids: unknown };
type AnalysisValue = Analysis["values"][number];

function consecutiveStreak(rows: CheckinRow[]): number {
  const done = new Set(
    rows.filter((r) => Array.isArray(r.completed_habit_ids) && r.completed_habit_ids.length > 0).map((r) => r.checkin_date),
  );
  const cur = new Date();
  cur.setHours(0, 0, 0, 0);
  if (!done.has(localDateStr(cur))) cur.setDate(cur.getDate() - 1);
  let s = 0;
  while (done.has(localDateStr(cur))) {
    s++;
    cur.setDate(cur.getDate() - 1);
  }
  return s;
}

/* normalize a biomarker name for matching across reports */
function norm(name: string): string {
  return String(name ?? "").toLowerCase().replace(/\s*\([^)]*\)/g, "").replace(/\s+/g, " ").trim();
}

const CHECK_SVG = (
  <svg viewBox="0 0 24 24">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

function Dashboard() {
  const { user, loading } = useAuth();
  const nav = useNavigate();

  const todayStr = useMemo(() => localDateStr(new Date()), []);
  const [loaded, setLoaded] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  const [reports, setReports] = useState<Report[]>([]); // ascending (oldest → newest)
  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);
  const [coachIdx, setCoachIdx] = useState(0);

  useEffect(() => {
    if (!loading && !user) nav({ to: "/auth" });
  }, [user, loading]);

  // Role gate: doctor/clinic accounts belong on the clinician dashboard.
  useEffect(() => {
    if (loading || !user) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase.from("profiles").select("plan").eq("id", user.id).maybeSingle();
      const plan = (data as { plan?: string } | null)?.plan;
      if (!cancelled && (plan === "professional" || plan === "clinic" || plan === "doctor")) {
        nav({ to: "/clinician" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, loading, nav]);

  const loadAll = useCallback(async () => {
    if (!user) return;

    const [{ data: reps }, { data: proto }] = await Promise.all([
      supabase.from("reports").select("*").order("created_at", { ascending: true }),
      supabase
        .from("health_protocols")
        .select("id, title, starts_at, ends_at, focus_areas")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);
    setReports((reps as Report[]) ?? []);
    setProtocol((proto as Protocol) ?? null);

    if (proto) {
      const [{ data: hb }, { data: today }, { data: recent }] = await Promise.all([
        supabase.from("protocol_habits").select("id, title, category, frequency, icon, sort_order").eq("protocol_id", (proto as Protocol).id).order("sort_order", { ascending: true }),
        supabase.from("daily_checkins").select("completed_habit_ids").eq("user_id", user.id).eq("checkin_date", todayStr).maybeSingle(),
        supabase.from("daily_checkins").select("checkin_date, completed_habit_ids").eq("user_id", user.id).order("checkin_date", { ascending: false }).limit(120),
      ]);
      setHabits((hb as Habit[]) ?? []);
      setCompleted(Array.isArray(today?.completed_habit_ids) ? (today!.completed_habit_ids as string[]) : []);
      setStreak(consecutiveStreak((recent as CheckinRow[]) ?? []));
    }
    setLoaded(true);
  }, [user, todayStr]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // rotate the coach prompt suggestion
  useEffect(() => {
    const t = setInterval(() => setCoachIdx((i) => i + 1), 4500);
    return () => clearInterval(t);
  }, []);

  const toggleHabit = useCallback(
    async (habitId: string) => {
      if (!user || !protocol) return;
      const next = completed.includes(habitId) ? completed.filter((x) => x !== habitId) : [...completed, habitId];
      setCompleted(next); // optimistic
      const { error } = await supabase.from("daily_checkins").upsert(
        { user_id: user.id, protocol_id: protocol.id, checkin_date: todayStr, completed_habit_ids: next },
        { onConflict: "user_id,checkin_date" },
      );
      if (error) {
        setCompleted(completed); // revert
      } else if (next.length > 0 && streak === 0) {
        setStreak(1); // first completion today starts the streak
      }
    },
    [user, protocol, completed, todayStr, streak],
  );

  if (loading || !user) return null;

  /* ---------- derived values ---------- */
  const email = user.email || "";
  const localPart = email.split("@")[0] || "you";
  const displayName = localPart
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
  const initials = (displayName.match(/\b\w/g) || ["U"]).slice(0, 2).join("").toUpperCase();
  const handle = `@${localPart.toLowerCase()}`;

  const startsAt = protocol?.starts_at ?? null;
  const elapsed = startsAt ? clamp(Math.floor((Date.now() - parseDate(startsAt).getTime()) / DAY_MS), 0, 90) : 0;
  const dayX = startsAt ? clamp(elapsed + 1, 1, 90) : null;
  const progressPct = startsAt ? clamp(Math.round((elapsed / 90) * 100), 0, 100) : 0;
  const nextTestDays = startsAt ? Math.max(0, 90 - elapsed) : null;
  const ringOffset = 314 - (314 * progressPct) / 100;

  const latest = reports.length ? reports[reports.length - 1] : null;
  const latestValues: AnalysisValue[] = (latest?.analysis?.values as AnalysisValue[]) ?? [];
  const markersInRange = latestValues.length ? Math.round((latestValues.filter((v) => isInRange(v.status)).length / latestValues.length) * 100) : null;

  // focus marker: protocol's top focus area matched in the latest report, else first flagged, else first value
  const focus: AnalysisValue | null = (() => {
    if (!latestValues.length) return null;
    const target = protocol?.focus_areas?.[0]?.biomarker ? norm(protocol.focus_areas[0].biomarker!) : null;
    if (target) {
      const hit = latestValues.find((v) => norm(v.name) === target || norm(v.name).includes(target) || target.includes(norm(v.name)));
      if (hit) return hit;
    }
    return latestValues.find((v) => !isInRange(v.status)) ?? latestValues[0];
  })();

  const focusNum = focus ? numFrom(focus.value) : null;
  const focusUnit = focus ? unitFrom(focus.value) : "";
  // previous value of the same marker (the report before the latest that contains it)
  const prevValue: string | null = (() => {
    if (!focus) return null;
    for (let i = reports.length - 2; i >= 0; i--) {
      const v = ((reports[i].analysis?.values as AnalysisValue[]) ?? []).find((x) => norm(x.name) === norm(focus.name));
      if (v) return v.value;
    }
    return null;
  })();
  const prevNum = prevValue ? numFrom(prevValue) : null;
  const trendUp = focusNum != null && prevNum != null ? focusNum > prevNum : null;

  // optimal-range bar geometry
  const range = focus?.optimal_range ?? focus?.normal_range ?? null;
  const rangeKind = focus?.optimal_range ? "optimal" : "normal";
  const scaleMax = range ? range.max * 2 : null;
  const nowPct = range && focusNum != null && scaleMax ? clamp((focusNum / scaleMax) * 100, 1, 99) : null;
  const dotColor = focus ? (isInRange(focus.status) ? "var(--green)" : focus.status === "low" || focus.status === "deficient" ? "var(--warn)" : "var(--red)") : "var(--green)";

  // trend sparkline points across all reports that contain the marker
  const sparkPoints: string = (() => {
    if (!focus) return "";
    const nums: number[] = [];
    for (const r of reports) {
      const v = ((r.analysis?.values as AnalysisValue[]) ?? []).find((x) => norm(x.name) === norm(focus.name));
      const n = v ? numFrom(v.value) : null;
      if (n != null) nums.push(n);
    }
    if (nums.length < 2) return "";
    const min = Math.min(...nums), max = Math.max(...nums), span = max - min || 1;
    const W = 150, H = 56, pad = 4;
    return nums
      .map((n, i) => {
        const x = pad + (i / (nums.length - 1)) * (W - 2 * pad);
        const y = H - 8 - ((n - min) / span) * (H - 16);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  })();
  const sparkLast = sparkPoints ? sparkPoints.split(" ").slice(-1)[0].split(",") : null;

  const insightLead = focus ? `Your ${focus.name.toLowerCase()} is ${trendUp == null ? "tracked" : trendUp ? "climbing" : "easing"}.` : "";

  const coachQs = [
    focus ? `Why is my ${focus.name.toLowerCase()} moving so slowly?` : "How am I doing this week?",
    "What should I eat this week?",
    "Am I actually improving?",
  ];

  const doneCount = completed.length;
  const Skel = ({ w }: { w: number }) => <span className="skel" style={{ width: w, height: "1em" }}>&nbsp;</span>;

  return (
    <div className="lr-dash">
      <style dangerouslySetInnerHTML={{ __html: dashCss }} />

      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <linearGradient id="lmAmber" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFC069" />
            <stop offset=".55" stopColor="#F5853F" />
            <stop offset="1" stopColor="#E8743B" />
          </linearGradient>
          <symbol id="lm" viewBox="0 0 120 120">
            <rect x="36" y="24" width="13" height="62" rx="3.5" fill="url(#lmAmber)" />
            <rect x="36" y="73" width="40" height="13" rx="3.5" fill="url(#lmAmber)" />
            <line x1="76" y1="79.5" x2="108" y2="79.5" stroke="url(#lmAmber)" strokeWidth="2.4" strokeLinecap="round" opacity=".38" />
            <g stroke="url(#lmAmber)" strokeWidth="2" strokeLinecap="round" opacity=".4">
              <line x1="84" y1="74.5" x2="84" y2="84.5" />
              <line x1="100" y1="74.5" x2="100" y2="84.5" />
            </g>
            <circle cx="92" cy="79.5" r="11" fill="url(#lmAmber)" opacity=".3" />
            <circle cx="92" cy="79.5" r="7" fill="url(#lmAmber)" />
            <circle cx="92" cy="79.5" r="2.8" fill="#160d04" />
          </symbol>
        </defs>
      </svg>

      {/* MOBILE TOP BAR */}
      <header className="appbar-m">
        <Link className="brand" to="/dashboard">
          <svg className="logo-mark">
            <use href="#lm" />
          </svg>
          <span className="word">labread</span>
        </Link>
        <Link to="/profile" className="av">
          {initials}
        </Link>
      </header>

      <div className="app">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <Link to="/profile" className="s-prof">
            <span className="s-av">{initials}</span>
            <span>
              <span className="s-name">{displayName}</span>
              <br />
              <span className="s-handle">{handle}</span>
            </span>
          </Link>
          <nav className="s-nav">
            <Link className="on" to="/dashboard">
              <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
              Dashboard
            </Link>
            <Link to="/history">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
              History
            </Link>
            <Link to="/protocol">
              <svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h3" /></svg>
              Protocol
            </Link>
            <Link to="/progress">
              <svg viewBox="0 0 24 24"><path d="M3 17l5-5 4 3 7-8" /><path d="M16 7h4v4" /></svg>
              Progress
            </Link>
            <Link to="/checkin">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M8 12l3 3 5-6" /></svg>
              Daily check-in
            </Link>
            <Link to="/chat">
              <svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 01-11.5 7.2L3 21l1.8-6.5A8 8 0 1121 12z" /></svg>
              Coach
            </Link>
          </nav>
          <div className="s-streak">
            <div className="big">
              {loaded ? streak : <Skel w={28} />} <small>day streak</small>
            </div>
            <div className="sub">{dayX ? `DAY ${dayX} OF 90 · PROTOCOL` : "NO ACTIVE PROTOCOL"}</div>
          </div>
          <button className="s-new" onClick={() => setUploadOpen(true)}>
            + <b>New blood test</b>
          </button>
        </aside>

        {/* MAIN */}
        <main className="main">
          <div className="m-head">
            <h1 className="today">Today</h1>
            <span className="daychip">{dayX ? `DAY ${dayX} / 90` : "—"}</span>
          </div>

          {/* Focus marker */}
          <div className="card">
            {!loaded ? (
              <>
                <div className="f-head"><Skel w={140} /></div>
                <Skel w={260} />
              </>
            ) : focus ? (
              <>
                <div className="f-head">
                  <span className="f-name">
                    <span className="pt" style={{ background: dotColor }} />
                    {focus.name}
                  </span>
                  <span className="f-val">
                    {focusNum ?? focus.value} <span style={{ color: "var(--faint)" }}>{focusUnit}</span>
                    {prevNum != null && (
                      <> &nbsp;<span className="up">{trendUp ? "↑" : "↓"} from {prevNum}</span></>
                    )}
                  </span>
                </div>
                <div className="f-row">
                  <div>
                    {range && nowPct != null ? (
                      <>
                        <div className="bar">
                          <div className="fill" style={{ width: `${nowPct}%` }} />
                          <div className="now" style={{ left: `${nowPct}%` }} />
                        </div>
                        <div className="scale">
                          <span>0</span>
                          <span>{rangeKind} {range.min}–{range.max}</span>
                          <span>{scaleMax}</span>
                        </div>
                      </>
                    ) : (
                      <div className="scale"><span>No reference range available for this marker.</span></div>
                    )}
                  </div>
                  <div className="spark">
                    {sparkPoints && sparkLast ? (
                      <svg viewBox="0 0 150 56" preserveAspectRatio="none">
                        <polyline points={sparkPoints} fill="none" stroke="#6FCF97" strokeWidth="2" />
                        <circle cx={sparkLast[0]} cy={sparkLast[1]} r="3.5" fill="#6FCF97" />
                      </svg>
                    ) : null}
                  </div>
                </div>
                <p className="f-insight">
                  <b>{insightLead}</b> {focus.explanation}
                </p>
              </>
            ) : (
              <p className="f-insight">
                <b>No bloodwork yet.</b>{" "}
                <button className="go" style={{ background: "none", border: "none", color: "var(--amber-lite)", cursor: "pointer", font: "inherit" }} onClick={() => setUploadOpen(true)}>
                  Upload a blood test →
                </button>
              </p>
            )}
          </div>

          {/* Today's habits */}
          <div className="card">
            <div className="h-head">
              <span className="t">Today's habits</span>
              <span className="c">
                <b>{loaded ? doneCount : 0}</b> of {habits.length || 0} done
              </span>
            </div>
            {!loaded ? (
              <div className="h-row"><span className="check" /><span className="h-name"><Skel w={160} /></span></div>
            ) : habits.length ? (
              habits.map((h) => {
                const done = completed.includes(h.id);
                return (
                  <div key={h.id} className={`h-row${done ? " done" : ""}`} onClick={() => toggleHabit(h.id)}>
                    <span className={`check${done ? " done" : ""}`}>{CHECK_SVG}</span>
                    <span className="h-name">{h.title}</span>
                    <span className="h-tag">{(h.frequency || h.category || "").replace(/_/g, " ")}</span>
                  </div>
                );
              })
            ) : (
              <div className="h-row" style={{ cursor: "default" }}>
                <span className="h-name" style={{ color: "var(--muted)" }}>
                  No active protocol yet —{" "}
                  <button className="go" style={{ background: "none", border: "none", color: "var(--amber-lite)", cursor: "pointer", font: "inherit" }} onClick={() => setUploadOpen(true)}>
                    upload a blood test
                  </button>{" "}
                  to get your plan.
                </span>
              </div>
            )}
          </div>
        </main>

        {/* RAIL */}
        <aside className="rail">
          <div className="ring-card">
            <div className="ttl">Protocol progress</div>
            <svg viewBox="0 0 120 120">
              <defs>
                <linearGradient id="rg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#FFC069" />
                  <stop offset="1" stopColor="#E8743B" />
                </linearGradient>
              </defs>
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="9" />
              <circle cx="60" cy="60" r="50" fill="none" stroke="url(#rg)" strokeWidth="9" strokeLinecap="round" strokeDasharray="314" strokeDashoffset={ringOffset} transform="rotate(-90 60 60)" />
              <text x="60" y="58" textAnchor="middle" className="pc" fontSize="29">{startsAt ? `${progressPct}%` : "—"}</text>
              <text x="60" y="77" textAnchor="middle" fontSize="9" fill="#9E9384" letterSpacing="1">{dayX ? `DAY ${dayX}/90` : ""}</text>
            </svg>
            <div className="lab">{startsAt ? "On track" : "No protocol"}</div>
          </div>
          <div className="mini">
            <div className="t">Markers in range</div>
            <div className="v">
              {loaded ? (markersInRange ?? "—") : <Skel w={40} />}
              <small>%</small>
            </div>
          </div>
          <div className="mini act">
            <div className="t">Next blood test</div>
            <div className="v">
              {loaded ? (nextTestDays ?? "—") : <Skel w={30} />}
              <small>days</small>
            </div>
            <span className="go" onClick={() => setUploadOpen(true)}>Set a reminder →</span>
          </div>
        </aside>

        {/* COACH BAR */}
        <div className="coachbar">
          <span className="c-orb"><i /></span>
          <Link to="/chat" className="c-input">Ask Anna — “{coachQs[coachIdx % coachQs.length]}”</Link>
          <Link to="/chat" className="c-send">
            <svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
          </Link>
        </div>
      </div>

      {/* MOBILE TAB BAR */}
      <nav className="tabbar">
        <Link className="on" to="/dashboard">
          <svg viewBox="0 0 24 24"><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></svg>
          Today
        </Link>
        <Link to="/progress">
          <svg viewBox="0 0 24 24"><path d="M3 17l5-5 4 3 7-8" /><path d="M16 7h4v4" /></svg>
          Progress
        </Link>
        <Link to="/chat">
          <svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 01-11.5 7.2L3 21l1.8-6.5A8 8 0 1121 12z" /></svg>
          Coach
        </Link>
        <Link to="/history">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
          History
        </Link>
      </nav>

      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        userId={user.id}
        onCreated={(id) => {
          setUploadOpen(false);
          nav({ to: "/report/$id", params: { id } });
        }}
      />
    </div>
  );
}
