// Generates public/og-image.png (1200x630) for social link previews.
// Run with: node scripts/generate-og-image.mjs
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="78%" cy="12%" r="58%">
      <stop offset="0%" stop-color="#f5851f" stop-opacity="0.22"/>
      <stop offset="55%" stop-color="#f5851f" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#f5851f" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="dot" cx="35%" cy="30%" r="75%">
      <stop offset="0%" stop-color="#ffd9a8"/>
      <stop offset="55%" stop-color="#f5a04a"/>
      <stop offset="100%" stop-color="#e2602c"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="#0a0a0a"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <!-- wordmark, top-left -->
  <circle cx="94" cy="90" r="15" fill="url(#dot)"/>
  <text x="122" y="101" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" fill="#f5a04a">labread<tspan fill="#8a8378" font-weight="400">.health</tspan></text>

  <!-- heading -->
  <text x="78" y="320" font-family="Georgia, 'Times New Roman', serif" font-size="78" fill="#ffffff">Your blood test,</text>
  <text x="78" y="408" font-family="Georgia, 'Times New Roman', serif" font-size="78" font-style="italic" fill="#ffffff">finally explained.</text>

  <!-- subtext -->
  <text x="80" y="502" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="#9a9384">90-day plans · Daily check-ins · AI coaching</text>
</svg>`;

const out = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "og-image.png");

await sharp(Buffer.from(svg)).png().toFile(out);
const meta = await sharp(out).metadata();
console.log(`wrote ${out} — ${meta.width}x${meta.height} ${meta.format}`);
