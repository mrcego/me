import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTextRotator } from '~/composables/useTextRotator';

const DEFAULT_BRAND_ROLES = [
  'Senior Fullstack Developer',
  'Vue / Nuxt Architecture Specialist',
  'AI Software Engineer',
  'Frontend Architect',
  'Fullstack Node Developer',
  'Cartagena Local',
];

export function useBrandRoleRotator() {
  const { t, tm } = useI18n();

  const brandRoles = computed<string[]>(() => {
    const raw = tm('nav.brandRoles') as unknown;
    const list: string[] = [];

    if (Array.isArray(raw)) {
      raw.forEach((item, index) => {
        if (typeof item === 'string') {
          list.push(item);
        } else {
          const val = t(`nav.brandRoles.${index}`);
          if (val && val !== `nav.brandRoles.${index}`) list.push(val);
        }
      });
    } else if (raw && typeof raw === 'object') {
      Object.values(raw).forEach((val) => {
        if (typeof val === 'string') list.push(val);
      });
    }

    if (list.length === 0) {
      for (let index = 0; index < 10; index += 1) {
        const val = t(`nav.brandRoles.${index}`);
        if (val && val !== `nav.brandRoles.${index}`) {
          list.push(val);
        } else {
          break;
        }
      }
    }

    return list.length > 0 ? list : DEFAULT_BRAND_ROLES;
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
