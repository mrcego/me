// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from '@tailwindcss/vite';
import { buildThemeInitScript } from './app/utils/themeInitScript';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: process.env.NODE_ENV === 'development' },
  future: {
    compatibilityVersion: 4,
  },

  // Site configuration for SEO modules
  site: {
    url: 'https://cesargomez.dev',
    name: 'César Gómez Portfolio',
  },

  nitro: {
    // Allow alternate output when `.output` is locked by a local preview process.
    output: {
      dir: process.env.NUXT_OUTPUT_DIR || '.output',
    },
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/es',
        '/vue-frontend-developer',
        '/es/desarrollador-vue',
        '/ai-engineer',
        '/es/ingeniero-ia',
        '/nodejs-backend-developer',
        '/es/desarrollador-backend-nodejs',
      ],
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
        { name: 'msapplication-TileImage', content: '/apple-touch-icon.png?v=cg1' },
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
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png?v=cg1' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg?v=cg1' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png?v=cg1' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png?v=cg1' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico?v=cg1' },
        { rel: 'alternate', type: 'text/plain', href: '/llms.txt', title: 'LLM context' },
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
    // CSS discovery: scripts/inject-entry-css-link.mjs adds an early <link> for
    // the cssCodeSplit:false bundle after generate (Nuxt inlineStyles alone still
    // left CSS only reachable via the JS module graph).
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
      weights: [400, 500, 600, 700],
      styles: ['normal'],
      subsets: ['latin'],
    },
    families: [
      {
        name: 'Outfit',
        provider: 'google',
        // Sans themes + Fira fallback — load globally but keep light
        weights: [400, 600, 700],
        preload: false,
        global: true,
      },
      {
        // Default theme font (`data-theme-font="fira-code"`) — preload for LCP/FCP
        name: 'Fira Code',
        provider: 'google',
        weights: [400, 600, 700],
        preload: true,
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
    clientBundle: {
      // Scan templates (incl. Lazy modals) so icons like lucide:x ship in the build.
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
      alt: 'César Gómez Portfolio',
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
    urls: [
      '/',
      '/es',
      '/vue-frontend-developer',
      '/es/desarrollador-vue',
      '/ai-engineer',
      '/es/ingeniero-ia',
      '/nodejs-backend-developer',
      '/es/desarrollador-backend-nodejs',
    ],
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
      prerenderMessages: true,
    },
  },

  runtimeConfig: {
    public: {
      // Netlify production default; GitHub Pages redirect artifact does not use the form
      contactProvider: 'netlify',
      // Facebook Sharing Debugger asks for fb:app_id. Override with your own App ID via
      // NUXT_PUBLIC_FACEBOOK_APP_ID. Default is Meta's public fallback ID (silences the warning).
      facebookAppId: '966242223397117',
    },
  },

  experimental: {
    // Inline payload in HTML for the first visit; extract only for client navigations.
    // Shortens the "Network dependency tree" chain (no critical meta JSON before paint).
    // https://developer.chrome.com/docs/performance/insights/network-dependency-tree
    payloadExtraction: 'client',
    renderJsonPayloads: true,
    // Static portfolio — no client route-rules manifest fetch on the critical path.
    appManifest: false,
  },
});
