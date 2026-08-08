// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from '@tailwindcss/vite';
import { prerenderRoutesWithSitemap, sitemapUrls } from './app/config/routes.manifest';
import { buildThemeInitScript } from './app/utils/themeInitScript';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: process.env.NODE_ENV === 'development' },
  future: {
    compatibilityVersion: 4,
  },

  // Site configuration for SEO modules
  // trailingSlash: keep loc/canonicals with `/` — Netlify serves directory URLs that way.
  site: {
    url: 'https://cesargomez.dev',
    // SERP site name — must match WebSite.name / og:site_name (SITE_NAME in seo.config).
    name: 'César Gómez',
    trailingSlash: true,
  },

  nitro: {
    // Allow alternate output when `.output` is locked by a local preview process.
    output: {
      dir: process.env.NUXT_OUTPUT_DIR || '.output',
    },
    prerender: {
      crawlLinks: true,
      // Page HTML + sitemap XML (zeroRuntime must emit static files for --no-build).
      routes: prerenderRoutesWithSitemap(),
    },
    compressPublicAssets: true,
  },

  app: {
    baseURL: '/',
    head: {
      htmlAttrs: {
        // Matches DEFAULT_THEME_ID (github-dark); theme-init script may flip for light presets
        class: 'app-dark',
        'data-theme-font': 'fira-code',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        // Matches DEFAULT_THEME_ID (github-dark); runtime script overrides per visitor
        { name: 'theme-color', content: '#58a6ff' },
        { name: 'msapplication-TileColor', content: '#58a6ff' },
        { name: 'msapplication-TileImage', content: '/apple-touch-icon.png?v=cg2' },
        { 'http-equiv': 'X-Content-Type-Options', content: 'nosniff' },
        { 'http-equiv': 'X-XSS-Protection', content: '1; mode=block' },
      ],
      // Blocking: apply persisted palette before first paint (avoids red→theme FOUC)
      script: [
        {
          key: 'theme-init',
          innerHTML: buildThemeInitScript(),
          tagPosition: 'head',
        },
      ],
      link: [
        { rel: 'dns-prefetch', href: '//www.linkedin.com' },
        { rel: 'dns-prefetch', href: '//github.com' },
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png?v=cg2' },
        {
          id: 'theme-favicon',
          key: 'theme-favicon',
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon.svg?v=cg2',
        },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png?v=cg2' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png?v=cg2' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico?v=cg2' },
        { rel: 'alternate', type: 'text/plain', href: '/llms.txt', title: 'LLM context' },
        { rel: 'alternate', type: 'text/plain', href: '/ai.txt', title: 'AI assistant pointer' },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      // Avoid prebundling the full @vueuse/core barrel into the graph.
      include: ['@unhead/schema-org/vue'],
    },
    build: {
      modulePreload: false,
      // One stylesheet discoverable from HTML — avoids JS→CSS→JS critical chains
      // (Lighthouse Network Dependency Tree). Tiny per-section CSS files were
      // only found after entry JS executed.
      // https://developer.chrome.com/docs/performance/insights/network-dependency-tree
      cssCodeSplit: false,
    },
  },

  // Publish client maps so LH "large JS without source maps" is green.
  sourcemap: {
    client: true,
    server: false,
  },

  // Inline global + component CSS into SSR HTML so first paint does not wait on
  // render-blocking <link rel="stylesheet"> (Chrome "Render-blocking requests").
  // https://nuxt.com/docs/4.x/guide/going-further/features#inlinestyles
  features: {
    inlineStyles: true,
  },

  hooks: {
    // Strip dynamicImports so Lazy islands are not preloaded before LCP.
    // CSS discovery: scripts/inject-entry-css-link.mjs adds rel=preload as=style
    // for the cssCodeSplit:false bundle (not a blocking stylesheet — paint stays
    // on inlineStyles; avoids HTML→JS→CSS-only discovery).
    // https://developer.chrome.com/docs/performance/insights/network-dependency-tree
    'build:manifest'(manifest) {
      for (const item of Object.values(manifest)) {
        item.dynamicImports = [];
        if (item.prefetch) item.prefetch = false;

        const keepCss =
          item.isEntry === true ||
          (Array.isArray(item.css) &&
            item.css.some((file) => /(?:^|\/)(?:style|entry)\./.test(String(file))));

        if (keepCss) {
          continue;
        }

        item.css = [];
        if (item.preload) item.preload = false;
      }
    },
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    ...(process.env.NODE_ENV === 'development' ? (['@nuxt/hints'] as const) : []),
    '@nuxt/icon',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
    '@primevue/nuxt-module',
  ],

  fonts: {
    defaults: {
      // Skip 500 — rarely used; fewer @font-face rules on the critical CSS path.
      weights: [400, 600, 700],
      styles: ['normal'],
      subsets: ['latin'],
    },
    // Process --font-* only. `true` makes the transformer treat Tailwind layout
    // values such as calc(var(--spacing) * 2) as font faces during OG generation.
    processCSSVariables: 'font-prefixed-only',
    families: [
      {
        name: 'Outfit',
        provider: 'google',
        // Sans themes only — do not put Outfit in the default Fira stack (see themePresets).
        // Faces stay global so theme switches work; browser downloads only when used.
        weights: [400, 600, 700],
        preload: false,
        global: true,
      },
      {
        // Default theme font (`data-theme-font="fira-code"`).
        // Do NOT preload: LCP is the hero photo; font preload steals slow-4G bandwidth and
        // still lands on PSI's critical path even with font-display:optional.
        // global: ship @font-face even though first paint uses local fallbacks only
        // (theme-init / useTheme name "Fira Code" only after load+idle).
        // Mono fallbacks so deferred webfont activation does not CLS the hero name
        // (proportional Segoe/Arial metrics cannot match a monospace face).
        name: 'Fira Code',
        provider: 'google',
        weights: [400, 600, 700],
        preload: false,
        global: true,
        fallbacks: ['Consolas', 'Monaco', 'Menlo', 'Courier New'],
      },
    ],
  },

  icon: {
    // CSS classes for icons (no @iconify/vue runtime / client SVG bundle in entry).
    mode: 'css',
    // Static Netlify has no /api/_nuxt_icon; never hit api.iconify.design (CSP connect-src).
    provider: 'none',
    fallbackToApi: false,
    serverBundle: 'local',
    // Scan templates (incl. Lazy islands) so icons ship offline — empty scan broke prod icons.
    clientBundle: {
      scan: true,
    },
  },

  // SEO module configuration
  // Build-time OG PNGs (static Netlify generate) — no runtime signing secret needed
  ogImage: {
    zeroRuntime: true,
    defaults: {
      width: 1200,
      height: 630,
      alt: 'César Gómez — Senior Vue/Nuxt · AI-Assisted Craft',
    },
    // Prerender can exceed the module default (15s) under Windows + cold Chromium.
    security: {
      renderTimeout: 60_000,
    },
  },

  robots: {
    disallow: [],
    robotsTxt: false,
  },

  sitemap: {
    strictNuxtContentPaths: true,
    zeroRuntime: true,
    xsl: false,
    // Trailing slashes match static directory output (avoids GSC "Redirect error").
    urls: sitemapUrls(),
  },

  image: {
    quality: 80,
    format: ['webp', 'avif', 'jpeg'],
    domains: [],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },

  primevue: {
    autoImport: false,
    components: {
      // Manual imports in SFCs so Dialog/form widgets stay out of the entry chunk.
      include: [],
    },
    directives: {
      include: [],
    },
    composables: {
      include: [],
    },
    importTheme: {
      as: 'PrimeVueTheme',
      from: '~/themes/primevue',
    },
  },

  i18n: {
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'es', language: 'es-ES', name: 'Español', file: 'es.json' },
    ],
    defaultLocale: 'en',
    langDir: '../i18n/locales',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
    bundle: {
      compositionOnly: true,
    },
    experimental: {
      // Serve hashed messages.json as static assets (shorter critical chain vs Nitro route).
      prerenderMessages: !process.env.VITEST,
    },
  },

  runtimeConfig: {
    public: {
      // Netlify production default; GitHub Pages redirect artifact does not use the form
      contactProvider: 'netlify',
      // Facebook Sharing Debugger asks for fb:app_id. Override with your own App ID via
      // NUXT_PUBLIC_FACEBOOK_APP_ID. Default is Meta's public fallback ID (silences the warning).
      facebookAppId: '966242223397117',
      // Optional GA4 measurement ID — RUM loads gtag only with analytics consent (see quality/RUM.md).
      gaMeasurementId: '',
    },
  },

  experimental: {
    // Match site.trailingSlash / Netlify directory URLs so internal NuxtLinks
    // never emit bare profile paths that 301 to the slash form (GSC redirects).
    defaults: {
      nuxtLink: {
        trailingSlash: 'append',
      },
    },
    // Inline payload in HTML for the first visit; extract only for client navigations.
    // Shortens the "Network dependency tree" chain (no critical meta JSON before paint).
    // https://developer.chrome.com/docs/performance/insights/network-dependency-tree
    payloadExtraction: 'client',
    renderJsonPayloads: true,
    // Static portfolio — no client route-rules manifest fetch on the critical path.
    appManifest: false,
  },
});
