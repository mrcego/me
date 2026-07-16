const CV_FILES = {
  es: '/cv/CV Cesar Gomez ES.pdf',
  en: '/cv/CV Cesar Gomez EN.pdf',
} as const;

export function useCvDownload() {
  const { locale } = useI18n();

  const localeKey = computed(() => (locale.value === 'es' ? 'es' : 'en'));

  const href = computed(() => encodeURI(CV_FILES[localeKey.value]));

  const fileName = computed(() =>
    localeKey.value === 'es' ? 'CV Cesar Gomez ES.pdf' : 'CV Cesar Gomez EN.pdf',
  );

  return {
    href,
    fileName,
  };
}
