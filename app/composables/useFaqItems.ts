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

const DEFAULT_FAQ_ITEMS: FaqItem[] = [
  {
    key: 'roles-seniority',
    question: 'What types of roles or contracts do you accept?',
    answer:
      'Senior Fullstack / Staff Frontend engineer, Frontend Architect, and hands-on Tech Lead roles.',
  },
  {
    key: 'availability',
    question: 'When are you available to start?',
    answer: 'Target availability date is August 10, 2026.',
  },
  {
    key: 'remote-work',
    question: 'Do you work remotely or locally in Colombia?',
    answer: 'Remote (global / US / LATAM hours).',
  },
  {
    key: 'tech-stack',
    question: 'What is your primary technology stack?',
    answer: 'Vue 3, Nuxt 4, TypeScript, JavaScript, Node.js, PrimeVue, and Tailwind CSS.',
  },
];

export const useFaqItems = () => {
  const { t, tm, rt, locale, getLocaleMessage } = useI18n();

  return computed<FaqItem[]>(() => {
    const data = tm('faq.items') as FaqMessageItem[] | unknown;
    if (data && Array.isArray(data) && data.length > 0) {
      const rawItems =
        (getLocaleMessage(locale.value) as { faq?: { items?: FaqMessageItem[] } }).faq?.items ?? [];

      return data.map((item, index) => ({
        key: rawItems[index]?.key,
        question: rt(item.question),
        answer: rt(item.answer),
      }));
    }

    const items: FaqItem[] = [];
    for (let index = 0; index < 20; index += 1) {
      const qKey = `faq.items.${index}.question`;
      const aKey = `faq.items.${index}.answer`;
      const question = t(qKey);
      const answer = t(aKey);
      if (question && question !== qKey && answer && answer !== aKey) {
        items.push({ question, answer });
      } else {
        break;
      }
    }

    return items.length > 0 ? items : DEFAULT_FAQ_ITEMS;
  });
};
