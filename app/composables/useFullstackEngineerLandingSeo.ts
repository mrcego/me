import { useExpertiseLandingSeo } from './useExpertiseLandingSeo';

export const useFullstackEngineerLandingSeo = () =>
  useExpertiseLandingSeo({
    translationKey: 'landingFullstack',
    paths: {
      en: '/fullstack-engineer',
      es: '/ingeniero-fullstack',
    },
    jobTitles: [
      'Ingeniero Fullstack Senior',
      'Senior Fullstack Engineer',
      'Desarrollador Fullstack Vue/Node',
      'Fullstack Web Specialist',
    ],
    knowsAbout: [
      'Fullstack Development',
      'Vue 3',
      'Nuxt 4',
      'Node.js',
      'TypeScript',
      'REST APIs',
      'GraphQL',
      'PostgreSQL',
      'Docker',
    ],
  });
