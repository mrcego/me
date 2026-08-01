import { describe, expect, it } from 'vitest';
import seoConfig, {
  PERSON_ENTITY_URL,
  PERSON_KNOWS_ABOUT,
  PERSON_SCHEMA_ID,
  SEO_EDITORIAL_DATES,
  SEO_HREFLANG,
  SEO_IDENTITY,
  WEBSITE_SCHEMA_ID,
} from '../../app/config/seo.config';

describe('seo.config', () => {
  it('points SEO identity at the production site', () => {
    expect(seoConfig.seo.siteUrl).toBe('https://cesargomez.dev');
    expect(seoConfig.seo.name).toContain('César');
    expect(seoConfig.seo.ogImage).toMatch(/^\//);
    expect(SEO_IDENTITY.siteUrl).toBe(seoConfig.seo.siteUrl);
  });

  it('keeps social card metadata complete', () => {
    expect(seoConfig.seo.twitterCard).toBe('summary_large_image');
    expect(seoConfig.seo.twitterCreator).toMatch(/^@/);
    expect(seoConfig.seo.ogImageAlt.length).toBeGreaterThan(10);
  });

  it('exposes a stable Person entity id and home entity URL', () => {
    expect(PERSON_SCHEMA_ID).toBe('https://cesargomez.dev/#person');
    expect(PERSON_ENTITY_URL).toBe('https://cesargomez.dev/');
    expect(WEBSITE_SCHEMA_ID).toBe('https://cesargomez.dev/#website');
    expect(seoConfig.seo.personId).toBe(PERSON_SCHEMA_ID);
    expect(seoConfig.seo.personUrl).toBe(PERSON_ENTITY_URL);
  });

  it('uses region-qualified hreflang codes', () => {
    expect(SEO_HREFLANG.en).toBe('en-US');
    expect(SEO_HREFLANG.es).toBe('es-ES');
    expect(SEO_HREFLANG.xDefault).toBe('x-default');
    expect(seoConfig.seo.hreflang).toEqual(SEO_HREFLANG);
  });

  it('centralizes editorial ProfilePage dates as ISO DateTime', () => {
    expect(SEO_EDITORIAL_DATES.profileCreated).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(SEO_EDITORIAL_DATES.lastModified).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(seoConfig.seo.editorial.lastModified).toBe(SEO_EDITORIAL_DATES.lastModified);
  });

  it('keeps compact knowsAbout topical terms (not oversized keyword dumps)', () => {
    expect(PERSON_KNOWS_ABOUT.length).toBeGreaterThan(10);
    expect(PERSON_KNOWS_ABOUT.length).toBeLessThan(40);
    expect(PERSON_KNOWS_ABOUT).toContain('Vue.js');
    expect(seoConfig.seo.knowsAbout).toEqual(PERSON_KNOWS_ABOUT);
  });
});
