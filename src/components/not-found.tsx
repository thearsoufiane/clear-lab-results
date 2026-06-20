import { Link } from "@tanstack/react-router";

/* Ported verbatim from labread-404.html, scoped to .lr-404 so the global
   reset/centering/background don't leak past the not-found screen. */
const notFoundCss = `
  .lr-404{--bg:#0B0907;--cream:#F4ECDF;--muted:#9E9384;--faint:#6F6557;--amber:#F5A623;--amber-lite:#FFC069;--grad:linear-gradient(135deg,#FFC069,#F5853F,#E8743B);--serif:'Fraunces',Georgia,serif;--sans:'Inter',system-ui,sans-serif;--mono:'JetBrains Mono',monospace;--line:rgba(245,166,35,.13)}
  .lr-404,.lr-404 *{box-sizing:border-box;margin:0;padding:0}
  body:has(.lr-404){background:#0B0907}
  .lr-404{min-height:100vh;background:radial-gradient(120% 80% at 50% 0%,#1a1209,#0B0907 60%);color:var(--cream);font-family:var(--sans);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px;position:relative;overflow:hidden}
  .lr-404::before{content:"";position:absolute;width:520px;height:520px;border-radius:50%;background:radial-gradient(circle,rgba(245,133,63,.18),transparent 60%);filter:blur(30px);top:18%;animation:lr404pulse 5s ease-in-out infinite}
  @keyframes lr404pulse{0%,100%{opacity:.6;transform:scale(1)}50%{opacity:1;transform:scale(1.08)}}
  .lr-404 .brand{position:absolute;top:26px;left:26px;display:flex;align-items:center;gap:10px;z-index:2}
  .lr-404 .brand .logo-mark{width:32px;height:32px;filter:drop-shadow(0 0 11px rgba(245,133,63,.4))}
  .lr-404 .brand .word{font-family:var(--serif);font-size:21px;font-weight:600}
  .lr-404 .z{position:relative;z-index:2}
  .lr-404 .eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:var(--amber);margin-bottom:18px}
  .lr-404 .big{font-family:var(--serif);font-weight:600;font-size:clamp(96px,20vw,180px);line-height:.9;letter-spacing:-.02em}
  .lr-404 .big .i{font-style:italic;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent}
  .lr-404 h1{font-family:var(--serif);font-weight:500;font-size:26px;margin:18px 0 10px}
  .lr-404 p{color:var(--muted);font-size:16px;max-width:420px;margin:0 auto 30px}
  .lr-404 .btn{display:inline-flex;align-items:center;gap:9px;background:var(--grad);color:#1a0f02;font-weight:600;font-size:15px;padding:14px 26px;border-radius:999px;box-shadow:0 14px 40px rgba(245,133,63,.3);transition:.16s}
  .lr-404 .btn:hover{transform:translateY(-2px);filter:brightness(1.05)}
  .lr-404 .btn svg{width:17px;height:17px;stroke:#1a0f02;stroke-width:2.4;fill:none}
  .lr-404 a{text-decoration:none}
  @media(prefers-reduced-motion:reduce){.lr-404::before{animation:none}}
`;

export function NotFound() {
  return (
    <div className="lr-404">
      <style dangerouslySetInnerHTML={{ __html: notFoundCss }} />
      {/* fonts (this renders outside any route head) */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
      />

      <Link className="brand" to="/">
        <svg className="logo-mark" width="32" height="32" viewBox="0 0 120 120">
          <defs>
            <linearGradient id="g404" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#FFC069" />
              <stop offset="1" stopColor="#E8743B" />
            </linearGradient>
          </defs>
          <rect x="36" y="24" width="13" height="62" rx="3.5" fill="url(#g404)" />
          <rect x="36" y="73" width="40" height="13" rx="3.5" fill="url(#g404)" />
          <line x1="76" y1="79.5" x2="108" y2="79.5" stroke="url(#g404)" strokeWidth="2.4" strokeLinecap="round" opacity=".38" />
          <circle cx="92" cy="79.5" r="7" fill="url(#g404)" />
        </svg>
        <span className="word">labread</span>
      </Link>

      <div className="z">
        <div className="eyebrow">Lost in the labwork</div>
        <div className="big">
          4<span className="i">0</span>4
        </div>
        <h1>This page didn't come back in range.</h1>
        <p>The page you're looking for doesn't exist or has moved. Let's get you back to something healthy.</p>
        <Link className="btn" to="/">
          Go home{" "}
          <svg viewBox="0 0 24 24">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
