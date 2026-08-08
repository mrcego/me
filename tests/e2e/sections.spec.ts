import { expect, test } from '@playwright/test';

const SECTION_IDS = [
  'hero',
  'about',
  'case-studies',
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

    // Prefer href over label — nav copy is intentionally short (Stack/Certs/Cases/Reviews).
    for (const { href, id } of [
      { href: '#about', id: 'about' },
      { href: '#case-studies', id: 'case-studies' },
      { href: '#tech-stack', id: 'tech-stack' },
      { href: '#certifications', id: 'certifications' },
      { href: '#testimonials', id: 'testimonials' },
    ]) {
      await page.locator(`nav a[href="${href}"]`).first().click();
      await expect(page.locator(`#${id}`)).toBeInViewport({ timeout: 10_000 });
    }
  });
});
