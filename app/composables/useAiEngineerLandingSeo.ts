import { useExpertiseLandingSeo } from './useExpertiseLandingSeo';

export const useAiEngineerLandingSeo = () =>
  useExpertiseLandingSeo({
    translationKey: 'landingAi',
    paths: {
      en: '/ai-engineer',
      es: '/ingeniero-ia',
    },
    jobTitles: [
      'Ingeniero de IA',
      'AI Engineer',
      'Ingeniero NLP',
      'NLP Engineer',
      'LLM Engineer',
      'Ingeniero LLM',
    ],
    knowsAbout: [
      'Artificial Intelligence',
      'Natural Language Processing',
      'Large Language Models',
      'Conversational AI',
      'Speech AI',
      'AI-assisted Software Engineering',
      'Agentic Coding',
      'Vibe Coding Cleanup',
      'Local LLMs',
      'Ollama',
      'llama.cpp',
      'Cursor',
      'GitHub Copilot',
      'Claude Code',
      'Ed-tech',
      'Vue.js',
      'Nuxt.js',
      'TypeScript',
      'Production AI Integration',
    ],
  });
