import { Link } from "@tanstack/react-router";

/* Co-located stylesheet, ported verbatim from labread-legal.html.
   Global selectors are scoped to .lr-legal so the reset/background don't leak
   past the route; the <style> unmounts with the page. */
const legalCss = `
  .lr-legal{--bg:#0B0907;--bg-2:#100D0A;--line:rgba(245,166,35,.13);--line-soft:rgba(245,166,35,.07);--cream:#F4ECDF;--muted:#9E9384;--faint:#6F6557;--amber:#F5A623;--amber-lite:#FFC069;--grad:linear-gradient(135deg,#FFC069,#F5853F,#E8743B);--serif:'Fraunces',Georgia,serif;--sans:'Inter',system-ui,sans-serif;--mono:'JetBrains Mono',monospace}
  .lr-legal,.lr-legal *{box-sizing:border-box;margin:0;padding:0}
  body:has(.lr-legal){background:radial-gradient(120% 60% at 50% -10%,#171009,#0B0907 55%);color:#F4ECDF;font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased;line-height:1.65}
  .lr-legal{color:var(--cream);font-family:var(--sans);line-height:1.65}
  .lr-legal a{color:var(--amber-lite);text-decoration:none}
  .lr-legal .nav{position:sticky;top:0;backdrop-filter:blur(12px);background:rgba(11,9,7,.7);border-bottom:1px solid var(--line-soft);z-index:10}
  .lr-legal .nav-in{max-width:820px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:16px 24px}
  .lr-legal .brand{display:flex;align-items:center;gap:11px}
  .lr-legal .brand .logo-mark{width:34px;height:34px;filter:drop-shadow(0 0 11px rgba(245,133,63,.4))}
  .lr-legal .brand .word{font-family:var(--serif);font-size:24px;font-weight:600}
  .lr-legal .back{font-size:14px;color:var(--muted)}
  .lr-legal .wrap{max-width:820px;margin:0 auto;padding:54px 24px 90px}
  .lr-legal .eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:.26em;text-transform:uppercase;color:var(--amber)}
  .lr-legal h1{font-family:var(--serif);font-weight:500;font-size:clamp(34px,6vw,52px);letter-spacing:-.01em;margin:14px 0 10px}
  .lr-legal h1 .i{font-style:italic;color:var(--amber-lite)}
  .lr-legal .updated{font-family:var(--mono);font-size:12px;color:var(--faint);margin-bottom:34px}
  .lr-legal .note{border:1px solid rgba(245,166,35,.3);background:rgba(245,133,63,.06);border-radius:12px;padding:14px 16px;font-size:13.5px;color:var(--muted);margin-bottom:40px}
  .lr-legal .note b{color:var(--amber-lite)}
  .lr-legal h2{font-family:var(--serif);font-weight:500;font-size:23px;margin:38px 0 12px;letter-spacing:-.01em}
  .lr-legal p{color:var(--muted);font-size:16px;margin-bottom:14px}
  .lr-legal .foot{max-width:820px;margin:0 auto;padding:28px 24px;border-top:1px solid var(--line-soft);font-family:var(--mono);font-size:12px;color:var(--faint);display:flex;gap:18px;flex-wrap:wrap}
`;

export const LEGAL_HEAD_LINKS = [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" as const },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
  },
  {
    rel: "icon",
    href:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23FFC069'/%3E%3Cstop offset='1' stop-color='%23E8743B'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='36' y='24' width='13' height='62' rx='3.5' fill='url(%23g)'/%3E%3Crect x='36' y='73' width='40' height='13' rx='3.5' fill='url(%23g)'/%3E%3Ccircle cx='92' cy='79.5' r='7' fill='url(%23g)'/%3E%3C/svg%3E",
  },
];

function LmDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <linearGradient id="lmAmber" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFC069" />
          <stop offset=".55" stopColor="#F5853F" />
          <stop offset="1" stopColor="#E8743B" />
        </linearGradient>
        <symbol id="lm" viewBox="0 0 120 120">
          <rect x="36" y="24" width="13" height="62" rx="3.5" fill="url(#lmAmber)" />
          <rect x="36" y="73" width="40" height="13" rx="3.5" fill="url(#lmAmber)" />
          <line x1="76" y1="79.5" x2="108" y2="79.5" stroke="url(#lmAmber)" strokeWidth="2.4" strokeLinecap="round" opacity=".38" />
          <circle cx="92" cy="79.5" r="7" fill="url(#lmAmber)" />
        </symbol>
      </defs>
    </svg>
  );
}

function TermsBody() {
  return (
    <>
      <h2>1. Agreement</h2>
      <p>By creating an account or using labread, you agree to these Terms. labread provides AI-assisted interpretation of lab results for educational purposes and is not a substitute for professional medical advice, diagnosis, or treatment.</p>
      <h2>2. Your account</h2>
      <p>You're responsible for the accuracy of the information you provide and for keeping your credentials secure. You must be of legal age in your jurisdiction to use the service.</p>
      <h2>3. Medical disclaimer</h2>
      <p>labread does not provide medical care. Always seek the advice of a physician or qualified provider with any questions about a medical condition. Never disregard professional advice because of something you read here.</p>
      <h2>4. Data &amp; privacy</h2>
      <p>How we handle your data is described in our <Link to="/privacy">Privacy Policy</Link>. We process uploaded reports to generate your results and protect them with encryption.</p>
      <h2>5. Acceptable use</h2>
      <p>Don't misuse the service, attempt to reverse-engineer it, or upload content you don't have the right to share.</p>
      <h2>6. Changes</h2>
      <p>We may update these Terms from time to time. Continued use after changes means you accept the revised Terms.</p>
      <h2>7. Contact</h2>
      <p>Questions? Reach us at <a href="mailto:hello@labread.health">hello@labread.health</a>.</p>
    </>
  );
}

function PrivacyBody() {
  return (
    <>
      <h2>1. Information we collect</h2>
      <p>We collect the account details you provide (name, email, and the way you intend to use labread), and the lab reports you upload so we can generate your results. We also collect basic usage data to keep the service running.</p>
      <h2>2. How we use it</h2>
      <p>Your information is used to interpret your bloodwork, build your dashboard and protocol, and improve the service. We do not sell your personal data.</p>
      <h2>3. Storage &amp; security</h2>
      <p>Your data is encrypted in transit and at rest. Uploaded files are processed to produce your analysis and handled according to our security practices.</p>
      <h2>4. Sharing</h2>
      <p>We share data only with the processors needed to operate labread (for example hosting and AI analysis providers), under agreements that protect your information. We disclose data when required by law.</p>
      <h2>5. Your rights</h2>
      <p>You can access, correct, export, or delete your account and associated data. Contact us to make a request and we'll respond within a reasonable timeframe.</p>
      <h2>6. Cookies</h2>
      <p>We use essential cookies to keep you signed in and limited analytics to understand usage. You can control non-essential cookies through your browser.</p>
      <h2>7. Changes</h2>
      <p>We may update this Policy from time to time. Material changes will be reflected by the "last updated" date above.</p>
      <h2>8. Contact</h2>
      <p>Privacy questions? Reach us at <a href="mailto:hello@labread.health">hello@labread.health</a>.</p>
    </>
  );
}

export function LegalPage({ kind }: { kind: "terms" | "privacy" }) {
  const isTerms = kind === "terms";
  return (
    <div className="lr-legal">
      <style dangerouslySetInnerHTML={{ __html: legalCss }} />
      <nav className="nav">
        <div className="nav-in">
          <Link className="brand" to="/">
            <svg className="logo-mark">
              <use href="#lm" />
            </svg>
            <span className="word">labread</span>
          </Link>
          <Link className="back" to="/">
            ← Back to home
          </Link>
        </div>
      </nav>
      <LmDefs />

      <div className="wrap">
        <span className="eyebrow">Legal</span>
        <h1>
          {isTerms ? (
            <>
              Terms of <span className="i">Service.</span>
            </>
          ) : (
            <>
              Privacy <span className="i">Policy.</span>
            </>
          )}
        </h1>
        <div className="updated">Last updated · 20 June 2026</div>

        <div className="note">
          <b>Template — replace before launch.</b> This is a branded scaffold so the page renders and
          links resolve. Have the final {isTerms ? "Terms (and Privacy Policy)" : "Privacy Policy (and Terms)"} reviewed
          by a qualified professional, or generate them with a tool like Termly / iubenda, and paste
          the approved copy into these sections.
        </div>

        {isTerms ? <TermsBody /> : <PrivacyBody />}
      </div>

      <footer className="foot">
        <span>© 2026 labread</span>
        <Link to="/terms">Terms</Link>
        <Link to="/privacy">Privacy</Link>
        <span>HIPAA-compliant</span>
      </footer>
    </div>
  );
}
