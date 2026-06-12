import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "labread.health — We explain your blood test like a friend who went to med school",
      },
      {
        name: "description",
        content:
          "Upload your lab report. labread circles what matters, explains it in plain English, and tells you what to ask your doctor.",
      },
      {
        property: "og:title",
        content: "labread.health — Your blood test, finally explained.",
      },
      { property: "og:description", content: "AI-powered medical clarity for your bloodwork." },
    ],
    links: [
      { rel: "canonical", href: "https://labread.health" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Caveat:wght@500;600&display=swap",
      },
    ],
  }),
  component: HomePage,
});

const html = `
<style>
/* ════════════════════════════════════════════════════════════
   LABREAD — "THE ANNOTATED REPORT"
   paper · ink · specimen red · marker yellow · stamp green
   Instrument Serif / Atkinson Hyperlegible / Space Mono / Caveat
   ════════════════════════════════════════════════════════════ */
:root{
  --paper:#FAF6EE;
  --paper-2:#F3EDE0;
  --paper-3:#ECE4D2;
  --ink:#1C1813;
  --ink-2:#4A443B;
  --ink-3:#8A8275;
  --rule:#D9D0BD;
  --red:#D5402F;
  --red-deep:#A92A1C;
  --red-soft:#F3D5CE;
  --hi:#FFE45E;
  --green:#1E7A5A;
  --green-soft:#D9EBDF;
  --amber:#C97A12;
  --amber-soft:#F6E7C8;
  --serif:"Instrument Serif", Georgia, serif;
  --body:"Atkinson Hyperlegible", -apple-system, sans-serif;
  --mono:"Space Mono", ui-monospace, monospace;
  --hand:"Caveat", cursive;
  --ease:cubic-bezier(.22,1,.36,1);
  --shadow-paper:0 1px 2px rgba(28,24,19,.06),0 12px 40px -12px rgba(28,24,19,.18);
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{
  background:var(--paper);
  color:var(--ink);
  font-family:var(--body);
  font-size:17.5px;
  line-height:1.6;
  -webkit-font-smoothing:antialiased;
  overflow-x:hidden;
}
/* paper fiber */
body::before{
  content:"";position:fixed;inset:0;pointer-events:none;z-index:3000;opacity:.35;mix-blend-mode:multiply;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.85 0 0 0 0 0.82 0 0 0 0 0.74 0 0 0 0.06 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23p)'/%3E%3C/svg%3E");
}
::selection{background:var(--hi);color:var(--ink)}
a{color:inherit;text-decoration:none}
button{font:inherit;cursor:pointer;border:none;background:none;color:inherit}
:focus-visible{outline:2.5px solid var(--red);outline-offset:3px;border-radius:4px}

.wrap{max-width:1180px;margin:0 auto;padding:0 32px}
section{position:relative;padding:120px 0}

/* ---------- type system ---------- */
.eyebrow{
  font-family:var(--mono);font-size:11.5px;font-weight:700;letter-spacing:.32em;text-transform:uppercase;
  color:var(--red);display:flex;align-items:center;gap:12px;
}
.eyebrow .box{width:13px;height:13px;border:1.8px solid var(--red);display:inline-grid;place-items:center;flex:none}
.eyebrow .box::after{content:"✕";font-size:8px;line-height:1}
.sec-title{
  font-family:var(--serif);font-weight:400;font-size:clamp(40px,5.4vw,68px);
  line-height:1.02;letter-spacing:-.01em;margin:20px 0 18px;
}
.sec-title em{font-style:italic;color:var(--red)}
.sec-sub{color:var(--ink-2);max-width:540px;font-size:18px}

/* ---------- reveal ---------- */
.rv{opacity:0;transform:translateY(26px);transition:opacity .85s var(--ease),transform .85s var(--ease)}
.rv.in{opacity:1;transform:none}
.rv.d1{transition-delay:.08s}.rv.d2{transition-delay:.16s}.rv.d3{transition-delay:.24s}.rv.d4{transition-delay:.32s}

/* ---------- buttons ---------- */
.btn{
  display:inline-flex;align-items:center;gap:10px;padding:15px 28px;
  font-family:var(--mono);font-weight:700;font-size:14px;letter-spacing:.04em;text-transform:uppercase;
  border:2px solid var(--ink);position:relative;background:var(--paper);
  box-shadow:4px 4px 0 var(--ink);
  transition:transform .18s var(--ease),box-shadow .18s var(--ease),background .18s;
}
.btn:hover{transform:translate(-2px,-2px);box-shadow:7px 7px 0 var(--ink)}
.btn:active{transform:translate(2px,2px);box-shadow:1px 1px 0 var(--ink)}
.btn-red{background:var(--red);border-color:var(--ink);color:#FFF8EE}
.btn-red:hover{background:var(--red-deep)}

/* ════════════════════ SPECIMEN TOP STRIP ════════════════════ */
.specimen{
  background:var(--ink);color:var(--paper);
  font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;
  padding:9px 0;overflow:hidden;white-space:nowrap;
}
.specimen .track{display:inline-flex;gap:46px;animation:tick 30s linear infinite;width:max-content}
@keyframes tick{to{transform:translateX(-50%)}}
.specimen b{color:var(--hi);font-weight:700}
.specimen .sep{color:var(--red);font-weight:700}

/* ════════════════════ NAV ════════════════════ */
nav{
  position:sticky;top:0;z-index:100;background:rgba(250,246,238,.92);backdrop-filter:blur(10px);
  border-bottom:2px solid var(--ink);
}
.nav-in{max-width:1180px;margin:0 auto;padding:16px 32px;display:flex;align-items:center;justify-content:space-between;gap:20px}
.logo{display:inline-flex;align-items:center;gap:14px;font-family:var(--serif);line-height:1;letter-spacing:-.01em;color:var(--ink)}
.logo .seal{width:46px;height:46px;flex:none;transition:transform .4s var(--ease)}
.logo:hover .seal{transform:rotate(-8deg)}
.logo .wm{display:inline-flex;align-items:baseline;gap:4px;font-size:26px;font-weight:400}
.logo .wm .dropsep{width:10px;height:13px;flex:none;align-self:center;transform:translateY(2px);transition:transform .6s var(--ease)}
.logo:hover .wm .dropsep{animation:fall .9s var(--ease)}
@keyframes fall{
  0%{transform:translateY(2px)}
  55%{transform:translateY(11px);opacity:0}
  56%{transform:translateY(-6px);opacity:0}
  100%{transform:translateY(2px);opacity:1}
}
.logo .wm .tld{font-style:italic;color:var(--ink-3);font-weight:400;font-size:.92em;letter-spacing:0}
.logo.sm .seal{width:36px;height:36px}
.logo.sm .wm{font-size:21px}
.logo.sm .wm .dropsep{width:8px;height:10px}
.nav-links{display:flex;align-items:center;gap:30px;font-family:var(--mono);font-size:13px;font-weight:700;letter-spacing:.05em;text-transform:uppercase}
.nav-links a:not(.btn){border-bottom:2px solid transparent;padding-bottom:2px;transition:border-color .2s}
.nav-links a:not(.btn):hover{border-color:var(--red)}
.nav-links .btn{padding:10px 20px;font-size:12.5px;box-shadow:3px 3px 0 var(--ink)}

/* ════════════════════ HERO ════════════════════ */
.hero{padding:96px 0 70px;text-align:center}
.hero h1{
  font-family:var(--serif);font-weight:400;
  font-size:clamp(54px,8.2vw,118px);line-height:.96;letter-spacing:-.015em;
  max-width:1050px;margin:26px auto 0;
}
.hero h1 .row{display:block;overflow:hidden;padding-bottom:.08em}
.hero h1 .row span{display:block;transform:translateY(108%);animation:rise 1s var(--ease) forwards}
.hero h1 .row:nth-child(2) span{animation-delay:.1s}
.hero h1 .row:nth-child(3) span{animation-delay:.2s}
@keyframes rise{to{transform:translateY(0)}}
.hero h1 em{font-style:italic;color:var(--red);position:relative;white-space:nowrap}
/* hand-drawn underline under "explain" */
.hero h1 em svg{position:absolute;left:-2%;bottom:-.12em;width:104%;height:.28em;overflow:visible}
.hero h1 em svg path{
  fill:none;stroke:var(--red);stroke-width:5;stroke-linecap:round;
  stroke-dasharray:600;stroke-dashoffset:600;animation:draw 1s var(--ease) 1.05s forwards;
}
@keyframes draw{to{stroke-dashoffset:0}}
.hero .lede{
  margin:30px auto 0;max-width:560px;font-size:19.5px;color:var(--ink-2);
  opacity:0;animation:fadeup .8s var(--ease) .55s forwards;
}
@keyframes fadeup{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.hero-cta{display:flex;gap:18px;justify-content:center;margin-top:38px;flex-wrap:wrap;
  opacity:0;animation:fadeup .8s var(--ease) .7s forwards;}
.hero .micro{
  margin-top:22px;font-family:var(--mono);font-size:12px;letter-spacing:.08em;color:var(--ink-3);
  opacity:0;animation:fadeup .8s var(--ease) .85s forwards;
}
.hero .micro b{color:var(--green);font-weight:700}

/* ════════════════════ THE ANNOTATED REPORT (signature) ════════════════════ */
.desk{padding:30px 0 130px;position:relative}
.doc-stage{position:relative;max-width:880px;margin:0 auto;perspective:1600px}
.doc{
  position:relative;background:#FFFDF7;
  border:1.5px solid var(--rule);
  box-shadow:var(--shadow-paper),0 40px 80px -30px rgba(28,24,19,.25);
  transform:rotate(-.6deg);
  padding:0 0 8px;
}
/* perforation edge */
.doc::before{
  content:"";position:absolute;top:0;left:0;right:0;height:14px;
  background:radial-gradient(circle at 10px 0px, var(--paper) 5px, transparent 5.5px) repeat-x;
  background-size:24px 14px;
}
.doc-head{
  display:flex;align-items:stretch;justify-content:space-between;gap:20px;
  padding:34px 40px 22px;border-bottom:2px solid var(--ink);
}
.doc-head .id h2{font-family:var(--serif);font-size:30px;line-height:1.05}
.doc-head .id p{font-family:var(--mono);font-size:11.5px;color:var(--ink-3);letter-spacing:.1em;margin-top:6px;text-transform:uppercase}
.barcode{
  width:150px;height:46px;align-self:center;flex:none;
  background:repeating-linear-gradient(90deg,var(--ink) 0 2px,transparent 2px 4px,var(--ink) 4px 7px,transparent 7px 9px,var(--ink) 9px 10px,transparent 10px 14px);
}
.doc-table{padding:8px 40px 26px}
.doc-row{
  display:grid;grid-template-columns:1.3fr .8fr 1fr .9fr;gap:14px;align-items:center;
  padding:15px 10px;border-bottom:1px dashed var(--rule);
  font-family:var(--mono);font-size:14.5px;position:relative;
}
.doc-row.hd{font-size:10.5px;letter-spacing:.22em;text-transform:uppercase;color:var(--ink-3);border-bottom:1.5px solid var(--ink);font-weight:700}
.doc-row .nm{font-family:var(--body);font-weight:700;font-size:16px}
.doc-row .rng{color:var(--ink-3);font-size:13px}
.doc-row .flag{justify-self:end;font-weight:700;font-size:12px;letter-spacing:.1em}
.f-low{color:var(--amber)}.f-high{color:var(--red)}.f-ok{color:var(--green)}
/* marker highlight sweep */
.hl{position:relative;z-index:0}
.hl::before{
  content:"";position:absolute;inset:4px -6px;background:var(--hi);z-index:-1;
  transform:scaleX(0);transform-origin:left;border-radius:3px;
  transition:transform .7s var(--ease);
}
.doc.played .hl.h1::before{transform:scaleX(1);transition-delay:.5s}
.doc.played .hl.h2::before{transform:scaleX(1);transition-delay:1.5s}
/* ink annotation layer */
.anno{position:absolute;inset:0;pointer-events:none;overflow:visible}
.anno path,.anno ellipse{
  fill:none;stroke:var(--red);stroke-width:3;stroke-linecap:round;stroke-linejoin:round;
}
.anno .seg{stroke-dasharray:var(--len);stroke-dashoffset:var(--len)}
.doc.played .anno .seg{animation:draw2 .9s var(--ease) forwards;animation-delay:var(--ad,0s)}
@keyframes draw2{to{stroke-dashoffset:0}}
.note{
  position:absolute;font-family:var(--hand);font-weight:600;color:var(--red);
  font-size:clamp(17px,2.3vw,23px);line-height:1.15;width:190px;
  opacity:0;transform:rotate(var(--rot,-2deg)) translateY(8px);
  transition:opacity .6s var(--ease),transform .6s var(--ease);
}
.doc.played .note{opacity:1;transform:rotate(var(--rot,-2deg)) translateY(0);transition-delay:var(--nd,1s)}
.note.green{color:var(--green)}
/* rubber stamp */
.stamp{
  position:absolute;right:30px;bottom:-34px;
  font-family:var(--mono);font-weight:700;font-size:21px;letter-spacing:.3em;text-transform:uppercase;
  color:var(--green);border:4px double var(--green);padding:12px 26px 12px 30px;
  transform:rotate(-8deg) scale(2.4);opacity:0;border-radius:8px;
  background:rgba(250,246,238,.6);
  mask-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 80'%3E%3Cfilter id='r'%3E%3CfeTurbulence baseFrequency='.55' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .9 .1'/%3E%3CfeComposite operator='in' in2='SourceGraphic'/%3E%3C/filter%3E%3Crect width='200' height='80' filter='url(%23r)'/%3E%3C/svg%3E");
  mask-size:cover;
}
.doc.played .stamp{animation:stampIn .45s cubic-bezier(.34,1.4,.64,1) 2.5s forwards}
@keyframes stampIn{
  0%{opacity:0;transform:rotate(-8deg) scale(2.4)}
  60%{opacity:1;transform:rotate(-8deg) scale(.94)}
  100%{opacity:1;transform:rotate(-8deg) scale(1)}
}
/* paper tape on corners */
.tape{
  position:absolute;width:120px;height:34px;background:rgba(214,200,160,.45);
  border-left:1px dashed rgba(28,24,19,.15);border-right:1px dashed rgba(28,24,19,.15);
  backdrop-filter:blur(1px);
}
.tape.t1{top:-16px;left:60px;transform:rotate(-5deg)}
.tape.t2{top:-14px;right:80px;transform:rotate(4deg)}
.doc-caption{
  text-align:center;margin-top:64px;font-family:var(--hand);font-size:24px;color:var(--ink-2);
  transform:rotate(-1deg);
}
.doc-caption b{color:var(--red)}

/* ════════════════════ TRANSLATE (before/after rows) ════════════════════ */
.translate{background:var(--ink);color:var(--paper);padding:130px 0}
.translate .eyebrow{color:var(--hi)}
.translate .eyebrow .box{border-color:var(--hi)}
.translate .sec-title em{color:var(--hi)}
.translate .sec-sub{color:#B8B0A0}
.t-list{margin-top:62px;display:flex;flex-direction:column;gap:14px}
.t-row{
  display:grid;grid-template-columns:1fr 64px 1fr;align-items:stretch;gap:0;
  border:1.5px solid #3A352C;background:#232019;
  transition:border-color .3s,transform .3s var(--ease);
}
.t-row:hover{border-color:var(--hi);transform:translateX(6px)}
.t-cell{padding:24px 28px}
.t-cell.from{font-family:var(--mono);font-size:14.5px;color:#9A917E;display:flex;flex-direction:column;gap:6px;justify-content:center}
.t-cell.from .code{font-size:16px;color:#CFC6B2;font-weight:700}
.t-arrow{
  display:grid;place-items:center;border-left:1.5px dashed #3A352C;border-right:1.5px dashed #3A352C;
  color:var(--hi);font-size:22px;font-family:var(--mono);
}
.t-cell.to{display:flex;align-items:center;font-size:17px;line-height:1.55;color:#F0EADC}
.t-cell.to b{color:var(--hi);font-weight:700}
.t-footnote{margin-top:34px;text-align:center;font-family:var(--hand);font-size:23px;color:#9A917E;transform:rotate(-.5deg)}
.t-footnote b{color:var(--hi)}

/* ════════════════════ PROCESS (stamped workflow) ════════════════════ */
.process .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:64px;counter-reset:step}
.p-card{
  border:2px solid var(--ink);background:#FFFDF7;padding:36px 32px 32px;position:relative;
  box-shadow:5px 5px 0 var(--paper-3);
  transition:transform .25s var(--ease),box-shadow .25s var(--ease);
}
.p-card:hover{transform:translate(-3px,-3px);box-shadow:9px 9px 0 var(--paper-3)}
.p-card::before{
  counter-increment:step;content:"0" counter(step);
  position:absolute;top:-19px;left:26px;background:var(--red);color:#FFF8EE;
  font-family:var(--mono);font-weight:700;font-size:14px;letter-spacing:.1em;
  padding:7px 14px;border:2px solid var(--ink);
}
.p-card .pic{height:96px;display:flex;align-items:center;margin-bottom:20px}
.p-card .pic svg{width:74px;height:74px;stroke:var(--ink);fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.p-card .pic .accent{stroke:var(--red)}
.p-card h3{font-family:var(--serif);font-size:30px;margin-bottom:10px}
.p-card p{color:var(--ink-2);font-size:16px}
.p-card .hand{margin-top:16px;font-family:var(--hand);font-size:20px;color:var(--red);transform:rotate(-1.5deg);display:inline-block}

/* ════════════════════ CHECKLIST FEATURES ════════════════════ */
.features{background:var(--paper-2);border-top:2px solid var(--ink);border-bottom:2px solid var(--ink)}
.feat-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:0;margin-top:60px;border:2px solid var(--ink);background:#FFFDF7}
.feat{
  padding:36px 38px;border-bottom:1.5px solid var(--rule);position:relative;
  display:flex;gap:20px;align-items:flex-start;transition:background .25s;
}
.feat:nth-child(odd){border-right:1.5px solid var(--rule)}
.feat:nth-last-child(-n+2){border-bottom:none}
.feat:hover{background:#FFF9EA}
.check{
  width:30px;height:30px;border:2.5px solid var(--ink);flex:none;margin-top:3px;position:relative;background:#fff;
}
.check svg{position:absolute;inset:-6px -8px auto -2px;width:38px;height:34px;overflow:visible}
.check svg path{
  fill:none;stroke:var(--green);stroke-width:5;stroke-linecap:round;stroke-linejoin:round;
  stroke-dasharray:60;stroke-dashoffset:60;
}
.feat.in .check svg path{animation:draw2 .55s var(--ease) forwards;animation-delay:var(--cd,.2s)}
.feat h3{font-family:var(--serif);font-size:25px;margin-bottom:6px}
.feat p{color:var(--ink-2);font-size:15.5px}

/* ════════════════════ QUOTES (taped notes) ════════════════════ */
.quotes-grid{display:grid;grid-template-columns:1fr 1fr;gap:34px;margin-top:64px}
.q{
  background:#FFFDF7;border:1.5px solid var(--rule);padding:44px 40px 34px;position:relative;
  box-shadow:var(--shadow-paper);transform:rotate(var(--qr,-1deg));
  transition:transform .3s var(--ease);
}
.q:hover{transform:rotate(0) translateY(-4px)}
.q .tape{top:-15px;left:50%;margin-left:-60px;transform:rotate(-2deg)}
.q blockquote{font-family:var(--serif);font-style:italic;font-size:27px;line-height:1.35;letter-spacing:-.005em}
.q blockquote .mark{color:var(--red)}
.q cite{display:block;margin-top:22px;font-style:normal;font-family:var(--mono);font-size:12.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-3)}
.q cite b{color:var(--ink)}

/* ════════════════════ LEARN (index cards) ════════════════════ */
.learn-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:60px}
.lcard{
  background:#FFFDF7;border:1.5px solid var(--ink);padding:0;display:flex;flex-direction:column;
  transition:transform .25s var(--ease),box-shadow .25s var(--ease);
  box-shadow:4px 4px 0 var(--paper-3);
}
.lcard:hover{transform:translate(-3px,-3px);box-shadow:8px 8px 0 var(--red-soft)}
.lcard .tab{
  font-family:var(--mono);font-size:10.5px;font-weight:700;letter-spacing:.26em;text-transform:uppercase;
  padding:10px 22px;border-bottom:1.5px solid var(--ink);
  background:repeating-linear-gradient(-45deg,var(--paper-2) 0 8px,#FFFDF7 8px 16px);
  display:flex;justify-content:space-between;align-items:center;
}
.lcard .tab .no{color:var(--red)}
.lcard .bd{padding:26px 24px 24px;display:flex;flex-direction:column;gap:10px;flex:1}
.lcard h3{font-family:var(--serif);font-size:24px;line-height:1.15}
.lcard p{color:var(--ink-2);font-size:15px;flex:1}
.lcard .go{font-family:var(--mono);font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--red);display:inline-flex;gap:8px;align-items:center}
.lcard .go .arr{transition:transform .25s var(--ease)}
.lcard:hover .go .arr{transform:translateX(5px)}

/* ════════════════════ FINAL ════════════════════ */
.final{padding:150px 0 140px;text-align:center;overflow:hidden;position:relative}
.final h2{
  font-family:var(--serif);font-size:clamp(48px,7vw,100px);line-height:.98;letter-spacing:-.015em;
  max-width:900px;margin:22px auto;font-weight:400;
}
.final h2 em{font-style:italic;color:var(--red)}
.final p{color:var(--ink-2);font-size:19px;max-width:480px;margin:0 auto 42px}
.final .micro{margin-top:24px;font-family:var(--mono);font-size:12px;letter-spacing:.1em;color:var(--ink-3)}
.big-stamp{
  position:absolute;font-family:var(--mono);font-weight:700;letter-spacing:.34em;text-transform:uppercase;
  color:var(--red);border:5px double var(--red);padding:16px 34px 16px 40px;border-radius:10px;
  font-size:clamp(16px,2vw,24px);opacity:.16;pointer-events:none;
}
.big-stamp.s1{top:70px;left:4%;transform:rotate(-14deg)}
.big-stamp.s2{bottom:60px;right:4%;transform:rotate(9deg);color:var(--green);border-color:var(--green)}

/* ════════════════════ FOOTER ════════════════════ */
footer{border-top:2px solid var(--ink);background:var(--paper-2);padding:50px 0 40px}
.f-in{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:24px}
.f-links{display:flex;gap:28px;font-family:var(--mono);font-size:12.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
.f-links a:hover{color:var(--red)}
.f-note{
  width:100%;margin-top:28px;padding-top:24px;border-top:1.5px dashed var(--rule);
  font-size:13px;color:var(--ink-3);line-height:1.7;max-width:760px;
}

/* ════════════════════ RESPONSIVE ════════════════════ */
@media(max-width:1020px){
  .feat-grid{grid-template-columns:1fr}
  .feat:nth-child(odd){border-right:none}
  .feat:nth-last-child(-n+2){border-bottom:1.5px solid var(--rule)}
  .feat:last-child{border-bottom:none}
  .process .steps{grid-template-columns:1fr;gap:40px}
  .learn-grid{grid-template-columns:repeat(2,1fr)}
  .quotes-grid{grid-template-columns:1fr}
  .t-row{grid-template-columns:1fr;}
  .t-cell{padding:20px 22px}
  .t-cell.to{display:block}
  .t-arrow{border:none;border-top:1.5px dashed #3A352C;border-bottom:1.5px dashed #3A352C;padding:10px 0;transform:none;font-size:0}
  .t-arrow::before{content:"↓";font-size:20px;color:var(--hi)}
}
@media(max-width:680px){
  section{padding:88px 0}
  .wrap{padding:0 20px}
  .nav-links a:not(.btn){display:none}
  .learn-grid{grid-template-columns:1fr}
  .doc-head{flex-direction:column;gap:18px}
  .doc-table{padding:8px 18px 22px}
  .doc-row{grid-template-columns:1.4fr .9fr auto;font-size:13px}
  .doc-row .nm{font-size:14.5px}
  .doc-row .rng{display:none}
  .note{display:none}
  .anno{display:none}
  .doc-caption{display:none}
  .stamp{right:50%;bottom:14px;transform:translateX(50%) rotate(-6deg) scale(1);font-size:16px;padding:9px 18px 9px 22px}
  .desk .doc.played .stamp{animation:none;opacity:1;transform:translateX(50%) rotate(-6deg) scale(1)}
  .hero h1{font-size:clamp(40px,11vw,70px)}
  .specimen{font-size:10.5px;letter-spacing:.1em}
  .q blockquote{font-size:22px}
}
@media(prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}
  .hero h1 .row span{transform:none}
  .hero .lede,.hero-cta,.hero .micro{opacity:1}
  .rv{opacity:1;transform:none}
  .doc.played .anno .seg{stroke-dashoffset:0}
  .doc.played .note{opacity:1}
  .doc.played .stamp{opacity:1;transform:rotate(-8deg) scale(1)}
  .hl::before{transform:scaleX(1)!important}
  .feat .check svg path{stroke-dashoffset:0}
}
</style>

<!-- ══════════ specimen ticker ══════════ -->
<div class="specimen" aria-hidden="true">
  <div class="track" id="spec">
    <span>Specimen: <b>whole blood</b></span><span class="sep">●</span>
    <span>Patient: <b>you</b></span><span class="sep">●</span>
    <span>Collected: <b>this morning</b></span><span class="sep">●</span>
    <span>Status: <b>finally understood</b></span><span class="sep">●</span>
    <span>Panels read: <b>50+</b></span><span class="sep">●</span>
    <span>Jargon detected: <b>0</b></span><span class="sep">●</span>
  </div>
</div>

<!-- ══════════ NAV ══════════ -->
<nav>
  <div class="nav-in">
    <a class="logo" href="/" aria-label="labread.health home">
      <svg class="seal" viewBox="0 0 80 80" aria-hidden="true">
        <defs>
          <path id="arcTop" d="M 40 40 m -30 0 a 30 30 0 0 1 60 0"/>
          <path id="arcBot" d="M 12 48 a 30 30 0 0 0 56 0"/>
        </defs>
        <g class="ring">
          <circle cx="40" cy="40" r="37" fill="#1C1813"/>
          <circle cx="40" cy="40" r="32.5" fill="none" stroke="#FAF6EE" stroke-width=".7" stroke-dasharray=".7 2.4" opacity=".55"/>
          <g stroke="#FAF6EE" stroke-width="1.1" opacity=".75" stroke-linecap="round">
            <line x1="40" y1="4.5" x2="40" y2="9"/>
            <line x1="40" y1="71" x2="40" y2="75.5"/>
            <line x1="4.5" y1="40" x2="9" y2="40"/>
            <line x1="71" y1="40" x2="75.5" y2="40"/>
          </g>
          <text font-family="'Space Mono', monospace" font-size="5.2" font-weight="700" fill="#FAF6EE" letter-spacing="2.4">
            <textPath href="#arcTop" startOffset="50%" text-anchor="middle">LABREAD · HEALTH</textPath>
          </text>
          <text font-family="'Space Mono', monospace" font-size="4.6" font-weight="700" fill="#FAF6EE" letter-spacing="2" opacity=".75">
            <textPath href="#arcBot" startOffset="50%" text-anchor="middle">№ 001 · MMXXVI</textPath>
          </text>
        </g>
        <text x="40" y="57" font-family="'Instrument Serif', serif" font-style="italic" font-size="46" fill="#FAF6EE" text-anchor="middle">l</text>
        <path d="M 49.5 43 C 46 49.5, 46 56, 49.5 56 C 53 56, 53 49.5, 49.5 43 Z" fill="#D5402F"/>
        <ellipse cx="48" cy="51.5" rx=".75" ry="1.8" fill="rgba(255,255,255,.55)"/>
      </svg>
      <span class="wm">
        <span class="word">labread</span>
        <svg class="dropsep" viewBox="0 0 12 14" aria-hidden="true">
          <path d="M6 1 C 1.8 6.5, 1.8 13, 6 13 C 10.2 13, 10.2 6.5, 6 1 Z" fill="#D5402F"/>
          <ellipse cx="5" cy="9.5" rx=".7" ry="1.7" fill="rgba(255,255,255,.55)"/>
        </svg>
        <span class="tld">health</span>
      </span>
    </a>
    <div class="nav-links">
      <a href="#how">Process</a>
      <a href="#learn">Learn</a>
      <a href="/auth">Sign in</a>
      <a href="/try-free" class="btn btn-red">Try free</a>
    </div>
  </div>
</nav>

<!-- ══════════ HERO ══════════ -->
<header class="hero">
  <div class="wrap">
    <div class="eyebrow" style="justify-content:center"><span class="box"></span>Lab report № 001 — yours</div>
    <h1>
      <span class="row"><span>We read your</span></span>
      <span class="row"><span>blood test. Then we</span></span>
      <span class="row"><span><em>explain it<svg viewBox="0 0 300 24" preserveAspectRatio="none"><path d="M4 16 C 60 8, 120 20, 170 12 S 270 10, 296 14"/></svg></em> like a friend.</span></span>
    </h1>
    <p class="lede">A friend who went to med school. Upload your results — we circle what matters, translate the jargon, and tell you what to ask your doctor.</p>
    <div class="hero-cta">
      <a href="/try-free" class="btn btn-red">Read my labs — free</a>
      <a href="#doc" class="btn">See it work ↓</a>
    </div>
    <p class="micro">No card · minutes · <b>data deleted after processing</b></p>
  </div>
</header>

<!-- ══════════ THE ANNOTATED REPORT ══════════ -->
<div class="desk" id="doc">
  <div class="wrap">
    <div class="doc-stage">
      <div class="doc" id="docEl">
        <span class="tape t1"></span><span class="tape t2"></span>
        <div class="doc-head">
          <div class="id">
            <h2>Comprehensive Metabolic Panel</h2>
            <p>ACC № 26-58-2210 · Drawn 06:48 · Fasting</p>
          </div>
          <div class="barcode" aria-hidden="true"></div>
        </div>
        <div class="doc-table">
          <div class="doc-row hd"><span>Test</span><span>Result</span><span class="rng">Reference</span><span class="flag">Flag</span></div>
          <div class="doc-row">
            <span class="nm">Ferritin</span>
            <span class="hl h1"><b>18</b> ng/mL</span>
            <span class="rng">30 – 150</span>
            <span class="flag f-low">LOW ▾</span>
          </div>
          <div class="doc-row">
            <span class="nm">Vitamin D, 25-OH</span>
            <span><b>22</b> ng/mL</span>
            <span class="rng">30 – 60</span>
            <span class="flag f-low">LOW ▾</span>
          </div>
          <div class="doc-row">
            <span class="nm">TSH</span>
            <span><b>2.1</b> mIU/L</span>
            <span class="rng">0.4 – 4.0</span>
            <span class="flag f-ok">OK ✓</span>
          </div>
          <div class="doc-row">
            <span class="nm">hs-CRP</span>
            <span class="hl h2"><b>4.2</b> mg/L</span>
            <span class="rng">&lt; 3.0</span>
            <span class="flag f-high">HIGH ▴</span>
          </div>
          <div class="doc-row" style="border-bottom:none">
            <span class="nm">Vitamin B12</span>
            <span><b>540</b> pg/mL</span>
            <span class="rng">200 – 900</span>
            <span class="flag f-ok">OK ✓</span>
          </div>
        </div>

        <!-- ink annotations -->
        <svg class="anno" viewBox="0 0 880 460" preserveAspectRatio="none" aria-hidden="true">
          <!-- circle around ferritin 18 -->
          <ellipse class="seg" cx="318" cy="208" rx="58" ry="22" style="--len:260;--ad:.7s"/>
          <!-- arrow ferritin -> left margin -->
          <path class="seg" d="M256 206 C 190 200, 150 216, 108 248" style="--len:170;--ad:1.1s"/>
          <path class="seg" d="M120 238 L 106 250 L 122 256" style="--len:46;--ad:1.35s"/>
          <!-- circle around CRP 4.2 -->
          <ellipse class="seg" cx="312" cy="352" rx="52" ry="21" style="--len:240;--ad:1.7s"/>
          <!-- arrow CRP -> right margin -->
          <path class="seg" d="M366 352 C 470 366, 560 350, 700 372" style="--len:350;--ad:2s"/>
          <path class="seg" d="M686 362 L 702 372 L 684 380" style="--len:48;--ad:2.25s"/>
        </svg>

        <!-- margin notes -->
        <span class="note" style="left:-128px;top:252px;--rot:-3deg;--nd:1.35s">iron stores low — this explains the tiredness</span>
        <span class="note" style="right:-150px;top:300px;--rot:2deg;--nd:2.3s;text-align:left">mild inflammation. worth asking what's driving it</span>
        <span class="note green" style="right:-138px;top:120px;--rot:1.5deg;--nd:2.7s">thyroid looks fine ✓</span>

        <span class="stamp">Explained</span>
      </div>
      <p class="doc-caption">↑ this is what we do to your report. <b>every value, no jargon.</b></p>
    </div>
  </div>
</div>

<!-- ══════════ TRANSLATE ══════════ -->
<section class="translate">
  <div class="wrap">
    <div class="eyebrow"><span class="box"></span>The translation layer</div>
    <h2 class="sec-title rv">Lab language, <em>human language.</em></h2>
    <p class="sec-sub rv d1">Labs write for doctors. We rewrite for you — every abbreviation, every range, every flag.</p>

    <div class="t-list">
      <div class="t-row rv">
        <div class="t-cell from"><span class="code">FERRITIN 18 ng/mL [L]</span><span>REF: 30–150 · METHOD: CMIA</span></div>
        <div class="t-arrow">→</div>
        <div class="t-cell to">Your <b>iron storage is running low</b>. It's the most common reason for feeling tired, foggy, and cold — and it's very fixable.</div>
      </div>
      <div class="t-row rv d1">
        <div class="t-cell from"><span class="code">25-OH VIT D 22 ng/mL [L]</span><span>REF: 30–60 · LC-MS/MS</span></div>
        <div class="t-arrow">→</div>
        <div class="t-cell to"><b>Below optimal vitamin D</b> — linked to low energy, low mood, and weaker immunity. Common, and worth correcting.</div>
      </div>
      <div class="t-row rv d2">
        <div class="t-cell from"><span class="code">HS-CRP 4.2 mg/L [H]</span><span>REF: &lt;3.0 · NEPHELOMETRY</span></div>
        <div class="t-arrow">→</div>
        <div class="t-cell to">There's <b>mild inflammation somewhere</b> in your body. One number can't say where — a good question to bring to your doctor.</div>
      </div>
    </div>
    <p class="t-footnote">…and <b>50+ more biomarkers</b>, translated the same way.</p>
  </div>
</section>

<!-- ══════════ PROCESS ══════════ -->
<section class="process" id="how">
  <div class="wrap">
    <div class="eyebrow"><span class="box"></span>Standard procedure</div>
    <h2 class="sec-title rv">From PDF to <em>plain English</em><br>in minutes.</h2>

    <div class="steps">
      <div class="p-card rv">
        <div class="pic">
          <svg viewBox="0 0 80 80"><rect x="16" y="10" width="48" height="60" rx="3"/><path d="M26 24h28M26 34h28M26 44h16"/><path class="accent" d="M40 70V50m0 0-8 8m8-8 8 8" transform="rotate(180 40 60)"/></svg>
        </div>
        <h3>Upload</h3>
        <p>Drop a PDF or snap a photo of your lab report. Any lab, any country, any language.</p>
        <span class="hand">even the blurry ones</span>
      </div>
      <div class="p-card rv d1">
        <div class="pic">
          <svg viewBox="0 0 80 80"><circle cx="34" cy="34" r="20"/><path d="M48 48 66 66" class="accent"/><path d="M26 34h16M34 26v16"/></svg>
        </div>
        <h3>Analyze</h3>
        <p>Our AI reads every value and checks it against real medical reference ranges.</p>
        <span class="hand">all 50+ markers, not just the flagged ones</span>
      </div>
      <div class="p-card rv d2">
        <div class="pic">
          <svg viewBox="0 0 80 80"><path d="M14 58c8-2 12-10 14-22 2 14 6 20 12 20s10-6 12-20c2 12 6 20 14 22" class="accent"/><path d="M10 68h60"/></svg>
        </div>
        <h3>Understand</h3>
        <p>Get plain-language explanations, flags you can't miss, and questions worth asking your doctor.</p>
        <span class="hand">like the note in the margin ↑</span>
      </div>
    </div>
  </div>
</section>

<!-- ══════════ FEATURES CHECKLIST ══════════ -->
<section class="features">
  <div class="wrap">
    <div class="eyebrow"><span class="box"></span>Requisition form</div>
    <h2 class="sec-title rv">Everything checked. <em>Nothing stored.</em></h2>

    <div class="feat-grid">
      <div class="feat rv" style="--cd:.15s">
        <span class="check"><svg viewBox="0 0 38 34"><path d="M6 18 L15 27 L34 4"/></svg></span>
        <div><h3>Any lab, any country</h3><p>Bloodwork, panels, hormones — we read them all, in any language and any unit system.</p></div>
      </div>
      <div class="feat rv" style="--cd:.3s">
        <span class="check"><svg viewBox="0 0 38 34"><path d="M6 18 L15 27 L34 4"/></svg></span>
        <div><h3>Plain-language insights</h3><p>No jargon. Just what each value means for your body, today.</p></div>
      </div>
      <div class="feat rv" style="--cd:.45s">
        <span class="check"><svg viewBox="0 0 38 34"><path d="M6 18 L15 27 L34 4"/></svg></span>
        <div><h3>Flagged automatically</h3><p>Color-coded results so abnormal values are impossible to miss.</p></div>
      </div>
      <div class="feat rv" style="--cd:.6s">
        <span class="check"><svg viewBox="0 0 38 34"><path d="M6 18 L15 27 L34 4"/></svg></span>
        <div><h3>Screening recommendations</h3><p>Personalized next steps and tests worth discussing with your doctor.</p></div>
      </div>
      <div class="feat rv" style="--cd:.75s">
        <span class="check"><svg viewBox="0 0 38 34"><path d="M6 18 L15 27 L34 4"/></svg></span>
        <div><h3>History you can compare</h3><p>Every report saved, searchable, and easy to track over time.</p></div>
      </div>
      <div class="feat rv" style="--cd:.9s">
        <span class="check"><svg viewBox="0 0 38 34"><path d="M6 18 L15 27 L34 4"/></svg></span>
        <div><h3>Zero data stored</h3><p>Results are processed and immediately deleted. Nothing saved. HIPAA-compliant.</p></div>
      </div>
    </div>
  </div>
</section>

<!-- ══════════ QUOTES ══════════ -->
<section>
  <div class="wrap">
    <div class="eyebrow"><span class="box"></span>Field notes</div>
    <div class="quotes-grid">
      <div class="q rv" style="--qr:-1.2deg">
        <span class="tape"></span>
        <blockquote><span class="mark">“</span>Useful and actually explains my blood test in language I can understand.<span class="mark">”</span></blockquote>
        <cite>— <b>Alix</b> · early user</cite>
      </div>
      <div class="q rv d1" style="--qr:1deg">
        <span class="tape"></span>
        <blockquote><span class="mark">“</span>I finally understand my blood test.<span class="mark">”</span></blockquote>
        <cite>— <b>Rechi</b> · early user</cite>
      </div>
    </div>
  </div>
</section>

<!-- ══════════ LEARN ══════════ -->
<section id="learn" style="padding-top:40px">
  <div class="wrap">
    <div class="eyebrow"><span class="box"></span>The library</div>
    <h2 class="sec-title rv">Understand your <em>results.</em></h2>
    <p class="sec-sub rv d1">Plain-English guides to the biomarkers people ask about most — what the numbers mean, and what to do next.</p>

    <div class="learn-grid">
      <a href="/learn/ferritin" class="lcard rv"><span class="tab">Iron <span class="no">FE-01</span></span>
        <div class="bd"><h3>What Does Low Ferritin Mean?</h3><p>Iron deficiency, explained in plain English.</p><span class="go">Read guide <span class="arr">→</span></span></div></a>
      <a href="/learn/vitamin-d" class="lcard rv d1"><span class="tab">Vitamins <span class="no">VD-02</span></span>
        <div class="bd"><h3>Vitamin D Deficiency Explained</h3><p>Why “normal” and “optimal” are far apart.</p><span class="go">Read guide <span class="arr">→</span></span></div></a>
      <a href="/learn/tsh-thyroid" class="lcard rv d2"><span class="tab">Thyroid <span class="no">TS-03</span></span>
        <div class="bd"><h3>TSH Normal But Still Tired?</h3><p>Why one thyroid number isn’t the whole story.</p><span class="go">Read guide <span class="arr">→</span></span></div></a>
      <a href="/learn/crp" class="lcard rv"><span class="tab">Inflammation <span class="no">CR-04</span></span>
        <div class="bd"><h3>What Does High CRP Mean?</h3><p>The quiet inflammation marker most people overlook.</p><span class="go">Read guide <span class="arr">→</span></span></div></a>
      <a href="/learn/a1c" class="lcard rv d1"><span class="tab">Metabolic <span class="no">A1-05</span></span>
        <div class="bd"><h3>What Is Pre-Diabetic A1c?</h3><p>The window where changes matter most.</p><span class="go">Read guide <span class="arr">→</span></span></div></a>
      <a href="#learn" class="lcard rv d2"><span class="tab">Index <span class="no">∞</span></span>
        <div class="bd"><h3>50+ more biomarkers</h3><p>New plain-English guides every week.</p><span class="go">Browse all <span class="arr">→</span></span></div></a>
    </div>
  </div>
</section>

<!-- ══════════ FINAL ══════════ -->
<section class="final">
  <span class="big-stamp s1">No jargon</span>
  <span class="big-stamp s2">Understood</span>
  <div class="wrap">
    <div class="eyebrow" style="justify-content:center"><span class="box"></span>Free · no card needed</div>
    <h2 class="rv">Stop nodding at numbers<br>you <em>don’t understand.</em></h2>
    <p class="rv d1">Your next blood test doesn’t have to be a mystery. First report in minutes.</p>
    <div class="rv d2"><a href="/try-free" class="btn btn-red" style="padding:19px 38px;font-size:15.5px">Read my labs — free</a></div>
    <p class="micro rv d3" style="font-family:var(--mono);color:var(--ink-3);font-size:12px;letter-spacing:.1em;margin-top:26px">50+ biomarkers · any lab · data deleted after processing</p>
  </div>
</section>

<!-- ══════════ FOOTER ══════════ -->
<footer>
  <div class="wrap f-in">
    <a class="logo sm" href="/" aria-label="labread.health home">
      <svg class="seal" viewBox="0 0 80 80" aria-hidden="true">
        <defs>
          <path id="arcTopF" d="M 40 40 m -30 0 a 30 30 0 0 1 60 0"/>
          <path id="arcBotF" d="M 12 48 a 30 30 0 0 0 56 0"/>
        </defs>
        <g class="ring">
          <circle cx="40" cy="40" r="37" fill="#1C1813"/>
          <circle cx="40" cy="40" r="32.5" fill="none" stroke="#FAF6EE" stroke-width=".7" stroke-dasharray=".7 2.4" opacity=".55"/>
          <g stroke="#FAF6EE" stroke-width="1.1" opacity=".75" stroke-linecap="round">
            <line x1="40" y1="4.5" x2="40" y2="9"/>
            <line x1="40" y1="71" x2="40" y2="75.5"/>
            <line x1="4.5" y1="40" x2="9" y2="40"/>
            <line x1="71" y1="40" x2="75.5" y2="40"/>
          </g>
          <text font-family="'Space Mono', monospace" font-size="5.2" font-weight="700" fill="#FAF6EE" letter-spacing="2.4">
            <textPath href="#arcTopF" startOffset="50%" text-anchor="middle">LABREAD · HEALTH</textPath>
          </text>
          <text font-family="'Space Mono', monospace" font-size="4.6" font-weight="700" fill="#FAF6EE" letter-spacing="2" opacity=".75">
            <textPath href="#arcBotF" startOffset="50%" text-anchor="middle">№ 001 · MMXXVI</textPath>
          </text>
        </g>
        <text x="40" y="57" font-family="'Instrument Serif', serif" font-style="italic" font-size="46" fill="#FAF6EE" text-anchor="middle">l</text>
        <path d="M 49.5 43 C 46 49.5, 46 56, 49.5 56 C 53 56, 53 49.5, 49.5 43 Z" fill="#D5402F"/>
        <ellipse cx="48" cy="51.5" rx=".75" ry="1.8" fill="rgba(255,255,255,.55)"/>
      </svg>
      <span class="wm">
        <span class="word">labread</span>
        <svg class="dropsep" viewBox="0 0 12 14" aria-hidden="true">
          <path d="M6 1 C 1.8 6.5, 1.8 13, 6 13 C 10.2 13, 10.2 6.5, 6 1 Z" fill="#D5402F"/>
          <ellipse cx="5" cy="9.5" rx=".7" ry="1.7" fill="rgba(255,255,255,.55)"/>
        </svg>
        <span class="tld">health</span>
      </span>
    </a>
    <div class="f-links">
      <a href="#how">Process</a><a href="#learn">Learn</a><a href="#">Privacy</a><a href="#">Terms</a>
      <a href="https://x.com/labread_health" target="_blank" rel="noopener">X / Twitter</a>
    </div>
    <p class="f-note">labread.health provides educational information about laboratory values and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult your doctor about your results. © 2026 labread.health</p>
  </div>
</footer>
`;

function HomePage() {
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    /* ---------- duplicate ticker for seamless loop (idempotent) ---------- */
    const spec = document.getElementById("spec");
    if (spec && !spec.dataset.duplicated) {
      spec.innerHTML += spec.innerHTML;
      spec.dataset.duplicated = "1";
    }

    /* ---------- reveals ---------- */
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.16, rootMargin: "0px 0px -36px 0px" }
    );
    document.querySelectorAll(".rv,.feat").forEach((el) => io.observe(el));
    observers.push(io);

    /* ---------- annotated report sequence ---------- */
    const doc = document.getElementById("docEl");
    if (doc) {
      const ro = new IntersectionObserver(
        (es, o) => {
          if (es[0].isIntersecting) {
            doc.classList.add("played");
            o.disconnect();
          }
        },
        { threshold: 0.45 }
      );
      ro.observe(doc);
      observers.push(ro);
    }

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
