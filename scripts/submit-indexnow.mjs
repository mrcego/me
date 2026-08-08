import { pagePrerenderRoutes } from '../app/config/routes.manifest.ts';

const HOST = 'cesargomez.dev';
const KEY = 'c3e5a701234546789abcdef012345678';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINTS = ['https://www.bing.com/indexnow', 'https://api.indexnow.org/indexnow'];

async function submitIndexNow() {
  const relativeRoutes = pagePrerenderRoutes();
  const urlList = relativeRoutes.map((path) => `https://${HOST}${path}`);

  console.log(`📡 Submitting ${urlList.length} URLs to IndexNow endpoints...`);

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  };

  for (const endpoint of ENDPOINTS) {
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
      } else {
        console.error(
          `⚠️ IndexNow (${endpoint}) returned HTTP ${response.status}: ${await response.text()}`,
        );
      }
    } catch (err) {
      console.error(`❌ Failed to submit to IndexNow (${endpoint}):`, err);
    }
  }
}

submitIndexNow();
