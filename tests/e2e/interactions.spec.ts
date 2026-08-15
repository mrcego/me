import { expect, test } from '@playwright/test';

async function waitForHydratedNav(page: import('@playwright/test').Page) {
  // Theme presets are ClientOnly with a disabled fallback — enabled means hydrated.
  // The hamburger is SSR-painted earlier and must not be used as the hydration signal.
  const themeBtn = page.getByRole('button', { name: /Theme Presets|Temas IDE/i });
  await expect(themeBtn).toBeVisible({ timeout: 20_000 });
  await expect(themeBtn).toBeEnabled({ timeout: 20_000 });
}

test.describe('interactive chrome', () => {
  test('opens and closes the vibe coding modal', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const openBtn = page.getByRole('button', { name: /Open AI workflow details/i }).first();
    await expect(openBtn).toBeVisible({ timeout: 20_000 });
    await expect(async () => {
      await openBtn.click({ force: true });
      await expect(page.locator('#vibe-coding-modal-title')).toBeVisible();
    }).toPass({ timeout: 20_000 });
    await page
      .getByRole('button', { name: /close|cerrar/i })
      .first()
      .click({ force: true });
    await expect(page.locator('#vibe-coding-modal-title')).toBeHidden({ timeout: 10_000 });
  });

  test('applies a theme from the preset list', async ({ page }) => {
    await page.setViewportSize({ width: 1536, height: 800 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await waitForHydratedNav(page);
    const themeBtn = page.getByRole('button', { name: /Theme Presets|Temas IDE/i }).first();
    await themeBtn.click();
    await expect(page.locator('#theme-preset-listbox')).toBeVisible();
    await page.locator('#theme-option-dracula').click();
    await expect
      .poll(async () => page.evaluate(() => localStorage.getItem('theme-preset-id')))
      .toBe('dracula');
    await expect(page.locator('[data-theme-logo]')).toHaveCSS('color', 'rgb(189, 147, 249)');
    await expect(page.locator('#theme-favicon')).toHaveAttribute(
      'href',
      /data:image\/svg\+xml,.*bd93f9/,
    );
  });

  test('opens hire profiles menu and navigates a profile', async ({ page }) => {
    await page.setViewportSize({ width: 1536, height: 800 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await waitForHydratedNav(page);
    const hire = page.getByRole('button', { name: /Hire|Contratar/i }).first();
    await hire.click();
    await expect(page.locator('#hire-profile-menu')).toBeVisible({ timeout: 10_000 });
    await page
      .locator('#hire-profile-menu a, #hire-profile-menu [role="menuitem"]')
      .first()
      .click();
    await page.waitForURL(
      /vue-frontend-developer|ai-engineer|nodejs-backend|desarrollador|ingeniero/,
    );
    await expect(page.locator('main, #main-content').first()).toBeVisible();
  });

  test('certifications show-all expands then collapses', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.locator('#certifications').scrollIntoViewIfNeeded();
    const toggle = page.getByRole('button', { name: /Show all|Show less|Ver todos|Ver menos/i });
    await expect(toggle).toBeVisible({ timeout: 30_000 });
    await expect(async () => {
      await toggle.click();
      await expect(page.getByRole('button', { name: /Show less|Ver menos/i })).toBeVisible();
    }).toPass({ timeout: 20_000 });
    await page.getByRole('button', { name: /Show less|Ver menos/i }).click();
    await expect(page.getByRole('button', { name: /Show all|Ver todos/i })).toBeVisible();
  });

  test('FAQ section lists questions and answers', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.locator('#faq').scrollIntoViewIfNeeded();
    await expect(page.locator('#faq')).toBeVisible({ timeout: 25_000 });
    await expect(page.locator('#faq-heading')).toBeVisible();
    await expect(page.locator('#faq dt').first()).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('#faq dd').first()).toBeVisible();
    expect(await page.locator('#faq dt').count()).toBeGreaterThan(3);
    expect(await page.locator('#faq dd').count()).toBe(await page.locator('#faq dt').count());
  });

  test('decorative protocol chat is not mounted in runtime', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4500);
    await expect(page.getByRole('button', { name: /chat assistant/i })).toHaveCount(0);
  });

  test('mobile menu opens, navigates, and closes', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    // SSR paints the hamburger before LazyAppNavbar hydrates — wait for enabled theme control.
    const themeBtn = page.getByRole('button', { name: /Theme Presets|Temas IDE/i });
    await expect(themeBtn).toBeVisible({ timeout: 20_000 });
    await expect(themeBtn).toBeEnabled({ timeout: 20_000 });
    const menuToggle = page.getByRole('button', {
      name: /Open menu|Abrir menú|Abrir menu/i,
    });
    await menuToggle.click();
    const drawer = page.getByRole('dialog');
    await expect(drawer).toBeVisible({ timeout: 10_000 });
    await drawer.getByRole('link', { name: /^About$|^Acerca/i }).click();
    await expect(page.locator('#about')).toBeInViewport({ timeout: 15_000 });
  });

  test('mobile menu: Escape closes and focus returns to trigger', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await waitForHydratedNav(page);
    const menuToggle = page.getByRole('button', {
      name: /Open menu|Abrir menú|Abrir menu/i,
    });
    await expect(async () => {
      await menuToggle.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }).toPass({ timeout: 15_000 });
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden({ timeout: 10_000 });
    await expect(menuToggle).toBeFocused();
  });

  test('mobile menu sets main-content inert while open', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await waitForHydratedNav(page);
    const main = page.locator('#main-content');
    if ((await main.count()) === 0) {
      test.skip(true, '#main-content not found');
      return;
    }
    await expect(main).not.toHaveAttribute('inert');
    const menuToggle = page.getByRole('button', {
      name: /Open menu|Abrir menú|Abrir menu/i,
    });
    await expect(async () => {
      await menuToggle.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }).toPass({ timeout: 15_000 });
    await expect(main).toHaveAttribute('inert', '');
    await page.keyboard.press('Escape');
    await expect(main).not.toHaveAttribute('inert');
  });

  test('reduced-motion: page loads and hero CTA is visible', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#main-content, main').first()).toBeVisible({ timeout: 20_000 });
    const cta = page.getByRole('link', { name: /contact|contacto|let's talk|hablemos/i }).first();
    if ((await cta.count()) === 0) {
      test.skip(true, 'hero CTA link not found');
      return;
    }
    await expect(cta).toBeVisible({ timeout: 20_000 });
  });

  test('skip-to-content focuses main', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: /Skip to main content|Saltar/i });
    await expect(skip).toBeFocused();
    await skip.press('Enter');
    await expect(page.locator('#main-content')).toBeFocused();
  });

  test('availability banner CTA targets contact when present', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const banner = page.getByRole('region', { name: /Availability|Disponibilidad/i });
    if ((await banner.count()) === 0) {
      test.skip();
      return;
    }
    await expect(banner).toBeVisible();
    await banner.getByRole('link').first().click();
    await expect(page).toHaveURL(/#contact/);
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await expect(page.locator('#contact')).toBeVisible();
  });
});
