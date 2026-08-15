import {
  ANGIE_KNOWLEDGE_BASE,
  type AngieAction,
  type AngieKnowledgeEntry,
} from '../config/angie.knowledge';

export interface AngieWorkerRequest {
  id: string;
  query: string;
  locale: 'en' | 'es';
}

export interface AngieWorkerResponse {
  id: string;
  type: 'chunk' | 'done' | 'error';
  chunk?: string;
  fullText?: string;
  actions?: AngieAction[];
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .trim();
}

export function searchKnowledge(
  query: string,
  locale: 'en' | 'es',
): {
  entry: AngieKnowledgeEntry | null;
  confidence: number;
} {
  const normQuery = normalize(query);
  const queryTokens = normQuery.split(/\s+/).filter(Boolean);

  if (!queryTokens.length) {
    return { entry: null, confidence: 0 };
  }

  let bestEntry: AngieKnowledgeEntry | null = null;
  let bestScore = 0;

  for (const entry of ANGIE_KNOWLEDGE_BASE) {
    let score = 0;
    const keywords = entry.keywords[locale] || entry.keywords.en;
    const content = normalize(entry.content[locale] || entry.content.en);
    const title = normalize(entry.title[locale] || entry.title.en);

    for (const token of queryTokens) {
      for (const kw of keywords) {
        const normKw = normalize(kw);
        if (normKw === token) score += 10;
        else if (normKw.includes(token) || token.includes(normKw)) score += 4;
      }
      if (title.includes(token)) score += 3;
      if (content.includes(token)) score += 1;
    }

    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }

  return {
    entry: bestEntry,
    confidence: bestScore,
  };
}

export function synthesizeResponse(
  query: string,
  locale: 'en' | 'es',
): { text: string; actions: AngieAction[] } {
  const norm = normalize(query);

  // Greetings check
  const greetingsEn = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'help'];
  const greetingsEs = ['hola', 'buenos dias', 'buenas tardes', 'buenas noches', 'saludos', 'ayuda'];
  const isGreeting = (locale === 'es' ? greetingsEs : greetingsEn).some(
    (g) => norm.startsWith(g) || norm === g,
  );

  if (isGreeting && norm.length <= 15) {
    return {
      text:
        locale === 'es'
          ? '¡Hola! Soy Angie, la asistente de IA de César Gómez. Puedo responder preguntas sobre su experiencia de más de 13 años, stack tecnológico (Vue/Nuxt/TypeScript), casos de estudio de producción (Colegium, LingoQuesto, TISSINI) y opciones de contratación.'
          : "Hello! I'm Angie, César Gómez's AI Portfolio Concierge. I can answer questions about his 13+ years of production experience, tech stack (Vue/Nuxt/TypeScript), enterprise case studies (Colegium, LingoQuesto, TISSINI), and availability for hire.",
      actions: [
        {
          id: 'act_hire',
          type: 'navigate',
          target: '#hire-profiles',
          labelKey: 'angie.actions.viewProfiles',
        },
        {
          id: 'act_stack',
          type: 'navigate',
          target: '#tech-stack',
          labelKey: 'angie.actions.viewTechStack',
        },
      ],
    };
  }

  const { entry, confidence } = searchKnowledge(query, locale);

  if (entry && confidence >= 4) {
    return {
      text: entry.content[locale] || entry.content.en,
      actions: entry.actions || [],
    };
  }

  // Fallback response with helpful recommendations
  return {
    text:
      locale === 'es'
        ? 'No tengo un registro exacto para esa consulta específica, pero puedo ayudarte con el stack técnico de César (Vue 3, Nuxt 4, Node.js), sus casos de estudio en Colegium y LingoQuesto, o coordinar una conversación directa a través del formulario de contacto.'
        : "I don't have a precise record for that exact query, but I can assist you with César's technical stack (Vue 3, Nuxt 4, Node.js), his enterprise case studies (Colegium, LingoQuesto), or help you schedule a call via the contact transmission form.",
    actions: [
      {
        id: 'act_contact_fallback',
        type: 'contact_form',
        target: '#contact',
        labelKey: 'angie.actions.openContactForm',
      },
      {
        id: 'act_about_fallback',
        type: 'navigate',
        target: '#about',
        labelKey: 'angie.actions.viewAbout',
      },
    ],
  };
}

if (typeof self !== 'undefined' && 'addEventListener' in self) {
  self.addEventListener('message', async (event: MessageEvent<AngieWorkerRequest>) => {
    const { id, query, locale } = event.data;
    if (!id || !query) return;

    try {
      const { text, actions } = synthesizeResponse(query, locale || 'en');

      // Stream text in words/tokens to simulate hyper-smooth LLM generation
      const tokens = text.split(' ');
      let accumulated = '';

      for (let i = 0; i < tokens.length; i += 1) {
        accumulated += (i === 0 ? '' : ' ') + tokens[i];
        self.postMessage({
          id,
          type: 'chunk',
          chunk: accumulated,
        });
        // Non-blocking micro-delay for typewriter feel
        await new Promise((resolve) => setTimeout(resolve, 18));
      }

      self.postMessage({
        id,
        type: 'done',
        fullText: text,
        actions,
      });
    } catch {
      self.postMessage({
        id,
        type: 'error',
        fullText:
          locale === 'es'
            ? 'Ocurrió un error al procesar tu consulta.'
            : 'An error occurred while processing your request.',
      });
    }
  });
}
