// Minimal, dependency-free analytics shim.
//
// There is no analytics provider wired up yet. This helper forwards events to
// the common globals (GA4 `gtag`, GTM `dataLayer`, Plausible) IF they're ever
// added to the page — so funnel events start flowing the moment a provider is
// installed, with no code changes here. Until then it logs to the console.
//
// Guest → signup funnel events emitted:
//   guest_analysis_completed   – a guest finished a free analysis
//   guest_signup_viewed        – a guest reached signup after the free analysis
//   guest_signup_converted     – a guest who'd run a free analysis created an account

// Google Analytics 4 Measurement ID (looks like "G-XXXXXXXXXX").
// Set this to your property's ID to activate analytics. While empty, no GA
// script loads and events fall back to console logging only.
export const GA_MEASUREMENT_ID = "G-XMJWB1TTT6";

const GUEST_FLAG = "labread_guest_analysis"; // localStorage marker + timestamp

type Props = Record<string, unknown>;

export function track(event: string, props: Props = {}) {
  if (typeof window === "undefined") return;
  const w = window as any;
  try {
    if (typeof w.gtag === "function") w.gtag("event", event, props);
    if (Array.isArray(w.dataLayer)) w.dataLayer.push({ event, ...props });
    if (typeof w.plausible === "function") w.plausible(event, { props });
    // Always leave a breadcrumb so the funnel is observable even with no provider.
    console.info("[analytics]", event, props);
  } catch {
    /* never let analytics break the app */
  }
}

/** Mark that this browser has completed a free guest analysis. */
export function markGuestAnalysis() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GUEST_FLAG, String(Date.now()));
  } catch {
    /* ignore storage errors (private mode, etc.) */
  }
}

/** Did this browser run a free guest analysis before signing up? */
export function hasGuestAnalysis(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(GUEST_FLAG) != null;
  } catch {
    return false;
  }
}

/** Clear the guest marker (e.g. after counting the conversion). */
export function clearGuestAnalysis() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(GUEST_FLAG);
  } catch {
    /* ignore */
  }
}
