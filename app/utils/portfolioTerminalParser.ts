import {
  resolveTerminalCommand,
  TERMINAL_BLOCKED_OPERATORS,
  TERMINAL_SECTION_ALIASES,
  TERMINAL_WORK_ALIASES,
  type TerminalCommandId,
  type TerminalSectionId,
  type TerminalWorkId,
} from '~/config/portfolioTerminal.config';
import { THEME_PRESETS } from '~/utils/themePresets';

export type TerminalParseEffect =
  | { type: 'print'; commandId: TerminalCommandId; args: string[] }
  | {
      type: 'navigate';
      target: { kind: 'section'; id: TerminalSectionId } | { kind: 'work'; id: TerminalWorkId };
    }
  | { type: 'downloadCv' }
  | { type: 'setTheme'; presetId: string }
  | { type: 'listThemes' }
  | { type: 'showTheme' }
  | { type: 'clear' }
  | { type: 'close' }
  | { type: 'error'; code: TerminalParseErrorCode; detail?: string };

export type TerminalParseErrorCode =
  | 'empty'
  | 'unknown'
  | 'blocked'
  | 'usage'
  | 'unknownSection'
  | 'unknownWork'
  | 'unknownTheme'
  | 'unknownThemeAction';

export interface TerminalParseResult {
  input: string;
  normalized: string;
  effects: TerminalParseEffect[];
}

const THEME_IDS = new Set(THEME_PRESETS.map((preset) => preset.id));

function containsBlockedOperator(raw: string): boolean {
  return TERMINAL_BLOCKED_OPERATORS.some((op) => raw.includes(op));
}

function tokenize(normalized: string): string[] {
  return normalized.split(/\s+/).filter(Boolean);
}

function usage(commandId: TerminalCommandId, detail?: string): TerminalParseEffect {
  return { type: 'error', code: 'usage', detail: detail ?? commandId };
}

/**
 * Pure whitelist parser. Never executes input — returns typed effects only.
 */
export function parsePortfolioTerminalCommand(rawInput: string): TerminalParseResult {
  const input = rawInput ?? '';
  const normalized = input.trim().replace(/\s+/g, ' ');

  if (!normalized) {
    return { input, normalized, effects: [{ type: 'error', code: 'empty' }] };
  }

  if (containsBlockedOperator(normalized)) {
    return { input, normalized, effects: [{ type: 'error', code: 'blocked' }] };
  }

  // Reject obvious URL / path escapes
  if (
    /https?:\/\//i.test(normalized) ||
    normalized.includes('://') ||
    normalized.includes('\\\\')
  ) {
    return { input, normalized, effects: [{ type: 'error', code: 'blocked' }] };
  }

  const tokens = tokenize(normalized.toLowerCase());
  const [head, ...args] = tokens;
  const command = resolveTerminalCommand(head ?? '');

  if (!command) {
    return {
      input,
      normalized,
      effects: [{ type: 'error', code: 'unknown', detail: head }],
    };
  }

  switch (command.id) {
    case 'help':
    case 'about':
    case 'status':
    case 'stack':
    case 'experience':
    case 'profiles':
    case 'certs':
    case 'contact':
      if (args.length > 0) return { input, normalized, effects: [usage(command.id)] };
      return {
        input,
        normalized,
        effects: [{ type: 'print', commandId: command.id, args: [] }],
      };

    case 'cv':
      if (args.length > 0) return { input, normalized, effects: [usage(command.id)] };
      return { input, normalized, effects: [{ type: 'downloadCv' }] };

    case 'clear':
      if (args.length > 0) return { input, normalized, effects: [usage(command.id)] };
      return { input, normalized, effects: [{ type: 'clear' }] };

    case 'exit':
      if (args.length > 0) return { input, normalized, effects: [usage(command.id)] };
      return { input, normalized, effects: [{ type: 'close' }] };

    case 'go': {
      if (args.length !== 1) return { input, normalized, effects: [usage('go')] };
      const section = TERMINAL_SECTION_ALIASES[args[0] ?? ''];
      if (!section) {
        return {
          input,
          normalized,
          effects: [{ type: 'error', code: 'unknownSection', detail: args[0] }],
        };
      }
      return {
        input,
        normalized,
        effects: [{ type: 'navigate', target: { kind: 'section', id: section } }],
      };
    }

    case 'work': {
      if (args.length === 0) {
        return {
          input,
          normalized,
          effects: [{ type: 'print', commandId: 'work', args: [] }],
        };
      }
      if (args.length !== 1) return { input, normalized, effects: [usage('work')] };
      const work = TERMINAL_WORK_ALIASES[args[0] ?? ''];
      if (!work) {
        return {
          input,
          normalized,
          effects: [{ type: 'error', code: 'unknownWork', detail: args[0] }],
        };
      }
      return {
        input,
        normalized,
        effects: [{ type: 'navigate', target: { kind: 'work', id: work } }],
      };
    }

    case 'theme': {
      const action = args[0];
      if (!action || args.length > 2) {
        return { input, normalized, effects: [usage('theme')] };
      }
      if (action === 'show' || action === 'mostrar') {
        if (args.length !== 1) return { input, normalized, effects: [usage('theme')] };
        return { input, normalized, effects: [{ type: 'showTheme' }] };
      }
      if (action === 'list' || action === 'lista' || action === 'ls') {
        if (args.length !== 1) return { input, normalized, effects: [usage('theme')] };
        return { input, normalized, effects: [{ type: 'listThemes' }] };
      }
      if (action === 'use' || action === 'usar' || action === 'set') {
        const presetId = args[1];
        if (!presetId) return { input, normalized, effects: [usage('theme')] };
        if (!THEME_IDS.has(presetId)) {
          return {
            input,
            normalized,
            effects: [{ type: 'error', code: 'unknownTheme', detail: presetId }],
          };
        }
        return { input, normalized, effects: [{ type: 'setTheme', presetId }] };
      }
      return {
        input,
        normalized,
        effects: [{ type: 'error', code: 'unknownThemeAction', detail: action }],
      };
    }

    default:
      return {
        input,
        normalized,
        effects: [{ type: 'error', code: 'unknown', detail: head }],
      };
  }
}

/** Suggest up to `limit` command names matching the current input prefix. */
export function suggestPortfolioTerminalCommands(rawInput: string, limit = 5): string[] {
  const normalized = rawInput.trim().toLowerCase();
  if (!normalized || containsBlockedOperator(normalized)) return [];

  const tokens = tokenize(normalized);
  if (tokens.length > 1) {
    // Theme preset completion
    if (
      (tokens[0] === 'theme' || tokens[0] === 'tema') &&
      (tokens[1] === 'use' || tokens[1] === 'usar' || tokens[1] === 'set')
    ) {
      const prefix = tokens[2] ?? '';
      return THEME_PRESETS.map((p) => p.id)
        .filter((id) => id.startsWith(prefix))
        .slice(0, limit);
    }
    // go / work arg completion
    if (tokens[0] === 'go' || tokens[0] === 'ir' || tokens[0] === 'cd') {
      const prefix = tokens[1] ?? '';
      return Object.keys(TERMINAL_SECTION_ALIASES)
        .filter((alias) => alias.startsWith(prefix))
        .slice(0, limit);
    }
    if (tokens[0] === 'work' || tokens[0] === 'caso' || tokens[0] === 'case') {
      const prefix = tokens[1] ?? '';
      return Object.keys(TERMINAL_WORK_ALIASES)
        .filter((alias) => alias.startsWith(prefix))
        .slice(0, limit);
    }
    return [];
  }

  const prefix = tokens[0] ?? '';
  const seen = new Set<string>();
  const results: string[] = [];
  for (const command of [
    ...new Set(
      // Prefer canonical names first
      [
        ...[
          'help',
          'about',
          'status',
          'stack',
          'work',
          'experience',
          'profiles',
          'certs',
          'contact',
          'cv',
          'go',
          'theme',
          'clear',
          'exit',
        ],
      ],
    ),
  ]) {
    if (command.startsWith(prefix) && !seen.has(command)) {
      seen.add(command);
      results.push(command);
      if (results.length >= limit) break;
    }
  }
  return results;
}
