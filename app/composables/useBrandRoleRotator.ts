import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTextRotator } from '~/composables/useTextRotator';

export function useBrandRoleRotator() {
  const { t, tm } = useI18n();

  const brandRoles = computed<string[]>(() => {
    const items = tm('nav.brandRoles') as unknown;
    if (Array.isArray(items) && items.length > 0) {
      return items.map((_: unknown, index: number) => t(`nav.brandRoles.${index}`));
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
