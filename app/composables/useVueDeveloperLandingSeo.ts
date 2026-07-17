const SITE_URL = 'https://cesargomez.dev';

const LANDING_PATHS = {
  en: '/vue-frontend-developer',
  es: '/desarrollador-vue',
} as const;

export const useVueDeveloperLandingSeo = () => {
  const { t, tm, rt, locale } = useI18n();
  const route = useRoute();

  const canonicalUrl = computed(() => `${SITE_URL}${route.path}`);
  const ogImage = `${SITE_URL}/img/og-image.png`;
  const personName = computed(() => (locale.value === 'es' ? 'César Gómez' : 'Cesar Gomez'));

  const faqItems = computed(() => {
    const data = tm('landingVue.faq') as Array<{ question: unknown; answer: unknown }> | unknown;
    if (!Array.isArray(data)) return [];
    return data.map((item) => ({
      question: rt(item.question),
      answer: rt(item.answer),
    }));
  });

  useSeoMeta({
    title: () => t('landingVue.meta.title'),
    description: () => t('landingVue.meta.description'),
    keywords: () => t('landingVue.meta.keywords'),
    author: 'César Gómez',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    ogType: 'website',
    ogTitle: () => t('landingVue.meta.title'),
    ogDescription: () => t('landingVue.meta.description'),
    ogImage,
    ogImageType: 'image/png',
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt: () => `${personName.value} — ${t('landingVue.meta.title')}`,
    ogUrl: () => canonicalUrl.value,
    ogSiteName: 'César Gómez Portfolio',
    ogLocale: () => (locale.value === 'es' ? 'es_ES' : 'en_US'),
    twitterCard: 'summary_large_image',
    twitterTitle: () => t('landingVue.meta.title'),
    twitterDescription: () => t('landingVue.meta.description'),
    twitterImage: ogImage,
    twitterImageAlt: () => `${personName.value} — ${t('landingVue.meta.title')}`,
    twitterSite: '@codingwithcego',
    twitterCreator: '@codingwithcego',
  });

  useHead(() => ({
    htmlAttrs: {
      lang: locale.value === 'es' ? 'es-ES' : 'en-US',
    },
    link: [
      { rel: 'canonical', href: canonicalUrl.value },
      { rel: 'alternate', hreflang: 'en', href: `${SITE_URL}${LANDING_PATHS.en}` },
      { rel: 'alternate', hreflang: 'es', href: `${SITE_URL}/es${LANDING_PATHS.es}` },
      { rel: 'alternate', hreflang: 'x-default', href: `${SITE_URL}${LANDING_PATHS.en}` },
    ],
    script: [
      {
        type: 'application/ld+json',
        key: 'schema-landing-webpage',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': `${canonicalUrl.value}#webpage`,
          url: canonicalUrl.value,
          name: t('landingVue.meta.title'),
          description: t('landingVue.meta.description'),
          inLanguage: locale.value === 'es' ? 'es-ES' : 'en-US',
          isPartOf: { '@id': `${SITE_URL}/#website` },
          about: { '@id': `${SITE_URL}/#person` },
          primaryImageOfPage: ogImage,
        }),
      },
      {
        type: 'application/ld+json',
        key: 'schema-landing-breadcrumb',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: t('seo.siteName'),
              item: locale.value === 'es' ? `${SITE_URL}/es` : `${SITE_URL}/`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: t('landingVue.meta.title'),
              item: canonicalUrl.value,
            },
          ],
        }),
      },
      {
        type: 'application/ld+json',
        key: 'schema-landing-faq',
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
      {
        type: 'application/ld+json',
        key: 'schema-landing-person',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          '@id': `${SITE_URL}/#person`,
          name: personName.value,
          jobTitle: t('seo.jobTitle'),
          url: canonicalUrl.value,
          sameAs: [
            'https://www.linkedin.com/in/mrcego',
            'https://github.com/mrcego',
            `${SITE_URL}/`,
          ],
          knowsAbout: ['Vue.js', 'Nuxt.js', 'TypeScript', 'Frontend Development'],
        }),
      },
    ],
  }));
};
