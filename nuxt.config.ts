// https://nuxt.com/docs/api/configuration/nuxt-config

import Aura from '@primeuix/themes/aura';
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      title: 'César Gómez - Senior Fullstack Developer | Vue.js & Nuxt.js Expert',
      titleTemplate: '%s',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Senior Fullstack Developer with 13+ years of experience specializing in Frontend Excellence. Expert in Vue.js, Nuxt.js, TypeScript, and modern web architectures.' },
        { name: 'keywords', content: 'Vue.js, Nuxt.js, Frontend Developer, Fullstack Developer, TypeScript, Senior Developer, JavaScript, Node.js, Web Development, César Gómez' },
        { name: 'author', content: 'César Gómez' },
        { name: 'theme-color', content: '#ff4b5c' },

        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'César Gómez Portfolio' },
        { property: 'og:title', content: 'César Gómez - Senior Fullstack Developer' },
        { property: 'og:description', content: 'Senior Fullstack Developer with 13+ years of experience specializing in Frontend Excellence. Expert in Vue.js, Nuxt.js, and TypeScript.' },
        { property: 'og:image', content: '/img/og-image.svg' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:url', content: 'https://cesargomezh.github.io' },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'César Gómez - Senior Fullstack Developer' },
        { name: 'twitter:description', content: 'Senior Fullstack Developer specializing in Vue.js, Nuxt.js, and Frontend Excellence' },
        { name: 'twitter:image', content: '/img/og-image.svg' },
        { name: 'twitter:creator', content: '@cesargomezh' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://cesargomezh.github.io' }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/hints',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@primevue/nuxt-module',
    '@nuxtjs/i18n'
  ],

  image: {
    quality: 80,
    format: ['webp', 'avif', 'jpeg'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    }
  },

  primevue: {
    options: {
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.app-dark'
        }
      }
    }
  },

  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', name: 'English', file: 'en.json' },
      { code: 'es', iso: 'es-ES', name: 'Español', file: 'es.json' }
    ],
    defaultLocale: 'en',
    lazy: true,
    langDir: 'locales',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      redirectOn: 'root'
    }
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/']
    }
  }
})