<template>
  <section
    id="contact"
    class="contact-section py-24 md:py-64 px-6 md:px-12 relative overflow-hidden bg-background"
  >
    <div
      class="pointer-events-none absolute -bottom-24 left-1/2 h-112 w-md -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]"
      aria-hidden="true"
    />
    <div
      class="absolute inset-x-[-10%] top-1/2 -translate-y-1/2 h-px bg-primary/10 rotate-15 z-0"
      aria-hidden="true"
    />
    <div
      class="absolute inset-x-[-10%] top-1/2 -translate-y-1/2 h-px bg-accent/10 -rotate-15 z-0"
      aria-hidden="true"
    />

    <div class="container mx-auto z-10 relative">
      <div class="grid lg:grid-cols-2 gap-16 md:gap-32 items-center">
        <Motion
          :initial="motionInitial({ opacity: 0, x: -50 }, { opacity: 1, x: 0 })"
          :while-in-view="motionInView({ opacity: 1, x: 0 })"
          :transition="{ duration: 1, ease: [0.16, 1, 0.3, 1] }"
          :viewport="{ once: true }"
          class="space-y-8 sm:space-y-10 md:space-y-14"
        >
          <div class="space-y-6 sm:space-y-8 md:space-y-12 group text-center lg:text-left">
            <div class="flex items-center justify-center lg:justify-start gap-4 md:gap-6">
              <div class="h-px w-12 md:w-16 bg-primary" aria-hidden="true" />
              <h2 class="type-eyebrow tracking-[0.4em]">
                {{ $t('contact.section') }}
              </h2>
            </div>
            <h3
              id="contact-heading"
              class="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter leading-none text-foreground whitespace-pre-line text-balance"
            >
              {{ $t('contact.title') }}<br />
              <span class="text-gradient">{{ $t('contact.titleHighlight') }}</span
              ><br />
              {{ $t('contact.titleEnd') }}
            </h3>
            <p
              class="text-muted text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl leading-relaxed font-medium tracking-tight max-w-xl mx-auto lg:mx-0 text-pretty"
            >
              {{ $t('contact.description') }}
            </p>
          </div>

          <div class="space-y-4 md:space-y-5">
            <a
              v-for="c in contactMethods"
              :key="c.key"
              :href="c.link"
              class="contact-method glass flex items-center gap-4 md:gap-5 group touch-manipulation rounded-2xl border border-foreground/10 bg-foreground/3 px-3 py-3.5 md:px-4 md:py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              :target="c.external ? '_blank' : undefined"
              :rel="c.external ? 'noopener noreferrer' : undefined"
              :aria-label="
                $t('contact.methodAria', {
                  method: $t(`contact.methods.${c.key}`),
                  value: c.value,
                })
              "
            >
              <div
                class="contact-method__icon flex size-16 md:size-18 lg:size-20 shrink-0 items-center justify-center rounded-2xl border border-foreground/15 bg-background/45 text-primary shadow-xl"
                aria-hidden="true"
              >
                <Icon :name="c.icon" class="contact-method__glyph size-7 md:size-8 lg:size-9" />
              </div>
              <div class="min-w-0 flex-1 space-y-1 text-left">
                <p
                  class="type-meta text-muted transition-colors duration-300 group-hover:text-primary"
                >
                  {{ $t(`contact.methods.${c.key}`) }}
                </p>
                <p
                  class="text-base sm:text-lg md:text-xl font-black text-foreground tracking-tight wrap-break-word"
                >
                  {{ c.value }}
                </p>
              </div>
              <Icon
                name="solar:arrow-right-up-linear"
                class="contact-method__arrow size-5 shrink-0 text-muted/60 transition-[color,transform,opacity] duration-300 group-hover:text-primary"
                aria-hidden="true"
              />
            </a>
          </div>
        </Motion>

        <Motion
          :initial="motionInitial({ opacity: 0, x: 50 }, { opacity: 1, x: 0 })"
          :while-in-view="motionInView({ opacity: 1, x: 0 })"
          :transition="{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }"
          :viewport="{ once: true }"
          class="surface-card group glass p-6 sm:p-8 md:p-10 lg:p-12 rounded-[2.5rem] sm:rounded-[3rem] md:rounded-[4rem] border-foreground/5 relative overflow-hidden shadow-4xl mt-12 lg:mt-0"
        >
          <div class="surface-card__glow absolute inset-0 bg-primary/5 pointer-events-none" />

          <form
            name="portfolio-contact"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            class="space-y-5 sm:space-y-6 md:space-y-7 relative z-10"
            novalidate
            aria-labelledby="contact-heading"
            @submit.prevent="submitForm"
          >
            <input type="hidden" name="form-name" value="portfolio-contact" />
            <p class="hidden" aria-hidden="true">
              <label>
                Don't fill this out:
                <input name="bot-field" tabindex="-1" autocomplete="off" />
              </label>
            </p>

            <div
              v-if="submitSuccess"
              role="status"
              aria-live="polite"
              class="p-4 sm:p-6 bg-green-500/10 border border-green-500/30 rounded-2xl text-green-400 text-sm sm:text-base font-medium text-center text-pretty"
            >
              {{ $t('contact.form.success') }}
            </div>

            <div
              v-if="submitError"
              role="alert"
              aria-live="assertive"
              class="p-4 sm:p-6 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm sm:text-base font-medium text-center text-pretty"
            >
              {{ submitError }}
            </div>

            <div class="grid sm:grid-cols-2 gap-4 md:gap-5 items-start">
              <div class="contact-field group/input">
                <label
                  for="contact-name"
                  class="contact-field__label type-label text-muted pl-3 sm:pl-4 md:pl-6 group-focus-within/input:text-primary transition-colors duration-300"
                  >{{ $t('contact.form.name') }}</label
                >
                <InputText
                  id="contact-name"
                  v-model="formData.name"
                  name="name"
                  autocomplete="name"
                  :placeholder="$t('contact.form.namePlaceholder')"
                  :aria-invalid="!!errors.name"
                  :aria-describedby="errors.name ? 'name-error' : undefined"
                  class="w-full"
                  :pt="{ root: { class: fieldClass } }"
                />
                <span
                  v-if="errors.name"
                  id="name-error"
                  class="text-red-400 text-xs sm:text-sm pl-3 sm:pl-4 md:pl-6 block"
                  >{{ errors.name }}</span
                >
              </div>
              <div class="contact-field group/input">
                <label
                  for="contact-email"
                  class="contact-field__label type-label text-muted pl-3 sm:pl-4 md:pl-6 group-focus-within/input:text-primary transition-colors duration-300"
                  >{{ $t('contact.form.email') }}</label
                >
                <InputText
                  id="contact-email"
                  v-model="formData.email"
                  type="email"
                  name="email"
                  autocomplete="email"
                  inputmode="email"
                  :spellcheck="false"
                  :placeholder="$t('contact.form.emailPlaceholder')"
                  :aria-invalid="!!errors.email"
                  :aria-describedby="errors.email ? 'email-error' : undefined"
                  class="w-full"
                  :pt="{ root: { class: fieldClass } }"
                />
                <span
                  v-if="errors.email"
                  id="email-error"
                  class="text-red-400 text-xs sm:text-sm pl-3 sm:pl-4 md:pl-6 block"
                  >{{ errors.email }}</span
                >
              </div>
            </div>

            <div class="space-y-2 sm:space-y-3 md:space-y-4 group/input">
              <label
                for="contact-subject"
                class="type-label text-muted block pl-3 sm:pl-4 md:pl-6 group-focus-within/input:text-primary transition-colors duration-300"
                >{{ $t('contact.form.subject') }}</label
              >
              <InputText
                id="contact-subject"
                v-model="formData.subject"
                name="subject"
                autocomplete="off"
                :placeholder="$t('contact.form.subjectPlaceholder')"
                :aria-invalid="!!errors.subject"
                :aria-describedby="errors.subject ? 'subject-error' : undefined"
                class="w-full"
                :pt="{ root: { class: fieldClass } }"
              />
              <span
                v-if="errors.subject"
                id="subject-error"
                class="text-red-400 text-xs sm:text-sm pl-3 sm:pl-4 md:pl-6 block"
                >{{ errors.subject }}</span
              >
            </div>

            <div class="space-y-2 sm:space-y-3 md:space-y-4 group/input">
              <label
                for="contact-message"
                class="type-label text-muted block pl-3 sm:pl-4 md:pl-6 group-focus-within/input:text-primary transition-colors duration-300"
                >{{ $t('contact.form.message') }}</label
              >
              <Textarea
                id="contact-message"
                v-model="formData.message"
                name="message"
                autocomplete="off"
                :placeholder="$t('contact.form.messagePlaceholder')"
                rows="4"
                :aria-invalid="!!errors.message"
                :aria-describedby="errors.message ? 'message-error' : undefined"
                class="w-full"
                :pt="{ root: { class: textareaClass } }"
              />
              <span
                v-if="errors.message"
                id="message-error"
                class="text-red-400 text-xs sm:text-sm pl-3 sm:pl-4 md:pl-6 block"
                >{{ errors.message }}</span
              >
            </div>

            <Button
              type="submit"
              :disabled="isSubmitting"
              :aria-busy="isSubmitting"
              class="w-full rounded-xl! sm:rounded-[1.8rem]! md:rounded-[2.5rem]! p-5! sm:p-6! md:p-7! bg-primary! text-primary-contrast! shadow-3xl shadow-primary/30 group/btn overflow-hidden relative active:scale-95 active:shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-contrast/40 focus-visible:ring-offset-2 focus-visible:ring-offset-primary transition-[transform,box-shadow,opacity] duration-300"
            >
              <span
                class="contact-submit__sweep absolute inset-x-0 top-0 h-px bg-primary-contrast/40 pointer-events-none"
                aria-hidden="true"
              />
              <span
                class="absolute inset-0 bg-linear-to-tr from-transparent via-primary-contrast/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"
                aria-hidden="true"
              />
              <span
                class="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 text-sm sm:text-base font-black uppercase tracking-[0.25em] sm:tracking-[0.3em] md:tracking-[0.4em] relative z-10 transition-transform duration-300 group-hover/btn:scale-105"
              >
                <Icon
                  v-if="!isSubmitting"
                  name="solar:plain-bold-duotone"
                  class="size-7 sm:size-8 md:size-9"
                  aria-hidden="true"
                />
                <Icon
                  v-else
                  name="solar:sort-vertical-linear"
                  class="w-[26px] h-[26px] sm:w-[30px] sm:h-[30px] md:w-[34px] md:h-[34px] animate-spin"
                  aria-hidden="true"
                />
                {{ isSubmitting ? $t('contact.form.sending') : $t('contact.form.submit') }}
              </span>
            </Button>
          </form>

          <div
            class="surface-card__line surface-card__line--grow absolute inset-x-0 bottom-0 h-1 bg-primary origin-left pointer-events-none z-20"
          />
        </Motion>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Motion } from 'motion-v';
import { useContactForm } from '~/composables/useContactForm';

const { motionInitial, motionInView } = useMotionConfig();

const { formData, errors, isSubmitting, submitSuccess, submitError, submitForm } = useContactForm();

const fieldClass =
  'rounded-xl sm:rounded-2xl md:rounded-3xl p-3! sm:p-4! md:p-5! bg-foreground/7! border-foreground/15! focus:border-primary/60! focus:ring-4! sm:focus:ring-8! focus:ring-primary/10! transition-[border-color,box-shadow,background-color] duration-300 text-sm md:text-base hover:border-foreground/25! text-foreground! placeholder:text-muted/70!';

const textareaClass =
  'rounded-xl sm:rounded-2xl md:rounded-3xl !p-4 sm:!p-5 md:!p-6 !bg-foreground/7 !border-foreground/15 focus:border-primary/60! focus:ring-4! sm:focus:ring-8! focus:ring-primary/10! transition-[border-color,box-shadow,background-color,border-radius] duration-300 focus:rounded-2xl text-sm md:text-base hover:border-foreground/25! text-foreground! placeholder:text-muted/70! min-h-32';

const contactMethods = [
  {
    key: 'email',
    value: 'cesargomezh90@gmail.com',
    icon: 'logos:google-gmail',
    link: 'mailto:cesargomezh90@gmail.com',
    external: false,
  },
  {
    key: 'linkedin',
    value: 'linkedin.com/in/mrcego',
    icon: 'logos:linkedin-icon',
    link: 'https://linkedin.com/in/mrcego',
    external: true,
  },
  {
    key: 'github',
    value: 'github.com/mrcego',
    icon: 'simple-icons:github',
    link: 'https://github.com/mrcego',
    external: true,
  },
  {
    key: 'whatsapp',
    value: '+57 333 263 6550',
    icon: 'logos:whatsapp-icon',
    link: 'https://wa.me/573332636550',
    external: true,
  },
] as const;
</script>

<style scoped>
.contact-section {
  scroll-margin-top: calc(var(--availability-banner-h, 0px) + 5.5rem);
}

.contact-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

@media (min-width: 640px) {
  .contact-field {
    gap: 0.75rem;
  }
}

@media (min-width: 768px) {
  .contact-field {
    gap: 1rem;
  }
}

/* Reserve two label lines so paired inputs stay level when one wraps */
.contact-field__label {
  display: flex;
  align-items: flex-end;
  min-height: 2.75em;
  line-height: 1.35;
}

.contact-method {
  transition:
    transform 0.45s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.3s ease,
    background-color 0.3s ease,
    box-shadow 0.3s ease;
}

.contact-method:hover {
  border-color: color-mix(in srgb, var(--primary) 38%, transparent);
  background-color: color-mix(in srgb, var(--primary) 7%, transparent);
  box-shadow: 0 18px 52px color-mix(in srgb, var(--primary) 12%, transparent);
  transform: translateX(0.375rem);
}

.contact-method:active {
  transform: scale(0.98);
}

.contact-method__arrow {
  opacity: 0.58;
}

.contact-method:hover .contact-method__arrow {
  opacity: 1;
  transform: translate(0.125rem, -0.125rem);
}

.contact-method__icon {
  transition:
    background-color 0.5s ease,
    border-color 0.5s ease,
    color 0.5s ease,
    transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.contact-method:hover .contact-method__icon {
  border-color: color-mix(in srgb, var(--primary) 42%, transparent);
  background-color: color-mix(in srgb, var(--primary) 10%, var(--background));
  transform: translateY(-0.125rem);
}

.contact-method__glyph {
  transform-box: fill-box;
  transform-origin: center;
}

.contact-submit__sweep {
  animation: contact-sweep 4s ease-in-out infinite;
}

@keyframes contact-sweep {
  0% {
    transform: translateY(-20px) scaleX(0);
    opacity: 0;
  }
  20% {
    transform: translateY(0) scaleX(1);
    opacity: 1;
  }
  80% {
    transform: translateY(50px) scaleX(1);
    opacity: 1;
  }
  100% {
    transform: translateY(100px) scaleX(0);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .contact-method,
  .contact-method__icon,
  .contact-method__arrow,
  .contact-submit__sweep {
    transition: none;
    animation: none;
  }

  .contact-method:hover,
  .contact-method:active,
  .contact-method:hover .contact-method__arrow,
  .contact-method:hover .contact-method__icon {
    transform: none;
  }
}

@media (hover: none) {
  .contact-method:hover {
    transform: none;
  }
}
</style>
