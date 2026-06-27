// OFFLINE MODE — this file is intentionally replaced on the `offline-mode`
// branch only. It neutralizes the entire app: the root renders a single
// "coming soon" page and never renders <Outlet/>, so NO child route (upload,
// dashboard, blog, trust center, auth, reports, anything) is reachable. Not-
// found and error states render the same page. The real app lives on `main` —
// to relaunch, deploy `main` instead of this branch.

import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "labread.health — coming soon" },
      { name: "robots", content: "noindex" },
      {
        name: "description",
        content: "labread is being rebuilt. We'll be back soon.",
      },
    ],
  }),
  shellComponent: RootShell,
  // Every entry point resolves to the same page — matched routes, not-found,
  // and errors all render ComingSoon. There is no <Outlet/>, so children never
  // mount and their data-fetching never runs.
  component: ComingSoon,
  notFoundComponent: ComingSoon,
  errorComponent: ComingSoon,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body style={{ margin: 0 }}>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function ComingSoon() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        padding: "24px",
        textAlign: "center",
        background: "#0a0f12",
        color: "#eef3f2",
      }}
    >
      <div
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "clamp(2.2rem, 9vw, 3.4rem)",
          fontWeight: 500,
          letterSpacing: "-0.01em",
          color: "#3fd6c4",
        }}
      >
        labread
      </div>
      <p
        style={{
          margin: 0,
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: "clamp(1rem, 4vw, 1.15rem)",
          color: "#9fb0b2",
        }}
      >
        We're rebuilding labread. We'll be back soon.
      </p>
    </div>
  );
}
