import { useExpertiseLandingSeo } from './useExpertiseLandingSeo';

export const useNodeBackendLandingSeo = () =>
  useExpertiseLandingSeo({
    translationKey: 'landingNode',
    paths: {
      en: '/nodejs-backend-developer',
      es: '/desarrollador-backend-nodejs',
    },
    knowsAbout: [
      'Node.js',
      'Express.js',
      'REST APIs',
      'TypeScript',
      'Backend Engineering',
      'Fullstack Development',
    ],
  });
