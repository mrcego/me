<template>
  <div class="relative">
    <button
      type="button"
      class="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full text-muted hover:text-foreground hover:bg-foreground/5 transition-all active:scale-95"
      :aria-label="$t('nav.switchLanguage')"
      @click="toggleLanguage"
    >
      <span class="font-black text-xs uppercase tracking-widest">{{ locale }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { storeLocaleSwitchScroll } from '~/utils/locale-switch-scroll';

const { locale } = useI18n();
const switchLocalePath = useSwitchLocalePath();
const router = useRouter();

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
