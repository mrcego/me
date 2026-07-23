/**
 * Rasterize brand mark + favicon PNG sizes from the SVG source of truth.
 *
 * Regenerates SVGs via build-cg-logo.mjs, then exports PNGs.
 * Run: node scripts/rasterize-logo-mark.mjs
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

await import('./build-cg-logo.mjs');

async function writePng(svgPath, outPath, size) {
  const input = readFileSync(svgPath);
  await sharp(input, { density: 384 }).resize(size, size).png().toFile(outPath);
  console.log(`✓ ${outPath} (${size}×${size})`);
}

const markPlate = resolve(root, 'public/img/logo-mark.svg');
const markClear = resolve(root, 'public/favicon.svg');

await writePng(markPlate, resolve(root, 'public/img/logo-mark.png'), 96);
await writePng(markClear, resolve(root, 'public/favicon-16x16.png'), 16);
await writePng(markClear, resolve(root, 'public/favicon-32x32.png'), 32);
await writePng(markPlate, resolve(root, 'public/apple-touch-icon.png'), 180);

await sharp(readFileSync(markClear), { density: 384 })
  .resize(32, 32)
  .png()
  .toFile(resolve(root, 'public/favicon.ico'));
console.log('✓ public/favicon.ico (32×32)');
