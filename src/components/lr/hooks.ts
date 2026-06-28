import { useEffect, useState } from "react";

/** Tracks prefers-reduced-motion (SSR-safe: false until mounted). */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return reduced;
}

/** Animates a number from `from` to `to` on mount (cubic ease-out). Instant
 *  when reduced motion is requested. Returns the current value, rounded to
 *  `decimals`. */
export function useCountUp(
  to: number,
  opts?: { from?: number; durationMs?: number; decimals?: number },
): number {
  const { from = 0, durationMs = 900, decimals = 0 } = opts ?? {};
  const reduced = useReducedMotion();
  const [val, setVal] = useState(from);

  useEffect(() => {
    if (reduced) {
      setVal(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(from + (to - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, from, durationMs, reduced]);

  const f = Math.pow(10, decimals);
  return Math.round(val * f) / f;
}

/** clamp helper shared by the gauge primitives. */
export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}
