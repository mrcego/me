import { describe, expect, it } from 'vitest';
import { searchKnowledge, synthesizeResponse } from '~/workers/angie.worker';

describe('angieRetriever (Search & Intent Synthesis)', () => {
  it('returns high-confidence match for technical stack queries in English and Spanish', () => {
    const resEn = searchKnowledge("What is César's Vue and Nuxt stack?", 'en');
    expect(resEn.entry).toBeTruthy();
    expect(resEn.entry?.id).toBe('tech_stack_core');
    expect(resEn.confidence).toBeGreaterThan(0);

    const resEs = searchKnowledge('¿Cuál es el stack de tecnologías de César?', 'es');
    expect(resEs.entry).toBeTruthy();
    expect(resEs.entry?.id).toBe('tech_stack_core');
  });

  it('matches case studies (Colegium, LingoQuesto, TISSINI)', () => {
    const colRes = searchKnowledge('Tell me about the Colegium migration', 'en');
    expect(colRes.entry?.id).toBe('case_colegium');

    const lqRes = searchKnowledge('Háblame de la plataforma de LingoQuesto', 'es');
    expect(lqRes.entry?.id).toBe('case_lingoquesto');

    const tisRes = searchKnowledge('ecommerce app TISSINI sales', 'en');
    expect(tisRes.entry?.id).toBe('case_tissini');
  });

  it('synthesizes specialized greetings in English and Spanish', () => {
    const greetingEn = synthesizeResponse('hello', 'en');
    expect(greetingEn.text).toContain('Angie');
    expect(greetingEn.actions.length).toBeGreaterThan(0);

    const greetingEs = synthesizeResponse('hola', 'es');
    expect(greetingEs.text).toContain('Angie');
    expect(greetingEs.actions.length).toBeGreaterThan(0);
  });

  it('provides a graceful fallback response with direct contact actions for unmapped queries', () => {
    const fallback = synthesizeResponse('quantum computing spaceship engine', 'en');
    expect(fallback.text).toContain('César');
    expect(fallback.actions.some((a) => a.type === 'contact_form')).toBe(true);
  });

  it('builds RAG context for queries with matched topic and general summary fallback', async () => {
    const { buildRagContext } = await import('~/workers/angie.worker');
    const matchedContext = buildRagContext('Vue and Nuxt architecture', 'en');
    expect(matchedContext).toContain('[TOPIC:');

    const genericContext = buildRagContext('quantum mechanical physics', 'es');
    expect(genericContext).toContain('César');

    const emptyRes = searchKnowledge('', 'en');
    expect(emptyRes.entry).toBeNull();
    expect(emptyRes.confidence).toBe(0);
  });
});
