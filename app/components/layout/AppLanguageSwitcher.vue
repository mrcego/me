<script setup lang="ts">
import { storeLocaleSwitchScroll } from '~/utils/locale-switch-scroll';

const { locale } = useI18n();
const switchLocalePath = useSwitchLocalePath();
const router = useRouter();

/** Target locale — label matches aria-label ("switch to …"). */
const nextLocaleLabel = computed(() => (locale.value === 'en' ? 'ES' : 'EN'));

const toggleLanguage = async () => {
  const nextLocale = locale.value === 'en' ? 'es' : 'en';
  const path = switchLocalePath(nextLocale);

  storeLocaleSwitchScroll();

  if (window.location.hash) {
    history.replaceState(history.state, '', `${window.location.pathname}${window.location.search}`);
  }

  await router.replace({ path, hash: '' });
};
</script>

<template>
  <div class="relative">
    <button
      type="button"
      class="w-[46px] h-[46px] md:w-[50px] md:h-[50px] flex items-center justify-center rounded-full text-muted hover:text-foreground hover:bg-foreground/5 transition-[background-color,color,transform] duration-200 active:scale-95 text-base sm:text-lg tracking-wider font-black cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      :aria-label="$t('nav.switchLanguageLabel', { locale: nextLocaleLabel })"
      @click="toggleLanguage"
    >
      <span aria-hidden="true">{{ nextLocaleLabel }}</span>
    </button>
  </div>
</template>
