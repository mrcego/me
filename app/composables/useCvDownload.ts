const CV_FILES = {
  es: '/cv/cv-cesar-gomez-es.pdf',
  en: '/cv/cv-cesar-gomez-en.pdf',
} as const;

export function useCvDownload() {
  const { locale } = useI18n();

  const localeKey = computed(() => (locale.value === 'es' ? 'es' : 'en'));

  const href = computed(() => CV_FILES[localeKey.value]);

  const fileName = computed(() =>
    localeKey.value === 'es' ? 'cv-cesar-gomez-es.pdf' : 'cv-cesar-gomez-en.pdf',
  );

  return {
    href,
    fileName,
  };
}
