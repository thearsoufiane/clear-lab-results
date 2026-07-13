import { createFileRoute, redirect } from "@tanstack/react-router";

// "For labs" was renamed to "For clinics". Keep the old path alive so existing
// links don't 404; send it to /for-clinics.
export const Route = createFileRoute("/for-labs")({
  beforeLoad: () => {
    throw redirect({ to: "/for-clinics" });
  },
});
