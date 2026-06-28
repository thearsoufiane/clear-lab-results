# labread — standing brief

Read this before any task. labread turns a blood test into a 90-day health journey. The product's whole edge is the design: a near-black screen lit from within by warm embers, with blood data drawn as **living light** (glowing gauges and aurora ridges), guided by **Anna**, an AI coach who is a presence made of light, not a chatbot. It must feel magical and premium — never like a hospital portal.

> **Status: brownfield + gated.** The app already exists (TanStack Start, see routes below). The whole live site currently sits behind a static **coming-soon page** (commit `af3e45c`). **Nothing un-gates** until the vision rebuild *and* CNDP registration are both done. Do not remove or bypass the coming-soon gate as part of any design task.

---

## ⚑ Prime directive — match the reference, don't reinterpret

The look is already designed and approved. It lives as rendered HTML in **`design-reference/app/`**. These files are the **source of truth**, not inspiration:

| File (`design-reference/app/`) | Defines |
|---|---|
| `labread-design-vision.html` | Core app: Home, Biomarker detail, Protocol, Stories — and the full design language panel |
| `labread-onboarding-family-vision.html` | Upload → Anna reads it → About you, and the Family circle |
| `labread-challenges-vision.html` | Challenges hub, active challenge, completion, rewards wallet, the economy rules |
| `labread-anna-vision.html` | Anna: the orb, the conversation surface, data-in-dialogue, daily check-in, and her guardrails |

`design-reference/marketing/` holds a **separate** surface — the public landing pages (`labread-for-you/-labs/-doctors.html`), which back the live `/for-you`, `/for-labs`, `/for-doctors` routes. Don't confuse the two: marketing pages are the front door; the four app-vision files are the in-app design truth.

**Before auditing or building any screen:** open its reference file **in a browser** (render it — the glow and glass only read when rendered, not in the markup), read the markup for exact tokens, and compare side-by-side with the running route. When you finish a screen, screenshot it and compare to the reference. If it looks flat, grey, or "cleaner" than the reference — it's wrong. The reference is intentionally rich; do not simplify it toward a default.

Do not invent a new visual style for any screen. If a screen isn't in the reference, build it from the design system below and ask before improvising.

---

## Non-negotiable rules

1. **Never invent medical analysis logic.** The real validated pipeline lives in the Supabase `analyze-report` function (deterministic flagging decides what's in/out of range; the LLM only explains). Do not write code that decides what a result "means" medically.
2. **No compliance badges, ever.** No SOC 2 / HIPAA / ISO marks, no "data never stored," "medical-grade," or "bank-level" claims anywhere in the UI.
3. **Always show the disclaimer** where results appear: *"labread is informational and not a medical diagnosis."*
4. **Family = consent + separation.** Adding a member requires a per-person consent step (store `consent_at`). Each profile is its own private record; switching profiles swaps the whole app context. Never merge two people's data.
5. **Anna stays in her lane** (see her file): she narrates data, never diagnoses, doses, alarms, invents a number, or replaces a clinician.
6. **Seed realistic mock data** so every screen looks alive (a user at Day 47, vitality 74, an active 21-day challenge).
7. **Keep the coming-soon gate.** No design work un-gates the live site. Gate stays until vision rebuild + CNDP registration are both complete.

---

## Stack

- **TanStack Start + React + TypeScript**, mobile-first (phone-width content column, centered on desktop), shipped as an installable **PWA**.
- **Supabase** — Postgres, Auth (email/password to start), Storage, and the `analyze-report` edge function.
- **Tailwind v4** for styling, with the tokens below as theme variables.
- **Framer Motion** for the motion described below.
- **Cloudflare** for deploy.
- Anna's text is **templated per marker status for now**; a constrained OpenAI call plugs in later (same constrained-explanation pattern already in the pipeline). No freeform LLM medical output.

---

## Design system (the tokens every screen derives from)

One accent family only — amber → coal. Never introduce a second hue.

```css
--void:#0B0907; --void-2:#120D0A; --ash:#1A1411;
--ember-core:#FF7A18; --ember-hot:#FF9D45; --ember-glow:#FFB066;
--ember-deep:#B23A0C; --coal:#5E2208;
--bone:#F6ECE1;
--smoke:rgba(246,236,225,.56); --whisper:rgba(246,236,225,.34);
--glass:rgba(255,255,255,.055); --glass-2:rgba(255,255,255,.09);
--line:rgba(255,255,255,.10); --line-warm:rgba(255,138,40,.22);
```

**Type — three voices, each one job:**
- **Fraunces** (serif) — emotional headlines, big numbers, one *italic accent word* in `--ember-hot`. Used with restraint. Anna speaks in this.
- **Inter** — all UI, buttons, body, labels.
- **JetBrains Mono** — bracketed eyebrows `[ LIKE THIS ]`, units, data, wide letter-spacing, uppercase.

**The signature (this is what gets missed — get it right):**
- **Living glow:** `--void` background with layered warm radial gradients behind content (top-center, lower-left, lower-right), breathing on a ~9s loop. Honor `prefers-reduced-motion`.
- **Glass:** cards/pills use `backdrop-blur` + a 1px `--line`/`--line-warm` border + generous radii (cards 20px+, pills full). Glass is white-at-low-opacity, never flat grey. Nothing is square.
- **Gauges as light:** every biomarker is a glowing SVG arc with a bright bloom at its position — never a bar. Out-of-range is a cooler spot on the same arc, never alarming red.
- **Aurora ridges:** multi-marker trends as translucent layered gradient curves with a faint glow stroke.
- **Vitality ring:** circular 0–100 score, ember-gradient stroke, soft glow.
- **Anna's orb:** a glowing ember sphere (layered radial gradient + blur halo), gently pulsing. Her "face" is light, not a person. Scales from a 150px hero down to a 22px avatar.
- **Tab bar:** floating glass bar near the bottom edge, rounded, blurred; active tab glows `--ember-glow`.

**Motion:** glow breathes; numbers count up on mount; gauge arcs sweep in; panels rise + fade on scroll; reduced-motion always respected.

**Shared components the vision implies:** `GlassCard`, `Pill` (+ active ember state), `EmberButton`, `Eyebrow`, `Gauge`, `VitalityRing`, `AuroraChart`, `DayGrid`, `TabBar`, `FieldRow`, `AnnaOrb`, `AnnaMessage` (serif, no bubble), `UserMessage` (quiet glass). Check what already exists in `src/components/` before creating any of these.

---

## Data model (Supabase)

- `profiles` — id, owner_id (null = account owner; set = family member), name, age, biological_sex, goals text[], relationship, consent_at, created_at
- `reports` — id, profile_id, uploaded_at, file_url, status, expires_at
- `biomarkers` — id, report_id, name, value, unit, range_low, range_high, status (low/optimal/high)
- `protocols` — id, profile_id, current_day, total_days, started_at
- `daily_actions` — id, protocol_id, date, title, done
- `challenges` — id, name, length_days, points_reward, offer_pct, theme
- `enrollments` — id, profile_id, challenge_id, current_day, streak, status
- `points_ledger` — id, profile_id, points, reason, created_at
- `offers` — id, profile_id, pct, source, unlocked_at, redeemed_at
- `stories` — id, profile_id, title, body, image_url, likes, featured

---

## Work order — brownfield: audit each existing surface against its reference, then close the gap

This is **not** a greenfield build. Each surface below already has a route. The job per surface is: (1) open the reference file rendered in a browser, (2) run the route side-by-side, (3) write a gap list (what matches / what's missing / what drifts from tokens + signature), (4) align with Art on the gap list, (5) close the gap in small reviewable commits. **Stop for review after each surface.**

| Surface | Reference | Real route(s) / component | Status |
|---|---|---|---|
| Home / Dashboard | `app/labread-design-vision.html` (Home) | `src/routes/dashboard.tsx`, `src/routes/index.tsx` | exists |
| Biomarker detail | `app/labread-design-vision.html` (Biomarker) | `src/routes/report.$id.tsx`, `src/components/analysis-view.tsx` | exists |
| Protocol | `app/labread-design-vision.html` (Protocol) | `src/routes/protocol.tsx`, `src/lib/generate-protocol.ts` | exists |
| Stories | `app/labread-design-vision.html` (Stories) | — | **no route yet** |
| Onboarding (upload → Anna reads → about you) | `app/labread-onboarding-family-vision.html` | `src/routes/get-started.tsx`, `src/components/upload-modal.tsx` | exists |
| Family circle | `app/labread-onboarding-family-vision.html` | `src/routes/family.tsx`, `src/components/member-switcher.tsx` | exists |
| Anna (conversation, data-in-dialogue) | `app/labread-anna-vision.html` | `src/routes/chat.tsx` | exists |
| Daily check-in | `app/labread-anna-vision.html` | `src/routes/checkin.tsx` | exists |
| Progress | `app/labread-design-vision.html` (trends) | `src/routes/progress.tsx` | exists |
| Challenges + rewards | `app/labread-challenges-vision.html` | — | **no route yet** |

Suggested order: **Home → Biomarker detail → Protocol → Anna → Onboarding → Family → Progress**, then build the two missing surfaces (**Stories**, **Challenges**) from their references. Adjust with Art.

---

## How Art likes to work

Small, reviewable commits. Match the reference before moving on — if a screen drifts, expect a pasted reference screenshot and a request to match it exactly. Ask before inventing anything not in the reference or this file. Keep the design rich; never simplify toward a generic default. Audit against the **rendered** reference, not the raw markup.
