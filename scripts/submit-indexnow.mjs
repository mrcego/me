import { existsSync, readdirSync } from 'node:fs';
import { basename, join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { pagePrerenderRoutes } from '../app/config/routes.manifest.ts';

const HOST = 'cesargomez.dev';
const ENDPOINTS = ['https://www.bing.com/indexnow', 'https://api.indexnow.org/indexnow'];
const MAX_ATTEMPTS = 3;

/**
 * Resolves IndexNow API verification key from environment variable or auto-discovers
 * standard 32-character hex verification file from `public/` directory.
 *
 * @returns {string | null}
 */
function resolveIndexNowKey() {
  if (process.env.INDEXNOW_KEY && process.env.INDEXNOW_KEY.trim()) {
    return process.env.INDEXNOW_KEY.trim();
  }

  const publicDir = join(process.cwd(), 'public');
  if (existsSync(publicDir)) {
    const candidate = readdirSync(publicDir).find((file) => /^[a-f0-9]{32}\.txt$/i.test(file));
    if (candidate) {
      return basename(candidate, '.txt');
    }
  }

  return null;
}

/**
 * @param {string} endpoint
 * @param {object} payload
 * @param {number} attempt
 */
async function submitWithRetry(endpoint, payload, attempt = 1) {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok || response.status === 202) {
      console.log(`✅ IndexNow (${endpoint}) successful! HTTP ${response.status}`);
      return true;
    }

    const text = await response.text().catch(() => '');
    console.warn(
      `⚠️ IndexNow (${endpoint}) attempt ${attempt}/${MAX_ATTEMPTS} returned HTTP ${response.status}: ${text}`,
    );
  } catch (err) {
    console.warn(
      `⚠️ IndexNow (${endpoint}) attempt ${attempt}/${MAX_ATTEMPTS} failed:`,
      err.message || err,
    );
  }

  if (attempt < MAX_ATTEMPTS) {
    const delayMs = attempt * 1000;
    await sleep(delayMs);
    return submitWithRetry(endpoint, payload, attempt + 1);
  }

  console.error(`❌ IndexNow (${endpoint}) failed after ${MAX_ATTEMPTS} attempts.`);
  return false;
}

async function submitIndexNow() {
  const key = resolveIndexNowKey();
  if (!key) {
    console.warn(
      '⚠️ IndexNow skipped: No INDEXNOW_KEY environment variable or public/<key>.txt verification file found.',
    );
    return;
  }

  const keyLocation = `https://${HOST}/${key}.txt`;
  const relativeRoutes = pagePrerenderRoutes();
  const urlList = relativeRoutes.map((path) => `https://${HOST}${path}`);

  console.log(`📡 Submitting ${urlList.length} URLs to IndexNow endpoints...`);
  console.log(`🔑 Host: ${HOST} | Key Location: ${keyLocation}`);

  const payload = {
    host: HOST,
    key,
    keyLocation,
    urlList,
  };

  const results = await Promise.all(
    ENDPOINTS.map((endpoint) => submitWithRetry(endpoint, payload)),
  );

  const successful = results.filter(Boolean).length;
  console.log(
    `🏁 IndexNow submission complete: ${successful}/${ENDPOINTS.length} endpoints succeeded.`,
  );
}

submitIndexNow();
