<script setup lang="ts">
import { Motion } from 'motion-v';

import { getI18nArray } from '~/core/utils/i18nHelpers';

const { tm, rt } = useI18n();
const { getLocalAvatar, getInitials } = useTestimonialAvatar();
const { motionInitial, motionInView, motionTransition } = useMotionConfig();

const failedAvatars = ref(new Set<string>());
const expandedQuotes = ref(new Set<string>());

interface TestimonialEntry {
  name: string;
  role: string;
  quote: string;
}

const testimonials = computed(() => {
  const data = getI18nArray<TestimonialEntry>(tm, 'testimonials.data');
  return data.map((t) => ({
    name: rt(t.name),
    role: rt(t.role),
    quote: rt(t.quote),
  }));
});

const avatarSrc = (name: string) => getLocalAvatar(name);

const markAvatarFailed = (name: string) => {
  failedAvatars.value = new Set([...failedAvatars.value, name]);
};

const isExpanded = (name: string) => expandedQuotes.value.has(name);

const toggleQuote = (name: string) => {
  const next = new Set(expandedQuotes.value);
  if (next.has(name)) next.delete(name);
  else next.add(name);
  expandedQuotes.value = next;
};

/** Long enough that line-clamp-5 likely truncates — show expand control. */
const needsExpand = (quote: string) => quote.length > 220;

watch(testimonials, () => {
  failedAvatars.value = new Set();
  expandedQuotes.value = new Set();
});
</script>

<template>
  <section
    id="testimonials"
    class="py-24 md:py-48 px-6 md:px-12 bg-secondary/5 relative overflow-hidden"
  >
    <div class="container mx-auto space-y-10 md:space-y-16">
      <Motion
        :initial="motionInitial({ opacity: 0, y: 5 }, { opacity: 1, y: 0 })"
        :while-in-view="motionInView({ opacity: 1, y: 0 })"
        :transition="motionTransition({ duration: 0.4 })"
        :viewport="{ once: true, amount: 0.1 }"
        class="max-w-4xl mx-auto text-center space-y-8"
      >
        <div class="flex items-center justify-center gap-4">
          <div class="h-px w-10 bg-primary/40" />
          <p class="type-eyebrow tracking-[0.4em]">
            {{ $t('testimonials.section') }}
          </p>
          <div class="h-px w-10 bg-primary/40" />
        </div>
        <h2
          class="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-foreground text-balance"
        >
          <span class="block">{{ $t('testimonials.title') }}</span>
          <span class="text-gradient inline-block">{{ $t('testimonials.titleHighlight') }}</span>
        </h2>
      </Motion>

      <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-12 items-stretch">
        <Motion
          v-for="(t, i) in testimonials"
          :key="t.name"
          :initial="
            motionInitial({ opacity: 0, scale: 0.98, y: 5 }, { opacity: 1, scale: 1, y: 0 })
          "
          :while-in-view="motionInView({ opacity: 1, scale: 1, y: 0 })"
          :transition="motionTransition({ duration: 0.4, delay: i * 0.05 })"
          :viewport="{ once: true, amount: 0.1 }"
          class="surface-card surface-evidence group relative p-6 sm:p-8 md:p-14 rounded-3xl sm:rounded-[3.5rem] overflow-hidden h-full min-w-0"
        >
          <div
            class="surface-card__glow absolute inset-0 bg-radial from-primary/5 via-transparent to-transparent pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-500"
          />

          <div class="relative z-10 space-y-8 sm:space-y-10">
            <div class="surface-card__quote-icon text-muted">
              <Icon
                name="solar:chat-square-code-bold-duotone"
                class="w-[58px] h-[58px] md:w-[66px] md:h-[66px] opacity-50"
                aria-hidden="true"
              />
            </div>

            <blockquote class="surface-card__text space-y-3">
              <p
                class="text-base sm:text-lg md:text-xl text-muted font-medium leading-relaxed italic wrap-break-word text-pretty"
                :class="isExpanded(t.name) ? '' : 'line-clamp-5'"
              >
                "{{ t.quote }}"
              </p>
              <button
                v-if="needsExpand(t.quote)"
                type="button"
                class="type-label text-primary hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
                :aria-expanded="isExpanded(t.name)"
                @click="toggleQuote(t.name)"
              >
                {{
                  isExpanded(t.name)
                    ? $t('testimonials.collapseQuote')
                    : $t('testimonials.expandQuote')
                }}
              </button>
            </blockquote>

            <footer
              class="surface-card__footer flex items-center gap-6 pt-6 border-t border-foreground/5"
            >
              <div
                class="surface-card__avatar w-14 h-14 rounded-2xl glass-lite overflow-hidden border border-foreground/10 shrink-0"
              >
                <NuxtImg
                  v-if="!failedAvatars.has(t.name)"
                  :src="avatarSrc(t.name)"
                  :alt="`${t.name} — ${t.role}`"
                  width="56"
                  height="56"
                  loading="lazy"
                  class="surface-card__image w-full h-full object-cover grayscale brightness-90"
                  @error="markAvatarFailed(t.name)"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center bg-primary/15 text-primary font-black text-sm"
                  :aria-label="t.name"
                >
                  {{ getInitials(t.name) }}
                </div>
              </div>
              <div class="space-y-1 min-w-0">
                <cite
                  class="text-lg font-black text-foreground tracking-tight not-italic block truncate"
                >
                  {{ t.name }}
                </cite>
                <p class="surface-card__meta type-meta text-muted line-clamp-2">
                  {{ t.role }}
                </p>
              </div>
            </footer>
          </div>

          <div
            class="surface-card__line surface-card__line--grow absolute inset-x-0 bottom-0 h-1 bg-primary origin-left pointer-events-none z-20"
          />
        </Motion>
      </div>
    </div>
  </section>
</template>
