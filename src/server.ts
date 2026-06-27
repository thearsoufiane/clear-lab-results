// OFFLINE MODE — this worker entry is intentionally replaced on the
// `offline-mode` branch only. It short-circuits EVERY request to a single
// static "coming soon" page. The TanStack router, every route, all loaders,
// SSR, and per-route <head>/meta never run — so no part of the app (pages,
// titles, meta, or data) is served, no matter what path is requested.
//
// The real worker entry and full app live on `main`. To relaunch, deploy
// `main` instead of this branch.

const COMING_SOON_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta name="robots" content="noindex"/>
<title>labread.health — coming soon</title>
<style>
  html,body{margin:0;height:100%}
  body{box-sizing:border-box;min-height:100vh;display:flex;flex-direction:column;
    align-items:center;justify-content:center;gap:16px;padding:24px;text-align:center;
    background:#0a0f12;color:#eef3f2}
  .wordmark{font-family:Georgia,'Times New Roman',serif;font-weight:500;
    letter-spacing:-.01em;font-size:clamp(2.2rem,9vw,3.4rem);color:#3fd6c4}
  p{margin:0;font-family:system-ui,-apple-system,sans-serif;
    font-size:clamp(1rem,4vw,1.15rem);color:#9fb0b2}
</style>
</head>
<body>
  <div class="wordmark">labread</div>
  <p>We're rebuilding labread. We'll be back soon.</p>
</body>
</html>`;

export default {
  fetch(_request: Request): Response {
    return new Response(COMING_SOON_HTML, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store, max-age=0",
        "x-robots-tag": "noindex",
      },
    });
  },
};
