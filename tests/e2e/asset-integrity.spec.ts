import { expect, test } from '@playwright/test';

test.describe('SSG asset integrity', () => {
  test('buildId is present and every referenced /_nuxt asset resolves with 200', async ({
    page,
    request,
  }) => {
    const res = await request.get('/');
    expect(res.ok()).toBeTruthy();
    const html = await res.text();

    // Nuxt inlines payload as buildId:"<uuid>" (key often unquoted in the script blob).
    const buildId =
      html.match(/buildId:"([^"]+)"/)?.[1] || html.match(/"buildId"\s*:\s*"([^"]+)"/)?.[1];

    expect(buildId, 'Nuxt buildId must be discoverable in HTML').toBeTruthy();

    // Static generate may omit /_nuxt/builds/meta — if present it must match this buildId.
    const metaRes = await request.get(`/_nuxt/builds/meta/${buildId}.json`);
    if (metaRes.status() !== 404) {
      expect(metaRes.ok(), `meta ${buildId}`).toBeTruthy();
    }

    const assetHrefs = [...html.matchAll(/(?:src|href)="(\/_nuxt\/[^"]+\.(?:js|css))"/g)].map(
      (m) => m[1]!,
    );

    expect(assetHrefs.length).toBeGreaterThan(0);

    for (const href of new Set(assetHrefs)) {
      const asset = await request.get(href);
      expect(asset.ok(), href).toBeTruthy();
    }

    // Navigate once so missing chunks also surface as page errors
    const faults: string[] = [];
    page.on('pageerror', (err) => faults.push(err.message));
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#__nuxt')).toBeAttached();
    expect(faults).toEqual([]);
  });

  test('CSS preload appears before the entry module script and returns 200', async ({
    request,
  }) => {
    for (const path of ['/', '/es']) {
      const res = await request.get(path);
      expect(res.ok(), path).toBeTruthy();
      const html = await res.text();

      const preload = html.match(
        /<link[^>]+rel="preload"[^>]+as="style"[^>]+href="(\/_nuxt\/[^"]+\.css)"[^>]*>/i,
      );
      expect(preload, `${path} missing CSS preload`).toBeTruthy();
      const cssHref = preload![1]!;

      const preloadIdx = html.indexOf(preload![0]!);
      const entryIdx = html.search(/<script[^>]+type="module"[^>]+src="\/_nuxt\//i);
      expect(entryIdx, `${path} missing entry module`).toBeGreaterThan(-1);
      expect(preloadIdx, `${path} preload must precede entry module`).toBeLessThan(entryIdx);

      const css = await request.get(cssHref);
      expect(css.ok(), cssHref).toBeTruthy();
      expect(css.headers()['content-type'] || '').toMatch(/css/);
    }
  });
});
