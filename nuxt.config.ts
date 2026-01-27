// https://nuxt.com/docs/api/configuration/nuxt-config

import Aura from '@primeuix/themes/aura';
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4
  },

  // GitHub Pages configuration
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/']
    },
    compressPublicAssets: true
  },

  app: {
    baseURL: '/me',
    head: {
      title: 'César Gómez - Senior Fullstack Developer',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Senior Fullstack Developer with 13+ years of experience specializing in Frontend Excellence. Expert in Vue.js, Nuxt.js, TypeScript, and modern web architectures.' },
        { name: 'keywords', content: 'César Gómez, Fullstack Developer, Vue.js, Nuxt.js, TypeScript, Frontend, Web Development, JavaScript, Node.js' },
        { name: 'author', content: 'César Gómez' },
        { name: 'robots', content: 'index, follow' },

        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'César Gómez - Senior Fullstack Developer' },
        { property: 'og:description', content: 'Senior Fullstack Developer with 13+ years of experience specializing in Frontend Excellence.' },
        { property: 'og:image', content: 'https://cesargomezh.github.io/img/og-image.svg' },
        { property: 'og:url', content: 'https://cesargomezh.github.io' },
        { property: 'og:site_name', content: 'César Gómez Portfolio' },

        // Twitter Cards
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'César Gómez - Senior Fullstack Developer' },
        { name: 'twitter:description', content: 'Senior Fullstack Developer with 13+ years of experience specializing in Frontend Excellence.' },
        { name: 'twitter:image', content: 'https://cesargomezh.github.io/img/og-image.svg' },
        { name: 'twitter:site', content: '@cesargomezh' },
        { name: 'twitter:creator', content: '@cesargomezh' },

        // Performance and PWA
        { name: 'theme-color', content: '#ff4b5c' },
        { name: 'msapplication-TileImage', content: '/apple-touch-icon.png' },
        { name: 'msapplication-TileColor', content: '#ff4b5c' },
        { 'http-equiv': 'X-Content-Type-Options', content: 'nosniff' },
        { 'http-equiv': 'X-XSS-Protection', content: '1; mode=block' }
      ],
      link: [
        // DNS prefetch for external domains
        { rel: 'dns-prefetch', href: '//www.linkedin.com' },
        { rel: 'dns-prefetch', href: '//github.com' },
        { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },

        // Preconnect for critical external resources
        { rel: 'preconnect', href: 'https://fonts.googleapis.com', crossorigin: '' },
        { rel: 'preconnect', href: 'https://www.linkedin.com', crossorigin: '' },

        // Web App Manifest
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://cesargomezh.github.io' }
      ],
      script: [
        // Structured Data for Person
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "César Gómez",
            "jobTitle": "Senior Fullstack Developer",
            "description": "Senior Fullstack Developer with 13+ years of experience specializing in Frontend Excellence. Expert in Vue.js, Nuxt.js, TypeScript, and modern web architectures.",
            "url": "https://cesargomezh.github.io",
            "image": "https://cesargomezh.github.io/img/me.jpg",
            "sameAs": [
              "https://linkedin.com/in/mrcego",
              "https://github.com/cesargomezh"
            ],
            "knowsAbout": [
              "Vue.js", "Nuxt.js", "TypeScript", "JavaScript", "Node.js",
              "Frontend Development", "Fullstack Development", "Web Architecture",
              "UI/UX Design", "Performance Optimization"
            ],
            "offers": {
              "@type": "Offer",
              "jobTitle": "Senior Fullstack Developer",
              "description": "Available for freelance and contract work specializing in Vue.js/Nuxt.js applications",
              "skills": "Vue.js, Nuxt.js, TypeScript, JavaScript, Node.js, Frontend Development, Fullstack Development",
              "employmentType": "Contract",
              "availableFrom": "2025-01-01"
            }
          })
        },
        // Structured Data for Website
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "César Gómez Portfolio",
            "description": "Senior Fullstack Developer with 13+ years of experience specializing in Frontend Excellence. Expert in Vue.js, Nuxt.js, TypeScript, and modern web architectures.",
            "url": "https://cesargomezh.github.io",
            "image": "https://cesargomezh.github.io/img/og-image.svg",
            "author": {
              "@type": "Person",
              "name": "César Gómez",
              "url": "https://cesargomezh.github.io"
            },
            "publisher": {
              "@type": "Organization",
              "name": "César Gómez",
              "logo": {
                "@type": "ImageObject",
                "url": "https://cesargomezh.github.io/img/logo-final.svg"
              }
            }
          })
        }
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
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
    ['@nuxtjs/sitemap', {
      sitemapUrl: 'https://cesargomezh.github.io/me',
      baseURL: '/me'
    }],
    '@nuxtjs/robots',
    '@primevue/nuxt-module'
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
    langDir: '../i18n/locales',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      redirectOn: 'root'
    },
    bundle: {
      optimizeTranslationDirective: false
    }
  },

  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: true
  }
})