<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

interface Props {
  modelValue?: boolean;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  ariaLabel?: string;
  ariaLabelledby?: string;
  teleport?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: undefined,
  description: undefined,
  size: 'md',
  closeOnBackdrop: true,
  closeOnEsc: true,
  showCloseButton: true,
  ariaLabel: undefined,
  ariaLabelledby: undefined,
  teleport: true,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'close'): void;
}>();

const modalRef = ref<HTMLElement | null>(null);

useBodyScrollLock(() => props.modelValue);

const sizeClasses: Record<NonNullable<Props['size']>, string> = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
  full: 'max-w-[calc(100vw-2rem)] min-h-[calc(100vh-2rem)]',
};

function closeModal() {
  emit('update:modelValue', false);
  emit('close');
}

function onBackdropClick(event: MouseEvent) {
  if (props.closeOnBackdrop && event.target === event.currentTarget) {
    closeModal();
  }
}

function onKeyDown(event: KeyboardEvent) {
  if (props.closeOnEsc && event.key === 'Escape' && props.modelValue) {
    closeModal();
  }
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      nextTick(() => {
        modalRef.value?.focus();
      });
    }
  },
  { immediate: true },
);

onMounted(() => {
  window.addEventListener('keydown', onKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown);
});
</script>

<template>
  <Teleport to="body" :disabled="!props.teleport">
    <Transition name="modal-fade">
      <div
        v-if="props.modelValue"
        class="app-modal-mask fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#030612]/85 backdrop-blur-md"
        role="presentation"
        @click="onBackdropClick"
      >
        <div
          ref="modalRef"
          tabindex="-1"
          role="dialog"
          :aria-modal="true"
          :aria-label="props.ariaLabel || props.title"
          :aria-labelledby="props.ariaLabelledby"
          class="app-modal-content relative flex flex-col w-full max-h-[calc(100dvh-2rem)] overflow-hidden rounded-2xl sm:rounded-3xl border border-foreground/10 bg-[#0a0f1a] shadow-2xl focus:outline-none"
          :class="sizeClasses[props.size]"
          @click.stop
        >
          <!-- Header -->
          <div
            v-if="props.title || $slots.header || props.showCloseButton"
            class="flex items-center justify-between gap-4 px-5 py-4 sm:px-6 sm:py-5 border-b border-foreground/10 bg-foreground/2 shrink-0"
          >
            <slot name="header">
              <div class="flex flex-col gap-1">
                <h3 v-if="props.title" class="text-lg sm:text-xl font-black text-foreground">
                  {{ props.title }}
                </h3>
                <p v-if="props.description" class="text-xs sm:text-sm text-muted">
                  {{ props.description }}
                </p>
              </div>
            </slot>

            <button
              v-if="props.showCloseButton"
              type="button"
              class="size-9 rounded-xl inline-flex items-center justify-center text-muted hover:text-foreground hover:bg-foreground/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              aria-label="Cerrar modal"
              @click="closeModal"
            >
              <Icon name="lucide:x" class="size-5" />
            </button>
          </div>

          <!-- Body / Content -->
          <div class="flex-1 overflow-y-auto p-5 sm:p-6 text-foreground">
            <slot />
          </div>

          <!-- Footer -->
          <div
            v-if="$slots.footer"
            class="px-5 py-4 sm:px-6 sm:py-4 border-t border-foreground/10 bg-foreground/2 shrink-0 flex items-center justify-end gap-3"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .app-modal-content {
  transform: scale(0.96) translateY(0.5rem);
}

.modal-fade-leave-to .app-modal-content {
  transform: scale(0.96) translateY(0.5rem);
}

@media (prefers-reduced-motion: reduce) {
  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: opacity 0.01ms !important;
  }
}
</style>
