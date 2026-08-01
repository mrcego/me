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

  it('supports nested locks with a refcount', async () => {
    const outer = ref(true);
    const inner = ref(true);
    const wrapper = await mountSuspended(
      defineComponent({
        setup() {
          useBodyScrollLock(outer);
          useBodyScrollLock(inner);
          return {};
        },
        template: '<div />',
      }),
    );

    expect(document.body.style.position).toBe('fixed');
    outer.value = false;
    await nextTick();
    expect(document.body.style.position).toBe('fixed');
    inner.value = false;
    await nextTick();
    expect(document.body.style.position).toBe('');
    wrapper.unmount();
  });
});
