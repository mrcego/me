import { describe, expect, it } from 'vitest';
import { SITE_ORIGIN, absoluteSiteUrl, withTrailingSlash } from '../../app/utils/siteUrl';

describe('siteUrl', () => {
  it('normalizes paths with a trailing slash', () => {
    expect(withTrailingSlash('/')).toBe('/');
    expect(withTrailingSlash('/es')).toBe('/es/');
    expect(withTrailingSlash('/es/')).toBe('/es/');
    expect(withTrailingSlash('vue-frontend-developer')).toBe('/vue-frontend-developer/');
  });

  it('builds absolute URLs that match Netlify directory pages', () => {
    expect(absoluteSiteUrl('/')).toBe(`${SITE_ORIGIN}/`);
    expect(absoluteSiteUrl('/es')).toBe(`${SITE_ORIGIN}/es/`);
    expect(absoluteSiteUrl('/vue-frontend-developer')).toBe(
      `${SITE_ORIGIN}/vue-frontend-developer/`,
    );
    expect(absoluteSiteUrl(`${SITE_ORIGIN}/es/desarrollador-vue`)).toBe(
      `${SITE_ORIGIN}/es/desarrollador-vue/`,
    );
  });
});
