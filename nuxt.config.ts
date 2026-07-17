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
    prerender: {
      crawlLinks: true,
      routes: ['/', '/es', '/vue-frontend-developer', '/es/desarrollador-vue'],
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
        { name: 'msapplication-TileImage', content: '/apple-touch-icon.png' },
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
        { rel: 'preconnect', href: 'https://www.linkedin.com', crossorigin: '' },
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'alternate', type: 'text/plain', href: '/llms.txt', title: 'LLM context' },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    ...(process.env.NODE_ENV === 'development' ? (['@nuxt/hints'] as const) : []),
    '@nuxt/icon',
    '@nuxt/image',
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
        weights: [400, 500, 600, 700, 800, 900],
        preload: true,
      },
      {
        // Google Fira Code tops out at 700 — themes using it clamp font-black via CSS
        name: 'Fira Code',
        provider: 'google',
        weights: [300, 400, 500, 600, 700],
        preload: true,
      },
    ],
  },

  // SEO module configuration
  robots: {
    disallow: [],
    robotsTxt: false,
  },

  sitemap: {
    strictNuxtContentPaths: true,
    xsl: false,
    urls: ['/', '/es', '/vue-frontend-developer', '/es/desarrollador-vue'],
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
      include: ['Button', 'Dialog', 'InputText', 'Message', 'Textarea'],
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
  },

  runtimeConfig: {
    public: {
      // Netlify production default; GitHub Pages redirect artifact does not use the form
      contactProvider: 'netlify',
    },
  },

  experimental: {
    payloadExtraction: true,
    renderJsonPayloads: true,
  },
});
