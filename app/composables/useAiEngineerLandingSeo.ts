import { useExpertiseLandingSeo } from './useExpertiseLandingSeo';

export const useAiEngineerLandingSeo = () =>
  useExpertiseLandingSeo({
    translationKey: 'landingAi',
    paths: {
      en: '/ai-engineer',
      es: '/ingeniero-ia',
    },
    jobTitles: [
      'Vibe Coding Cleanup Specialist',
      'AI-Assisted Craft',
      'Senior Vue/Nuxt Developer',
      'Desarrollador Vue/Nuxt Senior',
      'Craft asistido por IA',
    ],
    knowsAbout: [
      'AI-Assisted Software Engineering',
      'Vibe Coding Cleanup',
      'Agentic Coding',
      'Agent-assisted Development',
      'Cursor',
      'GitHub Copilot',
      'Claude Code',
      'Production Code Quality',
      'Ed-tech',
      'AI/NLP Product Integration',
      'Vue.js',
      'Nuxt.js',
      'TypeScript',
    ],
  });
