/**
 * Typed catalog for the secret portfolio terminal.
 * Whitelist only — never executes arbitrary shell/user code.
 */

export const KONAMI_SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'KeyB',
  'KeyA',
] as const;

export type KonamiKey = (typeof KONAMI_SEQUENCE)[number];

export const KONAMI_KEY_LABELS: Record<KonamiKey, string> = {
  ArrowUp: '↑',
  ArrowDown: '↓',
  ArrowLeft: '←',
  ArrowRight: '→',
  KeyB: 'B',
  KeyA: 'A',
};

/** Arm window after `/` before the sequence expires. */
export const KONAMI_ARM_TIMEOUT_MS = 4000;

/** Visual failure cascade duration before reset to idle. */
export const KONAMI_FAIL_RESET_MS = 750;

/** Success pulse before opening the terminal dialog. */
export const KONAMI_UNLOCK_DELAY_MS = 300;

export type TerminalSectionId =
  | 'about'
  | 'tech-stack'
  | 'certifications'
  | 'capabilities'
  | 'case-studies'
  | 'testimonials'
  | 'hire-profiles'
  | 'contact'
  | 'faq';

export type TerminalWorkId = 'colegium' | 'lingoquesto';

export type TerminalProfileId = 'vue' | 'ai' | 'node' | 'cartagena' | 'craft';

export type TerminalCommandId =
  | 'help'
  | 'about'
  | 'status'
  | 'stack'
  | 'work'
  | 'experience'
  | 'profiles'
  | 'certs'
  | 'contact'
  | 'cv'
  | 'go'
  | 'theme'
  | 'clear'
  | 'exit';

export interface TerminalCommandDefinition {
  id: TerminalCommandId;
  /** Canonical command token (lowercase). */
  name: string;
  /** EN + ES aliases (lowercase). */
  aliases: readonly string[];
  /** i18n key under terminal.commands.*.usage */
  usageKey: string;
  /** i18n key under terminal.commands.*.summary */
  summaryKey: string;
  group: 'info' | 'nav' | 'system';
}

export const TERMINAL_SECTION_ALIASES: Record<string, TerminalSectionId> = {
  about: 'about',
  acerca: 'about',
  stack: 'tech-stack',
  'tech-stack': 'tech-stack',
  tech: 'tech-stack',
  certifications: 'certifications',
  certs: 'certifications',
  certificaciones: 'certifications',
  capabilities: 'capabilities',
  capacidades: 'capabilities',
  cases: 'case-studies',
  'case-studies': 'case-studies',
  casos: 'case-studies',
  testimonials: 'testimonials',
  reviews: 'testimonials',
  testimonios: 'testimonials',
  profiles: 'hire-profiles',
  'hire-profiles': 'hire-profiles',
  perfiles: 'hire-profiles',
  contact: 'contact',
  contacto: 'contact',
  faq: 'faq',
};

export const TERMINAL_WORK_ALIASES: Record<string, TerminalWorkId> = {
  colegium: 'colegium',
  lingoquesto: 'lingoquesto',
  lingo: 'lingoquesto',
};

export const TERMINAL_PROFILE_ROUTE_IDS: readonly TerminalProfileId[] = [
  'vue',
  'ai',
  'node',
  'cartagena',
  'craft',
] as const;

export const TERMINAL_COMMANDS: readonly TerminalCommandDefinition[] = [
  {
    id: 'help',
    name: 'help',
    aliases: ['help', 'ayuda', '?'],
    usageKey: 'terminal.commands.help.usage',
    summaryKey: 'terminal.commands.help.summary',
    group: 'info',
  },
  {
    id: 'about',
    name: 'about',
    aliases: ['about', 'whoami', 'quien', 'quién'],
    usageKey: 'terminal.commands.about.usage',
    summaryKey: 'terminal.commands.about.summary',
    group: 'info',
  },
  {
    id: 'status',
    name: 'status',
    aliases: ['status', 'estado', 'availability', 'disponibilidad'],
    usageKey: 'terminal.commands.status.usage',
    summaryKey: 'terminal.commands.status.summary',
    group: 'info',
  },
  {
    id: 'stack',
    name: 'stack',
    aliases: ['stack', 'tech', 'skills'],
    usageKey: 'terminal.commands.stack.usage',
    summaryKey: 'terminal.commands.stack.summary',
    group: 'info',
  },
  {
    id: 'work',
    name: 'work',
    aliases: ['work', 'caso', 'case'],
    usageKey: 'terminal.commands.work.usage',
    summaryKey: 'terminal.commands.work.summary',
    group: 'nav',
  },
  {
    id: 'experience',
    name: 'experience',
    aliases: ['experience', 'experiencia', 'roles'],
    usageKey: 'terminal.commands.experience.usage',
    summaryKey: 'terminal.commands.experience.summary',
    group: 'info',
  },
  {
    id: 'profiles',
    name: 'profiles',
    aliases: ['profiles', 'perfiles', 'hire'],
    usageKey: 'terminal.commands.profiles.usage',
    summaryKey: 'terminal.commands.profiles.summary',
    group: 'info',
  },
  {
    id: 'certs',
    name: 'certs',
    aliases: ['certs', 'certifications', 'certificaciones'],
    usageKey: 'terminal.commands.certs.usage',
    summaryKey: 'terminal.commands.certs.summary',
    group: 'info',
  },
  {
    id: 'contact',
    name: 'contact',
    aliases: ['contact', 'contacto'],
    usageKey: 'terminal.commands.contact.usage',
    summaryKey: 'terminal.commands.contact.summary',
    group: 'info',
  },
  {
    id: 'cv',
    name: 'cv',
    aliases: ['cv', 'resume', 'curriculum', 'currículum'],
    usageKey: 'terminal.commands.cv.usage',
    summaryKey: 'terminal.commands.cv.summary',
    group: 'system',
  },
  {
    id: 'go',
    name: 'go',
    aliases: ['go', 'ir', 'cd'],
    usageKey: 'terminal.commands.go.usage',
    summaryKey: 'terminal.commands.go.summary',
    group: 'nav',
  },
  {
    id: 'theme',
    name: 'theme',
    aliases: ['theme', 'tema'],
    usageKey: 'terminal.commands.theme.usage',
    summaryKey: 'terminal.commands.theme.summary',
    group: 'system',
  },
  {
    id: 'clear',
    name: 'clear',
    aliases: ['clear', 'cls', 'limpiar'],
    usageKey: 'terminal.commands.clear.usage',
    summaryKey: 'terminal.commands.clear.summary',
    group: 'system',
  },
  {
    id: 'exit',
    name: 'exit',
    aliases: ['exit', 'quit', 'salir', 'q'],
    usageKey: 'terminal.commands.exit.usage',
    summaryKey: 'terminal.commands.exit.summary',
    group: 'system',
  },
] as const;

const ALIAS_TO_COMMAND = new Map<string, TerminalCommandDefinition>();
for (const command of TERMINAL_COMMANDS) {
  for (const alias of command.aliases) {
    ALIAS_TO_COMMAND.set(alias.toLowerCase(), command);
  }
}

export function resolveTerminalCommand(token: string): TerminalCommandDefinition | undefined {
  return ALIAS_TO_COMMAND.get(token.trim().toLowerCase());
}

export function listTerminalCommandNames(): string[] {
  return TERMINAL_COMMANDS.map((command) => command.name);
}

/** Shell metacharacters / operators that must never be accepted. */
export const TERMINAL_BLOCKED_OPERATORS = [
  '|',
  '||',
  '&',
  '&&',
  ';',
  '>',
  '>>',
  '<',
  '<<',
  '`',
  '$(',
  '${',
  '\n',
  '\r',
] as const;
