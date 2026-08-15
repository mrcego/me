import { expect, test, type Page } from '@playwright/test';

async function collectPageFaults(page: Page) {
  const cspErrors: string[] = [];
  const pageErrors: string[] = [];
  const iconifyRequests: string[] = [];

  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const text = msg.text();
    if (/Content Security Policy|Refused to/i.test(text)) {
      cspErrors.push(text);
    }
  });

  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });

  page.on('request', (request) => {
    if (request.url().includes('api.iconify.design')) {
      iconifyRequests.push(request.url());
    }
  });

  return { cspErrors, pageErrors, iconifyRequests };
}

test.describe('portfolio SSG under CSP', () => {
  test('boots Vue, keeps icons local, and stays interactive', async ({ page }) => {
    await page.setViewportSize({ width: 1536, height: 800 });
    const faults = await collectPageFaults(page);

    const response = await page.goto('/', { waitUntil: 'networkidle' });
    expect(response?.ok()).toBeTruthy();

    await expect(page.locator('#hero')).toBeVisible();
    await expect(page.locator('#main-content')).toBeVisible();
    await expect(page.locator('#__nuxt')).toBeAttached();

    // Theme picker is ClientOnly — visibility means Vue hydrated under CSP
    const themeBtn = page.getByRole('button', { name: /Theme Presets|Temas IDE/i }).first();
    await expect(themeBtn).toBeVisible({ timeout: 20_000 });
    await themeBtn.click();
    await expect(page.locator('#theme-preset-listbox')).toBeVisible();
    await page.keyboard.press('Escape');

    // Language switch
    const langBtn = page.getByRole('button', { name: /Switch language|Cambiar idioma/i }).first();
    await expect(langBtn).toBeVisible();
    await langBtn.click();
    await page.waitForURL(/\/es\/?$/);
    await expect(page.locator('#hero')).toBeVisible();

    // Hire CTA must remain in the viewport shell (overflow regressions)
    const hire = page.getByRole('button', { name: /Hire|Contratar/i }).first();
    await expect(hire).toBeVisible();
    const box = await hire.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.width).toBeGreaterThan(24);
    expect(box!.x + box!.width).toBeLessThanOrEqual((await page.viewportSize())!.width + 1);

    const iconBox = await page
      .locator('.hire-menu-trigger .iconify, .hire-menu-trigger svg')
      .first()
      .boundingBox();
    expect(iconBox, 'hire chevron icon should paint').toBeTruthy();
    expect(iconBox!.width).toBeGreaterThan(2);
    expect(iconBox!.height).toBeGreaterThan(2);

    expect(faults.iconifyRequests, 'icons must not hit api.iconify.design').toEqual([]);
    expect(faults.cspErrors, 'CSP must not block scripts/styles').toEqual([]);
    expect(faults.pageErrors, 'no uncaught page errors').toEqual([]);
  });

  test('homepage HTML discovers CSS before entry JS via preload', async ({ request }) => {
    const res = await request.get('/');
    expect(res.ok()).toBeTruthy();
    const html = await res.text();
    expect(html).toMatch(/rel="preload"[^>]*as="style"[^>]*href="\/_nuxt\/[^"]+\.css"/);
    const lcpIdx = html.search(/rel="preload"[^>]*as="image"|as="image"[^>]*rel="preload"/i);
    const cssIdx = html.search(/rel="preload"[^>]*as="style"/i);
    expect(lcpIdx).toBeGreaterThan(-1);
    expect(lcpIdx).toBeLessThan(cssIdx);
    expect(html).toMatch(/__NUXT__|#__NUXT_DATA__/);
  });

  test('landing pages render under CSP', async ({ page }) => {
    const faults = await collectPageFaults(page);
    const paths = [
      '/vue-frontend-developer/',
      '/ai-engineer/',
      '/nodejs-backend-developer/',
      '/es/desarrollador-vue/',
    ];

    for (const path of paths) {
      const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
      expect(response?.ok(), path).toBeTruthy();
      await expect(page.locator('main, #main-content').first()).toBeVisible();
    }

    expect(faults.cspErrors).toEqual([]);
    expect(faults.pageErrors).toEqual([]);
  });

  test('home hire-profile links use trailing-slash canonical hrefs', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const expected = [
      '/vue-frontend-developer/',
      '/nodejs-backend-developer/',
      '/ai-assisted-craft/',
    ];

    for (const path of expected) {
      const link = page.locator(`a[href="${path}"]`).first();
      await expect(link, `expected href ${path}`).toBeAttached();
    }
  });
});
