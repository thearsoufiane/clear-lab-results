import { Link } from "@tanstack/react-router";

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <span
        className="relative grid place-items-center rounded-full"
        style={{ width: size, height: size, background: "radial-gradient(circle at 30% 30%, #ffc06a, #f5851f)" }}
      >
        <span
          className="absolute inset-0 rounded-full blur-md opacity-60 group-hover:opacity-90 transition"
          style={{ background: "#f5851f" }}
        />
        <span className="relative font-serif text-[#0a0c0f] text-sm leading-none">l</span>
      </span>
      <span className="font-serif text-lg tracking-tight">
        labread<span className="text-muted-foreground">.health</span>
      </span>
    </Link>
  );
}
