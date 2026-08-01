import { expect, test } from '@playwright/test';
import { PORTFOLIO_ROUTES } from '../../app/config/routes.manifest';

/**
 * Optional production smoke — runs only when PLAYWRIGHT_PROD_URL points at
 * https://cesargomez.dev (or a Deploy Preview). Local SSG suite stays default.
 */
const productionBase = process.env.PLAYWRIGHT_PROD_URL || '';

test.describe('production smoke', () => {
  test.skip(!productionBase, 'Set PLAYWRIGHT_PROD_URL to run production smoke');

  const routes = PORTFOLIO_ROUTES.flatMap((route) => [route.paths.en, route.paths.es]);

  for (const path of routes) {
    test(`GET ${path} is 200 with canonical`, async ({ request }) => {
      const res = await request.get(new URL(path, productionBase).toString());
      expect(res.status(), path).toBe(200);
      const html = await res.text();
      expect(html).toMatch(/rel=["']canonical["']/i);
      expect(html).toMatch(/hreflang=["']en-US["']/i);
      expect(html).toMatch(/hreflang=["']es-ES["']/i);
    });
  }

  test('home has JSON-LD structured data', async ({ request }) => {
    const res = await request.get(new URL('/', productionBase).toString());
    expect(res.status()).toBe(200);
    const html = await res.text();
    expect(html).toMatch(/type=["']application\/ld\+json["']/i);
  });

  test('robots + sitemap reachable', async ({ request }) => {
    const robots = await request.get(new URL('/robots.txt', productionBase).toString());
    expect(robots.status()).toBe(200);
    const robotsText = await robots.text();
    expect(robotsText).toMatch(/Sitemap:\s*https:\/\/cesargomez\.dev\//i);

    const sitemap = await request.get(new URL('/sitemap_index.xml', productionBase).toString());
    expect(sitemap.status(), 'sitemap_index.xml').toBe(200);
    const body = await sitemap.text();
    expect(body).toMatch(/<urlset|<sitemapindex/i);
  });

  test('/llms.txt and /ai.txt are reachable', async ({ request }) => {
    const llms = await request.get(new URL('/llms.txt', productionBase).toString());
    expect(llms.status(), '/llms.txt').toBe(200);
    const llmsText = await llms.text();
    expect(llmsText).toMatch(/cesargomez\.dev/i);

    const ai = await request.get(new URL('/ai.txt', productionBase).toString());
    expect(ai.status(), '/ai.txt').toBe(200);
    const aiText = await ai.text();
    expect(aiText).toMatch(/llms\.txt/i);
  });

  test('www redirects to apex when www resolves', async ({ request }) => {
    let wwwBase: URL;
    try {
      wwwBase = new URL(productionBase);
      if (wwwBase.hostname === 'localhost' || wwwBase.hostname === '127.0.0.1') {
        test.skip(true, 'localhost has no www redirect');
        return;
      }
      wwwBase.hostname = `www.${wwwBase.hostname.replace(/^www\./, '')}`;
    } catch {
      test.skip(true, 'invalid PLAYWRIGHT_PROD_URL');
      return;
    }

    const res = await request.get(new URL('/', wwwBase).toString(), {
      maxRedirects: 0,
      failOnStatusCode: false,
    });

    if (res.status() === 0 || res.status() >= 500) {
      test.skip(true, 'www host unreachable or DNS blocked');
      return;
    }

    expect([301, 302, 308]).toContain(res.status());
    const location = res.headers()['location'] || '';
    expect(location).toMatch(/^https:\/\/cesargomez\.dev\//i);
  });

  test('hashed assets advertise long cache when present', async ({ request }) => {
    const home = await request.get(new URL('/', productionBase).toString());
    const html = await home.text();
    const match = html.match(/\/_nuxt\/[^"'\\s]+\.js/);
    test.skip(!match, 'no /_nuxt/*.js reference in home HTML');
    const assetUrl = new URL(match![0], productionBase).toString();
    const asset = await request.get(assetUrl);
    expect(asset.status()).toBe(200);
    const cache = asset.headers()['cache-control'] || '';
    expect(cache).toMatch(/max-age=31536000/i);
    expect(cache).toMatch(/immutable/i);
  });
});
