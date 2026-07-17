/**
 * Downloads testimonial avatars from LinkedIn via unavatar.io (best-effort).
 * Prefer `pnpm avatars:scrape` for reliable high-res photos.
 *
 * Run: pnpm avatars:fetch
 *      pnpm avatars:fetch -- --force
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'img', 'avatars');
const KEEP_SLUGS = new Set(['carol-valdebenito', 'michell-gutierrez']);
const force = process.argv.includes('--force');

/** @type {{ fileSlug: string, linkedinUsername: string }[]} */
const AVATARS = [
  { fileSlug: 'carol-valdebenito', linkedinUsername: 'carol-valdebenito' },
  { fileSlug: 'michell-gutierrez', linkedinUsername: 'michell-jose-gutierrez-rincon' },
  { fileSlug: 'fernando-delgado', linkedinUsername: 'fernando-delgado-427865166' },
  { fileSlug: 'genito-andrade', linkedinUsername: 'genito-javier-andrade-perez-18a952162' },
  { fileSlug: 'andres-ordonez', linkedinUsername: 'andres-felipe-ordonez' },
  { fileSlug: 'maria-rodriguez', linkedinUsername: 'mariangel09' },
];

await mkdir(OUT_DIR, { recursive: true });

let ok = 0;
let failed = 0;

for (const { fileSlug, linkedinUsername } of AVATARS) {
  if (!force && KEEP_SLUGS.has(fileSlug)) {
    console.log(`↷ ${fileSlug} (kept)`);
    continue;
  }

  try {
    const url = `https://unavatar.io/linkedin/${linkedinUsername}?fallback=false`;
    const response = await fetch(url, { redirect: 'follow' });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.byteLength < 2500) {
      throw new Error(`Image too small (${buffer.byteLength} B)`);
    }

    const webp = await sharp(buffer)
      .resize(256, 256, { fit: 'cover', position: 'attention' })
      .webp({ quality: 90 })
      .toBuffer();

    await writeFile(join(OUT_DIR, `${fileSlug}.webp`), webp);
    console.log(`✓ ${fileSlug}`);
    ok += 1;
  } catch (error) {
    console.error(`✗ ${fileSlug}: ${error.message}`);
    failed += 1;
  }
}

console.log(`\nDone: ${ok} saved, ${failed} failed`);
if (failed > 0) process.exitCode = 1;
