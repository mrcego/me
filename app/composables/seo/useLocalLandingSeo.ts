import { useExpertiseLandingSeo } from './useExpertiseLandingSeo';

export const useLocalLandingSeo = () =>
  useExpertiseLandingSeo({
    translationKey: 'landingLocal',
    paths: {
      en: '/web-developer-cartagena',
      es: '/desarrollo-web-cartagena',
    },
    jobTitles: [
      'Web Developer Cartagena',
      'Desarrollador Web Cartagena',
      'Desarrollador de Páginas Web',
      'Vue.js Developer Cartagena',
      'Nuxt Developer Colombia',
    ],
    knowsAbout: [
      'Web Development',
      'Páginas Web',
      'Vue.js',
      'Nuxt.js',
      'TypeScript',
      'Cartagena de Indias',
      'Colombia',
      'Remote Web Development',
      'Custom Websites',
      'Frontend Development',
    ],
  });
