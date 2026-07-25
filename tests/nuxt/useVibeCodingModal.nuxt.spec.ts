import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it } from 'vitest';
import { defineComponent } from 'vue';
import { useVibeCodingModal } from '~/composables/useVibeCodingModal';

describe('useVibeCodingModal', () => {
  it('opens and closes the modal, mounting only on first open', async () => {
    let api!: ReturnType<typeof useVibeCodingModal>;
    await mountSuspended(
      defineComponent({
        setup() {
          api = useVibeCodingModal();
          return {};
        },
        template: '<div />',
      }),
    );

    expect(api.vibeCodingModalVisible.value).toBe(false);
    expect(api.vibeCodingModalMounted.value).toBe(false);

    api.openVibeCodingModal();
    expect(api.vibeCodingModalMounted.value).toBe(true);
    expect(api.vibeCodingModalVisible.value).toBe(true);

    api.closeVibeCodingModal();
    expect(api.vibeCodingModalVisible.value).toBe(false);
    expect(api.vibeCodingModalMounted.value).toBe(true);
  });
});
