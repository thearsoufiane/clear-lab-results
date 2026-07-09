import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/get-started")({
  head: () => ({
    meta: [
      { title: "Get started | labread.health" },
      {
        name: "description",
        content:
          "Create your labread account — understand your blood test, track your numbers, and get a personal protocol.",
      },
    ],
    links: [
      { rel: "canonical", href: "https://labread.health/get-started" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
      },
      {
        rel: "icon",
        href:
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23FFC069'/%3E%3Cstop offset='1' stop-color='%23E8743B'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='36' y='24' width='13' height='62' rx='3.5' fill='url(%23g)'/%3E%3Crect x='36' y='73' width='40' height='13' rx='3.5' fill='url(%23g)'/%3E%3Ccircle cx='92' cy='79.5' r='7' fill='url(%23g)'/%3E%3C/svg%3E",
      },
    ],
  }),
  component: GetStartedPage,
});

// Co-located stylesheet, ported verbatim from labread-onboarding.html.
// Only the three global selectors are scoped so they don't leak past this route:
//   *  -> .lr-onb *      (keeps the margin/padding reset off the rest of the app)
//   body -> body:has(.lr-onb)
//   a  -> .lr-onb a
// The :root tokens (--bg, --amber, --serif …) use names that don't collide with
// the app's own design tokens, and the <style> unmounts with the route.
const onbCss = `
  :root{
    --bg:#0B0907;--bg-2:#100D0A;--surface:#15110A;--line:rgba(245,166,35,.14);--line-soft:rgba(245,166,35,.08);
    --cream:#F4ECDF;--muted:#9E9384;--faint:#6F6557;--amber:#F5A623;--amber-lite:#FFC069;--grad:linear-gradient(135deg,#FFC069,#F5853F,#E8743B);
    --green:#6FCF97;--warn:#E3A94A;--red:#E0706A;
    --serif:'Fraunces',Georgia,serif;--sans:'Inter',system-ui,sans-serif;--mono:'JetBrains Mono',monospace;
  }
  .lr-onb,.lr-onb *{box-sizing:border-box;margin:0;padding:0}
  body:has(.lr-onb){background:var(--bg);color:var(--cream);font-family:var(--sans);-webkit-font-smoothing:antialiased;min-height:100vh}
  .lr-onb a{text-decoration:none;color:inherit}

  .onb{display:grid;grid-template-columns:46% 54%;min-height:100vh}

  /* ===== SHOWCASE (left) ===== */
  .showcase{position:relative;overflow:hidden;padding:34px;display:flex;flex-direction:column;border-right:1px solid var(--line-soft);
    background:radial-gradient(120% 90% at 20% 0%,#1a1209,#0B0907 60%)}
  .showcase::before{content:"";position:absolute;inset:-25%;z-index:0;pointer-events:none;
    background:
      radial-gradient(38% 38% at 28% 26%,rgba(245,133,63,.30),transparent 62%),
      radial-gradient(42% 50% at 74% 72%,rgba(232,116,59,.20),transparent 62%),
      radial-gradient(30% 30% at 64% 18%,rgba(111,207,151,.10),transparent 60%);
    filter:blur(34px);animation:aurora 16s ease-in-out infinite alternate}
  @keyframes aurora{0%{transform:translate(0,0) scale(1)}100%{transform:translate(-4%,3%) scale(1.12)}}
  .sc-brand{position:relative;z-index:2;display:flex;align-items:center;gap:11px}
  .sc-brand .logo-mark{width:34px;height:34px;filter:drop-shadow(0 0 11px rgba(245,133,63,.4))}
  .sc-brand .word{font-family:var(--serif);font-size:23px;font-weight:600;letter-spacing:-.01em}

  .stage{position:relative;z-index:2;flex:1;margin:18px 0}
  .float{position:absolute;border:1px solid var(--line);border-radius:16px;background:rgba(16,12,8,.82);
    backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);box-shadow:0 24px 60px rgba(0,0,0,.5);padding:15px 17px;will-change:transform}
  .float.f1{top:6%;left:4%;width:210px;animation:floaty 7s ease-in-out infinite}
  .float.f2{top:33%;right:2%;width:236px;animation:floaty 8.5s ease-in-out infinite .6s}
  .float.f3{bottom:7%;left:8%;width:262px;animation:floaty 9.5s ease-in-out infinite .3s}
  @keyframes floaty{0%,100%{transform:translateY(0)}50%{transform:translateY(-13px)}}

  .fl-h{display:flex;align-items:center;gap:8px;margin-bottom:11px}
  .fl-dot{width:8px;height:8px;border-radius:50%}
  .fl-t{font-family:var(--mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--faint)}
  /* ring card */
  .ringbox{display:flex;align-items:center;gap:13px}
  .ringbox svg{width:62px;height:62px;flex-shrink:0}
  .ringbox .v{font-family:var(--serif);font-size:25px;line-height:1}
  .ringbox .s{font-family:var(--mono);font-size:9.5px;color:var(--green);margin-top:3px}
  /* trend card */
  .fl2-top{display:flex;justify-content:space-between;align-items:baseline}
  .fl2-name{font-family:var(--serif);font-size:17px}
  .fl2-val{font-family:var(--mono);font-size:12px;color:var(--green)}
  .fl2-spark{margin-top:8px}
  .fl2-spark svg{width:100%;height:44px;display:block}
  /* coach card */
  .coachmini{display:flex;gap:10px}
  .cm-orb{width:26px;height:26px;border-radius:50%;flex-shrink:0;background:radial-gradient(circle at 40% 35%,#3a2a12,#0d0a07);border:1px solid var(--line);display:grid;place-items:center}
  .cm-orb i{width:9px;height:9px;border-radius:50%;background:var(--grad);box-shadow:0 0 10px var(--amber)}
  .cm-txt{font-size:12.5px;color:var(--muted);line-height:1.5}
  .cm-txt b{color:var(--cream);font-weight:600}

  svg.wires{position:absolute;inset:0;z-index:1;width:100%;height:100%;pointer-events:none}
  svg.wires path{stroke:rgba(245,166,35,.22);stroke-width:1;fill:none;stroke-dasharray:3 4}

  .trust{position:relative;z-index:2;display:flex;gap:20px;flex-wrap:wrap;align-items:center;font-size:13px;color:var(--muted)}
  .trust span{display:flex;align-items:center;gap:7px}
  .trust svg{width:15px;height:15px;stroke:var(--green);fill:none;stroke-width:2}
  .sc-foot{position:relative;z-index:2;font-family:var(--mono);font-size:11px;color:var(--faint);margin-top:16px}

  /* ===== PANEL (right) ===== */
  .panel{position:relative;display:flex;flex-direction:column;padding:30px 7%}
  .p-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:auto}
  .p-mbrand{display:none;align-items:center;gap:9px}
  .p-mbrand .logo-mark{width:28px;height:28px}
  .p-mbrand .word{font-family:var(--serif);font-size:19px;font-weight:600}
  .prog{display:flex;align-items:center;gap:10px}
  .prog .bar{width:90px;height:4px;border-radius:99px;background:rgba(255,255,255,.08);overflow:hidden}
  .prog .bar i{display:block;height:100%;width:50%;background:var(--grad);border-radius:99px;transition:width .4s}
  .prog .lbl{font-family:var(--mono);font-size:11px;color:var(--faint);letter-spacing:.04em}
  .p-signin{font-size:13.5px;color:var(--muted)} .p-signin a{color:var(--amber-lite)}

  .stepwrap{margin:auto 0;max-width:520px;width:100%}
  .step{display:none}
  .step.active{display:block;animation:rise .45s cubic-bezier(.2,.7,.2,1)}
  @keyframes rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}

  .eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:.26em;text-transform:uppercase;color:var(--amber);display:flex;align-items:center;gap:9px;margin-bottom:16px}
  .eyebrow .gd{width:6px;height:6px;border-radius:50%;background:var(--green);box-shadow:0 0 8px var(--green)}
  h1.t{font-family:var(--serif);font-weight:500;font-size:clamp(30px,3.6vw,42px);line-height:1.04;letter-spacing:-.01em}
  h1.t .i{font-style:italic;color:var(--amber-lite)}
  .sub{color:var(--muted);font-size:16px;margin-top:11px;line-height:1.5}

  /* segment cards */
  .segs{display:flex;flex-direction:column;gap:12px;margin:26px 0}
  .seg{position:relative;display:flex;align-items:center;gap:16px;border:1px solid var(--line-soft);border-radius:16px;padding:17px 18px;cursor:pointer;
    background:rgba(0,0,0,.2);transition:.18s}
  .seg:hover{border-color:rgba(245,166,35,.32);transform:translateY(-1px)}
  .seg.sel{border-color:var(--amber);background:rgba(245,133,63,.07);box-shadow:0 0 0 1px var(--amber) inset,0 14px 40px rgba(245,133,63,.12)}
  .seg-ic{width:46px;height:46px;border-radius:12px;flex-shrink:0;display:grid;place-items:center;background:rgba(245,133,63,.1);border:1px solid var(--line)}
  .seg-ic svg{width:23px;height:23px;stroke:var(--amber-lite);fill:none;stroke-width:1.8}
  .seg-tt{font-family:var(--serif);font-size:19px;line-height:1.1}
  .seg-ds{color:var(--muted);font-size:13.5px;margin-top:3px;line-height:1.45}
  .seg-chk{position:absolute;top:14px;right:14px;width:22px;height:22px;border-radius:50%;border:1.5px solid var(--line);display:grid;place-items:center;transition:.18s}
  .seg.sel .seg-chk{background:var(--grad);border-color:transparent}
  .seg-chk svg{width:12px;height:12px;stroke:#1a0f02;stroke-width:3;fill:none;opacity:0}
  .seg.sel .seg-chk svg{opacity:1}

  /* form */
  .field{margin-bottom:15px}
  .field label{display:block;font-family:var(--mono);font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--faint);margin-bottom:7px}
  .field input{width:100%;background:rgba(0,0,0,.28);border:1px solid var(--line-soft);border-radius:12px;padding:14px 15px;color:var(--cream);font-size:15px;font-family:var(--sans);transition:.16s}
  .field input::placeholder{color:var(--faint)}
  .field input:focus{outline:none;border-color:var(--amber);box-shadow:0 0 0 3px rgba(245,133,63,.16)}
  .field.err input{border-color:var(--red);box-shadow:0 0 0 3px rgba(224,112,106,.14)}
  .field .msg{color:var(--red);font-size:12px;margin-top:6px;display:none}
  .field.err .msg{display:block}

  .gbtn{width:100%;display:flex;align-items:center;justify-content:center;gap:10px;border:1px solid var(--line);border-radius:12px;padding:13px;background:rgba(255,255,255,.02);color:var(--cream);font-size:14.5px;font-weight:500;cursor:pointer;transition:.15s}
  .gbtn:hover{background:rgba(255,255,255,.05)}
  .gbtn:disabled{opacity:.5;cursor:not-allowed}
  .gbtn svg{width:18px;height:18px}
  .or{display:flex;align-items:center;gap:14px;color:var(--faint);font-size:12px;font-family:var(--mono);margin:18px 0}
  .or::before,.or::after{content:"";flex:1;height:1px;background:var(--line-soft)}

  .cta{width:100%;border:none;border-radius:999px;padding:16px;background:var(--grad);color:#1a0f02;font-size:16px;font-weight:600;cursor:pointer;
    box-shadow:0 14px 40px rgba(245,133,63,.3);transition:.16s;display:flex;align-items:center;justify-content:center;gap:9px}
  .cta:hover{filter:brightness(1.05);transform:translateY(-1px)}
  .cta:disabled{opacity:.4;cursor:not-allowed;box-shadow:none;transform:none;filter:none}
  .row-nav{display:flex;align-items:center;gap:14px;margin-top:22px}
  .back{display:flex;align-items:center;gap:7px;color:var(--muted);font-size:14px;cursor:pointer;flex-shrink:0}
  .back svg{width:17px;height:17px;stroke:currentColor;fill:none;stroke-width:2}
  .autherr{color:var(--red);font-size:13px;margin-top:12px;line-height:1.5}
  .fine{color:var(--faint);font-size:12px;margin-top:16px;line-height:1.55}
  .fine a{color:var(--muted);text-decoration:underline}
  .skip{display:block;text-align:center;margin-top:18px;color:var(--faint);font-size:13px}
  .skip a{color:var(--muted)}

  /* success */
  .suc-ic{width:64px;height:64px;border-radius:50%;background:var(--grad);display:grid;place-items:center;margin-bottom:22px;box-shadow:0 0 50px rgba(245,133,63,.4)}
  .suc-ic svg{width:30px;height:30px;stroke:#1a0f02;stroke-width:2.6;fill:none}
  .suc-card{border:1px solid var(--line);border-radius:14px;padding:16px 18px;background:rgba(245,133,63,.05);margin:22px 0;font-size:14.5px;color:var(--muted)}
  .suc-card b{color:var(--cream)}

  @media(max-width:880px){
    .onb{grid-template-columns:1fr}
    .showcase{display:none}
    .panel{padding:22px 22px 34px}
    .p-mbrand{display:flex}
    .stepwrap{margin:26px 0}
    .trust-m{display:flex;gap:16px;flex-wrap:wrap;font-size:12.5px;color:var(--muted);margin-top:26px}
    .trust-m span{display:flex;align-items:center;gap:6px}
    .trust-m svg{width:14px;height:14px;stroke:var(--green);fill:none;stroke-width:2}
  }
  @media(min-width:881px){.trust-m{display:none}}
  @media(prefers-reduced-motion:reduce){.showcase::before,.float{animation:none}.step.active{animation:none}}
`;

type Segment = "me" | "doctor" | "clinic";
const PLAN_VALUE: Record<Segment, string> = { me: "personal", doctor: "professional", clinic: "clinic" };
const PLAN_LABEL: Record<Segment, string> = { me: "Personal", doctor: "Professional", clinic: "Clinic / Lab" };
const PENDING_PLAN_KEY = "lr_pending_plan";

function GetStartedPage() {
  const { user, loading: authLoading } = useAuth();
  const nav = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [chosen, setChosen] = useState<Segment | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errs, setErrs] = useState<{ name?: boolean; email?: boolean; pass?: boolean }>({});
  const [authErr, setAuthErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [success, setSuccess] = useState<{ first: string; plan: string; email: string } | null>(null);

  const showcaseRef = useRef<HTMLElement>(null);
  const finalizingRef = useRef(false);

  // Finalize a Google OAuth round-trip: the redirect comes back here with a session
  // and a pending plan (?plan= or localStorage), which we write to the profile row
  // (the signup trigger created the row but couldn't know the plan for OAuth users).
  useEffect(() => {
    if (authLoading || !user || finalizingRef.current) return;
    const params = new URLSearchParams(window.location.search);
    let pendingPlan = params.get("plan");
    try {
      if (!pendingPlan) pendingPlan = localStorage.getItem(PENDING_PLAN_KEY);
    } catch {
      /* ignore */
    }
    if (!pendingPlan) return; // plain email signups navigate themselves; don't redirect here
    finalizingRef.current = true;
    (async () => {
      const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
      try {
        await supabase.from("profiles").upsert(
          {
            id: user.id,
            plan: pendingPlan,
            full_name: (meta.full_name as string) || (meta.name as string) || null,
            email: user.email ?? null,
          },
          { onConflict: "id" },
        );
      } catch {
        /* the row already exists from the trigger; a failed plan write is non-fatal */
      }
      try {
        localStorage.removeItem(PENDING_PLAN_KEY);
      } catch {
        /* ignore */
      }
      nav({ to: "/onboarding" }); // new signups start the first-run flow
    })();
  }, [user, authLoading, nav]);

  // Showcase parallax — desktop + motion-allowed only, with cleanup.
  useEffect(() => {
    const sc = showcaseRef.current;
    if (!sc) return;
    if (!window.matchMedia("(min-width:881px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion:reduce)").matches) return;

    const floats = Array.from(sc.querySelectorAll<HTMLElement>(".float"));
    const onMove = (e: MouseEvent) => {
      const r = sc.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      floats.forEach((f) => {
        const d = parseFloat(f.dataset.depth || "20");
        f.style.transform = `translate(${x * d}px,${y * d}px)`;
      });
    };
    const onLeave = () => floats.forEach((f) => (f.style.transform = ""));
    sc.addEventListener("mousemove", onMove);
    sc.addEventListener("mouseleave", onLeave);
    return () => {
      sc.removeEventListener("mousemove", onMove);
      sc.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const goStep = (s: 1 | 2 | 3) => {
    setStep(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const progWidth = step === 1 ? "50%" : "100%";
  const progLabel = step === 1 ? "Step 1 of 2" : step === 2 ? "Step 2 of 2" : "Done";

  async function submitEmail() {
    const next = {
      name: !name.trim(),
      email: !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email),
      pass: password.length < 8,
    };
    setErrs(next);
    if (next.name || next.email || next.pass) return;
    if (!chosen) return;

    setSubmitting(true);
    setAuthErr(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name.trim(), plan: PLAN_VALUE[chosen] },
          emailRedirectTo: window.location.origin + "/onboarding",
        },
      });
      if (error) throw error;
      // If the project has email confirmation disabled, signUp returns a session
      // immediately → drop the confirmed user straight into the app.
      if (data.session) {
        nav({ to: "/onboarding" });
        return;
      }
      // Otherwise show the "check your email" success state.
      setSuccess({ first: name.trim().split(" ")[0], plan: PLAN_LABEL[chosen], email });
      goStep(3);
    } catch (e: any) {
      setAuthErr(e?.message || String(e));
    } finally {
      setSubmitting(false);
    }
  }

  async function continueWithGoogle() {
    if (!chosen) return;
    const plan = PLAN_VALUE[chosen];
    setAuthErr(null);
    try {
      localStorage.setItem(PENDING_PLAN_KEY, plan);
    } catch {
      /* ignore */
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/get-started?plan=${plan}` },
    });
    if (error) setAuthErr(error.message);
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: onbCss }} />

      {/* logo symbol defs (rendered once) */}
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

      <div className="onb lr-onb">
        {/* ===== SHOWCASE ===== */}
        <section className="showcase" ref={showcaseRef}>
          <Link className="sc-brand" to="/">
            <svg className="logo-mark">
              <use href="#lm" />
            </svg>
            <span className="word">labread</span>
          </Link>

          <div className="stage">
            <svg className="wires" viewBox="0 0 500 600" preserveAspectRatio="none">
              <path d="M120,120 C220,150 230,210 300,250" />
              <path d="M300,330 C220,360 200,420 150,470" />
            </svg>

            <div className="float f1" data-depth="22">
              <div className="fl-h">
                <span className="fl-dot" style={{ background: "var(--green)" }} />
                <span className="fl-t">Markers in range</span>
              </div>
              <div className="ringbox">
                <svg viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="11" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#6FCF97" strokeWidth="11" strokeLinecap="round" strokeDasharray="314" strokeDashoffset="69" transform="rotate(-90 60 60)" />
                </svg>
                <div>
                  <div className="v">78%</div>
                  <div className="s">12 of 15 optimal</div>
                </div>
              </div>
            </div>

            <div className="float f2" data-depth="40">
              <div className="fl2-top">
                <span className="fl2-name">Ferritin</span>
                <span className="fl2-val">31 ng/mL ↑</span>
              </div>
              <div className="fl2-spark">
                <svg viewBox="0 0 220 44" preserveAspectRatio="none">
                  <polyline points="4,38 44,35 84,28 124,20 164,13 214,7" fill="none" stroke="#6FCF97" strokeWidth="2" />
                  <circle cx="214" cy="7" r="3.5" fill="#6FCF97" />
                </svg>
              </div>
              <div className="fl2-val" style={{ color: "var(--faint)", fontSize: "10.5px", marginTop: "5px" }}>
                6 weeks · climbing to optimal
              </div>
            </div>

            <div className="float f3" data-depth="30">
              <div className="fl-h">
                <span className="cm-orb">
                  <i />
                </span>
                <span className="fl-t" style={{ color: "var(--amber-lite)" }}>
                  Anna · your coach
                </span>
              </div>
              <div className="cm-txt">
                <b>Your iron is climbing.</b> Keep the iron-rich meals and we should see energy improve before your next test in 21 days.
              </div>
            </div>
          </div>

          <div className="trust">
            <span>
              <svg viewBox="0 0 24 24">
                <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              Never stored
            </span>
            <span>
              <svg viewBox="0 0 24 24">
                <path d="M13 2L3 14h7l-1 8 10-12h-7z" />
              </svg>
              Instant analysis
            </span>
            <span>
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
              </svg>
              50+ biomarkers
            </span>
          </div>
          <div className="sc-foot">© 2026 labread · HIPAA-compliant</div>
        </section>

        {/* ===== PANEL ===== */}
        <section className="panel">
          <div className="p-top">
            <div className="p-mbrand">
              <svg className="logo-mark">
                <use href="#lm" />
              </svg>
              <span className="word">labread</span>
            </div>
            <div className="prog">
              <span className="bar">
                <i style={{ width: progWidth }} />
              </span>
              <span className="lbl">{progLabel}</span>
            </div>
            <div className="p-signin">
              Have an account? <Link to="/auth">Sign in</Link>
            </div>
          </div>

          <div className="stepwrap">
            {/* STEP 1 — segment */}
            <div className={"step" + (step === 1 ? " active" : "")}>
              <div className="eyebrow">
                <span className="gd" />
                Let's get you set up
              </div>
              <h1 className="t">
                How will you use <span className="i">labread?</span>
              </h1>
              <p className="sub">We'll tailor your dashboard, protocols and coach to fit. Takes 20 seconds.</p>

              <div className="segs">
                <SegmentCard
                  selected={chosen === "me"}
                  onClick={() => setChosen("me")}
                  title="For me & my family"
                  desc="Understand your results, track your numbers over time, and follow a simple plan — for you or your loved ones."
                  icon={
                    <>
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
                    </>
                  }
                />
                <SegmentCard
                  selected={chosen === "doctor"}
                  onClick={() => setChosen("doctor")}
                  title="For doctors"
                  desc="AI-powered blood-test interpretation for physicians and family doctors — faster reads, clearer patient explanations."
                  icon={
                    <>
                      <path d="M6 3v6a4 4 0 008 0V3" />
                      <path d="M10 17v2a4 4 0 008 0v-3" />
                      <circle cx="18" cy="13" r="2" />
                    </>
                  }
                />
                <SegmentCard
                  selected={chosen === "clinic"}
                  onClick={() => setChosen("clinic")}
                  title="For clinics & labs"
                  desc="Run analyses for your team and patients at scale, with shared history and white-glove infrastructure."
                  icon={
                    <>
                      <path d="M3 21V7l9-4 9 4v14" />
                      <path d="M9 21v-6h6v6M9 11h.01M15 11h.01" />
                    </>
                  }
                />
              </div>

              <button className="cta" disabled={!chosen} onClick={() => chosen && goStep(2)}>
                Continue <Arrow />
              </button>
            </div>

            {/* STEP 2 — account */}
            <div className={"step" + (step === 2 ? " active" : "")}>
              <div className="back" onClick={() => goStep(1)}>
                <svg viewBox="0 0 24 24">
                  <path d="M15 18l-6-6 6-6" />
                </svg>{" "}
                Back
              </div>
              <div className="eyebrow" style={{ marginTop: "18px" }}>
                <span className="gd" />
                Almost there
              </div>
              <h1 className="t">
                Create your <span className="i">account.</span>
              </h1>
              <p className="sub">Save your results, watch your numbers move, and get your personal protocol.</p>

              <div style={{ margin: "24px 0 0" }}>
                <button className="gbtn" onClick={continueWithGoogle} disabled={submitting}>
                  <svg viewBox="0 0 24 24">
                    <path fill="#FFC069" d="M21.6 12.2c0-.6 0-1.2-.2-1.8H12v3.4h5.4a4.6 4.6 0 01-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.1z" />
                    <path fill="#F5853F" d="M12 22c2.7 0 5-1 6.6-2.7l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.2H3.1v2.6A10 10 0 0012 22z" />
                    <path fill="#E8743B" d="M6.4 13.6a6 6 0 010-3.2V7.8H3.1a10 10 0 000 8.4z" />
                    <path fill="#FFC069" d="M12 6.4c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 003.1 7.8l3.3 2.6C7.2 8 9.4 6.4 12 6.4z" />
                  </svg>
                  Continue with Google
                </button>
                <div className="or">or with email</div>

                <div className={"field" + (errs.name ? " err" : "")}>
                  <label>Full name</label>
                  <input
                    type="text"
                    placeholder="Soufiane A."
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <div className="msg">Please enter your name.</div>
                </div>
                <div className={"field" + (errs.email ? " err" : "")}>
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="you@email.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="msg">Enter a valid email.</div>
                </div>
                <div className={"field" + (errs.pass ? " err" : "")}>
                  <label>Password</label>
                  <input
                    type="password"
                    placeholder="Create a password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="msg">Use at least 8 characters.</div>
                </div>

                <button className="cta" style={{ marginTop: "6px" }} onClick={submitEmail} disabled={submitting}>
                  {submitting ? "Creating…" : "Create my account"} <Arrow />
                </button>
                {authErr && <p className="autherr">{authErr}</p>}
                <p className="fine">
                  By continuing you agree to our{" "}
                  <a href="/terms" target="_blank" rel="noreferrer">
                    Terms
                  </a>{" "}
                  &amp;{" "}
                  <a href="/privacy" target="_blank" rel="noreferrer">
                    Privacy Policy
                  </a>
                  . Your data is encrypted and never sold.
                </p>
              </div>
            </div>

            {/* STEP 3 — success */}
            <div className={"step" + (step === 3 ? " active" : "")}>
              <div className="suc-ic">
                <svg viewBox="0 0 24 24">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h1 className="t">
                You're in, <span className="i">{success ? success.first + "." : "there."}</span>
              </h1>
              <p className="sub">Your workspace is ready. We sent a confirmation link to your email.</p>
              <div className="suc-card">
                Plan: <b>{success?.plan ?? "Personal"}</b> · Confirmation sent to <b>{success?.email ?? "you@email.com"}</b>
              </div>
              <button className="cta" onClick={() => nav({ to: "/onboarding" })}>
                Add your blood test <Arrow />
              </button>
            </div>

            <div className="trust-m">
              <span>
                <svg viewBox="0 0 24 24">
                  <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" />
                </svg>
                Never stored
              </span>
              <span>
                <svg viewBox="0 0 24 24">
                  <path d="M13 2L3 14h7l-1 8 10-12h-7z" />
                </svg>
                Instant
              </span>
              <span>
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" />
                </svg>
                50+ biomarkers
              </span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function SegmentCard({
  selected,
  onClick,
  title,
  desc,
  icon,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <div className={"seg" + (selected ? " sel" : "")} onClick={onClick}>
      <span className="seg-ic">
        <svg viewBox="0 0 24 24">{icon}</svg>
      </span>
      <div>
        <div className="seg-tt">{title}</div>
        <div className="seg-ds">{desc}</div>
      </div>
      <span className="seg-chk">
        <svg viewBox="0 0 24 24">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </span>
    </div>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#1a0f02" strokeWidth="2.4">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
