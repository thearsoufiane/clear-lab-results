import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import {
  MARKETING_CSS, CONSOLE_CSS, SvgDefs, MarketingNav, MarketingFooter,
  ConsoleHero, useMarketingEffects, type TickerItem,
} from "@/components/marketing";

export const Route = createFileRoute("/for-doctors")({
  head: () => ({
    meta: [
      { title: "labread — Branded lab reports for doctors" },
      { name: "description", content: "Turn each patient's blood test into a clear, branded interpretation — read, explained, and tracked across every visit. Built for solo doctors and small practices." },
      { property: "og:title", content: "labread — Branded lab reports for doctors" },
      { property: "og:description", content: "Branded, patient-ready interpretation reports and trend tracking for clinicians." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://labread.health/for-doctors" },
      { property: "og:image", content: "https://labread.health/og-image.png" },
    ],
    links: [
      { rel: "canonical", href: "https://labread.health/for-doctors" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" as const },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" },
    ],
  }),
  component: ForDoctors,
});

const pageCss = `
  .lr-mkt .sec-head{max-width:680px;margin:0 auto}

  /* FEATURE TRIO */
  .lr-mkt .feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:46px}
  .lr-mkt .feat{background:linear-gradient(180deg,var(--surface),var(--bg-2));border:1px solid var(--line);border-radius:18px;padding:26px 24px;transition:.25s}
  .lr-mkt .feat:hover{transform:translateY(-4px);border-color:rgba(245,166,35,.32)}
  .lr-mkt .feat .fi{width:46px;height:46px;border-radius:13px;background:rgba(245,133,63,.1);border:1px solid var(--line);display:grid;place-items:center;margin-bottom:18px}
  .lr-mkt .feat .fi svg{width:23px;height:23px;stroke:var(--amber);fill:none;stroke-width:1.9}
  .lr-mkt .feat h3{font-size:21px;margin-bottom:10px}
  .lr-mkt .feat p{color:var(--muted);font-size:14.5px}

  /* WORKFLOW */
  .lr-mkt .flow{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:46px;position:relative}
  .lr-mkt .flow-step{position:relative;background:linear-gradient(180deg,var(--surface),var(--bg-2));border:1px solid var(--line);border-radius:16px;padding:22px 18px;text-align:center}
  .lr-mkt .flow-step .n{width:34px;height:34px;border-radius:50%;background:var(--bg-2);border:1px solid var(--line);display:grid;place-items:center;margin:0 auto 14px;font-family:var(--serif);color:var(--amber-lite);font-size:15px}
  .lr-mkt .flow-step h4{font-family:var(--sans);font-size:15px;font-weight:600;margin-bottom:7px}
  .lr-mkt .flow-step p{font-size:13px;color:var(--muted)}
  .lr-mkt .flow-step::after{content:"→";position:absolute;right:-12px;top:50%;transform:translateY(-50%);color:var(--faint);font-size:16px;z-index:2}
  .lr-mkt .flow-step:last-child::after{display:none}

  /* COMPLIANCE STRIP */
  .lr-mkt .compliance{margin-top:46px;border:1px solid var(--line);border-radius:18px;padding:26px 30px;background:linear-gradient(90deg,rgba(245,133,63,.06),rgba(111,207,151,.04));display:flex;align-items:center;gap:30px;flex-wrap:wrap;justify-content:center}
  .lr-mkt .compliance .ci{display:inline-flex;align-items:center;gap:10px;font-size:14px;color:var(--cream)}
  .lr-mkt .compliance .ci svg{width:20px;height:20px;stroke:var(--green);fill:none;stroke-width:2}

  /* PRICING (single best-value) */
  .lr-mkt .pricing{padding:46px 0}
  .lr-mkt .price-one{max-width:480px;margin:46px auto 0;position:relative}
  .lr-mkt .price-frame{position:relative;background:linear-gradient(var(--bg-2),var(--bg-2)) padding-box,var(--grad) border-box;border:1.5px solid transparent;border-radius:22px;padding:34px 32px;box-shadow:0 40px 90px rgba(232,116,59,.18)}
  .lr-mkt .best-tag{position:absolute;top:-14px;left:50%;transform:translateX(-50%);background:var(--grad);color:#1a0f02;font-family:var(--mono);font-size:10px;letter-spacing:.16em;text-transform:uppercase;font-weight:600;padding:7px 16px;border-radius:999px;display:inline-flex;align-items:center;gap:7px}
  .lr-mkt .best-tag .dot{width:6px;height:6px;border-radius:50%;background:#1a0f02}
  .lr-mkt .price-frame .pname{font-family:var(--serif);font-size:26px}
  .lr-mkt .price-frame .price{display:flex;align-items:flex-end;gap:7px;margin:14px 0 16px}
  .lr-mkt .price-frame .amt{font-family:var(--serif);font-size:58px;line-height:.9;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent}
  .lr-mkt .price-frame .per{font-size:14px;color:var(--muted);margin-bottom:9px}
  .lr-mkt .annual{border:1px solid rgba(111,207,151,.3);background:rgba(111,207,151,.07);border-radius:13px;padding:13px 16px;margin-bottom:22px}
  .lr-mkt .annual b{color:var(--green);font-size:14px}
  .lr-mkt .annual span{display:block;font-family:var(--mono);font-size:11.5px;color:var(--muted);margin-top:3px}
  .lr-mkt .price-frame ul{list-style:none;display:flex;flex-direction:column;gap:14px;margin-bottom:24px}
  .lr-mkt .price-frame li{display:flex;align-items:flex-start;gap:12px;font-size:14.5px;color:var(--cream)}
  .lr-mkt .price-frame li svg{width:20px;height:20px;flex-shrink:0;margin-top:1px;stroke:var(--green);fill:none;stroke-width:2}
  .lr-mkt .price-frame .pbtn{display:block;text-align:center;padding:15px;border-radius:12px;font-weight:600;font-size:15px;background:var(--grad);color:#1a0f02;cursor:pointer;box-shadow:0 0 34px rgba(245,133,63,.32);transition:.2s}
  .lr-mkt .price-frame .pbtn:hover{transform:translateY(-1px);box-shadow:0 0 50px rgba(245,133,63,.48)}
  .lr-mkt .price-foot{text-align:center;margin-top:28px;font-size:14px;color:var(--muted)}
  .lr-mkt .price-foot a{color:var(--amber-lite);font-weight:600}

  @media(max-width:920px){
    .lr-mkt .feat-grid{grid-template-columns:1fr;max-width:420px;margin-left:auto;margin-right:auto}
    .lr-mkt .flow{grid-template-columns:1fr;max-width:340px;margin-left:auto;margin-right:auto}
    .lr-mkt .flow-step::after{content:"↓";right:50%;left:50%;top:auto;bottom:-12px;transform:translateX(50%)}
  }
`;

const ARROW = <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
const CHECK = <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>;

const ticker: TickerItem[] = [
  { tone: "r", nm: "Yassine B.", vl: "23 params", st: "2 abnormal" },
  { tone: "g", nm: "Leila M.", vl: "18 params", st: "All clear" },
  { tone: "w", nm: "Omar K.", vl: "21 params", st: "1 flag" },
  { tone: "g", nm: "Sara T.", vl: "14 params", st: "All clear" },
  { tone: "r", nm: "Hamza R.", vl: "26 params", st: "3 abnormal" },
  { tone: "g", nm: "Nadia B.", vl: "19 params", st: "All clear" },
  { tone: "w", nm: "Karim A.", vl: "22 params", st: "1 flag" },
  { tone: "g", nm: "Imane S.", vl: "16 params", st: "All clear" },
];

function ForDoctors() {
  const rootRef = useRef<HTMLDivElement>(null);
  useMarketingEffects(rootRef);

  return (
    <div className="lr-mkt" ref={rootRef}>
      <style dangerouslySetInnerHTML={{ __html: MARKETING_CSS + pageCss + CONSOLE_CSS }} />
      <SvgDefs />

      <MarketingNav
        active="doctors"
        topbar={<>Give every patient a report they understand — <b>in your clinic's name</b> &nbsp;<a href="#pricing">See pricing →</a></>}
        cta={{ label: "Start free", href: "/get-started" }}
      />

      <ConsoleHero
        badges={<>
          <span className="h-pill"><span className="d" />Clinician console</span>
          <span className="h-pill ghost">Patient-ready · branded</span>
        </>}
        h1={<>Branded reads,<br />patient by <span className="ital">patient.</span></>}
        sub={<>labread turns each patient's blood test into a clear, branded interpretation — <b>read, explained, and tracked</b> across every visit.</>}
        ctas={<>
          <Link className="btn btn-amber" to="/get-started">Start free {ARROW}</Link>
          <a className="btn btn-line" href="#pricing">See pricing</a>
        </>}
        metrics={[
          { count: 150, suf: "", label: "Analyses / mo" },
          { count: 50, suf: "+", label: "Markers read" },
          { count: 6, suf: "h", label: "Saved / week" },
        ]}
        gaugeCenter={<>
          <text className="score" x="260" y="256" fontSize="54">148</text>
          <text className="lab" x="260" y="290" fontSize="12" letterSpacing="2">ANALYSES</text>
          <text className="lab" x="260" y="308" fontSize="9" letterSpacing="3" fill="#6F6557">THIS MONTH · 6 FLAGGED</text>
        </>}
        panels={<>
          <div className="gpanel gp-anna" data-float="1.3">
            <div className="ah"><div className="orb"><i /></div><div><div className="an">Yassine B.</div><div className="ar">2 abnormal · flagged</div></div></div>
            <p>Latest panel — <b>ferritin &amp; ALT</b> out of range. Ready for your review.</p>
          </div>
          <div className="gpanel gp-trend" data-float="1">
            <div className="th"><span className="tn">ALT</span><span className="tv">▼ 16.7 U/L</span></div>
            <svg viewBox="0 0 180 46" preserveAspectRatio="none"><rect x="0" y="8" width="180" height="26" fill="rgba(111,207,151,.1)" /><polyline points="8,40 55,37 105,20 175,12" fill="none" stroke="url(#tgrad)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /><circle cx="105" cy="20" r="4" fill="#0E0B08" stroke="#6FCF97" strokeWidth="2.4" /></svg>
          </div>
          <div className="gpanel gp-range" data-float="1.5">
            <div className="rh"><span>Report</span><span className="ok">● ready</span></div>
            <div className="rn"><div className="ric">A</div><div><div className="rnm">Amine Clinic</div><div className="rvl">branded PDF + share link</div></div></div>
            <div className="mini-track"><i className="r" /><i className="w" /><i className="g" /><i className="w" /><i className="r" /><div className="mini-mark" data-left="46%" /></div>
          </div>
          <div className="gpanel gp-streak" data-float="1.7">
            <svg className="sr" viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" fill="none" stroke="rgba(245,166,35,.14)" strokeWidth="4" /><circle cx="22" cy="22" r="18" fill="none" stroke="url(#ringG)" strokeWidth="4" strokeLinecap="round" strokeDasharray="113" strokeDashoffset="34" transform="rotate(-90 22 22)" /></svg>
            <div><div className="sb">24</div><div className="sl">patients</div></div>
          </div>
        </>}
        ticker={ticker}
      />

      {/* FEATURES */}
      <section className="sec" id="learn"><div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow">Why clinicians choose labread</span>
          <h2>Interpretation that does the <span className="ital">heavy lifting.</span></h2>
        </div>
        <div className="feat-grid">
          <div className="feat rv">
            <div className="fi"><svg viewBox="0 0 24 24"><path d="M4 4h16v14H4z" /><path d="M8 9h8M8 13h6" /><circle cx="18" cy="18" r="3" /></svg></div>
            <h3>Reports in your name</h3>
            <p>Your clinic's name and logo sit on every interpretation. Send patients a clean, professional report as a PDF or a secure link they can open anywhere.</p>
          </div>
          <div className="feat rv">
            <div className="fi"><svg viewBox="0 0 24 24"><path d="M3 17l5-5 4 3 6-7" /><path d="M3 21h18" /></svg></div>
            <h3>Every trend, one timeline</h3>
            <p>A patient's whole history, in one view. labread plots each marker across visits with clear reference zones, so a slow drift is obvious long before it turns into a problem.</p>
          </div>
          <div className="feat rv">
            <div className="fi"><svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 1 1-3.5-6.6L21 4v5h-5" /></svg></div>
            <h3>Answers in plain words</h3>
            <p>Ask labread to put any result in patient-friendly language, draft follow-up guidance, or prep a visit summary — in seconds, ready to send.</p>
          </div>
        </div>
      </div></section>

      {/* WORKFLOW */}
      <section className="sec"><div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow">Fits your workflow</span>
          <h2>From upload to branded report in <span className="ital">four steps.</span></h2>
        </div>
        <div className="flow">
          <div className="flow-step rv"><div className="n">1</div><h4>Add the patient</h4><p>Create a profile in seconds — or pull from your existing roster.</p></div>
          <div className="flow-step rv"><div className="n">2</div><h4>Upload the test</h4><p>Drop any lab's PDF or photo. labread reads every parameter.</p></div>
          <div className="flow-step rv"><div className="n">3</div><h4>AI interprets</h4><p>Get flagged abnormals, plain-language notes, and trend context.</p></div>
          <div className="flow-step rv"><div className="n">4</div><h4>Share the report</h4><p>Send a branded PDF or secure link straight to your patient.</p></div>
        </div>

        <div className="compliance rv">
          <span className="ci"><svg viewBox="0 0 24 24"><path d="M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6z" /><path d="M9 12l2 2 4-4" /></svg>HIPAA-aware handling</span>
          <span className="ci"><svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>Encrypted end-to-end</span>
          <span className="ci"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M2 12h20M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>Region-friendly delivery</span>
        </div>
      </div></section>

      {/* PRICING */}
      <section className="sec pricing" id="pricing"><div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow">Pricing for clinicians</span>
          <h2>One plan. <span className="ital">Nothing held back.</span></h2>
          <p>Built for solo doctors and small practices. No setup fees, no contracts, cancel anytime.</p>
        </div>
        <div className="price-one rv">
          <div className="price-frame">
            <span className="best-tag"><span className="dot" />Best value</span>
            <div className="pname">Practice plan</div>
            <div className="price"><span className="amt">$59</span><span className="per">/ month</span></div>
            <div className="annual"><b>Pay yearly, 2 months on us</b><span>$590 / year instead of $708</span></div>
            <ul>
              <li>{CHECK}1 clinician account</li>
              <li>{CHECK}Up to 150 patient analyses a month</li>
              <li>{CHECK}Unlimited patient profiles</li>
              <li>{CHECK}Full trend tracking &amp; AI clarifications</li>
              <li>{CHECK}Branded reports — share by link or PDF</li>
            </ul>
            <Link className="pbtn" to="/get-started">Get started</Link>
          </div>
        </div>
        <p className="price-foot">Running a lab or clinic with higher volume? <Link to="/for-labs">See enterprise plans for labs &amp; clinics →</Link></p>
      </div></section>

      {/* FINAL CTA */}
      <section className="final"><div className="wrap">
        <h2>Give every patient a report they <span className="ital">actually understand.</span></h2>
        <p>Start free today — add your first patient and generate a branded interpretation in minutes.</p>
        <div className="hero-cta">
          <Link className="btn btn-amber" to="/get-started">Start free {ARROW}</Link>
          <a className="btn btn-ghost" href="#pricing">See pricing</a>
        </div>
      </div></section>

      <MarketingFooter copy="© 2026 labread · Clinic-grade interpretation, in your name." />
    </div>
  );
}
