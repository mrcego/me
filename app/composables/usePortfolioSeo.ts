import {
  PERSON_ENTITY_URL,
  PERSON_KNOWS_ABOUT,
  PERSON_SCHEMA_ID,
  SEO_EDITORIAL_DATES,
  SEO_IDENTITY,
  WEBSITE_SCHEMA_ID,
} from '~/config/seo.config';
import {
  buildHreflangAlternateLinks,
  htmlLangForLocale,
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

  defineOgImage(
    'Portfolio',
    {
      title: personName.value,
      description: t('hero.title'),
      brandName: locale.value === 'es' ? 'CÉSAR GÓMEZ' : 'CESAR GOMEZ',
      brandTag: 'PORTFOLIO',
      siteUrl: 'cesargomez.dev',
      footer: t('hero.locationLine'),
      pills: ['Vue.js', 'Nuxt', 'TypeScript', 'AI-Assisted'],
    },
    {
      alt: `${personName.value} — ${t('hero.title')}`,
    },
  );

  useSeoMeta({
    // Keep tab/share titles in sync with the hero subtitle after the name.
    title: () => t('hero.title'),
    description: () => t('seo.description'),
    author: SEO_IDENTITY.author,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    fbAppId: () => String(publicConfig.facebookAppId || ''),

    ogType: 'profile',
    ogTitle: () => t('hero.title'),
    ogDescription: () => t('seo.ogDescription'),
    // og:image / twitter:image injected by defineOgImage('Portfolio')
    ogUrl: () => canonicalUrl.value,
    ogSiteName: 'César Gómez Portfolio',
    ogLocale: () => ogLocaleForLocale(locale.value),

    twitterCard: SEO_IDENTITY.twitterCard,
    twitterTitle: () => t('hero.title'),
    twitterDescription: () => t('seo.ogDescription'),
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
      {
        type: 'application/ld+json',
        key: 'schema-person',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          '@id': PERSON_SCHEMA_ID,
          name: personName.value,
          givenName: locale.value === 'es' ? 'César' : 'Cesar',
          familyName: locale.value === 'es' ? 'Gómez' : 'Gomez',
          alternateName: ['César Gómez', 'Cesar Gomez', 'mrcego'],
          jobTitle: t('hero.title'),
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
            PERSON_ENTITY_URL,
          ],
          knowsAbout: [...PERSON_KNOWS_ABOUT],
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
          '@id': WEBSITE_SCHEMA_ID,
          name: t('seo.siteName'),
          description: t('seo.description'),
          url: PERSON_ENTITY_URL,
          inLanguage: ['en-US', 'es-ES'],
          publisher: personSchemaRef(),
          about: personSchemaRef(),
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
          inLanguage: htmlLangForLocale(locale.value),
          dateCreated: SEO_EDITORIAL_DATES.profileCreated,
          dateModified: SEO_EDITORIAL_DATES.lastModified,
          // Reference only — full Person node is published once above
          mainEntity: personSchemaRef(),
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
            'AI-Assisted Craft',
            'Vibe Coding Cleanup',
            'AI/NLP Product Integration',
            'Ed-tech Frontend Engineering',
            'Remote Frontend Contracting',
            'LatAm Remote Contracting',
          ],
          knowsAbout: [...PERSON_KNOWS_ABOUT],
        }),
      },
    ],
  }));
};
