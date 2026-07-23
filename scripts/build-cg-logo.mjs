/**
 * Build the CG interlocking lettermark SVGs (source of truth for brand mark).
 * Run: node scripts/build-cg-logo.mjs
 */
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PRIMARY = '#58a6ff';
const BG = '#0d1117';
const sw = 5.75;
const r = 11.25;

function terminal(cx, cy, deg) {
  const a = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

function letterC(cx, cy) {
  const [x1, y1] = terminal(cx, cy, -52);
  const [x2, y2] = terminal(cx, cy, 52);
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 1 0 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

function letterG(cx, cy) {
  const [x1, y1] = terminal(cx, cy, -48);
  const [x2, y2] = terminal(cx, cy, 58);
  const arc = `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 1 0 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
  const barLeft = cx - 0.5;
  const barRight = cx + r + 0.35;
  const stemBottom = cy + 6.4;
  const spur = `M ${barLeft.toFixed(2)} ${cy} H ${barRight.toFixed(2)} V ${stemBottom.toFixed(2)}`;
  return { arc, spur };
}

const cy = 32;
const c = letterC(20.5, cy);
const g = letterG(43.5, cy);

const strokes = `
  <path d="${c}" stroke="${PRIMARY}" stroke-width="${sw}" stroke-linecap="butt" fill="none"/>
  <path d="${g.arc}" stroke="${PRIMARY}" stroke-width="${sw}" stroke-linecap="butt" fill="none"/>
  <path d="${g.spur}" stroke="${PRIMARY}" stroke-width="${sw}" stroke-linecap="butt" stroke-linejoin="miter" fill="none"/>
`.trim();

const mark = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none" role="img" aria-label="CG Cesar Gomez">
${strokes}
</svg>
`;

const plate = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none" role="img" aria-label="CG Cesar Gomez">
  <rect width="64" height="64" rx="16" fill="${BG}"/>
${strokes}
</svg>
`;

writeFileSync(resolve(root, 'public/favicon.svg'), mark);
writeFileSync(resolve(root, 'public/img/logo-final.svg'), mark);
writeFileSync(resolve(root, 'public/img/logo-mark.svg'), plate);
console.log('✓ CG lettermark SVGs written');
