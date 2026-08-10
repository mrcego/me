import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it } from 'vitest';
import { defineComponent } from 'vue';
import { useFaqItems } from '~/composables/ui/useFaqItems';

describe('useFaqItems', () => {
  it('resolves FAQ questions and answers from i18n (happy path)', async () => {
    let items!: ReturnType<typeof useFaqItems>;
    await mountSuspended(
      defineComponent({
        setup() {
          items = useFaqItems();
          return {};
        },
        template: '<div />',
      }),
    );

    await nextTick();

    expect(items.value.length).toBeGreaterThan(3);
    expect(items.value[0]?.question.length).toBeGreaterThan(5);
    expect(items.value[0]?.answer.length).toBeGreaterThan(5);
  });
});
