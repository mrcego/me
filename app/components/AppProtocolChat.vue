<template>
  <div
    class="fixed bottom-4 right-4 z-50 flex items-center gap-2 md:bottom-8 md:right-8 pointer-events-none"
  >
    <!-- Scroll to Top Button -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-75"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-75"
    >
      <button
        v-if="showScrollTop"
        aria-label="Scroll to top"
        class="w-16 h-16 md:w-20 md:h-20 glass rounded-4xl flex items-center justify-center text-primary border-primary/20 shadow-4xl hover:scale-110 active:scale-95 transition-all pointer-events-auto relative group overflow-hidden"
        @click="scrollToTop"
      >
        <span
          class="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity"
          aria-hidden="true"
        />
        <Icon name="lucide:chevron-up" class="w-11 h-11 md:w-12 md:h-12 relative z-10" />
      </button>
    </Transition>

    <!-- Chat Trigger Toggle -->
    <button
      class="w-16 h-16 md:w-20 md:h-20 glass rounded-4xl flex items-center justify-center text-primary border-primary/20 shadow-4xl hover:scale-110 active:scale-95 transition-all pointer-events-auto relative group overflow-hidden"
      @click="isOpen = !isOpen"
    >
      <span
        class="absolute inset-x-0 h-px bg-primary-contrast/40 animate-sweep z-20 pointer-events-none"
        aria-hidden="true"
      />
      <span
        class="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity"
        aria-hidden="true"
      />
      <Icon
        v-if="!isOpen"
        name="lucide:message-square"
        class="w-13 h-13 md:w-14 md:h-14 relative z-10"
      />
      <Icon v-else name="lucide:x" class="w-13 h-13 md:w-14 md:h-14 relative z-10" />
    </button>
  </div>

  <!-- Chat Window with Motion -->
  <Motion
    v-if="isOpen"
    :initial="motionInitial({ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' })"
    :animate="motionAnimate({ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' })"
    :exit="{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }"
    class="w-87.5 md:w-112.5 h-125 md:h-150 glass rounded-[2.5rem] border-primary/20 shadow-4xl overflow-hidden flex flex-col pointer-events-auto fixed bottom-24 right-4 md:bottom-28 md:right-8 z-40"
  >
    <!-- HUD Scanlines Background -->
    <div class="absolute inset-0 opacity-[0.03] z-0 pointer-events-none protocol-chat-scanlines" />

    <!-- Terminal Header -->
    <div
      class="p-6 bg-foreground/2 border-b border-foreground/5 flex items-center justify-between relative z-10"
    >
      <div class="flex items-center gap-3">
        <div class="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <h4 class="type-overline text-foreground tracking-[0.3em]">Signal Protocol v4.0</h4>
      </div>
      <button
        class="p-2 text-muted hover:text-foreground transition-colors"
        @click="isOpen = false"
      >
        <Icon name="lucide:x" class="w-7 h-7" />
      </button>
    </div>

    <!-- Chat Log -->
    <div
      ref="chatLog"
      class="flex-1 overflow-y-auto p-6 space-y-6 font-mono relative z-10 scrollbar-hide"
    >
      <div
        v-for="(msg, i) in messages"
        :key="i"
        :class="msg.role === 'bot' ? 'text-left' : 'text-right'"
      >
        <div
          :class="[
            'inline-block px-4 py-2 rounded-2xl text-[11px] leading-relaxed',
            msg.role === 'bot'
              ? 'bg-primary/10 text-primary border border-primary/20'
              : 'bg-foreground/5 text-foreground border border-foreground/10',
          ]"
        >
          <span class="block type-label opacity-40 mb-1">
            {{ msg.role === 'bot' ? 'SIGNAL RECEIVED' : 'OPERATOR TRANSMISSION' }}
          </span>
          {{ msg.content }}
        </div>
      </div>
      <div v-if="isTyping" class="text-left">
        <div
          class="inline-block px-4 py-2 rounded-2xl bg-primary/5 text-primary/60 text-[11px] animate-pulse"
        >
          ANALYZING DATA...
        </div>
      </div>
    </div>

    <!-- Quick Suggestions -->
    <div class="p-4 bg-foreground/1 border-t border-foreground/5 relative z-10">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="s in suggestions"
          :key="s"
          class="px-3 py-1.5 glass rounded-xl type-label text-muted hover:text-primary hover:border-primary/30 transition-all"
          @click="sendMessage(s)"
        >
          {{ s }}
        </button>
      </div>
    </div>

    <!-- Input Area -->
    <div class="p-4 bg-foreground/5 border-t border-foreground/10 relative z-10 flex gap-3">
      <input
        v-model="userInput"
        type="text"
        placeholder="SEND COMMAND..."
        class="flex-1 bg-transparent border-none outline-none text-foreground font-mono text-xs placeholder:text-muted/50"
        @keyup.enter="sendMessage()"
      />
      <button
        class="p-2 text-primary hover:scale-110 active:scale-95 transition-all"
        @click="sendMessage()"
      >
        <Icon name="lucide:send" class="w-7 h-7" />
      </button>
    </div>
  </Motion>
</template>

<script setup>
import { Motion } from 'motion-v';
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue';

const { motionInitial, motionAnimate } = useMotionConfig();

const isOpen = ref(false);
const userInput = ref('');
const isTyping = ref(false);
const showScrollTop = ref(false);
const chatLog = ref(null);

// Scroll to top functionality
const handleScroll = () => {
  showScrollTop.value = window.scrollY > 300;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Check initial scroll position
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const messages = ref([
  {
    role: 'bot',
    content: 'INITIALIZING CORE COMMUNICATION PROTOCOL... WAITING FOR OPERATOR COMMAND.',
  },
]);

const suggestions = [
  'WHO IS CÉSAR GÓMEZ?',
  'WHAT IS THE TECH STACK?',
  'CURRENT MISSION?',
  'EXPERIENCE LEVEL?',
];

const responses = {
  'WHO IS CÉSAR GÓMEZ?':
    'OPERATOR: CÉSAR GÓMEZ IS A SENIOR FULLSTACK DEVELOPER WITH 13+ YEARS OF EXPERIENCE. SPECIALIZED IN FRONTEND ARCHITECTURE (VUE/NUXT) AND ROBUST BACKEND SYSTEMS. FOUNDING MEMBER @ LINGOQUESTO.',
  'WHAT IS THE TECH STACK?':
    'STACK ANALYSIS: VUE 3, NUXT 4, TYPESCRIPT, NODE.JS, TAILWIND CSS 4, PRIMEVUE 4. ARCHITECTURE FOCUSED ON SCALABILITY AND IMPACT.',
  'CURRENT MISSION?':
    'ACTIVE MISSION: DEFINING THE NEXT GENERATION OF ED-TECH PLATFORMS AT LINGOQUESTO AND MAINTAINING HIGH-PERFORMANCE CLOUD ARCHITECTURES.',
  'EXPERIENCE LEVEL?':
    'LEVEL: 13+ YEARS IN PRODUCTION. FRONTEND ARCHITECT. 600K+ LINES OF CODE WRITTEN. CITIZEN OF THE FULLSTACK ECOSYSTEM.',
};

const sendMessage = (content) => {
  const text = content || userInput.value.trim().toUpperCase();
  if (!text) return;

  messages.value.push({ role: 'user', content: text });
  userInput.value = '';
  isTyping.value = true;

  scrollToBottom();

  setTimeout(() => {
    const botResponse =
      responses[text] ||
      'COMMAND NOT RECOGNIZED. PLEASE USE ESTABLISHED PROTOCOLS OR CONTACT DIRECTLY VIA SIGNAL FREQUENCY.';
    messages.value.push({ role: 'bot', content: botResponse });
    isTyping.value = false;
    scrollToBottom();
  }, 1000);
};

const scrollToBottom = () => {
  nextTick(() => {
    if (chatLog.value) {
      chatLog.value.scrollTo({
        top: chatLog.value.scrollHeight,
        behavior: 'smooth',
      });
    }
  });
};

watch(isOpen, (val) => {
  if (val) scrollToBottom();
});
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

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.protocol-chat-scanlines {
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 1px,
    rgba(255, 75, 92, 0.2) 2px
  );
}
</style>
