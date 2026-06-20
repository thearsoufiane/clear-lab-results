import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LEGAL_HEAD_LINKS } from "@/components/legal-page";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | labread.health" },
      { name: "description", content: "labread.health Privacy Policy." },
    ],
    links: [{ rel: "canonical", href: "https://labread.health/privacy" }, ...LEGAL_HEAD_LINKS],
  }),
  component: () => <LegalPage kind="privacy" />,
});
