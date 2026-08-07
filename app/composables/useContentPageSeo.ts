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

interface ContentPageSeoOptions {
  /** i18n root key, e.g. caseColegium.meta.title */
  metaKey: string;
  paths: { en: string; es: string };
  breadcrumbNameKey?: string;
}

export const useContentPageSeo = (options: ContentPageSeoOptions) => {
  const { t, locale } = useI18n();
  const route = useRoute();
  const { public: publicConfig } = useRuntimeConfig();

  const canonicalUrl = computed(() => absoluteSiteUrl(route.path));
  const enUrl = absoluteSiteUrl(options.paths.en);
  const esUrl = absoluteSiteUrl(
    options.paths.es.startsWith('/es') ? options.paths.es : `/es${options.paths.es}`,
  );

  useSeoMeta({
    title: () => t(`${options.metaKey}.title`),
    description: () => t(`${options.metaKey}.description`),
    author: SEO_IDENTITY.author,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    fbAppId: () => String(publicConfig.facebookAppId || ''),
    ogType: 'article',
    ogTitle: () => t(`${options.metaKey}.title`),
    ogDescription: () => t(`${options.metaKey}.description`),
    ogUrl: () => canonicalUrl.value,
    ogSiteName: SITE_NAME,
    ogLocale: () => ogLocaleForLocale(locale.value),
    twitterCard: SEO_IDENTITY.twitterCard,
    twitterTitle: () => t(`${options.metaKey}.title`),
    twitterDescription: () => t(`${options.metaKey}.description`),
    twitterSite: SEO_IDENTITY.twitterSite,
    twitterCreator: SEO_IDENTITY.twitterCreator,
  });

  useHead(() => ({
    htmlAttrs: { lang: htmlLangForLocale(locale.value) },
    link: [
      { rel: 'canonical', href: canonicalUrl.value },
      ...buildHreflangAlternateLinks({ en: enUrl, es: esUrl }),
    ],
    script: [
      jsonLdScript(`content-${options.metaKey}-webpage`, {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${canonicalUrl.value}#webpage`,
        url: canonicalUrl.value,
        name: t(`${options.metaKey}.title`),
        description: t(`${options.metaKey}.description`),
        inLanguage: htmlLangForLocale(locale.value),
        isPartOf: websiteSchemaRef(),
        about: personSchemaRef(),
        mainEntity: personSchemaRef(),
        primaryImageOfPage: `${SITE_ORIGIN}${SEO_IDENTITY.ogImage}`,
      }),
      jsonLdScript(`content-${options.metaKey}-breadcrumb`, {
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
            name: t(options.breadcrumbNameKey || `${options.metaKey}.title`),
            item: canonicalUrl.value,
          },
        ],
      }),
    ],
  }));
};
