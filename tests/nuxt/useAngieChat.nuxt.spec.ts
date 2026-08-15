import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it } from 'vitest';
import { defineComponent, nextTick } from 'vue';
import { useAngieChat } from '~/composables/domain/useAngieChat';

async function mountAngie() {
  let angie!: ReturnType<typeof useAngieChat>;
  await mountSuspended(
    defineComponent({
      setup() {
        angie = useAngieChat();
        return {};
      },
      template: '<div />',
    }),
  );
  return angie;
}

describe('useAngieChat', () => {
  it('initializes closed and toggles open/close state', async () => {
    const angie = await mountAngie();
    expect(angie.isOpen.value).toBe(false);

    angie.openChat();
    expect(angie.isOpen.value).toBe(true);
    expect(angie.messages.value.length).toBeGreaterThan(0);
    expect(angie.messages.value[0]?.role).toBe('angie');

    angie.closeChat();
    expect(angie.isOpen.value).toBe(false);

    angie.toggleChat();
    expect(angie.isOpen.value).toBe(true);
  });

  it('sends user message and appends response', async () => {
    const angie = await mountAngie();
    angie.clearTranscript();
    expect(angie.messages.value.length).toBe(1);

    await angie.sendMessage('Who is César Gómez?');
    expect(
      angie.messages.value.some((m) => m.role === 'user' && m.text.includes('César Gómez')),
    ).toBe(true);

    // Wait for response placeholder / fallback
    await nextTick();
    expect(angie.messages.value.length).toBeGreaterThanOrEqual(2);
  });

  it('clears transcript and resets greeting', async () => {
    const angie = await mountAngie();
    await angie.sendMessage('test message');
    expect(angie.messages.value.length).toBeGreaterThan(1);

    angie.clearTranscript();
    expect(angie.messages.value.length).toBe(1);
    expect(angie.messages.value[0]?.role).toBe('angie');
  });

  it('triggers action callbacks without throwing', async () => {
    const angie = await mountAngie();
    // Contact form
    expect(() => {
      angie.triggerAction({
        id: 'test_act',
        type: 'contact_form',
        target: '#contact',
        labelKey: 'angie.actions.openContactForm',
      });
    }).not.toThrow();

    // Hash navigation
    expect(() => {
      angie.triggerAction({
        id: 'test_nav_hash',
        type: 'navigate',
        target: '#tech-stack',
        labelKey: 'angie.actions.viewTechStack',
      });
    }).not.toThrow();

    // Route navigation
    expect(() => {
      angie.triggerAction({
        id: 'test_nav_route',
        type: 'navigate',
        target: '/case-studies/colegium',
        labelKey: 'angie.actions.viewColegium',
      });
    }).not.toThrow();

    // CV Download
    expect(() => {
      angie.triggerAction({
        id: 'test_download',
        type: 'download_cv',
        labelKey: 'angie.actions.downloadCvNow',
      });
    }).not.toThrow();

    // Open terminal
    expect(() => {
      angie.triggerAction({
        id: 'test_term',
        type: 'open_terminal',
        labelKey: 'angie.actions.runTelemetry',
      });
    }).not.toThrow();
  });

  it('exposes reactive neural status and handles empty queries', async () => {
    const angie = await mountAngie();
    expect(['idle', 'loading', 'ready', 'fallback']).toContain(angie.neuralStatus.value);
    expect(typeof angie.neuralProgress.value).toBe('number');
    expect(angie.neuralModel.value).toBe('smollm2-135m-instruct');

    // Empty query does nothing
    const countBefore = angie.messages.value.length;
    await angie.sendMessage('   ');
    expect(angie.messages.value.length).toBe(countBefore);

    // Warmup neural engine
    angie.warmupNeuralEngine();
    expect(angie.neuralStatus.value).toBeDefined();
  });
});
