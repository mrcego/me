import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it } from 'vitest';
import { defineComponent, nextTick, ref } from 'vue';
import { useBodyScrollLock } from '~/composables/useBodyScrollLock';

describe('useBodyScrollLock', () => {
  it('locks and unlocks body scroll', async () => {
    const locked = ref(true);
    const wrapper = await mountSuspended(
      defineComponent({
        setup() {
          useBodyScrollLock(locked);
          return {};
        },
        template: '<div />',
      }),
    );

    expect(document.body.style.position).toBe('fixed');
    locked.value = false;
    await nextTick();
    expect(document.body.style.position).toBe('');
    wrapper.unmount();
  });
});
