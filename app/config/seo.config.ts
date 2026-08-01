import { SITE_ORIGIN } from '../utils/siteUrl';

/** Stable JSON-LD @id for the Person entity (home publishes the full node). */
export const PERSON_SCHEMA_ID = `${SITE_ORIGIN}/#person`;

/** Stable JSON-LD @id for the WebSite entity. */
export const WEBSITE_SCHEMA_ID = `${SITE_ORIGIN}/#website`;

/**
 * Canonical Person.url — always the site-origin home (EN default), never a
 * locale page or landing URL. Landings must only reference PERSON_SCHEMA_ID.
 */
export const PERSON_ENTITY_URL = `${SITE_ORIGIN}/`;

/** BCP 47 tags for HTML hreflang alternates (not bare `en` / `es`). */
export const SEO_HREFLANG = {
  en: 'en-US',
  es: 'es-ES',
  xDefault: 'x-default',
} as const;

/**
 * Editorial ProfilePage dates (full ISO-8601 DateTime — GSC rejects YYYY-MM-DD).
 * Bump `lastModified` when home profile / Person content materially changes.
 */
export const SEO_EDITORIAL_DATES = {
  profileCreated: '2024-06-01T12:00:00-05:00',
  lastModified: '2026-07-31T12:00:00-05:00',
} as const;

/** Shared social / OG defaults used by composables and @nuxtjs/seo. */
export const SEO_IDENTITY = {
  siteUrl: SITE_ORIGIN,
  name: 'César Gómez',
  description:
    'Senior Fullstack Developer with 13+ years of experience specializing in Frontend Excellence. Expert in Vue.js, Nuxt.js, TypeScript, and modern web architectures.',
  author: 'César Gómez',
  type: 'website',
  locale: 'en-US',
  ogImage: '/img/og-image.png?v=cg2',
  ogImageAlt: 'César Gómez — Senior Vue/Nuxt · AI-Assisted Craft',
  facebookAppId: '966242223397117',
  twitterCard: 'summary_large_image',
  twitterCreator: '@codingwithcego',
  twitterSite: '@codingwithcego',
} as const;

/** Compact topical terms for Person / ProfessionalService knowsAbout (not meta keywords). */
export const PERSON_KNOWS_ABOUT = [
  'Vue.js',
  'Vue 3',
  'Nuxt.js',
  'Nuxt 4',
  'TypeScript',
  'JavaScript',
  'Node.js',
  'Express.js',
  'REST APIs',
  'Frontend Architecture',
  'Senior Frontend Development',
  'Web Development',
  'Fullstack Development',
  'Web Performance',
  'Core Web Vitals',
  'UI Engineering',
  'Design Systems',
  'Micro-frontends',
  'PrimeVue',
  'Tailwind CSS',
  'Pinia',
  'SSR/SSG',
  'Accessibility',
  'AI-Assisted Craft',
  'Vibe Coding Cleanup',
  'Agent-assisted Development',
  'AI/NLP Product Integration',
  'Ed-tech',
  'Remote Contract Engineering',
] as const;

// SEO configuration for @nuxtjs/seo + portfolio schema governance
export default {
  seo: {
    ...SEO_IDENTITY,
    personId: PERSON_SCHEMA_ID,
    personUrl: PERSON_ENTITY_URL,
    websiteId: WEBSITE_SCHEMA_ID,
    hreflang: SEO_HREFLANG,
    editorial: SEO_EDITORIAL_DATES,
    knowsAbout: PERSON_KNOWS_ABOUT,
  },
};
