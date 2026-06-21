import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase, type Report, type Analysis } from "@/lib/supabase";
import { UploadModal } from "@/components/upload-modal";

export const Route = createFileRoute("/clinician")({
  head: () => ({
    meta: [
      { title: "Clinician | labread.health" },
      { name: "description", content: "Patient-centric blood-test interpretation for clinicians." },
      { name: "robots", content: "noindex" },
    ],
    links: [
      { rel: "canonical", href: "https://labread.health/clinician" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  component: Clinician,
});

/* ===== verbatim CSS from labread-doctor-dashboard.html, mount-scoped via <style>.
   Only the global selectors are scoped to .lr-clin (reset / body / a / html-overflow);
   the inner structural classes are kept verbatim and unmount with the route.
   The trailing block (.np-*) is the added "New patient" modal, styled with the same tokens. */
const clinCss = `
  .lr-clin{--bg:#0B0907;--bg-2:#100D0A;--surface:#15110A;--line:rgba(245,166,35,.13);--line-soft:rgba(245,166,35,.07);
    --cream:#F4ECDF;--muted:#9E9384;--faint:#6F6557;--amber:#F5A623;--amber-lite:#FFC069;--grad:linear-gradient(135deg,#FFC069,#F5853F,#E8743B);
    --green:#6FCF97;--warn:#E3A94A;--red:#E0706A;
    --serif:'Fraunces',Georgia,serif;--sans:'Inter',system-ui,sans-serif;--mono:'JetBrains Mono',monospace;
    color:var(--cream);font-family:var(--sans)}
  .lr-clin,.lr-clin *{box-sizing:border-box;margin:0;padding:0}
  body:has(.lr-clin){background:#0B0907;color:#F4ECDF;font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
  .lr-clin a{text-decoration:none;color:inherit}
  @media(min-width:901px){html:has(.lr-clin),body:has(.lr-clin){height:100%;overflow:hidden}}

  .app{display:grid;grid-template-columns:248px minmax(0,1fr) 300px;grid-template-rows:minmax(0,1fr) auto;
    grid-template-areas:"side main rail" "coach coach coach";height:100vh}
  .sidebar{grid-area:side;overflow-y:auto;border-right:1px solid var(--line-soft);padding:24px 16px;display:flex;flex-direction:column;gap:16px;background:linear-gradient(180deg,var(--bg-2),var(--bg))}
  .main{grid-area:main;overflow-y:auto;padding:28px 32px}
  .rail{grid-area:rail;overflow-y:auto;border-left:1px solid var(--line-soft);padding:22px 16px;display:flex;flex-direction:column;gap:14px;background:linear-gradient(180deg,var(--bg-2),var(--bg))}
  .coachbar{grid-area:coach;display:flex;align-items:center;gap:13px;padding:14px 26px;border-top:1px solid var(--line);background:rgba(16,13,10,.9)}

  /* sidebar */
  .s-brand{display:flex;align-items:center;gap:10px;padding:0 6px 4px}
  .s-brand .logo-mark{width:30px;height:30px;filter:drop-shadow(0 0 10px rgba(245,133,63,.4))}
  .s-brand .word{font-family:var(--serif);font-size:20px;font-weight:600}
  .s-prof{display:flex;align-items:center;gap:11px;padding:13px 6px;border-top:1px solid var(--line-soft);border-bottom:1px solid var(--line-soft)}
  .s-av{width:40px;height:40px;border-radius:11px;background:linear-gradient(135deg,#3a6f5a,#264f43);display:grid;place-items:center;font-family:var(--mono);font-weight:600;color:#dff;font-size:13px;flex-shrink:0}
  .s-name{font-size:14px;font-weight:600}.s-role{font-family:var(--mono);font-size:10px;color:var(--faint)}
  .s-nav{display:flex;flex-direction:column;gap:2px}
  .s-nav a{display:flex;align-items:center;gap:11px;font-size:13.5px;color:var(--muted);padding:10px 11px;border-radius:10px;transition:.15s}
  .s-nav a:hover{color:var(--cream);background:rgba(255,255,255,.03)}
  .s-nav a.on{background:rgba(245,133,63,.1);color:var(--cream)}
  .s-nav a svg{width:17px;height:17px;stroke:currentColor;opacity:.75;fill:none;stroke-width:1.9}
  .s-nav a.on svg{stroke:var(--amber);opacity:1}
  .s-stat{margin-top:auto;border:1px solid var(--line);border-radius:13px;padding:13px 14px;background:rgba(245,133,63,.05)}
  .s-stat .big{font-family:var(--serif);font-size:23px;display:flex;align-items:baseline;gap:6px}.s-stat .big small{font-size:11px;color:var(--muted);font-family:var(--sans)}
  .s-stat .sub{font-family:var(--mono);font-size:9.5px;color:var(--faint);margin-top:3px;letter-spacing:.04em}
  .s-new{border:1px dashed var(--line);border-radius:11px;padding:12px;text-align:center;font-size:13px;color:var(--muted);cursor:pointer;transition:.15s;background:none;width:100%;font-family:inherit}
  .s-new:hover{border-color:rgba(245,166,35,.4);color:var(--cream)}.s-new b{color:var(--amber-lite)}

  /* main */
  .crumb{font-family:var(--mono);font-size:11px;color:var(--faint);letter-spacing:.06em;margin-bottom:14px}
  .crumb b{color:var(--amber-lite)}
  .phead{display:flex;align-items:center;gap:16px;border:1px solid var(--line);border-radius:18px;padding:18px 20px;background:rgba(0,0,0,.22);margin-bottom:18px;flex-wrap:wrap}
  .pav{width:54px;height:54px;border-radius:14px;background:var(--grad);display:grid;place-items:center;font-family:var(--mono);font-weight:600;color:#1a0f02;font-size:18px;flex-shrink:0}
  .pname{font-family:var(--serif);font-size:24px;line-height:1}
  .pchips{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
  .chip{font-family:var(--mono);font-size:10.5px;color:var(--muted);border:1px solid var(--line-soft);border-radius:99px;padding:4px 10px}
  .pflag{margin-left:auto;display:flex;flex-direction:column;align-items:flex-end;gap:8px}
  .flagbadge{font-family:var(--mono);font-size:11px;color:var(--red);border:1px solid rgba(224,112,106,.35);background:rgba(224,112,106,.08);border-radius:99px;padding:5px 11px}
  .flagbadge.ok{color:var(--green);border-color:rgba(111,207,151,.35);background:rgba(111,207,151,.08)}
  .newan{border:none;border-radius:99px;padding:10px 16px;background:var(--grad);color:#1a0f02;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap}

  .sec-t{font-family:var(--mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--faint);margin:22px 0 12px}
  .an-row{display:flex;align-items:center;gap:14px;border:1px solid var(--line-soft);border-radius:13px;padding:14px 16px;background:rgba(0,0,0,.2);margin-bottom:9px;cursor:pointer;transition:.15s}
  .an-row:hover{border-color:rgba(245,166,35,.28);transform:translateX(2px)}
  .an-date{font-size:14px;font-weight:600}.an-lab{font-family:var(--mono);font-size:10.5px;color:var(--faint);margin-top:2px;text-transform:uppercase;letter-spacing:.06em}
  .an-meta{margin-left:auto;display:flex;align-items:center;gap:10px}
  .an-params{font-family:var(--mono);font-size:11px;color:var(--muted)}
  .an-abn{font-family:var(--mono);font-size:10.5px;color:var(--red);border:1px solid rgba(224,112,106,.3);border-radius:99px;padding:3px 9px}
  .an-abn.ok{color:var(--green);border-color:rgba(111,207,151,.3)}
  .an-row svg.chev{width:16px;height:16px;stroke:var(--faint);fill:none;stroke-width:2}

  .mk-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .mk{border:1px solid var(--line);border-radius:15px;padding:16px;background:rgba(0,0,0,.22)}
  .mk-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px}
  .mk-name{font-family:var(--serif);font-size:18px}.mk-unit{font-family:var(--mono);font-size:10px;color:var(--faint)}
  .mk-latest{text-align:right}.mk-latest .lbl{font-family:var(--mono);font-size:9px;color:var(--faint);letter-spacing:.1em}
  .mk-latest .val{font-family:var(--serif);font-size:22px}
  .mk-chart{margin:6px 0 12px}.mk-chart svg{width:100%;height:74px;display:block}
  .mk-tbl{width:100%;border-collapse:collapse}
  .mk-tbl td{font-family:var(--mono);font-size:11px;padding:5px 0;border-top:1px solid var(--line-soft);color:var(--muted)}
  .mk-tbl td:last-child{text-align:right;color:var(--cream)}
  .empty{border:1px dashed var(--line);border-radius:14px;padding:26px;text-align:center;color:var(--muted);font-size:14px}
  .empty b{color:var(--amber-lite);cursor:pointer}

  /* rail roster */
  .rail-h{display:flex;align-items:center;justify-content:space-between}
  .rail-h .t{font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--faint)}
  .rail-h .n{font-family:var(--mono);font-size:11px;color:var(--amber)}
  .search{display:flex;align-items:center;gap:9px;border:1px solid var(--line-soft);border-radius:10px;padding:9px 12px;background:rgba(0,0,0,.25)}
  .search svg{width:15px;height:15px;stroke:var(--faint);fill:none;stroke-width:2}
  .search input{background:none;border:none;outline:none;color:var(--cream);font-size:13px;width:100%;font-family:var(--sans)}
  .search input::placeholder{color:var(--faint)}
  .pt{display:flex;align-items:center;gap:11px;padding:11px 10px;border-radius:11px;cursor:pointer;transition:.14s}
  .pt:hover{background:rgba(255,255,255,.03)}
  .pt.on{background:rgba(245,133,63,.1);box-shadow:0 0 0 1px var(--line) inset}
  .pt-av{width:36px;height:36px;border-radius:10px;display:grid;place-items:center;font-family:var(--mono);font-weight:600;font-size:12px;flex-shrink:0;background:rgba(245,133,63,.14);color:var(--amber-lite)}
  .pt.on .pt-av{background:var(--grad);color:#1a0f02}
  .pt-nm{font-size:13.5px;font-weight:500}.pt-meta{font-family:var(--mono);font-size:10px;color:var(--faint)}
  .pt-flag{margin-left:auto;font-family:var(--mono);font-size:10px;color:var(--red)}
  .pt-flag.ok{color:var(--green)}

  /* coach */
  .c-orb{width:32px;height:32px;border-radius:50%;background:radial-gradient(circle at 40% 35%,#3a2a12,#0d0a07);border:1px solid var(--line);display:grid;place-items:center;flex-shrink:0}
  .c-orb i{width:10px;height:10px;border-radius:50%;background:var(--grad);box-shadow:0 0 11px var(--amber);animation:clinorbpulse 2.6s ease-in-out infinite}
  @keyframes clinorbpulse{0%,100%{transform:scale(1);opacity:.9}50%{transform:scale(1.25);opacity:1}}
  .c-input{flex:1;background:rgba(0,0,0,.32);border:1px solid var(--line-soft);border-radius:11px;padding:11px 15px;font-size:13.5px;color:var(--muted);cursor:pointer}
  .c-send{width:36px;height:36px;border-radius:10px;background:var(--grad);display:grid;place-items:center;flex-shrink:0;cursor:pointer}
  .c-send svg{width:15px;height:15px;stroke:#1a0f02;stroke-width:2.5;fill:none}

  /* mobile */
  .appbar-m,.tabbar{display:none}
  @media(max-width:900px){
    html:has(.lr-clin),body:has(.lr-clin){height:auto;overflow:visible}
    .appbar-m{display:flex;position:fixed;top:0;left:0;right:0;height:54px;align-items:center;justify-content:space-between;padding:0 16px;background:rgba(11,9,7,.86);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid var(--line-soft);z-index:40}
    .appbar-m .brand{display:flex;align-items:center;gap:9px}.appbar-m .logo-mark{width:28px;height:28px}.appbar-m .word{font-family:var(--serif);font-size:18px;font-weight:600}
    .appbar-m .av{width:30px;height:30px;border-radius:9px;background:linear-gradient(135deg,#3a6f5a,#264f43);display:grid;place-items:center;font-family:var(--mono);font-size:11px;font-weight:600;color:#dff}
    .app{display:block;height:auto;padding:54px 0 150px}
    .sidebar{display:none}
    .main{overflow:visible;padding:18px 15px 6px}
    .mk-grid{grid-template-columns:1fr}
    .rail{order:-1;overflow:visible;border-left:none;border-bottom:1px solid var(--line-soft);padding:14px 15px;flex-direction:row;gap:10px;overflow-x:auto}
    .rail-h,.search{display:none}
    .pt{flex-direction:column;min-width:84px;text-align:center;gap:6px}.pt-meta,.pt-flag{display:none}
    .coachbar{position:fixed;bottom:62px;left:0;right:0;z-index:39;padding:11px 14px}
    .tabbar{display:grid;grid-template-columns:repeat(4,1fr);position:fixed;bottom:0;left:0;right:0;height:62px;background:rgba(11,9,7,.94);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-top:1px solid var(--line-soft);z-index:40}
    .tabbar a{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;color:var(--faint);font-family:var(--mono);font-size:9px;letter-spacing:.05em;text-transform:uppercase}
    .tabbar a.on{color:var(--amber)}.tabbar svg{width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:1.9}
  }
  @media(prefers-reduced-motion:reduce){.c-orb i{animation:none}}

  /* New-patient modal (added) */
  .np-ov{position:fixed;inset:0;z-index:60;background:rgba(0,0,0,.7);display:grid;place-items:center;padding:20px}
  .np-card{width:100%;max-width:420px;border:1px solid var(--line);border-radius:18px;background:var(--bg-2);padding:22px}
  .np-card h3{font-family:var(--serif);font-weight:500;font-size:22px;margin-bottom:4px}
  .np-card .np-sub{color:var(--muted);font-size:13.5px;margin-bottom:16px}
  .np-f{margin-bottom:11px}
  .np-f label{display:block;font-family:var(--mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--faint);margin-bottom:6px}
  .np-in{width:100%;background:rgba(0,0,0,.3);border:1px solid var(--line-soft);border-radius:10px;padding:11px 13px;color:var(--cream);font-size:14px;font-family:var(--sans)}
  .np-in:focus{outline:none;border-color:var(--amber)}
  .np-row{display:flex;gap:10px}.np-row .np-f{flex:1}
  .np-act{display:flex;gap:10px;margin-top:16px}
  .np-cancel{flex:1;border:1px solid var(--line-soft);background:none;border-radius:99px;padding:12px;color:var(--muted);font-size:14px;cursor:pointer;font-family:inherit}
  .np-save{flex:2;border:none;border-radius:99px;padding:12px;background:var(--grad);color:#1a0f02;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit}
  .np-save:disabled{opacity:.5;cursor:not-allowed}
`;

/* ============================ data helpers ============================ */
function numFrom(value: string): number | null {
  const m = String(value ?? "").match(/-?[\d.]+/);
  return m ? parseFloat(m[0]) : null;
}
function unitFrom(value: string): string {
  const m = String(value ?? "").match(/^\s*-?[\d.]+\s*(.*)$/);
  return m ? m[1].trim() : "";
}
function norm(name: string): string {
  return String(name ?? "").toLowerCase().replace(/\s*\([^)]*\)/g, "").replace(/\s+/g, " ").trim();
}
function initialsOf(name: string, fallback = "·"): string {
  const ii = String(name ?? "").trim().split(/\s+/).slice(0, 2).map((p) => p[0] || "").join("").toUpperCase();
  return ii || fallback;
}
function fmtDate(iso: string, withYear = true): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", ...(withYear ? { year: "numeric" } : {}) });
}
function monthIndex(iso: string): number {
  const d = new Date(iso);
  return d.getFullYear() * 12 + d.getMonth();
}
function abnormalCount(r: Report): number {
  return ((r.analysis?.values as Analysis["values"]) ?? []).filter((v) => v.status !== "normal").length;
}
function paramCount(r: Report): number {
  return ((r.analysis?.values as Analysis["values"]) ?? []).length;
}
function palette(status: string) {
  if (status === "normal") return { zone: "rgba(111,207,151,.10)", line: "#6FCF97", dot: "good" };
  if (status === "low" || status === "deficient") return { zone: "rgba(227,169,74,.10)", line: "#E3A94A", dot: "warn" };
  return { zone: "rgba(224,112,106,.10)", line: "#E0706A", dot: "bad" };
}

type Patient = {
  id: string;
  full_name: string;
  initials: string | null;
  age: number | null;
  sex: string | null;
  weight: string | null;
  height: string | null;
  created_at: string;
};
type MarkerSeriesPoint = { date: string; raw: string; num: number | null };
type MarkerTrend = { name: string; unit: string; latest: string | number; status: string; series: MarkerSeriesPoint[] };

function buildMarkers(arr: Report[]): MarkerTrend[] {
  if (!arr.length) return [];
  const latest = arr[arr.length - 1];
  const vals = ((latest.analysis?.values as Analysis["values"]) ?? []).slice();
  // abnormal markers first, then the rest
  vals.sort((a, b) => (a.status !== "normal" ? 0 : 1) - (b.status !== "normal" ? 0 : 1));
  return vals.slice(0, 6).map((v) => {
    const series: MarkerSeriesPoint[] = [];
    for (const r of arr) {
      const m = ((r.analysis?.values as Analysis["values"]) ?? []).find((x) => norm(x.name) === norm(v.name));
      if (m) series.push({ date: fmtDate(r.created_at, false), raw: m.value, num: numFrom(m.value) });
    }
    return { name: v.name, unit: unitFrom(v.value), latest: numFrom(v.value) ?? v.value, status: v.status, series };
  });
}

function MarkerCard({ m }: { m: MarkerTrend }) {
  const { zone, line } = palette(m.status);
  const nums = m.series.map((s) => s.num).filter((n): n is number => n != null);
  const min = nums.length ? Math.min(...nums) : 0;
  const max = nums.length ? Math.max(...nums) : 1;
  const span = max - min || 1;
  const n = m.series.length;
  const top = 16, bot = 64, W = 258;
  const pts = m.series.map((s, i) => {
    const x = n === 1 ? W / 2 : 6 + (i / (n - 1)) * (W - 12);
    const y = s.num == null ? (top + bot) / 2 : bot - ((s.num - min) / span) * (bot - top);
    return `${x.toFixed(0)},${y.toFixed(0)}`;
  });
  const last = pts.length ? pts[pts.length - 1].split(",") : null;
  const rows = [...m.series].reverse(); // newest first in the table
  return (
    <div className="mk">
      <div className="mk-top">
        <div>
          <div className="mk-name">{m.name}</div>
          <div className="mk-unit">{m.unit}</div>
        </div>
        <div className="mk-latest">
          <div className="lbl">LATEST</div>
          <div className="val" style={{ color: line }}>{m.latest}</div>
        </div>
      </div>
      <div className="mk-chart">
        <svg viewBox="0 0 258 80" preserveAspectRatio="none">
          <rect x="0" y="0" width="258" height="80" fill={zone} />
          {pts.length > 1 && <polyline points={pts.join(" ")} fill="none" stroke={line} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />}
          {last && <circle cx={last[0]} cy={last[1]} r="3.6" fill={line} />}
        </svg>
      </div>
      <table className="mk-tbl">
        <tbody>
          <tr>
            <td>Date</td>
            <td>Value</td>
          </tr>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>{r.date}</td>
              <td>{r.raw}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Clinician() {
  const { user, loading } = useAuth();
  const nav = useNavigate();

  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [allReports, setAllReports] = useState<Report[]>([]); // patient-linked, ascending
  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [npOpen, setNpOpen] = useState(false);

  // auth + role gate
  useEffect(() => {
    if (loading) return;
    if (!user) {
      nav({ to: "/auth" });
      return;
    }
    let cancelled = false;
    (async () => {
      const { data } = await supabase.from("profiles").select("plan").eq("id", user.id).maybeSingle();
      const plan = (data as { plan?: string } | null)?.plan;
      const ok = plan === "professional" || plan === "clinic" || plan === "doctor";
      if (cancelled) return;
      if (!ok) nav({ to: "/dashboard" });
      else setAllowed(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, loading, nav]);

  const loadData = useCallback(async () => {
    if (!user) return;
    const [{ data: pts }, { data: reps }] = await Promise.all([
      supabase.from("patients").select("*").eq("clinician_id", user.id).order("created_at", { ascending: true }),
      supabase.from("reports").select("*").not("patient_id", "is", null).order("created_at", { ascending: true }),
    ]);
    const plist = (pts as Patient[]) ?? [];
    setPatients(plist);
    setAllReports((reps as Report[]) ?? []);
    setActiveId((cur) => cur ?? plist[0]?.id ?? null);
    setLoaded(true);
  }, [user]);

  useEffect(() => {
    if (allowed && user) loadData();
  }, [allowed, user, loadData]);

  const reportsByPatient = useMemo(() => {
    const m = new Map<string, Report[]>();
    for (const r of allReports) {
      const pid = (r as Report & { patient_id?: string }).patient_id;
      if (!pid) continue;
      const a = m.get(pid) ?? [];
      a.push(r);
      m.set(pid, a);
    }
    return m;
  }, [allReports]);

  const rosterMeta = useCallback(
    (pid: string) => {
      const arr = reportsByPatient.get(pid) ?? [];
      const latest = arr.length ? arr[arr.length - 1] : null;
      return {
        count: arr.length,
        flagged: latest ? abnormalCount(latest) : 0,
        last: latest ? fmtDate(latest.created_at) : "—",
      };
    },
    [reportsByPatient],
  );

  // clinician identity from email
  const email = user?.email || "";
  const localPart = email.split("@")[0] || "you";
  const clinName = localPart.replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).trim();
  const clinInitials = initialsOf(clinName, "DR");

  // analyses-this-month stat
  const curMonth = monthIndex(new Date().toISOString());
  const thisMonth = allReports.filter((r) => monthIndex(r.created_at) === curMonth).length;
  const lastMonth = allReports.filter((r) => monthIndex(r.created_at) === curMonth - 1).length;
  const delta = thisMonth - lastMonth;

  if (loading || !user || allowed !== true) return null;

  const filtered = patients.filter((p) => p.full_name.toLowerCase().includes(search.toLowerCase()));
  const active = patients.find((p) => p.id === activeId) ?? null;
  const activeArr = active ? reportsByPatient.get(active.id) ?? [] : [];
  const analysesDesc = [...activeArr].reverse();
  const markers = buildMarkers(activeArr);
  const activeFlagged = activeArr.length ? abnormalCount(activeArr[activeArr.length - 1]) : 0;
  const firstName = active ? active.full_name.split(/\s+/)[0] : "your patient";

  return (
    <div className="lr-clin">
      <style dangerouslySetInnerHTML={{ __html: clinCss }} />

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
            <circle cx="92" cy="79.5" r="7" fill="url(#lmAmber)" />
          </symbol>
        </defs>
      </svg>

      {/* MOBILE TOP BAR */}
      <header className="appbar-m">
        <Link className="brand" to="/clinician">
          <svg className="logo-mark">
            <use href="#lm" />
          </svg>
          <span className="word">labread</span>
        </Link>
        <Link to="/profile" className="av">
          {clinInitials}
        </Link>
      </header>

      <div className="app">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <Link className="s-brand" to="/clinician">
            <svg className="logo-mark">
              <use href="#lm" />
            </svg>
            <span className="word">labread</span>
          </Link>
          <Link to="/profile" className="s-prof">
            <span className="s-av">{clinInitials}</span>
            <span>
              <span className="s-name">{clinName}</span>
              <br />
              <span className="s-role">CLINICIAN</span>
            </span>
          </Link>
          <nav className="s-nav">
            <Link to="/clinician">
              <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
              Dashboard
            </Link>
            <Link className="on" to="/clinician">
              <svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5" /><path d="M3 20c0-3.5 3-5 6-5s6 1.5 6 5" /><circle cx="18" cy="9" r="2.5" /><path d="M16 20c0-2.5 1.5-4 4-4" /></svg>
              My patients
            </Link>
            <Link to="/analyses">
              <svg viewBox="0 0 24 24"><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg>
              Analyses
            </Link>
            <Link to="/protocol">
              <svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h3" /></svg>
              Protocols
            </Link>
            <Link to="/chat">
              <svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 01-11.5 7.2L3 21l1.8-6.5A8 8 0 1121 12z" /></svg>
              Coach
            </Link>
          </nav>
          <div className="s-stat">
            <div className="big">{thisMonth} <small>analyses</small></div>
            <div className="sub">THIS MONTH · {delta >= 0 ? "+" : ""}{delta} VS LAST</div>
          </div>
          <button className="s-new" onClick={() => setNpOpen(true)}>
            + <b>New patient</b>
          </button>
        </aside>

        {/* MAIN */}
        <main className="main">
          <div className="crumb">My patients › <b>{active ? active.full_name : "—"}</b></div>

          {!active ? (
            <div className="empty">
              No patients yet. <b onClick={() => setNpOpen(true)}>Add your first patient →</b>
            </div>
          ) : (
            <>
              <div className="phead">
                <span className="pav">{active.initials || initialsOf(active.full_name)}</span>
                <div>
                  <div className="pname">{active.full_name}</div>
                  <div className="pchips">
                    {active.age != null && <span className="chip">{active.age} yrs</span>}
                    {active.sex && <span className="chip">{active.sex}</span>}
                    {active.weight && <span className="chip">{active.weight}</span>}
                    {active.height && <span className="chip">{active.height}</span>}
                  </div>
                </div>
                <div className="pflag">
                  <span className={`flagbadge${activeFlagged === 0 ? " ok" : ""}`}>
                    {activeFlagged === 0 ? "all normal" : `${activeFlagged} flagged`}
                  </span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Link to="/protocol" className="newan" style={{ background: "rgba(255,255,255,.03)", color: "var(--amber-lite)", border: "1px solid var(--line)" }}>Protocol</Link>
                    <button className="newan" onClick={() => setUploadOpen(true)}>+ New analysis</button>
                  </div>
                </div>
              </div>

              <div className="sec-t">Analyses · {activeArr.length} total</div>
              {analysesDesc.length ? (
                analysesDesc.map((r) => {
                  const ab = abnormalCount(r);
                  const ok = ab === 0;
                  return (
                    <div key={r.id} className="an-row" onClick={() => nav({ to: "/report/$id", params: { id: r.id } })}>
                      <div>
                        <div className="an-date">{fmtDate(r.created_at)}</div>
                        <div className="an-lab">{r.title || "Lab report"}</div>
                      </div>
                      <div className="an-meta">
                        <span className="an-params">{paramCount(r)} params</span>
                        <span className={`an-abn${ok ? " ok" : ""}`}>{ok ? "all normal" : `${ab} abnormal`}</span>
                        <svg className="chev" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" /></svg>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="empty">
                  No analyses yet. <b onClick={() => setUploadOpen(true)}>Upload the first analysis →</b>
                </div>
              )}

              {markers.length > 0 && (
                <>
                  <div className="sec-t">Biomarker trends</div>
                  <div className="mk-grid">
                    {markers.map((m) => (
                      <MarkerCard key={m.name} m={m} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </main>

        {/* RAIL — roster */}
        <aside className="rail">
          <div className="rail-h">
            <span className="t">My patients</span>
            <span className="n">{patients.length}</span>
          </div>
          <div className="search">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>
            <input placeholder="Search patients…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div>
            {loaded && filtered.length === 0 && (
              <div className="empty" style={{ padding: "18px", fontSize: "13px" }}>
                {patients.length === 0 ? "No patients yet." : "No matches."}
              </div>
            )}
            {filtered.map((p) => {
              const meta = rosterMeta(p.id);
              const ok = meta.flagged === 0;
              return (
                <div key={p.id} className={`pt${p.id === activeId ? " on" : ""}`} onClick={() => setActiveId(p.id)}>
                  <span className="pt-av">{p.initials || initialsOf(p.full_name)}</span>
                  <div>
                    <div className="pt-nm">{p.full_name}</div>
                    <div className="pt-meta">
                      {[p.age != null ? `${p.age}` : null, p.sex, meta.last].filter(Boolean).join(" · ")}
                    </div>
                  </div>
                  <span className={`pt-flag${ok ? " ok" : ""}`}>{ok ? "✓" : `${meta.flagged}⚑`}</span>
                </div>
              );
            })}
          </div>
        </aside>

        {/* COACH BAR */}
        <div className="coachbar">
          <span className="c-orb"><i /></span>
          <Link to="/chat" className="c-input">Ask Anna about {firstName}'s results…</Link>
          <Link to="/chat" className="c-send">
            <svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
          </Link>
        </div>
      </div>

      {/* MOBILE TAB BAR */}
      <nav className="tabbar">
        <Link className="on" to="/clinician">
          <svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5" /><path d="M3 20c0-3.5 3-5 6-5s6 1.5 6 5" /></svg>
          Patients
        </Link>
        <Link to="/analyses">
          <svg viewBox="0 0 24 24"><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" /><path d="M14 3v5h5" /></svg>
          Analyses
        </Link>
        <Link to="/protocol">
          <svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6" /></svg>
          Protocols
        </Link>
        <Link to="/chat">
          <svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 01-11.5 7.2L3 21l1.8-6.5A8 8 0 1121 12z" /></svg>
          Coach
        </Link>
      </nav>

      {npOpen && (
        <NewPatientModal
          clinicianId={user.id}
          onClose={() => setNpOpen(false)}
          onCreated={(id) => {
            setNpOpen(false);
            setActiveId(id);
            loadData();
          }}
        />
      )}

      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        userId={user.id}
        patientId={active?.id ?? null}
        onCreated={(id) => {
          setUploadOpen(false);
          nav({ to: "/report/$id", params: { id } });
        }}
      />
    </div>
  );
}

function NewPatientModal({
  clinicianId,
  onClose,
  onCreated,
}: {
  clinicianId: string;
  onClose: () => void;
  onCreated: (id: string) => void;
}) {
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const save = async () => {
    if (!fullName.trim()) {
      setErr("Patient name is required.");
      return;
    }
    setSaving(true);
    setErr(null);
    const { data, error } = await supabase
      .from("patients")
      .insert({
        clinician_id: clinicianId,
        full_name: fullName.trim(),
        initials: initialsOf(fullName),
        age: age ? parseInt(age, 10) : null,
        sex: sex || null,
        weight: weight || null,
        height: height || null,
      })
      .select("id")
      .single();
    setSaving(false);
    if (error) {
      setErr(error.message);
      return;
    }
    onCreated(data.id as string);
  };

  return (
    <div className="np-ov" onClick={onClose}>
      <div className="np-card" onClick={(e) => e.stopPropagation()}>
        <h3>New patient</h3>
        <div className="np-sub">Create a patient record to attach analyses to.</div>
        <div className="np-f">
          <label>Full name</label>
          <input className="np-in" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Yassine M." autoFocus />
        </div>
        <div className="np-row">
          <div className="np-f">
            <label>Age</label>
            <input className="np-in" value={age} onChange={(e) => setAge(e.target.value.replace(/[^\d]/g, ""))} placeholder="34" inputMode="numeric" />
          </div>
          <div className="np-f">
            <label>Sex</label>
            <input className="np-in" value={sex} onChange={(e) => setSex(e.target.value)} placeholder="Male" />
          </div>
        </div>
        <div className="np-row">
          <div className="np-f">
            <label>Weight</label>
            <input className="np-in" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="78 kg" />
          </div>
          <div className="np-f">
            <label>Height</label>
            <input className="np-in" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="182 cm" />
          </div>
        </div>
        {err && <p style={{ color: "var(--red)", fontSize: "13px", marginTop: "8px" }}>{err}</p>}
        <div className="np-act">
          <button className="np-cancel" onClick={onClose}>Cancel</button>
          <button className="np-save" onClick={save} disabled={saving}>{saving ? "Saving…" : "Add patient"}</button>
        </div>
      </div>
    </div>
  );
}
