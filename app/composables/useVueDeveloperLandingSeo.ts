import { useExpertiseLandingSeo } from './useExpertiseLandingSeo';

export const useVueDeveloperLandingSeo = () =>
  useExpertiseLandingSeo({
    translationKey: 'landingVue',
    paths: {
      en: '/vue-frontend-developer',
      es: '/desarrollador-vue',
    },
    knowsAbout: ['Vue.js', 'Nuxt.js', 'TypeScript', 'Frontend Development'],
  });
