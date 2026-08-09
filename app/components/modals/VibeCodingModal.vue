<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Dialog from 'primevue/dialog';

import { getI18nArray } from '~/core/utils/i18nHelpers';

const { t, tm } = useI18n();
const { vibeCodingModalVisible, closeVibeCodingModal } = useVibeCodingModal();
const { goToSection, sectionHref } = useSectionNavigation();

async function onContactClick(event: Event) {
  closeVibeCodingModal();
  await goToSection(event, '#contact');
}

function onVisibleUpdate(visible: boolean) {
  vibeCodingModalVisible.value = visible;
}

const rolePoints = computed(() => {
  const items = getI18nArray(tm, 'vibeCoding.modal.points');
  return items.map((_, index) => t(`vibeCoding.modal.points.${index}`));
});
</script>

<template>
  <Dialog
    :visible="vibeCodingModalVisible"
    modal
    dismissable-mask
    append-to="body"
    block-scroll
    :draggable="false"
    :show-header="false"
    aria-labelledby="vibe-coding-modal-title"
    class="experience-dialog"
    :style="{ width: 'min(44rem, calc(100vw - 1.5rem))' }"
    :pt="{
      mask: {
        class: 'experience-dialog-mask',
      },
      root: {
        class: 'experience-dialog',
        'aria-labelledby': 'vibe-coding-modal-title',
      },
      content: {
        class: 'experience-dialog-content',
      },
    }"
    @update:visible="onVisibleUpdate"
  >
    <div class="experience-modal">
      <header class="experience-modal__header">
        <div class="flex items-start gap-3 md:gap-4 min-w-0 flex-1">
          <div class="experience-modal__icon-wrap shrink-0" aria-hidden="true">
            <Icon
              name="solar:magic-stick-3-bold-duotone"
              class="w-5 h-5 md:w-6 md:h-6 text-primary"
            />
          </div>

          <div class="space-y-2.5 md:space-y-3 min-w-0 flex-1">
            <div class="space-y-1.5">
              <h3
                id="vibe-coding-modal-title"
                class="text-xl md:text-3xl font-black tracking-tight text-foreground leading-tight"
              >
                {{ $t('vibeCoding.modal.title') }}
              </h3>
              <p class="text-sm md:text-base text-muted leading-relaxed">
                {{ $t('vibeCoding.modal.lead') }}
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <span class="experience-modal__chip">
                <Icon name="solar:cpu-bolt-bold-duotone" class="w-3.5 h-3.5" />
                {{ $t('vibeCoding.modal.badge') }}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          class="experience-modal__close"
          :aria-label="$t('vibeCoding.modal.close')"
          @click="closeVibeCodingModal"
        >
          <Icon name="lucide:x" class="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </header>

      <div class="experience-modal__body space-y-6 md:space-y-8">
        <section class="space-y-3">
          <h4 class="type-eyebrow">{{ $t('vibeCoding.modal.whyTitle') }}</h4>
          <p class="experience-modal__summary text-base md:text-lg text-muted leading-relaxed">
            {{ $t('vibeCoding.modal.whyBody') }}
          </p>
        </section>

        <section class="space-y-3">
          <h4 class="type-eyebrow">{{ $t('vibeCoding.modal.riskTitle') }}</h4>
          <p class="text-sm md:text-base text-muted leading-relaxed">
            {{ $t('vibeCoding.modal.riskBody') }}
          </p>
        </section>

        <section class="space-y-4">
          <h4 class="type-eyebrow">{{ $t('vibeCoding.modal.roleTitle') }}</h4>
          <p class="text-sm md:text-base text-muted leading-relaxed">
            {{ $t('vibeCoding.modal.roleBody') }}
          </p>

          <ul class="experience-modal__highlights space-y-2.5 pr-1">
            <li
              v-for="(point, index) in rolePoints"
              :key="index"
              class="experience-modal__highlight"
            >
              <span class="experience-modal__index" aria-hidden="true">
                {{ String(index + 1).padStart(2, '0') }}
              </span>
              <p class="text-sm md:text-base text-muted leading-relaxed">
                {{ point }}
              </p>
            </li>
          </ul>
        </section>
      </div>

      <footer class="experience-modal__footer">
        <span class="type-label text-muted tracking-[0.3em]">
          {{ $t('vibeCoding.modal.footer') }}
        </span>
        <a
          :href="sectionHref('#contact')"
          class="experience-modal__linkedin"
          @click="onContactClick"
        >
          <Icon name="solar:letter-bold-duotone" class="w-5 h-5" />
          {{ $t('hero.cta') }}
        </a>
      </footer>
    </div>
  </Dialog>
</template>
