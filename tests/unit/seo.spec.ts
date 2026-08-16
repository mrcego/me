import { describe, expect, it } from 'vitest';
import {
  PERSON_ENTITY_URL,
  PERSON_SCHEMA_ID,
  SEO_EDITORIAL_DATES,
  SEO_HREFLANG,
  WEBSITE_SCHEMA_ID,
  buildHreflangAlternateLinks,
  buildPersonEntity,
  buildWebSiteEntity,
  htmlLangForLocale,
  ogLocaleForLocale,
  personSchemaRef,
  websiteSchemaRef,
} from '../../app/utils/seo';
import { absoluteSiteUrl } from '../../app/utils/siteUrl';

describe('seo helpers', () => {
  it('builds en / es-CO / x-default hreflang alternates', () => {
    const en = absoluteSiteUrl('/');
    const es = absoluteSiteUrl('/es/');
    const links = buildHreflangAlternateLinks({ en, es });

    expect(links).toEqual([
      { rel: 'alternate', hreflang: 'en', href: en },
      { rel: 'alternate', hreflang: 'es-CO', href: es },
      { rel: 'alternate', hreflang: 'x-default', href: en },
    ]);
  });

  it('builds landing hreflang with x-default on the English URL', () => {
    const en = absoluteSiteUrl('/ai-assisted-craft');
    const es = absoluteSiteUrl('/es/craft-asistido-ia');
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

  it('builds canonical Person entity for standalone subpages', () => {
    const personEs = buildPersonEntity({ locale: 'es' });
    expect(personEs['@type']).toBe('Person');
    expect(personEs['@id']).toBe(PERSON_SCHEMA_ID);
    expect(personEs.name).toBe('César Gómez');

    const personEn = buildPersonEntity({ locale: 'en' });
    expect(personEn['@type']).toBe('Person');
    expect(personEn['@id']).toBe(PERSON_SCHEMA_ID);
    expect(personEn.name).toBe('Cesar Gomez');
  });

  it('builds canonical WebSite entity for standalone subpages', () => {
    const site = buildWebSiteEntity({ locale: 'es' });
    expect(site['@type']).toBe('WebSite');
    expect(site['@id']).toBe(WEBSITE_SCHEMA_ID);
    expect(site.url).toBe(PERSON_ENTITY_URL);
  });

  it('maps app locale codes to HTML / OG locale tags', () => {
    expect(htmlLangForLocale('en')).toBe('en');
    expect(htmlLangForLocale('es')).toBe('es-CO');
    expect(ogLocaleForLocale('en')).toBe('en_US');
    expect(ogLocaleForLocale('es')).toBe('es_CO');
  });

  it('exposes editorial lastModified for ProfilePage dateModified wiring', () => {
    expect(SEO_EDITORIAL_DATES.lastModified).toBeTruthy();
    expect(Date.parse(SEO_EDITORIAL_DATES.lastModified)).not.toBeNaN();
  });
});
