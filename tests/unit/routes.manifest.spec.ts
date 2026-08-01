import { describe, expect, it } from 'vitest';
import {
  PORTFOLIO_ROUTES,
  SITEMAP_PRERENDER_ROUTES,
  hireProfileRoutes,
  prerenderRoutes,
  sitemapUrls,
} from '../../app/config/routes.manifest';

describe('routes.manifest', () => {
  it('lists eight indexable page families', () => {
    expect(PORTFOLIO_ROUTES).toHaveLength(8);
  });

  it('keeps the AI landing URL slug unchanged', () => {
    const ai = PORTFOLIO_ROUTES.find((route) => route.id === 'ai');
    expect(ai?.paths.en).toBe('/ai-engineer/');
    expect(ai?.paths.es).toBe('/es/ingeniero-ia/');
  });

  it('emits trailing-slash prerender and sitemap URLs', () => {
    const routes = prerenderRoutes();
    expect(routes).toContain('/');
    expect(routes).toContain('/es/');
    expect(routes).toContain('/ai-engineer/');
    expect(routes).toContain('/case-studies/colegium/');
    expect(routes).toContain('/web-developer-cartagena/');
    expect(routes).toContain('/ai-assisted-craft/');
    expect(routes).toContain('/sitemap_index.xml');
    expect(sitemapUrls()).toEqual(
      expect.arrayContaining([
        '/',
        '/ai-engineer/',
        '/case-studies/colegium/',
        '/web-developer-cartagena/',
        '/ai-assisted-craft/',
      ]),
    );
    expect(sitemapUrls()).not.toContain('/sitemap_index.xml');
  });

  it('includes all sitemap XML prerender endpoints', () => {
    const routes = prerenderRoutes();
    for (const path of SITEMAP_PRERENDER_ROUTES) {
      expect(routes).toContain(path);
    }
  });

  it('exposes three hire profiles', () => {
    expect(
      hireProfileRoutes()
        .map((r) => r.id)
        .sort(),
    ).toEqual(['ai', 'node', 'vue']);
  });
});
