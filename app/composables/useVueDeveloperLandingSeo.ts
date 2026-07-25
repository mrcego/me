import { useExpertiseLandingSeo } from './useExpertiseLandingSeo';

export const useVueDeveloperLandingSeo = () =>
  useExpertiseLandingSeo({
    translationKey: 'landingVue',
    paths: {
      en: '/vue-frontend-developer',
      es: '/desarrollador-vue',
    },
    knowsAbout: [
      'Vue.js',
      'Vue 3',
      'Nuxt.js',
      'Nuxt 4',
      'TypeScript',
      'Frontend Development',
      'Senior Frontend Development',
      'Website Development',
      'Design Systems',
      'Web Performance',
      'Ed-tech',
    ],
  });
