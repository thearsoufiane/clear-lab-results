# labread — shared primitives spec (draft)

The Dashboard audit and the in-flight five-surface audit confirm the same thing: the signature elements (living glow, glass, gauge-as-light, aurora, the orb, the floating tab bar) are missing **everywhere**. So we build them **once** as primitives, to the vision tokens, before any screen work. Every screen is then assembled from these — no screen re-implements glow/glass/gauges inline (which is how the current app drifted).

This spec is grounded in the actual SVG/CSS in `design-reference/app/*` — line references included. Stack: React 19 + TS, Tailwind v4, Framer Motion. Honor `prefers-reduced-motion` in every animated primitive (use Framer's `useReducedMotion`).

---

## 0. Token layer (prerequisite)

Before any primitive, the canonical vision tokens must exist as the theme. Add to `src/styles.css` (Tailwind v4 `@theme`) — these REPLACE the current gold-yellow `--amber` + green/warn/red set:

```css
@theme {
  --color-void: #0B0907;        --color-void-2: #120D0A;   --color-ash: #1A1411;
  --color-ember-core: #FF7A18;  --color-ember-hot: #FF9D45; --color-ember-glow: #FFB066;
  --color-ember-deep: #B23A0C;  --color-coal: #5E2208;
  --color-bone: #F6ECE1;
  --color-smoke: rgba(246,236,225,.56);  --color-whisper: rgba(246,236,225,.34);
  --color-glass: rgba(255,255,255,.055); --color-glass-2: rgba(255,255,255,.09);
  --color-line: rgba(255,255,255,.10);   --color-line-warm: rgba(255,138,40,.22);
  --font-serif: "Fraunces", Georgia, serif;
  --font-sans: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
}
```
**One accent family only.** There is no green/red. Biomarker status is expressed by *position + temperature on the ember arc* (cooler = out of range), never a second hue.

---

## 1. `<LivingGlow />` — the breathing ember floor

The single element every screen shares. A fixed, full-bleed layer of layered warm radial gradients behind all content, breathing on a ~9s loop.
Reference: `labread-design-vision.html` `.hero::before` (L50–60) and the in-phone `.glass-screen` background (L101–110).

**API**
```ts
interface LivingGlowProps {
  intensity?: "ambient" | "hero";  // hero = stronger stops (onboarding/Anna meet); ambient = default app bg
  className?: string;
}
```
**Structure:** a `position:fixed; inset:0; z-index:0` div; content sits in a `position:relative; z-index:1` column above it. Background = three stacked `radial-gradient`s (top-center ember-core ~.34, lower-left ember-deep ~.30, lower-right ember-glow ~.18) over a `linear-gradient(180deg,#140e0a,#0b0807 70%)` base, `filter: blur(8px)`.
**Motion:** `@keyframes breathe { 0%,100%{opacity:.78;transform:scale(1)} 50%{opacity:1;transform:scale(1.05)} }`, 9s ease-in-out infinite. **Reduced-motion:** freeze at the mid/rest state, no animation.
**Notes:** this is what makes desktop work — per the locked layout decision, desktop = phone-width column centered on this glow. LivingGlow is the page background at all breakpoints.

---

## 2. `<GlassCard />` — floating glass

Reference: `.gcard` (L118–121). Used for every card/panel.

**API**
```ts
interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  emphasis?: boolean;   // true → border uses --line-warm (Anna's read, active states)
  as?: React.ElementType;
  children: React.ReactNode;
}
```
**Spec:** `background: var(--color-glass)` (white @ 5.5%, **never** dark/opaque), `border: 1px solid var(--color-line)` (or `--line-warm` when `emphasis`), `border-radius: 20px` (min; pills are full), `backdrop-filter: blur(14px)` + `-webkit-` prefix, padding 13–20px. Nothing square.
**Acceptance:** if it reads as a dark box instead of frosted glass over the glow, it's wrong — verify `backdrop-filter` is actually applying.

---

## 3. `<Gauge />` — biomarker as light (never a bar)

Reference: Biomarker detail gauge (L321–335) and the inline conversational mini-gauge (`labread-anna-vision.html` L223–230).

**API**
```ts
interface GaugeProps {
  value: number;
  unit?: string;
  rangeLow: number;          // optimal range bounds
  rangeHigh: number;
  scaleMin?: number;         // arc domain (defaults sensible to range)
  scaleMax?: number;
  status: "low" | "optimal" | "high";
  size?: "detail" | "inline"; // detail ≈160×100, inline ≈200×70
  label?: string;             // e.g. "OPTIMAL"
}
```
**Structure:** a semicircular SVG arc path (`M16,90 A64,64 0 0 1 144,90`), 9px stroke. Track = `rgba(255,255,255,.09)`. Value arc = `linearGradient` `#B23A0C → #FF7A18 → #FFB066` (cool→hot), driven by `stroke-dasharray`/`stroke-dashoffset` mapped from value→arc position. A **bright bloom dot** (`<circle>` with `feGaussianBlur` glow filter) marks the exact position. Center: value in Fraunces (~34), unit + status in mono below. Out-of-range positions sit toward the cooler end of the *same* arc — no red, no separate "danger" color.
**Motion:** arc sweeps in (animate dashoffset) + value counts up on mount. **Reduced-motion:** render final state instantly.
**This replaces the horizontal `.bar` in the current dashboard** — the #1 gauge violation.

---

## 4. `<VitalityRing />` — the 0–100 score

Reference: Home vitality ring (L242–256). Full circle (distinct from the half-arc Gauge).

**API**
```ts
interface VitalityRingProps {
  score: number;       // 0–100
  size?: number;       // px, default 118; scales for hero
  label?: string;      // default "VITALITY"
  caption?: string;    // optional sub line
}
```
**Structure:** SVG, `<circle r=48 stroke-width=7>` track at `rgba(255,255,255,.08)`; value circle `linearGradient #FFB066 → #B23A0C`, `stroke-linecap:round`, `stroke-dasharray≈301`, dashoffset from score, `transform: rotate(-90)`, **`feGaussianBlur` glow filter** (stdDeviation ~3.2). Center: score in Fraunces ~30, `VITALITY` in mono ~7.5 letter-spaced.
**Motion:** ring sweeps + number counts up on mount. Reduced-motion: final state.
**Note:** the current dashboard's ring shows *protocol-progress %* with no glow — Vitality is a different, glowing score; keep both ring uses distinct.

---

## 5. `<AuroraChart />` — multi-marker trends as ridges

Reference: Home "marker trends" card (L269–283). NOT a line chart.

**API**
```ts
interface AuroraSeries { name: string; color: string; points: number[]; }
interface AuroraChartProps {
  series: AuroraSeries[];     // 1–3 markers (e.g. Ferritin/Vit D/CRP)
  height?: number;
  showLegend?: boolean;
}
```
**Structure:** `viewBox` with `preserveAspectRatio="none"`. Each series = a filled area path with a vertical `linearGradient` (top ~.4–.55 opacity → transparent) + `feGaussianBlur` (~1.4) for the soft ridge, layered translucently; plus a faint glow **stroke** along the top edge (`#FFB066`, opacity ~.8). Legend = colored dots + mono labels, all within the ember family.
**Motion:** ridges fade/rise in on scroll. Reduced-motion: static.
**Replaces** the single thin green sparkline in the current dashboard.

---

## 6. `<AnnaOrb />` — presence made of light

Reference: `labread-anna-vision.html` orb (L120–131); scales hero→avatar.

**API**
```ts
interface AnnaOrbProps {
  size?: number;        // 150 hero · 118 · 92 · 26/22 avatar
  state?: "idle" | "thinking" | "listening";
  halo?: boolean;       // default true; false for tiny avatars
}
```
**Structure:** SVG. `radialGradient` core `cx42% cy38% r62%`: `#FFE8C8 → #FF9D45 @38% → #C2410C @74% → #5E2208`. Halo = `<circle r=86 fill=#FF7A18 opacity=.28>` with `feGaussianBlur(10)`. Body = `<circle r=60 fill=core>` + faint inner stroke `rgba(255,232,200,.5)`. A soft highlight ellipse (`#FFF4E2`, blurred) top-left gives the "face is light" read — **never a face/eyes**.
**Motion:** `@keyframes pulse { 0%,100%{scale:1;opacity:.92} 50%{scale:1.06;opacity:1} }`, 5s. `thinking` → also drive the 3-dot indicator. Reduced-motion: no pulse.

---

## Next-tier primitives (build right after the six above)
Smaller, mostly CSS — needed before screen assembly but lower risk:
- **`<Pill>`** (+ active ember state) — `.pill` / `.pill.on` (design-vision L122–127). Full radius, glass, active = ember gradient + `--line-warm`. Mood chips, tags, suggested prompts, CTAs.
- **`<EmberButton>`** — primary CTA: ember gradient fill, dark text, glow shadow (`btn-amber` pattern but on vision tokens).
- **`<Eyebrow>`** — mono, uppercase, wide letter-spacing, bracketed `[ LIKE THIS ]` variant.
- **`<TabBar>`** — **floating** glass bar inset from the bottom edge, rounded, blurred; active tab glows `--ember-glow` (design-vision L133–141). At ALL breakpoints (replaces the desktop sidebar per locked decision).
- **`<DayGrid>`** — challenge/streak grid of ember "done" cells + outlined "today" (challenges-vision L78–82).
- **`<AnnaMessage>` / `<UserMessage>`** — Anna = serif, no bubble, italic ember accent word; user = quiet right-aligned glass (anna-vision L67–72).
- **`<FieldRow>`** — onboarding form row (glass, mono label, value/segmented control).

---

## Build/verify notes
- Primitives land in `src/components/ui/` (or a new `src/components/lr/`) with the token layer first.
- Verify each rendered-to-rendered against its reference once the **dev-only live render** (foundation item 0) is up — production stays on the coming-soon gate throughout.
- Definition of done per primitive: matches the reference's *felt* quality (glow blooms, glass frosts, arcs glow), tokens exact, reduced-motion path correct, no second hue.
