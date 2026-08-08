import { pagePrerenderRoutes } from '../app/config/routes.manifest.ts';

const HOST = 'cesargomez.dev';
const KEY = 'c3e5a7g0m1e2z3d4e5v6i7n8d9e0x1n2';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

async function submitIndexNow() {
  const relativeRoutes = pagePrerenderRoutes();
  const urlList = relativeRoutes.map((path) => `https://${HOST}${path}`);

  console.log(`📡 Submitting ${urlList.length} URLs to IndexNow (Bing, DuckDuckGo, etc.)...`);

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  };

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok || response.status === 202) {
      console.log(`✅ IndexNow submission successful! HTTP ${response.status}`);
    } else {
      console.error(
        `⚠️ IndexNow submission returned HTTP ${response.status}: ${await response.text()}`,
      );
    }
  } catch (err) {
    console.error('❌ Failed to submit to IndexNow:', err);
  }
}

submitIndexNow();
