// blog-ui.tsx
// Shared chrome + editorial helpers for the /blog section. This deliberately
// reuses the EXACT design tokens and component shapes from the /learn pages
// (see src/routes/learn/*.tsx) so /blog reads as the same site — just a
// different content category. Lives outside src/routes/ so the TanStack
// file-based router doesn't treat it as a route.

import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/logo";
import { ArrowRight } from "lucide-react";

/* ── shared palette (identical to the /learn editorial pages) ── */
export const tokens = {
  teal: "#3fd6c4",
  tealDim: "#2ba596",
  warm: "#f2c14e",
  ink: "#eef3f2",
  inkSoft: "#9fb0b2",
  inkFaint: "#61716f",
  panel: "#131c21",
  bgSoft: "#0f161a",
  bg: "#0a0f12",
  line: "rgba(238, 243, 242, 0.09)",
} as const;

const { teal, warm, ink, inkSoft, inkFaint, panel, bgSoft, line } = tokens;

/** Format an ISO date ("2026-06-25") as "June 25, 2026", TZ-stable. */
export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/* ── Top bar — same as the /learn pages ── */
export function BlogHeader() {
  return (
    <header className="border-b" style={{ borderColor: line }}>
      <div className="max-w-[720px] mx-auto px-7 py-5 flex items-center justify-between">
        {/* Logo already renders its own anchor to "/" — don't wrap it in a Link
            (that produces nested <a> and a hydration error). */}
        <Logo />
        <Link
          to="/auth"
          search={{ mode: "signup" }}
          className="text-sm font-semibold no-underline rounded-lg px-4 py-2 transition-colors"
          style={{ color: teal, border: `1px solid rgba(63,214,196,0.35)` }}
        >
          Explain my results <ArrowRight size={14} className="inline ml-1" />
        </Link>
      </div>
    </header>
  );
}

/* ── Footer — same as the /learn pages ── */
export function BlogFooter() {
  return (
    <footer
      className="border-t mt-12 pt-7 pb-12 text-center"
      style={{ borderColor: line }}
    >
      <p className="text-sm m-0" style={{ color: inkFaint }}>
        &copy; {new Date().getFullYear()}{" "}
        <Link to="/" className="no-underline" style={{ color: teal }}>
          labread.health
        </Link>{" "}
        &middot; Understand your bloodwork in plain English
      </p>
    </footer>
  );
}

/* ── Sign-up CTA box — mirrors the /learn CTA, copy aimed at evaluators ── */
export function BlogCTA() {
  return (
    <div
      className="rounded-2xl p-8 my-12 text-center"
      style={{
        background:
          "linear-gradient(150deg, rgba(63,214,196,0.10), rgba(63,214,196,0.03))",
        border: "1px solid rgba(63,214,196,0.3)",
      }}
    >
      <h3 className="font-serif text-2xl mb-2" style={{ color: ink }}>
        See what labread does with your bloodwork
      </h3>
      <p className="mb-5" style={{ color: inkSoft, fontSize: "1.02rem" }}>
        Upload a blood test and get every value explained in plain English —
        what's normal, what's not, and what to ask your doctor. About 30 seconds.
      </p>
      <Link
        to="/auth"
        search={{ mode: "signup" }}
        className="inline-block font-bold text-base no-underline rounded-xl px-8 py-4 transition-colors"
        style={{ background: teal, color: "#04100e" }}
      >
        Explain my results — free <ArrowRight size={15} className="inline ml-1" />
      </Link>
      <p className="text-xs mt-3" style={{ color: inkFaint }}>
        No signup required &middot; your data is processed and not stored
      </p>
    </div>
  );
}

/* ── Editorial helpers (identical shapes to /learn) ── */

export function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2
      className="font-serif leading-[1.15] tracking-tight mt-12 mb-4"
      style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)" }}
    >
      {children}
    </h2>
  );
}

export function P({ children }: { children: ReactNode }) {
  return (
    <p className="leading-relaxed mb-4" style={{ color: inkSoft, fontSize: "1.06rem" }}>
      {children}
    </p>
  );
}

export function B({ children }: { children: ReactNode }) {
  return (
    <strong className="font-semibold" style={{ color: ink }}>
      {children}
    </strong>
  );
}

export function Lede({ children }: { children: ReactNode }) {
  return (
    <p className="text-lg leading-relaxed mb-4" style={{ color: ink }}>
      {children}
    </p>
  );
}

export function BulletList({ items }: { items: [string, string][] }) {
  return (
    <ul className="list-none mb-5 space-y-0">
      {items.map(([bold, rest]) => (
        <li
          key={bold}
          className="relative pl-7 py-2"
          style={{ color: inkSoft, fontSize: "1.06rem" }}
        >
          <span
            className="absolute left-1 top-[14px] w-[7px] h-[7px] rounded-full"
            style={{ background: teal }}
          />
          <strong className="font-semibold" style={{ color: ink }}>
            {bold}
          </strong>
          {rest}
        </li>
      ))}
    </ul>
  );
}

/** Warm callout box — same treatment as /learn's "Important:" panel. */
export function Callout({ label = "Note", children }: { label?: string; children: ReactNode }) {
  return (
    <div
      className="rounded-xl p-5 my-7"
      style={{
        background: "rgba(242,193,78,0.07)",
        border: "1px solid rgba(242,193,78,0.28)",
      }}
    >
      <p className="text-sm leading-relaxed m-0" style={{ color: ink }}>
        <strong style={{ color: warm }}>{label}:</strong>{" "}
        <span>{children}</span>
      </p>
    </div>
  );
}

/** Inline monospace token (for marker names, statuses, units in deep-dives). */
export function Code({ children }: { children: ReactNode }) {
  return (
    <code
      className="rounded px-1.5 py-0.5 text-[0.92em]"
      style={{ background: bgSoft, border: `1px solid ${line}`, color: ink, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
    >
      {children}
    </code>
  );
}

/** Fenced code block for engineering posts. */
export function CodeBlock({ children }: { children: ReactNode }) {
  return (
    <pre
      className="rounded-[14px] overflow-x-auto my-6 p-5 text-sm leading-relaxed"
      style={{
        background: panel,
        border: `1px solid ${line}`,
        color: ink,
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
      }}
    >
      <code>{children}</code>
    </pre>
  );
}
