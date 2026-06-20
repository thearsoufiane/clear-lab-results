import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import {
  MARKETING_CSS, CONSOLE_CSS, SvgDefs, MarketingNav, MarketingFooter,
  ConsoleHero, useMarketingEffects, type TickerItem,
} from "@/components/marketing";

export const Route = createFileRoute("/for-you")({
  head: () => ({
    meta: [
      { title: "labread — Your blood, fully read" },
      { name: "description", content: "labread turns every lab result into plain-language insight you and your family can actually follow — read, explained, and tracked the moment you upload." },
      { property: "og:title", content: "labread — Your blood, fully read" },
      { property: "og:description", content: "Plain-language results, AI coaching, and family health tracking from any lab test." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://labread.health/for-you" },
      { property: "og:image", content: "https://labread.health/og-image.png" },
    ],
    links: [
      { rel: "canonical", href: "https://labread.health/for-you" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" as const },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" },
    ],
  }),
  component: ForYou,
});

const pageCss = `
  .lr-mkt .sec{position:relative;padding:30px 0}
  .lr-mkt .sec-head{text-align:center;max-width:680px;margin:0 auto 8px}
  .lr-mkt .sec-head h2{font-size:clamp(32px,4.4vw,52px);margin-top:16px}
  .lr-mkt .sec-head p{color:var(--muted);font-size:17px;margin-top:16px}

  /* JOURNEY TIMELINE */
  .lr-mkt .journey{position:relative;padding:50px 0 20px}
  .lr-mkt .spine{position:absolute;left:50%;top:0;bottom:90px;width:2px;background:linear-gradient(180deg,transparent,var(--line),var(--line),transparent);transform:translateX(-50%)}
  .lr-mkt .step{position:relative;display:grid;grid-template-columns:1fr 92px 1fr;align-items:center;gap:0;margin:0 0 60px}
  .lr-mkt .step-node{grid-column:2;justify-self:center;width:54px;height:54px;border-radius:50%;background:var(--bg-2);border:1px solid var(--line);display:grid;place-items:center;font-family:var(--serif);font-size:20px;color:var(--amber-lite);position:relative;z-index:2;box-shadow:0 0 0 8px var(--bg),0 0 30px rgba(245,133,63,.25)}
  .lr-mkt .step-copy{padding:6px 0}
  .lr-mkt .step-copy .k{font-family:var(--mono);font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--amber);margin-bottom:12px}
  .lr-mkt .step-copy h3{font-size:clamp(26px,3.2vw,38px)}
  .lr-mkt .step-copy p{color:var(--muted);font-size:16px;margin-top:14px;max-width:420px}
  .lr-mkt .step-list{margin-top:18px;display:flex;flex-direction:column;gap:11px}
  .lr-mkt .step-list li{list-style:none;display:flex;align-items:center;gap:11px;font-size:15px;color:var(--cream)}
  .lr-mkt .step-list svg{width:19px;height:19px;flex-shrink:0;stroke:var(--green);fill:none;stroke-width:2}
  .lr-mkt .step.rev .step-copy{order:3;text-align:left}
  .lr-mkt .step.rev .step-mock{order:1}
  .lr-mkt .step-copy.left{text-align:right}
  .lr-mkt .step-copy.left p,.lr-mkt .step-copy.left .step-list{margin-left:auto}
  .lr-mkt .step-copy.left .step-list li{justify-content:flex-end;flex-direction:row-reverse}
  .lr-mkt .step-mock{padding:6px 0}

  /* mini cards used in steps */
  .lr-mkt .panel{background:linear-gradient(180deg,rgba(28,22,13,.92),rgba(17,14,10,.95));border:1px solid var(--line);border-radius:18px;box-shadow:0 28px 64px rgba(0,0,0,.5)}
  .lr-mkt .stack{display:flex;flex-direction:column;gap:14px;position:relative}
  .lr-mkt .float-l{margin-left:0}.lr-mkt .float-r{margin-left:auto}

  .lr-mkt .g-head{display:flex;justify-content:space-between;align-items:center;font-family:var(--mono);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--faint);margin-bottom:16px}
  .lr-mkt .g-ok{color:var(--green);display:inline-flex;align-items:center;gap:7px}
  .lr-mkt .g-ok .dot{width:6px;height:6px;border-radius:50%;background:var(--green);box-shadow:0 0 8px var(--green)}
  .lr-mkt .g-marker{display:flex;align-items:center;gap:11px;margin-bottom:6px}
  .lr-mkt .g-ic{width:34px;height:34px;border-radius:10px;background:rgba(245,133,63,.12);border:1px solid var(--line);display:grid;place-items:center;font-family:var(--serif);color:var(--amber-lite);font-size:15px;font-weight:600}
  .lr-mkt .g-mname{font-size:15px;font-weight:600}
  .lr-mkt .g-mval{font-family:var(--mono);font-size:12px;color:var(--muted)}
  .lr-mkt .g-mval b{color:var(--green)}
  .lr-mkt .range{margin:16px 0 6px;position:relative}
  .lr-mkt .range-track{display:flex;gap:3px;height:9px}
  .lr-mkt .range-track i{flex:1;border-radius:3px;opacity:.9}
  .lr-mkt .range-track i.r{background:var(--red)}
  .lr-mkt .range-track i.w{background:var(--warn)}
  .lr-mkt .range-track i.g{background:var(--green);flex:2.1}
  .lr-mkt .range-mark{position:absolute;top:-5px;width:3px;height:19px;border-radius:2px;background:var(--cream);box-shadow:0 0 0 3px rgba(11,9,7,.85),0 0 14px rgba(244,236,223,.7);left:0;transition:left 1.1s cubic-bezier(.22,1,.36,1)}
  .lr-mkt .range-scale{display:flex;justify-content:space-between;font-family:var(--mono);font-size:9.5px;color:var(--faint);margin-top:8px}
  .lr-mkt .g-insight{margin-top:14px;border:1px solid rgba(245,133,63,.2);background:rgba(245,133,63,.06);border-radius:11px;padding:11px 13px;font-size:13px;color:var(--cream);line-height:1.5}
  .lr-mkt .g-insight b{color:var(--amber-lite)}

  .lr-mkt .ring{display:flex;flex-direction:column;align-items:center;gap:6px}
  .lr-mkt .ring svg{width:52px;height:52px;transform:rotate(-90deg)}
  .lr-mkt .ring .rc-bg{stroke:rgba(245,166,35,.14)}
  .lr-mkt .ring .rc-fg{stroke:url(#ringGrad);stroke-linecap:round;transition:stroke-dashoffset 1.3s cubic-bezier(.22,1,.36,1)}
  .lr-mkt .ring .pct{font-family:var(--mono);font-size:12px;fill:var(--cream);transform:rotate(90deg);transform-origin:center}
  .lr-mkt .ring small{font-family:var(--mono);font-size:9.5px;color:var(--muted);letter-spacing:.04em}

  .lr-mkt .anna-orb{width:34px;height:34px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#1c160d,#0b0907);border:1px solid var(--line);display:grid;place-items:center;flex-shrink:0;position:relative}
  .lr-mkt .anna-orb::before{content:"";position:absolute;inset:0;border-radius:50%;box-shadow:0 0 16px rgba(111,207,151,.5);animation:lmpulse 2.6s ease-in-out infinite}
  .lr-mkt .anna-orb i{width:4px;height:4px;border-radius:50%;background:var(--green);box-shadow:8px 0 0 var(--amber-lite),-8px 0 0 var(--amber),0 8px 0 var(--green),0 -8px 0 var(--amber-lite);animation:spin 4s linear infinite}

  /* chat mock */
  .lr-mkt .chat{padding:18px}
  .lr-mkt .chat .row{display:flex;gap:10px;margin-bottom:14px;align-items:flex-end}
  .lr-mkt .chat .row.me{flex-direction:row-reverse}
  .lr-mkt .bub{max-width:78%;padding:11px 14px;border-radius:14px;font-size:13.5px;line-height:1.5}
  .lr-mkt .bub.me{background:var(--grad);color:#1a0f02;border-bottom-right-radius:5px;font-weight:500}
  .lr-mkt .bub.ai{background:rgba(255,255,255,.035);border:1px solid var(--line-soft);border-bottom-left-radius:5px;color:var(--cream)}
  .lr-mkt .bub.ai b{color:var(--amber-lite)}
  .lr-mkt .bub.ai ul{margin:8px 0 2px;padding-left:16px;color:var(--muted)}
  .lr-mkt .bub.ai li{margin:3px 0}
  .lr-mkt .chat .ts{font-family:var(--mono);font-size:9.5px;color:var(--faint);text-align:center;margin-top:4px}

  /* recommendations cards */
  .lr-mkt .goal{padding:15px 17px;display:flex;gap:12px;align-items:flex-start}
  .lr-mkt .goal .gi{width:34px;height:34px;border-radius:10px;background:rgba(111,207,151,.12);display:grid;place-items:center;flex-shrink:0}
  .lr-mkt .goal .gi svg{width:18px;height:18px;stroke:var(--green);fill:none;stroke-width:2}
  .lr-mkt .goal h4{font-family:var(--sans);font-size:14px;font-weight:600}
  .lr-mkt .goal .tag{font-family:var(--mono);font-size:10px;color:var(--amber);letter-spacing:.1em;text-transform:uppercase}
  .lr-mkt .goal p{font-size:12.5px;color:var(--muted);margin-top:5px;line-height:1.5}
  .lr-mkt .macros{padding:15px 17px}
  .lr-mkt .macros .mh{display:flex;align-items:center;gap:9px;margin-bottom:14px}
  .lr-mkt .macros .mh .gi{width:30px;height:30px;border-radius:9px;background:rgba(245,133,63,.12);display:grid;place-items:center}
  .lr-mkt .macros .mh .gi svg{width:16px;height:16px;stroke:var(--amber);fill:none;stroke-width:2}
  .lr-mkt .macros .mh h4{font-size:14px;font-weight:600;font-family:var(--sans)}
  .lr-mkt .macro-row{display:flex;justify-content:space-between;gap:8px}
  .lr-mkt .macro{flex:1;text-align:center}
  .lr-mkt .macro svg{width:46px;height:46px;transform:rotate(-90deg)}
  .lr-mkt .macro .mv{font-family:var(--mono);font-size:12px;margin-top:5px;color:var(--cream)}
  .lr-mkt .macro .ml{font-size:10px;color:var(--faint)}
  .lr-mkt .kcal{text-align:center;flex:1;display:flex;flex-direction:column;justify-content:center;border-left:1px solid var(--line-soft)}
  .lr-mkt .kcal b{font-family:var(--serif);font-size:22px;color:var(--amber-lite)}
  .lr-mkt .kcal small{font-size:10px;color:var(--faint)}

  /* trend chart */
  .lr-mkt .trend{padding:16px 18px}
  .lr-mkt .trend .th{display:flex;align-items:center;gap:9px;margin-bottom:8px}
  .lr-mkt .trend .th .gi{width:26px;height:26px;border-radius:8px;background:var(--grad);display:grid;place-items:center;font-family:var(--mono);font-size:11px;color:#1a0f02;font-weight:600}
  .lr-mkt .trend .th h4{font-size:14px;font-weight:600;font-family:var(--sans)}
  .lr-mkt .trend .th .unit{font-family:var(--mono);font-size:10px;color:var(--faint);margin-left:auto}
  .lr-mkt .trend svg{width:100%;height:140px;display:block}
  .lr-mkt .trend .xax{display:flex;justify-content:space-between;font-family:var(--mono);font-size:9.5px;color:var(--faint);margin-top:6px;padding:0 2px}
  .lr-mkt .badge-good{display:inline-flex;align-items:center;gap:9px;background:rgba(111,207,151,.1);border:1px solid rgba(111,207,151,.3);border-radius:12px;padding:10px 14px;font-size:13px}
  .lr-mkt .badge-good svg{width:18px;height:18px;stroke:var(--green);fill:none;stroke-width:2}
  .lr-mkt .badge-good b{color:var(--green)}
  .lr-mkt .reminder{padding:15px 17px}
  .lr-mkt .reminder .rh{display:flex;align-items:center;gap:9px;font-size:13.5px;font-weight:600;margin-bottom:4px}
  .lr-mkt .reminder .rh svg{width:17px;height:17px;stroke:var(--amber);fill:none;stroke-width:2}
  .lr-mkt .reminder .when{font-family:var(--mono);font-size:11px;color:var(--faint);margin-bottom:11px}
  .lr-mkt .reminder ul{list-style:none;display:flex;flex-wrap:wrap;gap:6px;margin-bottom:13px}
  .lr-mkt .reminder li{font-family:var(--mono);font-size:11px;color:var(--muted);background:rgba(255,255,255,.03);border:1px solid var(--line-soft);border-radius:7px;padding:4px 8px}
  .lr-mkt .reminder .btn{padding:9px 16px;font-size:13px}

  /* FAMILY BAND */
  .lr-mkt .family{position:relative;margin:30px 0;padding:64px 0;overflow:hidden;border-top:1px solid var(--line-soft);border-bottom:1px solid var(--line-soft);background:linear-gradient(180deg,rgba(232,116,59,.08),rgba(245,166,35,.03))}
  .lr-mkt .family::before{content:"";position:absolute;bottom:-200px;left:50%;transform:translateX(-50%);width:900px;height:480px;background:radial-gradient(ellipse at center,rgba(245,133,63,.18),transparent 64%);filter:blur(20px)}
  .lr-mkt .family-in{position:relative;text-align:center;max-width:720px;margin:0 auto}
  .lr-mkt .fam-avatars{display:flex;justify-content:center;margin-bottom:26px}
  .lr-mkt .fam-avatars i{width:48px;height:48px;border-radius:50%;border:2px solid var(--bg);margin-left:-12px;background:var(--grad);display:grid;place-items:center;font-family:var(--serif);color:#1a0f02;font-weight:600;font-size:18px;box-shadow:0 8px 22px rgba(0,0,0,.4)}
  .lr-mkt .fam-avatars i:first-child{margin-left:0}
  .lr-mkt .family h2{font-size:clamp(34px,5vw,58px)}
  .lr-mkt .family p{color:var(--muted);font-size:17px;margin:18px auto 0;max-width:520px}
  .lr-mkt .family .hero-cta{justify-content:center}

  /* PRICING */
  .lr-mkt .pricing{padding:50px 0 20px}
  .lr-mkt .price-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:46px;align-items:start}
  .lr-mkt .pcard{position:relative;background:linear-gradient(180deg,var(--surface),var(--bg-2));border:1px solid var(--line);border-radius:20px;padding:30px 26px;transition:.25s}
  .lr-mkt .pcard:hover{transform:translateY(-4px);border-color:rgba(245,166,35,.34)}
  .lr-mkt .pcard.pop{border-color:transparent;background:linear-gradient(var(--bg-2),var(--bg-2)) padding-box,var(--grad) border-box;border:1.5px solid transparent;box-shadow:0 30px 70px rgba(232,116,59,.16)}
  .lr-mkt .pop-tag{position:absolute;top:-13px;right:24px;background:var(--grad);color:#1a0f02;font-family:var(--mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;font-weight:600;padding:6px 13px;border-radius:999px}
  .lr-mkt .pcard .pname{font-family:var(--serif);font-size:23px}
  .lr-mkt .pcard .price{display:flex;align-items:flex-end;gap:6px;margin:14px 0 4px}
  .lr-mkt .pcard .price .from{font-size:13px;color:var(--faint);margin-bottom:6px}
  .lr-mkt .pcard .price .amt{font-family:var(--serif);font-size:48px;line-height:1;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent}
  .lr-mkt .pcard .price .per{font-size:13px;color:var(--muted);margin-bottom:7px}
  .lr-mkt .pcard .pbtn{display:block;text-align:center;margin:20px 0 22px;padding:13px;border-radius:11px;font-weight:600;font-size:14.5px;cursor:pointer;transition:.2s}
  .lr-mkt .pcard .pbtn.sel{border:1px solid var(--line);color:var(--cream);background:rgba(255,255,255,.02)}
  .lr-mkt .pcard .pbtn.sel:hover{border-color:rgba(245,166,35,.4)}
  .lr-mkt .pcard .pbtn.go{background:var(--grad);color:#1a0f02;box-shadow:0 0 30px rgba(245,133,63,.3)}
  .lr-mkt .pcard ul{list-style:none;display:flex;flex-direction:column;gap:13px}
  .lr-mkt .pcard li{display:flex;align-items:flex-start;gap:11px;font-size:14px;color:var(--cream)}
  .lr-mkt .pcard li svg{width:18px;height:18px;flex-shrink:0;margin-top:2px;stroke:var(--green);fill:none;stroke-width:2}
  .lr-mkt .price-foot{text-align:center;margin-top:30px;font-size:14px;color:var(--muted)}
  .lr-mkt .price-foot b{color:var(--amber-lite)}

  /* FAQ */
  .lr-mkt .faq{max-width:760px;margin:0 auto;padding:20px 0}
  .lr-mkt .qa{border-top:1px solid var(--line-soft);padding:22px 0}
  .lr-mkt .qa:last-child{border-bottom:1px solid var(--line-soft)}
  .lr-mkt .qa h4{font-family:var(--serif);font-size:20px;font-weight:500;margin-bottom:9px}
  .lr-mkt .qa p{color:var(--muted);font-size:15px}

  @media(max-width:920px){
    .lr-mkt .step{grid-template-columns:1fr;gap:22px}
    .lr-mkt .step-node{grid-column:1;justify-self:start;margin-bottom:-6px}
    .lr-mkt .step .step-copy,.lr-mkt .step.rev .step-copy{order:1;text-align:left}
    .lr-mkt .step .step-mock,.lr-mkt .step.rev .step-mock{order:2}
    .lr-mkt .step-copy.left{text-align:left}
    .lr-mkt .step-copy.left p,.lr-mkt .step-copy.left .step-list{margin-left:0}
    .lr-mkt .step-copy.left .step-list li{justify-content:flex-start;flex-direction:row}
    .lr-mkt .price-grid{grid-template-columns:1fr;max-width:420px;margin-left:auto;margin-right:auto}
    .lr-mkt .pcard.pop{order:-1}
    .lr-mkt .spine{display:none}
  }
`;

const ARROW = <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
const CHECK = <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>;

const ticker: TickerItem[] = [
  { tone: "g", nm: "Ferritin", vl: "31 ng/mL", st: "Optimal" },
  { tone: "w", nm: "Vitamin D", vl: "24 ng/mL", st: "Low" },
  { tone: "g", nm: "HDL", vl: "1.6 mmol/L", st: "Optimal" },
  { tone: "r", nm: "TSH", vl: "4.8 mIU/L", st: "High" },
  { tone: "g", nm: "Glucose", vl: "5.1 mmol/L", st: "Optimal" },
  { tone: "g", nm: "Hemoglobin", vl: "14.2 g/dL", st: "Optimal" },
  { tone: "w", nm: "B12", vl: "312 pg/mL", st: "Low" },
  { tone: "g", nm: "Calcium", vl: "2.3 mmol/L", st: "Optimal" },
];

function ForYou() {
  const rootRef = useRef<HTMLDivElement>(null);
  useMarketingEffects(rootRef);

  return (
    <div className="lr-mkt" ref={rootRef}>
      <style dangerouslySetInnerHTML={{ __html: MARKETING_CSS + pageCss + CONSOLE_CSS }} />
      <SvgDefs />

      <MarketingNav
        active="you"
        topbar={<>One upload, every marker explained — <b>in plain words, in seconds</b> &nbsp;<a href="#pricing">See plans →</a></>}
        cta={{ label: "Start free", href: "/get-started" }}
      />

      <ConsoleHero
        badges={<>
          <span className="h-pill"><span className="d" />Live health console</span>
          <span className="h-pill ghost">AI-read · 50+ markers</span>
        </>}
        h1={<>Your blood,<br />fully <span className="ital">read.</span></>}
        sub={<>labread turns every lab result into a living picture of your health — <b>read, explained, and tracked</b> the moment you upload it.</>}
        ctas={<>
          <Link className="btn btn-amber" to="/get-started">Read my test {ARROW}</Link>
          <a className="btn btn-line" href="#journey">See how it works</a>
        </>}
        metrics={[
          { count: 82, suf: "%", label: "Markers in range" },
          { count: 50, suf: "+", label: "Markers read" },
          { count: 14, suf: "d", label: "Streak tracked" },
        ]}
        gaugeCenter={<>
          <text className="score" x="260" y="256" fontSize="58">82<tspan fontSize="26" dy="-22">%</tspan></text>
          <text className="lab" x="260" y="290" fontSize="12" letterSpacing="2">IN RANGE</text>
          <text className="lab" x="260" y="308" fontSize="9" letterSpacing="3" fill="#6F6557">12 OF 14 OPTIMAL</text>
        </>}
        panels={<>
          <div className="gpanel gp-anna" data-float="1.3">
            <div className="ah"><div className="orb"><i /></div><div><div className="an">Anna</div><div className="ar">your coach · online</div></div></div>
            <p>Your <b>iron is climbing</b> nicely — up 13 points. Keep the plan going 🙌</p>
          </div>
          <div className="gpanel gp-trend" data-float="1">
            <div className="th"><span className="tn">Ferritin</span><span className="tv">▲ 31 ng/mL</span></div>
            <svg viewBox="0 0 180 46" preserveAspectRatio="none"><rect x="0" y="8" width="180" height="26" fill="rgba(111,207,151,.1)" /><polyline points="8,40 55,37 105,20 175,12" fill="none" stroke="url(#tgrad)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /><circle cx="105" cy="20" r="4" fill="#0E0B08" stroke="#6FCF97" strokeWidth="2.4" /></svg>
          </div>
          <div className="gpanel gp-range" data-float="1.5">
            <div className="rh"><span>Ferritin</span><span className="ok">● optimal</span></div>
            <div className="rn"><div className="ric">Fe</div><div><div className="rnm">31 ng/mL</div><div className="rvl">up from 18 · 8 weeks</div></div></div>
            <div className="mini-track"><i className="r" /><i className="w" /><i className="g" /><i className="w" /><i className="r" /><div className="mini-mark" data-left="46%" /></div>
          </div>
          <div className="gpanel gp-streak" data-float="1.7">
            <svg className="sr" viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" fill="none" stroke="rgba(245,166,35,.14)" strokeWidth="4" /><circle cx="22" cy="22" r="18" fill="none" stroke="url(#ringG)" strokeWidth="4" strokeLinecap="round" strokeDasharray="113" strokeDashoffset="34" transform="rotate(-90 22 22)" /></svg>
            <div><div className="sb">14</div><div className="sl">day streak</div></div>
          </div>
        </>}
        ticker={ticker}
      />

      {/* JOURNEY */}
      <section className="sec journey" id="journey"><div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow">Your health journey</span>
          <h2>From confusing numbers to a plan you can <span className="ital">actually follow.</span></h2>
        </div>
        <div className="spine" />

        {/* STEP 1 */}
        <div className="step">
          <div className="step-copy left rv">
            <div className="k">Step 01</div>
            <h3>See what your blood is <span className="ital">actually saying</span></h3>
            <p>Snap a photo or drop a PDF from any lab. labread pulls every value, flags what sits outside your range, and explains it the way a person would — no decoder ring required.</p>
            <ul className="step-list">
              <li>{CHECK}Reads any lab, any format, any language</li>
              <li>{CHECK}In-range or out, clear at a glance</li>
              <li>{CHECK}Answers the second you upload</li>
            </ul>
          </div>
          <div className="step-node rv">01</div>
          <div className="step-mock rv">
            <div className="stack" style={{ maxWidth: "380px" }}>
              <div className="panel" style={{ padding: "14px 16px", display: "flex", gap: "18px" }}>
                <div className="ring"><svg viewBox="0 0 44 44"><circle className="rc-bg" cx="22" cy="22" r="18" fill="none" strokeWidth="4" /><circle className="rc-fg" cx="22" cy="22" r="18" fill="none" strokeWidth="4" strokeDasharray="113" strokeDashoffset="113" data-pct="82" /><text className="pct" x="22" y="26" textAnchor="middle">82%</text></svg><small>Metabolic</small></div>
                <div className="ring"><svg viewBox="0 0 44 44"><circle className="rc-bg" cx="22" cy="22" r="18" fill="none" strokeWidth="4" /><circle className="rc-fg" cx="22" cy="22" r="18" fill="none" strokeWidth="4" strokeDasharray="113" strokeDashoffset="113" data-pct="76" /><text className="pct" x="22" y="26" textAnchor="middle">76%</text></svg><small>Hormonal</small></div>
                <div className="ring"><svg viewBox="0 0 44 44"><circle className="rc-bg" cx="22" cy="22" r="18" fill="none" strokeWidth="4" /><circle className="rc-fg" cx="22" cy="22" r="18" fill="none" strokeWidth="4" strokeDasharray="113" strokeDashoffset="113" data-pct="64" /><text className="pct" x="22" y="26" textAnchor="middle">64%</text></svg><small>Iron</small></div>
              </div>
              <div className="panel" style={{ padding: "18px" }}>
                <div className="g-head"><span>Ferritin</span><span style={{ color: "var(--warn)" }}>● Low</span></div>
                <div className="g-marker"><div className="g-ic" style={{ background: "rgba(227,169,74,.14)", color: "var(--warn)" }}>Fe</div><div><div className="g-mname">Ferritin</div><div className="g-mval">18 ng/mL · below optimal</div></div></div>
                <div className="range">
                  <div className="range-track"><i className="r" /><i className="w" /><i className="g" /><i className="w" /><i className="r" /></div>
                  <div className="range-mark" data-left="20%" />
                  <div className="range-scale"><span>0</span><span>30</span><span>150</span><span>200</span></div>
                </div>
                <div className="g-insight">Low ferritin can explain fatigue and low energy. <b>Anna built you a plan</b> to bring it back up.</div>
              </div>
            </div>
          </div>
        </div>

        {/* STEP 2 */}
        <div className="step rev">
          <div className="step-mock rv">
            <div className="panel chat float-r" style={{ maxWidth: "390px" }}>
              <div className="row me"><div className="bub me">Why is my ferritin low and should I worry?</div></div>
              <div className="row"><div className="anna-orb"><i /></div><div className="bub ai">Your ferritin is <b>18 ng/mL</b> — a bit under the optimal range, which often shows up as tiredness. It's common and very fixable. Here's where I'd start:
                <ul><li>Iron-rich foods (red meat, lentils, spinach)</li><li>Pair them with vitamin C to absorb more</li><li>Re-test in ~8 weeks to confirm the climb</li></ul>
              </div></div>
              <div className="ts">10:02</div>
            </div>
          </div>
          <div className="step-node rv">02</div>
          <div className="step-copy rv">
            <div className="k">Step 02</div>
            <h3>Ask <span className="ital">Anna</span> anything</h3>
            <p>Your AI health coach knows your full history. Ask what a marker means, why it changed, or what to do next — and get a calm, clear answer any time, day or night.</p>
            <ul className="step-list">
              <li>{CHECK}Remembers every test you've uploaded</li>
              <li>{CHECK}Plain answers, never scary jargon</li>
              <li>{CHECK}Prep for your next doctor visit</li>
            </ul>
          </div>
        </div>

        {/* STEP 3 */}
        <div className="step">
          <div className="step-copy left rv">
            <div className="k">Step 03</div>
            <h3>Get a plan, <span className="ital">not just numbers</span></h3>
            <p>Numbers only help if you know what to do with them. labread turns yours into a personal plan — food, supplements, habits — matched to exactly what your body needs right now.</p>
            <ul className="step-list">
              <li>{CHECK}A meal plan shaped by your results</li>
              <li>{CHECK}Supplements that target what's low</li>
              <li>{CHECK}Sleep &amp; stress habits that move markers</li>
            </ul>
          </div>
          <div className="step-node rv">03</div>
          <div className="step-mock rv">
            <div className="stack" style={{ maxWidth: "380px" }}>
              <div className="panel goal">
                <div className="gi"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg></div>
                <div><div className="tag">Your confirmed goal</div><h4>Restore iron &amp; energy</h4><p>Focus on iron-rich, vitamin-C-paired meals to lift ferritin back into range over the next 8 weeks.</p></div>
              </div>
              <div className="panel macros">
                <div className="mh"><div className="gi"><svg viewBox="0 0 24 24"><path d="M4 11h16M4 15h16M10 3v18" /></svg></div><h4>Daily meal plan</h4></div>
                <div className="macro-row">
                  <div className="macro"><svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="17" fill="none" stroke="rgba(245,166,35,.14)" strokeWidth="4" /><circle cx="22" cy="22" r="17" fill="none" stroke="var(--amber-lite)" strokeWidth="4" strokeLinecap="round" strokeDasharray="107" strokeDashoffset="64" /></svg><div className="mv">~180g</div><div className="ml">Carbs</div></div>
                  <div className="macro"><svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="17" fill="none" stroke="rgba(245,166,35,.14)" strokeWidth="4" /><circle cx="22" cy="22" r="17" fill="none" stroke="var(--green)" strokeWidth="4" strokeLinecap="round" strokeDasharray="107" strokeDashoffset="75" /></svg><div className="mv">~120g</div><div className="ml">Protein</div></div>
                  <div className="macro"><svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="17" fill="none" stroke="rgba(245,166,35,.14)" strokeWidth="4" /><circle cx="22" cy="22" r="17" fill="none" stroke="var(--amber-deep)" strokeWidth="4" strokeLinecap="round" strokeDasharray="107" strokeDashoffset="75" /></svg><div className="mv">~65g</div><div className="ml">Fat</div></div>
                  <div className="kcal"><b>2,000</b><small>kcal goal</small></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STEP 4 */}
        <div className="step rev">
          <div className="step-mock rv">
            <div className="stack float-r" style={{ maxWidth: "400px" }}>
              <div className="badge-good"><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg><span><b>Good progress</b> — 80% of your markers improved</span></div>
              <div className="panel trend">
                <div className="th"><div className="gi">Fe</div><h4>Ferritin</h4><span className="unit">ng/mL</span></div>
                <svg viewBox="0 0 320 140" preserveAspectRatio="none">
                  <rect x="0" y="0" width="320" height="40" fill="rgba(224,112,106,.10)" />
                  <rect x="0" y="40" width="320" height="26" fill="rgba(227,169,74,.10)" />
                  <rect x="0" y="66" width="320" height="48" fill="rgba(111,207,151,.12)" />
                  <rect x="0" y="114" width="320" height="26" fill="rgba(227,169,74,.10)" />
                  <polyline className="trend-line" points="20,108 95,104 170,78 245,58 300,52" fill="none" stroke="url(#ringGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="245" cy="58" r="6" fill="var(--bg)" stroke="var(--green)" strokeWidth="3" />
                  <g transform="translate(245,38)"><rect x="-17" y="-15" width="34" height="20" rx="6" fill="var(--green)" /><text x="0" y="-1" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="11" fill="#0b0907">31</text></g>
                </svg>
                <div className="xax"><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span></div>
              </div>
              <div className="panel reminder">
                <div className="rh"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 8v4l3 2" /></svg>Follow-up testing</div>
                <div className="when">In about 4 weeks</div>
                <ul><li>Ferritin</li><li>Vitamin B12</li><li>Folate</li><li>Vitamin D</li></ul>
                <Link className="btn btn-amber" to="/get-started">Remind me <svg viewBox="0 0 24 24"><path d="M4 4h16v12H7l-3 3z" /></svg></Link>
              </div>
            </div>
          </div>
          <div className="step-node rv">04</div>
          <div className="step-copy rv">
            <div className="k">Step 04</div>
            <h3>Watch your numbers <span className="ital">actually move</span></h3>
            <p>Every upload adds to your timeline. See markers climb from red into green, catch a drift months before it becomes a problem, and get nudged when it's time to re-test.</p>
            <ul className="step-list">
              <li>{CHECK}A full history for every marker</li>
              <li>{CHECK}Early signal, long before symptoms</li>
              <li>{CHECK}Re-test reminders that find you</li>
            </ul>
          </div>
        </div>
      </div></section>

      {/* FAMILY BAND */}
      <section className="family"><div className="wrap family-in rv">
        <div className="fam-avatars"><i>A</i><i>M</i><i>S</i><i>+</i></div>
        <h2>One account, <span className="ital">the whole household.</span></h2>
        <p>Kids, parents, partners — every profile under one roof. Results stay private and encrypted, and the insights get sharper for everyone with each new test.</p>
        <div className="hero-cta">
          <Link className="btn btn-amber" to="/get-started">Create your household {ARROW}</Link>
        </div>
      </div></section>

      {/* PRICING */}
      <section className="sec pricing" id="pricing"><div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow">Pricing</span>
          <h2>Simple plans for <span className="ital">every household.</span></h2>
          <p>Start free. Upgrade only when you're ready — cancel anytime.</p>
        </div>
        <div className="price-grid">
          <div className="pcard rv">
            <div className="pname">Personal</div>
            <div className="price"><span className="amt">$9</span><span className="per">/ month</span></div>
            <Link className="pbtn sel" to="/get-started">Choose Personal</Link>
            <ul>
              <li>{CHECK}1 profile</li>
              <li>{CHECK}Up to 12 uploads a month</li>
              <li>{CHECK}Full history &amp; trend tracking</li>
              <li>{CHECK}Anna, your AI health coach</li>
              <li>{CHECK}Personalised food &amp; lifestyle plan</li>
            </ul>
          </div>
          <div className="pcard pop rv">
            <span className="pop-tag">Popular</span>
            <div className="pname">Family</div>
            <div className="price"><span className="amt">$19</span><span className="per">/ month</span></div>
            <Link className="pbtn go" to="/get-started">Start Family</Link>
            <ul>
              <li>{CHECK}Up to 5 profiles</li>
              <li>{CHECK}12 uploads a month, each</li>
              <li>{CHECK}Anna &amp; trends for every member</li>
              <li>{CHECK}One shared family timeline</li>
              <li>{CHECK}Personalised plans for everyone</li>
            </ul>
          </div>
          <div className="pcard rv">
            <div className="pname">Household</div>
            <div className="price"><span className="amt">$29</span><span className="per">/ month</span></div>
            <Link className="pbtn sel" to="/get-started">Choose Household</Link>
            <ul>
              <li>{CHECK}Up to 12 profiles</li>
              <li>{CHECK}12 uploads a month, each</li>
              <li>{CHECK}Anna &amp; trends for every profile</li>
              <li>{CHECK}Priority processing</li>
              <li>{CHECK}Personalised plans for everyone</li>
            </ul>
          </div>
        </div>
        <p className="price-foot">Are you a doctor or clinic? <Link to="/for-doctors" style={{ color: "var(--amber-lite)", fontWeight: 600 }}>See plans for professionals →</Link></p>
      </div></section>

      {/* FAQ */}
      <section className="sec"><div className="wrap">
        <div className="sec-head rv"><span className="eyebrow">Questions</span><h2>Good to know.</h2></div>
        <div className="faq">
          <div className="qa rv"><h4>Which labs does labread work with?</h4><p>Any of them. Upload a photo or PDF from any lab in any country — labread reads the values and standardises the ranges for you, even across different units and languages.</p></div>
          <div className="qa rv"><h4>Is this a replacement for my doctor?</h4><p>No — and it's not meant to be. labread helps you understand your results and walk into appointments prepared. Always confirm decisions with a licensed clinician.</p></div>
          <div className="qa rv"><h4>How private is my data?</h4><p>Your results are encrypted and never sold. Each family profile is yours alone, and you can export or delete everything at any time.</p></div>
          <div className="qa rv"><h4>Can I really start for free?</h4><p>Yes. Upload your first test and explore your breakdown free. Upgrade only when you want more uploads, profiles, or family tracking.</p></div>
        </div>
      </div></section>

      {/* FINAL CTA */}
      <section className="final"><div className="wrap">
        <h2>Understand your blood test <span className="ital">today.</span></h2>
        <p>Take your health off the lab printout and into your own hands — one clear result at a time.</p>
        <div className="hero-cta">
          <Link className="btn btn-amber" to="/get-started">Start free {ARROW}</Link>
          <a className="btn btn-ghost" href="#journey">See how it works</a>
        </div>
      </div></section>

      <MarketingFooter copy="© 2026 labread · Understand your blood, follow your health." />
    </div>
  );
}
