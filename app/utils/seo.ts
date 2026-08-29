import {
  PERSON_ENTITY_URL,
  PERSON_KNOWS_ABOUT,
  PERSON_SCHEMA_ID,
  SEO_EDITORIAL_DATES,
  SEO_HREFLANG,
  SEO_IDENTITY,
  SITE_NAME,
  SITE_NAME_ALTERNATES,
  WEBSITE_SCHEMA_ID,
} from '../config/seo.config';
import { SITE_ORIGIN } from './siteUrl';

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

export function buildPersonEntity(options?: {
  locale?: string;
  jobTitle?: string;
  description?: string;
}) {
  const isEs = options?.locale === 'es';
  const personName = isEs ? 'César Gómez' : 'Cesar Gomez';
  const profileImage = `${SITE_ORIGIN}/img/technical-identity.jpg`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_SCHEMA_ID,
    name: personName,
    givenName: isEs ? 'César' : 'Cesar',
    familyName: isEs ? 'Gómez' : 'Gomez',
    alternateName: ['César Gómez', 'Cesar Gomez', 'mrcego'],
    jobTitle:
      options?.jobTitle ||
      (isEs
        ? 'Ingeniero Frontend Senior · Arquitecto Web'
        : 'Senior Fullstack Engineer & Frontend Architect'),
    description: options?.description || SEO_IDENTITY.description,
    url: PERSON_ENTITY_URL,
    image: profileImage,
    nationality: {
      '@type': 'Country',
      name: 'Colombia',
    },
    homeLocation: {
      '@type': 'Place',
      name: 'Cartagena de Indias',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Cartagena de Indias',
        addressRegion: 'Bolívar',
        addressCountry: 'CO',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 10.391,
        longitude: -75.4794,
      },
    },
    sameAs: [
      'https://www.linkedin.com/in/mrcego',
      'https://github.com/mrcego',
      'https://x.com/codingwithcego',
      PERSON_ENTITY_URL,
    ],
    knowsAbout: [...PERSON_KNOWS_ABOUT],
    knowsLanguage: ['en', 'es'],
  };
}

export function buildWebSiteEntity(options?: { locale?: string; description?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_SCHEMA_ID,
    name: SITE_NAME,
    alternateName: [...SITE_NAME_ALTERNATES],
    description: options?.description || SEO_IDENTITY.description,
    url: PERSON_ENTITY_URL,
    inLanguage: ['en', 'es-CO'],
    publisher: personSchemaRef(),
    about: personSchemaRef(),
  };
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
