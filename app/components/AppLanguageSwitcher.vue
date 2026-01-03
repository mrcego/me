<template>
  <div class="relative">
    <button
      class="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-all active:scale-95"
      aria-label="Switch Language"
      @click="toggleLanguage"
    >
      <span class="font-black text-xs uppercase tracking-widest">{{
        locale
      }}</span>
    </button>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const { locale, setLocale } = useI18n();

const toggleLanguage = () => {
  setLocale(locale.value === "en" ? "es" : "en");
};
</script>

