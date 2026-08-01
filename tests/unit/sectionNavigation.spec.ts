import { describe, expect, it } from 'vitest';
import {
  buildSectionHref,
  normalizePathname,
  normalizeSectionHash,
  pathsMatchHome,
} from '../../app/utils/sectionNavigation';

describe('sectionNavigation helpers', () => {
  it('normalizeSectionHash adds a leading #', () => {
    expect(normalizeSectionHash('contact')).toBe('#contact');
    expect(normalizeSectionHash('#about')).toBe('#about');
    expect(normalizeSectionHash('')).toBe('');
  });

  it('normalizePathname strips trailing slashes except root', () => {
    expect(normalizePathname('/')).toBe('/');
    expect(normalizePathname('/es/')).toBe('/es');
    expect(normalizePathname('/vue-frontend-developer/')).toBe('/vue-frontend-developer');
  });

  it('pathsMatchHome compares locale home paths with trailing slash tolerance', () => {
    expect(pathsMatchHome('/', '/')).toBe(true);
    expect(pathsMatchHome('/', '/')).toBe(true);
    expect(pathsMatchHome('/es/', '/es/')).toBe(true);
    expect(pathsMatchHome('/es', '/es/')).toBe(true);
    expect(pathsMatchHome('/ai-engineer/', '/')).toBe(false);
    expect(pathsMatchHome('/es/ai-engineer/', '/es/')).toBe(false);
  });

  it('buildSectionHref returns hash-only on home and home+hash on landings', () => {
    expect(buildSectionHref('#contact', true, '/')).toBe('#contact');
    expect(buildSectionHref('contact', true, '/')).toBe('#contact');
    expect(buildSectionHref('#contact', false, '/')).toBe('/#contact');
    expect(buildSectionHref('#contact', false, '/es/')).toBe('/es/#contact');
    expect(buildSectionHref('#contact', false, '/es')).toBe('/es/#contact');
    expect(buildSectionHref('hire-profiles', false, '/es/')).toBe('/es/#hire-profiles');
  });
});
