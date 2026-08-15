import { describe, expect, it } from 'vitest';
import { PORTFOLIO_ROUTES, prerenderRoutes, sitemapUrls } from '../../app/config/routes.manifest';
import {
  PERSON_SCHEMA_ID,
  buildHreflangAlternateLinks,
  personSchemaRef,
} from '../../app/utils/seo';
import { absoluteSiteUrl } from '../../app/utils/siteUrl';

describe('schema + sitemap regressions', () => {
  it('keeps a single stable Person @id for all pages', () => {
    expect(PERSON_SCHEMA_ID).toBe('https://cesargomez.dev/#person');
    expect(personSchemaRef()).toEqual({ '@id': PERSON_SCHEMA_ID });
  });

  it('includes every indexable EN/ES path in prerender and sitemap lists', () => {
    const prerender = new Set(prerenderRoutes());
    const sitemap = new Set(sitemapUrls());

    for (const route of PORTFOLIO_ROUTES) {
      expect(prerender.has(route.paths.en), route.paths.en).toBe(true);
      expect(prerender.has(route.paths.es), route.paths.es).toBe(true);
      expect(sitemap.has(route.paths.en), route.paths.en).toBe(true);
      expect(sitemap.has(route.paths.es), route.paths.es).toBe(true);
      expect(route.paths.en.endsWith('/') || route.paths.en === '/').toBe(true);
      expect(route.paths.es.endsWith('/')).toBe(true);
    }
  });

  it('builds reciprocal hreflang pairs for each route', () => {
    for (const route of PORTFOLIO_ROUTES) {
      const en = absoluteSiteUrl(route.paths.en === '/' ? '/' : route.paths.en);
      const es = absoluteSiteUrl(route.paths.es);
      const links = buildHreflangAlternateLinks({ en, es });
      expect(links).toHaveLength(3);
      expect(links.map((l) => l.hreflang).sort()).toEqual(['en', 'es-CO', 'x-default'].sort());
      expect(links.find((l) => l.hreflang === 'x-default')?.href).toBe(en);
    }
  });

  it('maintains canonical AI-Assisted Craft landing route', () => {
    const ai = PORTFOLIO_ROUTES.find((r) => r.id === 'ai');
    expect(ai?.paths.en).toBe('/ai-assisted-craft/');
    expect(ai?.paths.es).toBe('/es/craft-asistido-ia/');
    expect(ai?.localePath).toBe('/ai-assisted-craft');
  });
});
