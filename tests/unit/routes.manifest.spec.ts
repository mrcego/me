import { describe, expect, it } from 'vitest';
import {
  PORTFOLIO_ROUTES,
  SITEMAP_PRERENDER_ROUTES,
  hireProfileRoutes,
  prerenderRoutes,
  sitemapUrls,
} from '../../app/config/routes.manifest';

describe('routes.manifest', () => {
  it('lists thirteen indexable page families', () => {
    expect(PORTFOLIO_ROUTES).toHaveLength(13);
  });

  it('defines canonical AI-Assisted Craft landing URL slug', () => {
    const ai = PORTFOLIO_ROUTES.find((route) => route.id === 'ai');
    expect(ai?.paths.en).toBe('/ai-assisted-craft/');
    expect(ai?.paths.es).toBe('/es/craft-asistido-ia/');
  });

  it('emits trailing-slash prerender and sitemap URLs', () => {
    const routes = prerenderRoutes();
    expect(routes).toContain('/');
    expect(routes).toContain('/es/');
    expect(routes).toContain('/ai-assisted-craft/');
    expect(routes).toContain('/case-studies/colegium/');
    expect(routes).toContain('/web-developer-cartagena/');
    expect(routes).toContain('/vue-developer-colombia/');
    expect(routes).toContain('/angular-developer/');
    expect(routes).toContain('/frontend-architect/');
    expect(routes).toContain('/fullstack-engineer/');
    expect(routes).toContain('/sitemap_index.xml');
    expect(sitemapUrls()).toEqual(
      expect.arrayContaining([
        '/',
        '/ai-assisted-craft/',
        '/case-studies/colegium/',
        '/web-developer-cartagena/',
        '/vue-developer-colombia/',
        '/angular-developer/',
        '/frontend-architect/',
        '/fullstack-engineer/',
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

  it('exposes six hire profiles', () => {
    expect(
      hireProfileRoutes()
        .map((r) => r.id)
        .sort(),
    ).toEqual(['ai', 'angular', 'architect', 'fullstack', 'node', 'vue']);
  });
});
