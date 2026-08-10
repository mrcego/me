import { useExpertiseLandingSeo } from './useExpertiseLandingSeo';

export const useNodeBackendLandingSeo = () =>
  useExpertiseLandingSeo({
    translationKey: 'landingNode',
    paths: {
      en: '/nodejs-backend-developer',
      es: '/desarrollador-backend-nodejs',
    },
    jobTitles: [
      'Desarrollador Node.js',
      'Node.js Developer',
      'Desarrollador Express.js',
      'Express.js Developer',
      'Node.js Backend Developer',
      'Desarrollador backend Node.js',
    ],
    knowsAbout: [
      'Node.js',
      'Express.js',
      'REST APIs',
      'TypeScript',
      'API Design',
      'API Contracts',
      'Backend Engineering',
      'Fullstack Development',
      'Vue.js',
      'Nuxt.js',
      'Frontend-Backend Integration',
      'Production APIs',
      'Remote Backend Contracting',
    ],
  });
