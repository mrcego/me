import { useExpertiseLandingSeo } from './useExpertiseLandingSeo';

export const useAngularDeveloperLandingSeo = () =>
  useExpertiseLandingSeo({
    translationKey: 'landingAngular',
    paths: {
      en: '/angular-developer',
      es: '/desarrollador-angular',
    },
    jobTitles: [
      'Desarrollador Angular',
      'Angular Developer',
      'Senior Angular Engineer',
      'Desarrollador Frontend Angular (v16+)',
    ],
    knowsAbout: [
      'Angular',
      'Angular 16',
      'TypeScript',
      'RxJS',
      'NgRx',
      'Frontend Architecture',
      'Signals',
      'Standalone Components',
    ],
  });
