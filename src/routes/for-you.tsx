import { createFileRoute, redirect } from "@tanstack/react-router";

// The old /for-you landing page is superseded — "For you" is now the homepage.
// Keep the path alive so existing links don't 404; send it to /.
export const Route = createFileRoute("/for-you")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
