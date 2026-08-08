import { SEO_IDENTITY, SITE_NAME } from '~/config/seo.config';
import {
  buildHreflangAlternateLinks,
  htmlLangForLocale,
  jsonLdScript,
  ogLocaleForLocale,
  personSchemaRef,
  websiteSchemaRef,
} from '~/utils/seo';
import { SITE_ORIGIN, absoluteSiteUrl } from '~/utils/siteUrl';

export type CaseStudySlug = 'colegium' | 'lingoquesto' | 'tissini';

const CASE_STUDY_PATHS: Record<CaseStudySlug, { en: string; es: string }> = {
  colegium: {
    en: '/case-studies/colegium',
    es: '/casos/colegium',
  },
  lingoquesto: {
    en: '/case-studies/lingoquesto',
    es: '/casos/lingoquesto',
  },
  tissini: {
    en: '/case-studies/tissini',
    es: '/casos/tissini',
  },
};

export const useCaseStudySeo = (slug: CaseStudySlug) => {
  const { t, locale } = useI18n();
  const route = useRoute();
  const { public: publicConfig } = useRuntimeConfig();

  const paths = CASE_STUDY_PATHS[slug];
  const copyKey = (key: string) => `caseStudies.items.${slug}.${key}`;
  const canonicalUrl = computed(() => absoluteSiteUrl(route.path));
  const enUrl = absoluteSiteUrl(paths.en);
  const esUrl = absoluteSiteUrl(`/es${paths.es}`);
  const ogImage = `${SITE_ORIGIN}${SEO_IDENTITY.ogImage}`;
  const personName = computed(() => (locale.value === 'es' ? 'César Gómez' : 'Cesar Gomez'));

  defineOgImage(
    'Portfolio',
    {
      title: personName.value,
      description: t(copyKey('meta.title')),
      brandName: locale.value === 'es' ? 'CÉSAR GÓMEZ' : 'CESAR GOMEZ',
      brandTag: 'CASE STUDY',
      siteUrl: 'cesargomez.dev',
      footer: t('hero.locationLine'),
      pills: ['Vue.js', 'Nuxt', 'TypeScript', 'Ed-tech'],
    },
    {
      alt: `${personName.value} — ${t(copyKey('meta.title'))}`,
    },
  );

  useSeoMeta({
    title: () => t(copyKey('meta.title')),
    description: () => t(copyKey('meta.description')),
    author: SEO_IDENTITY.author,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    fbAppId: () => String(publicConfig.facebookAppId || ''),
    ogType: 'article',
    ogTitle: () => t(copyKey('meta.title')),
    ogDescription: () => t(copyKey('meta.description')),
    ogUrl: () => canonicalUrl.value,
    ogSiteName: SITE_NAME,
    ogLocale: () => ogLocaleForLocale(locale.value),
    twitterCard: SEO_IDENTITY.twitterCard,
    twitterTitle: () => t(copyKey('meta.title')),
    twitterDescription: () => t(copyKey('meta.description')),
    twitterSite: SEO_IDENTITY.twitterSite,
    twitterCreator: SEO_IDENTITY.twitterCreator,
  });

  useHead(() => ({
    htmlAttrs: {
      lang: htmlLangForLocale(locale.value),
    },
    link: [
      { rel: 'canonical', href: canonicalUrl.value },
      ...buildHreflangAlternateLinks({ en: enUrl, es: esUrl }),
    ],
    script: [
      jsonLdScript(`case-study-${slug}-webpage`, {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${canonicalUrl.value}#webpage`,
        url: canonicalUrl.value,
        name: t(copyKey('meta.title')),
        description: t(copyKey('meta.description')),
        inLanguage: htmlLangForLocale(locale.value),
        isPartOf: websiteSchemaRef(),
        about: personSchemaRef(),
        mainEntity: personSchemaRef(),
        primaryImageOfPage: ogImage,
      }),
      jsonLdScript(`case-study-${slug}-breadcrumb`, {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: t('seo.siteName'),
            item: locale.value === 'es' ? absoluteSiteUrl('/es/') : absoluteSiteUrl('/'),
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: t('caseStudies.section_tag'),
            item:
              locale.value === 'es'
                ? absoluteSiteUrl('/es/#case-studies')
                : absoluteSiteUrl('/#case-studies'),
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: t(copyKey('cardTitle')),
            item: canonicalUrl.value,
          },
        ],
      }),
    ],
  }));
};
