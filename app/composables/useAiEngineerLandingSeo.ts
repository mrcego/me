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
      'Conversational AI',
      'AI-assisted Software Engineering',
      'Vibe Coding Cleanup',
      'Local LLMs',
      'Ollama',
      'Ed-tech',
      'Vue.js',
      'Nuxt.js',
    ],
  });
