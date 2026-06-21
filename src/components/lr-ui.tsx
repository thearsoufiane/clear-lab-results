import {
  useEffect, useRef,
  type ReactNode, type RefObject, type CSSProperties, type ButtonHTMLAttributes,
} from "react";

/* =====================================================================
   labread shared design system (amber / Fraunces landing language),
   scoped to a `.lr-ui` container so it composes with the rest of the app
   without leaking — same approach as the dashboard/clinician screens.
   Wrap a screen in <LrUi> (or a `.lr-ui` div + <style>) and use the
   primitives below: <GlassPanel>, <GradientButton>, <Eyebrow>, <Reveal>,
   <Gauge>.
   ===================================================================== */

export const LR_FONT_LINKS = [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" as const },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
  },
];

export const LR_UI_CSS = `
  .lr-ui{
    --bg:#0B0907;--bg-2:#100D0A;--surface:#15110A;--surface-2:#1C160D;--surface-3:#231B10;
    --line:rgba(245,166,35,.12);--line-soft:rgba(245,166,35,.07);--ink-line:rgba(244,236,223,.08);
    --cream:#F4ECDF;--muted:#9E9384;--faint:#6F6557;
    --amber:#F5A623;--amber-lite:#FFC069;--amber-deep:#E8743B;
    --grad:linear-gradient(135deg,#FFC069,#F5853F,#E8743B);
    --green:#6FCF97;--warn:#E3A94A;--red:#E0706A;
    --serif:'Fraunces',Georgia,serif;--sans:'Inter',system-ui,sans-serif;--mono:'JetBrains Mono',monospace;
    color:var(--cream);font-family:var(--sans);
  }
  .lr-ui *{box-sizing:border-box}
  .lr-ui h1,.lr-ui h2,.lr-ui h3,.lr-ui h4{font-family:var(--serif);font-weight:500;letter-spacing:-.01em;line-height:1.08}
  .lr-ui .lr-eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--faint)}
  .lr-ui .lr-glass{background:var(--surface);border:1px solid var(--line);border-radius:18px;
    box-shadow:0 1px 0 rgba(255,255,255,.025) inset, 0 24px 60px rgba(0,0,0,.4)}
  .lr-ui .lr-gbtn{display:inline-flex;align-items:center;justify-content:center;gap:9px;font-family:var(--sans);
    font-weight:600;font-size:15px;border:none;border-radius:999px;padding:13px 24px;cursor:pointer;
    background:var(--grad);color:#1a0f02;box-shadow:0 0 30px rgba(245,133,63,.28);transition:.18s}
  .lr-ui .lr-gbtn:hover{transform:translateY(-1px);box-shadow:0 0 46px rgba(245,133,63,.42)}
  .lr-ui .lr-gbtn:active{transform:translateY(0)}
  .lr-ui .lr-gbtn:focus-visible{outline:2px solid var(--amber-lite);outline-offset:2px}
  .lr-ui .lr-gbtn:disabled{opacity:.45;cursor:not-allowed;transform:none;box-shadow:none;filter:saturate(.7)}
  .lr-ui .lr-gbtn svg{width:17px;height:17px}

  /* scroll-reveal — visible by default (SSR / no-JS), hidden only once JS runs */
  .lr-ui .rv{opacity:1;transform:none}
  html.js .lr-ui .rv{opacity:0;transform:translateY(22px);transition:opacity .6s ease,transform .6s cubic-bezier(.22,1,.36,1)}
  html.js .lr-ui .rv.in{opacity:1;transform:none}
  @media(prefers-reduced-motion:reduce){html.js .lr-ui .rv{opacity:1;transform:none;transition:none}}

  @keyframes lrspin{to{transform:rotate(360deg)}}
  .lr-ui .lr-spin{animation:lrspin 1.05s linear infinite;transform-origin:center}
  @keyframes lrpulse{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.18)}}
  .lr-ui .lr-pulse{animation:lrpulse 1.6s ease-in-out infinite}
  @media(prefers-reduced-motion:reduce){.lr-ui .lr-spin,.lr-ui .lr-pulse{animation:none}}
`;

/* One bulletproof reveal path (mirrors the landing fix): IntersectionObserver
   threshold 0 + rootMargin, synchronous mount sweep, scroll/resize safety net,
   no-IO fallback. Re-runs when `deps` change so async-loaded .rv get observed. */
export function useReveal(rootRef: RefObject<HTMLElement | null>, deps: unknown[] = []) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    document.documentElement.classList.add("js");
    const reveal = (el: HTMLElement) => { if (!el.classList.contains("in")) el.classList.add("in"); };
    const vh = () => window.innerHeight || document.documentElement.clientHeight;
    const all = () => Array.from(root.querySelectorAll<HTMLElement>(".rv"));
    const sweep = () => all().forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < vh() * 0.92 && r.bottom > 0) reveal(el);
    });
    const timers: ReturnType<typeof setTimeout>[] = [];
    let io: IntersectionObserver | null = null;
    let onScroll: (() => void) | null = null;
    if (!("IntersectionObserver" in window)) {
      all().forEach(reveal);
    } else {
      io = new IntersectionObserver(
        (es) => es.forEach((e) => { if (e.isIntersecting) { reveal(e.target as HTMLElement); io!.unobserve(e.target); } }),
        { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0 },
      );
      all().forEach((el) => io!.observe(el));
      onScroll = sweep;
      sweep();
      requestAnimationFrame(sweep);
      timers.push(setTimeout(sweep, 300));
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
    }
    return () => {
      if (io) io.disconnect();
      timers.forEach(clearTimeout);
      if (onScroll) { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootRef, ...deps]);
}

/* shared gradient def for <Gauge> rings (rendered once via <LrDefs/>) */
export function LrDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <linearGradient id="lrGaugeGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFC069" />
          <stop offset="1" stopColor="#E8743B" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Eyebrow({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div className="lr-eyebrow" style={style}>{children}</div>;
}

export function GlassPanel({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return <div className={"lr-glass" + (className ? " " + className : "")} style={style}>{children}</div>;
}

export function GradientButton({ children, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={"lr-gbtn" + (className ? " " + className : "")} {...props}>
      {children}
    </button>
  );
}

export function Reveal({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return <div className={"rv" + (className ? " " + className : "")} style={style}>{children}</div>;
}

/* Concentric arc ring from the hero console, reusable at any size.
   `pct` 0–100 fills the amber arc; optional tick ring; `spin` for indeterminate. */
export function Gauge({
  pct = 0, size = 120, stroke = 9, ticks = false, spin = false, children, trackColor,
}: {
  pct?: number; size?: number; stroke?: number; ticks?: boolean; spin?: boolean;
  children?: ReactNode; trackColor?: string;
}) {
  const c = size / 2;
  const r = c - stroke / 2 - (ticks ? 7 : 1);
  const circ = 2 * Math.PI * r;
  const off = circ * (1 - Math.max(0, Math.min(100, pct)) / 100);
  const tickEls = ticks
    ? Array.from({ length: 60 }, (_, i) => {
        const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
        const big = i % 5 === 0;
        const r1 = c - 2, r2 = c - 6;
        const x1 = c + Math.cos(a) * (big ? r1 : r1 - 2), y1 = c + Math.sin(a) * (big ? r1 : r1 - 2);
        const x2 = c + Math.cos(a) * r2, y2 = c + Math.sin(a) * r2;
        return <line key={i} x1={x1.toFixed(1)} y1={y1.toFixed(1)} x2={x2.toFixed(1)} y2={y2.toFixed(1)} stroke="rgba(245,166,35,.22)" strokeWidth={1.2} opacity={big ? 0.4 : 0.18} />;
      })
    : null;
  return (
    <div style={{ position: "relative", width: size, height: size, display: "inline-grid", placeItems: "center" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={spin ? "lr-spin" : undefined}>
        {ticks && <g>{tickEls}</g>}
        <circle cx={c} cy={c} r={r} fill="none" stroke={trackColor || "rgba(245,166,35,.14)"} strokeWidth={stroke} />
        <circle
          cx={c} cy={c} r={r} fill="none" stroke="url(#lrGaugeGrad)" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={spin ? circ * 0.72 : off}
          transform={`rotate(-90 ${c} ${c})`}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(.16,1,.3,1)" }}
        />
      </svg>
      {children != null && (
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
          {children}
        </div>
      )}
    </div>
  );
}

/* Convenience wrapper: injects the theme <style> + defs, scopes `.lr-ui`,
   and runs the reveal observer. Pass revealDeps when content loads async. */
export function LrUi({
  children, className, style, revealDeps = [],
}: {
  children: ReactNode; className?: string; style?: CSSProperties; revealDeps?: unknown[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref, revealDeps);
  return (
    <div className={"lr-ui" + (className ? " " + className : "")} style={style} ref={ref}>
      <style dangerouslySetInnerHTML={{ __html: LR_UI_CSS }} />
      <LrDefs />
      {children}
    </div>
  );
}
