import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { WaitlistForm } from "@/components/marketing-waitlist";

// Public homepage — ported 1:1 from design-reference/marketing/labread-for-you.html.
// The reference stylesheet is scoped under `.lr-fy` (native CSS nesting) so its
// bare `body`/`h1`/token values never touch the app's global styles. The app
// itself stays behind the coming-soon gate (see src/server.ts); only this and
// the two other marketing routes are public.

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "labread — the health OS your doctor never gave you" },
      {
        name: "description",
        content:
          "Every number on your blood test, explained in your language — then ninety days of doing something about it. Launching soon, Morocco first.",
      },
      { property: "og:title", content: "labread — the health OS your doctor never gave you" },
      {
        property: "og:description",
        content:
          "Upload your blood test. Get every value explained, a 90-day protocol, and a coach who has read your results.",
      },
    ],
    links: [
      { rel: "canonical", href: "https://labread.health" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,200;0,9..144,300;0,9..144,400;1,9..144,300;1,9..144,400&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap",
      },
    ],
  }),
  component: ForYouPage,
});

const CSS = `
html{scroll-behavior:smooth}
@keyframes lrBreathe{0%,100%{opacity:.55}50%{opacity:1}}
@keyframes lrPulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.18);opacity:.85}}
@keyframes lrDrip{0%,100%{opacity:.3;transform:scaleY(.6)}50%{opacity:1;transform:scaleY(1)}}
@keyframes lrOrbPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}

.lr-fy{
  --void:#080705;--ember:#E8743B;--ember-hot:#FF9147;--ember-glow:#FFC069;--ember-deep:#8A2C08;
  --glass:rgba(255,255,255,.035);--glass-line:rgba(255,176,102,.14);
  --text:#EDE5D9;--dim:rgba(237,229,217,.5);--faint:rgba(237,229,217,.28);
  --line:rgba(255,176,102,.07);
  background:var(--void);color:var(--text);font-family:'Inter',-apple-system,sans-serif;
  font-size:17px;line-height:1.6;overflow-x:clip;box-sizing:border-box;-webkit-font-smoothing:antialiased;

  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}

  .glow-field{position:fixed;inset:0;pointer-events:none;z-index:0}
  .glow-field::before{content:'';position:absolute;top:-15%;left:50%;transform:translateX(-50%);width:1100px;height:800px;background:radial-gradient(ellipse,rgba(255,122,24,.16) 0%,rgba(178,58,12,.06) 40%,transparent 68%);animation:lrBreathe 11s ease-in-out infinite}
  .glow-field::after{content:'';position:absolute;bottom:-10%;right:-10%;width:800px;height:800px;background:radial-gradient(circle,rgba(232,116,59,.08) 0%,transparent 62%);animation:lrBreathe 14s ease-in-out infinite reverse}

  .spine{position:fixed;left:50%;top:0;bottom:0;width:1px;transform:translateX(-50%);background:linear-gradient(to bottom,transparent,rgba(255,176,102,.10) 12%,rgba(255,176,102,.10) 88%,transparent);z-index:1;pointer-events:none}
  .spine-fill{position:absolute;top:0;left:-1px;width:3px;height:0%;background:linear-gradient(to bottom,var(--ember-glow),var(--ember),var(--ember-deep));box-shadow:0 0 14px rgba(255,145,71,.7),0 0 40px rgba(232,116,59,.35);border-radius:2px}
  .spine-head{position:absolute;left:-4px;top:0;width:9px;height:9px;border-radius:50%;background:var(--ember-glow);box-shadow:0 0 12px var(--ember-glow),0 0 36px rgba(255,145,71,.8)}

  .day-hud{position:fixed;right:40px;top:50%;transform:translateY(-50%);z-index:50;text-align:right;pointer-events:none;mix-blend-mode:screen}
  .day-hud-label{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:var(--faint);margin-bottom:2px}
  .day-hud-num{font-family:'Fraunces',serif;font-size:76px;font-weight:200;line-height:.9;color:var(--ember);letter-spacing:-3px;text-shadow:0 0 30px rgba(232,116,59,.4)}
  .day-hud-total{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--faint);letter-spacing:2px;margin-top:4px}

  .nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:22px 44px;display:flex;justify-content:space-between;align-items:center;background:linear-gradient(to bottom,rgba(8,7,5,.92),rgba(8,7,5,0))}
  .brand{font-family:'Fraunces',serif;font-size:23px;font-weight:300;color:var(--ember);text-decoration:none;letter-spacing:-.5px}
  .brand b{font-weight:400}
  .nav-cta{background:linear-gradient(135deg,var(--ember-glow),var(--ember));color:#160B04;border:none;padding:11px 24px;border-radius:100px;font-size:14px;font-weight:600;cursor:pointer;text-decoration:none;box-shadow:0 0 24px rgba(232,116,59,.3);transition:box-shadow .25s,transform .2s}
  .nav-cta:hover{box-shadow:0 0 40px rgba(232,116,59,.55);transform:translateY(-1px)}

  .wrap{position:relative;z-index:2;max-width:1180px;margin:0 auto;padding:0 44px}
  .act{min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:120px 0;position:relative}

  .eyebrow{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:3.5px;text-transform:uppercase;color:var(--ember-glow);opacity:.75;margin-bottom:26px;display:flex;align-items:center;gap:12px}
  .eyebrow::before{content:'';width:26px;height:1px;background:var(--ember);opacity:.6}
  .eyebrow.mid{justify-content:center}
  .eyebrow.mid::after{content:'';width:26px;height:1px;background:var(--ember);opacity:.6}

  h1{font-family:'Fraunces',serif;font-weight:200;font-size:clamp(42px,6.4vw,88px);line-height:1.03;letter-spacing:-2.5px}
  h1 em{font-style:italic;font-weight:300;color:var(--ember-glow)}
  h2{font-family:'Fraunces',serif;font-weight:200;font-size:clamp(30px,4.2vw,56px);line-height:1.12;letter-spacing:-1.5px}
  h2 em{font-style:italic;font-weight:300;color:var(--ember-glow)}
  h3{font-family:'Fraunces',serif;font-weight:300;font-size:23px;letter-spacing:-.4px}

  .lede{font-size:20px;color:var(--dim);line-height:1.7;max-width:560px}
  .lede b{color:var(--text);font-weight:500}

  .hero{text-align:center;align-items:center}
  .hero h1{max-width:900px;margin:0 auto 34px}
  .hero .lede{margin:0 auto 44px;max-width:600px}

  .wait{display:flex;gap:10px;max-width:460px;margin:0 auto}
  .wait input{flex:1;background:var(--glass);border:1px solid var(--glass-line);padding:17px 22px;border-radius:100px;color:var(--text);font-size:15px;font-family:'Inter',sans-serif;outline:none;backdrop-filter:blur(14px);transition:border-color .25s,box-shadow .25s}
  .wait input::placeholder{color:var(--faint)}
  .wait input:focus{border-color:var(--ember);box-shadow:0 0 0 3px rgba(232,116,59,.1)}
  .wait button{background:linear-gradient(135deg,var(--ember-glow),var(--ember));color:#160B04;border:none;padding:17px 30px;border-radius:100px;font-size:15px;font-weight:600;font-family:'Inter',sans-serif;cursor:pointer;white-space:nowrap;box-shadow:0 0 30px rgba(232,116,59,.35);transition:box-shadow .25s,transform .2s}
  .wait button:hover{box-shadow:0 0 50px rgba(232,116,59,.6);transform:translateY(-1px)}
  .wait button[disabled]{opacity:.6;cursor:default;box-shadow:none;transform:none}
  .wait-note{margin-top:18px;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:1.5px;color:var(--faint);text-transform:uppercase}
  .wait-done{align-items:center;justify-content:center;gap:11px;background:var(--glass);border:1px solid var(--glass-line);border-radius:100px;padding:15px 24px;color:var(--ember-glow);font-size:15px;backdrop-filter:blur(14px)}
  .wait-err{margin-top:16px;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:var(--ember)}

  .cue{position:absolute;bottom:44px;left:50%;transform:translateX(-50%);font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:2.5px;color:var(--faint);text-transform:uppercase;text-align:center}
  .cue::after{content:'';display:block;width:1px;height:34px;margin:12px auto 0;background:linear-gradient(to bottom,var(--ember),transparent);animation:lrDrip 2.2s ease-in-out infinite}

  .split{display:grid;grid-template-columns:1fr 1fr;gap:90px;align-items:center}
  .t-before{background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.05);border-radius:16px 16px 0 0;padding:26px 30px}
  .t-arrow{height:44px;display:flex;align-items:center;justify-content:center;position:relative}
  .t-arrow::before{content:'';position:absolute;top:0;bottom:0;left:50%;width:1px;background:linear-gradient(to bottom,rgba(255,176,102,.15),var(--ember),rgba(255,176,102,.15))}
  .t-arrow span{position:relative;background:var(--void);padding:0 10px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:2px;color:var(--ember);text-transform:uppercase}
  .t-after{background:linear-gradient(135deg,rgba(255,176,102,.07),rgba(232,116,59,.03));border:1px solid var(--glass-line);border-radius:0 0 16px 16px;padding:26px 30px;backdrop-filter:blur(12px);box-shadow:0 0 50px rgba(232,116,59,.08)}
  .t-tag{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px}
  .t-before .t-tag{color:var(--faint)}
  .t-after .t-tag{color:var(--ember-glow)}
  .t-before p{color:var(--faint);font-family:'JetBrains Mono',monospace;font-size:14px;line-height:1.7}
  .t-after p{font-size:16px;line-height:1.65}
  .t-after p b{color:var(--ember-glow);font-weight:500}

  .days-wrap{text-align:center;align-items:center}
  .days-wrap h2{max-width:760px;margin:0 auto 20px}
  .days-wrap>.lede{margin:0 auto 56px;text-align:center}
  .day-grid{display:grid;grid-template-columns:repeat(18,1fr);gap:8px;max-width:720px;margin:0 auto 48px;width:100%}
  .day-cell{aspect-ratio:1;border-radius:5px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.04)}
  .day-cell.done{background:linear-gradient(135deg,var(--ember),var(--ember-deep));border-color:transparent;box-shadow:0 0 8px rgba(232,116,59,.45)}
  .day-cell.today{background:var(--ember-glow);border-color:var(--ember-glow);box-shadow:0 0 14px var(--ember-glow),0 0 30px rgba(255,192,105,.5);animation:lrPulse 2s ease-in-out infinite}

  .streak-bar{display:inline-flex;align-items:center;gap:26px;background:var(--glass);border:1px solid var(--glass-line);padding:16px 30px;border-radius:100px;backdrop-filter:blur(14px)}
  .streak-item{text-align:left}
  .streak-val{font-family:'Fraunces',serif;font-size:26px;font-weight:300;color:var(--ember-glow);line-height:1}
  .streak-lab{font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:2px;color:var(--faint);text-transform:uppercase;margin-top:3px}
  .streak-div{width:1px;height:30px;background:var(--line)}

  .habits{max-width:440px;margin:56px auto 0;background:var(--glass);border:1px solid var(--glass-line);border-radius:18px;padding:26px 28px;backdrop-filter:blur(14px);text-align:left;width:100%}
  .habits-hd{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:18px;padding-bottom:14px;border-bottom:1px solid var(--line)}
  .habits-hd span:first-child{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:2.5px;color:var(--faint);text-transform:uppercase}
  .habits-hd span:last-child{font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--ember-glow)}
  .hb{display:flex;align-items:center;gap:14px;padding:11px 0}
  .hb-check{width:20px;height:20px;border-radius:50%;border:1.5px solid var(--ember);flex-shrink:0;display:flex;align-items:center;justify-content:center}
  .hb-check.on{background:var(--ember);border-color:var(--ember);box-shadow:0 0 12px rgba(232,116,59,.5)}
  .hb-check.on::after{content:'✓';color:#160B04;font-size:11px;font-weight:700}
  .hb-name{font-size:15px;flex:1}
  .hb-check:not(.on)+.hb-name{color:var(--dim)}
  .hb-pts{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--faint)}

  .anna-act{text-align:center;align-items:center}
  .orb{width:120px;height:120px;border-radius:50%;margin:0 auto 34px;background:radial-gradient(circle at 38% 32%,#FFE3B8,var(--ember-glow) 22%,var(--ember) 52%,var(--ember-deep) 82%);box-shadow:0 0 50px rgba(255,145,71,.55),0 0 110px rgba(232,116,59,.3),inset 0 0 34px rgba(255,227,184,.28);animation:lrOrbPulse 4.5s ease-in-out infinite}
  .anna-act h2{margin-bottom:18px;max-width:800px}
  .anna-act>.lede{margin:0 auto 60px;text-align:center;max-width:600px}
  .convo{max-width:640px;margin:0 auto;text-align:left;width:100%}
  .u-turn{text-align:right;margin-bottom:30px}
  .u-bub{display:inline-block;background:var(--glass);border:1px solid var(--glass-line);border-radius:22px 22px 5px 22px;padding:13px 22px;font-size:15px;color:var(--dim);backdrop-filter:blur(10px);max-width:80%}
  .a-turn{margin-bottom:40px;padding-left:4px}
  .a-tag{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:2.5px;color:var(--ember-glow);margin-bottom:12px}
  .a-text{font-family:'Fraunces',serif;font-size:26px;font-weight:200;line-height:1.5;letter-spacing:-.5px}
  .a-text em{font-style:italic;color:var(--ember-glow);font-weight:300}
  .inline-gauge{display:inline-flex;align-items:center;gap:14px;background:rgba(255,176,102,.05);border:1px solid var(--glass-line);border-radius:12px;padding:12px 18px;margin:14px 0;backdrop-filter:blur(10px)}
  .ig-num{font-family:'Fraunces',serif;font-size:30px;font-weight:300;color:var(--ember-glow);line-height:1}
  .ig-meta{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--faint);letter-spacing:1px;line-height:1.5;margin-top:6px}
  .ig-track{width:110px;height:4px;background:rgba(255,255,255,.06);border-radius:2px;position:relative}
  .ig-fill{position:absolute;left:0;top:0;height:100%;width:52%;border-radius:2px;background:linear-gradient(90deg,var(--ember-deep),var(--ember-glow));box-shadow:0 0 8px rgba(255,192,105,.6)}
  .prompts{display:flex;gap:9px;flex-wrap:wrap;justify-content:center;margin-top:44px}
  .prompt{background:var(--glass);border:1px solid var(--glass-line);padding:10px 18px;border-radius:100px;font-size:13px;color:var(--dim);backdrop-filter:blur(10px);transition:all .25s}
  .prompt:hover{border-color:var(--ember);color:var(--text);box-shadow:0 0 20px rgba(232,116,59,.15)}

  .chal-hd{text-align:center;margin-bottom:60px;display:flex;flex-direction:column;align-items:center}
  .chal-hd h2{max-width:720px;margin:0 auto 18px}
  .chal-hd .lede{margin:0 auto;text-align:center}
  .chal-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
  .chal{border-radius:18px;padding:32px 26px;position:relative;overflow:hidden;background:var(--glass);border:1px solid var(--glass-line);backdrop-filter:blur(14px);transition:transform .35s,box-shadow .35s,border-color .35s}
  .chal:hover{transform:translateY(-6px);border-color:rgba(255,176,102,.3);box-shadow:0 16px 50px rgba(232,116,59,.14)}
  .chal.hot{background:linear-gradient(150deg,#FFB865,#B23A0C 55%,#5E1703);border-color:transparent;box-shadow:0 0 60px rgba(232,116,59,.35)}
  .chal-days{font-family:'Fraunces',serif;font-size:46px;font-weight:200;line-height:1;letter-spacing:-2px;margin-bottom:6px;color:var(--ember-glow)}
  .chal.hot .chal-days{color:#FFF3E2}
  .chal-unit{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:var(--faint);margin-bottom:20px}
  .chal.hot .chal-unit{color:rgba(255,243,226,.75)}
  .chal h3{margin-bottom:10px;font-size:19px}
  .chal.hot h3{color:#FFF3E2}
  .chal p{font-size:13.5px;color:var(--dim);line-height:1.6;margin-bottom:20px}
  .chal.hot p{color:rgba(255,243,226,.85)}
  .chal-reward{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:var(--ember);padding-top:14px;border-top:1px solid var(--line)}
  .chal.hot .chal-reward{color:#FFF3E2;border-top-color:rgba(255,243,226,.22)}

  .stories-hd{text-align:center;margin-bottom:56px;display:flex;flex-direction:column;align-items:center}
  .stories-hd h2{max-width:700px;margin:0 auto 18px}
  .stories-hd .lede{margin:0 auto;text-align:center}
  .stories{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
  .story{border-radius:20px;overflow:hidden;border:1px solid var(--glass-line);background:var(--glass);backdrop-filter:blur(14px);transition:transform .4s,box-shadow .4s}
  .story:hover{transform:translateY(-6px);box-shadow:0 20px 60px rgba(232,116,59,.16)}
  .story-img{height:190px;padding:28px;display:flex;align-items:flex-end;position:relative;overflow:hidden}
  .story:nth-child(1) .story-img{background:linear-gradient(145deg,#C4501E,#5E1703)}
  .story:nth-child(2) .story-img{background:linear-gradient(145deg,#E8743B,#7A2408)}
  .story:nth-child(3) .story-img{background:linear-gradient(145deg,#FFB865,#8A2C08)}
  .story-img::after{content:'';position:absolute;inset:0;background:radial-gradient(circle at 75% 20%,rgba(255,227,184,.25),transparent 55%)}
  .story-hl{font-family:'Fraunces',serif;font-size:26px;font-weight:300;line-height:1.15;color:#FFF3E2;text-transform:uppercase;letter-spacing:-.5px;position:relative;z-index:1}
  .story-hl em{display:block;font-style:italic;text-transform:none;color:#FFE3B8;font-weight:300}
  .story-body{padding:22px 26px 26px}
  .story-who{display:flex;align-items:center;gap:11px;margin-bottom:12px}
  .story-av{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--ember-glow),var(--ember-deep));flex-shrink:0}
  .story-name{font-size:14px;font-weight:500}
  .story-loc{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--faint);letter-spacing:1px}
  .story-res{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--ember-glow);letter-spacing:1px;padding-top:12px;border-top:1px solid var(--line);display:flex;justify-content:space-between}
  .story-likes{color:var(--faint)}

  .proof{text-align:center;align-items:center}
  .proof h2{max-width:800px;margin:0 auto 20px}
  .proof>.lede{margin:0 auto 56px;text-align:center}
  .aurora{max-width:760px;margin:0 auto;background:var(--glass);border:1px solid var(--glass-line);border-radius:20px;padding:32px;backdrop-filter:blur(14px);width:100%}
  .aurora-hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:22px;flex-wrap:wrap;gap:12px}
  .aurora-hd>span{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:2.5px;color:var(--faint);text-transform:uppercase}
  .aurora-legend{display:flex;gap:16px}
  .leg{display:flex;align-items:center;gap:6px;font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--dim)}
  .leg i{width:8px;height:8px;border-radius:2px;display:block}
  .aurora-axis{display:flex;justify-content:space-between;font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--faint);letter-spacing:1px;margin-top:10px}

  .final{text-align:center;align-items:center}
  .final h2{max-width:800px;margin:0 auto 22px;font-size:clamp(34px,5vw,64px)}
  .final .lede{margin:0 auto 44px;text-align:center}
  .final .wait-note{text-align:center}

  footer{position:relative;z-index:2;border-top:1px solid var(--line);padding:44px;max-width:1180px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:20px}
  .f-links{display:flex;gap:26px}
  .f-links a{color:var(--dim);text-decoration:none;font-size:13px;transition:color .2s}
  .f-links a:hover{color:var(--text)}
  .f-note{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--faint);letter-spacing:1px}

  .rv{opacity:0;transform:translateY(28px);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1)}
  .rv.in{opacity:1;transform:none}

  @media (max-width:900px){
    .day-hud,.spine{display:none}
    .wrap{padding:0 24px}
    .split{grid-template-columns:1fr;gap:48px}
    .chal-grid{grid-template-columns:repeat(2,1fr)}
    .stories{grid-template-columns:1fr}
    .day-grid{grid-template-columns:repeat(10,1fr)}
    .wait{flex-direction:column}
    .nav{padding:16px 24px}
    .act{min-height:auto;padding:90px 0}
    footer{flex-direction:column;text-align:center}
    .a-text{font-size:22px}
  }
  @media (max-width:560px){
    .chal-grid{grid-template-columns:1fr}
    .streak-bar{flex-wrap:wrap;border-radius:20px;gap:18px;justify-content:center}
  }
  @media (prefers-reduced-motion:reduce){
    *{animation:none!important}
    .rv{opacity:1;transform:none}
  }
}
`;

function ForYouPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const spineFillRef = useRef<HTMLDivElement>(null);
  const spineHeadRef = useRef<HTMLDivElement>(null);
  const dayNumRef = useRef<HTMLDivElement>(null);
  const dayGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const fill = spineFillRef.current;
    const head = spineHeadRef.current;
    const dayN = dayNumRef.current;
    const grid = dayGridRef.current;

    // Scroll-linked spine + day counter (1 → 90 across the page).
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      if (fill) fill.style.height = p * 100 + "%";
      if (head) head.style.top = p * 100 + "%";
      if (dayN) dayN.textContent = String(Math.max(1, Math.round(p * 90))).padStart(2, "0");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // 90-day grid: days 1–46 done, day 47 today.
    if (grid && grid.childElementCount === 0) {
      for (let i = 1; i <= 90; i++) {
        const c = document.createElement("div");
        c.className = "day-cell" + (i < 47 ? " done" : i === 47 ? " today" : "");
        grid.appendChild(c);
      }
    }

    // Scroll reveals.
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.12 },
    );
    root.querySelectorAll(".rv").forEach((el) => io.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <div className="lr-fy" ref={rootRef}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="glow-field" />
      <div className="spine">
        <div className="spine-fill" ref={spineFillRef} />
        <div className="spine-head" ref={spineHeadRef} />
      </div>

      <div className="day-hud">
        <div className="day-hud-label">day</div>
        <div className="day-hud-num" ref={dayNumRef}>01</div>
        <div className="day-hud-total">of 90</div>
      </div>

      <nav className="nav">
        <a href="/" className="brand">lab<b>read</b></a>
        <a href="#join" className="nav-cta">Join the waitlist</a>
      </nav>

      <div className="wrap">
        {/* ACT 0 */}
        <section className="act hero">
          <div className="eyebrow mid">the health os your doctor never gave you</div>
          <h1>Your body has been talking.<br />Nobody was <em>translating.</em></h1>
          <p className="lede">
            It starts with your blood test — every number explained in your language.
            But that's <b>day one.</b> What comes after is ninety days of actually
            doing something about it.
          </p>
          <WaitlistForm
            audience="individual"
            id="join"
            buttonLabel="Join the waitlist →"
            note="launching soon · morocco first"
          />
          <div className="cue">scroll</div>
        </section>

        {/* ACT 1 */}
        <section className="act rv">
          <div className="split">
            <div>
              <div className="eyebrow">day 01 · the translation</div>
              <h2>The number was always <em>there.</em> The meaning wasn't.</h2>
              <p className="lede" style={{ marginTop: 26 }}>
                Your lab said "within normal range." labread reads the same value against
                real clinical ranges — adjusted for your age and sex — and tells you where
                you <b>actually</b> stand. Math first. Then words you understand.
              </p>
            </div>
            <div>
              <div className="t-before">
                <div className="t-tag">your lab report</div>
                <p>FERRITIN &nbsp; 18 ng/mL &nbsp; [ 15 – 300 ] &nbsp; NORMAL</p>
              </div>
              <div className="t-arrow"><span>labread</span></div>
              <div className="t-after">
                <div className="t-tag">what it means for you</div>
                <p><b>Your iron stores are running low.</b> Technically "normal" — but you're in the bottom 15%. This is the quiet cause of the fatigue, the brain fog, and always feeling cold. Optimal starts at 30.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ACT 2 */}
        <section className="act days-wrap rv">
          <div className="eyebrow mid">day 01 → day 90 · the protocol</div>
          <h2>Understanding is easy.<br /><em>Changing</em> is the hard part.</h2>
          <p className="lede">
            So labread doesn't stop at the report. It builds you a ninety-day protocol from
            your own results — a few small daily actions, not a lifestyle overhaul. Check them off.
            Keep the streak. Watch the number move.
          </p>

          <div className="day-grid" ref={dayGridRef} />

          <div className="streak-bar">
            <div className="streak-item"><div className="streak-val">47</div><div className="streak-lab">day of 90</div></div>
            <div className="streak-div" />
            <div className="streak-item"><div className="streak-val">12</div><div className="streak-lab">day streak</div></div>
            <div className="streak-div" />
            <div className="streak-item"><div className="streak-val">3,280</div><div className="streak-lab">points earned</div></div>
          </div>

          <div className="habits">
            <div className="habits-hd"><span>today's actions</span><span>3 of 5 done</span></div>
            <div className="hb"><span className="hb-check on" /><span className="hb-name">Iron-rich meal</span><span className="hb-pts">+20</span></div>
            <div className="hb"><span className="hb-check on" /><span className="hb-name">Vitamin D · 4000 IU</span><span className="hb-pts">+20</span></div>
            <div className="hb"><span className="hb-check on" /><span className="hb-name">8,000 steps</span><span className="hb-pts">+20</span></div>
            <div className="hb"><span className="hb-check" /><span className="hb-name">Magnesium before bed</span><span className="hb-pts">+20</span></div>
            <div className="hb"><span className="hb-check" /><span className="hb-name">Sleep 7h+</span><span className="hb-pts">+20</span></div>
          </div>
        </section>

        {/* ACT 3 */}
        <section className="act anna-act rv">
          <div className="orb" />
          <div className="eyebrow mid">day 12 · 3:40 am · you couldn't sleep</div>
          <h2>The only coach who has read <em>your</em> blood.</h2>
          <p className="lede">
            Anna isn't a chatbot with a health skin. She knows your ferritin. She knows you're on
            day 47. She knows what moved and what didn't. Ask her anything, in any language,
            at any hour — and the answer is about <b>you</b>, not a textbook.
          </p>

          <div className="convo">
            <div className="u-turn"><span className="u-bub">why do I still feel tired? it's been 6 weeks</span></div>

            <div className="a-turn">
              <div className="a-tag">[ anna ]</div>
              <p className="a-text">Actually — you're turning the corner. Yours has climbed from 18 to 31 since you started.</p>
              <div className="inline-gauge">
                <span className="ig-num">31</span>
                <div>
                  <div className="ig-track"><div className="ig-fill" /></div>
                  <div className="ig-meta">FERRITIN · ng/mL · optimal 30–150</div>
                </div>
              </div>
              <p className="a-text">That's <em>into the optimal range.</em> The tired usually lags the number by a few weeks. Stay with it.</p>
            </div>

            <div className="u-turn"><span className="u-bub">what should I eat this week?</span></div>

            <div className="a-turn">
              <div className="a-tag">[ anna ]</div>
              <p className="a-text">Lentils, spinach with lemon, red meat twice if you can. The lemon matters — <em>vitamin C doubles iron absorption.</em></p>
            </div>
          </div>

          <div className="prompts">
            <span className="prompt">Explain my CRP</span>
            <span className="prompt">Am I actually improving?</span>
            <span className="prompt">What should I ask my doctor?</span>
            <span className="prompt">Why does vitamin D matter?</span>
          </div>
        </section>

        {/* ACT 4 */}
        <section className="act rv">
          <div className="chal-hd">
            <div className="eyebrow mid">the challenges</div>
            <h2>Your body responds to <em>consistency,</em> not intentions.</h2>
            <p className="lede">
              Pick a challenge. Show up daily. Earn points. The longer you go, the more labread
              gives back — because the people who stay are the people who change.
            </p>
          </div>

          <div className="chal-grid">
            <div className="chal">
              <div className="chal-days">21</div>
              <div className="chal-unit">days</div>
              <h3>Iron Reset</h3>
              <p>Three weeks of iron-rich meals, timed vitamin C, and the small things that actually move ferritin.</p>
              <div className="chal-reward">2,100 pts → 20% off</div>
            </div>
            <div className="chal">
              <div className="chal-days">30</div>
              <div className="chal-unit">days</div>
              <h3>Energy Rebuild</h3>
              <p>Sleep, sunlight, and the B-vitamins your panel says you're short on. A month to feel like yourself.</p>
              <div className="chal-reward">3,000 pts → 30% off</div>
            </div>
            <div className="chal">
              <div className="chal-days">45</div>
              <div className="chal-unit">days</div>
              <h3>Metabolic Shift</h3>
              <p>Six weeks working on the markers that decide how your body handles sugar and fat.</p>
              <div className="chal-reward">4,500 pts → 50% off</div>
            </div>
            <div className="chal hot">
              <div className="chal-days">90</div>
              <div className="chal-unit">days · the big one</div>
              <h3>Transformation</h3>
              <p>The full protocol, start to finish. Re-test at the end. Finish it, and your next month is 90% off.</p>
              <div className="chal-reward">9,000 pts → 90% off</div>
            </div>
          </div>
        </section>

        {/* ACT 5 */}
        <section className="act rv">
          <div className="stories-hd">
            <div className="eyebrow mid">real people · real reports</div>
            <h2>Nobody does ninety days <em>alone.</em></h2>
            <p className="lede">
              Every person who finishes a challenge writes what it was actually like — what worked,
              what they'd do differently, what nobody told them. Read them. Then write yours.
            </p>
          </div>

          <div className="stories">
            <div className="story">
              <div className="story-img"><div className="story-hl">FROM EXHAUSTED TO<em>finally myself</em></div></div>
              <div className="story-body">
                <div className="story-who"><span className="story-av" /><div><div className="story-name">Salma K.</div><div className="story-loc">CASABLANCA</div></div></div>
                <div className="story-res"><span>Day 90 · ferritin doubled</span><span className="story-likes">♡ 214</span></div>
              </div>
            </div>
            <div className="story">
              <div className="story-img"><div className="story-hl">MY ENERGY<em>came back</em></div></div>
              <div className="story-body">
                <div className="story-who"><span className="story-av" /><div><div className="story-name">Youssef B.</div><div className="story-loc">RABAT</div></div></div>
                <div className="story-res"><span>Day 47 · vit D 22 → 41</span><span className="story-likes">♡ 168</span></div>
              </div>
            </div>
            <div className="story">
              <div className="story-img"><div className="story-hl">SLEEPING<em>like I mean it</em></div></div>
              <div className="story-body">
                <div className="story-who"><span className="story-av" /><div><div className="story-name">Nadia M.</div><div className="story-loc">MARRAKECH</div></div></div>
                <div className="story-res"><span>Day 30 · CRP 4.2 → 1.8</span><span className="story-likes">♡ 302</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* ACT 6 */}
        <section className="act proof rv">
          <div className="eyebrow mid">day 90 · the re-test</div>
          <h2>The only opinion that matters is your <em>next blood test.</em></h2>
          <p className="lede">
            Ninety days later you draw again. And this time you don't wonder whether it worked —
            you look at the line and you know.
          </p>

          <div className="aurora">
            <div className="aurora-hd">
              <span>your markers · 90 days</span>
              <div className="aurora-legend">
                <span className="leg"><i style={{ background: "#FFC069" }} />Ferritin</span>
                <span className="leg"><i style={{ background: "#E8743B" }} />Vitamin D</span>
                <span className="leg"><i style={{ background: "#8A2C08" }} />CRP</span>
              </div>
            </div>
            <svg viewBox="0 0 700 200" style={{ width: "100%", height: "auto" }} role="img" aria-label="Three biomarkers trending over 90 days">
              <defs>
                <linearGradient id="a1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFC069" stopOpacity=".38" /><stop offset="100%" stopColor="#FFC069" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="a2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E8743B" stopOpacity=".32" /><stop offset="100%" stopColor="#E8743B" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="a3" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8A2C08" stopOpacity=".3" /><stop offset="100%" stopColor="#8A2C08" stopOpacity="0" />
                </linearGradient>
                <filter id="sg"><feGaussianBlur stdDeviation="2.4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              </defs>
              <path d="M0,72 C120,80 240,104 360,130 C480,150 600,158 700,162 L700,200 L0,200 Z" fill="url(#a3)" style={{ mixBlendMode: "screen" }} />
              <path d="M0,72 C120,80 240,104 360,130 C480,150 600,158 700,162" fill="none" stroke="#8A2C08" strokeWidth="1.6" filter="url(#sg)" opacity=".85" />
              <path d="M0,150 C120,146 240,128 360,102 C480,80 600,66 700,58 L700,200 L0,200 Z" fill="url(#a2)" style={{ mixBlendMode: "screen" }} />
              <path d="M0,150 C120,146 240,128 360,102 C480,80 600,66 700,58" fill="none" stroke="#E8743B" strokeWidth="1.6" filter="url(#sg)" opacity=".9" />
              <path d="M0,168 C120,160 240,132 360,92 C480,58 600,40 700,32 L700,200 L0,200 Z" fill="url(#a1)" style={{ mixBlendMode: "screen" }} />
              <path d="M0,168 C120,160 240,132 360,92 C480,58 600,40 700,32" fill="none" stroke="#FFC069" strokeWidth="2" filter="url(#sg)" />
              <circle cx="696" cy="32" r="4" fill="#FFC069" filter="url(#sg)" />
            </svg>
            <div className="aurora-axis"><span>DAY 1</span><span>DAY 30</span><span>DAY 60</span><span>DAY 90</span></div>
          </div>
        </section>

        {/* FINAL */}
        <section className="act final rv">
          <div className="eyebrow mid">day 91 · you start again, higher</div>
          <h2>Ninety days from now, you'll wish you'd <em>started today.</em></h2>
          <p className="lede">
            labread opens soon. Morocco first. Bring your last blood test — we'll take it from there.
          </p>
          <WaitlistForm
            audience="individual"
            buttonLabel="Join the waitlist →"
            note="data hosted in the eu · never used to train ai · cndp registered"
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
