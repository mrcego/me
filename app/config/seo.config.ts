import { SITE_ORIGIN } from '../utils/siteUrl';

/** Stable JSON-LD @id for the Person entity (home publishes the full node). */
export const PERSON_SCHEMA_ID = `${SITE_ORIGIN}/#person`;

/** Stable JSON-LD @id for the WebSite entity. */
export const WEBSITE_SCHEMA_ID = `${SITE_ORIGIN}/#website`;

/**
 * Google SERP site name (line above the URL). One name per domain — keep
 * WebSite.name, og:site_name, and nuxt `site.name` identical. Prefer brand over
 * domain; list the domain in alternateName so Google can fall back cleanly.
 * @see https://developers.google.com/search/docs/appearance/site-names
 */
export const SITE_NAME = 'César Gómez';
export const SITE_NAME_ALTERNATES = [
  'Cesar Gomez',
  'César Gómez Portfolio',
  'Cesar Gomez Portfolio',
  'cesargomez.dev',
] as const;

/**
 * Canonical Person.url — always the site-origin home (EN default), never a
 * locale page or landing URL. Landings must only reference PERSON_SCHEMA_ID.
 */
export const PERSON_ENTITY_URL = `${SITE_ORIGIN}/`;

/** BCP 47 tags for HTML hreflang alternates (not bare `en` / `es`). */
export const SEO_HREFLANG = {
  en: 'en',
  es: 'es-CO',
  xDefault: 'x-default',
} as const;

/**
 * Editorial ProfilePage dates (full ISO-8601 DateTime — GSC rejects YYYY-MM-DD).
 * Bump `lastModified` when home profile / Person content materially changes.
 */
export const SEO_EDITORIAL_DATES = {
  profileCreated: '2024-06-01T12:00:00-05:00',
  lastModified: '2026-08-12T15:30:00-05:00',
} as const;

/** Shared social / OG defaults used by composables and @nuxtjs/seo. */
export const SEO_IDENTITY = {
  siteUrl: SITE_ORIGIN,
  name: 'César Gómez',
  description:
    'Senior Fullstack Engineer & Frontend Architect with 13+ years building scalable Vue 3, Nuxt 4 & Node.js applications for ed-tech and e-commerce leaders.',
  author: 'César Gómez',
  type: 'website',
  locale: 'en',
  ogImage: '/img/og-image.png?v=cg3',
  ogImageAlt: 'César Gómez — Senior Fullstack Engineer · Frontend Architect',
  facebookAppId: '966242223397117',
  twitterCard: 'summary_large_image',
  twitterCreator: '@codingwithcego',
  twitterSite: '@codingwithcego',
} as const;

/** Contact WhatsApp — username handle displayed in UI, with direct click-to-chat href. */
export const CONTACT_WHATSAPP_USERNAME = 'mrcego.fsdev';
export const CONTACT_WHATSAPP_DISPLAY = `@${CONTACT_WHATSAPP_USERNAME}`;
export const CONTACT_PHONE_E164 = '+573332636550';
export const CONTACT_PHONE_WHATSAPP = `https://wa.me/${CONTACT_PHONE_E164.replace('+', '')}`;
export const CONTACT_PHONE_DISPLAY = CONTACT_WHATSAPP_DISPLAY;

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
  'AI-Augmented Engineering',
  'Agent-assisted Development',
  'AI/NLP Product Integration',
  'E-commerce Platforms',
  'Retailtech',
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
