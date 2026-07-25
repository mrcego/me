import { expect, test } from '@playwright/test';

const SECTION_IDS = [
  'hero',
  'about',
  'tech-stack',
  'certifications',
  'capabilities',
  'testimonials',
  'hire-profiles',
  'contact',
  'faq',
] as const;

test.describe('homepage sections', () => {
  test('exposes every major section after scrolling the page', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#hero')).toBeVisible();

    for (const id of SECTION_IDS) {
      const section = page.locator(`#${id}`);
      await section.scrollIntoViewIfNeeded();
      await expect(section, `#${id} should be in the document`).toBeVisible({ timeout: 20_000 });
    }

    await page.locator('footer, #faq').last().scrollIntoViewIfNeeded();
    await expect(page.locator('footer').first()).toBeVisible({ timeout: 20_000 });
  });

  test('nav anchors jump to their sections', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('button', { name: /Theme Presets/i })).toBeVisible({
      timeout: 20_000,
    });

    for (const { name, id } of [
      { name: /^About$/i, id: 'about' },
      { name: /Tech Stack/i, id: 'tech-stack' },
      { name: /Certifications/i, id: 'certifications' },
      { name: /Testimonials/i, id: 'testimonials' },
    ]) {
      await page.getByRole('link', { name }).first().click();
      await expect(page.locator(`#${id}`)).toBeInViewport({ timeout: 10_000 });
    }
  });
});
