import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { WaitlistForm } from "@/components/marketing-waitlist";

// Public marketing page — ported 1:1 from
// design-reference/marketing/labread-for-clinics.html. CSS scoped under `.lr-clin`.
// The reference's mailto: CTAs are replaced with the shared waitlist form
// (audience "clinic"); the "See the API" ghost button is kept alongside.

export const Route = createFileRoute("/for-clinics")({
  head: () => ({
    meta: [
      { title: "labread — for labs & clinics" },
      {
        name: "description",
        content:
          "You send a thousand reports a month; almost none get read. labread turns every report you produce into an explanation patients finish — under your name, through one API call.",
      },
      { property: "og:title", content: "labread — for labs & clinics" },
      {
        property: "og:description",
        content:
          "White-label, API-first, EU-hosted. Structured biomarker data plus a plain-language explanation, ready to render under your brand.",
      },
    ],
    links: [
      { rel: "canonical", href: "https://labread.health/for-clinics" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,200;0,9..144,300;0,9..144,400;1,9..144,300;1,9..144,400&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap",
      },
    ],
  }),
  component: ForClinicsPage,
});

const CSS = `
html{scroll-behavior:smooth}
@keyframes lrBreathe{0%,100%{opacity:.55}50%{opacity:1}}

.lr-clin{
  --void:#080705;--ember:#E8743B;--ember-glow:#FFC069;--ember-deep:#8A2C08;
  --glass:rgba(255,255,255,.035);--glass-line:rgba(255,176,102,.14);
  --text:#EDE5D9;--dim:rgba(237,229,217,.5);--faint:rgba(237,229,217,.28);
  --line:rgba(255,176,102,.07);
  background:var(--void);color:var(--text);font-family:'Inter',-apple-system,sans-serif;
  font-size:17px;line-height:1.6;overflow-x:clip;box-sizing:border-box;-webkit-font-smoothing:antialiased;

  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}

  .glow-field{position:fixed;inset:0;pointer-events:none;z-index:0}
  .glow-field::before{content:'';position:absolute;top:-10%;right:-8%;width:1000px;height:750px;background:radial-gradient(ellipse,rgba(255,122,24,.13) 0%,transparent 66%);animation:lrBreathe 12s ease-in-out infinite}
  .glow-field::after{content:'';position:absolute;bottom:-12%;left:-10%;width:800px;height:800px;background:radial-gradient(circle,rgba(232,116,59,.07) 0%,transparent 62%);animation:lrBreathe 15s ease-in-out infinite reverse}

  .nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:22px 44px;display:flex;justify-content:space-between;align-items:center;background:linear-gradient(to bottom,rgba(8,7,5,.92),rgba(8,7,5,0))}
  .brand{font-family:'Fraunces',serif;font-size:23px;font-weight:300;color:var(--ember);text-decoration:none;letter-spacing:-.5px}
  .brand b{font-weight:400}
  .brand span{color:var(--faint);font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin-left:12px}
  .nav-cta{background:linear-gradient(135deg,var(--ember-glow),var(--ember));color:#160B04;border:none;padding:11px 24px;border-radius:100px;font-size:14px;font-weight:600;text-decoration:none;box-shadow:0 0 24px rgba(232,116,59,.3);transition:box-shadow .25s,transform .2s}
  .nav-cta:hover{box-shadow:0 0 40px rgba(232,116,59,.55);transform:translateY(-1px)}

  .wrap{position:relative;z-index:2;max-width:1180px;margin:0 auto;padding:0 44px}
  .act{min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:120px 0;position:relative}
  .act.short{min-height:auto}

  .eyebrow{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:3.5px;text-transform:uppercase;color:var(--ember-glow);opacity:.75;margin-bottom:26px;display:flex;align-items:center;gap:12px}
  .eyebrow::before{content:'';width:26px;height:1px;background:var(--ember);opacity:.6}
  .eyebrow.mid{justify-content:center}
  .eyebrow.mid::after{content:'';width:26px;height:1px;background:var(--ember);opacity:.6}

  h1{font-family:'Fraunces',serif;font-weight:200;font-size:clamp(40px,5.8vw,78px);line-height:1.05;letter-spacing:-2.2px}
  h1 em{font-style:italic;font-weight:300;color:var(--ember-glow)}
  h2{font-family:'Fraunces',serif;font-weight:200;font-size:clamp(30px,4.2vw,54px);line-height:1.12;letter-spacing:-1.5px}
  h2 em{font-style:italic;font-weight:300;color:var(--ember-glow)}
  h3{font-family:'Fraunces',serif;font-weight:300;font-size:21px;letter-spacing:-.4px}
  .lede{font-size:20px;color:var(--dim);line-height:1.7;max-width:600px}
  .lede b{color:var(--text);font-weight:500}

  .hero{text-align:center;align-items:center}
  .hero h1{max-width:900px;margin:0 auto 32px}
  .hero .lede{margin:0 auto 44px;max-width:620px;text-align:center}

  .cta-row{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;align-items:center}
  .cta-form{width:100%;max-width:460px}
  .btn-1{background:linear-gradient(135deg,var(--ember-glow),var(--ember));color:#160B04;border:none;padding:17px 32px;border-radius:100px;font-size:15px;font-weight:600;text-decoration:none;box-shadow:0 0 30px rgba(232,116,59,.35);transition:box-shadow .25s,transform .2s;display:inline-block}
  .btn-1:hover{box-shadow:0 0 50px rgba(232,116,59,.6);transform:translateY(-1px)}
  .btn-2{background:var(--glass);border:1px solid var(--glass-line);color:var(--dim);padding:17px 32px;border-radius:100px;font-size:15px;font-weight:500;text-decoration:none;backdrop-filter:blur(14px);transition:border-color .25s,color .25s;display:inline-block}
  .btn-2:hover{border-color:var(--ember);color:var(--text)}
  .hero-note{margin-top:20px;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:1.5px;color:var(--faint);text-transform:uppercase}

  .wait{display:flex;gap:10px;width:100%}
  .wait input{flex:1;min-width:0;background:var(--glass);border:1px solid var(--glass-line);padding:17px 22px;border-radius:100px;color:var(--text);font-size:15px;font-family:'Inter',sans-serif;outline:none;backdrop-filter:blur(14px);transition:border-color .25s,box-shadow .25s}
  .wait input::placeholder{color:var(--faint)}
  .wait input:focus{border-color:var(--ember);box-shadow:0 0 0 3px rgba(232,116,59,.1)}
  .wait button{background:linear-gradient(135deg,var(--ember-glow),var(--ember));color:#160B04;border:none;padding:17px 28px;border-radius:100px;font-size:15px;font-weight:600;font-family:'Inter',sans-serif;cursor:pointer;white-space:nowrap;box-shadow:0 0 30px rgba(232,116,59,.35);transition:box-shadow .25s,transform .2s}
  .wait button:hover{box-shadow:0 0 50px rgba(232,116,59,.6);transform:translateY(-1px)}
  .wait button[disabled]{opacity:.6;cursor:default;box-shadow:none;transform:none}
  .wait-done{align-items:center;justify-content:center;gap:11px;background:var(--glass);border:1px solid var(--glass-line);border-radius:100px;padding:15px 24px;color:var(--ember-glow);font-size:15px;backdrop-filter:blur(14px)}
  .wait-err{margin-top:14px;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:var(--ember)}

  .wall-wrap{margin-top:66px;position:relative;max-width:900px;width:100%}
  .wall{display:grid;grid-template-columns:repeat(30,1fr);gap:5px}
  .doc{aspect-ratio:.72;border-radius:2px;background:rgba(255,255,255,.045);position:relative;overflow:hidden}
  .doc::before,.doc::after{content:'';position:absolute;left:18%;right:18%;height:1px;background:rgba(255,255,255,.05)}
  .doc::before{top:32%}
  .doc::after{top:56%}
  .doc.lit{background:linear-gradient(160deg,#FFB865,#B23A0C);box-shadow:0 0 10px rgba(232,116,59,.55)}
  .doc.lit::before,.doc.lit::after{background:rgba(255,243,226,.4)}
  .wall-cap{display:flex;justify-content:space-between;margin-top:18px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--faint)}
  .wall-cap b{color:var(--ember-glow);font-weight:400}

  .flow-hd{text-align:center;display:flex;flex-direction:column;align-items:center;margin-bottom:60px}
  .flow-hd h2{max-width:760px;margin:0 auto 18px}
  .flow-hd .lede{text-align:center;margin:0 auto}
  .flow{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
  .step{background:var(--glass);border:1px solid var(--glass-line);border-radius:18px;padding:34px 30px;backdrop-filter:blur(14px);position:relative;transition:border-color .3s,transform .3s}
  .step:hover{border-color:rgba(255,176,102,.3);transform:translateY(-4px)}
  .step::after{content:'';position:absolute;top:44px;right:-16px;width:26px;height:1px;background:linear-gradient(to right,var(--ember),transparent);z-index:3}
  .step:last-child::after{display:none}
  .step-eb{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:var(--ember-glow);margin-bottom:18px}
  .step h3{margin-bottom:12px}
  .step p{color:var(--dim);font-size:14.5px;line-height:1.7}

  .api{display:grid;grid-template-columns:.95fr 1.05fr;gap:70px;align-items:center}
  .api-text h2{margin-bottom:24px}
  .api-text .lede{margin-bottom:22px;font-size:18px}
  .eps{display:flex;flex-direction:column;gap:10px;margin-top:30px}
  .ep{background:var(--glass);border:1px solid var(--glass-line);border-radius:12px;padding:16px 20px;backdrop-filter:blur(12px)}
  .ep-m{font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:500;padding:3px 8px;border-radius:4px;margin-right:10px;letter-spacing:.5px}
  .m-post{background:rgba(232,116,59,.16);color:var(--ember-glow)}
  .m-get{background:rgba(255,192,105,.09);color:var(--ember-glow)}
  .ep-p{font-family:'JetBrains Mono',monospace;font-size:13px}
  .ep-d{font-size:12.5px;color:var(--faint);margin-top:7px;line-height:1.5}

  .code{background:rgba(0,0,0,.5);border:1px solid var(--line);border-radius:16px;padding:28px;overflow-x:auto;box-shadow:0 20px 60px rgba(0,0,0,.5)}
  .code pre{font-family:'JetBrains Mono',monospace;font-size:12.5px;line-height:1.85;color:var(--dim)}
  .ck{color:var(--ember-glow)}
  .cs{color:var(--ember)}
  .cc{color:rgba(237,229,217,.24)}

  .why-hd{text-align:center;display:flex;flex-direction:column;align-items:center;margin-bottom:56px}
  .why-hd h2{max-width:700px;margin:0 auto 18px}
  .why-hd .lede{text-align:center;margin:0 auto}
  .why{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
  .wc{background:var(--glass);border:1px solid var(--glass-line);border-radius:18px;padding:34px 28px;backdrop-filter:blur(14px);transition:border-color .3s,transform .3s}
  .wc:hover{border-color:rgba(255,176,102,.3);transform:translateY(-4px)}
  .wc h3{margin-bottom:11px;font-size:19px}
  .wc p{color:var(--dim);font-size:14px;line-height:1.7}

  .final{text-align:center;align-items:center}
  .final h2{max-width:820px;margin:0 auto 22px;font-size:clamp(32px,4.6vw,58px)}
  .final .lede{margin:0 auto 42px;text-align:center}

  footer{position:relative;z-index:2;border-top:1px solid var(--line);padding:44px;max-width:1180px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:20px}
  .f-links{display:flex;gap:26px}
  .f-links a{color:var(--dim);text-decoration:none;font-size:13px}
  .f-links a:hover{color:var(--text)}
  .f-note{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--faint);letter-spacing:1px}

  .rv{opacity:0;transform:translateY(28px);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1)}
  .rv.in{opacity:1;transform:none}

  @media (max-width:900px){
    .wrap{padding:0 24px}
    .wall{grid-template-columns:repeat(16,1fr);gap:4px}
    .flow{grid-template-columns:1fr}
    .step::after{display:none}
    .api{grid-template-columns:1fr;gap:48px}
    .why{grid-template-columns:1fr}
    .cta-form{max-width:none}
    .wait{flex-direction:column}
    .nav{padding:16px 24px}
    .brand span{display:none}
    .act{min-height:auto;padding:90px 0}
    footer{flex-direction:column;text-align:center}
  }
  @media (prefers-reduced-motion:reduce){*{animation:none!important}.rv{opacity:1;transform:none}}
}
`;

const CODE_HTML = `<span class="cc">// POST /v1/reports/analyze</span>
{
  <span class="ck">"markers"</span>: [
    {
      <span class="ck">"name"</span>:        <span class="cs">"Ferritin"</span>,
      <span class="ck">"value"</span>:       18,
      <span class="ck">"unit"</span>:        <span class="cs">"ng/mL"</span>,
      <span class="ck">"status"</span>:      <span class="cs">"low"</span>,
      <span class="ck">"range"</span>:       { <span class="ck">"min"</span>: 30, <span class="ck">"max"</span>: 150 },
      <span class="ck">"explanation"</span>: <span class="cs">"Your iron stores are
                       running low — the quiet
                       cause of the fatigue."</span>
    }
  ],
  <span class="ck">"summary"</span>:   <span class="cs">"16 markers · 2 flagged"</span>,
  <span class="ck">"pdf_url"</span>:   <span class="cs">"https://…/branded.pdf"</span>,
  <span class="ck">"protocol"</span>:  { <span class="ck">"days"</span>: 90, <span class="ck">"actions"</span>: 5 }
}`;

function ForClinicsPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // The wall: 300 tiles standing in for 1,000 reports, ~27 lit at random.
    const wall = wallRef.current;
    if (wall && wall.childElementCount === 0) {
      const total = 300;
      const lit = new Set<number>();
      while (lit.size < 27) lit.add(Math.floor(Math.random() * total));
      for (let i = 0; i < total; i++) {
        const d = document.createElement("div");
        d.className = "doc" + (lit.has(i) ? " lit" : "");
        wall.appendChild(d);
      }
    }

    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.1 },
    );
    root.querySelectorAll(".rv").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="lr-clin" ref={rootRef}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="glow-field" />

      <nav className="nav">
        <a href="/" className="brand">lab<b>read</b><span>for labs &amp; clinics</span></a>
        <a href="#join" className="nav-cta">Talk to us</a>
      </nav>

      <div className="wrap">
        {/* HERO + THE WALL */}
        <section className="act hero">
          <div className="eyebrow mid">for labs &amp; clinics</div>
          <h1>You send a thousand reports a month.<br />Almost none get <em>read.</em></h1>
          <p className="lede">
            The numbers are correct. The patient still doesn't understand them.
            labread turns every report you produce into an explanation they actually
            finish — <b>under your name, through one API call.</b>
          </p>
          <div className="cta-row">
            <div className="cta-form">
              <WaitlistForm audience="clinic" id="join" placeholder="your work email" buttonLabel="Talk to us →" />
            </div>
            <a href="#api" className="btn-2">See the API</a>
          </div>
          <p className="hero-note">white-label · api-first · eu-hosted</p>

          <div className="wall-wrap">
            <div className="wall" ref={wallRef} />
            <div className="wall-cap">
              <span>1,000 reports sent this month</span>
              <span><b>the lit ones were understood</b></span>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="act rv">
          <div className="flow-hd">
            <div className="eyebrow mid">how it works</div>
            <h2>One call in. A report they <em>read</em> comes out.</h2>
            <p className="lede">No dashboard to learn. No portal to migrate. It slots into the workflow you already have.</p>
          </div>

          <div className="flow">
            <div className="step">
              <div className="step-eb">01 · send</div>
              <h3>Push the report</h3>
              <p>PDF, image, or structured data — POST it to labread. We read 50+ biomarkers from Moroccan, French, and international lab formats, in Arabic, French, or English.</p>
            </div>
            <div className="step">
              <div className="step-eb">02 · process</div>
              <h3>Math, then language</h3>
              <p>A deterministic pipeline maps every value to validated clinical ranges — adjusted for age and sex. Only then does a constrained AI write the explanation. It can describe the result. It cannot invent one.</p>
            </div>
            <div className="step">
              <div className="step-eb">03 · deliver</div>
              <h3>Your brand, out the door</h3>
              <p>Structured JSON plus a branded PDF — your logo, your colours, your name. Attach it to the result email, embed it in your portal, or hand it over at the counter.</p>
            </div>
          </div>
        </section>

        {/* API */}
        <section className="act rv" id="api">
          <div className="api">
            <div className="api-text">
              <div className="eyebrow">the integration</div>
              <h2>A clean API. <em>Nothing else.</em></h2>
              <p className="lede">
                You own the presentation layer. We hand back structured biomarker data — names,
                values, units, ranges, statuses — plus a plain-language explanation ready to render.
              </p>
              <p className="lede">
                Most partners are live in a day.
              </p>

              <div className="eps">
                <div className="ep">
                  <span className="ep-m m-post">POST</span><span className="ep-p">/v1/reports/analyze</span>
                  <p className="ep-d">Send a PDF, image, or JSON. Get every marker back with status and explanation.</p>
                </div>
                <div className="ep">
                  <span className="ep-m m-get">GET</span><span className="ep-p">/v1/patients/{"{id}"}/trends</span>
                  <p className="ep-d">Multi-test trajectory for one patient — the line, not the snapshot.</p>
                </div>
                <div className="ep">
                  <span className="ep-m m-get">GET</span><span className="ep-p">/v1/reports/{"{id}"}/pdf</span>
                  <p className="ep-d">The branded PDF, ready to send.</p>
                </div>
              </div>
            </div>

            <div className="code">
              <pre dangerouslySetInnerHTML={{ __html: CODE_HTML }} />
            </div>
          </div>
        </section>

        {/* WHY */}
        <section className="act short rv">
          <div className="why-hd">
            <div className="eyebrow mid">why labread</div>
            <h2>We're not an analytics platform.<br />We're a <em>translation layer.</em></h2>
            <p className="lede">Between the numbers you produce and the people who receive them.</p>
          </div>

          <div className="why">
            <div className="wc">
              <h3>Math first, AI second</h3>
              <p>The pipeline is deterministic — validated clinical ranges, not model guesswork. The AI only writes the sentence after the math has decided the status. It cannot hallucinate a value it never received.</p>
            </div>
            <div className="wc">
              <h3>Your brand. Ours invisible.</h3>
              <p>Your name at the top, your colours, your logo. "Powered by labread" at most — or nothing at all. The patient's relationship stays with you.</p>
            </div>
            <div className="wc">
              <h3>Any lab, any language</h3>
              <p>Moroccan private labs, hospital panels, French formats. Arabic, French, English. We read what your region actually uses — not just what American labs print.</p>
            </div>
            <div className="wc">
              <h3>Retention, not just service</h3>
              <p>A patient who understood their last report comes back for the next one. An explanation isn't a nicety — it's the difference between a transaction and a relationship.</p>
            </div>
            <div className="wc">
              <h3>EU-hosted, CNDP registered</h3>
              <p>Data lives in Paris. Registered with Morocco's CNDP under Law 09-08. Never used to train models. Never sold. You can put that in writing to your patients.</p>
            </div>
            <div className="wc">
              <h3>Per-report pricing</h3>
              <p>No platform fee. No seat licences. No minimum. You pay for the reports you send. Volume pricing available — talk to us.</p>
            </div>
          </div>
        </section>

        {/* FINAL */}
        <section className="act final rv">
          <div className="eyebrow mid">early partners · morocco first</div>
          <h2>Turn a thousand reports into a thousand <em>conversations.</em></h2>
          <p className="lede">We're onboarding a small number of labs and clinics before launch. Tell us about yours.</p>
          <div className="cta-row">
            <div className="cta-form">
              <WaitlistForm audience="clinic" placeholder="your work email" buttonLabel="Talk to us →" />
            </div>
            <a href="#api" className="btn-2">See the API</a>
          </div>
          <p className="hero-note">white-label · api-first · eu-hosted · cndp registered</p>
        </section>
      </div>

      <footer>
        <a href="/" className="brand">lab<b>read</b></a>
        <div className="f-links">
          <a href="/">For you</a>
          <a href="/for-doctors">For doctors</a>
          <a href="/for-clinics">For clinics</a>
          <a href="/privacy">Privacy</a>
        </div>
        <span className="f-note">© 2026 labread · labread.health</span>
      </footer>
    </div>
  );
}
