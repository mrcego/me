<script setup lang="ts">
/**
 * Custom OG template — mirrors scripts/generate-og.mjs brand layout.
 * Uses the site favicon mark (/img/logo-mark.png) instead of a plain "C".
 */
withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    brandName?: string;
    brandTag?: string;
    siteUrl?: string;
    footer?: string;
    pills?: string[];
    portraitSrc?: string;
    logoSrc?: string;
  }>(),
  {
    title: 'César Gómez',
    description: 'Senior Vue/Nuxt · AI & NLP Expert',
    brandName: 'CÉSAR GÓMEZ',
    brandTag: 'PORTFOLIO',
    siteUrl: 'cesargomez.dev',
    footer: 'Cartagena · Remote · 13+ years',
    pills: () => ['Vue.js', 'Nuxt', 'TypeScript', 'AI · NLP'],
    portraitSrc: '/img/technical-identity.jpg',
    logoSrc: '/img/logo-mark.png',
  },
);
</script>

<template>
  <div
    style="
      width: 100%;
      height: 100%;
      display: flex;
      position: relative;
      background: linear-gradient(135deg, #0b0f16 0%, #111a26 100%);
      color: #ffffff;
      font-family: Outfit, sans-serif;
      overflow: hidden;
    "
  >
    <!-- Soft brand glows -->
    <div
      style="
        position: absolute;
        right: 40px;
        top: -40px;
        width: 520px;
        height: 520px;
        border-radius: 9999px;
        background: rgba(88, 166, 255, 0.22);
        display: flex;
      "
    />
    <div
      style="
        position: absolute;
        left: -80px;
        bottom: -120px;
        width: 420px;
        height: 420px;
        border-radius: 9999px;
        background: rgba(88, 166, 255, 0.12);
        display: flex;
      "
    />

    <div
      style="
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        height: 100%;
        padding: 56px 64px 48px;
      "
    >
      <!-- Brand row -->
      <div style="display: flex; align-items: center">
        <img
          :src="logoSrc"
          width="56"
          height="56"
          style="width: 56px; height: 56px; border-radius: 14px"
        />
        <div style="display: flex; flex-direction: column; margin-left: 18px">
          <div style="font-size: 18px; font-weight: 700; letter-spacing: 3px; color: #cbd5e1">
            {{ brandName }}
          </div>
          <div
            style="
              font-size: 14px;
              font-weight: 600;
              letter-spacing: 2px;
              color: rgba(88, 166, 255, 0.9);
              margin-top: 4px;
            "
          >
            {{ brandTag }}
          </div>
        </div>
      </div>

      <!-- Copy + portrait -->
      <div style="display: flex; align-items: center; justify-content: space-between; width: 100%">
        <div style="display: flex; flex-direction: column; max-width: 680px">
          <div style="font-size: 76px; font-weight: 800; line-height: 1.05; color: #ffffff">
            {{ title }}
          </div>
          <div
            style="
              width: 120px;
              height: 5px;
              border-radius: 9999px;
              background: #58a6ff;
              margin-top: 22px;
              margin-bottom: 22px;
            "
          />
          <div style="font-size: 32px; font-weight: 600; color: #cbd5e1; line-height: 1.25">
            {{ description }}
          </div>
          <div style="display: flex; margin-top: 28px">
            <div
              v-for="pill in pills"
              :key="pill"
              style="
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 10px 20px;
                border-radius: 14px;
                background: rgba(88, 166, 255, 0.1);
                border: 1.5px solid rgba(88, 166, 255, 0.35);
                color: #58a6ff;
                font-size: 20px;
                font-weight: 600;
                margin-right: 12px;
              "
            >
              {{ pill }}
            </div>
          </div>
        </div>

        <div
          style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 430px;
            height: 430px;
            border-radius: 9999px;
            border: 3px solid rgba(88, 166, 255, 0.9);
            padding: 8px;
          "
        >
          <img
            :src="portraitSrc"
            width="400"
            height="400"
            style="width: 400px; height: 400px; border-radius: 9999px; object-fit: cover"
          />
        </div>
      </div>

      <!-- Footer -->
      <div style="display: flex; align-items: center">
        <div style="font-size: 26px; font-weight: 700; color: #58a6ff">
          {{ siteUrl }}
        </div>
        <div
          style="
            font-size: 22px;
            font-weight: 500;
            color: rgba(203, 213, 225, 0.85);
            margin-left: 24px;
          "
        >
          {{ footer }}
        </div>
      </div>
    </div>
  </div>
</template>
