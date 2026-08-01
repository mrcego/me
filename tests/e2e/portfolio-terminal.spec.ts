import { expect, test } from '@playwright/test';

const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
] as const;

async function waitForAppHydrated(page: import('@playwright/test').Page) {
  const themeBtn = page.getByRole('button', { name: /Theme Presets|Temas IDE/i });
  await expect(themeBtn).toBeVisible({ timeout: 20_000 });
  await expect(themeBtn).toBeEnabled({ timeout: 20_000 });
  // Ensure keyboard focus is not trapped in a control that swallows `/`.
  await page.locator('body').click({ position: { x: 8, y: 8 }, force: true });
}

async function unlockTerminal(page: import('@playwright/test').Page) {
  await expect(async () => {
    await page.keyboard.press('/');
    await expect(page.locator('.konami-gate')).toBeVisible({ timeout: 1_500 });
  }).toPass({ timeout: 8_000 });
  await expect(page.locator('.konami-gate__rail .konami-keycap')).toHaveCount(0);
  for (const key of KONAMI) {
    await page.keyboard.press(key);
  }
  await expect(page.locator('dialog.portfolio-terminal[open]')).toBeVisible({
    timeout: 5_000,
  });
}

test.describe('portfolio terminal', () => {
  test('is absent before unlock and reveals keycaps only on correct presses', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await waitForAppHydrated(page);
    await expect(page.locator('dialog.portfolio-terminal')).toHaveCount(0);

    await page.keyboard.press('/');
    await expect(page.locator('.konami-gate')).toBeVisible();
    await expect(page.locator('.konami-keycap')).toHaveCount(0);

    await page.keyboard.press('ArrowUp');
    await expect(page.locator('.konami-keycap')).toHaveCount(1);
    await expect(page.locator('.konami-keycap').first()).toContainText('↑');

    await page.keyboard.press('ArrowDown'); // wrong — second should be ↑
    await expect(
      page.locator('.konami-gate__rail--burning, .konami-keycap--burn').first(),
    ).toBeVisible({
      timeout: 3_000,
    });
    await expect(page.locator('dialog.portfolio-terminal')).toHaveCount(0);
    await expect(page.locator('.konami-gate')).toBeHidden({ timeout: 3_000 });
  });

  test('announces gate status outside its decorative aria-hidden overlay', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await waitForAppHydrated(page);

    await page.keyboard.press('/');

    await expect(page.locator('.konami-gate[aria-hidden="true"] [aria-live]')).toHaveCount(0);
    await expect(page.locator('[data-terminal-gate-announcement]')).toContainText(
      /Flight path|Ruta de vuelo/i,
    );
  });

  test('renders Flight Deck route ticks only as inputs are accepted', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await waitForAppHydrated(page);

    await page.keyboard.press('/');
    await expect(page.locator('.konami-gate__route')).toBeVisible();
    await expect(page.locator('.konami-gate__ticks .konami-gate__tick')).toHaveCount(10);
    await expect(page.locator('.konami-gate__tick--filled')).toHaveCount(0);

    await page.keyboard.press('ArrowUp');
    await expect(page.locator('.konami-gate__tick--filled')).toHaveCount(1);
    await expect(page.locator('.konami-gate__rail .konami-keycap')).toHaveCount(1);
  });

  test('opens from home, focuses input, locks scroll, and restores focus', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await waitForAppHydrated(page);
    const restoreTarget = page
      .getByRole('link', { name: /Get in Touch|Hablemos|Contact/i })
      .first();
    await restoreTarget.focus();

    await unlockTerminal(page);
    const dialog = page.locator('dialog.portfolio-terminal');
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await expect(page.locator('#portfolio-terminal-input')).toBeFocused();
    await expect(page.locator('#__nuxt')).toHaveAttribute('inert', '');

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden({ timeout: 5_000 });
    await expect(restoreTarget).toBeFocused();
  });

  test('renders Flight Deck chrome without changing prompt focus', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await waitForAppHydrated(page);
    await unlockTerminal(page);

    await expect(page.locator('.portfolio-terminal__flight-frame')).toBeVisible();
    await expect(page.locator('.portfolio-terminal__prompt-route')).toBeVisible();
    await expect(page.locator('#portfolio-terminal-input')).toBeFocused();
  });

  test('runs help, theme, clear, exit and Spanish alias', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await waitForAppHydrated(page);
    await unlockTerminal(page);
    const input = page.locator('#portfolio-terminal-input');

    await input.fill('help');
    await input.press('Enter');
    await expect(page.locator('.portfolio-terminal__line--output').first()).toContainText(
      /Available commands|Comandos disponibles/i,
    );

    await input.fill('theme show');
    await input.press('Enter');
    await expect(page.locator('.portfolio-terminal__line--output').last()).toContainText(
      /Active theme|Tema activo/i,
    );

    await input.fill('clear');
    await input.press('Enter');
    await expect(page.locator('.portfolio-terminal__line--system').last()).toContainText(
      /cleared|limpiada/i,
    );

    await input.fill('salir');
    await input.press('Enter');
    await expect(page.locator('dialog.portfolio-terminal')).toBeHidden({ timeout: 5_000 });
  });

  test('autocomplete suggests commands and Escape closes layers', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await waitForAppHydrated(page);
    await unlockTerminal(page);
    const input = page.locator('#portfolio-terminal-input');
    await input.fill('he');
    await expect(page.locator('#portfolio-terminal-suggestions')).toBeVisible();
    await input.press('Tab');
    await expect(input).toHaveValue(/help\s*/);
    await input.fill('hel');
    await expect(page.locator('#portfolio-terminal-suggestions')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#portfolio-terminal-suggestions')).toBeHidden();
    await page.keyboard.press('Escape');
    await expect(page.locator('dialog.portfolio-terminal')).toBeHidden({ timeout: 5_000 });
  });
});
