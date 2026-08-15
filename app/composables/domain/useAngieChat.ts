import { ref, watch, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import type { AngieAction } from '~/config/angie.knowledge';
import { synthesizeResponse } from '~/workers/angie.worker';

export interface AngieChatMessage {
  id: string;
  role: 'user' | 'angie';
  text: string;
  actions?: AngieAction[];
  isStreaming?: boolean;
  isNeural?: boolean;
}

export type AngieCategory = 'all' | 'recruiter' | 'lead' | 'founder';
export type AngieNeuralStatus = 'idle' | 'loading' | 'ready' | 'fallback';

const isOpen = ref(false);
const isTyping = ref(false);
const messages = ref<AngieChatMessage[]>([]);
const activeCategory = ref<AngieCategory>('all');
const neuralStatus = ref<AngieNeuralStatus>('idle');
const neuralProgress = ref(0);
const neuralModel = ref('smollm2-135m-instruct');

let workerInstance: Worker | null = null;
let messageSerial = 0;

export function useAngieChat() {
  const { t, locale } = useI18n();
  const { goToSection } = useSectionNavigation();
  const { openTerminal } = usePortfolioTerminal();
  const { href: cvHref, fileName: cvFileName } = useCvDownload();
  const { trackEvent } = useAnalytics();

  function initWorker() {
    if (!import.meta.client || workerInstance || typeof Worker === 'undefined') return;

    try {
      workerInstance = new Worker(new URL('~/workers/angie.worker.ts', import.meta.url), {
        type: 'module',
      });

      workerInstance.onmessage = (event: MessageEvent) => {
        const data = event.data;
        if (!data) return;

        if (data.type === 'neural_status') {
          neuralStatus.value = data.status || 'fallback';
          if (typeof data.progress === 'number') {
            neuralProgress.value = data.progress;
          }
          if (data.model) {
            neuralModel.value = data.model;
          }
          return;
        }

        const { id, type, chunk, fullText, actions, isNeural } = data;
        const msg = messages.value.find((m) => m.id === id);

        if (type === 'chunk' && msg) {
          msg.text = chunk;
          msg.isStreaming = true;
        } else if (type === 'done' && msg) {
          msg.text = fullText;
          msg.actions = actions;
          msg.isStreaming = false;
          msg.isNeural = isNeural;
          isTyping.value = false;
        } else if (type === 'error' && msg) {
          msg.text = fullText || t('angie.errorGeneric');
          msg.isStreaming = false;
          isTyping.value = false;
        }
      };
    } catch {
      workerInstance = null;
      neuralStatus.value = 'fallback';
    }
  }

  function warmupNeuralEngine() {
    initWorker();
    if (workerInstance && neuralStatus.value === 'idle') {
      workerInstance.postMessage({ type: 'warmup' });
    }
  }

  function bootstrapGreeting() {
    if (messages.value.length > 0) return;

    messages.value = [
      {
        id: `msg-${++messageSerial}`,
        role: 'angie',
        text: t('angie.welcomeMessage'),
        actions: [
          {
            id: 'act_exp',
            type: 'navigate',
            target: '#about',
            labelKey: 'angie.actions.viewAbout',
          },
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
      },
    ];
  }

  function openChat() {
    isOpen.value = true;
    initWorker();
    warmupNeuralEngine();
    bootstrapGreeting();
    trackEvent('angie_chat_opened', { locale: locale.value });
  }

  function closeChat() {
    isOpen.value = false;
  }

  function toggleChat() {
    if (isOpen.value) closeChat();
    else openChat();
  }

  function clearTranscript() {
    messages.value = [];
    bootstrapGreeting();
  }

  async function sendMessage(userQuery: string) {
    const query = userQuery?.trim();
    if (!query || isTyping.value) return;

    trackEvent('angie_query_sent', { query, locale: locale.value });

    // Push user message
    messages.value.push({
      id: `msg-${++messageSerial}`,
      role: 'user',
      text: query,
    });

    const responseId = `msg-${++messageSerial}`;
    isTyping.value = true;

    // Push pending angie placeholder
    messages.value.push({
      id: responseId,
      role: 'angie',
      text: '',
      isStreaming: true,
    });

    initWorker();

    if (workerInstance) {
      workerInstance.postMessage({
        type: 'query',
        id: responseId,
        query,
        locale: locale.value === 'es' ? 'es' : 'en',
      });
    } else {
      // Fallback: synchronous client synthesis if workers unavailable
      setTimeout(() => {
        const { text, actions } = synthesizeResponse(query, locale.value === 'es' ? 'es' : 'en');
        const targetMsg = messages.value.find((m) => m.id === responseId);
        if (targetMsg) {
          targetMsg.text = text;
          targetMsg.actions = actions;
          targetMsg.isStreaming = false;
          targetMsg.isNeural = false;
        }
        isTyping.value = false;
      }, 300);
    }
  }

  function triggerAction(action: AngieAction, event?: MouseEvent) {
    trackEvent('angie_action_clicked', { actionId: action.id, type: action.type });

    if (action.type === 'navigate' && action.target) {
      if (action.target.startsWith('#')) {
        goToSection(event || new MouseEvent('click'), action.target);
      } else {
        const router = useRouter();
        router.push(action.target);
      }
      closeChat();
    } else if (action.type === 'contact_form') {
      goToSection(event || new MouseEvent('click'), '#contact');
      closeChat();
    } else if (action.type === 'download_cv') {
      const link = document.createElement('a');
      link.href = cvHref.value;
      link.download = cvFileName.value;
      link.click();
    } else if (action.type === 'open_terminal') {
      closeChat();
      nextTick(() => {
        openTerminal();
      });
    }
  }

  // Watch locale changes to reset greeting if transcript was default
  watch(locale, () => {
    if (messages.value.length <= 1) {
      messages.value = [];
      bootstrapGreeting();
    }
  });

  return {
    isOpen,
    isTyping,
    messages,
    activeCategory,
    neuralStatus,
    neuralProgress,
    neuralModel,
    openChat,
    closeChat,
    toggleChat,
    warmupNeuralEngine,
    clearTranscript,
    sendMessage,
    triggerAction,
  };
}
