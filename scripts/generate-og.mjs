/**
 * Generate the social share (Open Graph) image as a PNG.
 *
 * SVG OG images are not rendered by most platforms (WhatsApp, iMessage, Slack,
 * LinkedIn, X, Facebook), so we composite a real 1200x630 PNG with sharp:
 * github-dark background + glow + circular portrait + name/subtitle/pills.
 * Brand mark uses the site favicon (public/img/logo-mark.png), not a plain "C".
 *
 * Run: pnpm og:generate
 */
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const W = 1200;
const H = 630;

// Brand palette (github-dark preset)
const PRIMARY = '#58a6ff';
const BG_A = '#0b0f16';
const BG_B = '#111a26';
const TEXT = '#ffffff';
const MUTED = '#cbd5e1';

// Portrait circle
const CX = 930;
const CY = 300;
const R = 205;

const LOGO_SIZE = 46;
const LOGO_X = 90;
const LOGO_Y = 74;

const FONT = "'Segoe UI', 'Outfit', 'Helvetica Neue', Arial, sans-serif";

const pill = (x, label) => {
  const padX = 22;
  const charW = 11.2; // approx for 22px semibold
  const w = Math.round(label.length * charW + padX * 2);
  const h = 46;
  const y = 452;
  return {
    w,
    svg: `
      <g transform="translate(${x} ${y})">
        <rect width="${w}" height="${h}" rx="14"
          fill="${PRIMARY}" fill-opacity="0.10"
          stroke="${PRIMARY}" stroke-opacity="0.35" stroke-width="1.5"/>
        <text x="${w / 2}" y="${h / 2 + 8}" text-anchor="middle"
          font-family="${FONT}" font-size="22" font-weight="600"
          fill="${PRIMARY}">${label}</text>
      </g>`,
  };
};

const pills = ['Vue.js', 'Nuxt', 'TypeScript', 'AI · NLP'];
let cursor = 90;
const gap = 16;
const pillSvg = pills
  .map((label) => {
    const p = pill(cursor, label);
    cursor += p.w + gap;
    return p.svg;
  })
  .join('');

const background = Buffer.from(`
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${BG_A}"/>
      <stop offset="1" stop-color="${BG_B}"/>
    </linearGradient>
    <radialGradient id="glowA" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="${PRIMARY}" stop-opacity="0.35"/>
      <stop offset="1" stop-color="${PRIMARY}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="${PRIMARY}" stop-opacity="0.16"/>
      <stop offset="1" stop-color="${PRIMARY}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="44" height="44" patternUnits="userSpaceOnUse">
      <path d="M 44 0 L 0 0 0 44" fill="none" stroke="${PRIMARY}" stroke-width="1" stroke-opacity="0.05"/>
    </pattern>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${PRIMARY}" stop-opacity="0.9"/>
      <stop offset="1" stop-color="${PRIMARY}" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <circle cx="${CX}" cy="${CY - 40}" r="360" fill="url(#glowA)"/>
  <circle cx="120" cy="600" r="320" fill="url(#glowB)"/>

  <!-- Brand text (logo mark composited via sharp) -->
  <g transform="translate(${LOGO_X + LOGO_SIZE + 24} ${LOGO_Y})">
    <text x="0" y="24" font-family="${FONT}" font-size="17" font-weight="700" letter-spacing="3" fill="${MUTED}">CÉSAR GÓMEZ</text>
    <text x="0" y="46" font-family="${FONT}" font-size="14" font-weight="600" letter-spacing="2" fill="${PRIMARY}" fill-opacity="0.85">PORTFOLIO</text>
  </g>

  <!-- Headline -->
  <text x="88" y="290" font-family="${FONT}" font-size="92" font-weight="800" fill="${TEXT}">César Gómez</text>
  <rect x="92" y="318" width="120" height="5" rx="2.5" fill="url(#rule)"/>

  <!-- Subtitle: matches the hero subtitle after the name -->
  <text x="90" y="386" font-family="${FONT}" font-size="37" font-weight="600" fill="${MUTED}">Senior Vue/Nuxt · <tspan fill="${PRIMARY}">AI &amp; NLP Expert</tspan></text>

  ${pillSvg}

  <!-- Footer -->
  <text x="90" y="560" font-family="${FONT}" font-size="26" font-weight="700" fill="${PRIMARY}">cesargomez.dev</text>
  <text x="300" y="560" font-family="${FONT}" font-size="22" font-weight="500" fill="${MUTED}" fill-opacity="0.8">Cartagena · Remote · 13+ years</text>

  <!-- Portrait ring -->
  <circle cx="${CX}" cy="${CY}" r="${R + 10}" fill="none" stroke="${PRIMARY}" stroke-opacity="0.25" stroke-width="2"/>
  <circle cx="${CX}" cy="${CY}" r="${R + 3}" fill="none" stroke="${PRIMARY}" stroke-opacity="0.9" stroke-width="3"/>
</svg>`);

const portraitMask = Buffer.from(
  `<svg width="${R * 2}" height="${R * 2}" xmlns="http://www.w3.org/2000/svg"><circle cx="${R}" cy="${R}" r="${R}" fill="#fff"/></svg>`,
);

async function build() {
  // Ensure favicon mark PNG exists (Satori + this script)
  await import('./rasterize-logo-mark.mjs');

  const logo = await sharp(resolve(root, 'public/img/logo-mark.png'))
    .resize(LOGO_SIZE, LOGO_SIZE, { fit: 'cover' })
    .png()
    .toBuffer();

  const portrait = await sharp(resolve(root, 'public/img/technical-identity.jpg'))
    .resize(R * 2, R * 2, { fit: 'cover', position: 'top' })
    .composite([{ input: portraitMask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  await sharp(background, { density: 144 })
    .resize(W, H)
    .composite([
      { input: logo, left: LOGO_X, top: LOGO_Y },
      { input: portrait, left: CX - R, top: CY - R },
    ])
    .png({ quality: 90 })
    .toFile(resolve(root, 'public/img/og-image.png'));

  console.log('✓ public/img/og-image.png generated (1200x630)');
}

build().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
