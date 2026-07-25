import { describe, expect, it } from 'vitest';
import seoConfig from '../../app/config/seo.config';

describe('seo.config', () => {
  it('points SEO identity at the production site', () => {
    expect(seoConfig.seo.siteUrl).toBe('https://cesargomez.dev');
    expect(seoConfig.seo.name).toContain('César');
    expect(seoConfig.seo.ogImage).toMatch(/^\//);
  });

  it('keeps social card metadata complete', () => {
    expect(seoConfig.seo.twitterCard).toBe('summary_large_image');
    expect(seoConfig.seo.twitterCreator).toMatch(/^@/);
    expect(seoConfig.seo.ogImageAlt.length).toBeGreaterThan(10);
  });
});
