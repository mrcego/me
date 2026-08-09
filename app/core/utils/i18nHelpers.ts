import type { useI18n } from 'vue-i18n';

export type I18nMessageNode = Parameters<ReturnType<typeof useI18n>['rt']>[0];

/**
 * Safely extracts an array from Vue i18n's `tm(...)` function with type safety.
 * Returns raw AST items so `rt(item)` can resolve localized strings correctly.
 */
export function getI18nArray<T = I18nMessageNode>(
  tmFn: (key: string) => unknown,
  key: string,
): T[] {
  const data = tmFn(key);
  if (!Array.isArray(data)) return [];
  return data as T[];
}
