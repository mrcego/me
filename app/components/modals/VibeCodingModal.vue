<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { getI18nArray } from '~/core/utils/i18nHelpers';

const { t, tm } = useI18n();
const { vibeCodingModalVisible, closeVibeCodingModal } = useVibeCodingModal();
const { goToSection, sectionHref } = useSectionNavigation();

async function onContactClick(event: Event) {
  closeVibeCodingModal();
  await goToSection(event, '#contact');
}

function handleModalUpdate(val: boolean) {
  vibeCodingModalVisible.value = val;
  if (!val) {
    closeVibeCodingModal();
  }
}

const rolePoints = computed(() => {
  const items = getI18nArray(tm, 'vibeCoding.modal.points');
  return items.map((_, index) => t(`vibeCoding.modal.points.${index}`));
});
</script>

<template>
  <AppModal
    :model-value="vibeCodingModalVisible"
    size="lg"
    aria-labelledby="vibe-coding-modal-title"
    @update:model-value="handleModalUpdate"
    @close="closeVibeCodingModal"
  >
    <template #header>
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
            <AppBadge
              :label="$t('vibeCoding.modal.badge')"
              variant="subtle"
              size="sm"
              icon="solar:cpu-bolt-bold-duotone"
            />
          </div>
        </div>
      </div>
    </template>

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
          <li v-for="(point, index) in rolePoints" :key="index" class="experience-modal__highlight">
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

    <template #footer>
      <div class="experience-modal__footer w-full flex items-center justify-between">
        <span class="type-label text-muted tracking-[0.3em]">
          {{ $t('vibeCoding.modal.footer') }}
        </span>
        <AppButton
          :href="sectionHref('#contact')"
          variant="primary"
          size="md"
          icon="solar:letter-bold-duotone"
          @click="onContactClick"
        >
          {{ $t('hero.cta') }}
        </AppButton>
      </div>
    </template>
  </AppModal>
</template>
