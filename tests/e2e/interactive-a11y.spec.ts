import { expect, test } from '@playwright/test';

async function waitForHydratedNav(page: import('@playwright/test').Page) {
  // ClientOnly fallback renders a disabled twin — wait for the enabled control.
  const themeBtn = page.getByRole('button', { name: /Theme Presets|Temas IDE/i });
  await expect(themeBtn).toBeVisible({ timeout: 20_000 });
  await expect(themeBtn).toBeEnabled({ timeout: 20_000 });
}

test.describe('interactive accessibility', () => {
  test('actionable buttons expose pointer cursor; disabled uses not-allowed', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await waitForHydratedNav(page);

    const themeBtn = page.getByRole('button', { name: /Theme Presets|Temas IDE/i }).first();
    await expect(themeBtn).toHaveCSS('cursor', 'pointer');

    const languageBtn = page.getByRole('button', { name: /Switch language|Cambiar idioma/i });
    await expect(languageBtn).toHaveCSS('cursor', 'pointer');

    await page.locator('#contact').scrollIntoViewIfNeeded();
    const submit = page.locator('#contact button[type="submit"], #contact .p-button').first();
    await expect(submit).toBeVisible({ timeout: 20_000 });
    const disabled = await submit.isDisabled();
    if (disabled) {
      await expect(submit).toHaveCSS('cursor', 'not-allowed');
    }
  });

  test('capabilities cards and footer brand are not false pointer controls', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.locator('#capabilities').scrollIntoViewIfNeeded();
    const card = page.locator('#capabilities .surface-card').first();
    await expect(card).toBeVisible({ timeout: 20_000 });
    await expect(card).not.toHaveClass(/cursor-pointer/);

    const footerBrand = page.locator('footer .group').first();
    await expect(footerBrand).toBeVisible();
    await expect(footerBrand).not.toHaveClass(/cursor-pointer/);
  });

  test('hire menu: Escape restores focus to trigger', async ({ page }) => {
    await page.setViewportSize({ width: 1536, height: 800 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await waitForHydratedNav(page);

    const hire = page.getByRole('button', { name: /Hire — Hiring profiles|Contratar —/i });
    await expect(async () => {
      await hire.click();
      await expect(page.locator('#hire-profile-menu')).toBeVisible();
    }).toPass({ timeout: 15_000 });
    await page.keyboard.press('Escape');
    await expect(page.locator('#hire-profile-menu')).toBeHidden({ timeout: 10_000 });
    await expect(hire).toBeFocused();
  });

  test('hire menu: arrow keys move focus between menuitems', async ({ page }) => {
    await page.setViewportSize({ width: 1536, height: 800 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await waitForHydratedNav(page);

    const hire = page.getByRole('button', { name: /Hire — Hiring profiles|Contratar —/i });
    await hire.focus();
    await expect(async () => {
      await page.keyboard.press('ArrowDown');
      await expect(page.locator('#hire-profile-menu')).toBeVisible();
    }).toPass({ timeout: 15_000 });

    const items = page.locator('#hire-profile-menu [role="menuitem"]');
    await expect(items.first()).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(items.nth(1)).toBeFocused();
  });

  test('role and vibe dialogs expose accessible names', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await waitForHydratedNav(page);

    const vibeOpen = page.getByRole('button', { name: /Open AI workflow details/i }).first();
    await expect(vibeOpen).toBeVisible({ timeout: 20_000 });
    await expect(async () => {
      await vibeOpen.click({ force: true });
      await expect(page.locator('#vibe-coding-modal-title')).toBeVisible();
    }).toPass({ timeout: 20_000 });
    const vibeDialog = page.locator('.p-dialog.experience-dialog').first();
    await expect(vibeDialog).toHaveAttribute('aria-labelledby', 'vibe-coding-modal-title');
    await page
      .getByRole('button', { name: /close|cerrar/i })
      .first()
      .click({ force: true });
    await expect(page.locator('#vibe-coding-modal-title')).toBeHidden({ timeout: 10_000 });

    await page.locator('#about').scrollIntoViewIfNeeded();
    const roleOpen = page.locator('#about button[aria-haspopup="dialog"]').first();
    await expect(roleOpen).toBeVisible({ timeout: 20_000 });
    await expect(async () => {
      await roleOpen.click({ force: true });
      await expect(page.locator('#role-experience-modal-title')).toBeVisible();
    }).toPass({ timeout: 20_000 });
    const roleDialog = page.locator('.p-dialog.experience-dialog').first();
    await expect(roleDialog).toHaveAttribute('aria-labelledby', 'role-experience-modal-title');
  });

  test('cert row toggle updates aria-expanded via keyboard', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.locator('#certifications').scrollIntoViewIfNeeded();
    const toggle = page.locator('#certifications button[aria-controls^="cert-panel"]').first();
    await expect(toggle).toBeVisible({ timeout: 20_000 });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    // Certifications is hydrate-on-visible: SSR markup is clickable-looking before Vue attaches.
    // Retry Enter until the island is live so CI doesn't flake on slow Lazy hydration.
    await expect(async () => {
      if ((await toggle.getAttribute('aria-expanded')) !== 'true') {
        await toggle.focus();
        await toggle.press('Enter');
      }
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    }).toPass({ timeout: 20_000 });
  });

  test('icon-only social controls have accessible names and 44px targets', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const linkedin = page.getByRole('link', { name: /LinkedIn/i }).first();
    const github = page.getByRole('link', { name: /GitHub/i }).first();
    const email = page.getByRole('link', { name: /Email|Escribir/i }).first();

    for (const control of [linkedin, github, email]) {
      await expect(control).toBeVisible({ timeout: 15_000 });
      const box = await control.boundingBox();
      expect(box).toBeTruthy();
      expect(Math.round(box!.width)).toBeGreaterThanOrEqual(44);
      expect(Math.round(box!.height)).toBeGreaterThanOrEqual(44);
    }
  });
});
