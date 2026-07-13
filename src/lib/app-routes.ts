// Single source of truth for which paths are "the app" vs. the public site.
//
// App routes are the surfaces behind the coming-soon gate (results, coaching,
// protocol, …). Everything else — the marketing pages ("/", "/for-doctors",
// "/for-clinics"), the "/for-you"/"/for-labs" redirects, "/privacy", "/terms",
// the "/learn/*" pages, and static assets — is public.
//
// Used by:
//   • src/server.ts        — the coming-soon gate (server-side).
//   • DisclaimerModal       — so the "not a medical diagnosis" modal only ever
//                             appears inside the app, never on a public page.
//
// Keep this dependency-free so it's safe to import on both the server and client.
export const APP_ROUTE_PREFIXES = [
  "/dashboard",
  "/chat",
  "/protocol",
  "/onboarding",
  "/family",
  "/progress",
  "/checkin",
  "/challenges",
  "/rewards",
  "/stories",
  "/report",
  "/biomarker",
  "/profile",
  "/history",
  "/analyses",
  "/get-started",
  "/auth",
  "/clinician",
  "/try-free",
  "/lr-showcase",
] as const;

/** True when `pathname` is an app route (exact match or a sub-path). */
export function isAppRoute(pathname: string): boolean {
  return APP_ROUTE_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}
