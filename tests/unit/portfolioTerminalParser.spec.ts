import { describe, expect, it } from 'vitest';
import {
  parsePortfolioTerminalCommand,
  suggestPortfolioTerminalCommands,
} from '../../app/utils/portfolioTerminalParser';

describe('parsePortfolioTerminalCommand', () => {
  it('normalizes whitespace and case for info commands', () => {
    const result = parsePortfolioTerminalCommand('  HELP  ');
    expect(result.normalized).toBe('HELP');
    expect(result.effects).toEqual([{ type: 'print', commandId: 'help', args: [] }]);
  });

  it('accepts localized aliases', () => {
    expect(parsePortfolioTerminalCommand('ayuda').effects[0]).toMatchObject({
      type: 'print',
      commandId: 'help',
    });
    expect(parsePortfolioTerminalCommand('whoami').effects[0]).toMatchObject({
      type: 'print',
      commandId: 'about',
    });
    expect(parsePortfolioTerminalCommand('salir').effects[0]).toEqual({ type: 'close' });
    expect(parsePortfolioTerminalCommand('limpiar').effects[0]).toEqual({ type: 'clear' });
  });

  it('parses go section aliases', () => {
    expect(parsePortfolioTerminalCommand('go contact').effects[0]).toEqual({
      type: 'navigate',
      target: { kind: 'section', id: 'contact' },
    });
    expect(parsePortfolioTerminalCommand('ir casos').effects[0]).toEqual({
      type: 'navigate',
      target: { kind: 'section', id: 'case-studies' },
    });
  });

  it('parses work destinations and lists when bare', () => {
    expect(parsePortfolioTerminalCommand('work').effects[0]).toEqual({
      type: 'print',
      commandId: 'work',
      args: [],
    });
    expect(parsePortfolioTerminalCommand('work colegium').effects[0]).toEqual({
      type: 'navigate',
      target: { kind: 'work', id: 'colegium' },
    });
    expect(parsePortfolioTerminalCommand('work tissini').effects[0]).toEqual({
      type: 'navigate',
      target: { kind: 'work', id: 'tissini' },
    });
  });

  it('parses theme show/list/use', () => {
    expect(parsePortfolioTerminalCommand('theme show').effects[0]).toEqual({ type: 'showTheme' });
    expect(parsePortfolioTerminalCommand('theme list').effects[0]).toEqual({ type: 'listThemes' });
    expect(parsePortfolioTerminalCommand('theme use dracula').effects[0]).toEqual({
      type: 'setTheme',
      presetId: 'dracula',
    });
  });

  it('parses list, services, seo, and lang commands', () => {
    expect(parsePortfolioTerminalCommand('list').effects[0]).toMatchObject({
      type: 'print',
      commandId: 'help',
    });
    expect(parsePortfolioTerminalCommand('ls').effects[0]).toMatchObject({
      type: 'print',
      commandId: 'help',
    });
    expect(parsePortfolioTerminalCommand('services').effects[0]).toMatchObject({
      type: 'print',
      commandId: 'services',
    });
    expect(parsePortfolioTerminalCommand('seo').effects[0]).toMatchObject({
      type: 'print',
      commandId: 'seo',
    });
    expect(parsePortfolioTerminalCommand('lang').effects[0]).toMatchObject({
      type: 'print',
      commandId: 'lang',
    });
    expect(parsePortfolioTerminalCommand('lang es').effects[0]).toEqual({
      type: 'setLang',
      lang: 'es',
    });
  });

  it('returns downloadCv for cv with optional language', () => {
    expect(parsePortfolioTerminalCommand('cv').effects[0]).toEqual({ type: 'downloadCv' });
    expect(parsePortfolioTerminalCommand('cv en').effects[0]).toEqual({
      type: 'downloadCv',
      lang: 'en',
    });
    expect(parsePortfolioTerminalCommand('cv es').effects[0]).toEqual({
      type: 'downloadCv',
      lang: 'es',
    });
  });

  it('rejects empty input', () => {
    expect(parsePortfolioTerminalCommand('   ').effects[0]).toEqual({
      type: 'error',
      code: 'empty',
    });
  });

  it('rejects unknown commands', () => {
    expect(parsePortfolioTerminalCommand('rm -rf /').effects[0]).toMatchObject({
      type: 'error',
      code: 'unknown',
      detail: 'rm',
    });
    expect(parsePortfolioTerminalCommand('foobar').effects[0]).toMatchObject({
      type: 'error',
      code: 'unknown',
    });
  });

  it('rejects shell operators and URLs', () => {
    for (const bad of [
      'help | cat',
      'go contact && exit',
      'theme use `id`',
      'curl https://x.com',
    ]) {
      expect(parsePortfolioTerminalCommand(bad).effects[0], bad).toMatchObject({
        type: 'error',
        code: 'blocked',
      });
    }
  });

  it('rejects unknown section/work/theme', () => {
    expect(parsePortfolioTerminalCommand('go nowhere').effects[0]).toMatchObject({
      type: 'error',
      code: 'unknownSection',
    });
    expect(parsePortfolioTerminalCommand('work acme').effects[0]).toMatchObject({
      type: 'error',
      code: 'unknownWork',
    });
    expect(parsePortfolioTerminalCommand('theme use not-a-theme').effects[0]).toMatchObject({
      type: 'error',
      code: 'unknownTheme',
    });
  });

  it('rejects unexpected args on arity-0 commands', () => {
    expect(parsePortfolioTerminalCommand('help please').effects[0]).toMatchObject({
      type: 'error',
      code: 'usage',
    });
  });
});

describe('suggestPortfolioTerminalCommands', () => {
  it('suggests command prefixes', () => {
    expect(suggestPortfolioTerminalCommands('he')).toContain('help');
    expect(suggestPortfolioTerminalCommands('th').slice(0, 5)).toContain('theme');
  });

  it('suggests theme preset ids', () => {
    const suggestions = suggestPortfolioTerminalCommands('theme use dra');
    expect(suggestions).toContain('dracula');
  });

  it('suggests go sections', () => {
    expect(suggestPortfolioTerminalCommands('go con')).toContain('contact');
  });
});
