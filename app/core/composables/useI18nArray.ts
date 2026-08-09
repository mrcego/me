import { getI18nArray } from '../utils/i18nHelpers';

/**
 * Composable for fetching strongly-typed arrays from Vue i18n without unsafe type casts.
 */
export function useI18nArray() {
  const { tm, rt } = useI18n();

  return {
    getArray: <T = unknown>(key: string): T[] => getI18nArray<T>(tm, key),
    getStringArray: (key: string): string[] => {
      const items = getI18nArray(tm, key);
      return items.map((item) => rt(item));
    },
  };
}
