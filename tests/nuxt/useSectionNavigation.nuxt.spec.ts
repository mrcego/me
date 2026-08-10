import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it } from 'vitest';
import { defineComponent } from 'vue';
import { useSectionNavigation } from '~/composables/domain/useSectionNavigation';

describe('useSectionNavigation', () => {
  it('exposes hash-only hrefs while on home', async () => {
    let api!: ReturnType<typeof useSectionNavigation>;
    await mountSuspended(
      defineComponent({
        setup() {
          api = useSectionNavigation();
          return {};
        },
        template: '<div />',
      }),
      { route: '/' },
    );

    expect(api.sectionHref('#contact')).toBe('#contact');
    expect(api.normalizeHash('about')).toBe('#about');
    expect(api.isOnHome.value).toBe(true);
  });
});
