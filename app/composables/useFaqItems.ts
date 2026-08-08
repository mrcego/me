type FaqMessageItem = {
  question: unknown;
  answer: unknown;
  key?: string;
};

export type FaqItem = {
  key?: string;
  question: string;
  answer: string;
};

export const useFaqItems = () => {
  const { tm, rt, locale, getLocaleMessage } = useI18n();

  return computed<FaqItem[]>(() => {
    const data = tm('faq.items') as FaqMessageItem[] | unknown;
    if (!data || !Array.isArray(data)) return [];

    const rawItems =
      (getLocaleMessage(locale.value) as { faq?: { items?: FaqMessageItem[] } }).faq?.items ?? [];

    return data.map((item, index) => ({
      key: rawItems[index]?.key,
      question: rt(item.question),
      answer: rt(item.answer),
    }));
  });
};
