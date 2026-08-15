import { useExpertiseLandingSeo } from './useExpertiseLandingSeo';

export const useAiCraftLandingSeo = () =>
  useExpertiseLandingSeo({
    translationKey: 'landingCraft',
    paths: {
      en: '/ai-assisted-craft',
      es: '/craft-asistido-ia',
    },
    jobTitles: [
      'AI-Assisted Craft',
      'AI-Augmented Software Engineer',
      'Senior Vue/Nuxt Developer',
      'Craft asistido por IA',
    ],
    knowsAbout: [
      'AI-Assisted Craft',
      'AI-Augmented Engineering',
      'Cursor',
      'GitHub Copilot',
      'Claude Code',
      'Vue.js',
      'Nuxt.js',
      'TypeScript',
      'Quality Gates',
      'Agent-assisted Development',
    ],
  });
