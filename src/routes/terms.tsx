import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LEGAL_HEAD_LINKS } from "@/components/legal-page";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service | labread.health" },
      { name: "description", content: "labread.health Terms of Service." },
    ],
    links: [{ rel: "canonical", href: "https://labread.health/terms" }, ...LEGAL_HEAD_LINKS],
  }),
  component: () => <LegalPage kind="terms" />,
});
