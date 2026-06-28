/**
 * Grid of day cells — filled ember for done, outlined glow for today, faint for
 * future. Reference: challenges-vision .daygrid / .daycell.
 */
export function DayGrid({
  total,
  current,
  columns = 7,
  windowSize,
}: {
  total: number;
  current: number; // 1-based day-of
  columns?: number;
  windowSize?: number; // optionally render only a window of N days around current
}) {
  let start = 1;
  let end = total;
  if (windowSize && total > windowSize) {
    start = Math.max(1, current - Math.floor(windowSize / 2));
    end = Math.min(total, start + windowSize - 1);
    start = Math.max(1, end - windowSize + 1);
  }
  const days: number[] = [];
  for (let d = start; d <= end; d++) days.push(d);

  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 6 }}>
      {days.map((d) => {
        const done = d < current;
        const today = d === current;
        return (
          <div
            key={d}
            style={{
              aspectRatio: "1",
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              fontSize: 9,
              fontWeight: today ? 700 : done ? 700 : 400,
              color: done ? "#1a0e06" : today ? "var(--ember-glow)" : "var(--whisper)",
              background: done ? "linear-gradient(135deg,var(--ember-core),var(--ember-deep))" : "transparent",
              border: done ? "1.4px solid transparent" : `1.4px solid ${today ? "var(--ember-glow)" : "rgba(255,255,255,.10)"}`,
              boxShadow: today ? "0 0 8px rgba(255,150,60,.5)" : undefined,
            }}
          >
            {done ? "✓" : d}
          </div>
        );
      })}
    </div>
  );
}
