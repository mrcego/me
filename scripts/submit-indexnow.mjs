import { setTimeout as sleep } from 'node:timers/promises';
import { pagePrerenderRoutes } from '../app/config/routes.manifest.ts';

const HOST = 'cesargomez.dev';
const KEY = process.env.INDEXNOW_KEY || 'e8610d0c86bb4715b5266a9b8aed362f';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINTS = ['https://www.bing.com/indexnow', 'https://api.indexnow.org/indexnow'];
const MAX_ATTEMPTS = 3;

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
  const relativeRoutes = pagePrerenderRoutes();
  const urlList = relativeRoutes.map((path) => `https://${HOST}${path}`);

  console.log(`📡 Submitting ${urlList.length} URLs to IndexNow endpoints...`);
  console.log(`🔑 Host: ${HOST} | Key Location: ${KEY_LOCATION}`);

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
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
