import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTextRotator } from '~/composables/useTextRotator';

import { getI18nArray } from '~/core/utils/i18nHelpers';

export function useBrandRoleRotator() {
  const { t, tm } = useI18n();

  const brandRoles = computed<string[]>(() => {
    const raw = getI18nArray<string | Record<string, unknown>>(tm, 'nav.brandRoles');
    if (raw.length > 0) {
      return raw.map((item, index) =>
        typeof item === 'string' ? item : t(`nav.brandRoles.${index}`),
      );
    }
    return [t('nav.brandRole')];
  });

  const { activeIndex } = useTextRotator(brandRoles);

  const currentRole = computed(
    () => brandRoles.value[activeIndex.value] ?? brandRoles.value[0] ?? '',
  );

  return {
    activeRoleIndex: activeIndex,
    brandRoles,
    currentRole,
  };
}
