import { expect, test } from '@playwright/test';

test.describe('hero conversion hierarchy', () => {
  test('desktop: H1, spaced name, single differentiator, CTA before proof section', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const hero = page.locator('#hero');
    await expect(hero).toBeVisible();

    const h1 = hero.locator('h1');
    await expect(h1).toContainText(/Senior Vue\/Nuxt Developer/i);

    const nameText = (await h1.innerText()).replace(/\s+/g, ' ');
    expect(nameText).toMatch(/César Gómez|Cesar Gomez|CESAR GOMEZ/i);
    expect(nameText).not.toMatch(/CESARGOMEZ/);

    // Differentiator should not repeat the full H1 role phrase.
    const differentiator = hero.getByText(/AI-Assisted Craft/i).first();
    await expect(differentiator).toBeVisible();
    await expect(hero.getByText(/Senior Vue\/Nuxt · AI-Assisted Craft/i)).toHaveCount(0);

    const cta = hero.getByRole('link', { name: /Get in Touch|Contáctame|Contacto/i }).first();
    await expect(cta).toBeVisible();

    const photo = hero.locator('img[src*="me.jpg"], img[alt*="César"], img[alt*="Cesar"]').first();
    await expect(photo).toBeVisible();

    // Case studies proof sits immediately after hero on home.
    const caseStudies = page.locator('#case-studies');
    await expect(caseStudies).toBeVisible();
    const aboutBox = await page.locator('#about').boundingBox();
    const caseBox = await caseStudies.boundingBox();
    expect(caseBox?.y ?? 0).toBeLessThan(aboutBox?.y ?? Number.POSITIVE_INFINITY);
  });

  test('mobile 390: CTA appears before photo; no stuck name', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const hero = page.locator('#hero');
    const h1Box = await hero.locator('h1').boundingBox();
    const ctaBox = await hero
      .getByRole('link', { name: /Get in Touch|Contáctame|Contacto/i })
      .first()
      .boundingBox();
    const photoBox = await hero
      .locator('img[src*="me.jpg"], img[alt*="César"], img[alt*="Cesar"]')
      .first()
      .boundingBox();

    expect(h1Box && ctaBox && photoBox).toBeTruthy();
    expect(ctaBox!.y).toBeGreaterThan(h1Box!.y);
    expect(photoBox!.y).toBeGreaterThan(ctaBox!.y);

    const nameText = (await hero.locator('h1').innerText()).replace(/\s+/g, ' ');
    expect(nameText).toMatch(/César\s+Gómez|Cesar\s+Gomez|CESAR\s+GOMEZ/i);
  });
});
