const SITE_URL = 'https://cesargomez.dev';

/** ProfilePage dates must be full ISO-8601 DateTime (GSC rejects YYYY-MM-DD). */
const PROFILE_DATE_CREATED = '2024-06-01T12:00:00-05:00';
const PROFILE_DATE_MODIFIED = '2026-07-25T12:00:00-05:00';

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
  const { public: publicConfig } = useRuntimeConfig();

  defineOgImage(
    'Portfolio',
    {
      title: personName.value,
      description: t('hero.title'),
      brandName: locale.value === 'es' ? 'CÉSAR GÓMEZ' : 'CESAR GOMEZ',
      brandTag: 'PORTFOLIO',
      siteUrl: 'cesargomez.dev',
      footer: t('hero.locationLine'),
      pills: ['Vue.js', 'Nuxt', 'TypeScript', 'AI · NLP'],
    },
    {
      alt: `${personName.value} — ${t('hero.title')}`,
    },
  );

  useSeoMeta({
    // Keep tab/share titles in sync with the hero subtitle after the name.
    title: () => t('hero.title'),
    description: () => t('seo.description'),
    keywords: () => t('seo.keywords'),
    author: 'César Gómez',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    fbAppId: () => String(publicConfig.facebookAppId || ''),

    ogType: 'profile',
    ogTitle: () => t('hero.title'),
    ogDescription: () => t('seo.ogDescription'),
    // og:image / twitter:image injected by defineOgImage('Portfolio')
    ogUrl: () => canonicalUrl.value,
    ogSiteName: 'César Gómez Portfolio',
    ogLocale: () => (locale.value === 'es' ? 'es_ES' : 'en_US'),

    twitterCard: 'summary_large_image',
    twitterTitle: () => t('hero.title'),
    twitterDescription: () => t('seo.ogDescription'),
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
      { name: 'geo.region', content: 'CO-BOL' },
      { name: 'geo.placename', content: 'Cartagena de Indias, Colombia' },
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
            '@type': 'Place',
            name: 'Cartagena de Indias',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Cartagena de Indias',
              addressRegion: 'Bolívar',
              addressCountry: 'CO',
            },
          },
          workLocation: {
            '@type': 'Place',
            name: t('hero.workPreference'),
            description: t('hero.locationLine'),
          },
          sameAs: [
            'https://www.linkedin.com/in/mrcego',
            'https://github.com/mrcego',
            'https://cesargomez.dev',
          ],
          knowsAbout: [
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
            'Website Development',
            'Fullstack Development',
            'Web Performance',
            'UI Engineering',
            'Design Systems',
            'Micro-frontends',
            'PrimeVue',
            'Vuetify',
            'Tailwind CSS',
            'SSR/SSG',
            'CI/CD',
            'Accessibility',
            'AI Engineering',
            'Natural Language Processing',
            'Conversational AI',
            'Large Language Models',
            'Ed-tech',
            'Cartagena Colombia Web Development',
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
          dateCreated: PROFILE_DATE_CREATED,
          dateModified: PROFILE_DATE_MODIFIED,
          mainEntity: {
            '@type': 'Person',
            '@id': `${SITE_URL}/#person`,
            name: personName.value,
            alternateName: 'mrcego',
            url: canonicalUrl.value,
            image: profileImage,
            jobTitle: t('hero.title'),
            description: t('seo.description'),
            sameAs: [
              'https://www.linkedin.com/in/mrcego',
              'https://github.com/mrcego',
              'https://cesargomez.dev',
            ],
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
          areaServed: [
            {
              '@type': 'City',
              name: 'Cartagena de Indias',
              containedInPlace: {
                '@type': 'Country',
                name: 'Colombia',
              },
            },
            {
              '@type': 'Country',
              name: 'Colombia',
            },
            'Worldwide',
          ],
          provider: {
            '@id': `${SITE_URL}/#person`,
          },
          serviceType: [
            'Frontend Development',
            'Senior Frontend Development',
            'Website Development',
            'Web Development',
            'Fullstack Development',
            'Vue.js Consulting',
            'Nuxt.js Development',
            'TypeScript Engineering',
            'Node.js Backend Development',
            'Express.js API Development',
            'AI Engineering',
            'AI/NLP Product Integration',
            'Ed-tech Frontend Engineering',
            'Remote Frontend Contracting',
            'Vibe Coding Cleanup',
          ],
          knowsAbout: [
            'Vue.js',
            'Nuxt.js',
            'TypeScript',
            'Web Architecture',
            'Website Development',
            'Express.js',
            'Ed-tech',
            'Cartagena Web Development',
          ],
        }),
      },
    ],
  }));
};
