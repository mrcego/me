import { expect, test } from '@playwright/test';

async function waitForHydratedNav(page: import('@playwright/test').Page) {
  await expect(
    page
      .getByRole('button', { name: /Theme Presets|Temas IDE|Open menu|Abrir menú|Abrir menu/i })
      .first(),
  ).toBeVisible({ timeout: 20_000 });
}

test.describe('navbar layout regressions', () => {
  test('nav is outside overflow-x-clip and frosted glass works after scroll', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await waitForHydratedNav(page);

    const nestedInClip = await page.locator('.overflow-x-clip .site-nav').count();
    expect(nestedInClip, '.site-nav must not sit under overflow-x-clip').toBe(0);

    // html { scroll-behavior: smooth } makes scrollTo(0, y) async and abortable during
    // hydration — use instant scroll so --nav-progress actually advances.
    await page.evaluate(() => {
      window.scrollTo({ top: 400, behavior: 'instant' });
    });

    await expect
      .poll(async () => page.evaluate(() => window.scrollY), { timeout: 10_000 })
      .toBeGreaterThanOrEqual(300);

    await expect
      .poll(async () => {
        return page.evaluate(() => {
          const raw = getComputedStyle(document.documentElement).getPropertyValue('--nav-progress');
          return Number.parseFloat(raw.trim() || '0');
        });
      })
      .toBeGreaterThan(0.5);

    await expect
      .poll(async () => {
        return page.locator('.site-nav__shell').evaluate((el) => {
          const style = getComputedStyle(el);
          return style.backdropFilter || style.webkitBackdropFilter;
        });
      })
      .not.toMatch(/^blur\(0px\)/);
  });

  test('hire CTA and primary Contact fit inside the shell at mid-desktop widths', async ({
    page,
  }) => {
    for (const width of [1024, 1280]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await expect(page.locator('.hire-menu-trigger')).toBeVisible({ timeout: 20_000 });
      await expect(page.locator('.site-nav__cta')).toBeVisible();

      const geometry = await page.evaluate(() => {
        const shell = document.querySelector('.site-nav__shell');
        const hire = document.querySelector('.hire-menu-trigger');
        const cta = document.querySelector('.site-nav__cta');
        if (!shell || !hire || !cta) return null;
        const s = shell.getBoundingClientRect();
        const h = hire.getBoundingClientRect();
        const c = cta.getBoundingClientRect();
        const inside = (r: DOMRect) =>
          r.left >= s.left - 1 &&
          r.right <= s.right + 1 &&
          r.top >= s.top - 1 &&
          r.bottom <= s.bottom + 1;
        return {
          shellOverflow: shell.scrollWidth - shell.clientWidth,
          hireInside: inside(h),
          ctaInside: inside(c),
        };
      });

      expect(geometry, `geometry at ${width}px`).toBeTruthy();
      expect(geometry!.shellOverflow, `shell overflow at ${width}px`).toBeLessThanOrEqual(1);
      expect(geometry!.hireInside, `hire inside shell at ${width}px`).toBe(true);
      expect(geometry!.ctaInside, `CTA inside shell at ${width}px`).toBe(true);
    }
  });
});
