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
    await expect(h1).toContainText(/Senior Vue\/Nuxt & Fullstack Engineer/i);

    const nameText = (await h1.innerText()).replace(/\s+/g, ' ');
    expect(nameText).toMatch(/César Gómez|Cesar Gomez|CESAR GOMEZ/i);
    expect(nameText).not.toMatch(/CESARGOMEZ/);

    const description = hero.getByText(/I help product teams build and scale/i).first();
    await expect(description).toBeVisible();
    await expect(hero.getByText(/Senior Vue\/Nuxt · AI-Assisted Craft/i)).toHaveCount(0);

    const cta = hero
      .getByRole('link', {
        name: /Discuss a Vue\/Nuxt engagement|Hablar sobre un proyecto Vue\/Nuxt/i,
      })
      .first();
    await expect(cta).toBeVisible();

    const photo = hero.locator('img[src*="me.jpg"], img[alt*="César"], img[alt*="Cesar"]').first();
    await expect(photo).toBeVisible();

    // Case studies proof sits under about on home.
    const caseStudies = page.locator('#case-studies');
    await expect(caseStudies).toBeVisible();
    const aboutBox = await page.locator('#about').boundingBox();
    const caseBox = await caseStudies.boundingBox();
    expect(aboutBox?.y ?? 0).toBeLessThan(caseBox?.y ?? Number.POSITIVE_INFINITY);
  });

  test('mobile 390: CTA appears before photo; no stuck name', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const hero = page.locator('#hero');
    const h1Box = await hero.locator('h1').boundingBox();
    const ctaBox = await hero
      .getByRole('link', {
        name: /Discuss a Vue\/Nuxt engagement|Hablar sobre un proyecto Vue\/Nuxt/i,
      })
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

  test('case-study CTAs include their destination in the accessible name', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const caseStudies = page.locator('#case-studies');
    await expect(
      caseStudies.getByRole('link', {
        name: /Read case study: Cloud platforms for 100k\+ students/i,
      }),
    ).toBeVisible();
    await expect(
      caseStudies.getByRole('link', {
        name: /Read case study: Speech-first language learning product/i,
      }),
    ).toBeVisible();
  });
});
