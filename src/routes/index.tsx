import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "labread.health — Your blood test, finally explained" },
      {
        name: "description",
        content:
          "Paste your blood test numbers. We tell you what's normal, what's not, and what to ask your doctor. Plain English. In a minute.",
      },
      { property: "og:title", content: "labread.health — Your blood test, finally explained." },
      {
        property: "og:description",
        content:
          "Upload your blood test. Get a 90-day plan to improve your results. Daily habits, AI coaching, progress tracking.",
      },
    ],
    links: [
      { rel: "canonical", href: "https://labread.health" },
      {
        rel: "icon",
        href: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23FFC069'/%3E%3Cstop offset='1' stop-color='%23E8743B'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='36' y='24' width='13' height='62' rx='3.5' fill='url(%23g)'/%3E%3Crect x='36' y='73' width='40' height='13' rx='3.5' fill='url(%23g)'/%3E%3Ccircle cx='92' cy='79.5' r='7' fill='url(%23g)'/%3E%3C/svg%3E",
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  component: HomePage,
});

const html = `<style>
  :root{
    --bg:#0B0907; --bg-2:#100D0A; --surface:#171209; --surface-2:#1C160D;
    --line:rgba(245,166,35,.12); --line-soft:rgba(245,166,35,.07);
    --cream:#F4ECDF; --muted:#9E9384; --faint:#6F6557;
    --amber:#F5A623; --amber-lite:#FFC069; --amber-deep:#E8743B;
    --grad:linear-gradient(135deg,#FFC069 0%,#F5853F 60%,#E8743B 100%);
    --green:#6FCF97; --warn:#E3A94A; --red:#E0706A;
    --serif:'Fraunces',Georgia,serif; --sans:'Inter',system-ui,sans-serif; --mono:'JetBrains Mono',monospace;
  }
  *{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{background:var(--bg);color:var(--cream);font-family:var(--sans);line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden}
  a{color:inherit;text-decoration:none}
  .wrap{max-width:1200px;margin:0 auto;padding:0 28px}
  .eyebrow{font-family:var(--mono);font-size:12px;letter-spacing:.32em;text-transform:uppercase;color:var(--amber);display:inline-flex;align-items:center;gap:14px}
  .eyebrow::before,.eyebrow::after{content:"";width:34px;height:1px;background:linear-gradient(90deg,transparent,var(--amber),transparent)}
  .eyebrow.solo::before{display:none}
  h1,h2,h3{font-family:var(--serif);font-weight:500;line-height:1.04;letter-spacing:-.01em}
  .ital{font-style:italic;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent}
  .btn{display:inline-flex;align-items:center;gap:9px;font-weight:600;font-size:15px;border-radius:999px;padding:14px 26px;cursor:pointer;border:none;transition:.2s}
  .btn-amber{background:var(--grad);color:#1a0f02;box-shadow:0 0 34px rgba(245,133,63,.34)}
  .btn-amber:hover{box-shadow:0 0 50px rgba(245,133,63,.5);transform:translateY(-1px)}
  .btn-ghost{border:1px solid var(--line);color:var(--cream);background:rgba(255,255,255,.01)}
  .btn-ghost:hover{border-color:rgba(245,166,35,.4);background:rgba(245,166,35,.04)}

  /* ANNOUNCEMENT */
  .topbar{background:linear-gradient(90deg,rgba(232,116,59,.14),rgba(245,166,35,.06));border-bottom:1px solid var(--line-soft);text-align:center;font-size:13.5px;color:var(--cream);padding:9px 16px;letter-spacing:.01em}
  .topbar a{color:var(--amber-lite);font-weight:500}

  /* NAV */
  .nav{position:sticky;top:0;z-index:50;backdrop-filter:blur(14px);background:rgba(11,9,7,.72);border-bottom:1px solid var(--line-soft)}
  .nav-in{display:flex;align-items:center;justify-content:space-between;height:70px}
  .brand{display:flex;align-items:center;gap:13px}
  .logo-mark{width:44px;height:44px;flex-shrink:0;filter:drop-shadow(0 0 13px rgba(245,133,63,.42))}
  @keyframes lmpulse{0%,100%{opacity:.26;transform:scale(1)}50%{opacity:.5;transform:scale(1.2)}}
  .lm-glow{transform-box:fill-box;transform-origin:center;animation:lmpulse 2.8s ease-in-out infinite}
  @media(prefers-reduced-motion:reduce){.lm-glow{animation:none}}
  .mark{width:30px;height:30px;border-radius:50%;background:var(--grad);display:grid;place-items:center;font-family:var(--serif);font-weight:600;color:#1a0f02;font-size:17px;box-shadow:0 0 22px rgba(245,133,63,.55)}
  .word{font-family:var(--serif);font-size:26px;font-weight:600;letter-spacing:-.01em}
  .word span{color:var(--faint);font-weight:400}
  .nav-links{display:flex;align-items:center;gap:30px}
  .nav-links a{font-size:14.5px;color:var(--muted);transition:.15s}
  .nav-links a:hover{color:var(--cream)}
  .nav-cta{display:flex;align-items:center;gap:18px}
  .nav-cta .signin{font-size:14.5px;color:var(--muted)}
  .menu-btn{display:none;background:none;border:none;color:var(--cream);font-size:24px;cursor:pointer}

  /* HERO */
  .hero{position:relative;text-align:center;padding:84px 0 60px;overflow:hidden}
  .hero::before{content:"";position:absolute;top:-180px;left:50%;transform:translateX(-50%);width:900px;height:560px;background:radial-gradient(ellipse at center,rgba(245,133,63,.20),transparent 65%);filter:blur(20px);pointer-events:none}
  .hero-badge{display:inline-flex;align-items:center;gap:9px;border:1px solid var(--line);background:var(--surface);border-radius:999px;padding:7px 16px;font-family:var(--mono);font-size:11.5px;letter-spacing:.22em;text-transform:uppercase;color:var(--amber);margin-bottom:30px}
  .hero-badge .dot{width:6px;height:6px;border-radius:50%;background:var(--green);box-shadow:0 0 10px var(--green)}
  .hero h1{font-size:clamp(46px,7.4vw,90px);position:relative}
  .hero-sub{max-width:600px;margin:26px auto 0;color:var(--muted);font-size:19px}
  .hero-sub b{color:var(--cream);font-weight:600}
  .hero-cta{display:flex;gap:14px;justify-content:center;margin-top:36px;flex-wrap:wrap}
  .hero-note{margin-top:26px;font-size:13.5px;color:var(--faint);display:inline-flex;align-items:center;gap:8px}
  .hero-note svg{width:15px;height:15px;stroke:var(--green)}

  /* BIOMARKER CARD (signature) */
  .card-stage{position:relative;max-width:680px;margin:54px auto 0}
  .bm-card{position:relative;background:linear-gradient(180deg,rgba(28,22,13,.9),rgba(17,14,10,.94));border:1px solid var(--line);border-radius:22px;padding:26px 26px 24px;box-shadow:0 40px 90px rgba(0,0,0,.55);text-align:left}
  .bm-head{display:flex;justify-content:space-between;align-items:center;font-family:var(--mono);font-size:11.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--faint);margin-bottom:18px}
  .bm-ready{color:var(--green);display:inline-flex;align-items:center;gap:7px}
  .bm-ready .dot{width:6px;height:6px;border-radius:50%;background:var(--green);box-shadow:0 0 8px var(--green)}
  .bm-row{display:flex;align-items:center;justify-content:space-between;padding:13px 0;border-top:1px solid var(--line-soft)}
  .bm-row:first-of-type{border-top:none}
  .bm-name{display:flex;align-items:center;gap:11px;font-size:16px}
  .bm-name .pt{width:7px;height:7px;border-radius:50%}
  .bm-val{font-family:var(--mono);font-size:15px;color:var(--cream)}
  .bm-val span{color:var(--faint);font-size:12px}
  .pill{font-family:var(--mono);font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;padding:5px 11px;border-radius:999px;border:1px solid}
  .pill.low{color:var(--warn);border-color:rgba(227,169,74,.35);background:rgba(227,169,74,.08)}
  .pill.norm{color:var(--green);border-color:rgba(111,207,151,.32);background:rgba(111,207,151,.08)}
  .pill.high{color:var(--red);border-color:rgba(224,112,106,.35);background:rgba(224,112,106,.08)}
  .insight{margin-top:18px;border:1px solid rgba(245,133,63,.22);background:rgba(245,133,63,.06);border-radius:14px;padding:16px 18px}
  .insight .lab{font-family:var(--mono);font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--amber);margin-bottom:7px}
  .insight p{font-size:14.5px;color:var(--cream);line-height:1.55}
  .insight b{color:var(--amber-lite);font-weight:600}
  .float-chip{position:absolute;top:-18px;left:24px;background:var(--surface-2);border:1px solid var(--line);border-radius:999px;padding:8px 15px;font-family:var(--mono);font-size:12.5px;display:flex;align-items:center;gap:8px;box-shadow:0 14px 30px rgba(0,0,0,.5)}
  .float-chip .dot{width:6px;height:6px;border-radius:50%;background:var(--green)}

  /* DASHBOARD (hero signature) */
  .dash-stage{position:relative;max-width:1140px;margin:58px auto 0}
  .dash-stage::before{content:"";position:absolute;inset:-44px -24px;background:radial-gradient(ellipse at 50% 0%,rgba(245,133,63,.20),transparent 62%);filter:blur(14px);z-index:-1}
  .dash{display:grid;grid-template-columns:238px 1fr 248px;grid-template-areas:"side main rail" "coach coach coach";gap:1px;background:var(--line-soft);border:1px solid var(--line);border-radius:22px;overflow:hidden;box-shadow:0 50px 120px rgba(0,0,0,.62);text-align:left}
  .dash>div{background:linear-gradient(180deg,#15110A,#0F0C08)}
  /* sidebar */
  .d-side{grid-area:side;padding:20px 16px;display:flex;flex-direction:column;gap:16px}
  .d-prof{display:flex;align-items:center;gap:11px;padding-bottom:16px;border-bottom:1px solid var(--line-soft)}
  .d-av{width:38px;height:38px;border-radius:50%;background:var(--grad);display:grid;place-items:center;font-family:var(--mono);font-weight:600;color:#1a0f02;font-size:13px;flex-shrink:0}
  .d-name{font-size:14px;font-weight:600}
  .d-handle{font-family:var(--mono);font-size:10.5px;color:var(--faint)}
  .d-nav{display:flex;flex-direction:column;gap:2px}
  .d-nav a{display:flex;align-items:center;gap:11px;font-size:13.5px;color:var(--muted);padding:9px 11px;border-radius:9px;transition:.15s}
  .d-nav a:hover{color:var(--cream);background:rgba(255,255,255,.03)}
  .d-nav a.on{background:rgba(245,133,63,.1);color:var(--cream)}
  .d-nav a svg{width:16px;height:16px;stroke:currentColor;opacity:.75;fill:none;stroke-width:1.9}
  .d-nav a.on svg{stroke:var(--amber);opacity:1}
  .d-streak{margin-top:auto;border:1px solid var(--line);border-radius:13px;padding:13px;background:rgba(245,133,63,.05)}
  .d-streak .big{font-family:var(--serif);font-size:24px;display:flex;align-items:baseline;gap:7px}
  .d-streak .big small{font-size:12px;color:var(--muted);font-family:var(--sans)}
  .d-streak .sub{font-family:var(--mono);font-size:10px;color:var(--faint);margin-top:3px;letter-spacing:.04em}
  .d-up{border:1px dashed var(--line);border-radius:11px;padding:12px;text-align:center;font-size:12.5px;color:var(--muted);cursor:pointer;transition:.15s}
  .d-up:hover{border-color:rgba(245,166,35,.4);color:var(--cream)}
  .d-up b{color:var(--amber-lite);font-weight:600}
  /* main */
  .d-main{grid-area:main;padding:22px 24px;display:flex;flex-direction:column;gap:16px}
  .d-mhead{display:flex;justify-content:space-between;align-items:center}
  .d-mhead h4{font-family:var(--serif);font-size:21px;font-weight:500}
  .d-mhead .day{font-family:var(--mono);font-size:11px;color:var(--amber);letter-spacing:.08em}
  .d-focus{border:1px solid var(--line);border-radius:15px;padding:17px 18px;background:rgba(0,0,0,.22)}
  .d-fhead{display:flex;justify-content:space-between;align-items:center;margin-bottom:13px}
  .d-fname{display:flex;align-items:center;gap:9px;font-family:var(--serif);font-size:18px}
  .d-fname .pt{width:8px;height:8px;border-radius:50%;background:var(--green)}
  .d-fval{font-family:var(--mono);font-size:13.5px;color:var(--cream)}
  .d-fval .up{color:var(--green)}
  .d-frow{display:grid;grid-template-columns:1fr 128px;gap:18px;align-items:center}
  .d-bar{height:6px;border-radius:99px;background:rgba(255,255,255,.07);position:relative;margin:2px 0 7px}
  .d-bar .fill{position:absolute;left:0;top:0;bottom:0;border-radius:99px;background:linear-gradient(90deg,var(--warn),var(--green))}
  .d-bar .now{position:absolute;top:-3px;width:12px;height:12px;border-radius:50%;background:var(--cream);border:2px solid #0F0C08}
  .d-scale{display:flex;justify-content:space-between;font-family:var(--mono);font-size:10px;color:var(--faint)}
  .d-spark svg{width:100%;height:52px;display:block}
  .d-finsight{margin-top:13px;font-size:13px;color:var(--muted);line-height:1.5}
  .d-finsight b{color:var(--amber-lite);font-weight:600}
  /* habits */
  .d-habits{border:1px solid var(--line);border-radius:15px;padding:15px 18px;background:rgba(0,0,0,.22)}
  .d-hhead{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
  .d-hhead .t{font-family:var(--mono);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--faint)}
  .d-hhead .c{font-family:var(--mono);font-size:11px;color:var(--amber)}
  .d-hrow{display:flex;align-items:center;gap:12px;padding:8px 0;border-top:1px solid var(--line-soft);font-size:14px}
  .d-hrow:first-of-type{border-top:none}
  .d-check{width:19px;height:19px;border-radius:6px;border:1.5px solid var(--line);display:grid;place-items:center;flex-shrink:0}
  .d-check.done{background:var(--grad);border-color:transparent}
  .d-check svg{width:12px;height:12px;stroke:#1a0f02;stroke-width:3;fill:none}
  .d-hrow.done .d-hname{color:var(--muted)}
  .d-hname{flex:1}
  .d-htag{font-family:var(--mono);font-size:10px;color:var(--faint)}
  /* rail */
  .d-rail{grid-area:rail;padding:20px 18px;display:flex;flex-direction:column;gap:14px}
  .d-ring{border:1px solid var(--line);border-radius:15px;padding:16px;text-align:center;background:rgba(0,0,0,.22)}
  .d-ring .ttl{font-family:var(--mono);font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--faint);margin-bottom:8px}
  .d-ring svg{width:116px;height:116px}
  .d-ring .pc{font-family:var(--serif);fill:var(--cream)}
  .d-ring .lab{font-family:var(--mono);font-size:10.5px;color:var(--green);margin-top:6px}
  .d-mini{border:1px solid var(--line);border-radius:13px;padding:13px 14px;background:rgba(0,0,0,.22)}
  .d-mini .t{font-family:var(--mono);font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--faint);margin-bottom:7px}
  .d-mini .v{font-family:var(--serif);font-size:24px;display:flex;align-items:baseline;gap:5px}
  .d-mini .v small{font-size:12px;color:var(--muted);font-family:var(--sans)}
  .d-mini.act{border-color:rgba(245,166,35,.3);background:rgba(245,133,63,.05)}
  .d-mini .go{font-family:var(--mono);font-size:10.5px;color:var(--amber-lite);margin-top:7px;display:inline-block}
  /* coach */
  .d-coach{grid-area:coach;padding:14px 20px;display:flex;align-items:center;gap:13px;border-top:1px solid var(--line)}
  .d-cav{width:30px;height:30px;border-radius:50%;background:radial-gradient(circle,#1d160c,#0d0a07);border:1px solid var(--line);display:grid;place-items:center;flex-shrink:0}
  .d-cav i{width:9px;height:9px;border-radius:50%;background:var(--grad);box-shadow:0 0 10px var(--amber)}
  .d-cinput{flex:1;background:rgba(0,0,0,.32);border:1px solid var(--line-soft);border-radius:10px;padding:10px 14px;font-size:13.5px;color:var(--muted)}
  .d-csend{width:34px;height:34px;border-radius:9px;background:var(--grad);display:grid;place-items:center;flex-shrink:0}
  .d-csend svg{width:15px;height:15px;stroke:#1a0f02;stroke-width:2.5;fill:none}
  .dash-fit{transform-origin:top left;will-change:transform}
  @media(max-width:980px){
    .dash-stage{max-width:none;margin:34px auto 0;overflow:hidden}
    .dash{width:1040px}
  }

  /* TICKER */
  .ticker{border-top:1px solid var(--line-soft);border-bottom:1px solid var(--line-soft);overflow:hidden;background:var(--bg-2);margin-top:64px}
  .ticker-track{display:flex;gap:0;white-space:nowrap;animation:scroll 34s linear infinite;font-family:var(--mono);font-size:14px}
  @keyframes scroll{to{transform:translateX(-50%)}}
  .ticker-item{padding:16px 30px;color:var(--muted);display:inline-flex;align-items:center;gap:10px;border-right:1px solid var(--line-soft)}
  .ticker-item .pt{width:7px;height:7px;border-radius:50%}
  .ticker-item b{color:var(--cream);font-weight:500}

  /* TRUST */
  .trust{padding:54px 0 10px;text-align:center}
  .trust-lab{font-family:var(--mono);font-size:11.5px;letter-spacing:.28em;text-transform:uppercase;color:var(--faint);margin-bottom:26px}
  .trust-row{display:flex;flex-wrap:wrap;justify-content:center;gap:14px}
  .badge{display:inline-flex;align-items:center;gap:9px;border:1px solid var(--line);border-radius:12px;padding:12px 18px;font-family:var(--mono);font-size:12.5px;letter-spacing:.06em;color:var(--muted)}
  .badge svg{width:16px;height:16px;stroke:var(--amber)}

  /* SECTION SHELL */
  section.block{padding:96px 0}
  .sec-head{text-align:center;max-width:680px;margin:0 auto 56px}
  .sec-head h2{font-size:clamp(34px,5vw,56px);margin-top:20px}
  .sec-head p{color:var(--muted);font-size:17.5px;margin-top:18px}

  /* AUDIENCE */
  .aud-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
  .aud-card{position:relative;border:1px solid var(--line);border-radius:20px;padding:30px 28px;background:linear-gradient(180deg,var(--surface),var(--bg-2));overflow:hidden;transition:.25s}
  .aud-card:hover{border-color:rgba(245,166,35,.32);transform:translateY(-3px)}
  .aud-card::after{content:"";position:absolute;top:-60px;right:-60px;width:180px;height:180px;background:radial-gradient(circle,rgba(245,133,63,.14),transparent 70%)}
  .aud-tag{font-family:var(--mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--amber);margin-bottom:14px}
  .aud-card h3{font-size:26px;margin-bottom:18px;position:relative}
  .aud-list{list-style:none;display:flex;flex-direction:column;gap:13px;margin-bottom:26px;position:relative}
  .aud-list li{display:flex;gap:11px;font-size:15px;color:var(--muted);line-height:1.4}
  .aud-list svg{width:18px;height:18px;stroke:var(--amber);flex-shrink:0;margin-top:1px}
  .aud-link{font-family:var(--mono);font-size:13px;letter-spacing:.04em;color:var(--amber-lite);display:inline-flex;gap:7px;position:relative}

  /* FEATURE ALT */
  .feat{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;padding:80px 0}
  .feat.rev .feat-text{order:2}
  .feat-text h2{font-size:clamp(30px,4vw,46px);margin-bottom:20px}
  .feat-text p{color:var(--muted);font-size:17px;margin-bottom:26px;max-width:440px}
  .feat-vis{position:relative}
  .feat-vis::before{content:"";position:absolute;inset:-40px;background:radial-gradient(ellipse at center,rgba(245,133,63,.12),transparent 70%);z-index:-1}

  /* TREND chart */
  .trend{background:linear-gradient(180deg,var(--surface),var(--bg-2));border:1px solid var(--line);border-radius:20px;padding:24px;box-shadow:0 30px 70px rgba(0,0,0,.5)}
  .trend-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
  .trend-top .t{font-family:var(--serif);font-size:18px}
  .trend-top .v{font-family:var(--mono);font-size:13px;color:var(--green)}
  .trend svg{width:100%;height:150px;display:block}
  .trend-x{display:flex;justify-content:space-between;font-family:var(--mono);font-size:11px;color:var(--faint);margin-top:8px}

  /* SAMPLE REPORT */
  .rep-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
  .rep-card{border:1px solid var(--line);border-radius:18px;padding:24px 22px;background:linear-gradient(180deg,var(--surface),var(--bg-2))}
  .rep-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
  .rep-name{display:flex;align-items:center;gap:9px;font-family:var(--serif);font-size:20px}
  .rep-name .pt{width:8px;height:8px;border-radius:50%}
  .rep-val{font-family:var(--mono);font-size:30px;color:var(--cream)}
  .rep-val span{font-size:13px;color:var(--faint)}
  .rep-bar{height:5px;border-radius:99px;background:rgba(255,255,255,.07);margin:16px 0 7px;position:relative;overflow:hidden}
  .rep-fill{position:absolute;left:0;top:0;bottom:0;border-radius:99px}
  .rep-scale{display:flex;justify-content:space-between;font-family:var(--mono);font-size:10.5px;color:var(--faint);margin-bottom:14px}
  .rep-desc{font-size:13.5px;color:var(--muted);line-height:1.5}

  /* COMPARISON */
  .cmp-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
  .cmp-card{border:1px solid var(--line);border-radius:20px;padding:32px 28px;background:linear-gradient(180deg,var(--surface),var(--bg-2));text-align:center}
  .cmp-card.hi{border-color:rgba(245,166,35,.35);box-shadow:0 0 50px rgba(245,133,63,.1)}
  .cmp-ic{width:54px;height:54px;border-radius:14px;background:rgba(245,133,63,.1);border:1px solid var(--line);display:grid;place-items:center;margin:0 auto 20px}
  .cmp-ic svg{width:24px;height:24px;stroke:var(--amber)}
  .cmp-card h3{font-size:21px;margin-bottom:14px}
  .cmp-card p{font-size:14.5px;color:var(--muted)}

  /* STEPS */
  .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;position:relative}
  .step{text-align:center;position:relative}
  .step-node{width:90px;height:90px;border-radius:50%;border:1px solid var(--line);background:radial-gradient(circle,rgba(245,133,63,.08),transparent);display:grid;place-items:center;margin:0 auto 22px;position:relative}
  .step-node svg{width:30px;height:30px;stroke:var(--amber)}
  .step-num{position:absolute;top:-4px;right:50%;transform:translateX(46px);width:30px;height:30px;border-radius:50%;background:var(--grad);color:#1a0f02;font-family:var(--mono);font-size:12px;font-weight:600;display:grid;place-items:center;box-shadow:0 0 16px rgba(245,133,63,.5)}
  .step h3{font-size:26px;margin-bottom:12px}
  .step p{color:var(--muted);font-size:15px;max-width:280px;margin:0 auto}
  .steps::before{content:"";position:absolute;top:45px;left:16%;right:16%;height:1px;background:linear-gradient(90deg,transparent,var(--line),transparent);z-index:0}

  /* HOW IT WORKS — the loop */
  .hw-flow{position:relative;display:flex;align-items:flex-start}
  .hw-flow::before{content:"";position:absolute;top:64px;left:10%;right:10%;height:1px;background:linear-gradient(90deg,transparent,rgba(245,166,35,.4),rgba(245,166,35,.55),transparent);z-index:0}
  .hw-step{flex:1;text-align:center;position:relative;z-index:1;padding:18px 10px 0}
  .hw-node{width:92px;height:92px;border-radius:50%;border:1px solid var(--line);background:radial-gradient(circle,rgba(245,133,63,.07),transparent 72%),#0E0B08;display:grid;place-items:center;margin:0 auto 22px;position:relative}
  .hw-node svg{width:30px;height:30px;stroke:var(--amber);fill:none;stroke-width:1.9}
  .hw-num{position:absolute;top:-2px;left:50%;transform:translateX(34px);width:30px;height:30px;border-radius:50%;background:var(--grad);color:#1a0f02;font-family:var(--mono);font-size:11px;font-weight:600;display:grid;place-items:center;box-shadow:0 0 16px rgba(245,133,63,.5)}
  .hw-step h3{font-family:var(--serif);font-size:24px;font-weight:500;margin-bottom:11px}
  .hw-step p{color:var(--muted);font-size:14.5px;max-width:230px;margin:0 auto;line-height:1.5}
  .hw-loop{flex:3;display:flex;align-items:flex-start;position:relative;border:1px dashed rgba(245,166,35,.32);border-radius:24px;padding:0 6px 24px;background:radial-gradient(ellipse at 50% 0%,rgba(245,133,63,.06),transparent 62%)}
  .hw-loop .hw-node{border-color:rgba(245,166,35,.32);box-shadow:0 0 36px rgba(245,133,63,.18);background:radial-gradient(circle,rgba(245,133,63,.15),transparent 72%),#110D08}
  .hw-loop-tag{position:absolute;top:-15px;left:50%;transform:translateX(-50%);white-space:nowrap;background:#140F0A;border:1px solid rgba(245,166,35,.34);border-radius:999px;padding:6px 16px;font-family:var(--mono);font-size:10.5px;letter-spacing:.13em;text-transform:uppercase;color:var(--amber-lite);display:inline-flex;align-items:center;gap:8px}
  .hw-loop-tag .cyc{font-size:14px;line-height:1}
  @media(max-width:920px){
    .hw-flow{flex-direction:column}
    .hw-flow::before{display:none}
    .hw-loop{flex-direction:column;width:100%;padding:34px 0 18px}
    .hw-step{padding:14px 0 0}
    .hw-num{transform:translateX(30px)}
  }

  /* PRICING */
  .price-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;align-items:stretch}
  .price-card{border:1px solid var(--line);border-radius:22px;padding:34px 30px;background:linear-gradient(180deg,var(--surface),var(--bg-2));display:flex;flex-direction:column}
  .price-card.feat-tier{border-color:rgba(245,166,35,.4);box-shadow:0 0 60px rgba(245,133,63,.12);position:relative}
  .price-flag{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--grad);color:#1a0f02;font-family:var(--mono);font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;padding:5px 14px;border-radius:999px;font-weight:600}
  .price-tier{font-family:var(--mono);font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--amber);margin-bottom:16px}
  .price-amt{font-family:var(--serif);font-size:52px;line-height:1}
  .price-amt span{font-size:16px;color:var(--faint);font-family:var(--sans)}
  .price-desc{color:var(--muted);font-size:14.5px;margin:14px 0 24px}
  .price-list{list-style:none;display:flex;flex-direction:column;gap:13px;margin-bottom:28px;flex:1}
  .price-list li{display:flex;gap:11px;font-size:14.5px;color:var(--cream)}
  .price-list svg{width:17px;height:17px;stroke:var(--amber);flex-shrink:0;margin-top:2px}
  .price-card .btn{justify-content:center;width:100%}

  /* ANNA — AI COACH */
  .coach-sec{position:relative;overflow:hidden}
  .coach-sec::before{content:"";position:absolute;top:6%;right:-8%;width:680px;height:680px;background:radial-gradient(circle,rgba(245,133,63,.15),transparent 60%);filter:blur(24px);pointer-events:none}
  .coach-grid{display:grid;grid-template-columns:.9fr 1.1fr;gap:60px;align-items:center;position:relative;z-index:1}
  .coach-left h2{font-size:clamp(32px,4.6vw,52px);margin:18px 0 20px;line-height:1.05}
  .coach-left p{color:var(--muted);font-size:17px;max-width:450px;margin-bottom:26px}
  .coach-left p em{color:var(--cream);font-style:italic}
  .coach-caps{display:flex;flex-wrap:wrap;gap:9px;margin-bottom:30px}
  .coach-cap{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--line);border-radius:999px;padding:9px 14px;font-size:12.5px;color:var(--cream);background:rgba(255,255,255,.015)}
  .coach-cap svg{width:14px;height:14px;stroke:var(--amber);fill:none;stroke-width:2}
  /* living orb */
  .orb{position:relative;width:var(--s,44px);height:var(--s,44px);border-radius:50%;flex-shrink:0;display:grid;place-items:center;background:radial-gradient(circle at 50% 38%,#2a1c0e,#0d0a07)}
  .orb::before{content:"";position:absolute;inset:-1px;border-radius:50%;background:conic-gradient(from 0deg,#FFC069,#E8743B,#7a4422,#FFC069);-webkit-mask:radial-gradient(circle,transparent 56%,#000 58%);mask:radial-gradient(circle,transparent 56%,#000 58%);animation:orbspin 7s linear infinite}
  .orb i{width:34%;height:34%;border-radius:50%;background:var(--grad);box-shadow:0 0 14px rgba(245,133,63,.85);animation:orbpulse 3s ease-in-out infinite}
  @keyframes orbspin{to{transform:rotate(360deg)}}
  @keyframes orbpulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(.82);opacity:.78}}
  /* chat card */
  .anna-card{position:relative;border:1px solid var(--line);border-radius:24px;background:linear-gradient(180deg,#15110B,#0E0B08);box-shadow:0 44px 110px rgba(0,0,0,.62);overflow:hidden}
  .anna-card::before{content:"";position:absolute;top:0;left:0;right:0;height:120px;background:radial-gradient(ellipse at 50% -40%,rgba(245,133,63,.16),transparent 70%);pointer-events:none}
  .anna-head{display:flex;align-items:center;gap:12px;padding:17px 20px;border-bottom:1px solid var(--line-soft);position:relative}
  .anna-head .nm{font-family:var(--serif);font-size:18px;line-height:1.1}
  .anna-head .st{font-family:var(--mono);font-size:10.5px;color:var(--green);display:flex;align-items:center;gap:6px;margin-top:2px}
  .anna-head .st .d{width:6px;height:6px;border-radius:50%;background:var(--green);box-shadow:0 0 8px var(--green)}
  .anna-thread{padding:22px 20px 16px;display:flex;flex-direction:column;gap:15px}
  .msg{max-width:86%;font-size:14.5px;line-height:1.55}
  .msg.user{align-self:flex-end;background:rgba(255,255,255,.05);border:1px solid var(--line-soft);border-radius:16px 16px 5px 16px;padding:11px 15px;color:var(--cream)}
  .msg.anna{align-self:flex-start;display:flex;gap:11px;max-width:92%}
  .msg.anna .bub{background:rgba(245,133,63,.07);border:1px solid rgba(245,166,35,.2);border-radius:5px 16px 16px 16px;padding:13px 16px;color:var(--cream)}
  .msg.anna .bub b{color:var(--amber-lite);font-weight:600}
  .data-chip{display:flex;align-items:center;gap:13px;margin:12px 0 5px;border:1px solid var(--line);border-radius:12px;padding:10px 13px;background:rgba(0,0,0,.32)}
  .data-chip .nm{font-family:var(--mono);font-size:11.5px;color:var(--muted)}
  .data-chip .vals{font-family:var(--mono);font-size:13px;color:var(--cream);display:flex;align-items:center;gap:6px;margin-top:2px}
  .data-chip .up{color:var(--green)}
  .data-chip .sk{margin-left:auto}
  .data-chip .sk svg{width:60px;height:26px;display:block}
  .typing{align-self:flex-start;display:flex;gap:11px;align-items:center}
  .typing .tb{background:rgba(245,133,63,.07);border:1px solid rgba(245,166,35,.2);border-radius:5px 16px 16px 16px;padding:14px 16px;display:flex;gap:5px}
  .typing .tb span{width:6px;height:6px;border-radius:50%;background:var(--amber);animation:tdot 1.3s ease-in-out infinite}
  .typing .tb span:nth-child(2){animation-delay:.18s}.typing .tb span:nth-child(3){animation-delay:.36s}
  @keyframes tdot{0%,60%,100%{opacity:.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}}
  .anna-qr{display:flex;flex-wrap:wrap;gap:8px;padding:4px 20px 0}
  .qr{border:1px solid var(--line);border-radius:999px;padding:7px 13px;font-size:12.5px;color:var(--muted);background:rgba(255,255,255,.02);cursor:pointer;transition:.15s}
  .qr:hover{border-color:rgba(245,166,35,.4);color:var(--cream)}
  .anna-input{display:flex;align-items:center;gap:11px;margin:16px 20px 20px;background:rgba(0,0,0,.34);border:1px solid var(--line-soft);border-radius:12px;padding:11px 14px}
  .anna-input .ph{flex:1;font-size:13.5px;color:var(--faint)}
  .anna-send{width:34px;height:34px;border-radius:9px;background:var(--grad);display:grid;place-items:center;flex-shrink:0}
  .anna-send svg{width:15px;height:15px;stroke:#1a0f02;stroke-width:2.5;fill:none}
  @media(max-width:900px){.coach-grid{grid-template-columns:1fr;gap:40px}}
  @media(prefers-reduced-motion:reduce){.orb::before,.orb i,.typing .tb span{animation:none}}

  /* FAQ */
  .faq{max-width:820px;margin:0 auto}
  .faq-item{border-bottom:1px solid var(--line-soft)}
  .faq-q{width:100%;text-align:left;background:none;border:none;color:var(--cream);font-family:var(--serif);font-size:21px;padding:24px 0;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:20px}
  .faq-q .ic{color:var(--amber);font-size:26px;font-family:var(--sans);transition:.25s;flex-shrink:0}
  .faq-item.open .faq-q .ic{transform:rotate(45deg)}
  .faq-a{max-height:0;overflow:hidden;transition:max-height .3s ease;color:var(--muted);font-size:16px}
  .faq-item.open .faq-a{max-height:240px}
  .faq-a p{padding-bottom:24px;max-width:680px}

  /* FINAL CTA */
  .final{position:relative;border:1px solid var(--line);border-radius:30px;background:radial-gradient(ellipse at 30% 0%,rgba(245,133,63,.16),transparent 60%),linear-gradient(180deg,var(--surface),var(--bg-2));padding:80px 40px;text-align:center;overflow:hidden;margin:40px 0}
  .final h2{font-size:clamp(38px,6vw,66px)}
  .final p{color:var(--muted);font-size:18px;max-width:520px;margin:22px auto 34px}
  .final .meta{margin-top:24px;font-family:var(--mono);font-size:12.5px;letter-spacing:.1em;color:var(--faint)}

  /* FOOTER */
  footer{border-top:1px solid var(--line-soft);padding:72px 0 36px;background:var(--bg-2)}
  .foot-grid{display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr 1fr;gap:40px;margin-bottom:54px}
  .foot-brand .word{font-size:27px}
  .foot-brand .logo-mark{width:40px;height:40px}
  .foot-brand p{color:var(--muted);font-size:14.5px;margin-top:16px;max-width:240px}
  .foot-col h4{font-family:var(--mono);font-size:11.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--amber);margin-bottom:18px}
  .foot-col a{display:block;color:var(--muted);font-size:14.5px;margin-bottom:12px;transition:.15s}
  .foot-col a:hover{color:var(--cream)}
  .foot-bottom{display:flex;justify-content:space-between;align-items:center;padding-top:28px;border-top:1px solid var(--line-soft);flex-wrap:wrap;gap:20px}
  .foot-badges{display:flex;gap:12px;flex-wrap:wrap}
  .foot-badges .badge{font-size:11px;padding:9px 13px}
  .foot-meta{color:var(--faint);font-size:13px}

  .nav-drawer{display:none;flex-direction:column;gap:2px;padding:10px 24px 18px;background:var(--bg-2);border-top:1px solid var(--line-soft)}
  .nav-drawer a{color:var(--muted);font-size:16px;padding:12px 4px;border-bottom:1px solid var(--line-soft)}
  .nav-drawer a.btn{border-bottom:none;margin-top:12px;text-align:center;color:#1a0f02}
  .nav.open .nav-drawer{display:flex}

  @media(max-width:900px){
    .nav-links,.nav-cta .signin{display:none}
    .menu-btn{display:block}
    .aud-grid,.cmp-grid,.steps,.price-grid{grid-template-columns:1fr}
    .steps::before{display:none}
    .rep-grid{grid-template-columns:1fr 1fr}
    .feat{grid-template-columns:1fr;gap:34px}
    .feat.rev .feat-text{order:0}
    .foot-grid{grid-template-columns:1fr 1fr}
  }
  @media(max-width:560px){.rep-grid{grid-template-columns:1fr}.foot-grid{grid-template-columns:1fr}}
  @media(prefers-reduced-motion:reduce){.ticker-track{animation:none}*{transition:none!important}}
</style>

<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <linearGradient id="lmAmber" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFC069"/><stop offset=".55" stop-color="#F5853F"/><stop offset="1" stop-color="#E8743B"/></linearGradient>
  <symbol id="lm" viewBox="0 0 120 120">
    <rect x="36" y="24" width="13" height="62" rx="3.5" fill="url(#lmAmber)"/>
    <rect x="36" y="73" width="40" height="13" rx="3.5" fill="url(#lmAmber)"/>
    <line x1="76" y1="79.5" x2="108" y2="79.5" stroke="url(#lmAmber)" stroke-width="2.4" stroke-linecap="round" opacity=".38"/>
    <g stroke="url(#lmAmber)" stroke-width="2" stroke-linecap="round" opacity=".4"><line x1="84" y1="74.5" x2="84" y2="84.5"/><line x1="100" y1="74.5" x2="100" y2="84.5"/></g>
    <circle class="lm-glow" cx="92" cy="79.5" r="11" fill="url(#lmAmber)" opacity=".3"/>
    <circle cx="92" cy="79.5" r="7" fill="url(#lmAmber)"/>
    <circle cx="92" cy="79.5" r="2.8" fill="#160d04"/>
  </symbol>
</defs></svg>

<!-- ANNOUNCEMENT -->
<div class="topbar">labread now reads <b style="color:var(--amber-lite)">50+ biomarkers</b> across any lab, in any language &nbsp;<a href="#">See what's new →</a></div>

<!-- NAV -->
<nav class="nav"><div class="wrap nav-in">
  <a class="brand" href="#"><svg class="logo-mark"><use href="#lm"/></svg><span class="word">labread</span></a>
  <div class="nav-links">
    <a href="#audience">For you</a>
    <a href="#audience">For doctors</a>
    <a href="#audience">For clinics</a>
    <a href="#learn">Learn</a>
    <a href="#coach">Coach</a>
  </div>
  <div class="nav-cta">
    <a class="signin" href="/auth">Sign in</a>
    <a class="btn btn-amber" href="/get-started">Try for free</a>
  </div>
  <button class="menu-btn" aria-label="Menu">☰</button>
</div>
  <div class="nav-drawer">
    <a href="#audience">For you</a>
    <a href="#audience">For doctors</a>
    <a href="#audience">For clinics</a>
    <a href="#learn">Learn</a>
    <a href="#coach">Coach</a>
    <a href="/auth">Sign in</a>
    <a class="btn btn-amber" href="/get-started">Try for free</a>
  </div>
</nav>

<!-- HERO -->
<header class="hero"><div class="wrap">
  <div class="hero-badge"><span class="dot"></span>AI-Powered Medical Clarity</div>
  <h1>Your blood test,<br><span class="ital">finally explained.</span></h1>
  <p class="hero-sub">Understand your results, get a simple plan, and <b>watch your numbers move</b>. Not a one-time report — a health you can actually follow.</p>
  <div class="hero-cta">
    <a class="btn btn-amber" href="/get-started">Try for free →</a>
    <a class="btn btn-ghost" href="#sample">See a sample report</a>
  </div>
  <div class="hero-note"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"/></svg>Your data is never stored. Processed, then immediately deleted · HIPAA-compliant</div>

  <div class="dash-stage">
    <div class="dash-fit">
    <div class="dash">

      <div class="d-side">
        <div class="d-prof"><span class="d-av">SA</span><span><span class="d-name">Soufiane A.</span><br><span class="d-handle">@soufiane</span></span></div>
        <nav class="d-nav">
          <a class="on" href="#"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>Dashboard</a>
          <a href="#"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>History</a>
          <a href="#"><svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/></svg>Protocol</a>
          <a href="#"><svg viewBox="0 0 24 24"><path d="M3 17l5-5 4 3 7-8"/><path d="M16 7h4v4"/></svg>Progress</a>
          <a href="#"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg>Daily check-in</a>
          <a href="#"><svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 01-11.5 7.2L3 21l1.8-6.5A8 8 0 1121 12z"/></svg>Coach</a>
        </nav>
        <div class="d-streak"><div class="big">12 <small>day streak</small></div><div class="sub">DAY 38 OF 90 · PROTOCOL</div></div>
        <div class="d-up">+ <b>New blood test</b></div>
      </div>

      <div class="d-main">
        <div class="d-mhead"><h4>Today</h4><span class="day">DAY 38 / 90</span></div>

        <div class="d-focus">
          <div class="d-fhead"><span class="d-fname"><span class="pt"></span>Ferritin</span><span class="d-fval">31 <span style="color:var(--faint)">ng/mL</span> &nbsp;<span class="up">↑ from 18</span></span></div>
          <div class="d-frow">
            <div>
              <div class="d-bar"><div class="fill" style="width:44%"></div><div class="now" style="left:42%"></div></div>
              <div class="d-scale"><span>0</span><span>optimal 30–150</span><span>300</span></div>
            </div>
            <div class="d-spark"><svg viewBox="0 0 128 52" preserveAspectRatio="none">
              <polyline points="4,44 28,42 52,36 76,28 100,18 124,12" fill="none" stroke="#6FCF97" stroke-width="2"/>
              <circle cx="124" cy="12" r="3.5" fill="#6FCF97"/>
            </svg></div>
          </div>
          <p class="d-finsight"><b>Your iron is climbing.</b> Six weeks in, ferritin has moved out of the low zone toward optimal — your energy and focus should follow.</p>
        </div>

        <div class="d-habits">
          <div class="d-hhead"><span class="t">Today's habits</span><span class="c">3 of 5 done</span></div>
          <div class="d-hrow done"><span class="d-check done"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg></span><span class="d-hname">Iron-rich meal</span><span class="d-htag">AM</span></div>
          <div class="d-hrow done"><span class="d-check done"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg></span><span class="d-hname">Vitamin D · 4000 IU</span><span class="d-htag">AM</span></div>
          <div class="d-hrow done"><span class="d-check done"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg></span><span class="d-hname">8,000 steps</span><span class="d-htag">8,210</span></div>
          <div class="d-hrow"><span class="d-check"></span><span class="d-hname">Magnesium</span><span class="d-htag">PM</span></div>
          <div class="d-hrow"><span class="d-check"></span><span class="d-hname">Sleep 7h+</span><span class="d-htag">PM</span></div>
        </div>
      </div>

      <div class="d-rail">
        <div class="d-ring">
          <div class="ttl">Protocol progress</div>
          <svg viewBox="0 0 120 120">
            <defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFC069"/><stop offset="1" stop-color="#E8743B"/></linearGradient></defs>
            <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="9"/>
            <circle cx="60" cy="60" r="50" fill="none" stroke="url(#rg)" stroke-width="9" stroke-linecap="round" stroke-dasharray="314" stroke-dashoffset="182" transform="rotate(-90 60 60)"/>
            <text x="60" y="58" text-anchor="middle" class="pc" font-size="28">42%</text>
            <text x="60" y="76" text-anchor="middle" font-size="9" fill="#9E9384" letter-spacing="1">DAY 38/90</text>
          </svg>
          <div class="lab">On track</div>
        </div>
        <div class="d-mini"><div class="t">Markers in range</div><div class="v">78<small>%</small></div></div>
        <div class="d-mini act"><div class="t">Next blood test</div><div class="v">21<small>days</small></div><span class="go">Set a reminder →</span></div>
      </div>

      <div class="d-coach">
        <span class="d-cav"><i></i></span>
        <span class="d-cinput">Ask your coach — "why is my ferritin moving so slowly?"</span>
        <span class="d-csend"><svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7"/></svg></span>
      </div>

    </div>
    </div>
  </div>
</div></header>

<!-- TICKER -->
<div class="ticker"><div class="ticker-track">
  <span class="ticker-item"><span class="pt" style="background:var(--green)"></span>Hemoglobin <b>14.2</b></span>
  <span class="ticker-item"><span class="pt" style="background:var(--green)"></span>HDL <b>62</b></span>
  <span class="ticker-item"><span class="pt" style="background:var(--warn)"></span>LDL <b>131</b></span>
  <span class="ticker-item"><span class="pt" style="background:var(--green)"></span>A1c <b>5.3%</b></span>
  <span class="ticker-item"><span class="pt" style="background:var(--green)"></span>ALT <b>24</b></span>
  <span class="ticker-item"><span class="pt" style="background:var(--warn)"></span>Ferritin <b>18</b></span>
  <span class="ticker-item"><span class="pt" style="background:var(--green)"></span>Creatinine <b>0.9</b></span>
  <span class="ticker-item"><span class="pt" style="background:var(--red)"></span>CRP <b>4.2</b></span>
  <span class="ticker-item"><span class="pt" style="background:var(--green)"></span>B12 <b>540</b></span>
  <span class="ticker-item"><span class="pt" style="background:var(--green)"></span>Hemoglobin <b>14.2</b></span>
  <span class="ticker-item"><span class="pt" style="background:var(--green)"></span>HDL <b>62</b></span>
  <span class="ticker-item"><span class="pt" style="background:var(--warn)"></span>LDL <b>131</b></span>
  <span class="ticker-item"><span class="pt" style="background:var(--green)"></span>A1c <b>5.3%</b></span>
  <span class="ticker-item"><span class="pt" style="background:var(--green)"></span>ALT <b>24</b></span>
  <span class="ticker-item"><span class="pt" style="background:var(--warn)"></span>Ferritin <b>18</b></span>
  <span class="ticker-item"><span class="pt" style="background:var(--green)"></span>Creatinine <b>0.9</b></span>
  <span class="ticker-item"><span class="pt" style="background:var(--red)"></span>CRP <b>4.2</b></span>
  <span class="ticker-item"><span class="pt" style="background:var(--green)"></span>B12 <b>540</b></span>
</div></div>

<!-- TRUST -->
<section class="trust"><div class="wrap">
  <div class="trust-lab">Built to clinical standards</div>
  <div class="trust-row">
    <span class="badge"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"/></svg>HIPAA compliant</span>
    <span class="badge"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"/></svg>GDPR compliant</span>
    <span class="badge"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/></svg>SOC 2 aligned</span>
    <span class="badge"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/></svg>Any lab · 80+ languages</span>
    <span class="badge"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M4 4h16v16H4z"/><path d="M8 12h8M12 8v8"/></svg>Zero data retention</span>
  </div>
</div></section>

<!-- AUDIENCE -->
<section class="block" id="audience"><div class="wrap">
  <div class="sec-head">
    <span class="eyebrow">Who it's for</span>
    <h2>One platform. <span class="ital">Three ways</span> to use it.</h2>
    <p>Whether you're reading your own results or running a practice, labread meets you where you are.</p>
  </div>
  <div class="aud-grid">
    <div class="aud-card">
      <div class="aud-tag">For individuals & families</div>
      <h3>Understand your own results</h3>
      <ul class="aud-list">
        <li><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>Plain-English interpretation of every value</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>Track your whole family in one place</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>Questions worth asking your doctor</li>
      </ul>
      <a class="aud-link" href="#">How it works →</a>
    </div>
    <div class="aud-card">
      <div class="aud-tag">For doctors & consultants</div>
      <h3>Save time on every patient</h3>
      <ul class="aud-list">
        <li><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>Branded interpretation reports</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>Track biomarker trends over time</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>Instant context for patient questions</li>
      </ul>
      <a class="aud-link" href="#">Explore for clinicians →</a>
    </div>
    <div class="aud-card">
      <div class="aud-tag">For labs & clinics</div>
      <h3>White-label the explanation layer</h3>
      <ul class="aud-list">
        <li><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>Embed labread under your own brand</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>API + report automation at scale</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>Custom deployment & support</li>
      </ul>
      <a class="aud-link" href="#">Talk to us →</a>
    </div>
  </div>
</div></section>

<!-- FEATURE 1 -->
<div class="wrap"><div class="feat">
  <div class="feat-text">
    <span class="eyebrow solo">Instant interpretation</span>
    <h2 style="margin-top:18px">Every value, read against <span class="ital">real medical ranges</span></h2>
    <p>labread doesn't just label numbers green or red. It explains what each marker means for your body today, why it might be off, and what's worth a conversation with your doctor.</p>
    <a class="btn btn-amber" href="#sample">Read a sample →</a>
  </div>
  <div class="feat-vis">
    <div class="bm-card">
      <div class="bm-head"><span>Coenzyme Q10 · lipid corrected</span><span class="bm-ready"><span class="dot"></span>Optimal</span></div>
      <div class="rep-bar" style="margin-top:4px"><div class="rep-fill" style="left:8%;width:62%;background:linear-gradient(90deg,var(--warn),var(--green))"></div></div>
      <div class="rep-scale"><span>0.2</span><span style="color:var(--green)">0.35 quotient</span><span>0.8</span></div>
      <div class="insight"><div class="lab">what it means</div><p>CoQ10 supports cellular energy in your heart, muscles and brain. Lipid-corrected adjusts for cholesterol — giving a truer picture of your real status.</p></div>
    </div>
  </div>
</div></div>

<!-- FEATURE 2 -->
<div class="wrap"><div class="feat rev">
  <div class="feat-text">
    <span class="eyebrow solo">Track over time</span>
    <h2 style="margin-top:18px">Watch your markers <span class="ital">move</span></h2>
    <p>Upload each new test and labread builds a history — so you can see whether a change is a trend or a blip, and whether your last decision actually worked.</p>
    <a class="btn btn-ghost" href="#">See tracking →</a>
  </div>
  <div class="feat-vis">
    <div class="trend">
      <div class="trend-top"><span class="t">Aspartate Aminotransferase</span><span class="v">20.7 U/L ↑</span></div>
      <svg viewBox="0 0 320 150" preserveAspectRatio="none">
        <rect x="0" y="0" width="320" height="40" fill="rgba(224,112,106,.07)"/>
        <rect x="0" y="40" width="320" height="70" fill="rgba(111,207,151,.07)"/>
        <rect x="0" y="110" width="320" height="40" fill="rgba(227,169,74,.07)"/>
        <polyline points="10,120 70,108 130,82 190,70 250,60 300,55" fill="none" stroke="#6FCF97" stroke-width="2.5"/>
        <circle cx="250" cy="60" r="5" fill="#6FCF97"/>
        <circle cx="250" cy="60" r="9" fill="none" stroke="#6FCF97" stroke-width="1.5" opacity=".4"/>
      </svg>
      <div class="trend-x"><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span></div>
    </div>
  </div>
</div></div>

<!-- SAMPLE REPORT -->
<section class="block" id="sample"><div class="wrap">
  <div class="sec-head">
    <span class="eyebrow">Sample report</span>
    <h2>Here's what your <span class="ital">report</span> looks like</h2>
    <p>Every value placed on its real medical range — so you can see at a glance where you stand.</p>
  </div>
  <div class="rep-grid">
    <div class="rep-card">
      <div class="rep-top"><span class="rep-name"><span class="pt" style="background:var(--warn)"></span>Ferritin</span><span class="pill low">Low</span></div>
      <div class="rep-val">18 <span>ng/mL</span></div>
      <div class="rep-bar"><div class="rep-fill" style="left:0;width:24%;background:var(--warn)"></div></div>
      <div class="rep-scale"><span>0</span><span>optimal 30–150</span><span>300</span></div>
      <p class="rep-desc">Your iron stores are running low — a common cause of fatigue, brain fog, and feeling cold.</p>
    </div>
    <div class="rep-card">
      <div class="rep-top"><span class="rep-name"><span class="pt" style="background:var(--warn)"></span>Vitamin D</span><span class="pill low">Low</span></div>
      <div class="rep-val">22 <span>ng/mL</span></div>
      <div class="rep-bar"><div class="rep-fill" style="left:0;width:30%;background:var(--warn)"></div></div>
      <div class="rep-scale"><span>0</span><span>optimal 30–60</span><span>80</span></div>
      <p class="rep-desc">Below the optimal range — often linked to low energy, low mood, and weaker immunity.</p>
    </div>
    <div class="rep-card">
      <div class="rep-top"><span class="rep-name"><span class="pt" style="background:var(--green)"></span>TSH</span><span class="pill norm">Normal</span></div>
      <div class="rep-val">2.1 <span>mIU/L</span></div>
      <div class="rep-bar"><div class="rep-fill" style="left:6%;width:50%;background:var(--green)"></div></div>
      <div class="rep-scale"><span>0</span><span>normal 0.4–4.0</span><span>5</span></div>
      <p class="rep-desc">Your thyroid signal is in range — though one number doesn't capture the full thyroid picture.</p>
    </div>
    <div class="rep-card">
      <div class="rep-top"><span class="rep-name"><span class="pt" style="background:var(--red)"></span>CRP</span><span class="pill high">Elevated</span></div>
      <div class="rep-val">4.2 <span>mg/L</span></div>
      <div class="rep-bar"><div class="rep-fill" style="left:0;width:60%;background:var(--red)"></div></div>
      <div class="rep-scale"><span>0</span><span>low risk &lt;1</span><span>7</span></div>
      <p class="rep-desc">A marker of inflammation that's mildly raised — worth understanding what's driving it.</p>
    </div>
  </div>
</div></section>

<!-- COMPARISON -->
<section class="block" style="background:var(--bg-2)"><div class="wrap">
  <div class="sec-head">
    <span class="eyebrow">Why not just Google it</span>
    <h2>labread vs <span class="ital">the old way</span></h2>
    <p>Search engines give you panic. A general chatbot gives you a guess. labread gives you your result, in context.</p>
  </div>
  <div class="cmp-grid">
    <div class="cmp-card hi">
      <div class="cmp-ic"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"/></svg></div>
      <h3>Private by design</h3>
      <p>Your numbers are processed and immediately deleted. Never stored, never used to train models.</p>
    </div>
    <div class="cmp-card hi">
      <div class="cmp-ic"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M3 12h4l3 8 4-16 3 8h4"/></svg></div>
      <h3>Built for blood, only</h3>
      <p>Not a general chatbot. A focused pipeline that maps every value to validated clinical reference ranges.</p>
    </div>
    <div class="cmp-card hi">
      <div class="cmp-ic"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg></div>
      <h3>Personal, not generic</h3>
      <p>Context-aware next steps tuned to your unique results — not a copy-paste of a textbook range.</p>
    </div>
  </div>
</div></section>

<!-- HOW IT WORKS -->
<section class="block"><div class="wrap">
  <div class="sec-head">
    <span class="eyebrow">How it works</span>
    <h2>It doesn't end at the <span class="ital">report.</span></h2>
    <p>Most tools stop at explaining your numbers. labread turns them into a plan you follow — and proof it's working.</p>
  </div>
  <div class="hw-flow">
    <div class="hw-step">
      <div class="hw-node"><span class="hw-num">01</span><svg viewBox="0 0 24 24"><path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 20h16"/></svg></div>
      <h3>Upload</h3>
      <p>Drop a PDF or snap a photo of your lab report. Any lab, any language.</p>
    </div>
    <div class="hw-step">
      <div class="hw-node"><span class="hw-num">02</span><svg viewBox="0 0 24 24"><path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 00-4 12c.5.5 1 1.5 1 3h6c0-1.5.5-2.5 1-3a7 7 0 00-4-12z"/></svg></div>
      <h3>Understand</h3>
      <p>Every value explained in plain English, placed on its real medical range.</p>
    </div>
    <div class="hw-loop">
      <span class="hw-loop-tag"><span class="cyc">↻</span> The ongoing loop · repeats every test</span>
      <div class="hw-step">
        <div class="hw-node"><span class="hw-num">03</span><svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/></svg></div>
        <h3>Your protocol</h3>
        <p>A simple 90-day plan built from your results — what to change, and why.</p>
      </div>
      <div class="hw-step">
        <div class="hw-node"><span class="hw-num">04</span><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg></div>
        <h3>Daily actions</h3>
        <p>A few small habits to check off each day. Streaks keep you going.</p>
      </div>
      <div class="hw-step">
        <div class="hw-node"><span class="hw-num">05</span><svg viewBox="0 0 24 24"><path d="M3 17l5-5 4 3 7-8"/><path d="M16 7h4v4"/></svg></div>
        <h3>Watch progress</h3>
        <p>Re-test and see your numbers move. Keep what works, adjust what doesn't.</p>
      </div>
    </div>
  </div>
</div></section>

<!-- ANNA — AI COACH -->
<section class="block coach-sec" id="coach" style="background:var(--bg-2)"><div class="wrap">
  <div class="coach-grid">
    <div class="coach-left">
      <span class="eyebrow solo">Your AI coach</span>
      <h2>Not a chatbot.<br><span class="ital">Your coach.</span></h2>
      <p>Anna reads your results, follows your protocol and remembers your history — so when you ask a question, the answer is about <em>you</em>, not a textbook. Plain English, any time, in 80+ languages.</p>
      <div class="coach-caps">
        <span class="coach-cap"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>Knows your results</span>
        <span class="coach-cap"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>Follows your protocol</span>
        <span class="coach-cap"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>Remembers your history</span>
        <span class="coach-cap"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>Available 24/7</span>
      </div>
      <a class="btn btn-amber" href="#">Meet Anna →</a>
    </div>

    <div class="anna-card">
      <div class="anna-head">
        <span class="orb" style="--s:42px"><i></i></span>
        <span><span class="nm">Anna</span><br><span class="st"><span class="d"></span>your coach · online</span></span>
      </div>
      <div class="anna-thread">
        <div class="msg user">Anna, why does my ferritin still feel low after 6 weeks?</div>
        <div class="msg anna">
          <span class="orb" style="--s:30px"><i></i></span>
          <div class="bub">
            Actually — it's turning the corner. Since you started the protocol your ferritin has climbed from <b>18 to 31</b>:
            <div class="data-chip">
              <div><div class="nm">Ferritin</div><div class="vals">18 <span class="up">→ 31 ↑</span></div></div>
              <span class="sk"><svg viewBox="0 0 60 26" preserveAspectRatio="none"><polyline points="3,22 16,20 28,15 40,9 57,4" fill="none" stroke="#6FCF97" stroke-width="2"/><circle cx="57" cy="4" r="2.6" fill="#6FCF97"/></svg></span>
            </div>
            That's into the optimal range. The fatigue should keep easing — stay with the iron-rich meal and we'll confirm at your next test.
          </div>
        </div>
        <div class="typing"><span class="orb" style="--s:30px"><i></i></span><div class="tb"><span></span><span></span><span></span></div></div>
      </div>
      <div class="anna-qr">
        <span class="qr">Explain my CRP</span>
        <span class="qr">What should I eat this week?</span>
        <span class="qr">Am I actually improving?</span>
      </div>
      <div class="anna-input"><span class="ph">Ask Anna anything about your results…</span><span class="anna-send"><svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7"/></svg></span></div>
    </div>
  </div>
</div></section>

<!-- LEARN -->
<section class="block" id="learn"><div class="wrap">
  <div class="sec-head">
    <span class="eyebrow">Learn</span>
    <h2>Understand your <span class="ital">results.</span></h2>
    <p>Plain-English guides to the biomarkers people ask about most.</p>
  </div>
  <div class="rep-grid" style="grid-template-columns:repeat(3,1fr)">
    <a class="rep-card" href="/learn/ferritin" style="text-decoration:none"><div class="aud-tag">Iron</div><h3 style="font-family:var(--serif);font-size:22px;margin-bottom:10px">What does low ferritin mean?</h3><p class="rep-desc" style="margin-bottom:16px">Iron deficiency, explained in plain English.</p><span class="aud-link">Read guide →</span></a>
    <a class="rep-card" href="/learn/vitamin-d" style="text-decoration:none"><div class="aud-tag">Vitamins</div><h3 style="font-family:var(--serif);font-size:22px;margin-bottom:10px">Vitamin D deficiency explained</h3><p class="rep-desc" style="margin-bottom:16px">Why "normal" and "optimal" are far apart.</p><span class="aud-link">Read guide →</span></a>
    <a class="rep-card" href="/learn/tsh-thyroid" style="text-decoration:none"><div class="aud-tag">Thyroid</div><h3 style="font-family:var(--serif);font-size:22px;margin-bottom:10px">TSH normal but still tired?</h3><p class="rep-desc" style="margin-bottom:16px">Why one thyroid number isn't the whole story.</p><span class="aud-link">Read guide →</span></a>
  </div>
</div></section>

<!-- FAQ -->
<section class="block" style="background:var(--bg-2)"><div class="wrap">
  <div class="sec-head"><span class="eyebrow">Questions</span><h2>We're glad you <span class="ital">asked.</span></h2></div>
  <div class="faq">
    <div class="faq-item open"><button class="faq-q">My bloodwork came back "normal" — so why do I still feel off?<span class="ic">+</span></button><div class="faq-a"><p>Because "normal" isn't the same as optimal. labread shows where you actually fall inside each range, what's quietly trending the wrong way, and the markers worth watching before they ever become a problem.</p></div></div>
    <div class="faq-item"><button class="faq-q">What will labread tell me that my report didn't?<span class="ic">+</span></button><div class="faq-a"><p>What each number means for your body, what's most likely driving it, and the specific next steps and questions worth raising — instead of a wall of reference ranges you have to decode alone.</p></div></div>
    <div class="faq-item"><button class="faq-q">Once I know what's off — can I actually do something about it?<span class="ic">+</span></button><div class="faq-a"><p>Yes. labread turns your results into a personalized 90-day protocol with a few simple daily habits, then tracks your streaks and progress so you can watch your markers move.</p></div></div>
    <div class="faq-item"><button class="faq-q">Will it show me if I'm actually getting better?<span class="ic">+</span></button><div class="faq-a"><p>Upload each new test and labread builds your history automatically — so you can see whether a change is a real trend, and whether what you're doing is working.</p></div></div>
  </div>
</div></section>

<!-- FINAL CTA -->
<div class="wrap"><div class="final">
  <h2>Stop guessing what your <span class="ital">numbers mean.</span></h2>
  <p>Your next blood test doesn't have to be a mystery. Get your first report in minutes.</p>
  <a class="btn btn-amber" href="/get-started">Try labread for free →</a>
  <div class="meta">50+ biomarkers · any lab · zero data stored</div>
</div></div>

<!-- FOOTER -->
<footer><div class="wrap">
  <div class="foot-grid">
    <div class="foot-brand">
      <a class="brand" href="#"><svg class="logo-mark"><use href="#lm"/></svg><span class="word">labread</span></a>
      <p>The health OS your doctor never gave you. Your blood test, finally explained.</p>
    </div>
    <div class="foot-col"><h4>Product</h4><a href="#">For individuals</a><a href="#">For doctors</a><a href="#">For labs</a><a href="#coach">Meet Anna</a></div>
    <div class="foot-col"><h4>Learn</h4><a href="/learn/ferritin">Low ferritin</a><a href="/learn/vitamin-d">Vitamin D</a><a href="/learn/tsh-thyroid">Thyroid / TSH</a><a href="/learn/crp">High CRP</a><a href="/learn/a1c">A1c</a></div>
    <div class="foot-col"><h4>Company</h4><a href="#">About</a><a href="#">Trust center</a><a href="#">Contact</a></div>
    <div class="foot-col"><h4>Legal</h4><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="#">Subprocessors</a></div>
  </div>
  <div class="foot-bottom">
    <div class="foot-badges">
      <span class="badge">HIPAA</span><span class="badge">GDPR</span><span class="badge">SOC 2</span>
    </div>
    <div class="foot-meta">© 2026 labread · hello@labread.health · X / Twitter</div>
  </div>
</div></footer>
`;

function HomePage() {
  useEffect(() => {
    // FAQ accordion
    document.querySelectorAll('.faq-q').forEach((b) => {
      b.addEventListener('click', () => b.parentElement?.classList.toggle('open'));
    });

    // Mobile menu
    const nav = document.querySelector('.nav');
    const menuBtn = document.querySelector('.menu-btn');
    const onMenu = () => nav && nav.classList.toggle('open');
    if (menuBtn) menuBtn.addEventListener('click', onMenu);
    nav?.querySelectorAll('.nav-drawer a').forEach((a) =>
      a.addEventListener('click', () => nav.classList.remove('open')),
    );

    // Dashboard scale-to-fit (keeps full laptop composition on phones)
    const DESIGN = 1040;
    const mq = window.matchMedia('(max-width:980px)');
    const fit = () => {
      const stage = document.querySelector('.dash-stage');
      if (!stage) return;
      const frame = stage.querySelector('.dash-fit') as HTMLElement | null;
      const dash = stage.querySelector('.dash') as HTMLElement | null;
      if (!frame || !dash) return;
      if (mq.matches) {
        const s = Math.min(1, stage.clientWidth / DESIGN);
        frame.style.transform = `scale(${s})`;
        frame.style.height = dash.offsetHeight * s + 'px';
      } else {
        frame.style.transform = '';
        frame.style.height = '';
      }
    };
    window.addEventListener('resize', fit);
    window.addEventListener('orientationchange', fit);
    fit();
    if (document.fonts?.ready) document.fonts.ready.then(fit);
    return () => {
      window.removeEventListener('resize', fit);
      window.removeEventListener('orientationchange', fit);
    };
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
