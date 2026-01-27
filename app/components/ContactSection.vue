<template>
  <section
    id="contact"
    class="py-24 md:py-64 px-6 md:px-12 relative overflow-hidden bg-background"
  >
    <!-- Abstract Architecture blueprint behind -->
    <div
      class="absolute inset-x-[-10%] top-1/2 -translate-y-1/2 h-px bg-primary/10 rotate-15 z-0"
    />
    <div
      class="absolute inset-x-[-10%] top-1/2 -translate-y-1/2 h-px bg-accent/10 -rotate-15 z-0"
    />

    <div class="container mx-auto z-10 relative">
      <div class="grid lg:grid-cols-2 gap-16 md:gap-32 items-center">
        <Motion
          :initial="{ opacity: 0, x: -50 }"
          :in-view="{ opacity: 1, x: 0 }"
          :transition="{ duration: 1, ease: [0.16, 1, 0.3, 1] }"
          :viewport="{ once: true }"
          class="space-y-8 sm:space-y-12 md:space-y-20"
        >
          <div
            class="space-y-6 sm:space-y-8 md:space-y-12 group text-center lg:text-left"
          >
            <div
              class="flex items-center justify-center lg:justify-start gap-4 md:gap-6"
            >
              <div class="h-px w-12 md:w-16 bg-primary" />
              <h2
                class="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-primary"
              >
                {{ $t("contact.section") }}
              </h2>
            </div>
            <h3
              class="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter leading-none text-foreground whitespace-pre-line"
            >
              {{ $t("contact.title") }}<br />
              <span class="text-gradient">{{
                $t("contact.titleHighlight")
              }}</span
              ><br />
              {{ $t("contact.titleEnd") }}
            </h3>
            <p
              class="text-muted text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl leading-relaxed font-medium tracking-tight max-w-xl mx-auto lg:mx-0"
            >
              {{ $t("contact.description") }}
            </p>
          </div>

          <div class="space-y-6 sm:space-y-8 md:space-y-12">
            <a
              v-for="c in contactMethods"
              :key="c.label"
              :href="c.link"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="`Contact via ${c.label}`"
              class="flex items-center gap-4 sm:gap-6 md:gap-10 group cursor-pointer transition-all duration-500 hover:translate-x-3 active:scale-95"
            >
              <div
                class="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 glass rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-contrast transition-all duration-700 shadow-xl shrink-0 group-hover:rotate-6"
              >
                <Icon :name="c.icon" class="w-14 h-14 md:w-16 md:h-16" />
              </div>
              <div class="space-y-1 sm:space-y-1.5 md:space-y-2 text-left">
                <p
                  class="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted group-hover:text-primary transition-colors"
                >
                  {{ $t(`contact.methods.${c.key}`) }}
                </p>
                <p
                  class="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-black text-foreground tracking-tighter break-all group-hover:text-gradient transition-all"
                >
                  {{ c.value }}
                </p>
              </div>
            </a>
          </div>
        </Motion>

        <!-- PrimeVue Form with Motion -->
        <Motion
          :initial="{ opacity: 0, x: 50 }"
          :in-view="{ opacity: 1, x: 0 }"
          :transition="{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }"
          :viewport="{ once: true }"
          class="glass p-6 sm:p-8 md:p-12 lg:p-16 xl:p-24 rounded-[2.5rem] sm:rounded-[3rem] md:rounded-[4rem] lg:rounded-[5rem] border-foreground/5 relative overflow-hidden group shadow-4xl mt-12 lg:mt-0"
        >
          <div
            class="absolute inset-0 bg-primary opacity-0 group-hover:opacity-[0.03] transition-opacity duration-1000 pointer-events-none"
          />

          <form
            class="space-y-6 sm:space-y-8 md:space-y-12 relative z-10"
            @submit.prevent="submitForm"
          >
            <!-- Success Message -->
            <div
              v-if="submitSuccess"
              class="p-4 sm:p-6 bg-green-500/10 border border-green-500/30 rounded-2xl text-green-400 text-sm sm:text-base font-medium text-center"
            >
              {{ $t("contact.form.success") }}
            </div>

            <!-- Error Message -->
            <div
              v-if="submitError"
              class="p-4 sm:p-6 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm sm:text-base font-medium text-center"
            >
              {{
                submitError === true ? $t("contact.form.error") : submitError
              }}
            </div>

            <div class="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-10">
              <div class="space-y-2 sm:space-y-3 md:space-y-4 group/input">
                <label
                  for="contact-name"
                  class="text-[8px] sm:text-[9px] md:text-[10px] uppercase font-black tracking-widest text-muted block pl-3 sm:pl-4 md:pl-6 group-focus-within/input:text-primary transition-colors"
                  >{{ $t("contact.form.name") }}</label
                >
                <inputText
                  id="contact-name"
                  v-model="formData.name"
                  :placeholder="$t('contact.form.namePlaceholder')"
                  :aria-invalid="!!errors.name"
                  :aria-describedby="errors.name ? 'name-error' : undefined"
                  class="w-full"
                  :pt="{
                    root: {
                      class:
                        'rounded-xl sm:rounded-2xl md:rounded-3xl p-3! sm:p-4! md:p-6! bg-foreground/3! border-foreground/5! focus:border-primary/60! focus:ring-4! sm:focus:ring-8! focus:ring-primary/10! transition-all duration-500 text-sm md:text-base hover:border-foreground/20 text-foreground!',
                    },
                  }"
                />
                <span
                  v-if="errors.name"
                  id="name-error"
                  class="text-red-400 text-xs sm:text-sm pl-3 sm:pl-4 md:pl-6 block"
                  >{{ errors.name }}</span
                >
              </div>
              <div class="space-y-2 sm:space-y-3 md:space-y-4 group/input">
                <label
                  for="contact-email"
                  class="text-[8px] sm:text-[9px] md:text-[10px] uppercase font-black tracking-widest text-muted block pl-3 sm:pl-4 md:pl-6 group-focus-within/input:text-primary transition-colors"
                  >{{ $t("contact.form.email") }}</label
                >
                <inputText
                  id="contact-email"
                  v-model="formData.email"
                  type="email"
                  :placeholder="$t('contact.form.emailPlaceholder')"
                  :aria-invalid="!!errors.email"
                  :aria-describedby="errors.email ? 'email-error' : undefined"
                  class="w-full"
                  :pt="{
                    root: {
                      class:
                        'rounded-xl sm:rounded-2xl md:rounded-3xl p-3! sm:p-4! md:p-6! bg-foreground/3! border-foreground/5! focus:border-primary/60! focus:ring-4! sm:focus:ring-8! focus:ring-primary/10! transition-all duration-500 text-sm md:text-base hover:border-foreground/20 text-foreground!',
                    },
                  }"
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
                class="text-[8px] sm:text-[9px] md:text-[10px] uppercase font-black tracking-widest text-muted block pl-3 sm:pl-4 md:pl-6 group-focus-within/input:text-primary transition-colors"
                >{{ $t("contact.form.subject") }}</label
              >
              <inputText
                id="contact-subject"
                v-model="formData.subject"
                :placeholder="$t('contact.form.subjectPlaceholder')"
                :aria-invalid="!!errors.subject"
                :aria-describedby="errors.subject ? 'subject-error' : undefined"
                class="w-full"
                :pt="{
                  root: {
                    class:
                      'rounded-xl sm:rounded-2xl md:rounded-3xl !p-3 sm:!p-4 md:!p-6 !bg-foreground/3 !border-foreground/5 focus:border-primary/60! focus:ring-4! sm:focus:ring-8! focus:ring-primary/10! transition-all duration-500 text-sm md:text-base hover:border-foreground/20 text-foreground!',
                  },
                }"
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
                class="text-[8px] sm:text-[9px] md:text-[10px] uppercase font-black tracking-widest text-muted block pl-3 sm:pl-4 md:pl-6 group-focus-within/input:text-primary transition-colors"
                >{{ $t("contact.form.message") }}</label
              >
              <Textarea
                id="contact-message"
                v-model="formData.message"
                :placeholder="$t('contact.form.messagePlaceholder')"
                rows="4"
                :aria-invalid="!!errors.message"
                :aria-describedby="errors.message ? 'message-error' : undefined"
                class="w-full"
                :pt="{
                  root: {
                    class:
                      'rounded-xl sm:rounded-[1.5rem] md:rounded-[2.5rem] !p-4 sm:!p-6 md:!p-8 !bg-foreground/3 !border-foreground/5 focus:border-primary/60! focus:ring-4! sm:focus:ring-8! focus:ring-primary/10! transition-all duration-500 focus:rounded-2xl text-sm md:text-base hover:border-foreground/20 text-foreground!',
                  },
                }"
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
              class="w-full rounded-xl! sm:rounded-[1.8rem]! md:rounded-[2.5rem]! p-5! sm:p-6! md:p-8! bg-primary! text-primary-contrast shadow-3xl shadow-primary/30 group/btn transition-all duration-500 overflow-hidden relative active:scale-95 active:shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <div
                class="absolute inset-x-0 top-0 h-px bg-primary-contrast/40 animate-sweep pointer-events-none"
              />
              <div
                class="absolute inset-0 bg-linear-to-tr from-transparent via-primary-contrast/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"
              />
              <span
                class="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 text-[9px] sm:text-[10px] md:text-sm font-black uppercase tracking-[0.25em] sm:tracking-[0.3em] md:tracking-[0.4em] relative z-10 transition-transform group-hover/btn:scale-105"
              >
                <Icon
                  v-if="!isSubmitting"
                  name="solar:plain-linear"
                  class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                />
                <Icon
                  v-else
                  name="solar:sort-vertical-linear"
                  class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 animate-spin"
                />
                {{
                  isSubmitting
                    ? $t("contact.form.sending")
                    : $t("contact.form.submit")
                }}
              </span>
            </Button>
          </form>
        </Motion>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Motion } from "motion-v";
import { useContactForm } from "~/composables/useContactForm";

const {
  formData,
  errors,
  isSubmitting,
  submitSuccess,
  submitError,
  submitForm,
} = useContactForm();

const contactMethods = [
  {
    key: "email",
    label: "Direct Signal",
    value: "cesargomezh90@gmail.com",
    icon: "logos:google-gmail",
    link: "mailto:cesargomezh90@gmail.com",
  },
  {
    key: "linkedin",
    label: "Professional Mesh",
    value: "linkedin.com/in/mrcego",
    icon: "logos:linkedin-icon",
    link: "https://linkedin.com/in/mrcego",
  },
  {
    key: "github",
    label: "Open Protocol",
    value: "github.com/mrcego",
    icon: "simple-icons:github",
    link: "https://github.com/mrcego",
  },
  {
    key: "whatsapp",
    label: "Secure Line",
    value: "+57 333 263 6550",
    icon: "logos:whatsapp-icon",
    link: "https://wa.me/573332636550",
  },
];
</script>

<style scoped>
@keyframes sweep {
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
.animate-sweep {
  animation: sweep 4s ease-in-out infinite;
}
</style>
