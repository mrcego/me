export default defineNuxtPlugin({
  name: 'locale-persistence',
  setup() {
    const { locale, setLocale } = useI18n();
    const localeCookie = useCookie<'en' | 'es'>('i18n_locale');

    onNuxtReady(() => {
      const saved = localeCookie.value;
      if (saved && saved !== locale.value) {
        setLocale(saved);
      }
    });

    watch(locale, (value) => {
      localeCookie.value = value as 'en' | 'es';
    });
  },
});
