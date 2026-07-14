/**
 * Scrapes testimonial avatars from LinkedIn using a logged-in browser session.
 *
 * Prerequisites:
 *   pnpm add -D playwright
 *   npx playwright install chromium
 *
 * Usage:
 *   pnpm avatars:scrape
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { createInterface } from 'node:readline';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'img', 'avatars');

/** @type {{ slug: string, profileUrl: string }[]} */
const PROFILES = [
  { slug: 'carol-valdebenito', profileUrl: 'https://www.linkedin.com/in/carol-valdebenito/' },
  {
    slug: 'michell-gutierrez',
    profileUrl: 'https://www.linkedin.com/in/michell-jose-gutierrez-rincon/',
  },
  { slug: 'fernando-delgado', profileUrl: 'https://www.linkedin.com/in/fernando-delgado-it/' },
  {
    slug: 'genito-andrade',
    profileUrl: 'https://www.linkedin.com/in/genito-javier-andrade-perez/',
  },
  {
    slug: 'andres-ordonez',
    profileUrl: 'https://www.linkedin.com/in/andres-felipe-ordonez-zuluaga/',
  },
  {
    slug: 'maria-rodriguez',
    profileUrl: 'https://www.linkedin.com/in/maria-de-los-angeles-rodriguez/',
  },
];

function waitForEnter(prompt) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(prompt, () => {
      rl.close();
      resolve();
    });
  });
}

async function extractAvatarUrl(page) {
  return page.evaluate(() => {
    const selectors = [
      'img.pv-top-card-profile-picture__image--show',
      'img.profile-photo-edit__preview',
      'button img[src*="profile-displayphoto"]',
      'img[src*="profile-displayphoto"]',
    ];

    for (const selector of selectors) {
      const img = document.querySelector(selector);
      if (img instanceof HTMLImageElement && img.src) {
        return img.src;
      }
    }

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage instanceof HTMLMetaElement && ogImage.content) {
      return ogImage.content;
    }

    return null;
  });
}

const { chromium } = await import('playwright');

await mkdir(OUT_DIR, { recursive: true });

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext();
const page = await context.newPage();

console.log('Opening LinkedIn… Sign in when prompted.');
await page.goto('https://www.linkedin.com/in/mrcego/details/recommendations/', {
  waitUntil: 'domcontentloaded',
});

await waitForEnter('\nPress Enter after signing in to LinkedIn…\n');

let ok = 0;
let failed = 0;

for (const { slug, profileUrl } of PROFILES) {
  try {
    await page.goto(profileUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(2000);

    const avatarUrl = await extractAvatarUrl(page);
    if (!avatarUrl) {
      throw new Error('Avatar image not found on profile page');
    }

    const cookies = await context.cookies();
    const cookieHeader = cookies.map((c) => `${c.name}=${c.value}`).join('; ');
    const response = await fetch(avatarUrl, {
      headers: {
        Cookie: cookieHeader,
        Referer: profileUrl,
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`CDN HTTP ${response.status}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const webp = await sharp(buffer)
      .resize(128, 128, { fit: 'cover' })
      .webp({ quality: 85 })
      .toBuffer();

    await writeFile(join(OUT_DIR, `${slug}.webp`), webp);
    console.log(`✓ ${slug}`);
    ok += 1;
  } catch (error) {
    console.error(`✗ ${slug}: ${error.message}`);
    failed += 1;
  }
}

await browser.close();
console.log(`\nDone: ${ok} saved, ${failed} failed`);

if (failed > 0) {
  process.exitCode = 1;
}
