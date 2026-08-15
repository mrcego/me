import {
  PERSON_ENTITY_URL,
  PERSON_SCHEMA_ID,
  SEO_EDITORIAL_DATES,
  SEO_HREFLANG,
  WEBSITE_SCHEMA_ID,
} from '../config/seo.config';

export type HreflangAlternateLink = {
  rel: 'alternate';
  hreflang: string;
  href: string;
};

/**
 * Build HTML hreflang alternates with region tags (`en-US` / `es-ES`) and
 * `x-default` pointing at the English URL.
 */
export function buildHreflangAlternateLinks(urls: {
  en: string;
  es: string;
}): HreflangAlternateLink[] {
  return [
    { rel: 'alternate', hreflang: SEO_HREFLANG.en, href: urls.en },
    { rel: 'alternate', hreflang: SEO_HREFLANG.es, href: urls.es },
    { rel: 'alternate', hreflang: SEO_HREFLANG.xDefault, href: urls.en },
  ];
}

/** JSON-LD node reference to the stable Person entity (no conflicting props). */
export function personSchemaRef(): { '@id': string } {
  return { '@id': PERSON_SCHEMA_ID };
}

/** JSON-LD node reference to the stable WebSite entity. */
export function websiteSchemaRef(): { '@id': string } {
  return { '@id': WEBSITE_SCHEMA_ID };
}

export function htmlLangForLocale(locale: string): 'es-CO' | 'en' {
  return locale === 'es' ? 'es-CO' : 'en';
}

export function ogLocaleForLocale(locale: string): 'es_CO' | 'en_US' {
  return locale === 'es' ? 'es_CO' : 'en_US';
}

export function jsonLdScript(key: string, data: Record<string, unknown>) {
  const json = JSON.stringify(data);
  return {
    type: 'application/ld+json' as const,
    key,
    children: json,
    innerHTML: json,
  };
}

export {
  PERSON_ENTITY_URL,
  PERSON_SCHEMA_ID,
  SEO_EDITORIAL_DATES,
  SEO_HREFLANG,
  WEBSITE_SCHEMA_ID,
};
