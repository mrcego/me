<template>
  <div class="relative">
    <button
      class="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full text-muted hover:text-foreground hover:bg-foreground/5 transition-all active:scale-95"
      aria-label="Switch Language"
      @click="toggleLanguage"
    >
      <span class="font-black text-xs uppercase tracking-widest">{{ locale }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale, setLocale } = useI18n();
const localeCookie = useCookie<'en' | 'es'>('i18n_locale');

onNuxtReady(() => {
  const saved = localeCookie.value;
  if (saved && saved !== locale.value) {
    setLocale(saved);
  }
});

watch(
  locale,
  (value) => {
    localeCookie.value = value as 'en' | 'es';
  },
  { flush: 'post' },
);

const toggleLanguage = () => {
  setLocale(locale.value === 'en' ? 'es' : 'en');
};
</script>
