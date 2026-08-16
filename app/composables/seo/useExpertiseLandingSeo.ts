import type { I18nFaqItem } from '~/core/types/i18n';
import { getI18nArray } from '~/core/utils/i18nHelpers';
import { SEO_IDENTITY, SITE_NAME } from '~/config/seo.config';
import {
  buildHreflangAlternateLinks,
  buildPersonEntity,
  buildWebSiteEntity,
  htmlLangForLocale,
  jsonLdScript,
  ogLocaleForLocale,
  personSchemaRef,
  websiteSchemaRef,
} from '~/utils/seo';
import { absoluteSiteUrl } from '~/utils/siteUrl';

export type ExpertiseLandingTranslationKey =
  | 'landingVue'
  | 'landingAi'
  | 'landingNode'
  | 'landingLocal'
  | 'landingCraft'
  | 'landingVueColombia'
  | 'landingAngular'
  | 'landingArchitect'
  | 'landingFullstack';

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
  const { t, tm, rt, locale, te } = useI18n();
  const route = useRoute();
  const { public: publicConfig } = useRuntimeConfig();

  const copyKey = (key: string) => `${options.translationKey}.${key}`;
  const canonicalUrl = computed(() => absoluteSiteUrl(route.path));
  const enUrl = absoluteSiteUrl(options.paths.en);
  const esUrl = absoluteSiteUrl(`/es${options.paths.es}`);
  const personName = computed(() => (locale.value === 'es' ? 'César Gómez' : 'Cesar Gomez'));

  const metaTitle = computed(() => {
    const key = copyKey('meta.title');
    if (te(key)) {
      const val = t(key);
      if (val && !val.startsWith('landing')) return val;
    }
    const primaryJob = options.jobTitles[0] || 'Senior Engineer';
    return `${primaryJob} — ${personName.value}`;
  });

  const metaDescription = computed(() => {
    const key = copyKey('meta.description');
    if (te(key)) {
      const val = t(key);
      if (val && !val.startsWith('landing')) return val;
    }
    return `${options.jobTitles.join(', ')} — ${personName.value}`;
  });

  const faqItems = computed(() => {
    const data = getI18nArray<I18nFaqItem>(tm, copyKey('faq'));
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
      description: metaTitle.value,
      brandName: locale.value === 'es' ? 'CÉSAR GÓMEZ' : 'CESAR GOMEZ',
      brandTag: 'PORTFOLIO',
      siteUrl: 'cesargomez.dev',
      footer: t('hero.locationLine'),
      pills: ['Vue.js', 'Nuxt', 'TypeScript', 'AI-Assisted'],
    },
    {
      alt: `${personName.value} — ${metaTitle.value}`,
    },
  );

  useSeoMeta({
    title: metaTitle,
    description: metaDescription,
    author: SEO_IDENTITY.author,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    fbAppId: () => String(publicConfig.facebookAppId || ''),
    ogType: 'website',
    ogTitle: metaTitle,
    ogDescription: metaDescription,
    // og:image / twitter:image injected by defineOgImage('Portfolio')
    ogUrl: () => canonicalUrl.value,
    ogSiteName: SITE_NAME,
    ogLocale: () => ogLocaleForLocale(locale.value),
    twitterCard: SEO_IDENTITY.twitterCard,
    twitterTitle: metaTitle,
    twitterDescription: metaDescription,
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
      jsonLdScript(
        'schema-person',
        buildPersonEntity({ locale: locale.value, jobTitle: options.jobTitles[0] }),
      ),
      jsonLdScript('schema-website', buildWebSiteEntity({ locale: locale.value })),
      jsonLdScript(`${options.translationKey}-webpage`, {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${canonicalUrl.value}#webpage`,
        url: canonicalUrl.value,
        name: metaTitle.value,
        description: metaDescription.value,
        inLanguage: htmlLangForLocale(locale.value),
        isPartOf: websiteSchemaRef(),
        about: [personSchemaRef(), ...pageOccupations],
        mainEntity: personSchemaRef(),
        mentions: options.knowsAbout.map((topic) => ({
          '@type': 'Thing',
          name: topic,
        })),
      }),
      jsonLdScript(`${options.translationKey}-breadcrumb`, {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: SITE_NAME,
            item: locale.value === 'es' ? absoluteSiteUrl('/es/') : absoluteSiteUrl('/'),
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: metaTitle.value,
            item: canonicalUrl.value,
          },
        ],
      }),
      ...(faqItems.value.length > 0
        ? [
            jsonLdScript(`${options.translationKey}-faq`, {
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
          ]
        : []),
    ],
  }));
};
