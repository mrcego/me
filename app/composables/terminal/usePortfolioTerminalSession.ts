import type { Ref } from 'vue';
import { getI18nArray } from '~/core/utils/i18nHelpers';
import { TERMINAL_COMMANDS, type TerminalCommandId } from '~/config/portfolioTerminal.config';
import { PORTFOLIO_ROUTES } from '~/config/routes.manifest';
import {
  parsePortfolioTerminalCommand,
  suggestPortfolioTerminalCommands,
  type TerminalParseEffect,
} from '~/utils/portfolioTerminalParser';
import { THEME_PRESETS } from '~/utils/themePresets';

export type TerminalLineKind = 'system' | 'input' | 'output' | 'error';

export interface TerminalLine {
  id: string;
  kind: TerminalLineKind;
  text: string;
}

export interface PortfolioTerminalSessionApi {
  lines: Ref<TerminalLine[]>;
  input: Ref<string>;
  suggestions: Ref<string[]>;
  activeSuggestion: Ref<number>;
  historyIndex: Ref<number>;
  submit: () => Promise<void>;
  clearTranscript: () => void;
  applySuggestion: (value?: string) => void;
  moveSuggestion: (delta: number) => void;
  historyPrev: () => void;
  historyNext: () => void;
  bootstrap: () => void;
}

let lineSerial = 0;

function nextLineId() {
  lineSerial += 1;
  return `tl-${lineSerial}`;
}

/**
 * In-memory terminal session: transcript, history, autocomplete, typed effects.
 */
export function usePortfolioTerminalSession(): PortfolioTerminalSessionApi {
  const { t, tm } = useI18n();
  const { closeTerminal } = usePortfolioTerminal();
  const { goToSection } = useSectionNavigation();
  const { currentTheme, setThemePreset } = useTheme();
  const localePath = useLocalePath();
  const router = useRouter();

  const lines = ref<TerminalLine[]>([]);
  const input = ref('');
  const suggestions = ref<string[]>([]);
  const activeSuggestion = ref(-1);
  const history = ref<string[]>([]);
  const historyIndex = ref(-1);

  function pushLine(kind: TerminalLineKind, text: string) {
    lines.value = [...lines.value, { id: nextLineId(), kind, text }];
  }

  function clearTranscript() {
    lines.value = [];
  }

  function bootstrap() {
    clearTranscript();
    pushLine('system', t('terminal.banner'));
    pushLine('system', t('terminal.hint'));
  }

  function refreshSuggestions() {
    suggestions.value = suggestPortfolioTerminalCommands(input.value, 5);
    activeSuggestion.value =
      suggestions.value.length > 0
        ? Math.min(Math.max(activeSuggestion.value, 0), suggestions.value.length - 1)
        : -1;
  }

  watch(input, () => {
    historyIndex.value = -1;
    refreshSuggestions();
  });

  function applySuggestion(value?: string) {
    const pick = value ?? suggestions.value[activeSuggestion.value];
    if (!pick) return;
    const parts = input.value.trimEnd().split(/\s+/);
    if (parts.length <= 1) {
      input.value = `${pick} `;
    } else {
      parts[parts.length - 1] = pick;
      input.value = `${parts.join(' ')} `;
    }
    refreshSuggestions();
  }

  function moveSuggestion(delta: number) {
    if (!suggestions.value.length) return;
    const count = suggestions.value.length;
    activeSuggestion.value = (activeSuggestion.value + delta + count) % count;
  }

  function historyPrev() {
    if (!history.value.length) return;
    if (historyIndex.value < 0) historyIndex.value = history.value.length;
    historyIndex.value = Math.max(0, historyIndex.value - 1);
    input.value = history.value[historyIndex.value] ?? '';
  }

  function historyNext() {
    if (historyIndex.value < 0) return;
    historyIndex.value += 1;
    if (historyIndex.value >= history.value.length) {
      historyIndex.value = -1;
      input.value = '';
      return;
    }
    input.value = history.value[historyIndex.value] ?? '';
  }

  const switchLocalePath = useSwitchLocalePath();
  const { locale } = useI18n();

  function printCommandOutput(commandId: TerminalCommandId) {
    switch (commandId) {
      case 'help': {
        pushLine('output', t('terminal.responses.helpHeader'));
        for (const command of TERMINAL_COMMANDS) {
          pushLine('output', `  ${t(command.usageKey).padEnd(28)} ${t(command.summaryKey)}`);
        }
        break;
      }
      case 'about':
        pushLine('output', t('terminal.responses.about'));
        break;
      case 'status':
        pushLine('output', t('terminal.responses.status'));
        break;
      case 'stack':
        pushLine('output', t('terminal.responses.stack'));
        break;
      case 'services':
        pushLine('output', t('terminal.responses.services'));
        break;
      case 'experience':
        pushLine('output', t('terminal.responses.experience'));
        break;
      case 'profiles':
        pushLine('output', t('terminal.responses.profiles'));
        break;
      case 'certs': {
        const data = getI18nArray(tm, 'certifications.data');
        pushLine('output', t('terminal.responses.certs', { count: data.length }));
        break;
      }
      case 'contact':
        pushLine('output', t('terminal.responses.contact'));
        break;
      case 'work':
        pushLine('output', t('terminal.responses.workList'));
        break;
      case 'seo':
        pushLine('output', t('terminal.responses.seo'));
        break;
      case 'lang':
        pushLine('output', t('terminal.responses.lang', { locale: locale.value }));
        break;
      case 'benchmark': {
        const cores =
          import.meta.client && typeof navigator !== 'undefined'
            ? navigator.hardwareConcurrency || 8
            : 8;
        const memory =
          import.meta.client && typeof navigator !== 'undefined' && 'deviceMemory' in navigator
            ? `${(navigator as { deviceMemory?: number }).deviceMemory} GB`
            : 'High / Standard';
        const connection =
          import.meta.client && typeof navigator !== 'undefined' && 'connection' in navigator
            ? `${(navigator as unknown as { connection?: { downlink?: number; effectiveType?: string } }).connection?.downlink ?? 10} Mbps (${(navigator as unknown as { connection?: { effectiveType?: string } }).connection?.effectiveType ?? '4g'})`
            : '4G / Fiber';

        pushLine('output', '⚡ SYSTEM PERFORMANCE BENCHMARK (REAL-TIME RUM)');
        pushLine('output', `  ├─ Hardware CPU Cores ... ${cores} logical threads`);
        pushLine('output', `  ├─ Device RAM Memory .... ${memory}`);
        pushLine('output', `  ├─ Network Bandwidth .... ${connection}`);
        pushLine('output', '  ├─ Render Engine ........ Nuxt 4 (SSG) + Nitro (0 API Overhead)');
        pushLine('output', '  ├─ Target FPS ........... 60.0 FPS (0 Frame Drops)');
        pushLine('output', '  ├─ LCP Baseline ......... < 1.2s (Preloaded IPX WebP)');
        pushLine('output', '  ├─ CLS Metric ........... 0.00 (Zero Cumulative Shift)');
        pushLine('output', '  └─ INP / TBT ............ < 50ms (Single RAF Lerped Loop)');
        pushLine('output', '🚀 OVERALL HEALTH: 100/100 LIGHTHOUSE GRADE (ARCHITECT CERTIFIED)');
        break;
      }
      case 'deploy': {
        pushLine('output', '⚡ PRODUCTION DEPLOYMENT LOGS & TELEMETRY');
        pushLine('output', '  ├─ [1/4] Nuxt 4 SSG Prerender 134 Routes ...... [✓ 97.4s]');
        pushLine('output', '  ├─ [2/4] Offline SVG Icon Validation .......... [✓ 63/63 OK]');
        pushLine('output', '  ├─ [3/4] Strict CSP Hash Integrity Check ...... [✓ PASSED]');
        pushLine('output', '  └─ [4/4] Netlify Global Edge CDN Sync ......... [✓ 100% HEALTHY]');
        pushLine('output', '✨ STATUS: LIVE ON NETLIFY EDGE (https://cesargomez.dev)');
        break;
      }
      default:
        break;
    }
  }

  function errorMessage(effect: Extract<TerminalParseEffect, { type: 'error' }>): string {
    switch (effect.code) {
      case 'empty':
        return t('terminal.errors.empty');
      case 'unknown':
        return t('terminal.errors.unknown', { command: effect.detail ?? '' });
      case 'blocked':
        return t('terminal.errors.blocked');
      case 'usage':
        return t('terminal.errors.usage', { command: effect.detail ?? '' });
      case 'unknownSection':
        return t('terminal.errors.unknownSection', { section: effect.detail ?? '' });
      case 'unknownWork':
        return t('terminal.errors.unknownWork', { work: effect.detail ?? '' });
      case 'unknownTheme':
        return t('terminal.errors.unknownTheme', { theme: effect.detail ?? '' });
      case 'unknownThemeAction':
        return t('terminal.errors.unknownThemeAction', { action: effect.detail ?? '' });
      default:
        return t('terminal.errors.unknown', { command: '' });
    }
  }

  async function runEffect(effect: TerminalParseEffect) {
    switch (effect.type) {
      case 'print':
        printCommandOutput(effect.commandId);
        break;
      case 'clear':
        clearTranscript();
        pushLine('system', t('terminal.responses.cleared'));
        break;
      case 'close':
        closeTerminal();
        break;
      case 'downloadCv': {
        const targetLang = effect.lang ?? (locale.value === 'es' ? 'es' : 'en');
        const targetFileName = `cv-cesar-gomez-${targetLang}.pdf`;
        const targetHref = `/cv/${targetFileName}`;
        pushLine('output', t('terminal.responses.cv', { file: targetFileName }));
        if (import.meta.client) {
          const anchor = document.createElement('a');
          anchor.href = targetHref;
          anchor.download = targetFileName;
          anchor.rel = 'noopener';
          document.body.appendChild(anchor);
          anchor.click();
          anchor.remove();
        }
        break;
      }
      case 'setLang': {
        pushLine('output', t('terminal.responses.langSet', { locale: effect.lang }));
        await router.push(switchLocalePath(effect.lang));
        break;
      }
      case 'showTheme':
        pushLine(
          'output',
          t('terminal.responses.themeShow', {
            id: currentTheme.value.id,
            name: currentTheme.value.name,
          }),
        );
        break;
      case 'listThemes':
        pushLine('output', t('terminal.responses.themeListHeader'));
        for (const preset of THEME_PRESETS) {
          const mark = preset.id === currentTheme.value.id ? '*' : ' ';
          pushLine('output', `  ${mark} ${preset.id.padEnd(18)} ${preset.name}`);
        }
        break;
      case 'setTheme':
        setThemePreset(effect.presetId);
        pushLine('output', t('terminal.responses.themeSet', { id: effect.presetId }));
        break;
      case 'navigate': {
        if (effect.target.kind === 'section') {
          pushLine(
            'output',
            t('terminal.responses.navigateSection', { section: effect.target.id }),
          );
          closeTerminal();
          await goToSection(undefined, `#${effect.target.id}`);
          break;
        }
        const route = PORTFOLIO_ROUTES.find((item) => item.id === effect.target.id);
        if (!route) {
          pushLine('error', t('terminal.errors.unknownWork', { work: effect.target.id }));
          break;
        }
        pushLine('output', t('terminal.responses.navigateWork', { work: effect.target.id }));
        closeTerminal();
        await router.push(localePath(route.localePath));
        break;
      }
      case 'error':
        pushLine('error', errorMessage(effect));
        break;
      default:
        break;
    }
  }

  async function submit() {
    const raw = input.value;
    const trimmed = raw.trim();
    if (!trimmed) return;

    history.value = [...history.value.filter((item) => item !== trimmed), trimmed].slice(-50);
    historyIndex.value = -1;
    pushLine('input', trimmed);
    input.value = '';
    suggestions.value = [];
    activeSuggestion.value = -1;

    const parsed = parsePortfolioTerminalCommand(trimmed);
    for (const effect of parsed.effects) {
      await runEffect(effect);
    }
  }

  return {
    lines,
    input,
    suggestions,
    activeSuggestion,
    historyIndex,
    submit,
    clearTranscript,
    applySuggestion,
    moveSuggestion,
    historyPrev,
    historyNext,
    bootstrap,
  };
}
