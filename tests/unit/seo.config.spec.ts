import { describe, expect, it } from 'vitest';
import seoConfig, {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_WHATSAPP,
  CONTACT_WHATSAPP_DISPLAY,
  CONTACT_WHATSAPP_USERNAME,
  PERSON_ENTITY_URL,
  PERSON_KNOWS_ABOUT,
  PERSON_SCHEMA_ID,
  SEO_EDITORIAL_DATES,
  SEO_HREFLANG,
  SEO_IDENTITY,
  SITE_NAME,
  SITE_NAME_ALTERNATES,
  WEBSITE_SCHEMA_ID,
} from '../../app/config/seo.config';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const localesDir = join(dirname(fileURLToPath(import.meta.url)), '../../i18n/locales');
const enSeoDescription = (
  JSON.parse(readFileSync(join(localesDir, 'en.json'), 'utf8')) as {
    seo: { description: string };
  }
).seo.description;
const esSeoDescription = (
  JSON.parse(readFileSync(join(localesDir, 'es.json'), 'utf8')) as {
    seo: { description: string };
  }
).seo.description;

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
    expect(SEO_HREFLANG.en).toBe('en');
    expect(SEO_HREFLANG.es).toBe('es-CO');
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

  it('defines a single Google SERP site name with domain alternate', () => {
    expect(SITE_NAME).toBe('César Gómez');
    expect(SITE_NAME_ALTERNATES).toContain('cesargomez.dev');
    expect(SITE_NAME_ALTERNATES).toContain('Cesar Gomez');
  });

  it('exposes contact whatsapp handle and direct click-to-chat url', () => {
    expect(CONTACT_WHATSAPP_USERNAME).toBe('mrcego.fsdev');
    expect(CONTACT_WHATSAPP_DISPLAY).toBe('@mrcego.fsdev');
    expect(CONTACT_PHONE_WHATSAPP).toBe('https://wa.me/573332636550');
    expect(CONTACT_PHONE_DISPLAY).toBe('@mrcego.fsdev');
  });

  it('keeps home meta descriptions within the 300-character scanner budget', () => {
    expect(enSeoDescription.length).toBeLessThanOrEqual(300);
    expect(esSeoDescription.length).toBeLessThanOrEqual(300);
  });
});
