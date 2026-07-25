import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it } from 'vitest';
import { defineComponent } from 'vue';
import { useCvDownload } from '~/composables/useCvDownload';

describe('useCvDownload', () => {
  it('returns the English CV for locale en', async () => {
    let api!: ReturnType<typeof useCvDownload>;

    await mountSuspended(
      defineComponent({
        setup() {
          const { locale } = useI18n();
          locale.value = 'en';
          api = useCvDownload();
          return {};
        },
        template: '<div />',
      }),
    );

    expect(api.href.value).toBe('/cv/cv-cesar-gomez-en.pdf');
    expect(api.fileName.value).toBe('cv-cesar-gomez-en.pdf');
  });

  it('returns the Spanish CV for locale es', async () => {
    let api!: ReturnType<typeof useCvDownload>;

    await mountSuspended(
      defineComponent({
        setup() {
          const { locale } = useI18n();
          locale.value = 'es';
          api = useCvDownload();
          return {};
        },
        template: '<div />',
      }),
    );

    expect(api.href.value).toBe('/cv/cv-cesar-gomez-es.pdf');
    expect(api.fileName.value).toBe('cv-cesar-gomez-es.pdf');
  });
});
