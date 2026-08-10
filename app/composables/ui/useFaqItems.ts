import type { I18nFaqItem } from '~/core/types/i18n';
import { getI18nArray } from '~/core/utils/i18nHelpers';

export type FaqItem = {
  key?: string;
  question: string;
  answer: string;
};

export const useFaqItems = () => {
  const { tm, rt, locale, getLocaleMessage } = useI18n();

  return computed<FaqItem[]>(() => {
    const data = getI18nArray<I18nFaqItem>(tm, 'faq.items');
    if (!data.length) return [];

    const rawMessages = getLocaleMessage(locale.value) as {
      faq?: { items?: Array<{ key?: string }> };
    };
    const rawItems = rawMessages.faq?.items ?? [];

    return data.map((item, index) => ({
      key: rawItems[index]?.key,
      question: rt(item.question),
      answer: rt(item.answer),
    }));
  });
};
