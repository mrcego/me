/**
 * Single source of truth for indexable portfolio routes (EN + ES).
 * Used by nuxt prerender/sitemap and hire-profile navigation.
 *
 * Do not rename `/ai-engineer/` (EN) — that URL is publicly indexed.
 */

export type LocaleCode = 'en' | 'es';

export type LandingTranslationKey =
  | 'landingVue'
  | 'landingAi'
  | 'landingNode'
  | 'landingLocal'
  | 'landingCraft'
  | 'landingVueColombia'
  | 'landingAngular'
  | 'landingArchitect'
  | 'landingFullstack';

export type HireProfileId = 'vue' | 'ai' | 'node' | 'angular' | 'architect' | 'fullstack';

export type HireProfileIcon =
  | 'logos:vue'
  | 'logos:nodejs-icon'
  | 'solar:cpu-bolt-bold-duotone'
  | 'logos:angular-icon'
  | 'solar:layers-minimalistic-bold-duotone'
  | 'solar:code-square-bold-duotone';

export interface PortfolioRoute {
  id: string;
  /** Absolute trailing-slash paths (prerender + sitemap). ES includes `/es/` prefix. */
  paths: Record<LocaleCode, string>;
  /**
   * EN path for `localePath()` / NuxtLink (no trailing slash, no locale prefix).
   * i18n `defineI18nRoute` maps the ES slug.
   */
  localePath: string;
  landingKey?: LandingTranslationKey;
  hireLabelKey?: string;
  hireIcon?: HireProfileIcon;
}

export const PORTFOLIO_ROUTES: readonly PortfolioRoute[] = [
  {
    id: 'home',
    paths: { en: '/', es: '/es/' },
    localePath: '/',
  },
  {
    id: 'vue',
    paths: { en: '/vue-frontend-developer/', es: '/es/desarrollador-vue/' },
    localePath: '/vue-frontend-developer',
    landingKey: 'landingVue',
    hireLabelKey: 'hireProfiles.hireForVue',
    hireIcon: 'logos:vue',
  },
  {
    id: 'ai',
    paths: { en: '/ai-engineer/', es: '/es/ingeniero-ia/' },
    localePath: '/ai-engineer',
    landingKey: 'landingAi',
    hireLabelKey: 'hireProfiles.hireForAi',
    hireIcon: 'solar:cpu-bolt-bold-duotone',
  },
  {
    id: 'node',
    paths: { en: '/nodejs-backend-developer/', es: '/es/desarrollador-backend-nodejs/' },
    localePath: '/nodejs-backend-developer',
    landingKey: 'landingNode',
    hireLabelKey: 'hireProfiles.hireForNode',
    hireIcon: 'logos:nodejs-icon',
  },
  {
    id: 'angular',
    paths: { en: '/angular-developer/', es: '/es/desarrollador-angular/' },
    localePath: '/angular-developer',
    landingKey: 'landingAngular',
    hireLabelKey: 'hireProfiles.hireForAngular',
    hireIcon: 'logos:angular-icon',
  },
  {
    id: 'architect',
    paths: { en: '/frontend-architect/', es: '/es/arquitecto-frontend/' },
    localePath: '/frontend-architect',
    landingKey: 'landingArchitect',
    hireLabelKey: 'hireProfiles.hireForArchitect',
    hireIcon: 'solar:layers-minimalistic-bold-duotone',
  },
  {
    id: 'fullstack',
    paths: { en: '/fullstack-engineer/', es: '/es/ingeniero-fullstack/' },
    localePath: '/fullstack-engineer',
    landingKey: 'landingFullstack',
    hireLabelKey: 'hireProfiles.hireForFullstack',
    hireIcon: 'solar:code-square-bold-duotone',
  },
  {
    id: 'tissini',
    paths: { en: '/case-studies/tissini/', es: '/es/casos/tissini/' },
    localePath: '/case-studies/tissini',
  },
  {
    id: 'colegium',
    paths: { en: '/case-studies/colegium/', es: '/es/casos/colegium/' },
    localePath: '/case-studies/colegium',
  },
  {
    id: 'lingoquesto',
    paths: { en: '/case-studies/lingoquesto/', es: '/es/casos/lingoquesto/' },
    localePath: '/case-studies/lingoquesto',
  },
  {
    id: 'cartagena',
    paths: { en: '/web-developer-cartagena/', es: '/es/desarrollo-web-cartagena/' },
    localePath: '/web-developer-cartagena',
    landingKey: 'landingLocal',
  },
  {
    id: 'craft',
    paths: { en: '/ai-assisted-craft/', es: '/es/craft-asistido-ia/' },
    localePath: '/ai-assisted-craft',
    landingKey: 'landingCraft',
  },
  {
    id: 'vueColombia',
    paths: { en: '/vue-developer-colombia/', es: '/es/desarrollador-vue-colombia/' },
    localePath: '/vue-developer-colombia',
    landingKey: 'landingVueColombia',
  },
] as const;

/** Static sitemap XML paths that must be prerendered for zeroRuntime SSG. */
export const SITEMAP_PRERENDER_ROUTES = [
  '/sitemap.xml',
  '/sitemap_index.xml',
  '/__sitemap__/en-US.xml',
  '/__sitemap__/es-ES.xml',
] as const;

/** Page HTML paths only (trailing slash). */
export function pagePrerenderRoutes(): string[] {
  return PORTFOLIO_ROUTES.flatMap((route) => [route.paths.en, route.paths.es]);
}

/**
 * Full Nitro prerender list: indexable pages + sitemap XML endpoints.
 * (`sitemapUrls` stays page-only so the sitemap module does not list XML as pages.)
 */
export function prerenderRoutes(): string[] {
  return [...pagePrerenderRoutes(), ...SITEMAP_PRERENDER_ROUTES];
}

/** Alias used by nuxt.config for clarity. */
export function prerenderRoutesWithSitemap(): string[] {
  return prerenderRoutes();
}

/** Indexable page URLs for `@nuxtjs/sitemap` `urls`. */
export function sitemapUrls(): string[] {
  return pagePrerenderRoutes();
}

export interface HireProfileRoute extends PortfolioRoute {
  id: HireProfileId;
  landingKey: LandingTranslationKey;
  hireLabelKey: string;
  hireIcon: HireProfileIcon;
}

const HIRE_IDS: readonly HireProfileId[] = [
  'vue',
  'ai',
  'node',
  'angular',
  'architect',
  'fullstack',
];

/** Hire landings for navbar / footer / sister-profile lists. */
export function hireProfileRoutes(): HireProfileRoute[] {
  return PORTFOLIO_ROUTES.filter((route): route is HireProfileRoute =>
    HIRE_IDS.includes(route.id as HireProfileId),
  );
}
