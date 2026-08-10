import { useExpertiseLandingSeo } from './useExpertiseLandingSeo';

export const useFrontendArchitectLandingSeo = () =>
  useExpertiseLandingSeo({
    translationKey: 'landingArchitect',
    paths: {
      en: '/frontend-architect',
      es: '/arquitecto-frontend',
    },
    jobTitles: [
      'Arquitecto Frontend',
      'Frontend Architect',
      'Principal Frontend Engineer',
      'Líder de Arquitectura Web',
    ],
    knowsAbout: [
      'Frontend Architecture',
      'Vue 3',
      'Nuxt 4',
      'Micro-frontends',
      'Design Systems',
      'TypeScript',
      'Core Web Vitals',
      'Performance Optimization',
      'CI/CD Pipelines',
    ],
  });
