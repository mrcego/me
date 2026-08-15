import { useExpertiseLandingSeo } from './useExpertiseLandingSeo';

export const useAiEngineerLandingSeo = () =>
  useExpertiseLandingSeo({
    translationKey: 'landingAi',
    paths: {
      en: '/ai-assisted-craft',
      es: '/craft-asistido-ia',
    },
    jobTitles: [
      'AI-Augmented Software Engineer',
      'AI-Assisted Craft Specialist',
      'Senior Fullstack Engineer',
      'Frontend Architecture Specialist',
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
