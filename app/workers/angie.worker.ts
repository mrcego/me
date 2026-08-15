import {
  ANGIE_KNOWLEDGE_BASE,
  type AngieAction,
  type AngieKnowledgeEntry,
} from '../config/angie.knowledge';

export type AngieWorkerInboundMessage =
  { type: 'warmup' } | { type: 'query'; id: string; query: string; locale: 'en' | 'es' };

export type AngieWorkerOutboundMessage =
  | {
      type: 'neural_status';
      status: 'idle' | 'loading' | 'ready' | 'fallback';
      progress?: number;
      model?: string;
      error?: string;
    }
  | { id: string; type: 'chunk'; chunk: string }
  | { id: string; type: 'done'; fullText: string; actions?: AngieAction[]; isNeural?: boolean }
  | { id: string; type: 'error'; fullText: string };

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

export function buildRagContext(query: string, locale: 'en' | 'es'): string {
  const { entry } = searchKnowledge(query, locale);
  if (entry) {
    return `[TOPIC: ${entry.title[locale] || entry.title.en}]\n${entry.content[locale] || entry.content.en}`;
  }

  // General profile summary if no single topic matched strongly
  const topics = ANGIE_KNOWLEDGE_BASE.slice(0, 4)
    .map((e) => `- ${e.title[locale] || e.title.en}: ${e.content[locale] || e.content.en}`)
    .join('\n');
  return topics;
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

interface BrowserAIGenerateResult {
  choices?: Array<{ message?: { content?: string } }>;
  text?: string;
}

interface BrowserAIEngine {
  loadModel: (
    model: string,
    options?: {
      onProgress?: (p: { progress?: number; loaded?: number; total?: number }) => void;
    },
  ) => Promise<void>;
  generateText: (
    query: string,
    options?: { systemMessage?: string; temperature?: number; maxTokens?: number },
  ) => Promise<BrowserAIGenerateResult | string>;
}

let browserAIInstance: BrowserAIEngine | null = null;
let neuralStatus: 'idle' | 'loading' | 'ready' | 'fallback' = 'idle';
let warmupPromise: Promise<void> | null = null;

async function warmupNeuralEngine(): Promise<void> {
  if (neuralStatus === 'ready' || neuralStatus === 'loading') return;
  neuralStatus = 'loading';

  if (typeof self !== 'undefined' && 'postMessage' in self) {
    self.postMessage({
      type: 'neural_status',
      status: 'loading',
      progress: 5,
      model: 'smollm2-135m-instruct',
    } satisfies AngieWorkerOutboundMessage);
  }

  try {
    // Check WebGPU availability
    const hasWebGpu =
      typeof navigator !== 'undefined' &&
      'gpu' in navigator &&
      Boolean((navigator as unknown as { gpu?: unknown }).gpu);

    if (!hasWebGpu) {
      neuralStatus = 'fallback';
      if (typeof self !== 'undefined' && 'postMessage' in self) {
        self.postMessage({
          type: 'neural_status',
          status: 'fallback',
          error: 'WebGPU not available in environment; using deterministic fast mode.',
        } satisfies AngieWorkerOutboundMessage);
      }
      return;
    }

    const { BrowserAI } = await import('@browserai/browserai');
    browserAIInstance = new BrowserAI() as unknown as BrowserAIEngine;

    await browserAIInstance.loadModel('smollm2-135m-instruct', {
      onProgress: (p: { progress?: number; loaded?: number; total?: number }) => {
        let percent = 50;
        if (typeof p?.progress === 'number') {
          percent = Math.round(p.progress * 100);
        } else if (p?.loaded && p?.total) {
          percent = Math.round((p.loaded / p.total) * 100);
        }
        if (typeof self !== 'undefined' && 'postMessage' in self) {
          self.postMessage({
            type: 'neural_status',
            status: 'loading',
            progress: Math.min(Math.max(percent, 5), 98),
            model: 'smollm2-135m-instruct',
          } satisfies AngieWorkerOutboundMessage);
        }
      },
    });

    neuralStatus = 'ready';
    if (typeof self !== 'undefined' && 'postMessage' in self) {
      self.postMessage({
        type: 'neural_status',
        status: 'ready',
        progress: 100,
        model: 'smollm2-135m-instruct',
      } satisfies AngieWorkerOutboundMessage);
    }
  } catch (err) {
    neuralStatus = 'fallback';
    if (typeof self !== 'undefined' && 'postMessage' in self) {
      self.postMessage({
        type: 'neural_status',
        status: 'fallback',
        error: String(err),
      } satisfies AngieWorkerOutboundMessage);
    }
  }
}

if (typeof self !== 'undefined' && 'addEventListener' in self) {
  self.addEventListener('message', async (event: MessageEvent<AngieWorkerInboundMessage>) => {
    const data = event.data;
    if (!data) return;

    if (data.type === 'warmup') {
      if (!warmupPromise) {
        warmupPromise = warmupNeuralEngine();
      }
      await warmupPromise;
      return;
    }

    if (data.type === 'query') {
      const { id, query, locale } = data;
      if (!id || !query) return;

      try {
        // If neural engine is ready, generate via BrowserAI
        if (neuralStatus === 'ready' && browserAIInstance) {
          const ragContext = buildRagContext(query, locale || 'en');
          const systemPrompt =
            locale === 'es'
              ? `Eres Angie, la asistente de IA de César Gómez (Senior Fullstack Engineer & Frontend Architect con más de 13 años de experiencia). Responde de forma concisa, profesional y directa en español basándote en los siguientes datos verificados:\n${ragContext}\n\nResponde en máximo 2 a 3 oraciones.`
              : `You are Angie, the AI Portfolio Concierge for César Gómez (Senior Fullstack Engineer & Frontend Architect with 13+ years experience). Answer concisely, professionally, and accurately in English using the following verified facts:\n${ragContext}\n\nKeep response within 2 to 3 sentences.`;

          const result = await browserAIInstance.generateText(query, {
            systemMessage: systemPrompt,
            temperature: 0.2,
            maxTokens: 256,
          });

          let fullText = '';
          if (typeof result === 'string') {
            fullText = result;
          } else if (result?.choices?.[0]?.message?.content) {
            fullText = result.choices[0].message.content;
          } else if (result?.text) {
            fullText = result.text;
          }

          if (!fullText.trim()) {
            const fallback = synthesizeResponse(query, locale || 'en');
            fullText = fallback.text;
          }

          // Stream the output tokens smoothly
          const tokens = fullText.split(' ');
          let accumulated = '';
          for (let i = 0; i < tokens.length; i += 1) {
            accumulated += (i === 0 ? '' : ' ') + tokens[i];
            self.postMessage({
              id,
              type: 'chunk',
              chunk: accumulated,
            } satisfies AngieWorkerOutboundMessage);
            await new Promise((resolve) => setTimeout(resolve, 14));
          }

          const { entry } = searchKnowledge(query, locale || 'en');
          self.postMessage({
            id,
            type: 'done',
            fullText,
            actions: entry?.actions || [],
            isNeural: true,
          } satisfies AngieWorkerOutboundMessage);
          return;
        }

        // Fast deterministic RAG path (when neural engine is loading or unsupported)
        const { text, actions } = synthesizeResponse(query, locale || 'en');
        const tokens = text.split(' ');
        let accumulated = '';

        for (let i = 0; i < tokens.length; i += 1) {
          accumulated += (i === 0 ? '' : ' ') + tokens[i];
          self.postMessage({
            id,
            type: 'chunk',
            chunk: accumulated,
          } satisfies AngieWorkerOutboundMessage);
          await new Promise((resolve) => setTimeout(resolve, 16));
        }

        self.postMessage({
          id,
          type: 'done',
          fullText: text,
          actions,
          isNeural: false,
        } satisfies AngieWorkerOutboundMessage);
      } catch {
        self.postMessage({
          id,
          type: 'error',
          fullText:
            locale === 'es'
              ? 'Ocurrió un error al procesar tu consulta.'
              : 'An error occurred while processing your request.',
        } satisfies AngieWorkerOutboundMessage);
      }
    }
  });
}
