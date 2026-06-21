import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode, type RefObject } from "react";

/* =====================================================================
   Shared marketing CSS — ported verbatim from the three reference pages
   (design-reference/labread-for-*.html). Only the global selectors are
   scoped to .lr-mkt so the reset/body/background don't leak past the
   marketing routes; the <style> unmounts with the route.
   ===================================================================== */
export const MARKETING_CSS = `
  .lr-mkt{
    --bg:#0B0907; --bg-2:#100D0A; --surface:#171209; --surface-2:#1C160D;
    --line:rgba(245,166,35,.12); --line-soft:rgba(245,166,35,.07);
    --cream:#F4ECDF; --muted:#9E9384; --faint:#6F6557; --surface-3:#231B10; --faintest:#473F35; --ink-line:rgba(244,236,223,.08);
    --amber:#F5A623; --amber-lite:#FFC069; --amber-deep:#E8743B;
    --grad:linear-gradient(135deg,#FFC069 0%,#F5853F 60%,#E8743B 100%);
    --green:#6FCF97; --warn:#E3A94A; --red:#E0706A;
    --serif:'Fraunces',Georgia,serif; --sans:'Inter',system-ui,sans-serif; --mono:'JetBrains Mono',monospace;
    color:var(--cream);font-family:var(--sans);line-height:1.6;
  }
  .lr-mkt,.lr-mkt *{box-sizing:border-box;margin:0;padding:0}
  html:has(.lr-mkt){scroll-behavior:smooth}
  body:has(.lr-mkt){background:#0B0907;color:#F4ECDF;font-family:'Inter',system-ui,sans-serif;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden}
  .lr-mkt a{color:inherit;text-decoration:none}
  .lr-mkt .wrap{max-width:1200px;margin:0 auto;padding:0 28px}
  .lr-mkt .eyebrow{font-family:var(--mono);font-size:12px;letter-spacing:.32em;text-transform:uppercase;color:var(--amber);display:inline-flex;align-items:center;gap:14px}
  .lr-mkt .eyebrow::before{content:"";width:34px;height:1px;background:linear-gradient(90deg,transparent,var(--amber))}
  .lr-mkt h1,.lr-mkt h2,.lr-mkt h3{font-family:var(--serif);font-weight:500;line-height:1.05;letter-spacing:-.01em}
  .lr-mkt .ital{font-style:italic;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent}
  .lr-mkt .btn{display:inline-flex;align-items:center;gap:9px;font-weight:600;font-size:15px;border-radius:999px;padding:14px 26px;cursor:pointer;border:none;transition:.2s;font-family:var(--sans)}
  .lr-mkt .btn-amber{background:var(--grad);color:#1a0f02;box-shadow:0 0 34px rgba(245,133,63,.34)}
  .lr-mkt .btn-amber:hover{box-shadow:0 0 50px rgba(245,133,63,.5);transform:translateY(-1px)}
  .lr-mkt .btn-ghost{border:1px solid var(--line);color:var(--cream);background:rgba(255,255,255,.01)}
  .lr-mkt .btn-ghost:hover{border-color:rgba(245,166,35,.4);background:rgba(245,166,35,.04)}
  .lr-mkt .btn svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2}

  /* TOPBAR + NAV */
  .lr-mkt .topbar{background:linear-gradient(90deg,rgba(232,116,59,.14),rgba(245,166,35,.06));border-bottom:1px solid var(--line-soft);text-align:center;font-size:13.5px;color:var(--cream);padding:9px 16px}
  .lr-mkt .topbar a{color:var(--amber-lite);font-weight:500}
  .lr-mkt .nav{position:sticky;top:0;z-index:50;backdrop-filter:blur(14px);background:rgba(11,9,7,.72);border-bottom:1px solid var(--line-soft)}
  .lr-mkt .nav-in{display:flex;align-items:center;justify-content:space-between;height:70px}
  .lr-mkt .brand{display:flex;align-items:center;gap:13px}
  .lr-mkt .logo-mark{width:44px;height:44px;flex-shrink:0;filter:drop-shadow(0 0 13px rgba(245,133,63,.42))}
  @keyframes lmpulse{0%,100%{opacity:.26;transform:scale(1)}50%{opacity:.5;transform:scale(1.2)}}
  .lr-mkt .lm-glow{transform-box:fill-box;transform-origin:center;animation:lmpulse 2.8s ease-in-out infinite}
  .lr-mkt .word{font-family:var(--serif);font-size:26px;font-weight:600;letter-spacing:-.01em}
  .lr-mkt .nav-links{display:flex;align-items:center;gap:30px}
  .lr-mkt .nav-links a{font-size:14.5px;color:var(--muted);transition:.15s;position:relative}
  .lr-mkt .nav-links a:hover,.lr-mkt .nav-links a.on{color:var(--cream)}
  .lr-mkt .nav-links a.on::after{content:"";position:absolute;left:0;right:0;bottom:-24px;height:2px;background:var(--grad)}
  .lr-mkt .nav-cta{display:flex;align-items:center;gap:18px}
  .lr-mkt .nav-cta .signin{font-size:14.5px;color:var(--muted)}
  .lr-mkt .menu-btn{display:none;background:none;border:none;color:var(--cream);font-size:24px;cursor:pointer}
  .lr-mkt .nav-drawer{display:none;flex-direction:column;gap:2px;padding:10px 24px 18px;background:var(--bg-2);border-top:1px solid var(--line-soft)}
  .lr-mkt .nav-drawer a{color:var(--muted);font-size:16px;padding:12px 4px;border-bottom:1px solid var(--line-soft)}
  .lr-mkt .nav-drawer a.btn{border-bottom:none;margin-top:12px;text-align:center;color:#1a0f02;justify-content:center}
  .lr-mkt .nav.open .nav-drawer{display:flex}

  /* SECTION SHELL + reveal (progressive-enhancement: hidden only when JS ran) */
  .lr-mkt .sec{position:relative;padding:46px 0}
  .lr-mkt .sec-head{text-align:center;max-width:720px;margin:0 auto}
  .lr-mkt .sec-head h2{font-size:clamp(32px,4.4vw,52px);margin-top:16px}
  .lr-mkt .sec-head p{color:var(--muted);font-size:17px;margin-top:16px}
  /* Default = visible (SSR / no-JS / pre-hydration). Only hide once JS is
     active to reveal it. Both hide + reveal live under html.js so the .in
     reveal rule out-specifies the hide rule (the earlier bug: the hide rule
     carried html and out-specified a non-html .in reveal rule). */
  .lr-mkt .rv{opacity:1;transform:none}
  html.js .lr-mkt .rv{opacity:0;transform:translateY(26px);transition:opacity .7s ease,transform .7s cubic-bezier(.22,1,.36,1)}
  html.js .lr-mkt .rv.in{opacity:1;transform:none}
  @media(prefers-reduced-motion:reduce){html.js .lr-mkt .rv{opacity:1;transform:none;transition:none}}

  /* FINAL CTA */
  .lr-mkt .final{position:relative;text-align:center;padding:80px 0;overflow:hidden}
  .lr-mkt .final::before{content:"";position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:760px;height:420px;background:radial-gradient(ellipse at center,rgba(245,133,63,.2),transparent 64%);filter:blur(20px)}
  .lr-mkt .final h2{position:relative;font-size:clamp(36px,5.4vw,62px)}
  .lr-mkt .final p{position:relative;color:var(--muted);font-size:18px;margin:20px auto 0;max-width:520px}
  .lr-mkt .final .hero-cta{position:relative;justify-content:center;margin-top:34px}

  /* FOOTER */
  .lr-mkt footer{border-top:1px solid var(--line-soft);padding:46px 0 36px;background:var(--bg-2)}
  .lr-mkt .foot-in{display:flex;justify-content:space-between;gap:30px;flex-wrap:wrap;align-items:center}
  .lr-mkt .foot-brand{display:flex;align-items:center;gap:12px}
  .lr-mkt .foot-brand .logo-mark{width:40px;height:40px}
  .lr-mkt .foot-brand .word{font-size:23px}
  .lr-mkt .foot-links{display:flex;gap:26px;flex-wrap:wrap}
  .lr-mkt .foot-links a{font-size:14px;color:var(--muted);transition:.15s}
  .lr-mkt .foot-links a:hover{color:var(--cream)}
  .lr-mkt .foot-copy{margin-top:24px;font-family:var(--mono);font-size:11.5px;color:var(--faint)}

  @media(max-width:920px){
    .lr-mkt .nav-links,.lr-mkt .nav-cta{display:none}
    .lr-mkt .menu-btn{display:block}
  }
`;

/* Console hero system — shared by /for-you and /for-doctors (verbatim). */
export const CONSOLE_CSS = `
  .lr-mkt .hero{position:relative;overflow:hidden;padding:54px 0 0}
  .lr-mkt .hero::before,.lr-mkt .hero::after{content:none!important}
  .lr-mkt .hero-bg{position:absolute;inset:0;pointer-events:none;z-index:0}
  .lr-mkt .hero-bg .grid{position:absolute;inset:0;background-image:linear-gradient(rgba(245,166,35,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(245,166,35,.04) 1px,transparent 1px);background-size:46px 46px;mask-image:radial-gradient(ellipse 80% 70% at 65% 38%,#000,transparent 78%);-webkit-mask-image:radial-gradient(ellipse 80% 70% at 65% 38%,#000,transparent 78%)}
  .lr-mkt .hero-bg .mesh{position:absolute;top:-160px;right:-80px;width:840px;height:760px;background:radial-gradient(ellipse at center,rgba(245,133,63,.2),transparent 60%);filter:blur(30px)}
  .lr-mkt .hero-bg .mesh2{position:absolute;bottom:-160px;left:-120px;width:560px;height:520px;background:radial-gradient(ellipse at center,rgba(111,207,151,.08),transparent 64%);filter:blur(26px)}
  .lr-mkt .hero-bg .scan{position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(255,255,255,.012) 0 1px,transparent 1px 4px);mix-blend-mode:overlay;opacity:.5}
  .lr-mkt .hero-grid{position:relative;z-index:2;display:grid;grid-template-columns:1fr 1.06fr;gap:30px;align-items:center;min-height:600px}
  .lr-mkt .h-badges{display:flex;align-items:center;gap:10px;margin-bottom:26px}
  .lr-mkt .h-pill{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--line);background:var(--surface);border-radius:999px;padding:7px 14px;font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--amber)}
  .lr-mkt .h-pill .d{width:6px;height:6px;border-radius:50%;background:var(--green);box-shadow:0 0 9px var(--green)}
  .lr-mkt .h-pill.ghost{color:var(--faint);background:transparent}
  .lr-mkt .hero h1{font-size:clamp(46px,6.6vw,88px);font-weight:500}
  .lr-mkt .hero h1 .ital{font-weight:600}
  .lr-mkt .hero-sub{max-width:480px;margin:26px 0 0;color:var(--muted);font-size:18.5px}
  .lr-mkt .hero-sub b{color:var(--cream);font-weight:600}
  .lr-mkt .hero-cta{display:flex;gap:13px;margin-top:34px;flex-wrap:wrap;align-items:center}
  .lr-mkt .hero-metrics{display:flex;gap:30px;margin-top:38px;flex-wrap:wrap}
  .lr-mkt .hm b{font-family:var(--serif);font-size:30px;font-weight:600;line-height:1;display:block;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent}
  .lr-mkt .hm span{font-family:var(--mono);font-size:10px;color:var(--faint);letter-spacing:.08em;text-transform:uppercase;margin-top:6px;display:block}
  .lr-mkt .btn-line{border:1px solid var(--line);color:var(--cream);background:rgba(255,255,255,.012)}
  .lr-mkt .btn-line:hover{border-color:rgba(245,166,35,.45);background:rgba(245,166,35,.05)}

  .lr-mkt .console{position:relative;height:580px}
  .lr-mkt .console-rings{position:absolute;inset:0;display:grid;place-items:center;pointer-events:none}
  .lr-mkt .console-rings::before,.lr-mkt .console-rings::after{content:"";position:absolute;border:1px solid rgba(245,166,35,.06);border-radius:50%}
  .lr-mkt .console-rings::before{width:560px;height:560px}
  .lr-mkt .console-rings::after{width:720px;height:720px;border-color:rgba(245,166,35,.035)}
  .lr-mkt .gauge-stage{position:absolute;inset:0;display:grid;place-items:center;z-index:2}
  .lr-mkt .gauge{width:460px;height:460px;filter:drop-shadow(0 30px 70px rgba(0,0,0,.5))}
  .lr-mkt .ring-track{fill:none;stroke:rgba(245,166,35,.1);stroke-width:6}
  .lr-mkt .ring-val{fill:none;stroke-width:6;stroke-linecap:round;transform-box:fill-box;transform-origin:center;transform:rotate(-90deg);transition:stroke-dashoffset 1.6s cubic-bezier(.16,1,.3,1)}
  .lr-mkt .gauge .tick{stroke:rgba(245,166,35,.22);stroke-width:1.4}
  .lr-mkt .sweep{transform-box:fill-box;transform-origin:260px 260px;animation:spin 7s linear infinite}
  @keyframes spin{to{transform:rotate(360deg)}}
  .lr-mkt .bm-dot{transition:transform .3s}
  .lr-mkt .bm-dot .core{filter:drop-shadow(0 0 5px currentColor)}
  .lr-mkt .bm-pulse{transform-box:fill-box;transform-origin:center;animation:lmpulse 2.4s ease-in-out infinite}
  .lr-mkt .gauge-center .score{font-family:var(--serif);font-weight:600;fill:var(--cream)}
  .lr-mkt .gauge-center .lab{font-family:var(--mono);fill:var(--muted)}
  @media(prefers-reduced-motion:reduce){.lr-mkt .sweep{animation:none}.lr-mkt .bm-pulse{animation:none}}

  .lr-mkt .gpanel{position:absolute;z-index:4;background:linear-gradient(180deg,rgba(28,22,13,.94),rgba(15,12,8,.96));border:1px solid var(--line);border-radius:15px;box-shadow:0 24px 56px rgba(0,0,0,.55);backdrop-filter:blur(8px);will-change:transform}
  .lr-mkt .gp-anna{top:18px;left:-18px;width:236px;padding:13px 15px}
  .lr-mkt .gp-anna .ah{display:flex;align-items:center;gap:9px;margin-bottom:9px}
  .lr-mkt .orb{width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#1c160d,#0a0806);border:1px solid var(--line);display:grid;place-items:center;position:relative;flex-shrink:0}
  .lr-mkt .orb::before{content:"";position:absolute;inset:0;border-radius:50%;box-shadow:0 0 14px rgba(111,207,151,.45);animation:lmpulse 2.6s ease-in-out infinite}
  .lr-mkt .orb i{width:3.5px;height:3.5px;border-radius:50%;background:var(--green);box-shadow:7px 0 0 var(--amber-lite),-7px 0 0 var(--amber),0 7px 0 var(--green),0 -7px 0 var(--amber-lite);animation:spin 4s linear infinite}
  .lr-mkt .gp-anna .an{font-size:11.5px;font-weight:600}
  .lr-mkt .gp-anna .ar{font-family:var(--mono);font-size:8.5px;color:var(--faint)}
  .lr-mkt .gp-anna p{font-size:12px;color:var(--muted);line-height:1.5}
  .lr-mkt .gp-anna p b{color:var(--amber-lite)}
  .lr-mkt .gp-trend{top:6px;right:-14px;width:212px;padding:13px 15px}
  .lr-mkt .gp-trend .th{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
  .lr-mkt .gp-trend .tn{font-size:12px;font-weight:600}
  .lr-mkt .gp-trend .tv{font-family:var(--mono);font-size:11px;color:var(--green)}
  .lr-mkt .gp-trend svg{width:100%;height:46px;display:block}
  .lr-mkt .gp-range{bottom:30px;right:-6px;width:248px;padding:14px 16px}
  .lr-mkt .gp-range .rh{display:flex;justify-content:space-between;font-family:var(--mono);font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--faint);margin-bottom:10px}
  .lr-mkt .gp-range .rh .ok{color:var(--green)}
  .lr-mkt .gp-range .rn{display:flex;align-items:center;gap:9px;margin-bottom:11px}
  .lr-mkt .gp-range .ric{width:28px;height:28px;border-radius:8px;background:rgba(245,133,63,.12);border:1px solid var(--line);display:grid;place-items:center;font-family:var(--serif);font-size:12px;color:var(--amber-lite);font-weight:600}
  .lr-mkt .gp-range .rnm{font-size:12.5px;font-weight:600}
  .lr-mkt .gp-range .rvl{font-family:var(--mono);font-size:9.5px;color:var(--muted)}
  .lr-mkt .mini-track{display:flex;gap:2.5px;height:8px;border-radius:3px;overflow:hidden;position:relative}
  .lr-mkt .mini-track i{flex:1}.lr-mkt .mini-track i.r{background:rgba(224,112,106,.5)}.lr-mkt .mini-track i.w{background:rgba(227,169,74,.5)}.lr-mkt .mini-track i.g{flex:2.1;background:rgba(111,207,151,.65)}
  .lr-mkt .mini-mark{position:absolute;top:-3px;width:3px;height:14px;border-radius:2px;background:var(--cream);box-shadow:0 0 0 2px rgba(10,8,6,.9),0 0 10px rgba(244,236,223,.7);left:0;transition:left 1.2s cubic-bezier(.16,1,.3,1)}
  .lr-mkt .gp-streak{bottom:64px;left:-26px;width:150px;padding:13px 15px;display:flex;align-items:center;gap:11px}
  .lr-mkt .gp-streak .sr{width:40px;height:40px;flex-shrink:0}
  .lr-mkt .gp-streak .sb{font-family:var(--serif);font-size:21px;font-weight:600;line-height:1}
  .lr-mkt .gp-streak .sl{font-family:var(--mono);font-size:8.5px;color:var(--faint);letter-spacing:.06em;text-transform:uppercase;margin-top:3px}
  .lr-mkt .gwire{position:absolute;inset:0;z-index:1;pointer-events:none;overflow:visible}
  .lr-mkt .gwire path{stroke:rgba(245,166,35,.22);stroke-width:1.2;fill:none;stroke-dasharray:3 5}

  .lr-mkt .ticker{position:relative;z-index:2;margin-top:34px;border-top:1px solid var(--ink-line);border-bottom:1px solid var(--ink-line);overflow:hidden;background:rgba(15,12,8,.4)}
  .lr-mkt .ticker-track{display:flex;gap:0;width:max-content;animation:marquee 34s linear infinite}
  @keyframes marquee{to{transform:translateX(-50%)}}
  .lr-mkt .ticker:hover .ticker-track{animation-play-state:paused}
  .lr-mkt .tk-item{display:flex;align-items:center;gap:12px;padding:15px 26px;border-right:1px solid var(--ink-line);white-space:nowrap}
  .lr-mkt .tk-item .dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
  .lr-mkt .tk-item .dot.g{background:var(--green);box-shadow:0 0 8px var(--green)}.lr-mkt .tk-item .dot.w{background:var(--warn)}.lr-mkt .tk-item .dot.r{background:var(--red)}
  .lr-mkt .tk-item .nm{font-size:13px;color:var(--cream)}
  .lr-mkt .tk-item .vl{font-family:var(--mono);font-size:12px;color:var(--muted)}
  .lr-mkt .tk-item .st{font-family:var(--mono);font-size:9.5px;letter-spacing:.1em;text-transform:uppercase}
  .lr-mkt .tk-item .st.g{color:var(--green)}.lr-mkt .tk-item .st.w{color:var(--warn)}.lr-mkt .tk-item .st.r{color:var(--red)}

  @media(max-width:1040px){
    .lr-mkt .hero-grid{grid-template-columns:1fr;gap:20px}
    .lr-mkt .console{height:520px;margin:0 auto;max-width:520px}
    .lr-mkt .gp-anna{left:0}.lr-mkt .gp-trend{right:0}.lr-mkt .gp-streak{left:0}.lr-mkt .gp-range{right:0}
  }
  @media(max-width:980px){.lr-mkt .console{height:480px}}
  @media(max-width:680px){
    .lr-mkt .console{height:430px}.lr-mkt .gauge{width:330px;height:330px}
    .lr-mkt .gp-anna,.lr-mkt .gp-streak{display:none}.lr-mkt .hero-metrics{gap:18px}
  }
`;

/* SVG defs (gradients + #lm logo). Rendered once per marketing page. */
export function SvgDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <linearGradient id="lmAmber" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFC069" />
          <stop offset=".55" stopColor="#F5853F" />
          <stop offset="1" stopColor="#E8743B" />
        </linearGradient>
        <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFC069" />
          <stop offset="1" stopColor="#E8743B" />
        </linearGradient>
        <linearGradient id="ringG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFC069" />
          <stop offset="1" stopColor="#E8743B" />
        </linearGradient>
        <linearGradient id="tgrad" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#E0706A" />
          <stop offset=".5" stopColor="#F5A623" />
          <stop offset="1" stopColor="#6FCF97" />
        </linearGradient>
        <linearGradient id="sweepG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#F5A623" stopOpacity="0" />
          <stop offset="1" stopColor="#F5A623" stopOpacity=".4" />
        </linearGradient>
        <symbol id="lm" viewBox="0 0 120 120">
          <rect x="36" y="24" width="13" height="62" rx="3.5" fill="url(#lmAmber)" />
          <rect x="36" y="73" width="40" height="13" rx="3.5" fill="url(#lmAmber)" />
          <line x1="76" y1="79.5" x2="108" y2="79.5" stroke="url(#lmAmber)" strokeWidth="2.4" strokeLinecap="round" opacity=".38" />
          <g stroke="url(#lmAmber)" strokeWidth="2" strokeLinecap="round" opacity=".4">
            <line x1="84" y1="74.5" x2="84" y2="84.5" />
            <line x1="100" y1="74.5" x2="100" y2="84.5" />
          </g>
          <circle className="lm-glow" cx="92" cy="79.5" r="11" fill="url(#lmAmber)" opacity=".3" />
          <circle cx="92" cy="79.5" r="7" fill="url(#lmAmber)" />
          <circle cx="92" cy="79.5" r="2.8" fill="#160d04" />
        </symbol>
      </defs>
    </svg>
  );
}

type NavCta = { label: string; href: string };
export function MarketingNav({
  active,
  topbar,
  cta,
}: {
  active: "you" | "doctors" | "labs";
  topbar: ReactNode;
  cta: NavCta;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const ctaInternal = cta.href.startsWith("/");
  return (
    <>
      <div className="topbar">{topbar}</div>
      <nav className={"nav" + (open ? " open" : "")}>
        <div className="wrap nav-in">
          <Link className="brand" to="/">
            <svg className="logo-mark">
              <use href="#lm" />
            </svg>
            <span className="word">labread</span>
          </Link>
          <div className="nav-links">
            <Link to="/for-you" className={active === "you" ? "on" : undefined}>For you</Link>
            <Link to="/for-doctors" className={active === "doctors" ? "on" : undefined}>For doctors</Link>
            <Link to="/for-labs" className={active === "labs" ? "on" : undefined}>For clinics</Link>
            <a href="#learn">Learn</a>
          </div>
          <div className="nav-cta">
            <Link className="signin" to="/get-started">Sign in</Link>
            {ctaInternal ? (
              <Link className="btn btn-amber" to={cta.href}>{cta.label}</Link>
            ) : (
              <a className="btn btn-amber" href={cta.href}>{cta.label}</a>
            )}
          </div>
          <button className="menu-btn" aria-label="Menu" onClick={() => setOpen((o) => !o)}>☰</button>
        </div>
        <div className="nav-drawer">
          <Link to="/for-you" onClick={close}>For you</Link>
          <Link to="/for-doctors" onClick={close}>For doctors</Link>
          <Link to="/for-labs" onClick={close}>For clinics</Link>
          <a href="#learn" onClick={close}>Learn</a>
          <Link to="/get-started" onClick={close}>Sign in</Link>
          {ctaInternal ? (
            <Link className="btn btn-amber" to={cta.href} onClick={close}>{cta.label}</Link>
          ) : (
            <a className="btn btn-amber" href={cta.href} onClick={close}>{cta.label}</a>
          )}
        </div>
      </nav>
    </>
  );
}

export function MarketingFooter({ copy }: { copy: string }) {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-in">
          <Link className="foot-brand" to="/">
            <svg className="logo-mark">
              <use href="#lm" />
            </svg>
            <span className="word">labread</span>
          </Link>
          <div className="foot-links">
            <Link to="/for-you">For you</Link>
            <Link to="/for-doctors">For doctors</Link>
            <Link to="/for-labs">For clinics</Link>
            <a href="#pricing">Pricing</a>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
          </div>
        </div>
        <div className="foot-copy">{copy}</div>
      </div>
    </footer>
  );
}

export type TickerItem = { tone: "g" | "w" | "r"; nm: string; vl: string; st: string };
export function Ticker({ items }: { items: TickerItem[] }) {
  // Rendered twice so the marquee loops seamlessly (no innerHTML doubling).
  const doubled = [...items, ...items];
  return (
    <div className="ticker">
      <div className="ticker-track">
        {doubled.map((it, i) => (
          <div className="tk-item" key={i}>
            <span className={"dot " + it.tone} />
            <span className="nm">{it.nm}</span>
            <span className="vl">{it.vl}</span>
            <span className={"st " + it.tone}>{it.st}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Gauge tick ring — 60 ticks rendered in JSX (present in SSR HTML). */
function GaugeTicks() {
  const cx = 260, cy = 260, r1 = 246, r2 = 236;
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
    const big = i % 5 === 0;
    const x1 = cx + Math.cos(a) * (big ? r1 - 6 : r1);
    const y1 = cy + Math.sin(a) * (big ? r1 - 6 : r1);
    const x2 = cx + Math.cos(a) * r2;
    const y2 = cy + Math.sin(a) * r2;
    return (
      <line
        key={i}
        className="tick"
        x1={x1.toFixed(1)}
        y1={y1.toFixed(1)}
        x2={x2.toFixed(1)}
        y2={y2.toFixed(1)}
        opacity={big ? 0.35 : 0.16}
      />
    );
  });
  return <g className="ticks">{ticks}</g>;
}

export type ConsoleHeroProps = {
  badges: ReactNode;
  h1: ReactNode;
  sub: ReactNode;
  ctas: ReactNode;
  metrics: { count: number; suf: string; label: string }[];
  gaugeCenter: ReactNode; // the three <text> lines
  panels: ReactNode; // the four .gpanel cards
  ticker: TickerItem[];
};

export function ConsoleHero({ badges, h1, sub, ctas, metrics, gaugeCenter, panels, ticker }: ConsoleHeroProps) {
  return (
    <header className="hero">
      <div className="hero-bg">
        <div className="grid" />
        <div className="mesh" />
        <div className="mesh2" />
        <div className="scan" />
      </div>
      <div className="wrap">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="h-badges">{badges}</div>
            <h1>{h1}</h1>
            <p className="hero-sub">{sub}</p>
            <div className="hero-cta">{ctas}</div>
            <div className="hero-metrics">
              {metrics.map((m, i) => (
                <div className="hm" key={i}>
                  <b data-count={m.count} data-suf={m.suf}>{m.count}{m.suf}</b>
                  <span>{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="console">
            <div className="console-rings" />
            <svg className="gwire" viewBox="0 0 560 580" preserveAspectRatio="none">
              <path d="M120 90 C 180 170, 230 200, 280 250" />
              <path d="M470 80 C 410 150, 360 200, 300 250" />
              <path d="M120 470 C 200 420, 250 360, 290 300" />
              <path d="M470 460 C 400 410, 350 350, 300 300" />
            </svg>
            <div className="gauge-stage">
              <svg className="gauge" viewBox="0 0 520 520">
                <GaugeTicks />
                <circle className="ring-track" cx="260" cy="260" r="230" />
                <circle className="ring-val" cx="260" cy="260" r="230" stroke="url(#ringG)" data-pct="82" pathLength="100" strokeDasharray="100" strokeDashoffset="100" style={{ opacity: 0.95 }} />
                <circle className="ring-track" cx="260" cy="260" r="196" />
                <circle className="ring-val" cx="260" cy="260" r="196" stroke="var(--green)" data-pct="76" pathLength="100" strokeDasharray="100" strokeDashoffset="100" style={{ opacity: 0.7 }} />
                <circle className="ring-track" cx="260" cy="260" r="162" />
                <circle className="ring-val" cx="260" cy="260" r="162" stroke="var(--warn)" data-pct="64" pathLength="100" strokeDasharray="100" strokeDashoffset="100" style={{ opacity: 0.65 }} />
                <g className="sweep">
                  <path d="M260 260 L260 30 A230 230 0 0 1 420 110 Z" fill="url(#sweepG)" opacity=".5" />
                </g>
                <g className="bm-dot" style={{ color: "#6FCF97" }}><circle className="bm-pulse" cx="363" cy="82" r="12" fill="#6FCF97" opacity=".18" /><circle className="core" cx="363" cy="82" r="6" fill="#6FCF97" /></g>
                <g className="bm-dot" style={{ color: "#6FCF97" }}><circle className="bm-pulse" cx="103" cy="128" r="12" fill="#6FCF97" opacity=".18" /><circle className="core" cx="103" cy="128" r="6" fill="#6FCF97" /></g>
                <g className="bm-dot" style={{ color: "#E3A94A" }}><circle className="bm-pulse" cx="452" cy="330" r="12" fill="#E3A94A" opacity=".18" /><circle className="core" cx="452" cy="330" r="6" fill="#E3A94A" /></g>
                <g className="bm-dot" style={{ color: "#E0706A" }}><circle className="bm-pulse" cx="92" cy="362" r="12" fill="#E0706A" opacity=".18" /><circle className="core" cx="92" cy="362" r="6" fill="#E0706A" /></g>
                <g className="bm-dot" style={{ color: "#6FCF97" }}><circle className="core" cx="409" cy="190" r="5" fill="#6FCF97" /></g>
                <g className="bm-dot" style={{ color: "#6FCF97" }}><circle className="core" cx="316" cy="415" r="5" fill="#6FCF97" /></g>
                <g className="bm-dot" style={{ color: "#E3A94A" }}><circle className="core" cx="118" cy="240" r="5" fill="#E3A94A" /></g>
                <g className="bm-dot" style={{ color: "#6FCF97" }}><circle className="core" cx="345" cy="345" r="5" fill="#6FCF97" /></g>
                <g className="gauge-center" textAnchor="middle">
                  <circle cx="260" cy="260" r="92" fill="#0E0B08" stroke="rgba(245,166,35,.16)" />
                  <circle cx="260" cy="260" r="92" fill="none" stroke="url(#ringG)" strokeWidth="1.5" opacity=".4" />
                  {gaugeCenter}
                </g>
              </svg>
            </div>
            {panels}
          </div>
        </div>
      </div>
      <Ticker items={ticker} />
    </header>
  );
}

/* Idempotent reveal: flips a .rv section to .in and fires the inner
   animations that used to depend on the observer (ring fills, range markers,
   trend-line draw). No-op if already revealed. */
function revealEl(el: HTMLElement, timers: ReturnType<typeof setTimeout>[]) {
  if (!el || el.classList.contains("in")) return;
  el.classList.add("in");
  el.querySelectorAll<HTMLElement>(".rc-fg[data-pct]").forEach((c) => {
    const len = 113, pct = +(c.getAttribute("data-pct") || "0");
    c.style.strokeDashoffset = String(len - (len * pct) / 100);
  });
  el.querySelectorAll<HTMLElement>(".range-mark[data-left]").forEach((m) => {
    const dt = setTimeout(() => { m.style.left = m.getAttribute("data-left") || ""; }, 120);
    timers.push(dt);
  });
  const tp = el.querySelector(".trend-path, .trend-line");
  if (tp) tp.classList.add("draw");
}

/* All hero/scroll JS from the reference pages, converted to one effect.
   Sets the html.js progressive-enhancement flag client-side (never in SSR),
   runs ONE bulletproof reveal path (threshold 0 + rootMargin + synchronous
   mount sweep + scroll/resize safety net + no-IO fallback), and wires the
   gauge ring fill, counters, and console parallax. */
export function useMarketingEffects(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    // JS is active → engage the .rv hide gate (SSR / no-JS stays visible).
    document.documentElement.classList.add("js");
    const reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    const timers: ReturnType<typeof setTimeout>[] = [];

    /* ---- reveal: single observer + safety net ---- */
    const els = Array.from(root.querySelectorAll<HTMLElement>(".rv"));
    let io: IntersectionObserver | null = null;
    const sweep = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > 0) revealEl(el, timers);
      });
    };
    let onScroll: (() => void) | null = null;
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => revealEl(el, timers)); // no IO → reveal everything
    } else {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              revealEl(e.target as HTMLElement, timers);
              io!.unobserve(e.target);
            }
          });
        },
        { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0 },
      );
      els.forEach((el) => io!.observe(el));
      onScroll = sweep;
      sweep(); // synchronous: reveal anything already in view (no hidden flash)
      requestAnimationFrame(sweep);
      timers.push(setTimeout(sweep, 300));
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
    }

    /* ---- counters ---- */
    const runCount = (el: HTMLElement) => {
      const goal = +(el.getAttribute("data-count") || "0");
      const suf = el.getAttribute("data-suf") || "";
      let n = 0;
      const step = Math.max(1, Math.round(goal / 40));
      const t = setInterval(() => {
        n += step;
        if (n >= goal) { n = goal; clearInterval(t); }
        el.textContent = n + suf;
      }, 26);
      timers.push(t);
    };

    /* ---- gauge ring fill + mini-mark + hero counters, on load ---- */
    const load = setTimeout(() => {
      root.querySelectorAll<HTMLElement>(".gauge .ring-val[data-pct]").forEach((c) => {
        c.style.strokeDashoffset = String(100 - +(c.getAttribute("data-pct") || "0"));
      });
      const mm = root.querySelector<HTMLElement>(".gp-range .mini-mark[data-left]");
      if (mm) mm.style.left = mm.getAttribute("data-left") || "0";
      root.querySelectorAll<HTMLElement>(".hero-metrics [data-count]").forEach(runCount);
    }, 420);
    timers.push(load);

    /* ---- console cursor parallax (desktop, motion-allowed) ---- */
    const cons = root.querySelector<HTMLElement>(".console");
    let onMove: ((e: MouseEvent) => void) | null = null;
    let onLeave: (() => void) | null = null;
    if (cons && !reduce && !window.matchMedia("(max-width:1040px)").matches) {
      onMove = (e) => {
        const r = cons.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        cons.querySelectorAll<HTMLElement>("[data-float]").forEach((el) => {
          const f = parseFloat(el.getAttribute("data-float") || "1");
          el.style.transform = `translate(${x * f * 16}px,${y * f * 16}px)`;
        });
      };
      onLeave = () => {
        cons.querySelectorAll<HTMLElement>("[data-float]").forEach((el) => { el.style.transform = ""; });
      };
      cons.addEventListener("mousemove", onMove);
      cons.addEventListener("mouseleave", onLeave);
    }

    return () => {
      if (io) io.disconnect();
      timers.forEach((t) => { clearTimeout(t); clearInterval(t as unknown as ReturnType<typeof setInterval>); });
      if (onScroll) {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
      if (cons && onMove) cons.removeEventListener("mousemove", onMove);
      if (cons && onLeave) cons.removeEventListener("mouseleave", onLeave);
    };
  }, [rootRef]);
}
