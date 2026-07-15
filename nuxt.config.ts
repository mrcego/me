// https://nuxt.com/docs/api/configuration/nuxt-config

import Aura from '@primeuix/themes/aura';
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
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
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#ff4b5c' },
        { name: 'msapplication-TileColor', content: '#ff4b5c' },
        { name: 'msapplication-TileImage', content: '/apple-touch-icon.png' },
        { 'http-equiv': 'X-Content-Type-Options', content: 'nosniff' },
        { 'http-equiv': 'X-XSS-Protection', content: '1; mode=block' },
      ],
      link: [
        { rel: 'dns-prefetch', href: '//www.linkedin.com' },
        { rel: 'dns-prefetch', href: '//github.com' },
        { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com', crossorigin: '' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800;900&display=swap',
        },
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

  css: ['~/assets/css/main.css', 'primeicons/primeicons.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/hints',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
    '@primevue/nuxt-module',
  ],

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
    options: {
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.app-dark',
        },
      },
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
    payloadExtraction: false,
    renderJsonPayloads: true,
  },
});
