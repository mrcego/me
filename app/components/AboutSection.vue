<template>
  <section id="about" class="py-24 md:py-32 px-6 md:px-12 relative bg-secondary/5 overflow-hidden">
    <!-- Background Decorative Element -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[150px] -z-10" />

    <div class="container mx-auto">
      <div
        class="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-16 xl:gap-20 items-start"
      >
        <!-- Sidebar Card with Motion (Spans 5 cols) -->
        <Motion
          :initial="motionInitial({ opacity: 0, x: -50 })"
          :while-in-view="motionInView({ opacity: 1, x: 0 })"
          :viewport="{ once: true }"
          :transition="{ duration: 1, ease: [0.16, 1, 0.3, 1] }"
          class="lg:col-span-5 lg:sticky lg:top-32 w-full max-w-xl mx-auto lg:max-w-none lg:mx-0"
        >
          <div
            class="surface-card group glass border-white/5 rounded-2xl sm:rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl relative bg-background/20 backdrop-blur-3xl"
          >
            <!-- Gamified Energy Border -->
            <div
              class="surface-card__glow absolute inset-0 border border-primary/20 rounded-[2.5rem] md:rounded-[3.5rem] pointer-events-none"
            />

            <div
              class="relative aspect-3/4 rounded-3xl overflow-hidden mb-8 md:mb-10 border border-white/10 mx-auto transition-all duration-1000 group-hover:scale-[1.02] shadow-2xl group/photo hidden lg:block"
            >
              <!-- Cinematic HUD Overlay for Photo -->
              <div
                class="absolute inset-0 z-20 pointer-events-none border-8 md:border-12 border-white/5 rounded-3xl"
              />
              <div
                class="absolute inset-0 z-20 pointer-events-none bg-linear-to-t from-background/80 via-transparent to-transparent opacity-60"
              />

              <NuxtImg
                src="/img/me.jpg"
                alt="César Gómez - Senior Fullstack Developer and Frontend Architect"
                width="600"
                height="800"
                format="webp"
                quality="85"
                loading="eager"
                decoding="async"
                sizes="sm:300px md:400px lg:500px xl:600px"
                class="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-110 transition-all duration-1000 scale-105 group-hover:scale-100"
              />

              <div
                class="absolute inset-x-0 top-0 h-1 bg-primary/40 blur-sm animate-scanline z-30 opacity-0 group-hover:opacity-100"
              />
            </div>

            <!-- Content inside card -->
            <h2
              class="text-xl md:text-2xl font-black tracking-tight text-foreground mb-3 sm:mb-4 px-2 text-center lg:text-left"
            >
              {{ $t('about.philosophy') }}
            </h2>

            <p
              class="mb-6 sm:mb-8 md:mb-10 text-sm md:text-base font-medium text-muted leading-relaxed px-2 text-center lg:text-left"
            >
              "{{ $t('about.philosophyQuote') }}"
            </p>

            <div class="space-y-4 sm:space-y-5">
              <div
                v-for="point in aboutPoints"
                :key="point.label"
                class="flex gap-3 sm:gap-4 group/p cursor-default"
              >
                <div
                  class="surface-card__icon w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 glass rounded-lg sm:rounded-xl flex items-center justify-center text-primary shrink-0 shadow-lg overflow-hidden"
                >
                  <Icon :name="point.icon" class="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                </div>
                <div
                  class="transition-transform duration-300 group-hover/p:translate-x-1 flex flex-col justify-center"
                >
                  <h3
                    class="text-[9px] sm:text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-foreground"
                  >
                    {{ $t(point.label) }}
                  </h3>
                  <p
                    class="text-[8px] sm:text-[9px] md:text-[10px] text-muted font-bold uppercase tracking-widest pt-0.5"
                  >
                    {{ $t(point.descKey) }}
                  </p>
                </div>
              </div>
            </div>

            <div
              class="surface-card__line surface-card__line--grow absolute inset-x-0 bottom-0 h-1 bg-primary origin-left pointer-events-none z-20"
            />
          </div>
        </Motion>

        <!-- Main Content Area (Spans 7 cols) -->
        <div class="lg:col-span-7 space-y-16 md:space-y-24 pt-2 sm:pt-4 lg:pt-0">
          <Motion
            :initial="motionInitial({ opacity: 0, y: 30 })"
            :while-in-view="motionInView({ opacity: 1, y: 0 })"
            :viewport="{ once: true }"
            :transition="{ duration: 1, ease: [0.16, 1, 0.3, 1] }"
            class="space-y-6 md:space-y-10"
          >
            <div class="flex items-center gap-4 justify-center lg:justify-start">
              <div class="h-px w-12 bg-foreground/10" />
              <div class="flex items-center gap-3 shrink-0">
                <div class="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <h2
                  class="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-primary"
                >
                  {{ $t('about.section') }}
                </h2>
              </div>
            </div>

            <h3
              class="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] text-foreground text-center lg:text-left"
            >
              {{ $t('about.title') }}<br />
              <span class="text-gradient">{{ $t('about.titleHighlight') }}</span>
            </h3>

            <div
              class="prose prose-invert prose-lg md:prose-xl max-w-none text-muted font-medium leading-relaxed space-y-6 text-center lg:text-left mx-auto lg:mx-0"
            >
              <p>
                {{ $t('about.description1') }}
              </p>
              <p>
                {{ $t('about.description2') }}
              </p>
            </div>
          </Motion>

          <div
            class="grid grid-cols-1 min-[480px]:grid-cols-2 gap-4 sm:gap-5 md:gap-6 items-stretch"
          >
            <Motion
              v-for="(role, i) in roles"
              :key="role.key"
              :initial="motionInitial({ opacity: 0, y: 20 })"
              :while-in-view="motionInView({ opacity: 1, y: 0 })"
              :viewport="{ once: true }"
              :transition="{
                duration: 0.8,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }"
              class="h-full"
            >
              <div
                role="button"
                tabindex="0"
                class="surface-card glass p-4 sm:p-5 md:p-7 lg:p-8 rounded-2xl sm:rounded-3xl md:rounded-4xl border-foreground/5 group flex h-full min-h-52 sm:min-h-60 md:min-h-64 flex-col relative overflow-hidden w-full min-w-0 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 touch-manipulation"
                :aria-label="`${$t('about.roles.viewDetails')}: ${$t(`about.roles.${role.key}.title`)}`"
                @click="openRoleModal(role.key)"
                @keydown="onRoleCardKeydown($event, role.key)"
              >
                <div class="surface-card__glow absolute inset-0 bg-primary/5 pointer-events-none" />
                <div class="relative z-10 flex min-h-0 flex-1 flex-col gap-3 sm:gap-4 md:gap-6">
                  <div class="flex items-start justify-between gap-2 sm:gap-3 min-w-0">
                    <div
                      class="surface-card__chip px-3 py-1 sm:px-4 sm:py-1.5 glass rounded-lg sm:rounded-xl text-[7px] sm:text-[8px] font-black uppercase tracking-[0.25em] shadow-sm shrink-0 max-w-[58%] sm:max-w-none"
                    >
                      {{ $t(`about.roles.${role.key}.years`) }}
                    </div>
                    <div
                      v-if="COMPANY_LOGOS[role.key]"
                      class="role-card__logo-wrap"
                      aria-hidden="true"
                    >
                      <img
                        :src="COMPANY_LOGOS[role.key].src"
                        :alt="COMPANY_LOGOS[role.key].alt"
                        class="role-card__company-logo"
                        :class="{
                          'role-card__company-logo--on-light': 'onLight' in COMPANY_LOGOS[role.key],
                        }"
                        width="128"
                        height="64"
                        loading="eager"
                        decoding="async"
                      />
                    </div>
                  </div>

                  <div class="space-y-1.5 sm:space-y-2 min-w-0">
                    <h4
                      class="surface-card__title text-lg sm:text-xl md:text-2xl font-black tracking-tight text-pretty"
                    >
                      {{ $t(`about.roles.${role.key}.title`) }}
                    </h4>
                    <p
                      class="surface-card__meta text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]"
                    >
                      {{ $t(`about.roles.${role.key}.company`) }}
                    </p>
                  </div>

                  <p
                    class="surface-card__desc flex-1 text-xs sm:text-sm leading-relaxed border-t border-foreground/5 pt-2 sm:pt-3 md:pt-4 text-pretty"
                  >
                    {{ $t(`about.roles.${role.key}.desc`) }}
                  </p>

                  <span
                    class="surface-card__cta mt-auto pt-3 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.25em]"
                  >
                    {{ $t('about.roles.viewDetails') }} →
                  </span>
                </div>

                <div
                  class="surface-card__line surface-card__line--grow absolute inset-x-0 bottom-0 h-1 bg-primary origin-left pointer-events-none z-20"
                />
              </div>
            </Motion>
          </div>
        </div>
      </div>
    </div>
  </section>

  <Dialog
    v-model:visible="roleModalVisible"
    modal
    dismissable-mask
    append-to="body"
    block-scroll
    :draggable="false"
    :show-header="false"
    class="experience-dialog"
    :style="{ width: 'min(44rem, calc(100vw - 1.5rem))' }"
    :pt="{
      mask: {
        class: 'experience-dialog-mask',
      },
      root: {
        class: 'experience-dialog',
      },
      content: {
        class: 'experience-dialog-content',
      },
    }"
    @hide="selectedRoleKey = null"
  >
    <div v-if="selectedRoleKey" class="experience-modal">
      <header class="experience-modal__header">
        <div class="flex items-start gap-4 md:gap-5 min-w-0">
          <div class="experience-modal__icon-wrap shrink-0" aria-hidden="true">
            <img
              v-if="selectedCompanyLogo"
              :src="selectedCompanyLogo.src"
              :alt="selectedCompanyLogo.alt"
              class="experience-modal__company-logo"
              :class="{
                'experience-modal__company-logo--on-light': 'onLight' in selectedCompanyLogo,
              }"
              width="56"
              height="56"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div class="space-y-3 min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <span class="experience-modal__chip">
                <Icon name="lucide:calendar-range" class="w-3.5 h-3.5" />
                {{ $t(`about.roles.${selectedRoleKey}.years`) }}
              </span>
              <span class="experience-modal__chip experience-modal__chip--muted">
                <Icon name="lucide:map-pin" class="w-3.5 h-3.5" />
                {{ $t(`about.roles.${selectedRoleKey}.location`) }}
              </span>
            </div>

            <div class="space-y-1.5">
              <p
                class="text-[10px] md:text-[11px] font-black uppercase tracking-[0.35em] text-primary"
              >
                {{ $t(`about.roles.${selectedRoleKey}.company`) }}
              </p>
              <h3
                class="text-xl md:text-3xl font-black tracking-tight text-foreground leading-tight"
              >
                {{ $t(`about.roles.${selectedRoleKey}.title`) }}
              </h3>
            </div>
          </div>
        </div>

        <button
          type="button"
          class="experience-modal__close"
          :aria-label="$t('about.roles.close')"
          @click="roleModalVisible = false"
        >
          <Icon name="lucide:x" class="w-5 h-5" />
        </button>
      </header>

      <div class="experience-modal__body">
        <p class="experience-modal__summary text-sm md:text-base text-muted leading-relaxed">
          {{ $t(`about.roles.${selectedRoleKey}.desc`) }}
        </p>

        <div class="space-y-4">
          <h4 class="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-primary">
            {{ $t('about.roles.highlightsTitle') }}
          </h4>

          <ul class="experience-modal__highlights space-y-2.5 pr-1">
            <li
              v-for="(highlight, index) in roleHighlights"
              :key="index"
              class="experience-modal__highlight"
            >
              <span class="experience-modal__index" aria-hidden="true">
                {{ String(index + 1).padStart(2, '0') }}
              </span>
              <p class="text-sm text-muted leading-relaxed">
                {{ highlight }}
              </p>
            </li>
          </ul>
        </div>
      </div>

      <footer class="experience-modal__footer">
        <span class="text-[9px] font-black uppercase tracking-[0.3em] text-muted">
          {{ $t('about.section') }}
        </span>
        <a
          href="https://linkedin.com/in/mrcego"
          target="_blank"
          rel="noopener noreferrer"
          class="experience-modal__linkedin"
        >
          <Icon name="simple-icons:linkedin" class="w-4 h-4" />
          LinkedIn
        </a>
      </footer>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Motion } from 'motion-v';
import { useI18n } from 'vue-i18n';

const { t, tm } = useI18n();
const { motionInitial, motionInView } = useMotionConfig();

const roleModalVisible = ref(false);
const selectedRoleKey = ref<string | null>(null);

const COMPANY_LOGOS = {
  lingoquesto: { src: '/img/companies/lingoquesto.png', alt: 'LingoQuesto' },
  colegium: { src: '/img/companies/colegium.svg', alt: 'Colegium' },
  tissini: { src: '/img/companies/tissini.png', alt: 'TISSINI' },
  cuartopixel: { src: '/img/companies/cuartopixel.jpg', alt: '4to Pixel', onLight: true },
  zabud: { src: '/img/companies/zabud.png', alt: 'ZABUD Technologies' },
} as const;

type CompanyLogoId = keyof typeof COMPANY_LOGOS;

const roles: { key: CompanyLogoId }[] = [
  { key: 'lingoquesto' },
  { key: 'colegium' },
  { key: 'tissini' },
  { key: 'cuartopixel' },
  { key: 'zabud' },
];

function getCompanyLogo(key: string) {
  if (!(key in COMPANY_LOGOS)) return null;
  return COMPANY_LOGOS[key as CompanyLogoId];
}

const roleHighlights = computed(() => {
  if (!selectedRoleKey.value) return [];

  const items = tm(`about.roles.${selectedRoleKey.value}.highlights`) as unknown;
  if (!Array.isArray(items)) return [];

  return items.map((_: unknown, index: number) =>
    t(`about.roles.${selectedRoleKey.value}.highlights.${index}`),
  );
});

const selectedCompanyLogo = computed(() => {
  if (!selectedRoleKey.value) return null;
  return getCompanyLogo(selectedRoleKey.value);
});

function openRoleModal(key: string) {
  selectedRoleKey.value = key;
  roleModalVisible.value = true;
}

function onRoleCardKeydown(event: KeyboardEvent, key: string) {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  openRoleModal(key);
}

const aboutPoints = [
  {
    label: 'about.expertise',
    descKey: 'techStack.levels.architect',
    icon: 'logos:vue',
  },
  {
    label: 'about.logic',
    descKey: 'techStack.levels.senior',
    icon: 'logos:nodejs-icon',
  },
  {
    label: 'about.userCentric',
    descKey: 'techStack.levels.founding',
    icon: 'logos:figma',
  },
];
</script>

<style scoped>
@keyframes scanline-subtle {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(300%);
  }
}
.animate-scanline {
  animation: scanline-subtle 3s linear infinite;
}

.role-card__logo-wrap {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-shrink: 0;
  width: 4.75rem;
  height: 2.5rem;
  overflow: hidden;
}

@media (min-width: 640px) {
  .role-card__logo-wrap {
    width: 5.25rem;
    height: 2.75rem;
  }
}

@media (min-width: 768px) {
  .role-card__logo-wrap {
    width: 6rem;
    height: 3rem;
  }
}

.role-card__company-logo {
  display: block;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  object-position: center right;
  transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
}

.role-card__company-logo--on-light {
  border-radius: 0.4rem;
  padding: 0.2rem;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.06);
}

.surface-card:hover .role-card__company-logo,
.surface-card:focus-visible .role-card__company-logo {
  transform: scale(1.06);
}

@media (prefers-reduced-motion: reduce) {
  .role-card__company-logo,
  .surface-card:hover .role-card__company-logo,
  .surface-card:focus-visible .role-card__company-logo {
    transition-duration: 0.01ms;
    transform: none;
  }
}
</style>
