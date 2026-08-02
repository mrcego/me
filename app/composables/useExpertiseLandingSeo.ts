import { SEO_IDENTITY, SITE_NAME } from '~/config/seo.config';
import {
  buildHreflangAlternateLinks,
  htmlLangForLocale,
  ogLocaleForLocale,
  personSchemaRef,
  websiteSchemaRef,
} from '~/utils/seo';
import { SITE_ORIGIN, absoluteSiteUrl } from '~/utils/siteUrl';

export type ExpertiseLandingTranslationKey =
  'landingVue' | 'landingAi' | 'landingNode' | 'landingLocal' | 'landingCraft';

interface ExpertiseLandingSeoOptions {
  translationKey: ExpertiseLandingTranslationKey;
  paths: {
    en: string;
    es: string;
  };
  knowsAbout: string[];
  /** Role phrases for this page — Occupation nodes on WebPage, not Person. */
  jobTitles: string[];
}

const occupationLocation = {
  '@type': 'City' as const,
  name: 'Cartagena de Indias',
  containedInPlace: {
    '@type': 'Country' as const,
    name: 'Colombia',
  },
};

export const useExpertiseLandingSeo = (options: ExpertiseLandingSeoOptions) => {
  const { t, tm, rt, locale } = useI18n();
  const route = useRoute();
  const { public: publicConfig } = useRuntimeConfig();

  const copyKey = (key: string) => `${options.translationKey}.${key}`;
  const canonicalUrl = computed(() => absoluteSiteUrl(route.path));
  const enUrl = absoluteSiteUrl(options.paths.en);
  const esUrl = absoluteSiteUrl(`/es${options.paths.es}`);
  const ogImage = `${SITE_ORIGIN}${SEO_IDENTITY.ogImage}`;
  const personName = computed(() => (locale.value === 'es' ? 'César Gómez' : 'Cesar Gomez'));

  const faqItems = computed(() => {
    const data = tm(copyKey('faq')) as Array<{ question: unknown; answer: unknown }> | unknown;
    if (!Array.isArray(data)) return [];
    return data.map((item) => ({
      question: rt(item.question),
      answer: rt(item.answer),
    }));
  });

  const pageOccupations = options.jobTitles.map((title) => ({
    '@type': 'Occupation' as const,
    name: title,
    occupationLocation,
    skills: options.knowsAbout.join(', '),
  }));

  defineOgImage(
    'Portfolio',
    {
      title: personName.value,
      description: t(copyKey('meta.title')),
      brandName: locale.value === 'es' ? 'CÉSAR GÓMEZ' : 'CESAR GOMEZ',
      brandTag: 'PORTFOLIO',
      siteUrl: 'cesargomez.dev',
      footer: t('hero.locationLine'),
      pills: ['Vue.js', 'Nuxt', 'TypeScript', 'AI-Assisted'],
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
    ogType: 'website',
    ogTitle: () => t(copyKey('meta.title')),
    ogDescription: () => t(copyKey('meta.description')),
    // og:image / twitter:image injected by defineOgImage('Portfolio')
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
      {
        type: 'application/ld+json',
        key: `${options.translationKey}-webpage`,
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': `${canonicalUrl.value}#webpage`,
          url: canonicalUrl.value,
          name: t(copyKey('meta.title')),
          description: t(copyKey('meta.description')),
          inLanguage: htmlLangForLocale(locale.value),
          isPartOf: websiteSchemaRef(),
          // Reference home Person — do not redefine url/jobTitle on the same @id
          about: [personSchemaRef(), ...pageOccupations],
          mainEntity: personSchemaRef(),
          primaryImageOfPage: ogImage,
          mentions: options.knowsAbout.map((topic) => ({
            '@type': 'Thing',
            name: topic,
          })),
        }),
      },
      {
        type: 'application/ld+json',
        key: `${options.translationKey}-breadcrumb`,
        innerHTML: JSON.stringify({
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
              name: t(copyKey('meta.title')),
              item: canonicalUrl.value,
            },
          ],
        }),
      },
      {
        type: 'application/ld+json',
        key: `${options.translationKey}-faq`,
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqItems.value.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        }),
      },
    ],
  }));
};
