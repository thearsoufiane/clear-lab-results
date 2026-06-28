# labread — vision rebuild plan (LOCKED)

The existing app is functionally built but visually off-vision. This is the locked plan to bring every surface to the approved design (`design-reference/app/*`) without un-gating production. Companion docs: [primitives-spec.md](primitives-spec.md) (the shared components), and the design brief in [/CLAUDE.md](../CLAUDE.md).

---

## Root cause: three theme systems, none of them the vision

The single most important finding. The "wrong colors" are not per-screen drift — they trace to **three competing token sources**, so the fix is one unification at the source, not a screen-by-screen recolor:

| Source | Used by | What's wrong |
|---|---|---|
| `src/components/lr-ui.tsx` (`LR_UI_CSS :root`) | protocol, chat, family, progress, member-switcher | `--amber:#F5A623` gold (not `--ember-core:#FF7A18`); glass is opaque brown `--surface:#15110A` (not white-low-opacity); defines `--green`/`--red` second hues |
| `src/styles.css` (`@theme` / `:root`) | checkin | `--background: oklch(0.16 0.01 240)` **blue-grey** (not `--void:#0B0907`); `--success`/`--danger` green/red; `--accent:#f5a04a` off-ember |
| inline CSS in `src/routes/dashboard.tsx` | dashboard | its own `--amber` gold + `--green`/`--warn`/`--red` |

**Implication:** Phase 0 collapses all three to the canonical ember tokens (one accent family, amber→coal; status = cooler-vs-warmer on the ember arc, never green/red). Everything downstream inherits it. This is why the render checkpoint (below) exists — we confirm the ember palette in-app once before it propagates.

---

## Combined gap map (all six surfaces)

Audited read-only, each against its reference screen. `L→M` = effort drops to M once the shared primitives exist (most of each screen's "L" *is* the missing primitives).

| Surface | Verdict | Effort | Sharpest gaps |
|---|---|---|---|
| Dashboard | re-skin + re-layout | L→M | no glow/glass; gauge is a **bar**; no vitality ring; sparkline not aurora; no floating tabbar; green/red; gold amber; 3-col shell vs phone column |
| Checkin | full re-skin + re-layout | L→M | entirely on the **blue-grey Tailwind theme**; no orb/serif headline/mood-pills/focus-card; success/danger; flat progress bar |
| Chat / Anna | re-skin + re-layout | L→M | Anna in **bubbles not serif**; orb spins + **green dot**; no inline gauge-in-dialogue; red errors; user reply too loud |
| Protocol | re-skin + re-layout | L→M | no streak / no checkable ember checklist / no points; static phase grid; green "DONE"; economy rule (keep points, reset streak) absent |
| Progress | re-skin | M | Recharts area **not aurora ridges**; no vitality ring; green optimal band; gauges lack bloom |
| Family | re-skin | M | no avatar switcher row; **no consent card + no `consent_at` capture**; no you+2 cap; green/red pills |

### Missing everywhere (build once as primitives)
LivingGlow · floating glass TabBar · AnnaOrb · white-low-opacity Glass · Gauge bloom (`feGaussianBlur`) · VitalityRing · AuroraChart. Plus: disclaimer absent on every results surface; `consent_at` capture missing (rule violation).

---

## Locked build order

**Standalone (before Phase 0):** `consent_at` capture in the family add flow + schema. *Data, not paint; fully independent; the one non-negotiable rule actively violated. Closed as its own commit so a compliance gap never rides along on a visual phase — and so "we capture per-person consent before processing a family member's health data" is true in code today for the CNDP rebuild.*

**Phase 0 — Foundation (no screens)**
- 0a. **Token unification** at source (lr-ui.tsx, styles.css, dashboard inline) → canonical ember; delete green/red; status = ember temperature.
- 0b. **Dev-only gated live render** (env-flagged root restore so prod stays coming-soon) + seed script, so screens are verified rendered-to-rendered.

**🔴 CHECKPOINT (after 0a, before Phase 1):** render ONE already-built screen on the new tokens and get Art's sign-off on the ember palette *before* any primitive inherits it. Adjusting `--ember-core` hue at the source is cheap; rediscovering it after five screens is not.

**Phase 1 — Primitives** (per [primitives-spec.md](primitives-spec.md)): LivingGlow, GlassCard, Gauge(+bloom), VitalityRing, AuroraChart, AnnaOrb → then TabBar, Pill, EmberButton, Eyebrow, DayGrid, AnnaMessage/UserMessage, FieldRow.

**Phase 2 — Screens** (each becomes assembly once primitives exist), in order:
1. **Dashboard** — hero; proves the entire primitive set end-to-end.
2. **Anna cluster: Chat + Checkin** — share the most primitives; Checkin is the biggest delta (off-theme), so subtle primitive bugs surface on the hardest case early.
3. **Protocol** — core loop; mostly assembly once DayGrid + ember checklist exist.
4. **Progress** — consumes VitalityRing + AuroraChart.
5. **Family** — switcher + consent card (visual; the data capture is already closed standalone).

Throughout: coming-soon gate stays on production until vision rebuild **and** CNDP registration are both done.
