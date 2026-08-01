import type { Ref } from 'vue';

interface UseTerminalDialogOptions {
  open: Ref<boolean>;
  dialogRef: Ref<HTMLDialogElement | null>;
  initialFocusRef: Ref<HTMLElement | null>;
  onClose: () => void;
}

/**
 * Native <dialog> lifecycle: showModal, focus restore, body scroll lock, #__nuxt inert.
 */
export function useTerminalDialog(options: UseTerminalDialogOptions) {
  const { open, dialogRef, initialFocusRef, onClose } = options;
  const previousFocus = ref<HTMLElement | null>(null);

  useBodyScrollLock(open);

  function setRootInert(inert: boolean) {
    if (!import.meta.client) return;
    const root = document.getElementById('__nuxt');
    if (!(root instanceof HTMLElement)) return;
    if (inert) root.setAttribute('inert', '');
    else root.removeAttribute('inert');
  }

  function restoreFocus() {
    const target = previousFocus.value;
    previousFocus.value = null;
    if (target && typeof target.focus === 'function') {
      target.focus();
    }
  }

  async function syncDialog(isOpen: boolean, dialog: HTMLDialogElement | null) {
    if (!import.meta.client || !dialog) return;

    if (isOpen) {
      if (!previousFocus.value) {
        previousFocus.value =
          document.activeElement instanceof HTMLElement ? document.activeElement : null;
      }
      setRootInert(true);
      if (!dialog.open) dialog.showModal();
      await nextTick();
      initialFocusRef.value?.focus();
      return;
    }

    if (dialog.open) dialog.close();
    setRootInert(false);
    restoreFocus();
  }

  // Watch both flags: first open mounts the dialog after `open` flips true.
  watch(
    [open, dialogRef],
    ([isOpen, dialog]) => {
      void syncDialog(Boolean(isOpen), dialog ?? null);
    },
    { flush: 'post' },
  );

  function onDialogCancel(event: Event) {
    event.preventDefault();
    onClose();
  }

  function onDialogClose() {
    if (open.value) onClose();
    setRootInert(false);
  }

  onScopeDispose(() => {
    setRootInert(false);
    const dialog = dialogRef.value;
    if (dialog?.open) dialog.close();
  });

  return {
    onDialogCancel,
    onDialogClose,
  };
}
