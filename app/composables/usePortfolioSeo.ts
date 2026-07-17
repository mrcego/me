const SITE_URL = 'https://cesargomez.dev';

export const usePortfolioSeo = () => {
  const { t, locale } = useI18n();
  const localePath = useLocalePath();
  const faqItems = useFaqItems();

  const canonicalPath = computed(() => localePath('/'));
  const canonicalUrl = computed(() => {
    const path = canonicalPath.value;
    return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`;
  });

  const ogImage = `${SITE_URL}/img/og-image.png`;
  const profileImage = `${SITE_URL}/img/technical-identity.jpg`;
  const personName = computed(() => (locale.value === 'es' ? 'César Gómez' : 'Cesar Gomez'));

  useSeoMeta({
    // Keep tab/share titles in sync with the hero subtitle after the name.
    title: () => t('hero.title'),
    description: () => t('seo.description'),
    keywords: () => t('seo.keywords'),
    author: 'César Gómez',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',

    ogType: 'profile',
    ogTitle: () => t('hero.title'),
    ogDescription: () => t('seo.ogDescription'),
    ogImage,
    ogImageType: 'image/png',
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt: () => `${personName.value} — ${t('hero.title')}`,
    ogUrl: () => canonicalUrl.value,
    ogSiteName: 'César Gómez Portfolio',
    ogLocale: () => (locale.value === 'es' ? 'es_ES' : 'en_US'),

    twitterCard: 'summary_large_image',
    twitterTitle: () => t('hero.title'),
    twitterDescription: () => t('seo.ogDescription'),
    twitterImage: ogImage,
    twitterImageAlt: () => `${personName.value} — ${t('hero.title')}`,
    twitterSite: '@codingwithcego',
    twitterCreator: '@codingwithcego',
  });

  useHead(() => ({
    htmlAttrs: {
      lang: locale.value === 'es' ? 'es-ES' : 'en-US',
    },
    link: [
      { rel: 'canonical', href: canonicalUrl.value },
      { rel: 'alternate', hreflang: 'en', href: `${SITE_URL}/` },
      { rel: 'alternate', hreflang: 'es', href: `${SITE_URL}/es` },
      { rel: 'alternate', hreflang: 'x-default', href: `${SITE_URL}/` },
    ],
    meta: [
      { name: 'geo.region', content: 'CO' },
      { name: 'geo.placename', content: 'Colombia' },
      { property: 'profile:first_name', content: 'César' },
      { property: 'profile:last_name', content: 'Gómez' },
      { property: 'profile:username', content: 'mrcego' },
    ],
    script: [
      {
        type: 'application/ld+json',
        key: 'schema-person',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          '@id': `${SITE_URL}/#person`,
          name: personName.value,
          givenName: locale.value === 'es' ? 'César' : 'Cesar',
          familyName: locale.value === 'es' ? 'Gómez' : 'Gomez',
          alternateName: ['César Gómez', 'Cesar Gomez', 'mrcego'],
          jobTitle: t('hero.title'),
          description: t('seo.description'),
          url: canonicalUrl.value,
          image: profileImage,
          nationality: {
            '@type': 'Country',
            name: 'Colombia',
          },
          homeLocation: {
            '@type': 'Country',
            name: 'Colombia',
          },
          workLocation: {
            '@type': 'Country',
            name: 'Colombia',
          },
          sameAs: [
            'https://www.linkedin.com/in/mrcego',
            'https://github.com/mrcego',
            'https://cesargomez.dev',
          ],
          knowsAbout: [
            'Vue.js',
            'Nuxt.js',
            'TypeScript',
            'JavaScript',
            'Node.js',
            'Frontend Architecture',
            'Fullstack Development',
            'Web Performance',
            'UI Engineering',
            'Design Systems',
            'Micro-frontends',
            'PrimeVue',
            'Tailwind CSS',
          ],
          knowsLanguage: ['en', 'es'],
          alumniOf: [
            { '@type': 'Organization', name: 'Colegium' },
            { '@type': 'Organization', name: 'LingoQuesto' },
          ],
          worksFor: {
            '@type': 'Organization',
            name: 'LingoQuesto',
          },
          seeks: {
            '@type': 'Demand',
            name: t('seo.availability'),
          },
        }),
      },
      {
        type: 'application/ld+json',
        key: 'schema-website',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          name: t('seo.siteName'),
          description: t('seo.description'),
          url: SITE_URL,
          inLanguage: ['en-US', 'es-ES'],
          publisher: {
            '@id': `${SITE_URL}/#person`,
          },
        }),
      },
      {
        type: 'application/ld+json',
        key: 'schema-profile',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          '@id': `${canonicalUrl.value}#profile`,
          url: canonicalUrl.value,
          name: t('hero.title'),
          description: t('seo.description'),
          inLanguage: locale.value === 'es' ? 'es-ES' : 'en-US',
          dateModified: '2026-07-14',
          mainEntity: {
            '@id': `${SITE_URL}/#person`,
          },
        }),
      },
      {
        type: 'application/ld+json',
        key: 'schema-faq',
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
        key: 'schema-service',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          name: t('seo.serviceName'),
          description: t('seo.serviceDescription'),
          url: canonicalUrl.value,
          image: ogImage,
          areaServed: 'Worldwide',
          provider: {
            '@id': `${SITE_URL}/#person`,
          },
          serviceType: [
            'Frontend Development',
            'Fullstack Development',
            'Vue.js Consulting',
            'Nuxt.js Development',
            'TypeScript Engineering',
          ],
          knowsAbout: ['Vue.js', 'Nuxt.js', 'TypeScript', 'Web Architecture'],
        }),
      },
    ],
  }));
};
