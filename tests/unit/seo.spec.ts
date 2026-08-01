import { describe, expect, it } from 'vitest';
import {
  PERSON_ENTITY_URL,
  PERSON_SCHEMA_ID,
  SEO_EDITORIAL_DATES,
  SEO_HREFLANG,
  WEBSITE_SCHEMA_ID,
  buildHreflangAlternateLinks,
  htmlLangForLocale,
  ogLocaleForLocale,
  personSchemaRef,
  websiteSchemaRef,
} from '../../app/utils/seo';
import { absoluteSiteUrl } from '../../app/utils/siteUrl';

describe('seo helpers', () => {
  it('builds en-US / es-ES / x-default hreflang alternates', () => {
    const en = absoluteSiteUrl('/');
    const es = absoluteSiteUrl('/es/');
    const links = buildHreflangAlternateLinks({ en, es });

    expect(links).toEqual([
      { rel: 'alternate', hreflang: 'en-US', href: en },
      { rel: 'alternate', hreflang: 'es-ES', href: es },
      { rel: 'alternate', hreflang: 'x-default', href: en },
    ]);
    expect(links.every((l) => l.hreflang !== 'en' && l.hreflang !== 'es')).toBe(true);
  });

  it('builds landing hreflang with x-default on the English URL', () => {
    const en = absoluteSiteUrl('/ai-engineer');
    const es = absoluteSiteUrl('/es/ingeniero-ia');
    const links = buildHreflangAlternateLinks({ en, es });

    expect(links[0]).toMatchObject({ hreflang: SEO_HREFLANG.en, href: en });
    expect(links[1]).toMatchObject({ hreflang: SEO_HREFLANG.es, href: es });
    expect(links[2]).toMatchObject({ hreflang: SEO_HREFLANG.xDefault, href: en });
  });

  it('keeps Person schema id and entity URL stable (not locale-dependent)', () => {
    expect(PERSON_SCHEMA_ID).toBe('https://cesargomez.dev/#person');
    expect(PERSON_ENTITY_URL).toBe('https://cesargomez.dev/');
    expect(personSchemaRef()).toEqual({ '@id': PERSON_SCHEMA_ID });
    expect(personSchemaRef()).toEqual({ '@id': 'https://cesargomez.dev/#person' });
  });

  it('references WebSite by stable @id', () => {
    expect(websiteSchemaRef()).toEqual({ '@id': WEBSITE_SCHEMA_ID });
  });

  it('maps app locale codes to HTML / OG locale tags', () => {
    expect(htmlLangForLocale('en')).toBe('en-US');
    expect(htmlLangForLocale('es')).toBe('es-ES');
    expect(ogLocaleForLocale('en')).toBe('en_US');
    expect(ogLocaleForLocale('es')).toBe('es_ES');
  });

  it('exposes editorial lastModified for ProfilePage dateModified wiring', () => {
    expect(SEO_EDITORIAL_DATES.lastModified).toBeTruthy();
    expect(Date.parse(SEO_EDITORIAL_DATES.lastModified)).not.toBeNaN();
  });
});
