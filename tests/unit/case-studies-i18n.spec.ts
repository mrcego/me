import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const localesDir = join(dirname(fileURLToPath(import.meta.url)), '../../i18n/locales');

function loadLocale(filename: string) {
  return JSON.parse(readFileSync(join(localesDir, filename), 'utf8')) as Record<string, unknown>;
}

const en = loadLocale('en.json');
const es = loadLocale('es.json');

const SLUGS = ['colegium', 'lingoquesto', 'tissini'] as const;

type LocaleMessages = Record<string, unknown>;

function getNestedValue(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((current, key) => {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    return (current as Record<string, unknown>)[key];
  }, obj);
}

function assertCaseStudiesContract(messages: LocaleMessages, locale: string) {
  const topLevelKeys = [
    'caseStudies.section_tag',
    'caseStudies.title_top',
    'caseStudies.title_bottom',
    'caseStudies.lead',
    'caseStudies.tagsLabel',
    'caseStudies.readMore',
    'caseStudies.readMoreAria',
  ] as const;

  for (const key of topLevelKeys) {
    const value = getNestedValue(messages, key);
    expect(value, `${locale}: missing ${key}`).toBeTruthy();
    expect(typeof value, `${locale}: ${key} should be a string`).toBe('string');
  }

  for (const slug of SLUGS) {
    const itemKeys = [
      `caseStudies.items.${slug}.role`,
      `caseStudies.items.${slug}.period`,
      `caseStudies.items.${slug}.cardTitle`,
      `caseStudies.items.${slug}.cardSummary`,
      `caseStudies.items.${slug}.meta.title`,
      `caseStudies.items.${slug}.meta.description`,
      `caseStudies.items.${slug}.page.eyebrow`,
      `caseStudies.items.${slug}.page.title`,
      `caseStudies.items.${slug}.page.lead`,
      `caseStudies.items.${slug}.page.contactCta`,
      `caseStudies.items.${slug}.page.backCta`,
      `caseStudies.items.${slug}.page.highlightsTitle`,
    ] as const;

    for (const key of itemKeys) {
      const value = getNestedValue(messages, key);
      expect(value, `${locale}: missing ${key}`).toBeTruthy();
      expect(typeof value, `${locale}: ${key} should be a string`).toBe('string');
    }

    const tags = getNestedValue(messages, `caseStudies.items.${slug}.tags`);
    expect(
      Array.isArray(tags),
      `${locale}: caseStudies.items.${slug}.tags should be an array`,
    ).toBe(true);
    expect(
      (tags as unknown[]).length,
      `${locale}: tags for ${slug} should not be empty`,
    ).toBeGreaterThan(0);

    const highlights = getNestedValue(messages, `caseStudies.items.${slug}.page.highlights`);
    expect(
      Array.isArray(highlights),
      `${locale}: caseStudies.items.${slug}.page.highlights should be an array`,
    ).toBe(true);
    expect(
      (highlights as unknown[]).length,
      `${locale}: highlights for ${slug} should not be empty`,
    ).toBeGreaterThan(0);

    const sections = getNestedValue(messages, `caseStudies.items.${slug}.page.sections`);
    expect(
      Array.isArray(sections),
      `${locale}: caseStudies.items.${slug}.page.sections should be an array`,
    ).toBe(true);
    expect(
      (sections as unknown[]).length,
      `${locale}: sections for ${slug} should not be empty`,
    ).toBeGreaterThan(0);

    for (const [index, section] of (sections as Array<Record<string, unknown>>).entries()) {
      expect(
        typeof section.title,
        `${locale}: section[${index}].title for ${slug} should be a string`,
      ).toBe('string');
      expect(
        typeof section.body,
        `${locale}: section[${index}].body for ${slug} should be a string`,
      ).toBe('string');
    }
  }
}

describe('caseStudies i18n contract', () => {
  it('satisfies the component key contract in en.json', () => {
    assertCaseStudiesContract(en, 'en');
  });

  it('satisfies the component key contract in es.json', () => {
    assertCaseStudiesContract(es, 'es');
  });

  it('guarantees about.roles.bitsamericas exists with complete fields in en and es', () => {
    for (const [locale, messages] of [
      ['en', en],
      ['es', es],
    ] as const) {
      expect(
        getNestedValue(messages, 'about.roles.bitsamericas.title'),
        `${locale}: title`,
      ).toBeTruthy();
      expect(
        getNestedValue(messages, 'about.roles.bitsamericas.company'),
        `${locale}: company`,
      ).toBe('BITS Americas S.A.S.');
      expect(
        getNestedValue(messages, 'about.roles.bitsamericas.desc'),
        `${locale}: desc`,
      ).toBeTruthy();
      const highlights = getNestedValue(messages, 'about.roles.bitsamericas.highlights');
      expect(Array.isArray(highlights), `${locale}: highlights array`).toBe(true);
      expect((highlights as unknown[]).length).toBeGreaterThan(0);
    }
  });
});
