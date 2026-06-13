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
      { property: "og:description", content: "AI-powered medical clarity for your bloodwork." },
    ],
    links: [
      { rel: "canonical", href: "https://labread.health" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,300..700,0;1,9..144,300..700,50&family=Hanken+Grotesk:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap",
      },
    ],
  }),
  component: HomePage,
});

const html = `
<style>
/* ============================================================
   LABREAD.HEALTH — design tokens
   ink on dark ember · Fraunces / Hanken Grotesk / Plex Mono
   ============================================================ */
:root{
  --bg:#0B0907;
  --bg-2:#0F0C09;
  --surface:#151009;
  --surface-2:#1C150C;
  --line:rgba(255,180,110,.10);
  --line-2:rgba(255,180,110,.18);
  --cream:#F6EFE3;
  --cream-dim:#C9BCA8;
  --cream-mute:#8E8270;
  --ember:#FF9A3E;
  --ember-deep:#E2602C;
  --ember-soft:#FFC489;
  --glow:#FF8E2B;
  --ok:#7BD8A8;
  --warn:#F0B25C;
  --alert:#F0796A;
  --ok-bg:rgba(123,216,168,.10);
  --warn-bg:rgba(240,178,92,.10);
  --alert-bg:rgba(240,121,106,.10);
  --r-card:20px;
  --r-pill:999px;
  --font-display:"Fraunces", Georgia, serif;
  --font-body:"Hanken Grotesk", -apple-system, sans-serif;
  --font-mono:"IBM Plex Mono", ui-monospace, monospace;
  --ease:cubic-bezier(.22,1,.36,1);
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{
  background:var(--bg);
  color:var(--cream);
  font-family:var(--font-body);
  font-size:17px;
  line-height:1.6;
  -webkit-font-smoothing:antialiased;
  overflow-x:hidden;
}
::selection{background:rgba(255,154,62,.32);color:#fff}
a{color:inherit;text-decoration:none}
img{max-width:100%}
button{font:inherit;cursor:pointer;border:none;background:none;color:inherit}
:focus-visible{outline:2px solid var(--ember);outline-offset:3px;border-radius:6px}

/* ---------- grain + ambient field ---------- */
body::before{
  content:"";position:fixed;inset:0;pointer-events:none;z-index:2000;opacity:.05;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
.ambient{position:fixed;inset:0;z-index:-2;overflow:hidden;background:
  radial-gradient(1200px 800px at 80% -10%, rgba(255,142,43,.10), transparent 60%),
  radial-gradient(900px 700px at -10% 110%, rgba(226,96,44,.07), transparent 60%),
  var(--bg);}
.ambient .orb{
  position:absolute;border-radius:50%;filter:blur(90px);opacity:.5;
  animation:drift 26s var(--ease) infinite alternate;
}
.ambient .orb.a{width:560px;height:560px;right:-120px;top:-80px;
  background:radial-gradient(circle at 38% 38%, rgba(255,170,90,.50), rgba(226,96,44,.22) 55%, transparent 72%);}
.ambient .orb.b{width:420px;height:420px;left:-160px;bottom:-120px;
  background:radial-gradient(circle at 60% 40%, rgba(255,142,43,.26), transparent 70%);
  animation-duration:34s;animation-delay:-8s;}
@keyframes drift{
  0%{transform:translate(0,0) scale(1)}
  100%{transform:translate(-60px,50px) scale(1.12)}
}

/* ---------- shared layout ---------- */
.wrap{max-width:1240px;margin:0 auto;padding:0 32px}
section{position:relative;padding:130px 0}
.eyebrow{
  font-family:var(--font-mono);font-size:12px;font-weight:500;
  letter-spacing:.34em;text-transform:uppercase;color:var(--ember);
  display:flex;align-items:center;gap:14px;justify-content:center;
}
.eyebrow::before,.eyebrow::after{content:"";height:1px;width:36px;background:linear-gradient(90deg,transparent,var(--ember));opacity:.6}
.eyebrow::after{background:linear-gradient(90deg,var(--ember),transparent)}
.sec-title{
  font-family:var(--font-display);font-weight:420;
  font-size:clamp(38px,5.2vw,64px);line-height:1.06;letter-spacing:-.015em;
  text-align:center;margin:22px auto 18px;max-width:760px;
  font-variation-settings:"opsz" 90,"SOFT" 0;
}
.sec-sub{color:var(--cream-dim);text-align:center;max-width:560px;margin:0 auto;font-size:18px;font-weight:300}
.sec-title em{font-style:italic;font-variation-settings:"opsz" 144,"SOFT" 50;
  background:linear-gradient(95deg,var(--ember-soft) 10%,var(--ember) 55%,var(--ember-deep));
  -webkit-background-clip:text;background-clip:text;color:transparent;}

/* ---------- scroll reveal ---------- */
.rv{opacity:0;transform:translateY(28px);transition:opacity .9s var(--ease),transform .9s var(--ease)}
.rv.in{opacity:1;transform:none}
.rv.d1{transition-delay:.08s}.rv.d2{transition-delay:.16s}.rv.d3{transition-delay:.24s}
.rv.d4{transition-delay:.32s}.rv.d5{transition-delay:.40s}

/* ============================================================ NAV */
nav{
  position:fixed;top:0;left:0;right:0;z-index:100;
  transition:background .4s,border-color .4s,backdrop-filter .4s;
  border-bottom:1px solid transparent;
}
nav.scrolled{background:rgba(11,9,7,.78);backdrop-filter:blur(18px);border-color:var(--line)}
.nav-in{max-width:1240px;margin:0 auto;padding:18px 32px;display:flex;align-items:center;justify-content:space-between}
.logo{display:flex;align-items:center;gap:12px;font-family:var(--font-display);font-size:21px;font-weight:500;letter-spacing:-.01em}
.logo .dot{
  width:34px;height:34px;border-radius:50%;display:grid;place-items:center;
  background:radial-gradient(circle at 32% 28%, #FFD9A8, var(--ember) 52%, var(--ember-deep));
  box-shadow:0 0 22px rgba(255,142,43,.55),0 0 60px rgba(255,142,43,.25);
  font-size:14px;color:#2A1404;font-weight:600;font-family:var(--font-display);
}
.logo .tld{color:var(--cream-mute);font-weight:300}
.nav-links{display:flex;align-items:center;gap:34px;font-size:15px;font-weight:500}
.nav-links a:not(.btn){color:var(--cream-dim);transition:color .25s}
.nav-links a:not(.btn):hover{color:var(--cream)}

/* ---------- buttons ---------- */
.btn{
  display:inline-flex;align-items:center;gap:10px;
  padding:14px 28px;border-radius:var(--r-pill);
  font-weight:600;font-size:15.5px;letter-spacing:.01em;
  transition:transform .3s var(--ease),box-shadow .3s var(--ease),background .3s;
  position:relative;
}
.btn-primary{
  background:linear-gradient(120deg,#FFC07A 0%,var(--ember) 45%,var(--ember-deep) 110%);
  color:#2A1404;
  box-shadow:0 1px 0 rgba(255,255,255,.35) inset,0 10px 36px -8px rgba(255,142,43,.55);
}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 1px 0 rgba(255,255,255,.4) inset,0 18px 48px -8px rgba(255,142,43,.7)}
.btn-primary .arr{transition:transform .3s var(--ease)}
.btn-primary:hover .arr{transform:translateX(4px)}
.btn-ghost{
  border:1px solid var(--line-2);color:var(--cream);
  background:rgba(255,180,110,.03);
}
.btn-ghost:hover{border-color:rgba(255,180,110,.4);background:rgba(255,180,110,.07);transform:translateY(-2px)}
.btn-sm{padding:11px 22px;font-size:14.5px}

/* ============================================================ HERO */
.hero{padding:188px 0 90px;overflow:visible}
.hero-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:72px;align-items:center}
.hero-copy .eyebrow{justify-content:flex-start}
.hero-copy .eyebrow::after{display:none}
.hero h1{
  font-family:var(--font-display);font-weight:380;
  font-size:clamp(52px,6.6vw,92px);line-height:.98;letter-spacing:-.022em;
  margin:26px 0 30px;font-variation-settings:"opsz" 120,"SOFT" 0;
}
.hero h1 .line{display:block;overflow:hidden}
.hero h1 .line span{display:block;transform:translateY(110%);animation:rise 1.1s var(--ease) forwards}
.hero h1 .line:nth-child(2) span{animation-delay:.12s}
.hero h1 em{
  font-style:italic;font-variation-settings:"opsz" 144,"SOFT" 60;font-weight:430;
  background:linear-gradient(95deg,#FFE0B5 0%,var(--ember) 48%,var(--ember-deep) 92%);
  -webkit-background-clip:text;background-clip:text;color:transparent;
  padding-right:.06em;
}
@keyframes rise{to{transform:translateY(0)}}
.hero-sub{
  color:var(--cream-dim);font-size:19px;font-weight:300;max-width:480px;line-height:1.7;
  opacity:0;animation:fade .9s var(--ease) .5s forwards;
}
.hero-sub strong{color:var(--cream);font-weight:500}
@keyframes fade{to{opacity:1}}
.hero-cta{display:flex;gap:16px;margin:38px 0 30px;flex-wrap:wrap;
  opacity:0;animation:fade .9s var(--ease) .65s forwards;}
.trust{
  display:inline-flex;align-items:center;gap:11px;
  font-size:14px;color:var(--cream-mute);
  padding:11px 18px;border:1px solid var(--line);border-radius:var(--r-pill);
  background:rgba(255,180,110,.02);
  opacity:0;animation:fade .9s var(--ease) .8s forwards;
}
.trust svg{flex:none}

/* ----- the living report (signature) ----- */
.report-stage{position:relative;perspective:1400px}
.report-stage .halo{
  position:absolute;inset:-14% -18%;border-radius:50%;z-index:-1;
  background:radial-gradient(circle at 50% 42%, rgba(255,150,55,.34), rgba(226,96,44,.12) 48%, transparent 70%);
  filter:blur(28px);
  animation:halo 7s ease-in-out infinite alternate;
}
@keyframes halo{from{opacity:.7;transform:scale(.97)}to{opacity:1;transform:scale(1.04)}}
.report{
  position:relative;border-radius:26px;
  background:linear-gradient(165deg,rgba(36,26,16,.92),rgba(20,14,9,.96));
  border:1px solid var(--line-2);
  box-shadow:0 40px 90px -30px rgba(0,0,0,.8),0 0 0 1px rgba(255,255,255,.02) inset,0 1px 0 rgba(255,200,140,.10) inset;
  padding:28px;
  transform:rotateX(4deg) rotateY(-6deg);
  transform-style:preserve-3d;
  animation:floaty 9s ease-in-out infinite alternate;
  overflow:hidden;
}
@keyframes floaty{from{transform:rotateX(4deg) rotateY(-6deg) translateY(0)}to{transform:rotateX(2deg) rotateY(-3deg) translateY(-12px)}}
.report::after{ /* scan beam */
  content:"";position:absolute;left:0;right:0;height:90px;top:-90px;pointer-events:none;
  background:linear-gradient(180deg,transparent,rgba(255,154,62,.10) 50%,rgba(255,154,62,.22) 82%,transparent);
  animation:scan 4.6s var(--ease) infinite;
}
@keyframes scan{0%{top:-90px}70%,100%{top:110%}}
.report-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:22px}
.report-head .label{font-family:var(--font-mono);font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:var(--cream-mute)}
.report-status{
  display:inline-flex;align-items:center;gap:8px;font-family:var(--font-mono);font-size:12px;color:var(--ok);
}
.report-status .pulse{width:7px;height:7px;border-radius:50%;background:var(--ok);box-shadow:0 0 0 0 rgba(123,216,168,.5);animation:pulse 1.8s infinite}
@keyframes pulse{70%{box-shadow:0 0 0 9px rgba(123,216,168,0)}100%{box-shadow:0 0 0 0 rgba(123,216,168,0)}}
.bio-row{
  display:grid;grid-template-columns:1.1fr auto auto;align-items:center;gap:14px;
  padding:15px 16px;border-radius:14px;border:1px solid transparent;
  opacity:0;transform:translateX(-14px);
  transition:opacity .7s var(--ease),transform .7s var(--ease),background .3s,border-color .3s;
}
.bio-row.show{opacity:1;transform:none}
.bio-row:hover{background:rgba(255,180,110,.04);border-color:var(--line)}
.bio-name{display:flex;align-items:center;gap:11px;font-weight:500;font-size:15.5px}
.bio-dot{width:8px;height:8px;border-radius:50%;flex:none}
.bio-val{font-family:var(--font-mono);font-size:15px;color:var(--cream-dim);text-align:right;font-weight:500;min-width:96px}
.bio-val .u{font-size:11px;color:var(--cream-mute);margin-left:3px}
.pill{
  font-family:var(--font-mono);font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;
  padding:5px 12px;border-radius:var(--r-pill);min-width:84px;text-align:center;
  transform:scale(.6);opacity:0;transition:transform .45s cubic-bezier(.34,1.56,.64,1),opacity .35s;
}
.bio-row.show .pill{transform:scale(1);opacity:1;transition-delay:.55s}
.p-ok{color:var(--ok);background:var(--ok-bg);border:1px solid rgba(123,216,168,.25)}
.p-warn{color:var(--warn);background:var(--warn-bg);border:1px solid rgba(240,178,92,.25)}
.p-alert{color:var(--alert);background:var(--alert-bg);border:1px solid rgba(240,121,106,.25)}
.d-ok{background:var(--ok);box-shadow:0 0 10px rgba(123,216,168,.6)}
.d-warn{background:var(--warn);box-shadow:0 0 10px rgba(240,178,92,.6)}
.d-alert{background:var(--alert);box-shadow:0 0 10px rgba(240,121,106,.6)}
.report-note{
  margin-top:18px;padding:16px 18px;border-radius:14px;
  background:rgba(255,154,62,.05);border:1px solid rgba(255,154,62,.14);
  font-size:14px;color:var(--cream-dim);line-height:1.6;
  opacity:0;transform:translateY(10px);transition:all .8s var(--ease) 2.6s;
}
.report.played .report-note{opacity:1;transform:none}
.report-note b{color:var(--ember-soft);font-weight:600}
.report-note .ai{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.22em;text-transform:uppercase;color:var(--ember);display:block;margin-bottom:7px}
.chip{
  position:absolute;display:flex;align-items:center;gap:9px;
  padding:11px 17px;border-radius:var(--r-pill);
  background:rgba(24,17,11,.85);backdrop-filter:blur(10px);
  border:1px solid var(--line-2);
  font-size:13.5px;font-weight:600;font-family:var(--font-mono);
  box-shadow:0 18px 40px -12px rgba(0,0,0,.65);
  animation:chipfloat 6s ease-in-out infinite alternate;
}
.chip .bio-dot{width:7px;height:7px}
.chip.c1{top:-26px;left:-44px;animation-delay:-1s}
.chip.c2{bottom:64px;right:-52px;animation-delay:-3s}
@keyframes chipfloat{from{transform:translateY(0)}to{transform:translateY(-14px)}}

/* ============================================================ MARQUEE */
.marquee-band{padding:0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);background:rgba(255,180,110,.015)}
.marquee{overflow:hidden;padding:22px 0;mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)}
.marquee-track{display:flex;gap:54px;width:max-content;animation:scroll 36s linear infinite}
.marquee:hover .marquee-track{animation-play-state:paused}
@keyframes scroll{to{transform:translateX(-50%)}}
.mk{display:flex;align-items:center;gap:12px;font-family:var(--font-mono);font-size:13.5px;color:var(--cream-mute);white-space:nowrap}
.mk b{color:var(--cream-dim);font-weight:500}

/* ============================================================ STATS */
.stats{padding:96px 0}
.stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--line);border:1px solid var(--line);border-radius:24px;overflow:hidden}
.stat{background:var(--bg-2);padding:54px 40px;text-align:center;position:relative;transition:background .4s}
.stat:hover{background:#120D08}
.stat .num{
  font-family:var(--font-display);font-size:clamp(48px,5vw,72px);font-weight:380;line-height:1;
  font-variation-settings:"opsz" 110;letter-spacing:-.02em;
  background:linear-gradient(120deg,var(--cream) 30%,var(--ember-soft));
  -webkit-background-clip:text;background-clip:text;color:transparent;
}
.stat .lbl{margin-top:12px;color:var(--cream-mute);font-size:15px;font-weight:300}

/* ============================================================ SAMPLE REPORT */
.cards-4{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-top:64px}
.bcard{
  background:linear-gradient(170deg,var(--surface),var(--bg-2));
  border:1px solid var(--line);border-radius:var(--r-card);
  padding:30px 26px;position:relative;overflow:hidden;
  transition:transform .45s var(--ease),border-color .45s,box-shadow .45s;
}
.bcard::before{
  content:"";position:absolute;inset:0;opacity:0;transition:opacity .45s;
  background:radial-gradient(420px 200px at var(--mx,50%) -20%, rgba(255,154,62,.12), transparent 70%);
}
.bcard:hover{transform:translateY(-7px);border-color:var(--line-2);box-shadow:0 28px 56px -22px rgba(0,0,0,.7)}
.bcard:hover::before{opacity:1}
.bcard-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px}
.bcard h3{font-family:var(--font-display);font-size:22px;font-weight:480;display:flex;align-items:center;gap:10px}
.bcard .val{font-family:var(--font-mono);font-size:26px;font-weight:500;letter-spacing:-.01em;margin-bottom:14px}
.bcard .val .u{font-size:13px;color:var(--cream-mute);font-weight:400}
.bcard p{font-size:14.5px;color:var(--cream-dim);line-height:1.65;font-weight:300}
.bar{height:5px;border-radius:99px;background:rgba(255,255,255,.06);margin:18px 0 6px;position:relative;overflow:visible}
.bar .fill{position:absolute;inset:0;border-radius:99px;transform-origin:left;transform:scaleX(0);transition:transform 1.3s var(--ease) .3s}
.in .bar .fill{transform:scaleX(var(--p))}
.bar .tick{position:absolute;top:-3.5px;width:2px;height:12px;background:rgba(255,255,255,.22);border-radius:2px}
.range-lbl{display:flex;justify-content:space-between;font-family:var(--font-mono);font-size:10.5px;color:var(--cream-mute);letter-spacing:.04em}
.center-cta{display:flex;justify-content:center;margin-top:56px}

/* ============================================================ HOW IT WORKS */
.how{background:
  radial-gradient(800px 400px at 50% 0%, rgba(255,142,43,.05), transparent 70%);}
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:72px;position:relative}
.steps::before{ /* connective beam */
  content:"";position:absolute;top:43px;left:12%;right:12%;height:1px;z-index:0;
  background:linear-gradient(90deg,transparent,var(--ember) 25%,var(--ember) 75%,transparent);
  opacity:.35;
}
.step{position:relative;z-index:1;text-align:center;padding:0 18px}
.step .orb{
  width:86px;height:86px;margin:0 auto 30px;border-radius:50%;
  display:grid;place-items:center;position:relative;
  background:linear-gradient(160deg,var(--surface-2),var(--surface));
  border:1px solid var(--line-2);
  box-shadow:0 18px 40px -16px rgba(0,0,0,.7);
  transition:transform .45s var(--ease),box-shadow .45s;
}
.step:hover .orb{transform:translateY(-6px) scale(1.04);box-shadow:0 24px 50px -16px rgba(255,142,43,.25)}
.step .orb svg{width:32px;height:32px;stroke:var(--ember);fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
.step .k{
  position:absolute;top:-9px;right:-9px;width:28px;height:28px;border-radius:50%;
  background:linear-gradient(140deg,#FFC07A,var(--ember-deep));color:#2A1404;
  font-family:var(--font-mono);font-size:12px;font-weight:600;display:grid;place-items:center;
}
.step h3{font-family:var(--font-display);font-size:27px;font-weight:480;margin-bottom:12px}
.step p{color:var(--cream-dim);font-size:15.5px;font-weight:300;max-width:280px;margin:0 auto}

/* ============================================================ WHY */
.why-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:64px}
.why-card{
  background:linear-gradient(170deg,var(--surface),var(--bg-2));
  border:1px solid var(--line);border-radius:var(--r-card);
  padding:34px 30px;transition:transform .45s var(--ease),border-color .45s;
  position:relative;overflow:hidden;
}
.why-card::after{
  content:"";position:absolute;left:30px;right:30px;bottom:0;height:1px;
  background:linear-gradient(90deg,var(--ember),transparent);
  transform:scaleX(0);transform-origin:left;transition:transform .5s var(--ease);
}
.why-card:hover{transform:translateY(-6px);border-color:var(--line-2)}
.why-card:hover::after{transform:scaleX(1)}
.why-icon{
  width:50px;height:50px;border-radius:14px;display:grid;place-items:center;margin-bottom:24px;
  background:rgba(255,154,62,.08);border:1px solid rgba(255,154,62,.16);
}
.why-icon svg{width:23px;height:23px;stroke:var(--ember);fill:none;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
.why-card h3{font-family:var(--font-display);font-size:23px;font-weight:500;margin-bottom:10px}
.why-card p{color:var(--cream-dim);font-size:15px;font-weight:300;line-height:1.65}

/* ============================================================ QUOTES */
.quotes{padding:110px 0}
.q-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:60px}
.q-card{
  border:1px solid var(--line);border-radius:var(--r-card);
  background:linear-gradient(170deg,var(--surface),transparent);
  padding:40px 38px;position:relative;
}
.q-card .mark{
  font-family:var(--font-display);font-size:84px;line-height:0;color:var(--ember);opacity:.4;
  position:absolute;top:46px;left:32px;font-style:italic;
}
.q-card blockquote{
  font-family:var(--font-display);font-style:italic;font-variation-settings:"opsz" 60,"SOFT" 40;
  font-size:24px;font-weight:380;line-height:1.42;padding-left:46px;letter-spacing:-.005em;
}
.q-card cite{
  display:flex;align-items:center;gap:12px;margin-top:26px;padding-left:46px;
  font-style:normal;font-size:14px;color:var(--cream-mute);
}
.q-card cite .ava{
  width:34px;height:34px;border-radius:50%;display:grid;place-items:center;
  font-family:var(--font-display);font-size:14px;color:#2A1404;font-weight:600;
  background:linear-gradient(140deg,#FFD9A8,var(--ember));
}

/* ============================================================ LEARN */
.learn-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:64px}
.l-card{
  border:1px solid var(--line);border-radius:var(--r-card);
  background:linear-gradient(170deg,var(--surface),var(--bg-2));
  padding:32px 30px;display:flex;flex-direction:column;gap:14px;
  transition:transform .45s var(--ease),border-color .45s;
}
.l-card:hover{transform:translateY(-6px);border-color:var(--line-2)}
.l-tag{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.26em;text-transform:uppercase;color:var(--ember)}
.l-card h3{font-family:var(--font-display);font-size:23px;font-weight:500;line-height:1.25}
.l-card p{color:var(--cream-dim);font-size:14.5px;font-weight:300;flex:1}
.l-link{display:inline-flex;align-items:center;gap:8px;color:var(--ember);font-weight:600;font-size:14.5px}
.l-link .arr{transition:transform .3s var(--ease)}
.l-card:hover .l-link .arr{transform:translateX(5px)}

/* ============================================================ FINAL CTA */
.final{padding:160px 0 150px;text-align:center;overflow:hidden}
.final .sun{
  position:absolute;left:50%;bottom:-340px;transform:translateX(-50%);
  width:820px;height:820px;border-radius:50%;z-index:-1;
  background:radial-gradient(circle at 50% 38%, rgba(255,190,110,.5), rgba(255,142,43,.25) 42%, rgba(226,96,44,.08) 62%, transparent 74%);
  filter:blur(8px);
  animation:sunrise 10s ease-in-out infinite alternate;
}
@keyframes sunrise{from{transform:translateX(-50%) translateY(0)}to{transform:translateX(-50%) translateY(-28px)}}
.final h2{
  font-family:var(--font-display);font-weight:400;
  font-size:clamp(44px,6vw,80px);line-height:1.04;letter-spacing:-.02em;max-width:820px;margin:24px auto 22px;
}
.final h2 em{font-style:italic;font-variation-settings:"opsz" 144,"SOFT" 55;
  background:linear-gradient(95deg,#FFE0B5,var(--ember) 55%,var(--ember-deep));
  -webkit-background-clip:text;background-clip:text;color:transparent;}
.final p{color:var(--cream-dim);font-size:18px;font-weight:300;max-width:480px;margin:0 auto 44px}
.final .micro{margin-top:26px;font-family:var(--font-mono);font-size:12.5px;color:var(--cream-mute);letter-spacing:.06em}

/* ============================================================ FOOTER */
footer{border-top:1px solid var(--line);padding:54px 0 44px;background:rgba(0,0,0,.25)}
.f-in{display:flex;align-items:center;justify-content:space-between;gap:28px;flex-wrap:wrap}
.f-links{display:flex;gap:30px;font-size:14.5px;color:var(--cream-mute)}
.f-links a:hover{color:var(--cream)}
.f-note{width:100%;margin-top:30px;padding-top:26px;border-top:1px solid var(--line);
  font-size:12.5px;color:var(--cream-mute);line-height:1.7;font-weight:300;max-width:720px}

/* ============================================================ RESPONSIVE */
@media(max-width:1020px){
  .hero-grid{grid-template-columns:1fr;gap:80px}
  .report{transform:none;animation:none;max-width:560px;margin:0 auto}
  .chip.c1{left:0}.chip.c2{right:0}
  .cards-4{grid-template-columns:repeat(2,1fr)}
  .why-grid,.learn-grid{grid-template-columns:repeat(2,1fr)}
  .steps{grid-template-columns:1fr;gap:56px}
  .steps::before{display:none}
}
@media(max-width:680px){
  section{padding:90px 0}
  .wrap{padding:0 22px}
  .hero{padding-top:140px}
  .nav-links a:not(.btn){display:none}
  .cards-4,.why-grid,.learn-grid,.q-grid{grid-template-columns:1fr}
  .stats-grid{grid-template-columns:1fr}
  .q-card blockquote{font-size:21px}
  .chip{display:none}
}
@media(prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}
  .hero h1 .line span{transform:none}
  .hero-sub,.hero-cta,.trust{opacity:1}
  .rv{opacity:1;transform:none}
  .bio-row{opacity:1;transform:none}
  .bio-row .pill{opacity:1;transform:none}
  .report-note{opacity:1;transform:none}
}
</style>

<div class="ambient" aria-hidden="true">
  <div class="orb a"></div>
  <div class="orb b"></div>
</div>

<!-- ====================== NAV ====================== -->
<nav id="nav">
  <div class="nav-in">
    <a href="/" class="logo"><span class="dot">l</span>labread<span class="tld">.health</span></a>
    <div class="nav-links">
      <a href="#how">How it works</a>
      <a href="#learn">Learn</a>
      <a href="/auth">Sign in</a>
      <a href="/try-free" class="btn btn-primary btn-sm">Try for free</a>
    </div>
  </div>
</nav>

<!-- ====================== HERO ====================== -->
<header class="hero">
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <div class="eyebrow">AI-powered medical clarity</div>
      <h1>
        <span class="line"><span>Your blood test,</span></span>
        <span class="line"><span><em>finally explained.</em></span></span>
      </h1>
      <p class="hero-sub">Paste your numbers. We tell you <strong>what's normal, what's not,</strong> and what to ask your doctor. Plain English. In a minute.</p>
      <div class="hero-cta">
        <a href="/try-free" class="btn btn-primary">Try for free <span class="arr">→</span></a>
        <a href="#sample" class="btn btn-ghost">See a sample report</a>
      </div>
      <div class="trust">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7BD8A8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
        Your data is never stored. Processed, then immediately deleted. HIPAA-compliant.
      </div>
    </div>

    <!-- signature: the living report -->
    <div class="report-stage">
      <div class="halo" aria-hidden="true"></div>
      <div class="chip c1" aria-hidden="true"><span class="bio-dot d-ok"></span>B12 <b>540</b> ✓</div>
      <div class="chip c2" aria-hidden="true"><span class="bio-dot d-ok"></span>Glucose <b>89</b> ✓</div>
      <div class="report" id="report" aria-label="Animated sample of a labread report being generated">
        <div class="report-head">
          <span class="label">Live analysis</span>
          <span class="report-status"><span class="pulse"></span><span id="status-text">Reading values…</span></span>
        </div>
        <div class="bio-row" data-delay="200">
          <span class="bio-name"><span class="bio-dot d-warn"></span>Ferritin</span>
          <span class="bio-val"><span class="n" data-to="18">0</span><span class="u">ng/mL</span></span>
          <span class="pill p-warn">Low</span>
        </div>
        <div class="bio-row" data-delay="600">
          <span class="bio-name"><span class="bio-dot d-warn"></span>Vitamin D</span>
          <span class="bio-val"><span class="n" data-to="22">0</span><span class="u">ng/mL</span></span>
          <span class="pill p-warn">Low</span>
        </div>
        <div class="bio-row" data-delay="1000">
          <span class="bio-name"><span class="bio-dot d-ok"></span>TSH</span>
          <span class="bio-val"><span class="n" data-to="2.1" data-dec="1">0</span><span class="u">mIU/L</span></span>
          <span class="pill p-ok">Normal</span>
        </div>
        <div class="bio-row" data-delay="1400">
          <span class="bio-name"><span class="bio-dot d-alert"></span>CRP</span>
          <span class="bio-val"><span class="n" data-to="4.2" data-dec="1">0</span><span class="u">mg/L</span></span>
          <span class="pill p-alert">Elevated</span>
        </div>
        <div class="report-note">
          <span class="ai">labread insight</span>
          Your <b>iron stores are running low</b> — a common cause of fatigue and brain fog. Worth asking your doctor about an iron panel, alongside what's driving the mild inflammation.
        </div>
      </div>
    </div>
  </div>
</header>

<!-- ====================== MARQUEE ====================== -->
<div class="marquee-band" aria-hidden="true">
  <div class="marquee">
    <div class="marquee-track" id="mtrack">
      <span class="mk"><span class="bio-dot d-ok"></span>Hemoglobin <b>14.2</b></span>
      <span class="mk"><span class="bio-dot d-ok"></span>HDL <b>62</b></span>
      <span class="mk"><span class="bio-dot d-warn"></span>LDL <b>131</b></span>
      <span class="mk"><span class="bio-dot d-ok"></span>A1c <b>5.3%</b></span>
      <span class="mk"><span class="bio-dot d-ok"></span>ALT <b>24</b></span>
      <span class="mk"><span class="bio-dot d-warn"></span>Ferritin <b>18</b></span>
      <span class="mk"><span class="bio-dot d-ok"></span>Creatinine <b>0.9</b></span>
      <span class="mk"><span class="bio-dot d-alert"></span>CRP <b>4.2</b></span>
      <span class="mk"><span class="bio-dot d-ok"></span>B12 <b>540</b></span>
      <span class="mk"><span class="bio-dot d-ok"></span>TSH <b>2.1</b></span>
      <span class="mk"><span class="bio-dot d-warn"></span>Vitamin D <b>22</b></span>
      <span class="mk"><span class="bio-dot d-ok"></span>Glucose <b>89</b></span>
    </div>
  </div>
</div>

<!-- ====================== STATS ====================== -->
<section class="stats">
  <div class="wrap">
    <div class="stats-grid rv">
      <div class="stat"><div class="num">50+</div><div class="lbl">biomarkers explained</div></div>
      <div class="stat"><div class="num">Minutes</div><div class="lbl">to your full report</div></div>
      <div class="stat"><div class="num">Free</div><div class="lbl">no card needed</div></div>
    </div>
  </div>
</section>

<!-- ====================== SAMPLE REPORT ====================== -->
<section id="sample">
  <div class="wrap">
    <div class="eyebrow rv">Sample report</div>
    <h2 class="sec-title rv d1">Here's what your <em>report</em> looks like</h2>
    <p class="sec-sub rv d2">Every value placed on its real medical range — so you can see at a glance where you stand.</p>

    <div class="cards-4">
      <div class="bcard rv">
        <div class="bcard-top">
          <h3><span class="bio-dot d-warn"></span>Ferritin</h3>
          <span class="pill p-warn" style="transform:none;opacity:1">Low</span>
        </div>
        <div class="val">18 <span class="u">ng/mL</span></div>
        <div class="bar"><div class="fill" style="--p:.16;background:linear-gradient(90deg,var(--warn),#C98A3E)"></div><span class="tick" style="left:25%"></span><span class="tick" style="left:80%"></span></div>
        <div class="range-lbl"><span>0</span><span>optimal 30–150</span><span>300</span></div>
        <p>Your iron stores are running low — a common cause of fatigue, brain fog, and feeling cold.</p>
      </div>
      <div class="bcard rv d1">
        <div class="bcard-top">
          <h3><span class="bio-dot d-warn"></span>Vitamin D</h3>
          <span class="pill p-warn" style="transform:none;opacity:1">Low</span>
        </div>
        <div class="val">22 <span class="u">ng/mL</span></div>
        <div class="bar"><div class="fill" style="--p:.27;background:linear-gradient(90deg,var(--warn),#C98A3E)"></div><span class="tick" style="left:37%"></span><span class="tick" style="left:75%"></span></div>
        <div class="range-lbl"><span>0</span><span>optimal 30–60</span><span>80</span></div>
        <p>Below the optimal range — often linked to low energy, low mood, and weaker immunity.</p>
      </div>
      <div class="bcard rv d2">
        <div class="bcard-top">
          <h3><span class="bio-dot d-ok"></span>TSH</h3>
          <span class="pill p-ok" style="transform:none;opacity:1">Normal</span>
        </div>
        <div class="val">2.1 <span class="u">mIU/L</span></div>
        <div class="bar"><div class="fill" style="--p:.42;background:linear-gradient(90deg,var(--ok),#4FA87C)"></div><span class="tick" style="left:9%"></span><span class="tick" style="left:80%"></span></div>
        <div class="range-lbl"><span>0</span><span>normal 0.4–4.0</span><span>5</span></div>
        <p>Your thyroid signal is in range — though one number doesn't capture the full thyroid picture.</p>
      </div>
      <div class="bcard rv d3">
        <div class="bcard-top">
          <h3><span class="bio-dot d-alert"></span>CRP</h3>
          <span class="pill p-alert" style="transform:none;opacity:1">Elevated</span>
        </div>
        <div class="val">4.2 <span class="u">mg/L</span></div>
        <div class="bar"><div class="fill" style="--p:.62;background:linear-gradient(90deg,var(--alert),#C04E40)"></div><span class="tick" style="left:14%"></span><span class="tick" style="left:43%"></span></div>
        <div class="range-lbl"><span>0</span><span>low risk &lt;1 · avg 1–3</span><span>7</span></div>
        <p>A marker of inflammation that's mildly raised — worth understanding what's driving it.</p>
      </div>
    </div>

    <div class="center-cta rv"><a href="/try-free" class="btn btn-primary">Get yours free <span class="arr">→</span></a></div>
  </div>
</section>

<!-- ====================== HOW IT WORKS ====================== -->
<section class="how" id="how">
  <div class="wrap">
    <div class="eyebrow rv">How it works</div>
    <h2 class="sec-title rv d1">Three steps to <em>clarity.</em></h2>

    <div class="steps">
      <div class="step rv">
        <div class="orb">
          <span class="k">01</span>
          <svg viewBox="0 0 24 24"><path d="M12 16V4m0 0 4 4m-4-4L8 8"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/></svg>
        </div>
        <h3>Upload</h3>
        <p>Drop a PDF or snap a photo of your lab report. Any lab, any language.</p>
      </div>
      <div class="step rv d1">
        <div class="orb">
          <span class="k">02</span>
          <svg viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0-6 6c0 2 .7 3.1 1.6 4.2.7.9 1.4 1.8 1.4 3.3h6c0-1.5.7-2.4 1.4-3.3C17.3 12.1 18 11 18 9a6 6 0 0 0-6-6z"/><path d="M9.5 20.5h5M10.5 23h3"/></svg>
        </div>
        <h3>Analyze</h3>
        <p>Our AI reads every value and references it against real medical ranges.</p>
      </div>
      <div class="step rv d2">
        <div class="orb">
          <span class="k">03</span>
          <svg viewBox="0 0 24 24"><path d="M3 12h4l2.5-7 4 14 2.5-7h5"/></svg>
        </div>
        <h3>Understand</h3>
        <p>Get plain-language explanations and screening guidance you can act on.</p>
      </div>
    </div>
  </div>
</section>

<!-- ====================== WHY ====================== -->
<section>
  <div class="wrap">
    <div class="eyebrow rv">Why labread</div>
    <h2 class="sec-title rv d1">Built for clarity.<br><em>Designed for you.</em></h2>

    <div class="why-grid">
      <div class="why-card rv">
        <div class="why-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z"/></svg></div>
        <h3>Any lab, any country</h3>
        <p>Bloodwork, panels, hormones — we read them all, in any language and any unit system.</p>
      </div>
      <div class="why-card rv d1">
        <div class="why-icon"><svg viewBox="0 0 24 24"><path d="M12 4a4 4 0 0 0-4 4c-2 .5-3 2-3 4a4 4 0 0 0 4 4h.5M12 4a4 4 0 0 1 4 4c2 .5 3 2 3 4a4 4 0 0 1-4 4h-.5M12 4v16"/></svg></div>
        <h3>Plain-language insights</h3>
        <p>No jargon. Just what each value means for your body, today.</p>
      </div>
      <div class="why-card rv d2">
        <div class="why-icon"><svg viewBox="0 0 24 24"><path d="M3 12h4l2.5-7 4 14 2.5-7h5"/></svg></div>
        <h3>Flagged automatically</h3>
        <p>Color-coded results so abnormal values are impossible to miss.</p>
      </div>
      <div class="why-card rv">
        <div class="why-icon"><svg viewBox="0 0 24 24"><path d="M5 4v6a7 7 0 0 0 14 0V4"/><path d="M5 4h2M17 4h2M12 17v2a3 3 0 0 0 3 3h0a3 3 0 0 0 3-3v-1"/><circle cx="18" cy="17" r="1.6"/></svg></div>
        <h3>Screening recommendations</h3>
        <p>Personalized next steps and tests worth discussing with your doctor.</p>
      </div>
      <div class="why-card rv d1">
        <div class="why-icon"><svg viewBox="0 0 24 24"><path d="M7 3h8l4 4v14H7zM15 3v4h4"/><path d="M10 12h6M10 16h6"/></svg></div>
        <h3>Beautiful history</h3>
        <p>Every report saved, searchable, and easy to compare over time.</p>
      </div>
      <div class="why-card rv d2">
        <div class="why-icon"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg></div>
        <h3>Zero data stored</h3>
        <p>Your results are processed and immediately deleted. Nothing is saved. HIPAA-compliant.</p>
      </div>
    </div>
  </div>
</section>

<!-- ====================== QUOTES ====================== -->
<section class="quotes">
  <div class="wrap">
    <div class="eyebrow rv">What people say</div>
    <div class="q-grid">
      <div class="q-card rv">
        <span class="mark">"</span>
        <blockquote>Useful and actually explains my blood test in language I can understand.</blockquote>
        <cite><span class="ava">A</span>Alix</cite>
      </div>
      <div class="q-card rv d1">
        <span class="mark">"</span>
        <blockquote>I finally understand my blood test.</blockquote>
        <cite><span class="ava">R</span>Rechi</cite>
      </div>
    </div>
  </div>
</section>

<!-- ====================== LEARN ====================== -->
<section id="learn">
  <div class="wrap">
    <div class="eyebrow rv">Learn</div>
    <h2 class="sec-title rv d1">Understand your <em>results.</em></h2>
    <p class="sec-sub rv d2">Plain-English guides to the biomarkers people ask about most — what the numbers mean, and what to do next.</p>

    <div class="learn-grid">
      <a href="/learn/ferritin" class="l-card rv">
        <span class="l-tag">Iron</span>
        <h3>What Does Low Ferritin Mean?</h3>
        <p>Iron deficiency, explained in plain English.</p>
        <span class="l-link">Read guide <span class="arr">→</span></span>
      </a>
      <a href="/learn/vitamin-d" class="l-card rv d1">
        <span class="l-tag">Vitamins</span>
        <h3>Vitamin D Deficiency Explained</h3>
        <p>Why "normal" and "optimal" are far apart.</p>
        <span class="l-link">Read guide <span class="arr">→</span></span>
      </a>
      <a href="/learn/tsh-thyroid" class="l-card rv d2">
        <span class="l-tag">Thyroid</span>
        <h3>TSH Normal But Still Tired?</h3>
        <p>Why one thyroid number isn't the whole story.</p>
        <span class="l-link">Read guide <span class="arr">→</span></span>
      </a>
      <a href="/learn/crp" class="l-card rv">
        <span class="l-tag">Inflammation</span>
        <h3>What Does High CRP Mean?</h3>
        <p>The quiet inflammation marker most people overlook.</p>
        <span class="l-link">Read guide <span class="arr">→</span></span>
      </a>
      <a href="/learn/a1c" class="l-card rv d1">
        <span class="l-tag">Metabolic</span>
        <h3>What Is Pre-Diabetic A1c?</h3>
        <p>The window where changes matter most.</p>
        <span class="l-link">Read guide <span class="arr">→</span></span>
      </a>
      <a href="#learn" class="l-card rv d2">
        <span class="l-tag">Coming soon</span>
        <h3>50+ more biomarkers</h3>
        <p>New plain-English guides every week.</p>
        <span class="l-link">Browse all <span class="arr">→</span></span>
      </a>
    </div>
  </div>
</section>

<!-- ====================== FINAL CTA ====================== -->
<section class="final">
  <div class="sun" aria-hidden="true"></div>
  <div class="wrap">
    <div class="eyebrow rv">Free · No card needed</div>
    <h2 class="rv d1">Stop guessing what your <em>numbers mean.</em></h2>
    <p class="rv d2">Your next blood test doesn't have to be a mystery. Get your first report in minutes.</p>
    <div class="rv d3"><a href="/try-free" class="btn btn-primary" style="padding:18px 40px;font-size:17px">Try labread for free <span class="arr">→</span></a></div>
    <div class="micro rv d4">50+ biomarkers · any lab · zero data stored</div>
  </div>
</section>

<!-- ====================== FOOTER ====================== -->
<footer>
  <div class="wrap f-in">
    <a href="/" class="logo" style="font-size:18px"><span class="dot" style="width:28px;height:28px;font-size:12px">l</span>labread<span class="tld">.health</span></a>
    <div class="f-links">
      <a href="#how">How it works</a>
      <a href="#learn">Learn</a>
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
      <a href="https://x.com/labread_health" target="_blank" rel="noopener">X / Twitter</a>
    </div>
    <p class="f-note">labread.health provides educational information about laboratory values and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult your doctor about your results. © 2026 labread.health</p>
  </div>
</footer>
`;

function HomePage() {
  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const observers: IntersectionObserver[] = [];

    /* ---------- nav scroll state ---------- */
    const nav = document.getElementById("nav");
    const onScroll = () => nav?.classList.toggle("scrolled", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    /* ---------- scroll reveals ---------- */
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.18, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".rv").forEach((el) => io.observe(el));
    observers.push(io);

    /* ---------- count-up helper ---------- */
    function count(el: Element, to: number, dec: number, dur = 900) {
      const t0 = performance.now();
      function tick(t: number) {
        const p = Math.min(1, (t - t0) / dur),
          e = 1 - Math.pow(1 - p, 3);
        el.textContent = (to * e).toFixed(dec);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    /* ---------- living report sequence ---------- */
    const report = document.getElementById("report");
    const statusText = document.getElementById("status-text");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    function playReport() {
      if (!report || !statusText) return;
      if (reduce) {
        report.querySelectorAll(".n").forEach((n) => {
          n.textContent = (n as HTMLElement).dataset.to ?? "";
        });
        report.classList.add("played");
        statusText.textContent = "Report ready";
        return;
      }
      report.querySelectorAll<HTMLElement>(".bio-row").forEach((row) => {
        timeouts.push(
          setTimeout(() => {
            row.classList.add("show");
            const n = row.querySelector<HTMLElement>(".n");
            if (n) count(n, parseFloat(n.dataset.to ?? "0"), parseInt(n.dataset.dec ?? "0"));
          }, parseInt(row.dataset.delay ?? "0"))
        );
      });
      timeouts.push(
        setTimeout(() => {
          statusText.textContent = "Generating insight…";
        }, 1900)
      );
      timeouts.push(
        setTimeout(() => {
          report.classList.add("played");
          statusText.textContent = "Report ready";
        }, 2700)
      );
    }
    if (report) {
      const ro = new IntersectionObserver(
        (es, o) => {
          if (es[0].isIntersecting) {
            playReport();
            o.disconnect();
          }
        },
        { threshold: 0.35 }
      );
      ro.observe(report);
      observers.push(ro);
    }

    /* ---------- duplicate marquee for seamless loop (idempotent) ---------- */
    const track = document.getElementById("mtrack");
    if (track && !track.dataset.duplicated) {
      track.innerHTML += track.innerHTML;
      track.dataset.duplicated = "1";
    }

    /* ---------- card glow follows cursor ---------- */
    const glowHandlers: Array<{ el: HTMLElement; fn: (e: PointerEvent) => void }> = [];
    document.querySelectorAll<HTMLElement>(".bcard").forEach((c) => {
      const fn = (e: PointerEvent) => {
        const r = c.getBoundingClientRect();
        c.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
      };
      c.addEventListener("pointermove", fn);
      glowHandlers.push({ el: c, fn });
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observers.forEach((o) => o.disconnect());
      timeouts.forEach((t) => clearTimeout(t));
      glowHandlers.forEach(({ el, fn }) => el.removeEventListener("pointermove", fn));
    };
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
