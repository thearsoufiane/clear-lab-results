import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "labread.health — Your blood test, finally explained." },
      { name: "description", content: "Upload any blood test, in any language, from any lab. Get instant, plain-language explanations and personalized screening recommendations." },
      { property: "og:title", content: "labread.health — Your blood test, finally explained." },
      { property: "og:description", content: "AI-powered medical clarity for your bloodwork." },
    ],
    links: [
      { rel: "canonical", href: "https://labread.health" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500;1,9..144,600&family=Hanken+Grotesk:wght@400;500;600;700&display=swap" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const html = `
<style>
  /* ============================================================
     THEME — change these to recolor the whole page.
     ============================================================ */
  :root {
    --bg:           #0b0a09;
    --bg-card:      #141210;
    --bg-card-2:    #100e0c;
    --glow-core:    #ffc06a;
    --glow-mid:     #f5851f;
    --glow-edge:    #7a3d08;
    --accent:       #f5a04a;
    --accent-soft:  rgba(245,160,74,0.14);

    --text:         #f7f3ec;
    --text-dim:     rgba(247,243,236,0.60);
    --text-faint:   rgba(247,243,236,0.34);

    --btn-bg:       #f7f3ec;
    --btn-text:     #0b0a09;
    --btn-ghost:    rgba(247,243,236,0.08);
    --hairline:     rgba(247,243,236,0.12);

    --low:          #f0a93a;
    --normal:       #7fd6a3;
    --elevated:     #f06a5a;

    --font-display: 'Fraunces', serif;
    --font-body:    'Hanken Grotesk', sans-serif;
  }

  .lr-landing * { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    background:
      radial-gradient(1100px 700px at 88% -2%, rgba(245,133,31,0.13), transparent 58%),
      radial-gradient(900px 800px at 6% 42%, rgba(245,133,31,0.055), transparent 55%),
      radial-gradient(1000px 760px at 78% 78%, rgba(245,133,31,0.07), transparent 58%),
      var(--bg);
    background-attachment: fixed;
    color: var(--text);
    font-family: var(--font-body);
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }
  .lr-landing .wrap { max-width: 1240px; margin: 0 auto; padding: 0 44px; }

  /* ---------- nav ---------- */
  .lr-landing nav {
    position: sticky; top: 0; z-index: 50;
    display: flex; align-items: center; justify-content: space-between;
    padding: 22px 44px;
    background: rgba(11,10,9,0.72);
    backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--hairline);
  }
  .lr-landing .brand { display: flex; align-items: center; gap: 11px; }
  .lr-landing .brand .mark {
    width: 34px; height: 34px; border-radius: 50%;
    background: radial-gradient(circle at 35% 30%, var(--glow-core), var(--glow-mid));
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-display); font-weight: 600; color: #1a0e02; font-size: 1rem;
    box-shadow: 0 0 24px rgba(245,133,31,0.5);
  }
  .lr-landing .brand .name { font-family: var(--font-display); font-weight: 600; font-size: 1.4rem; letter-spacing: -0.01em; }
  .lr-landing .brand .name span { color: var(--text-dim); font-weight: 400; }
  .lr-landing .nav-right { display: flex; align-items: center; gap: 26px; }
  .lr-landing nav a { color: var(--text); text-decoration: none; font-weight: 500; font-size: 1rem; opacity: 0.85; transition: opacity .2s; }
  .lr-landing nav a:hover { opacity: 0.55; }
  .lr-landing .btn-pill {
    background: linear-gradient(135deg, var(--glow-core), var(--glow-mid));
    color: #2a1402 !important; padding: 11px 22px; border-radius: 100px;
    font-weight: 600 !important; opacity: 1 !important; transition: transform .2s, box-shadow .2s;
  }
  .lr-landing .btn-pill:hover { transform: translateY(-2px); box-shadow: 0 8px 26px rgba(245,133,31,0.4); }

  /* ---------- hero ---------- */
  .lr-landing .hero { position: relative; min-height: 92vh; display: flex; flex-direction: column; overflow: hidden; }
  .lr-landing .glow {
    position: absolute; top: 46%; left: 62%; transform: translate(-50%,-50%);
    width: 80vh; height: 80vh; max-width: 880px; max-height: 880px; border-radius: 50%;
    background: radial-gradient(circle, var(--glow-core) 0%, var(--glow-mid) 32%, var(--glow-edge) 60%, var(--bg) 76%);
    filter: blur(6px); z-index: 0; animation: breathe 9s ease-in-out infinite;
  }
  @keyframes breathe { 0%,100%{transform:translate(-50%,-50%) scale(1);opacity:1} 50%{transform:translate(-50%,-50%) scale(1.04);opacity:.93} }
  .lr-landing .portrait { position: absolute; bottom: 0; right: 5%; height: 88%; width: auto; z-index: 1; object-fit: contain; object-position: bottom; filter: drop-shadow(0 0 60px rgba(0,0,0,0.5)); }
  .lr-landing .portrait-ph {
    position: absolute; bottom: 0; right: 11%; height: 74%; width: 26%; z-index: 1;
    background: linear-gradient(180deg, rgba(11,10,9,0.05), rgba(11,10,9,0.85));
    border-radius: 50% 50% 0 0 / 32% 32% 0 0; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 36px;
  }
  .lr-landing .portrait-ph span { color: var(--text-faint); font-size: .85rem; text-align: center; line-height: 1.5; max-width: 190px; }

  /* ---- biomarkers floating inside the glow ---- */
  .lr-landing .bio-field { position:absolute; inset:0; z-index:1; pointer-events:none; }
  .lr-landing .heme { position:absolute; top:46%; left:62%; transform:translate(-50%,-50%); width:42vh; max-width:460px; opacity:0.32; animation:spin 60s linear infinite; }
  .lr-landing .heme path, .lr-landing .heme polygon, .lr-landing .heme circle { stroke:var(--glow-core); stroke-width:1.1; fill:none; }
  @keyframes spin { to { transform:translate(-50%,-50%) rotate(360deg); } }
  .lr-landing .chip {
    position:absolute; display:flex; align-items:center; gap:9px;
    padding:11px 16px; border-radius:100px;
    background:rgba(20,16,12,0.55); backdrop-filter:blur(10px);
    border:1px solid rgba(247,243,236,0.16);
    font-family:var(--font-body); font-weight:600; font-size:0.98rem; color:var(--text);
    box-shadow:0 8px 30px rgba(0,0,0,0.35);
    white-space:nowrap;
    animation:drift 7s ease-in-out infinite;
  }
  .lr-landing .chip .cdot { width:8px; height:8px; border-radius:50%; }
  .lr-landing .chip .cval { color:var(--text-dim); font-weight:500; }
  .lr-landing .chip .arrow { font-weight:700; }
  @keyframes drift { 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-14px); } }
  .lr-landing .chip:nth-child(1){ top:24%; left:55%;  animation-delay:0s;   }
  .lr-landing .chip:nth-child(2){ top:40%; left:72%;  animation-delay:1.1s; }
  .lr-landing .chip:nth-child(3){ top:58%; left:58%;  animation-delay:2.0s; }
  .lr-landing .chip:nth-child(4){ top:70%; left:74%;  animation-delay:0.6s; }
  .lr-landing .chip:nth-child(5){ top:34%; left:84%;  animation-delay:1.6s; }
  /* mobile chip styling is consolidated into the responsive blocks at the end */

  .lr-landing .hero-content { position: relative; z-index: 2; flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 60px 44px 0; max-width: 760px; }
  .lr-landing .eyebrow { display: inline-flex; align-items: center; gap: 8px; font-weight: 500; font-size: .95rem; color: var(--text-dim); margin-bottom: 22px; opacity: 0; animation: rise .7s ease forwards .1s; }
  .lr-landing .eyebrow svg { width: 16px; height: 16px; color: var(--accent); }
  .lr-landing h1.hero-h {
    font-family: var(--font-display); font-weight: 600; font-size: clamp(3rem, 7vw, 6rem);
    line-height: 0.96; letter-spacing: -0.02em; margin-bottom: 26px; opacity: 0; animation: rise .8s ease forwards .22s;
  }
  .lr-landing h1.hero-h em { font-style: italic; font-weight: 500; background: linear-gradient(100deg, var(--text), var(--glow-core) 60%, #9fd3ff); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
  .lr-landing .hero .sub { font-size: 1.22rem; line-height: 1.5; color: var(--text-dim); max-width: 480px; margin-bottom: 38px; opacity: 0; animation: rise .8s ease forwards .36s; }
  .lr-landing .cta-row { display: flex; gap: 14px; align-items: center; opacity: 0; animation: rise .8s ease forwards .5s; }
  .lr-landing .btn { padding: 17px 32px; border-radius: 100px; font-weight: 600; font-size: 1.05rem; text-decoration: none; cursor: pointer; border: none; transition: transform .2s, box-shadow .2s, background .2s; display: inline-flex; align-items: center; gap: 9px; }
  .lr-landing .btn-primary { background: linear-gradient(135deg, var(--glow-core), var(--glow-mid)); color: #2a1402; }
  .lr-landing .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(245,133,31,0.4); }
  .lr-landing .btn-ghost { background: var(--btn-ghost); color: var(--text); backdrop-filter: blur(6px); border: 1px solid var(--hairline); }
  .lr-landing .btn-ghost:hover { background: rgba(247,243,236,0.14); transform: translateY(-2px); }
  .lr-landing .privacy-note { margin-top: 26px; display: inline-flex; align-items: center; gap: 10px; padding: 13px 20px; border: 1px solid var(--hairline); border-radius: 100px; font-size: .92rem; color: var(--text-dim); opacity: 0; animation: rise .9s ease forwards .62s; }
  .lr-landing .privacy-note svg { width: 16px; height: 16px; color: var(--normal); }

  @keyframes rise { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }

  /* Fallback: if animations are disabled (reduced-motion / screenshot engines),
     the opacity:0 entrance elements must still be visible. No effect on the
     normal animated experience. */
  @media (prefers-reduced-motion: reduce) {
    .lr-landing .eyebrow,
    .lr-landing h1.hero-h,
    .lr-landing .hero .sub,
    .lr-landing .cta-row,
    .lr-landing .privacy-note { opacity: 1 !important; animation: none !important; transform: none !important; }
  }

  /* ---------- stats bar ---------- */
  .lr-landing .stats { display: flex; border-top: 1px solid var(--hairline); border-bottom: 1px solid var(--hairline); margin-top: 30px; }
  .lr-landing .stat { flex: 1; padding: 46px 30px; text-align: center; border-right: 1px solid var(--hairline); }
  .lr-landing .stat:last-child { border-right: none; }
  .lr-landing .stat .big { font-family: var(--font-display); font-weight: 600; font-size: 3.4rem; line-height: 1; letter-spacing: -0.02em; }
  .lr-landing .stat .big sub { font-size: 1.3rem; font-weight: 500; vertical-align: baseline; color: var(--text-dim); }
  .lr-landing .stat .lbl { color: var(--text-dim); font-size: 1rem; margin-top: 12px; }

  /* ---------- section shell ---------- */
  .lr-landing section.block { padding: 110px 0; }
  .lr-landing .kicker { text-align: center; color: var(--accent); font-weight: 600; font-size: .85rem; letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 18px; }
  .lr-landing h2.sec { font-family: var(--font-display); font-weight: 600; font-size: clamp(2.2rem, 4.5vw, 3.6rem); text-align: center; letter-spacing: -0.02em; line-height: 1.05; }
  .lr-landing .sec-sub { text-align: center; color: var(--text-dim); font-size: 1.15rem; line-height: 1.55; max-width: 620px; margin: 20px auto 0; }

  /* ---------- sample report ---------- */
  .lr-landing .report-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-top: 56px; }
  .lr-landing .rep-card { background: var(--bg-card); border: 1px solid var(--hairline); border-radius: 18px; padding: 26px; transition: transform .25s, border-color .25s; }
  .lr-landing .rep-card:hover { transform: translateY(-4px); border-color: rgba(247,243,236,0.28); }
  .lr-landing .rep-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
  .lr-landing .rep-name { display: flex; align-items: center; gap: 10px; font-size: 1.2rem; font-weight: 600; }
  .lr-landing .dot { width: 9px; height: 9px; border-radius: 50%; }
  .lr-landing .badge { font-size: .8rem; font-weight: 600; padding: 4px 11px; border-radius: 100px; }
  .lr-landing .b-low { color: var(--low); background: rgba(240,169,58,0.13); border: 1px solid rgba(240,169,58,0.3); }
  .lr-landing .b-normal { color: var(--normal); background: rgba(127,214,163,0.12); border: 1px solid rgba(127,214,163,0.3); }
  .lr-landing .b-elevated { color: var(--elevated); background: rgba(240,106,90,0.12); border: 1px solid rgba(240,106,90,0.3); }
  .lr-landing .rep-val { color: var(--text-dim); font-size: 1rem; margin-bottom: 12px; }
  .lr-landing .rep-txt { color: var(--text); opacity: 0.82; line-height: 1.5; font-size: .98rem; }
  .lr-landing .center-cta { text-align: center; margin-top: 52px; }

  /* ---------- testimonials ---------- */
  .lr-landing .quotes { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; max-width: 980px; margin: 56px auto 0; }
  .lr-landing .quote { background: var(--bg-card-2); border: 1px solid var(--hairline); border-radius: 18px; padding: 32px; }
  .lr-landing .quote p { font-size: 1.18rem; line-height: 1.5; margin-bottom: 16px; }
  .lr-landing .quote .who { color: var(--text-dim); font-size: .98rem; }

  /* ---------- features ---------- */
  .lr-landing .feat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 56px; }
  .lr-landing .feat { background: var(--bg-card-2); border: 1px solid var(--hairline); border-radius: 18px; padding: 30px; transition: transform .25s, border-color .25s; }
  .lr-landing .feat:hover { transform: translateY(-4px); border-color: rgba(247,243,236,0.24); }
  .lr-landing .feat .ic { width: 46px; height: 46px; border-radius: 12px; background: var(--accent-soft); display: flex; align-items: center; justify-content: center; margin-bottom: 22px; }
  .lr-landing .feat .ic svg { width: 22px; height: 22px; color: var(--accent); }
  .lr-landing .feat h3 { font-size: 1.25rem; font-weight: 600; margin-bottom: 10px; }
  .lr-landing .feat p { color: var(--text-dim); line-height: 1.55; }

  /* ---------- how it works ---------- */
  .lr-landing .steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 56px; }
  .lr-landing .step { background: var(--bg-card-2); border: 1px solid var(--hairline); border-radius: 18px; padding: 34px; position: relative; }
  .lr-landing .step .num { font-family: var(--font-body); color: var(--accent); font-weight: 600; font-size: .95rem; margin-bottom: 22px; }
  .lr-landing .step .ic svg { width: 28px; height: 28px; color: var(--accent); margin-bottom: 18px; }
  .lr-landing .step h3 { font-size: 1.35rem; font-weight: 600; margin-bottom: 10px; }
  .lr-landing .step p { color: var(--text-dim); line-height: 1.55; }

  /* ---------- learn ---------- */
  .lr-landing .learn-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 56px; }
  .lr-landing .learn-card { background: var(--bg-card-2); border: 1px solid var(--hairline); border-radius: 18px; padding: 30px; transition: transform .25s, border-color .25s; text-decoration: none; color: var(--text); display: block; }
  .lr-landing .learn-card:hover { transform: translateY(-4px); border-color: rgba(247,243,236,0.24); }
  .lr-landing .learn-card .ic { width: 46px; height: 46px; border-radius: 12px; background: var(--accent-soft); display: flex; align-items: center; justify-content: center; margin-bottom: 22px; }
  .lr-landing .learn-card .ic svg { width: 22px; height: 22px; color: var(--accent); }
  .lr-landing .learn-card h3 { font-size: 1.25rem; font-weight: 600; margin-bottom: 10px; }
  .lr-landing .learn-card p { color: var(--text-dim); line-height: 1.5; margin-bottom: 20px; }
  .lr-landing .read { color: var(--accent); font-weight: 600; display: inline-flex; align-items: center; gap: 7px; }

  /* ---------- final cta ---------- */
  .lr-landing .final { background: radial-gradient(ellipse at 50% 120%, rgba(245,133,31,0.18), transparent 60%); border-top: 1px solid var(--hairline); padding: 120px 0; text-align: center; }
  .lr-landing .final h2 { font-family: var(--font-display); font-weight: 600; font-size: clamp(2.4rem, 5vw, 4.2rem); letter-spacing: -0.02em; line-height: 1.04; }
  .lr-landing .final h2 em { font-style: italic; font-weight: 500; background: linear-gradient(100deg, var(--text), var(--glow-core) 60%, #9fd3ff); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
  .lr-landing .final p { color: var(--text-dim); font-size: 1.18rem; margin: 22px auto 38px; max-width: 520px; }

  .lr-landing footer { border-top: 1px solid var(--hairline); padding: 40px 44px; text-align: center; color: var(--text-faint); font-size: .92rem; }

  /* ---------- responsive ---------- */
  @media (max-width: 980px) {
    .lr-landing .report-grid, .lr-landing .feat-grid, .lr-landing .steps, .lr-landing .learn-grid { grid-template-columns: 1fr 1fr; }
    .lr-landing .quotes { grid-template-columns: 1fr; }
  }
  /* ===== MOBILE (≤768px): stack the hero, contain the orb, reflow chips ===== */
  @media (max-width: 768px) {
    /* shell horizontal padding */
    .lr-landing .wrap, .lr-landing nav, .lr-landing .hero-content, .lr-landing .final, .lr-landing footer { padding-left: 22px; padding-right: 22px; }

    /* nav: hide secondary links, keep the CTA pill — no overflow */
    .lr-landing nav { padding: 16px 22px; }
    .lr-landing .nav-right { gap: 0; }
    .lr-landing .nav-right a:not(.btn-pill) { display: none; }
    .lr-landing .btn-pill { padding: 10px 18px; font-size: 0.95rem; }
    .lr-landing .brand .name { font-size: 1.2rem; }

    /* hero: single column, sized to content (order forces text → chips → stats) */
    .lr-landing .hero { min-height: auto; padding-bottom: 12px; }
    .lr-landing .hero-content { order: 0; flex: initial; max-width: 100%; padding: 44px 22px 0; }
    .lr-landing .eyebrow { order: 0; margin-bottom: 16px; font-size: 0.9rem; }
    .lr-landing h1.hero-h { font-size: clamp(1.9rem, 8vw, 3rem); line-height: 1.05; margin-bottom: 18px; }
    .lr-landing .hero .sub { font-size: 1.05rem; line-height: 1.55; max-width: 100%; margin-bottom: 26px; }

    /* CTAs: full-width stacked, comfortable 48px tap targets */
    .lr-landing .cta-row { flex-direction: column; align-items: stretch; gap: 12px; width: 100%; }
    .lr-landing .btn { justify-content: center; width: 100%; min-height: 48px; padding: 15px 24px; }
    .lr-landing .privacy-note { margin-top: 20px; font-size: 0.86rem; align-items: flex-start; }

    /* orb: contained + dimmed, sits behind the text — never causes horizontal scroll */
    .lr-landing .glow { top: 30%; left: 50%; width: min(86vw, 420px); height: min(86vw, 420px); max-width: 86vw; max-height: 86vw; opacity: 0.5; }

    /* biomarker chips: drop the scattered absolute layout, show a clean centered row below the copy */
    .lr-landing .bio-field { position: static; inset: auto; order: 1; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 10px; padding: 22px 22px 4px; opacity: 1; }
    .lr-landing .heme { display: none; }
    .lr-landing .chip { position: static; transform: none; animation: none; font-size: 0.9rem; padding: 9px 14px; }
    .lr-landing .chip:nth-child(3), .lr-landing .chip:nth-child(6) { display: none; } /* show 3 of 5: Vitamin D ↓, TSH ✓, CRP ↑ */

    /* stats: compact single row that fits (keeps vertical dividers) */
    .lr-landing .stats { order: 2; margin-top: 18px; }
    .lr-landing .stat { padding: 22px 8px; }
    .lr-landing .stat .big { font-size: 1.9rem; }
    .lr-landing .stat .big sub { font-size: 0.85rem; }
    .lr-landing .stat .lbl { font-size: 0.78rem; margin-top: 6px; }

    /* sections: single column + tighter rhythm */
    .lr-landing .report-grid, .lr-landing .feat-grid, .lr-landing .steps, .lr-landing .learn-grid, .lr-landing .quotes { grid-template-columns: 1fr; }
    .lr-landing section.block { padding: 72px 0; }
    .lr-landing .final { padding: 84px 0; }
  }

  /* ===== SMALL PHONES (≤480px): finer typography + stat tuning ===== */
  @media (max-width: 480px) {
    .lr-landing .hero-content { padding-top: 36px; }
    .lr-landing h1.hero-h { font-size: clamp(1.6rem, 7.2vw, 1.95rem); }
    .lr-landing .hero .sub { font-size: 1rem; }
    .lr-landing .stat { padding: 18px 5px; }
    .lr-landing .stat .big { font-size: 1.55rem; }
    .lr-landing .stat .big sub { font-size: 0.75rem; }
    .lr-landing .stat .lbl { font-size: 0.72rem; }
    .lr-landing .chip { font-size: 0.84rem; padding: 8px 12px; }
    .lr-landing section.block { padding: 56px 0; }
  }
</style>

<div class="lr-landing">
  <!-- nav -->
  <nav>
    <div class="brand">
      <div class="mark">l</div>
      <div class="name">labread<span>.health</span></div>
    </div>
    <div class="nav-right">
      <a href="#learn">Learn</a>
      <a href="/auth">Sign in</a>
      <a href="/try-free" class="btn-pill">Try for free</a>
    </div>
  </nav>

  <!-- hero -->
  <section class="hero">
    <div class="glow"></div>
    <div class="bio-field">
      <svg class="heme" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <polygon points="100,28 150,57 150,114 100,143 50,114 50,57"/>
        <polygon points="100,55 128,71 128,103 100,119 72,103 72,71"/>
        <circle cx="100" cy="87" r="9"/>
        <path d="M100,28 L100,8 M150,57 L168,47 M150,114 L168,124 M100,143 L100,163 M50,114 L32,124 M50,57 L32,47"/>
      </svg>
      <div class="chip"><span class="cdot" style="background:var(--low)"></span>Vitamin D <span class="cval">22</span><span class="arrow" style="color:var(--low)">↓</span></div>
      <div class="chip"><span class="cdot" style="background:var(--low)"></span>Ferritin <span class="cval">18</span><span class="arrow" style="color:var(--low)">↓</span></div>
      <div class="chip"><span class="cdot" style="background:var(--normal)"></span>TSH <span class="cval">2.1</span><span class="arrow" style="color:var(--normal)">✓</span></div>
      <div class="chip"><span class="cdot" style="background:var(--elevated)"></span>CRP <span class="cval">4.2</span><span class="arrow" style="color:var(--elevated)">↑</span></div>
      <div class="chip"><span class="cdot" style="background:var(--normal)"></span>B12 <span class="cval">540</span><span class="arrow" style="color:var(--normal)">✓</span></div>
    </div>

    <div class="hero-content">
      <div class="eyebrow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        AI-powered medical clarity
      </div>
      <h1 class="hero-h">Your blood test,<br><em>finally explained.</em></h1>
      <p class="sub">Paste your numbers. We tell you what's normal, what's not, and what to ask your doctor. Plain English. In a minute.</p>
      <div class="cta-row">
        <a href="/try-free" class="btn btn-primary">Try for free <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
        <a href="/auth" class="btn btn-ghost">Sign up to save results</a>
      </div>
      <div class="privacy-note">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
        Your data is never stored. Results are processed and immediately deleted. HIPAA-compliant.
      </div>
    </div>

    <!-- stats -->
    <div class="stats">
      <div class="stat"><div class="big">50+</div><div class="lbl">biomarkers explained</div></div>
      <div class="stat"><div class="big">Minute</div><div class="lbl">to your full report</div></div>
      <div class="stat"><div class="big">Free</div><div class="lbl">no card needed</div></div>
    </div>
  </section>

  <!-- sample report -->
  <section class="block">
    <div class="wrap">
      <div class="kicker">Sample report</div>
      <h2 class="sec">Here's what your report looks like</h2>
      <div class="report-grid">
        <div class="rep-card">
          <div class="rep-head"><div class="rep-name"><span class="dot" style="background:var(--low)"></span>Ferritin</div><span class="badge b-low">Low</span></div>
          <div class="rep-val">18 ng/mL</div>
          <div class="rep-txt">Your iron stores are running low — a common cause of fatigue, brain fog, and feeling cold.</div>
        </div>
        <div class="rep-card">
          <div class="rep-head"><div class="rep-name"><span class="dot" style="background:var(--low)"></span>Vitamin D</div><span class="badge b-low">Low</span></div>
          <div class="rep-val">22 ng/mL</div>
          <div class="rep-txt">Below the optimal range, which is often linked to low energy, low mood, and weaker immunity.</div>
        </div>
        <div class="rep-card">
          <div class="rep-head"><div class="rep-name"><span class="dot" style="background:var(--normal)"></span>TSH</div><span class="badge b-normal">Normal</span></div>
          <div class="rep-val">2.1 mIU/L</div>
          <div class="rep-txt">Your thyroid signal is in range — though one number doesn't capture the full thyroid picture.</div>
        </div>
        <div class="rep-card">
          <div class="rep-head"><div class="rep-name"><span class="dot" style="background:var(--elevated)"></span>CRP</div><span class="badge b-elevated">Elevated</span></div>
          <div class="rep-val">4.2 mg/L</div>
          <div class="rep-txt">A marker of inflammation that's mildly raised — worth understanding what's driving it.</div>
        </div>
      </div>
      <div class="center-cta">
        <a href="/try-free" class="btn btn-primary">Get yours free <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
      </div>

      <div class="quotes">
        <div class="quote"><p>"Useful and actually explains my blood test in language I can understand."</p><div class="who">— Alix</div></div>
        <div class="quote"><p>"I finally understand my blood test."</p><div class="who">— Rechi</div></div>
      </div>
    </div>
  </section>

  <!-- features -->
  <section class="block">
    <div class="wrap">
      <div class="kicker">Why labread</div>
      <h2 class="sec">Built for clarity. Designed for you.</h2>
      <div class="feat-grid">
        <div class="feat"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z"/></svg></div><h3>Any lab, any country</h3><p>Bloodwork, panels, hormones — we read them all, in any language.</p></div>
        <div class="feat"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44A2.5 2.5 0 0 1 4 17.5v-1a2.5 2.5 0 0 1-1.98-3A2.5 2.5 0 0 1 3 9.5 2.5 2.5 0 0 1 5.5 7 2.5 2.5 0 0 1 7 2.5 2.5 2.5 0 0 1 9.5 2zM14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44A2.5 2.5 0 0 0 20 17.5v-1a2.5 2.5 0 0 0 1.98-3A2.5 2.5 0 0 0 21 9.5 2.5 2.5 0 0 0 18.5 7 2.5 2.5 0 0 0 17 2.5 2.5 2.5 0 0 0 14.5 2z"/></svg></div><h3>Plain-language insights</h3><p>No jargon. Just what each value means for your body, today.</p></div>
        <div class="feat"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div><h3>Flagged automatically</h3><p>Color-coded results so abnormal values are impossible to miss.</p></div>
        <div class="feat"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 2v6a4 4 0 0 0 4 4 4 4 0 0 0 4-4V2"/><path d="M12 12v4a4 4 0 0 0 4 4 4 4 0 0 0 4-4"/><circle cx="20" cy="20" r="2"/></svg></div><h3>Screening recommendations</h3><p>Personalized next steps and tests worth discussing with your doctor.</p></div>
        <div class="feat"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg></div><h3>Beautiful history</h3><p>Every report saved, searchable, and easy to compare over time.</p></div>
        <div class="feat"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg></div><h3>Zero data stored</h3><p>Your results are processed and immediately deleted. Nothing is saved. HIPAA-compliant.</p></div>
      </div>
    </div>
  </section>

  <!-- how it works -->
  <section class="block">
    <div class="wrap">
      <div class="kicker">How it works</div>
      <h2 class="sec">Three steps to clarity.</h2>
      <div class="steps">
        <div class="step"><div class="num">01</div><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg></div><h3>Upload</h3><p>Drop a PDF or snap a photo of your lab report.</p></div>
        <div class="step"><div class="num">02</div><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44A2.5 2.5 0 0 1 4 17.5v-1a2.5 2.5 0 0 1-1.98-3A2.5 2.5 0 0 1 3 9.5 2.5 2.5 0 0 1 5.5 7 2.5 2.5 0 0 1 7 2.5 2.5 2.5 0 0 1 9.5 2z"/></svg></div><h3>Analyze</h3><p>Our AI reads every value and references against medical ranges.</p></div>
        <div class="step"><div class="num">03</div><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div><h3>Understand</h3><p>Get plain-language explanations and screening guidance.</p></div>
      </div>
    </div>
  </section>

  <!-- learn -->
  <section class="block" id="learn">
    <div class="wrap">
      <div class="kicker">Learn</div>
      <h2 class="sec">Understand your results.</h2>
      <p class="sec-sub">Plain-English guides to the biomarkers people ask about most — what the numbers mean, and what to do next.</p>
      <div class="learn-grid">
        <a class="learn-card" href="/learn/ferritin"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div><h3>What Does Low Ferritin Mean?</h3><p>Iron deficiency, explained in plain English.</p><span class="read">Read guide <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></a>
        <a class="learn-card" href="/learn/vitamin-d"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div><h3>Vitamin D Deficiency Explained</h3><p>Why "normal" and "optimal" are far apart.</p><span class="read">Read guide <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></a>
        <a class="learn-card" href="/learn/tsh-thyroid"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div><h3>TSH Normal But Still Tired?</h3><p>Why one thyroid number isn't the whole story.</p><span class="read">Read guide <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></a>
        <a class="learn-card" href="/learn/crp"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div><h3>What Does High CRP Mean?</h3><p>The quiet inflammation marker most people miss.</p><span class="read">Read guide <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></a>
        <a class="learn-card" href="/learn/a1c"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div><h3>What Is Pre-Diabetic A1c?</h3><p>The window where changes matter most.</p><span class="read">Read guide <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></a>
      </div>
    </div>
  </section>

  <!-- final cta -->
  <section class="final">
    <div class="wrap">
      <h2>Ready to <em>understand</em> your bloodwork?</h2>
      <p>Join thousands taking control of their health, one lab at a time.</p>
      <a href="/try-free" class="btn btn-primary">Try for free <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
    </div>
  </section>

  <footer>© 2026 labread.health — Your blood test, finally explained.</footer>
</div>
`;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
