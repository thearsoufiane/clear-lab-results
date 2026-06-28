// GATED WORKER ENTRY — production stays behind the "coming soon" page; the real
// app runs in local dev. This is the true gate (it short-circuits before the
// TanStack router), so the live site stays gated through the vision rebuild +
// CNDP registration while we can render real screens locally.
//
//   • Production build (vite build):  OFFLINE -> static coming-soon for all paths.
//   • Local dev (vite dev):           full app (SSR + router).
//   • Override either way with VITE_OFFLINE=true|false.
//
// Do not un-gate production until the rebuild AND CNDP are both done.
import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

// Explicit VITE_OFFLINE wins when present; otherwise gate by build mode
// (production build = gated, dev = app). import.meta.env.DEV is reliably
// replaced by vite in this worker entry, unlike a custom VITE_* var.
const OFFLINE =
  import.meta.env.VITE_OFFLINE != null
    ? import.meta.env.VITE_OFFLINE === "true"
    : !import.meta.env.DEV;

const COMING_SOON_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta name="robots" content="noindex"/>
<title>labread.health — coming soon</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500&display=swap" rel="stylesheet"/>
<style>
  html,body{margin:0;height:100%}
  body{box-sizing:border-box;min-height:100vh;display:flex;flex-direction:column;
    align-items:center;justify-content:center;gap:16px;padding:24px;text-align:center;
    background:#0B0907;color:#F6ECE1}
  .wordmark{font-family:'Fraunces',Georgia,serif;font-weight:500;
    letter-spacing:-.01em;font-size:clamp(2.2rem,9vw,3.4rem);color:#FF7A18}
  p{margin:0;font-family:system-ui,-apple-system,sans-serif;
    font-size:clamp(1rem,4vw,1.15rem);color:rgba(246,236,225,.56)}
</style>
</head>
<body>
  <div class="wordmark">labread</div>
  <p>We're rebuilding labread. We'll be back soon.</p>
</body>
</html>`;

function comingSoonResponse(): Response {
  return new Response(COMING_SOON_HTML, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store, max-age=0",
      "x-robots-tag": "noindex",
    },
  });
}

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => ((m as { default?: ServerEntry }).default ?? (m as unknown as ServerEntry)),
    );
  }
  return serverEntryPromise;
}

function brandedErrorResponse(): Response {
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isCatastrophicSsrErrorBody(body: string, responseStatus: number): boolean {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return false;
  }

  if (!payload || Array.isArray(payload) || typeof payload !== "object") {
    return false;
  }

  const fields = payload as Record<string, unknown>;
  const expectedKeys = new Set(["message", "status", "unhandled"]);
  if (!Object.keys(fields).every((key) => expectedKeys.has(key))) {
    return false;
  }

  return (
    fields.unhandled === true &&
    fields.message === "HTTPError" &&
    (fields.status === undefined || fields.status === responseStatus)
  );
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isCatastrophicSsrErrorBody(body, response.status)) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return brandedErrorResponse();
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    if (OFFLINE) return comingSoonResponse();
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return brandedErrorResponse();
    }
  },
};
