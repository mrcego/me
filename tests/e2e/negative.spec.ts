import { expect, test } from '@playwright/test';

test.describe('negative / edge paths', () => {
  test('unknown routes serve the prerendered 404 page', async ({ page }) => {
    const response = await page.goto('/this-route-does-not-exist-xyz', {
      waitUntil: 'domcontentloaded',
    });
    // Static hosting may 404 or serve 404.html with 200 depending on server.
    expect(response).toBeTruthy();
    const status = response!.status();
    expect([200, 404]).toContain(status);
    const body = await page.locator('body').innerText();
    expect(body.length).toBeGreaterThan(0);
  });

  test('closing theme menu with Escape leaves page interactive', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const themeBtn = page.getByRole('button', { name: /Theme Presets|Temas IDE/i }).first();
    await expect(themeBtn).toBeVisible({ timeout: 20_000 });
    await themeBtn.click();
    await expect(page.locator('#theme-preset-listbox')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#theme-preset-listbox')).toBeHidden();
    await expect(page.locator('#hero')).toBeVisible();
  });

  test('does not request blocked third-party icon APIs while browsing sections', async ({
    page,
  }) => {
    const iconify: string[] = [];
    page.on('request', (req) => {
      if (req.url().includes('api.iconify.design')) iconify.push(req.url());
    });

    await page.goto('/', { waitUntil: 'networkidle' });
    for (const id of ['about', 'tech-stack', 'certifications', 'contact', 'faq']) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await expect(page.locator(`#${id}`)).toBeVisible();
    }

    expect(iconify).toEqual([]);
  });

  test('Spanish landings do not blank the app shell', async ({ page }) => {
    await page.goto('/es/ingeniero-ia', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#__nuxt')).toBeAttached();
    await expect(page.locator('main, #main-content').first()).toBeVisible();
    const text = await page.locator('body').innerText();
    expect(text.trim().length).toBeGreaterThan(40);
  });
});
