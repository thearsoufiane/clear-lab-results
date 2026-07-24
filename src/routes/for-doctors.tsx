import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { WaitlistForm } from "@/components/marketing-waitlist";

// Public marketing page — ported 1:1 from
// design-reference/marketing/labread-for-doctors.html. CSS scoped under `.lr-doc`.

export const Route = createFileRoute("/for-doctors")({
  head: () => ({
    meta: [
      { title: "labread — for doctors" },
      {
        name: "description",
        content:
          "You have four minutes; she has thirty questions. labread writes the explanation you'd give her if you had thirty — under your name, before she walks out.",
      },
      { property: "og:title", content: "labread — for doctors" },
      {
        property: "og:description",
        content:
          "A branded, plain-language interpretation of every result — the AI never decides the medicine. Free for practices during the beta.",
      },
    ],
    links: [
      { rel: "canonical", href: "https://labread.health/for-doctors" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,200;0,9..144,300;0,9..144,400;1,9..144,300;1,9..144,400&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap",
      },
    ],
  }),
  component: ForDoctorsPage,
});

const CSS = `
html{scroll-behavior:smooth}
@keyframes lrBreathe{0%,100%{opacity:.55}50%{opacity:1}}

.lr-doc{
  --void:#0C0A07;--ember:#E8743B;--ember-glow:#FFC069;--ember-deep:#8A2C08;
  --glass:rgba(255,255,255,.035);--glass-line:rgba(255,176,102,.14);
  --text:#EDE5D9;--dim:rgba(237,229,217,.5);--faint:rgba(237,229,217,.28);
  --line:rgba(255,176,102,.06);
  background:var(--void);color:var(--text);font-family:'Inter',-apple-system,sans-serif;
  font-size:17px;line-height:1.6;overflow-x:clip;box-sizing:border-box;-webkit-font-smoothing:antialiased;

  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}

  .glow-field{position:fixed;inset:0;pointer-events:none;z-index:0}
  .glow-field::before{content:'';position:absolute;top:-12%;left:-8%;width:900px;height:700px;background:radial-gradient(ellipse,rgba(255,122,24,.13) 0%,transparent 65%);animation:lrBreathe 12s ease-in-out infinite}
  .glow-field::after{content:'';position:absolute;bottom:-8%;right:-8%;width:700px;height:700px;background:radial-gradient(circle,rgba(232,116,59,.07) 0%,transparent 62%);animation:lrBreathe 15s ease-in-out infinite reverse}

  .nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:22px 44px;display:flex;justify-content:space-between;align-items:center;background:linear-gradient(to bottom,rgba(8,7,5,.92),rgba(8,7,5,0))}
  .brand{font-family:'Fraunces',serif;font-size:23px;font-weight:300;color:var(--ember);text-decoration:none;letter-spacing:-.5px}
  .brand b{font-weight:400}
  .brand span{color:var(--faint);font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin-left:12px}
  .nav-cta{background:linear-gradient(135deg,var(--ember-glow),var(--ember));color:#160B04;border:none;padding:11px 24px;border-radius:100px;font-size:14px;font-weight:600;text-decoration:none;box-shadow:0 0 24px rgba(232,116,59,.3);transition:box-shadow .25s,transform .2s}
  .nav-cta:hover{box-shadow:0 0 40px rgba(232,116,59,.55);transform:translateY(-1px)}

  .wrap{position:relative;z-index:2;max-width:1180px;margin:0 auto;padding:0 44px}
  .act{min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:120px 0;position:relative}
  .act.short{min-height:auto;padding:120px 0}

  .eyebrow{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:3.5px;text-transform:uppercase;color:var(--ember-glow);opacity:.75;margin-bottom:26px;display:flex;align-items:center;gap:12px}
  .eyebrow::before{content:'';width:26px;height:1px;background:var(--ember);opacity:.6}
  .eyebrow.mid{justify-content:center}
  .eyebrow.mid::after{content:'';width:26px;height:1px;background:var(--ember);opacity:.6}

  h1{font-family:'Fraunces',serif;font-weight:200;font-size:clamp(40px,5.8vw,78px);line-height:1.05;letter-spacing:-2.2px}
  h1 em{font-style:italic;font-weight:300;color:var(--ember-glow)}
  h2{font-family:'Fraunces',serif;font-weight:200;font-size:clamp(30px,4.2vw,54px);line-height:1.12;letter-spacing:-1.5px}
  h2 em{font-style:italic;font-weight:300;color:var(--ember-glow)}
  h3{font-family:'Fraunces',serif;font-weight:300;font-size:22px;letter-spacing:-.4px}
  .lede{font-size:20px;color:var(--dim);line-height:1.7;max-width:580px}
  .lede b{color:var(--text);font-weight:500}

  .hero{display:grid;grid-template-columns:1.15fr .85fr;gap:70px;align-items:center}
  .hero-copy h1{margin-bottom:30px}
  .hero-copy .lede{margin-bottom:40px}

  .clock{position:relative;z-index:0;display:flex;align-items:center;justify-content:center}
  .clock::before{content:"";position:absolute;inset:-16%;border-radius:50%;background:radial-gradient(circle,rgba(255,176,102,.1),transparent 60%);filter:blur(30px);z-index:-1;pointer-events:none}
  .clock svg{width:100%;max-width:340px;filter:drop-shadow(0 0 40px rgba(232,116,59,.3))}
  .clock-center{position:absolute;text-align:center}
  .clock-num{font-family:'Fraunces',serif;font-size:82px;font-weight:200;color:var(--ember-glow);line-height:1;letter-spacing:-4px}
  .clock-lab{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:3px;color:var(--faint);text-transform:uppercase;margin-top:6px}
  .clock-sub{font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:1.5px;color:var(--faint);text-transform:uppercase;margin-top:14px;opacity:.6;max-width:150px;line-height:1.6}

  .wait{display:flex;gap:10px;max-width:440px}
  .wait input{flex:1;background:var(--glass);border:1px solid var(--glass-line);padding:17px 22px;border-radius:100px;color:var(--text);font-size:15px;font-family:'Inter',sans-serif;outline:none;backdrop-filter:blur(14px);transition:border-color .25s,box-shadow .25s}
  .wait input::placeholder{color:var(--faint)}
  .wait input:focus{border-color:var(--ember);box-shadow:0 0 0 3px rgba(232,116,59,.1)}
  .wait button{background:linear-gradient(135deg,var(--ember-glow),var(--ember));color:#160B04;border:none;padding:17px 28px;border-radius:100px;font-size:15px;font-weight:600;font-family:'Inter',sans-serif;cursor:pointer;white-space:nowrap;box-shadow:0 0 30px rgba(232,116,59,.35);transition:box-shadow .25s,transform .2s}
  .wait button:hover{box-shadow:0 0 50px rgba(232,116,59,.6);transform:translateY(-1px)}
  .wait button[disabled]{opacity:.6;cursor:default;box-shadow:none;transform:none}
  .wait-note{margin-top:18px;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:1.5px;color:var(--faint);text-transform:uppercase}
  .wait-done{max-width:440px;align-items:center;justify-content:center;gap:11px;background:var(--glass);border:1px solid var(--glass-line);border-radius:100px;padding:15px 24px;color:var(--ember-glow);font-size:15px;backdrop-filter:blur(14px)}
  .wait-err{margin-top:16px;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:var(--ember)}

  .two-hd{text-align:center;display:flex;flex-direction:column;align-items:center;margin-bottom:60px}
  .two-hd h2{max-width:780px;margin:0 auto 18px}
  .two-hd .lede{text-align:center;margin:0 auto}
  .two{display:grid;grid-template-columns:1fr 1fr;gap:24px;position:relative;z-index:0}
  .two::before{content:"";position:absolute;inset:-7% -4%;background:radial-gradient(ellipse at center,rgba(232,116,59,.05),transparent 68%);filter:blur(26px);z-index:-1;pointer-events:none}
  .conv{border-radius:20px;padding:36px 34px;position:relative;overflow:hidden}
  .conv-cold{background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.055)}
  .conv-warm{background:linear-gradient(140deg,rgba(255,176,102,.075),rgba(232,116,59,.025));border:1px solid var(--glass-line);backdrop-filter:blur(14px);box-shadow:0 0 60px rgba(232,116,59,.1)}
  .conv-when{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:2.5px;text-transform:uppercase;margin-bottom:24px;padding-bottom:14px;border-bottom:1px solid var(--line)}
  .conv-cold .conv-when{color:var(--faint)}
  .conv-warm .conv-when{color:var(--ember-glow)}
  .beat{padding:15px 0;display:flex;gap:14px;align-items:flex-start}
  .beat-t{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--faint);letter-spacing:1px;min-width:52px;padding-top:4px}
  .beat-x{font-size:15px;line-height:1.6}
  .conv-cold .beat-x{color:var(--dim)}
  .conv-warm .beat-x{color:var(--text)}
  .beat-x b{color:var(--ember-glow);font-weight:500}

  .report-split{display:grid;grid-template-columns:.9fr 1.1fr;gap:80px;align-items:center}
  .rep{background:var(--glass);border:1px solid var(--glass-line);border-radius:20px;padding:34px;backdrop-filter:blur(14px);box-shadow:0 20px 70px rgba(0,0,0,.4),0 0 80px rgba(232,116,59,.07)}
  .rep-hd{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:20px;border-bottom:1px solid var(--line);margin-bottom:22px}
  .rep-clinic{font-family:'Fraunces',serif;font-size:21px;font-weight:300;color:var(--ember-glow)}
  .rep-pb{font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:2px;color:var(--faint);text-transform:uppercase;margin-top:4px}
  .rep-pt{text-align:right}
  .rep-pt-n{font-size:14px;font-weight:500}
  .rep-pt-i{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--faint);letter-spacing:1px;margin-top:3px}
  .rm{padding:14px 0;border-bottom:1px solid var(--line)}
  .rm:last-of-type{border-bottom:none}
  .rm-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:9px}
  .rm-name{font-size:14.5px;font-weight:500}
  .rm-val{font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--dim)}
  .rm-bar{height:4px;background:rgba(255,255,255,.05);border-radius:2px;position:relative;overflow:hidden}
  .rm-fill{position:absolute;left:0;top:0;height:100%;border-radius:2px;box-shadow:0 0 8px currentColor}
  .rm-note{font-size:12.5px;color:var(--faint);line-height:1.55;margin-top:9px}
  .rep-foot{margin-top:20px;padding-top:16px;border-top:1px solid var(--line);font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:1.5px;color:var(--faint);text-transform:uppercase;display:flex;justify-content:space-between}

  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:56px}
  .card{background:var(--glass);border:1px solid var(--glass-line);border-radius:18px;padding:36px 32px;backdrop-filter:blur(14px);transition:border-color .3s,transform .3s}
  .card:hover{border-color:rgba(255,176,102,.3);transform:translateY(-4px)}
  .card-eb{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:var(--ember-glow);margin-bottom:16px}
  .card h3{margin-bottom:12px}
  .card p{color:var(--dim);font-size:14.5px;line-height:1.7}

  .layers{display:flex;flex-direction:column;gap:0;max-width:640px;margin:0 auto}
  .layer{border-radius:16px;padding:28px 32px;position:relative}
  .layer-1{background:linear-gradient(135deg,rgba(255,176,102,.09),rgba(232,116,59,.03));border:1px solid var(--glass-line);backdrop-filter:blur(14px);box-shadow:0 0 50px rgba(232,116,59,.1)}
  .layer-2{background:var(--glass);border:1px solid var(--glass-line);backdrop-filter:blur(14px);margin-top:14px}
  .layer-eb{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:var(--ember-glow);margin-bottom:12px}
  .layer h3{margin-bottom:10px}
  .layer p{color:var(--dim);font-size:14.5px;line-height:1.7}
  .layer-sep{height:26px;display:flex;align-items:center;justify-content:center;position:relative}
  .layer-sep::before{content:'';position:absolute;top:0;bottom:0;left:50%;width:1px;background:linear-gradient(to bottom,rgba(255,176,102,.2),var(--ember),rgba(255,176,102,.2))}
  .layer-sep span{position:relative;background:var(--void);padding:0 12px;font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:2px;color:var(--ember);text-transform:uppercase}
  .layer-guard{margin-top:26px;text-align:center;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:1.5px;color:var(--faint);text-transform:uppercase;line-height:2}

  .final{text-align:center;align-items:center}
  .final h2{max-width:800px;margin:0 auto 22px;font-size:clamp(32px,4.6vw,58px)}
  .final .lede{margin:0 auto 42px;text-align:center}
  .final .wait{margin:0 auto}
  .final .wait-note{text-align:center}

  footer{position:relative;z-index:2;border-top:1px solid var(--line);padding:44px;max-width:1180px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:20px}
  .f-links{display:flex;gap:26px}
  .f-links a{color:var(--dim);text-decoration:none;font-size:13px}
  .f-links a:hover{color:var(--text)}
  .f-note{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--faint);letter-spacing:1px}

  .rv{opacity:0;transform:translateY(28px);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1)}
  .rv.in{opacity:1;transform:none}

  @media (max-width:900px){
    .wrap{padding:0 24px}
    .hero{grid-template-columns:1fr;gap:50px}
    .clock{order:-1}
    .two{grid-template-columns:1fr}
    .report-split{grid-template-columns:1fr;gap:48px}
    .grid2{grid-template-columns:1fr}
    .wait{flex-direction:column}
    .nav{padding:16px 24px}
    .brand span{display:none}
    .act{min-height:auto;padding:90px 0}
    footer{flex-direction:column;text-align:center}
  }
  @media (prefers-reduced-motion:reduce){*{animation:none!important}.rv{opacity:1;transform:none}}
}
`;

function ForDoctorsPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.1 },
    );
    root.querySelectorAll(".rv").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="lr-doc" ref={rootRef}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="glow-field" />

      <nav className="nav">
        <a href="/" className="brand">lab<b>read</b><span>for doctors</span></a>
        <a href="#join" className="nav-cta">Get early access</a>
      </nav>

      <div className="wrap">
        {/* HERO */}
        <section className="act">
          <div className="hero">
            <div className="hero-copy">
              <div className="eyebrow">for doctors &amp; consultants</div>
              <h1>You have <em>four minutes.</em><br />She has thirty questions.</h1>
              <p className="lede">
                You know what her ferritin means. She doesn't. And there isn't time to explain it
                properly — so she leaves, opens Google at midnight, and calls your office in the morning
                because <b>a forum told her it was cancer.</b>
              </p>
              <p className="lede" style={{ marginBottom: 40 }}>
                labread writes the explanation you'd give her if you had thirty minutes.
                Under your name. Before she walks out.
              </p>
              <WaitlistForm
                audience="doctor"
                id="join"
                placeholder="your clinic email"
                buttonLabel="Get early access →"
                note="free during beta · no integration needed"
              />
            </div>

            <div className="clock">
              <svg viewBox="0 0 200 200">
                <defs>
                  <linearGradient id="cg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFC069" /><stop offset="100%" stopColor="#8A2C08" />
                  </linearGradient>
                  <filter id="cgl"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                </defs>
                <circle cx="100" cy="100" r="86" fill="none" stroke="rgba(255,176,102,.07)" strokeWidth="8" />
                <circle cx="100" cy="100" r="86" fill="none" stroke="url(#cg)" strokeWidth="8"
                  strokeLinecap="round" strokeDasharray="540" strokeDashoffset="486"
                  transform="rotate(-90 100 100)" filter="url(#cgl)" />
              </svg>
              <div className="clock-center">
                <div className="clock-num">4</div>
                <div className="clock-lab">minutes</div>
                <div className="clock-sub">the average follow-up consultation</div>
              </div>
            </div>
          </div>
        </section>

        {/* TWO CONVERSATIONS */}
        <section className="act rv">
          <div className="two-hd">
            <div className="eyebrow mid">what happens after she leaves</div>
            <h2>There are two conversations.<br />You're only in <em>one</em> of them.</h2>
            <p className="lede">
              The one in your office lasts four minutes. The one in her head lasts all week.
              labread doesn't replace you — it shows up in the second conversation, saying what you would have said.
            </p>
          </div>

          <div className="two">
            <div className="conv conv-cold">
              <div className="conv-when">without labread</div>
              <div className="beat"><span className="beat-t">14:02</span><span className="beat-x">She leaves with a PDF. Ferritin 18, CRP 4.2, a wall of reference ranges.</span></div>
              <div className="beat"><span className="beat-t">23:40</span><span className="beat-x">She searches "CRP 4.2 high." The third result is a cancer forum.</span></div>
              <div className="beat"><span className="beat-t">01:15</span><span className="beat-x">She's still reading. She hasn't slept. She's convinced something is wrong.</span></div>
              <div className="beat"><span className="beat-t">08:30</span><span className="beat-x">Your receptionist takes the call. She wants an urgent appointment.</span></div>
              <div className="beat"><span className="beat-t">11:00</span><span className="beat-x">You spend the slot re-explaining what you already said yesterday.</span></div>
            </div>

            <div className="conv conv-warm">
              <div className="conv-when">with labread</div>
              <div className="beat"><span className="beat-t">14:02</span><span className="beat-x">She leaves with a report from <b>your clinic</b> — every value explained in plain language.</span></div>
              <div className="beat"><span className="beat-t">19:20</span><span className="beat-x">She reads: <b>"Your CRP is mildly raised — worth monitoring, not alarming."</b> She exhales.</span></div>
              <div className="beat"><span className="beat-t">19:35</span><span className="beat-x">She reads about her ferritin. It's low. She understands why she's tired.</span></div>
              <div className="beat"><span className="beat-t">08:30</span><span className="beat-x">No call. She's following the protocol you approved.</span></div>
              <div className="beat"><span className="beat-t">+90 days</span><span className="beat-x">She comes back with a re-test and <b>an informed question.</b></span></div>
            </div>
          </div>
        </section>

        {/* BRANDED REPORT */}
        <section className="act rv">
          <div className="report-split">
            <div>
              <div className="eyebrow">your name on it</div>
              <h2>A report she'll actually <em>read.</em></h2>
              <p className="lede" style={{ marginTop: 26 }}>
                Upload her results. labread generates a branded interpretation in seconds —
                your clinic, your colours, your authority. Flagged markers first, each with a
                plain-language note she can understand without you in the room.
              </p>
              <p className="lede" style={{ marginTop: 20 }}>
                You review it before it goes out. <b>labread does the writing. You keep the judgement.</b>
              </p>
            </div>

            <div className="rep">
              <div className="rep-hd">
                <div>
                  <div className="rep-clinic">Cabinet Dr. Amrani</div>
                  <div className="rep-pb">powered by labread</div>
                </div>
                <div className="rep-pt">
                  <div className="rep-pt-n">Fatima B.</div>
                  <div className="rep-pt-i">34F · 12 JUL 2026</div>
                </div>
              </div>

              <div className="rm">
                <div className="rm-top"><span className="rm-name">Ferritin</span><span className="rm-val">18 ng/mL · low</span></div>
                <div className="rm-bar"><div className="rm-fill" style={{ width: "12%", background: "#E8743B", color: "#E8743B" }} /></div>
                <p className="rm-note">Iron stores in the bottom 15%. Consistent with her reported fatigue. Optimal 30–150.</p>
              </div>

              <div className="rm">
                <div className="rm-top"><span className="rm-name">CRP</span><span className="rm-val">4.2 mg/L · elevated</span></div>
                <div className="rm-bar"><div className="rm-fill" style={{ width: "60%", background: "#8A2C08", color: "#8A2C08" }} /></div>
                <p className="rm-note">Mildly raised. Worth monitoring — not alarming on its own. Recheck in 8 weeks.</p>
              </div>

              <div className="rm">
                <div className="rm-top"><span className="rm-name">TSH</span><span className="rm-val">2.1 mIU/L · normal</span></div>
                <div className="rm-bar"><div className="rm-fill" style={{ width: "44%", background: "#FFC069", color: "#FFC069" }} /></div>
              </div>

              <div className="rm">
                <div className="rm-top"><span className="rm-name">Hemoglobin</span><span className="rm-val">14.2 g/dL · optimal</span></div>
                <div className="rm-bar"><div className="rm-fill" style={{ width: "66%", background: "#FFC069", color: "#FFC069" }} /></div>
              </div>

              <div className="rep-foot">
                <span>16 markers · 2 flagged</span>
                <span>reviewed by dr. amrani</span>
              </div>
            </div>
          </div>
        </section>

        {/* THE MATH */}
        <section className="act rv">
          <div className="two-hd">
            <div className="eyebrow mid">why you can trust the output</div>
            <h2>The AI never decides the <em>medicine.</em></h2>
            <p className="lede">
              This is the part that matters to you, so we'll be precise about it.
              labread is two layers, and only one of them is a language model.
            </p>
          </div>

          <div className="layers">
            <div className="layer layer-1">
              <div className="layer-eb">layer one · deterministic</div>
              <h3>The math decides</h3>
              <p>A rules-based pipeline extracts every value and maps it to validated clinical reference ranges, adjusted for age and biological sex. There is no model here. No inference. No hallucination is possible — it is the same arithmetic you would do yourself.</p>
            </div>

            <div className="layer-sep"><span>then, and only then</span></div>

            <div className="layer layer-2">
              <div className="layer-eb">layer two · constrained</div>
              <h3>Anna explains</h3>
              <p>A language model turns the result into a sentence a patient understands. She can only describe what the math already established. She cannot invent a number, change a status, diagnose, prescribe, or alarm. She narrates. She never decides.</p>
            </div>
          </div>

          <p className="layer-guard">
            never diagnoses · never doses · never replaces a clinician<br />
            every report ends with: worth discussing with your doctor
          </p>
        </section>

        {/* WHAT YOU GET */}
        <section className="act short rv">
          <div className="two-hd">
            <div className="eyebrow mid">what your practice gets</div>
            <h2>Built for a <em>clinic,</em> not a wellness app.</h2>
          </div>

          <div className="grid2">
            <div className="card">
              <div className="card-eb">coverage</div>
              <h3>50+ markers, any lab, any language</h3>
              <p>Moroccan labs, French labs, international panels. Arabic, French, English. labread reads the formats your patients actually bring you — not just the ones Silicon Valley thought of.</p>
            </div>
            <div className="card">
              <div className="card-eb">trends</div>
              <h3>The trajectory, not the snapshot</h3>
              <p>Upload every test she brings you and labread shows the line. Is ferritin climbing? Did CRP settle? A single value tells you almost nothing. The direction tells you everything.</p>
            </div>
            <div className="card">
              <div className="card-eb">continuity</div>
              <h3>She comes back informed</h3>
              <p>labread generates a 90-day protocol from her results — small daily actions, a streak, a re-test. She doesn't disappear for a year. She returns with data and a real question.</p>
            </div>
            <div className="card">
              <div className="card-eb">privacy</div>
              <h3>EU-hosted, CNDP registered</h3>
              <p>Patient data lives in Paris. Registered with Morocco's data protection authority under Law 09-08. Never used to train models. Never sold. You can tell your patients that honestly.</p>
            </div>
          </div>
        </section>

        {/* FINAL */}
        <section className="act final rv">
          <div className="eyebrow mid">early access · morocco first</div>
          <h2>Give her back the thirty minutes you <em>don't have.</em></h2>
          <p className="lede">labread opens soon. Free for practices during the beta.</p>
          <WaitlistForm
            audience="doctor"
            placeholder="your clinic email"
            buttonLabel="Get early access →"
            note="no integration required · data hosted in the eu"
          />
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
