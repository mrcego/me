import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, nextTick, ref } from 'vue';
import { useTerminalDialog } from '~/composables/terminal/useTerminalDialog';

function polyfillDialog(dialog: HTMLDialogElement) {
  if (typeof dialog.showModal === 'function') return;
  dialog.showModal = () => {
    dialog.setAttribute('open', '');
  };
  dialog.close = () => {
    dialog.removeAttribute('open');
  };
  Object.defineProperty(dialog, 'open', {
    configurable: true,
    get() {
      return dialog.hasAttribute('open');
    },
  });
}

describe('useTerminalDialog', () => {
  it('opens and closes the native dialog element', async () => {
    const open = ref(false);
    const dialogRef = ref<HTMLDialogElement | null>(null);
    const initialFocusRef = ref<HTMLElement | null>(null);
    const onClose = vi.fn(() => {
      open.value = false;
    });

    const wrapper = await mountSuspended(
      defineComponent({
        setup() {
          useTerminalDialog({ open, dialogRef, initialFocusRef, onClose });
          return { dialogRef, initialFocusRef };
        },
        template: `
          <dialog ref="dialogRef">
            <input ref="initialFocusRef" data-testid="terminal-input" />
          </dialog>
        `,
      }),
    );

    const dialog = wrapper.find('dialog').element as HTMLDialogElement;
    const input = wrapper.find('[data-testid="terminal-input"]').element as HTMLInputElement;
    polyfillDialog(dialog);
    dialogRef.value = dialog;
    initialFocusRef.value = input;

    open.value = true;
    await nextTick();
    await nextTick();
    expect(dialog.open).toBe(true);

    open.value = false;
    await nextTick();
    await nextTick();
    expect(dialog.open).toBe(false);

    wrapper.unmount();
  });

  it('routes cancel events through onClose', async () => {
    const open = ref(true);
    const dialogRef = ref<HTMLDialogElement | null>(null);
    const initialFocusRef = ref<HTMLElement | null>(null);
    const onClose = vi.fn(() => {
      open.value = false;
    });

    let api!: ReturnType<typeof useTerminalDialog>;
    await mountSuspended(
      defineComponent({
        setup() {
          api = useTerminalDialog({ open, dialogRef, initialFocusRef, onClose });
          return {};
        },
        template: '<div />',
      }),
    );

    const event = new Event('cancel', { cancelable: true });
    api.onDialogCancel(event);
    expect(event.defaultPrevented).toBe(true);
    expect(onClose).toHaveBeenCalledOnce();
  });
});
