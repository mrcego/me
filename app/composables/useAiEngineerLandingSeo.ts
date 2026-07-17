import { useExpertiseLandingSeo } from './useExpertiseLandingSeo';

export const useAiEngineerLandingSeo = () =>
  useExpertiseLandingSeo({
    translationKey: 'landingAi',
    paths: {
      en: '/ai-engineer',
      es: '/ingeniero-ia',
    },
    knowsAbout: [
      'Artificial Intelligence',
      'Natural Language Processing',
      'Large Language Models',
      'AI-assisted Software Engineering',
      'Vue.js',
      'Nuxt.js',
    ],
  });
