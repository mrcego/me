/**
 * Scrapes testimonial avatars from LinkedIn with a logged-in Playwright session.
 *
 * Flow:
 *   1. Open feed / login (recommendations pages often render blank under automation)
 *   2. Wait for authenticated global nav
 *   3. Visit each profile URL and download the high-res display photo
 *
 * Usage:
 *   pnpm avatars:scrape
 *   pnpm avatars:scrape -- --only=fernando-delgado,genito-andrade
 *   pnpm avatars:scrape -- --force
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(ROOT, 'public', 'img', 'avatars');
const AUTH_PATH = join(ROOT, '.cache', 'linkedin-auth.json');
const PROFILE_DIR = join(ROOT, '.cache', 'linkedin-chrome-profile');
const FEED_URL = 'https://www.linkedin.com/feed/';
const LOGIN_URL = 'https://www.linkedin.com/login';
const OUTPUT_SIZE = 256;
const MIN_BYTES = 2500;

/** Profiles already verified — skipped unless --force */
const KEEP_SLUGS = new Set(['carol-valdebenito', 'michell-gutierrez']);

/**
 * @typedef {{ slug: string, matchNames: string[], profileUrls: string[] }} ProfileTarget
 */

/** @type {ProfileTarget[]} */
const PROFILES = [
  {
    slug: 'fernando-delgado',
    matchNames: ['Fernando Delgado'],
    profileUrls: [
      'https://www.linkedin.com/in/fernando-delgado-427865166/',
      'https://www.linkedin.com/in/fernando-delgado-it/',
    ],
  },
  {
    slug: 'genito-andrade',
    matchNames: ['Genito Javier Andrade Perez', 'Genito Javier Andrade', 'Genito Andrade'],
    profileUrls: [
      'https://www.linkedin.com/in/genito-javier-andrade-perez-18a952162/',
      'https://ar.linkedin.com/in/genito-javier-andrade-perez-18a952162/',
      'https://www.linkedin.com/in/genito-javier-andrade-perez/',
    ],
  },
  {
    slug: 'andres-ordonez',
    matchNames: [
      'Andres Felipe Ordoñez Zuluaga',
      'Andrés Felipe Ordoñez Zuluaga',
      'Andres Felipe Ordonez',
    ],
    profileUrls: ['https://www.linkedin.com/in/andres-felipe-ordonez/'],
  },
  {
    slug: 'maria-rodriguez',
    matchNames: ['María de los Ángeles Rodríguez', 'Maria de los Angeles Rodriguez'],
    profileUrls: ['https://www.linkedin.com/in/mariangel09/'],
  },
  {
    slug: 'carol-valdebenito',
    matchNames: ['Carol Valdebenito'],
    profileUrls: ['https://www.linkedin.com/in/carol-valdebenito/'],
  },
  {
    slug: 'michell-gutierrez',
    matchNames: ['Michell Jose Gutierrez Rincon', 'Michell Gutierrez'],
    profileUrls: ['https://www.linkedin.com/in/michell-jose-gutierrez-rincon/'],
  },
];

const args = process.argv.slice(2);
const force = args.includes('--force');
const onlyArg = args.find((a) => a.startsWith('--only='));
const onlySlugs = onlyArg
  ? new Set(
      onlyArg
        .slice('--only='.length)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    )
  : null;

function upgradeLinkedInPhotoUrl(url) {
  if (!url || typeof url !== 'string') return url;
  return url
    .replace(/profile-displayphoto-scale_\d+_\d+/g, 'profile-displayphoto-scale_400_400')
    .replace(/profile-displayphoto-shrink_\d+_\d+/g, 'profile-displayphoto-shrink_800_800')
    .replace(/shrink_\d+_\d+/g, 'shrink_800_800');
}

/** Build size variants for LinkedIn media CDN (scale_* and shrink_*). */
function photoUrlCandidates(url) {
  const sizes = ['800_800', '400_400', '200_200', '100_100'];
  const set = new Set([url, upgradeLinkedInPhotoUrl(url)]);
  for (const s of sizes) {
    set.add(url.replace(/profile-displayphoto-scale_\d+_\d+/g, `profile-displayphoto-scale_${s}`));
    set.add(
      url.replace(/profile-displayphoto-shrink_\d+_\d+/g, `profile-displayphoto-shrink_${s}`),
    );
    set.add(url.replace(/shrink_\d+_\d+/g, `shrink_${s}`));
  }
  return [...set].filter(Boolean).sort((a, b) => {
    const rank = (u) => (/800_800/.test(u) ? 0 : /400_400/.test(u) ? 1 : /200_200/.test(u) ? 2 : 3);
    return rank(a) - rank(b);
  });
}

function isLikelyGhostOrPlaceholderUrl(url) {
  const u = url.toLowerCase();
  return (
    u.includes('ghost') ||
    u.includes('placeholder') ||
    u.includes('data:image') ||
    u.includes('static.licdn.com/aero') ||
    u.includes('person-default') ||
    u.includes('/aero-v1/sc/h/')
  );
}

/**
 * @param {import('playwright').Page} page
 */
async function isLoggedIn(page) {
  try {
    const url = page.url();
    if (
      url.includes('/login') ||
      url.includes('/authwall') ||
      url.includes('/checkpoint') ||
      url.includes('/signup') ||
      url.includes('/uas/')
    ) {
      return false;
    }

    const nav = page.locator('#global-nav, .global-nav__me, img.global-nav__me-photo');
    if (
      (await nav.count()) > 0 &&
      (await nav
        .first()
        .isVisible()
        .catch(() => false))
    ) {
      return true;
    }

    // Feed / profile while logged in often has this
    if (url.includes('/feed') || url.includes('/in/')) {
      const me = await page
        .locator('a[href*="/in/"]')
        .first()
        .isVisible()
        .catch(() => false);
      const search = await page
        .locator('input[placeholder*="Search"], input[placeholder*="Buscar"]')
        .count();
      if (me && search > 0) return true;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * @param {import('playwright').Page} page
 * @param {number} timeoutMs
 */
async function waitForLogin(page, timeoutMs = 10 * 60 * 1000) {
  const started = Date.now();
  console.log('\n>>> Inicia sesión en la ventana de Chromium <<<');
  console.log('Ve al feed (linkedin.com/feed). El script continúa solo.\n');
  console.log('(No uses /details/recommendations — a menudo queda en blanco.)\n');

  while (Date.now() - started < timeoutMs) {
    if (await isLoggedIn(page)) {
      console.log('Login detectado.');
      await page.waitForTimeout(1500);
      return;
    }
    await page.waitForTimeout(2000);
  }

  throw new Error('Timed out waiting for LinkedIn login');
}

/**
 * @param {import('playwright').Page} page
 */
async function extractAvatarUrlFromProfile(page) {
  try {
    await page.waitForSelector(
      'img.pv-top-card-profile-picture__image--show, img.pv-top-card-profile-picture__image, img[src*="profile-displayphoto"], button.pv-top-card-profile-picture img, meta[property="og:image"]',
      { timeout: 20000 },
    );
  } catch {
    // continue with evaluate fallbacks
  }

  await page.waitForTimeout(1200);

  return page.evaluate(() => {
    const collect = (img) => {
      if (!(img instanceof HTMLImageElement)) return [];
      const out = [];
      if (img.currentSrc) out.push(img.currentSrc);
      if (img.src) out.push(img.src);
      if (img.srcset) {
        for (const part of img.srcset.split(',')) {
          const u = part.trim().split(/\s+/)[0];
          if (u) out.push(u);
        }
      }
      return out;
    };

    const selectors = [
      'img.pv-top-card-profile-picture__image--show',
      'img.pv-top-card-profile-picture__image',
      'button.pv-top-card-profile-picture img',
      'img.profile-photo-edit__preview',
      'img[src*="profile-displayphoto"]',
      'img[srcset*="profile-displayphoto"]',
      'section.artdeco-card img[src*="profile-displayphoto"]',
    ];

    const urls = [];
    for (const selector of selectors) {
      for (const img of document.querySelectorAll(selector)) {
        urls.push(...collect(img));
      }
    }

    const best =
      urls.find((u) => u.includes('profile-displayphoto') && u.includes('800_800')) ||
      urls.find((u) => u.includes('profile-displayphoto') && u.includes('400_400')) ||
      urls.find((u) => u.includes('profile-displayphoto')) ||
      urls.find((u) => u.includes('media.licdn.com'));

    if (best) return best;

    const og = document.querySelector('meta[property="og:image"]');
    if (og instanceof HTMLMetaElement && og.content && !og.content.includes('static.licdn.com')) {
      return og.content;
    }

    return null;
  });
}

/**
 * @param {import('playwright').BrowserContext} context
 * @param {string} avatarUrl
 * @param {string} referer
 */
async function downloadImage(context, avatarUrl, referer) {
  const candidates = photoUrlCandidates(avatarUrl);

  let lastError = /** @type {Error | null} */ (null);

  for (const url of candidates) {
    if (isLikelyGhostOrPlaceholderUrl(url)) {
      lastError = new Error(`Ghost/placeholder URL: ${url.slice(0, 90)}`);
      continue;
    }

    try {
      const response = await context.request.get(url, {
        headers: {
          Referer: referer,
          Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        },
        timeout: 30000,
      });

      if (!response.ok()) {
        lastError = new Error(`HTTP ${response.status()}`);
        continue;
      }

      const buffer = Buffer.from(await response.body());
      if (buffer.byteLength < MIN_BYTES) {
        lastError = new Error(`Image too small (${buffer.byteLength} B)`);
        continue;
      }

      const meta = await sharp(buffer).metadata();
      if ((meta.width ?? 0) < 64 || (meta.height ?? 0) < 64) {
        lastError = new Error(`Dimensions too small (${meta.width}×${meta.height})`);
        continue;
      }

      return buffer;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }

  throw lastError ?? new Error('Download failed');
}

async function saveWebp(buffer, slug) {
  const webp = await sharp(buffer)
    .rotate()
    .resize(OUTPUT_SIZE, OUTPUT_SIZE, { fit: 'cover', position: 'attention' })
    .webp({ quality: 90 })
    .toBuffer();

  if (webp.byteLength < MIN_BYTES) {
    throw new Error(`Encoded webp too small (${webp.byteLength} B)`);
  }

  await writeFile(join(OUT_DIR, `${slug}.webp`), webp);
  return webp.byteLength;
}

function selectTargets() {
  return PROFILES.filter((p) => {
    if (onlySlugs && !onlySlugs.has(p.slug)) return false;
    if (!force && KEEP_SLUGS.has(p.slug)) return false;
    return true;
  });
}

const { chromium } = await import('playwright');

await mkdir(OUT_DIR, { recursive: true });
await mkdir(PROFILE_DIR, { recursive: true });
await mkdir(dirname(AUTH_PATH), { recursive: true });

const targets = selectTargets();
if (targets.length === 0) {
  console.log('Nothing to scrape. Use --force or --only=…');
  process.exit(0);
}

console.log(`Targets (${targets.length}): ${targets.map((t) => t.slug).join(', ')}`);
if (!force) console.log('Keeping carol-valdebenito & michell-gutierrez unchanged.\n');

/** Prefer real Chrome — less blank-page / bot friction than bundled Chromium */
const launchOptions = {
  headless: false,
  viewport: { width: 1400, height: 960 },
  args: ['--disable-blink-features=AutomationControlled'],
  ignoreDefaultArgs: ['--enable-automation'],
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
};

let context;
try {
  context = await chromium.launchPersistentContext(PROFILE_DIR, {
    ...launchOptions,
    channel: 'chrome',
  });
  console.log('Using installed Google Chrome.');
} catch {
  context = await chromium.launchPersistentContext(PROFILE_DIR, launchOptions);
  console.log('Using Playwright Chromium (install Chrome for better LinkedIn rendering).');
}

const page = context.pages()[0] ?? (await context.newPage());

console.log('Opening LinkedIn feed / login…');
await page.goto(FEED_URL, { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(() => null);
await page.waitForTimeout(2000);

if (!(await isLoggedIn(page))) {
  await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(() => null);
  await waitForLogin(page);
  await page.goto(FEED_URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(2000);
} else {
  console.log('Session already active.');
}

await context.storageState({ path: AUTH_PATH }).catch(() => {});
console.log(`Saved session → ${AUTH_PATH}\n`);

let ok = 0;
let failed = 0;

for (const target of targets) {
  try {
    let avatarUrl = null;
    let referer = FEED_URL;

    for (const profileUrl of target.profileUrls) {
      console.log(`  → ${profileUrl}`);
      await page.goto(profileUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(2500);

      // Soft scroll to trigger lazy media
      await page.mouse.wheel(0, 400);
      await page.waitForTimeout(800);

      avatarUrl = await extractAvatarUrlFromProfile(page);
      if (avatarUrl && !isLikelyGhostOrPlaceholderUrl(avatarUrl)) {
        referer = profileUrl;
        console.log(`  found photo (${avatarUrl.slice(0, 70)}…)`);
        break;
      }
      avatarUrl = null;
      console.log('  · no usable photo on this URL');
    }

    if (!avatarUrl) {
      throw new Error('Avatar not found on any profile URL');
    }

    const buffer = await downloadImage(context, avatarUrl, referer);
    const bytes = await saveWebp(buffer, target.slug);
    console.log(`✓ ${target.slug} (${bytes} B webp)`);
    ok += 1;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`✗ ${target.slug}: ${message}`);
    failed += 1;
  }
}

await context.storageState({ path: AUTH_PATH }).catch(() => {});
await context.close();

console.log(`\nDone: ${ok} saved, ${failed} failed`);
if (failed > 0) process.exitCode = 1;
