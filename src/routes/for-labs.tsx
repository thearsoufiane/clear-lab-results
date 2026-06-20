import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import {
  MARKETING_CSS, SvgDefs, MarketingNav, MarketingFooter, useMarketingEffects,
} from "@/components/marketing";

export const Route = createFileRoute("/for-labs")({
  head: () => ({
    meta: [
      { title: "labread — AI interpretation for labs & clinics" },
      { name: "description", content: "White-label blood-test interpretation for labs & clinics. labread reads HL7, FHIR and CSV and returns clinician- and patient-ready reports under your own brand." },
      { property: "og:title", content: "labread — AI interpretation for labs & clinics" },
      { property: "og:description", content: "HL7/FHIR-native, white-label interpretation layer for labs & clinics — your brand, your region, your stack." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://labread.health/for-labs" },
      { property: "og:image", content: "https://labread.health/og-image.png" },
    ],
    links: [
      { rel: "canonical", href: "https://labread.health/for-labs" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" as const },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" },
    ],
  }),
  component: ForLabs,
});

const pageCss = `
  .lr-mkt .btn-dark{background:#0d0b08;border:1px solid var(--line);color:var(--cream)}
  .lr-mkt .btn-dark:hover{border-color:rgba(245,166,35,.4)}

  /* HERO (enterprise, darker) */
  .lr-mkt .hero{position:relative;padding:74px 0 54px;overflow:hidden;background:radial-gradient(ellipse at 80% -10%,rgba(232,116,59,.12),transparent 55%)}
  .lr-mkt .hero::before{content:"";position:absolute;top:-160px;left:-140px;width:680px;height:600px;background:radial-gradient(ellipse at center,rgba(111,207,151,.10),transparent 64%);filter:blur(24px);pointer-events:none}
  .lr-mkt .hero-grid{position:relative;display:grid;grid-template-columns:.96fr 1.04fr;gap:40px;align-items:center}
  .lr-mkt .hero-badge{display:inline-flex;align-items:center;gap:9px;border:1px solid var(--line);background:var(--surface);border-radius:999px;padding:7px 15px;font-family:var(--mono);font-size:11.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--amber);margin-bottom:26px}
  .lr-mkt .hero-badge svg{width:14px;height:14px;stroke:var(--amber);fill:none;stroke-width:2}
  .lr-mkt .hero h1{font-size:clamp(40px,5.4vw,72px)}
  .lr-mkt .hero h1 .live{display:block}
  .lr-mkt .hero-sub{max-width:520px;margin:24px 0 0;color:var(--muted);font-size:18.5px}
  .lr-mkt .hero-sub b{color:var(--cream);font-weight:600}
  .lr-mkt .hero-cta{display:flex;gap:14px;margin-top:34px;flex-wrap:wrap}
  .lr-mkt .hero-stats{margin-top:34px;display:flex;gap:30px;flex-wrap:wrap}
  .lr-mkt .hero-stats .s b{font-family:var(--serif);font-size:30px;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent;display:block;line-height:1}
  .lr-mkt .hero-stats .s span{font-family:var(--mono);font-size:10.5px;color:var(--faint);letter-spacing:.08em;text-transform:uppercase}

  /* LAB DASHBOARD MOCK */
  .lr-mkt .lab-stage{position:relative}
  .lr-mkt .lab-stage::before{content:"";position:absolute;inset:-30px;background:radial-gradient(ellipse at 50% 10%,rgba(245,133,63,.16),transparent 62%);filter:blur(14px);z-index:-1}
  .lr-mkt .ldash{background:linear-gradient(180deg,rgba(23,18,9,.96),rgba(15,12,8,.98));border:1px solid var(--line);border-radius:18px;overflow:hidden;box-shadow:0 40px 90px rgba(0,0,0,.6);display:grid;grid-template-columns:150px 1fr}
  .lr-mkt .ld-side{border-right:1px solid var(--line-soft);padding:14px 11px;display:flex;flex-direction:column;gap:12px}
  .lr-mkt .ld-brand{display:flex;align-items:center;gap:8px;padding-bottom:11px;border-bottom:1px solid var(--line-soft)}
  .lr-mkt .ld-logo{width:26px;height:26px;border-radius:7px;background:var(--grad);display:grid;place-items:center;font-family:var(--serif);color:#1a0f02;font-weight:600;font-size:13px}
  .lr-mkt .ld-bn{font-size:12.5px;font-weight:600}
  .lr-mkt .ld-nav{display:flex;flex-direction:column;gap:1px}
  .lr-mkt .ld-nav a{display:flex;align-items:center;gap:8px;font-size:11.5px;color:var(--muted);padding:7px 8px;border-radius:7px}
  .lr-mkt .ld-nav a.on{background:rgba(245,133,63,.1);color:var(--cream)}
  .lr-mkt .ld-nav a svg{width:13px;height:13px;stroke:currentColor;fill:none;stroke-width:1.9;opacity:.8}
  .lr-mkt .ld-nav a.on svg{stroke:var(--amber);opacity:1}
  .lr-mkt .ld-up{margin-top:auto;border:1px dashed var(--line);border-radius:9px;padding:11px 9px;text-align:center}
  .lr-mkt .ld-up .ui{font-size:9px;color:var(--faint);font-family:var(--mono)}
  .lr-mkt .ld-up .ub{margin-top:7px;background:var(--grad);color:#1a0f02;font-size:10px;font-weight:600;border-radius:6px;padding:6px;display:inline-block}
  .lr-mkt .ld-main{padding:14px 15px;display:flex;flex-direction:column;gap:11px;min-width:0}
  .lr-mkt .ld-title{font-size:13px;font-weight:600;font-family:var(--sans)}
  .lr-mkt .ld-cmp{border:1px solid var(--line-soft);border-radius:10px;padding:11px 12px;display:flex;gap:14px;flex-wrap:wrap}
  .lr-mkt .ld-cmp .col .l{font-family:var(--mono);font-size:8.5px;color:var(--faint);text-transform:uppercase;letter-spacing:.08em}
  .lr-mkt .ld-cmp .col .v{font-size:10.5px;color:var(--cream);margin-top:2px}
  .lr-mkt .ld-cmp .docs{margin-left:auto;display:flex;flex-direction:column;gap:4px}
  .lr-mkt .ld-cmp .doc{font-family:var(--mono);font-size:9px;color:var(--muted);display:flex;align-items:center;gap:5px}
  .lr-mkt .ld-cmp .doc::before{content:"";width:9px;height:11px;background:rgba(245,133,63,.4);border-radius:2px;display:inline-block}
  .lr-mkt .ld-sub{font-family:var(--mono);font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--faint)}
  .lr-mkt .ld-trends{display:grid;grid-template-columns:1fr 1fr;gap:9px}
  .lr-mkt .ld-tr{border:1px solid var(--line-soft);border-radius:10px;padding:10px}
  .lr-mkt .ld-tr h6{font-family:var(--sans);font-size:10.5px;font-weight:600;margin-bottom:2px}
  .lr-mkt .ld-tr .u{font-family:var(--mono);font-size:8.5px;color:var(--faint);margin-bottom:6px}
  .lr-mkt .ld-tr svg{width:100%;height:38px;display:block}
  .lr-mkt .ld-totals{display:flex;gap:9px}
  .lr-mkt .ld-tot{flex:1;border:1px solid var(--line-soft);border-radius:9px;padding:9px 11px}
  .lr-mkt .ld-tot b{font-family:var(--serif);font-size:18px;color:var(--amber-lite)}
  .lr-mkt .ld-tot span{font-family:var(--mono);font-size:8.5px;color:var(--faint);text-transform:uppercase;letter-spacing:.06em;display:block}

  /* INTEGRATION FLOW */
  .lr-mkt .integ{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center;margin-top:10px}
  .lr-mkt .integ-copy h2{font-size:clamp(30px,4vw,46px)}
  .lr-mkt .integ-copy p{color:var(--muted);font-size:16.5px;margin-top:16px;max-width:440px}
  .lr-mkt .integ-copy .btn{margin-top:26px}
  .lr-mkt .flow-diagram{position:relative;background:linear-gradient(180deg,var(--surface),var(--bg-2));border:1px solid var(--line);border-radius:20px;padding:26px 22px;box-shadow:0 30px 70px rgba(0,0,0,.5)}
  .lr-mkt .fd-grid{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:16px}
  .lr-mkt .fd-sources{display:flex;flex-direction:column;gap:8px}
  .lr-mkt .fd-chip{background:#fff;color:#1a1a1a;font-weight:700;font-size:12px;border-radius:8px;padding:9px 12px;text-align:center;box-shadow:0 6px 16px rgba(0,0,0,.3);font-family:var(--sans)}
  .lr-mkt .fd-chip.add{background:rgba(255,255,255,.03);color:var(--green);border:1px dashed var(--line);box-shadow:none;display:flex;align-items:center;justify-content:center;gap:6px;font-weight:600}
  .lr-mkt .fd-chip.add svg{width:13px;height:13px;stroke:var(--green);fill:none;stroke-width:2}
  .lr-mkt .fd-core{display:flex;flex-direction:column;align-items:center;gap:10px}
  .lr-mkt .fd-core .api{font-family:var(--mono);font-size:9px;color:var(--amber);letter-spacing:.12em}
  .lr-mkt .fd-core .box{background:var(--grad);color:#1a0f02;font-family:var(--serif);font-weight:600;font-size:15px;border-radius:11px;padding:13px 18px;display:flex;align-items:center;gap:8px;box-shadow:0 0 28px rgba(245,133,63,.4)}
  .lr-mkt .fd-core .box svg{width:18px;height:18px}
  .lr-mkt .fd-core .iris{font-family:var(--mono);font-size:9px;color:var(--faint);border:1px solid var(--line-soft);border-radius:7px;padding:6px 10px}
  .lr-mkt .fd-out{display:flex;flex-direction:column;gap:14px}
  .lr-mkt .fd-o{display:flex;flex-direction:column;align-items:center;gap:6px;font-family:var(--mono);font-size:9.5px;color:var(--muted)}
  .lr-mkt .fd-o .oi{width:40px;height:40px;border-radius:11px;background:rgba(245,133,63,.1);border:1px solid var(--line);display:grid;place-items:center}
  .lr-mkt .fd-o .oi svg{width:20px;height:20px;stroke:var(--amber-lite);fill:none;stroke-width:1.8}
  .lr-mkt .fd-lines{position:absolute;inset:0;pointer-events:none}
  .lr-mkt .fd-lines path{stroke:rgba(245,166,35,.28);stroke-width:1.4;fill:none;stroke-dasharray:4 5}

  /* ON-PREMISE */
  .lr-mkt .onprem{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center;margin-top:46px}
  .lr-mkt .onprem-visual{position:relative;height:300px;border:1px solid var(--line);border-radius:20px;background:linear-gradient(180deg,var(--surface),var(--bg-2));display:grid;place-items:center;overflow:hidden}
  .lr-mkt .onprem-visual::before{content:"";position:absolute;width:420px;height:420px;background:radial-gradient(circle,rgba(111,207,151,.1),transparent 60%);filter:blur(14px)}
  .lr-mkt .cloud{position:relative;text-align:center}
  .lr-mkt .cloud svg{width:170px;height:auto;stroke:var(--green);fill:none;stroke-width:2.4}
  .lr-mkt .cloud .cl-word{position:absolute;top:48%;left:50%;transform:translate(-50%,-50%);display:flex;align-items:center;gap:7px;font-family:var(--serif);font-weight:600;font-size:18px}
  .lr-mkt .cloud .cl-word .logo-mark{width:26px;height:26px}
  .lr-mkt .hipaa-badge{margin-top:18px;display:inline-flex;align-items:center;gap:9px;font-family:var(--mono);font-size:11px;letter-spacing:.1em;color:var(--green);border:1px solid rgba(111,207,151,.3);background:rgba(111,207,151,.07);border-radius:999px;padding:7px 15px}
  .lr-mkt .hipaa-badge svg{width:15px;height:15px;stroke:var(--green);fill:none;stroke-width:2}
  .lr-mkt .onprem-copy h2{font-size:clamp(30px,4vw,46px)}
  .lr-mkt .onprem-copy p{color:var(--muted);font-size:16.5px;margin-top:16px;max-width:440px}
  .lr-mkt .onprem-copy .btn{margin-top:24px}

  /* INTEGRATION CARDS */
  .lr-mkt .icards{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:46px}
  .lr-mkt .icard{background:linear-gradient(180deg,var(--surface),var(--bg-2));border:1px solid var(--line);border-radius:18px;padding:26px 24px;transition:.25s}
  .lr-mkt .icard:hover{transform:translateY(-4px);border-color:rgba(245,166,35,.32)}
  .lr-mkt .icard .ih{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
  .lr-mkt .icard h3{font-size:21px}
  .lr-mkt .icard .tag{font-family:var(--mono);font-size:10px;color:var(--amber-lite);border:1px solid var(--line);border-radius:999px;padding:5px 11px;letter-spacing:.06em}
  .lr-mkt .icard p{color:var(--muted);font-size:14px}
  .lr-mkt .icard .mini{margin-top:18px;border:1px solid var(--line-soft);border-radius:12px;padding:14px;display:flex;align-items:center;justify-content:center;gap:10px;background:rgba(255,255,255,.015);min-height:78px}
  .lr-mkt .icard .mini .code{font-family:var(--mono);font-size:12px;color:var(--amber);background:rgba(245,133,63,.08);border:1px solid var(--line-soft);border-radius:8px;padding:8px 12px}
  .lr-mkt .icard .mini .arrow{color:var(--faint)}
  .lr-mkt .icard .mini .node{font-family:var(--mono);font-size:11px;color:var(--cream);border:1px solid var(--line-soft);border-radius:7px;padding:7px 10px}
  .lr-mkt .icard .mini .sys{display:flex;flex-direction:column;gap:5px}
  .lr-mkt .icard .mini .sys i{background:#fff;color:#1a1a1a;font-size:9px;font-weight:700;border-radius:4px;padding:3px 7px;font-style:normal;text-align:center}

  /* PRICING (dual labs) */
  .lr-mkt .pricing{padding:46px 0}
  .lr-mkt .price-grid{display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:44px;max-width:920px;margin-left:auto;margin-right:auto}
  .lr-mkt .pcard{position:relative;border-radius:22px;padding:32px 30px;background:linear-gradient(180deg,var(--surface),var(--bg-2));border:1px solid var(--line)}
  .lr-mkt .pcard.auto{background:linear-gradient(var(--bg-2),var(--bg-2)) padding-box,var(--grad) border-box;border:1.5px solid transparent;box-shadow:0 30px 70px rgba(232,116,59,.16)}
  .lr-mkt .ptag{position:absolute;top:-13px;left:26px;font-family:var(--mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;font-weight:600;padding:6px 13px;border-radius:999px;display:inline-flex;align-items:center;gap:7px}
  .lr-mkt .ptag.manual{background:var(--surface-2);border:1px solid var(--line);color:var(--green)}
  .lr-mkt .ptag.full{background:var(--grad);color:#1a0f02}
  .lr-mkt .ptag .dot{width:6px;height:6px;border-radius:50%;background:currentColor}
  .lr-mkt .pcard .pname{font-family:var(--serif);font-size:24px}
  .lr-mkt .pcard .pdesc{color:var(--muted);font-size:13.5px;margin-top:4px}
  .lr-mkt .price-box{border:1px solid var(--line-soft);border-radius:14px;padding:16px 18px;margin:20px 0}
  .lr-mkt .price-box .main{display:flex;align-items:flex-end;gap:7px}
  .lr-mkt .price-box .main .amt{font-family:var(--serif);font-size:42px;line-height:.9;color:var(--cream)}
  .lr-mkt .price-box .main .per{font-size:13px;color:var(--muted);margin-bottom:5px}
  .lr-mkt .price-box .div{height:1px;background:var(--line-soft);margin:13px 0}
  .lr-mkt .price-box .sub .amt2{font-family:var(--serif);font-size:24px;color:var(--cream)}
  .lr-mkt .price-box .sub .l2{font-size:13px;color:var(--muted)}
  .lr-mkt .price-box .sub small{display:block;font-family:var(--mono);font-size:10px;color:var(--faint);margin-top:3px}
  .lr-mkt .bonus{display:flex;align-items:center;gap:11px;border:1px solid rgba(111,207,151,.3);background:rgba(111,207,151,.07);border-radius:13px;padding:12px 14px;margin-bottom:20px}
  .lr-mkt .bonus .bi{width:30px;height:30px;border-radius:9px;background:rgba(111,207,151,.14);display:grid;place-items:center;flex-shrink:0}
  .lr-mkt .bonus .bi svg{width:16px;height:16px;stroke:var(--green);fill:none;stroke-width:2}
  .lr-mkt .bonus b{font-size:13.5px;color:var(--green)}
  .lr-mkt .bonus span{display:block;font-family:var(--mono);font-size:10.5px;color:var(--muted);margin-top:2px}
  .lr-mkt .pcard ul{list-style:none;display:flex;flex-direction:column;gap:12px;margin-bottom:22px}
  .lr-mkt .pcard li{display:flex;align-items:flex-start;gap:11px;font-size:14px;color:var(--cream)}
  .lr-mkt .pcard li svg{width:18px;height:18px;flex-shrink:0;margin-top:2px;stroke:var(--green);fill:none;stroke-width:2}
  .lr-mkt .pcard .pbtn{display:block;text-align:center;padding:14px;border-radius:12px;font-weight:600;font-size:14.5px;cursor:pointer;transition:.2s}
  .lr-mkt .pcard .pbtn.dark{background:#0d0b08;border:1px solid var(--line);color:var(--cream)}
  .lr-mkt .pcard .pbtn.dark:hover{border-color:rgba(245,166,35,.4)}
  .lr-mkt .pcard .pbtn.go{background:var(--grad);color:#1a0f02;box-shadow:0 0 30px rgba(245,133,63,.3)}
  .lr-mkt .price-foot{text-align:center;margin-top:30px;font-size:15px;color:var(--muted)}
  .lr-mkt .price-foot a{color:var(--amber-lite);font-weight:600}

  @media(max-width:920px){
    .lr-mkt .hero-grid{grid-template-columns:1fr;gap:36px}
    .lr-mkt .integ,.lr-mkt .onprem{grid-template-columns:1fr;gap:28px}
    .lr-mkt .onprem-copy{order:2}.lr-mkt .onprem-visual{order:1}
    .lr-mkt .icards{grid-template-columns:1fr;max-width:420px;margin-left:auto;margin-right:auto}
    .lr-mkt .price-grid{grid-template-columns:1fr;max-width:440px}
  }
  @media(max-width:560px){
    .lr-mkt .ldash{grid-template-columns:1fr}
    .lr-mkt .ld-side{flex-direction:row;flex-wrap:wrap;align-items:center;border-right:none;border-bottom:1px solid var(--line-soft)}
    .lr-mkt .ld-nav{flex-direction:row;flex-wrap:wrap}
    .lr-mkt .ld-up{margin:0}
    .lr-mkt .ld-trends{grid-template-columns:1fr}
  }
`;

const ARROW = <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
const PLUS = <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>;
const CHECK = <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>;
const UP = <svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7" /></svg>;
// TODO: B2B contact/pilot route — point pilot/quote/call/get-started CTAs here when it exists.
const B2B = "/get-started";

function ForLabs() {
  const rootRef = useRef<HTMLDivElement>(null);
  useMarketingEffects(rootRef);

  return (
    <div className="lr-mkt" ref={rootRef}>
      <style dangerouslySetInnerHTML={{ __html: MARKETING_CSS + pageCss }} />
      <SvgDefs />

      <MarketingNav
        active="labs"
        topbar={<>Your lab's interpretation layer — <b>your brand, your region, your stack</b> &nbsp;<a href="#pricing">See pricing →</a></>}
        cta={{ label: "Start a pilot", href: B2B }}
      />

      {/* HERO */}
      <header className="hero"><div className="wrap hero-grid">
        <div className="hero-copy">
          <div className="hero-badge"><svg viewBox="0 0 24 24"><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-3" /></svg>White-label for labs &amp; clinics</div>
          <h1>AI interpretation,<br />wired into <span className="ital live">your lab.</span></h1>
          <p className="hero-sub">labread reads the formats you already export — HL7, FHIR, CSV — and hands back clinician- and patient-ready reports under your own brand, with secure keys and <b>delivery tuned to your region.</b></p>
          <div className="hero-cta">
            <Link className="btn btn-amber" to={B2B}>Start a pilot {PLUS}</Link>
            <a className="btn btn-ghost" href="#integration">See integrations</a>
          </div>
          <div className="hero-stats">
            <div className="s"><b>HL7 · FHIR</b><span>Standards-native</span></div>
            <div className="s"><b>Days</b><span>To go live</span></div>
            <div className="s"><b>50+</b><span>Biomarkers read</span></div>
          </div>
        </div>

        {/* lab dashboard mock */}
        <div className="lab-stage rv">
          <div className="ldash">
            <div className="ld-side">
              <div className="ld-brand"><div className="ld-logo">D</div><div className="ld-bn">DemoLab</div></div>
              <div className="ld-nav">
                <a className="on"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></svg>Dashboard</a>
                <a><svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3 3-5 6-5s6 2 6 5" /></svg>Patients</a>
                <a><svg viewBox="0 0 24 24"><path d="M4 4h16v16H4z" /><path d="M8 9h8M8 13h5" /></svg>Catalogue</a>
                <a><svg viewBox="0 0 24 24"><path d="M12 3v18M5 8l7-5 7 5" /></svg>API keys</a>
              </div>
              <div className="ld-up"><div className="ui">Drop file · PDF, JPG, PNG</div><div className="ub">+ New analysis</div></div>
            </div>
            <div className="ld-main">
              <div className="ld-title">Analyses comparison</div>
              <div className="ld-cmp">
                <div className="col"><div className="l">Birth date</div><div className="v">01/01/1990</div><div className="l" style={{ marginTop: "7px" }}>Gender</div><div className="v">Male</div></div>
                <div className="col"><div className="l">Test date</div><div className="v">01/01/2026</div><div className="l" style={{ marginTop: "7px" }}>Analyzed</div><div className="v">01/11/2026</div></div>
                <div className="docs"><div className="doc">filev1.pdf</div><div className="doc">filev2.pdf</div><div className="doc">filev3.pdf</div></div>
              </div>
              <div className="ld-totals">
                <div className="ld-tot"><b>23</b><span>Total tests</span></div>
                <div className="ld-tot"><b>37</b><span>Routine tests</span></div>
                <div className="ld-tot"><b>2</b><span>Abnormal</span></div>
              </div>
              <div className="ld-sub">Historical trends</div>
              <div className="ld-trends">
                <div className="ld-tr"><h6>Lymphocyte count</h6><div className="u">x10³/µL</div>
                  <svg viewBox="0 0 140 38" preserveAspectRatio="none"><rect x="0" y="6" width="140" height="22" fill="rgba(111,207,151,.12)" /><polyline points="10,24 50,22 90,16 130,18" fill="none" stroke="url(#ringGrad)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /><circle cx="90" cy="16" r="4" fill="var(--bg)" stroke="var(--green)" strokeWidth="2.4" /></svg>
                </div>
                <div className="ld-tr"><h6>Mean corp. hemoglobin</h6><div className="u">pg</div>
                  <svg viewBox="0 0 140 38" preserveAspectRatio="none"><rect x="0" y="6" width="140" height="22" fill="rgba(111,207,151,.12)" /><polyline points="10,20 50,20 90,19 130,19" fill="none" stroke="url(#ringGrad)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /><circle cx="90" cy="19" r="4" fill="var(--bg)" stroke="var(--green)" strokeWidth="2.4" /></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div></header>

      {/* INTEGRATION FLOW */}
      <section className="sec" id="integration"><div className="wrap integ">
        <div className="integ-copy rv">
          <span className="eyebrow">Connected end to end</span>
          <h2>Plugs into the systems you <span className="ital">already run.</span></h2>
          <p>Connect labread to your existing LIS and EHR. Automate interpretation, reporting, and follow-ups to cut manual workload and speed up turnaround — no rip-and-replace.</p>
          <Link className="btn btn-amber" to={B2B}>Get a quote {ARROW}</Link>
        </div>
        <div className="flow-diagram rv">
          <div className="fd-grid">
            <div className="fd-sources">
              <div className="fd-chip">Epic</div>
              <div className="fd-chip">Cerner</div>
              <div className="fd-chip">Allscripts</div>
              <div className="fd-chip">MEDITECH</div>
              <div className="fd-chip add">{PLUS}Add your own</div>
            </div>
            <div className="fd-core">
              <div className="api">API · HL7 · FHIR</div>
              <div className="box"><svg viewBox="0 0 120 120"><use href="#lm" /></svg>labread</div>
              <div className="iris">Standards engine</div>
            </div>
            <div className="fd-out">
              <div className="fd-o"><div className="oi"><svg viewBox="0 0 24 24"><path d="M6 2h9l5 5v15H6z" /><path d="M14 2v6h6" /></svg></div>PDF report</div>
              <div className="fd-o"><div className="oi"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M3 9h18" /></svg></div>Web interface</div>
            </div>
          </div>
        </div>
      </div></section>

      {/* ON-PREMISE */}
      <section className="sec"><div className="wrap onprem">
        <div className="onprem-visual rv">
          <div className="cloud">
            <svg viewBox="0 0 200 120"><path d="M55 95a30 30 0 0 1 0-60 38 38 0 0 1 73-8 26 26 0 0 1 12 68z" /></svg>
            <div className="cl-word"><svg className="logo-mark"><use href="#lm" /></svg>labread</div>
          </div>
          <div className="hipaa-badge" style={{ position: "absolute", bottom: "22px" }}><svg viewBox="0 0 24 24"><path d="M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6z" /><path d="M9 12l2 2 4-4" /></svg>HIPAA-compliant</div>
        </div>
        <div className="onprem-copy rv">
          <span className="eyebrow">Deploy your way</span>
          <h2>Keep it all <span className="ital">behind your walls.</span></h2>
          <p>Run labread entirely on your own servers for full control, or let us host it on a secure, HIPAA-compliant cloud with region-friendly delivery. Same engine — your call on where it lives.</p>
          <Link className="btn btn-dark" to={B2B}>Talk to our team {ARROW}</Link>
        </div>
      </div></section>

      {/* INTEGRATION CARDS */}
      <section className="sec" id="learn"><div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow">Built for labs</span>
          <h2>Three ways to <span className="ital">connect.</span></h2>
        </div>
        <div className="icards">
          <div className="icard rv">
            <div className="ih"><h3>Hosted portals</h3><span className="tag">No-code</span></div>
            <p>Ready-made portals for your lab, your clinicians, and your patients. Share reports securely with nothing to build.</p>
            <div className="mini"><div className="sys"><i style={{ background: "var(--grad)", color: "#1a0f02" }}>DemoLab</i><i style={{ background: "rgba(255,255,255,.06)", color: "var(--cream)" }}>Branded portal</i></div></div>
          </div>
          <div className="icard rv">
            <div className="ih"><h3>Direct API</h3><span className="tag">Developers</span></div>
            <p>A clean REST API. Pull structured results and interpretation straight into the LIS or EHR you already run.</p>
            <div className="mini"><span className="code">{"{ API }"}</span><span className="arrow">→</span><span className="node">LIS / EHR</span></div>
          </div>
          <div className="icard rv">
            <div className="ih"><h3>Standards-native</h3><span className="tag">HL7 · FHIR</span></div>
            <p>Speaks HL7 and FHIR out of the box for secure, automated, high-volume result processing.</p>
            <div className="mini"><div className="sys"><i style={{ color: "#d32f2f" }}>Epic</i><i style={{ color: "#1976d2" }}>Cerner</i></div><span className="arrow">→</span><span className="node">FHIR</span></div>
          </div>
        </div>
      </div></section>

      {/* PRICING */}
      <section className="sec pricing" id="pricing"><div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow">Pricing for labs &amp; clinics</span>
          <h2>Subscription plus <span className="ital">pay-per-biomarker.</span></h2>
          <p>Start with a free bonus pool to test without transaction fees. Scale as your volume grows.</p>
        </div>
        <div className="price-grid">
          <div className="pcard rv">
            <span className="ptag manual"><span className="dot" />Hosted</span>
            <div className="pname">Hosted portals</div>
            <div className="pdesc">Run everything from the web platform</div>
            <div className="price-box">
              <div className="main"><span className="amt">$149</span><span className="per">monthly fee</span></div>
              <div className="div" />
              <div className="sub"><span className="amt2">$0.04</span> <span className="l2">per analyzed biomarker</span></div>
            </div>
            <div className="bonus">
              <div className="bi">{UP}</div>
              <div><b>10,000 free biomarkers to start</b><span>Test the whole thing with no transaction fees</span></div>
            </div>
            <ul>
              <li>{CHECK}Full web platform access</li>
              <li>{CHECK}Report generation &amp; localization</li>
              <li>{CHECK}Basic branding included</li>
            </ul>
            <Link className="pbtn dark" to={B2B}>Get started</Link>
          </div>

          <div className="pcard auto rv">
            <span className="ptag full"><span className="dot" />Automated</span>
            <div className="pname">Connected API</div>
            <div className="pdesc">Direct API access with volume pricing</div>
            <div className="price-box">
              <div className="main"><span className="amt">$549</span><span className="per">monthly fee</span></div>
              <div className="div" />
              <div className="sub"><span className="amt2">$0.01–0.04</span> <span className="l2">per biomarker</span><small>Lower as your volume grows</small></div>
            </div>
            <div className="bonus">
              <div className="bi">{UP}</div>
              <div><b>30,000 free biomarkers to start</b><span>Test the whole thing with no transaction fees</span></div>
            </div>
            <ul>
              <li>{CHECK}RESTful API access</li>
              <li>{CHECK}Report generation &amp; localization</li>
              <li>{CHECK}Branding &amp; integration included</li>
            </ul>
            <Link className="pbtn go" to={B2B}>Book a call</Link>
          </div>
        </div>
        <p className="price-foot">Just one practitioner? Our <Link to="/for-doctors">Practice plan →</Link> is built for you.</p>
      </div></section>

      {/* FINAL CTA */}
      <section className="final"><div className="wrap">
        <h2>Stand up your interpretation layer <span className="ital">in days.</span></h2>
        <p>Start a pilot and we'll map labread onto your existing outputs, your branding, and your region.</p>
        <div className="hero-cta">
          <Link className="btn btn-amber" to={B2B}>Start a pilot {PLUS}</Link>
          <a className="btn btn-ghost" href="#integration">See integrations</a>
        </div>
      </div></section>

      <MarketingFooter copy="© 2026 labread · Enterprise-grade interpretation, your brand, your region." />
    </div>
  );
}
