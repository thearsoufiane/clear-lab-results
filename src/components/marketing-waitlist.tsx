import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";

// Shared waitlist capture for the three public marketing pages. Renders the
// reference `.wait` form (input + ember button); the surrounding page owns the
// scoped `.wait` / `.wait-note` styles, so this component drops into any of them.
//
// audience is baked in per page: "/" → individual, /for-doctors → doctor,
// /for-clinics → clinic. On success (and on a duplicate 23505) the form is
// swapped in place for a glass/ember confirmation — no reload, no alert.

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export type WaitlistAudience = "individual" | "doctor" | "clinic";
type Status = "idle" | "submitting" | "success" | "error";

// ?ref= wins; else the referrer hostname; else "direct".
function detectSource(): string {
  try {
    const ref = new URLSearchParams(window.location.search).get("ref");
    if (ref) return ref.slice(0, 120);
    if (document.referrer) {
      const host = new URL(document.referrer).hostname;
      if (host) return host;
    }
  } catch {
    /* fall through */
  }
  return "direct";
}

export function WaitlistForm({
  audience,
  buttonLabel,
  placeholder = "your@email.com",
  note,
  id,
}: {
  audience: WaitlistAudience;
  buttonLabel: string;
  placeholder?: string;
  note?: string;
  id?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    const value = email.trim().toLowerCase();
    if (!EMAIL_RE.test(value)) {
      setStatus("error");
      return;
    }
    setStatus("submitting");
    try {
      const { error } = await supabase.from("waitlist").insert({
        email: value,
        audience,
        source: detectSource(),
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
      });
      // 23505 = already on this list (unique email+audience) → treat as success.
      if (error && (error as { code?: string }).code !== "23505") throw error;
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="wait wait-done" role="status">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.5" opacity=".5" />
          <path d="M7 12.5l3.2 3.2L17 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>You're in. We'll email you when labread opens.</span>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <>
      <form className="wait" id={id} onSubmit={onSubmit} noValidate>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          aria-label="Email"
          autoComplete="email"
        />
        <button type="submit" disabled={submitting}>
          {submitting ? "Joining…" : buttonLabel}
        </button>
      </form>
      {status === "error" ? (
        <p className="wait-err">Something went wrong. Try again.</p>
      ) : note ? (
        <p className="wait-note">{note}</p>
      ) : null}
    </>
  );
}
