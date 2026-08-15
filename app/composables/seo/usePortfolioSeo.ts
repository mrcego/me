import {
  CONTACT_PHONE_E164,
  PERSON_ENTITY_URL,
  PERSON_KNOWS_ABOUT,
  PERSON_SCHEMA_ID,
  SEO_EDITORIAL_DATES,
  SEO_IDENTITY,
  SITE_NAME,
  SITE_NAME_ALTERNATES,
  WEBSITE_SCHEMA_ID,
} from '~/config/seo.config';
import {
  buildHreflangAlternateLinks,
  htmlLangForLocale,
  jsonLdScript,
  ogLocaleForLocale,
  personSchemaRef,
} from '~/utils/seo';
import { SITE_ORIGIN, absoluteSiteUrl } from '~/utils/siteUrl';

export const usePortfolioSeo = () => {
  const { t, locale } = useI18n();
  const localePath = useLocalePath();
  const faqItems = useFaqItems();

  const canonicalUrl = computed(() => absoluteSiteUrl(localePath('/')));

  const ogImage = `${SITE_ORIGIN}${SEO_IDENTITY.ogImage}`;
  const profileImage = `${SITE_ORIGIN}/img/technical-identity.jpg`;
  const personName = computed(() => (locale.value === 'es' ? 'César Gómez' : 'Cesar Gomez'));
  const { public: publicConfig } = useRuntimeConfig();

  const shareTitle = computed(() => t('seo.ogTitle'));
  const shareImageAlt = computed(() => `${personName.value} — ${shareTitle.value}`);

  defineOgImage(
    'Portfolio',
    {
      title: personName.value,
      description: shareTitle.value,
      brandName: locale.value === 'es' ? 'CÉSAR GÓMEZ' : 'CESAR GOMEZ',
      brandTag: 'PORTFOLIO',
      siteUrl: 'cesargomez.dev',
      footer: t('hero.locationLine'),
      pills: ['Vue.js', 'Nuxt', 'TypeScript', 'AI-Assisted'],
    },
    {
      alt: shareImageAlt.value,
    },
  );

  useSeoMeta({
    title: () => shareTitle.value,
    description: () => t('seo.description'),
    author: SEO_IDENTITY.author,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    fbAppId: () => String(publicConfig.facebookAppId || ''),

    ogType: 'profile',
    ogTitle: () => shareTitle.value,
    ogDescription: () => t('seo.ogDescription'),
    // og:image / twitter:image injected by defineOgImage('Portfolio')
    ogImageAlt: () => shareImageAlt.value,
    ogUrl: () => canonicalUrl.value,
    ogSiteName: SITE_NAME,
    ogLocale: () => ogLocaleForLocale(locale.value),

    twitterCard: SEO_IDENTITY.twitterCard,
    twitterTitle: () => shareTitle.value,
    twitterDescription: () => t('seo.ogDescription'),
    twitterImageAlt: () => shareImageAlt.value,
    twitterSite: SEO_IDENTITY.twitterSite,
    twitterCreator: SEO_IDENTITY.twitterCreator,
  });

  useHead(() => ({
    htmlAttrs: {
      lang: htmlLangForLocale(locale.value),
    },
    link: [
      { rel: 'canonical', href: canonicalUrl.value },
      ...buildHreflangAlternateLinks({
        en: absoluteSiteUrl('/'),
        es: absoluteSiteUrl('/es/'),
      }),
    ],
    meta: [
      { name: 'geo.region', content: 'CO-BOL' },
      { name: 'geo.placename', content: 'Cartagena de Indias, Colombia' },
      { property: 'profile:first_name', content: 'César' },
      { property: 'profile:last_name', content: 'Gómez' },
      { property: 'profile:username', content: 'mrcego' },
    ],
    script: [
      jsonLdScript('schema-person', {
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': PERSON_SCHEMA_ID,
        name: personName.value,
        givenName: locale.value === 'es' ? 'César' : 'Cesar',
        familyName: locale.value === 'es' ? 'Gómez' : 'Gomez',
        alternateName: ['César Gómez', 'Cesar Gomez', 'mrcego'],
        jobTitle: t('seo.jobTitle'),
        description: t('seo.description'),
        // Stable entity URL — never locale page or landing canonical
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
        },
        workLocation: {
          '@type': 'Place',
          name: t('hero.workPreference'),
          description: t('hero.locationLine'),
        },
        sameAs: [
          'https://www.linkedin.com/in/mrcego',
          'https://github.com/mrcego',
          'https://x.com/codingwithcego',
          PERSON_ENTITY_URL,
        ],
        knowsAbout: [...PERSON_KNOWS_ABOUT],
        knowsLanguage: ['en', 'es'],
        hasOccupation: [
          {
            '@type': 'Occupation',
            name: 'Senior Frontend Engineer',
            occupationalCategory: '15-1252.00',
            description:
              'Senior frontend engineer specializing in Vue.js, Nuxt.js, TypeScript, and scalable web architecture.',
          },
          {
            '@type': 'Occupation',
            name: 'Frontend Architect',
            occupationalCategory: '15-1252.00',
            description:
              'Lead frontend architecture for micro-frontends, design systems, and performance-critical platforms.',
          },
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
      jsonLdScript('schema-website', {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': WEBSITE_SCHEMA_ID,
        name: SITE_NAME,
        alternateName: [...SITE_NAME_ALTERNATES],
        description: t('seo.description'),
        url: PERSON_ENTITY_URL,
        inLanguage: ['en', 'es-CO'],
        publisher: personSchemaRef(),
        about: personSchemaRef(),
        potentialAction: {
          '@type': 'ControlAction',
          name: 'Portfolio Terminal Interface',
          description:
            'Interactive CLI command line interface for navigating portfolio sections, downloading localized CVs, and exploring technical architecture.',
          target: `${PERSON_ENTITY_URL}#terminal`,
        },
      }),
      jsonLdScript('schema-profile', {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        '@id': `${canonicalUrl.value}#profile`,
        url: canonicalUrl.value,
        name: shareTitle.value,
        description: t('seo.description'),
        inLanguage: htmlLangForLocale(locale.value),
        dateCreated: SEO_EDITORIAL_DATES.profileCreated,
        dateModified: SEO_EDITORIAL_DATES.lastModified,
        // Reference only — full Person node is published once above
        mainEntity: personSchemaRef(),
      }),
      jsonLdScript('schema-sitenavigation', {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: [
          {
            '@type': 'SiteNavigationElement',
            position: 1,
            name: locale.value === 'es' ? 'Desarrollador Vue.js' : 'Vue.js Developer',
            url: absoluteSiteUrl(
              locale.value === 'es' ? '/es/desarrollador-vue/' : '/vue-frontend-developer/',
            ),
          },
          {
            '@type': 'SiteNavigationElement',
            position: 2,
            name: 'AI-Assisted Craft',
            url: absoluteSiteUrl(
              locale.value === 'es' ? '/es/craft-asistido-ia/' : '/ai-assisted-craft/',
            ),
          },
          {
            '@type': 'SiteNavigationElement',
            position: 3,
            name:
              locale.value === 'es' ? 'Desarrollador Backend Node.js' : 'Node.js Backend Developer',
            url: absoluteSiteUrl(
              locale.value === 'es'
                ? '/es/desarrollador-backend-nodejs/'
                : '/nodejs-backend-developer/',
            ),
          },
          {
            '@type': 'SiteNavigationElement',
            position: 4,
            name: locale.value === 'es' ? 'Desarrollo Web Cartagena' : 'Web Developer Cartagena',
            url: absoluteSiteUrl(
              locale.value === 'es' ? '/es/desarrollo-web-cartagena/' : '/web-developer-cartagena/',
            ),
          },
          {
            '@type': 'SiteNavigationElement',
            position: 5,
            name: locale.value === 'es' ? 'Casos de Estudio' : 'Case Studies',
            url: absoluteSiteUrl(locale.value === 'es' ? '/es/#case-studies' : '/#case-studies'),
          },
        ],
      }),
      jsonLdScript('schema-faq', {
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
      jsonLdScript('schema-service', {
        '@context': 'https://schema.org',
        // ProfessionalService (LocalBusiness) for Google local/business rich results;
        // Service so schema.org accepts serviceType (not inherited by LocalBusiness).
        '@type': ['ProfessionalService', 'Service'],
        name: t('seo.serviceName'),
        description: t('seo.serviceDescription'),
        url: canonicalUrl.value,
        image: ogImage,
        telephone: CONTACT_PHONE_E164,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Cartagena de Indias',
          addressRegion: 'Bolívar',
          addressCountry: 'CO',
        },
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
        provider: personSchemaRef(),
        serviceType: [
          'Frontend Development',
          'Senior Frontend Development',
          'Website Development',
          'Web Development',
          'Fullstack Development',
          'Vue.js Consulting',
          'Nuxt.js Development',
          'TypeScript Engineering',
          'Design System Engineering',
          'Micro-frontend Architecture',
          'Core Web Vitals Optimization',
          'Node.js Backend Development',
          'Express.js API Development',
          'E-commerce Frontend Development',
          'Retailtech Engineering',
          'AI-Assisted Craft',
          'AI-Augmented Engineering',
          'AI/NLP Product Integration',
          'Ed-tech Frontend Engineering',
          'Remote Frontend Contracting',
          'LatAm Remote Contracting',
        ],
        knowsAbout: [...PERSON_KNOWS_ABOUT],
      }),
    ],
  }));
};
