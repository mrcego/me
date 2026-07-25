import { expect, test, type Page } from '@playwright/test';

async function openContact(page: Page) {
  await page.goto('/#contact', { waitUntil: 'domcontentloaded' });
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(page.locator('#contact-name')).toBeVisible({ timeout: 25_000 });
}

async function fillValidForm(page: Page) {
  await page.locator('#contact-name').fill('Cesar Gomez');
  await page.locator('#contact-email').fill('cesar@example.com');
  await page.locator('#contact-subject').fill('Portfolio hello');
  await page.locator('#contact-message').fill('Testing the contact form from Playwright.');
}

test.describe('contact form', () => {
  test('shows field errors on empty submit (bad path)', async ({ page }) => {
    await openContact(page);
    const submit = page.getByRole('button', { name: /Initiate Secure Link|Enviar|Send/i });
    // LazyContactSection hydrates on-visible — retry until handlers attach
    await expect(async () => {
      await submit.click();
      await expect(page.locator('#name-error')).toBeVisible();
    }).toPass({ timeout: 20_000 });
    await expect(page.locator('#email-error')).toBeVisible();
    await expect(page.locator('#subject-error')).toBeVisible();
    await expect(page.locator('#message-error')).toBeVisible();
  });

  test('shows email invalid error for malformed email (bad path)', async ({ page }) => {
    await openContact(page);
    await page.locator('#contact-name').fill('Cesar');
    await page.locator('#contact-email').fill('not-an-email');
    await page.locator('#contact-subject').fill('Hi there');
    await page.locator('#contact-message').fill('This message is long enough.');
    await page.getByRole('button', { name: /Initiate Secure Link|Enviar|Send/i }).click();
    await expect(page.locator('#email-error')).toBeVisible();
  });

  test('rejects too-short message even with other fields valid (bad path)', async ({ page }) => {
    await openContact(page);
    await page.locator('#contact-name').fill('Cesar Gomez');
    await page.locator('#contact-email').fill('cesar@example.com');
    await page.locator('#contact-subject').fill('Hello there');
    await page.locator('#contact-message').fill('Too short');
    await page.getByRole('button', { name: /Initiate Secure Link|Enviar|Send/i }).click();
    await expect(page.locator('#message-error')).toBeVisible();
  });

  test('submits successfully when Netlify accepts the post (happy path)', async ({ page }) => {
    await page.route('**/netlify-forms.html', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({ status: 200, body: 'ok' });
        return;
      }
      await route.continue();
    });

    await openContact(page);
    const submit = page.getByRole('button', { name: /Initiate Secure Link|Enviar|Send/i });
    await expect(async () => {
      await fillValidForm(page);
      await submit.click();
      await expect(page.getByRole('status')).toBeVisible();
    }).toPass({ timeout: 25_000 });
    await expect(page.locator('#contact-name')).toHaveValue('');
  });

  test('surfaces server failure when Netlify returns 500 (bad path)', async ({ page }) => {
    let netlifyPosted = false;
    await page.route('**/netlify-forms.html', async (route) => {
      if (route.request().method() === 'POST') {
        netlifyPosted = true;
        await route.fulfill({ status: 500, body: 'fail' });
        return;
      }
      await route.continue();
    });

    await openContact(page);
    const submit = page.getByRole('button', { name: /Initiate Secure Link|Enviar|Send/i });
    await expect(async () => {
      await fillValidForm(page);
      await submit.click();
      expect(netlifyPosted, 'Netlify POST must fire under contactProvider=netlify').toBe(true);
      await expect(page.getByRole('alert')).toBeVisible();
    }).toPass({ timeout: 25_000 });
    await expect(page.locator('#contact-name')).toHaveValue('Cesar Gomez');
  });

  test('exposes contact method links', async ({ page }) => {
    await openContact(page);
    await expect(page.locator('a[href^="mailto:cesargomezh90"]').first()).toBeVisible();
    await expect(page.locator('a[href*="linkedin.com/in/mrcego"]').first()).toBeVisible();
    await expect(page.locator('a[href*="github.com/mrcego"]').first()).toBeVisible();
    await expect(page.locator('a[href*="wa.me/"]').first()).toBeVisible();
  });
});
