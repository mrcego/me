<template>
  <div
    class="fixed bottom-8 right-8 z-9999 flex flex-col items-end gap-4 pointer-events-none"
  >
    <!-- Chat Window with Motion -->
    <Motion
      v-if="isOpen"
      :initial="{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }"
      :animate="{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }"
      :exit="{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }"
      class="w-[350px] md:w-[450px] h-[500px] md:h-[600px] glass rounded-[2.5rem] border-primary/20 shadow-4xl overflow-hidden flex flex-col pointer-events-auto relative"
    >
      <!-- HUD Scanlines Background -->
      <div
        class="absolute inset-0 opacity-[0.03] z-0 pointer-events-none protocol-chat-scanlines"
      />

      <!-- Terminal Header -->
      <div
        class="p-6 bg-white/2 border-b border-white/5 flex items-center justify-between relative z-10"
      >
        <div class="flex items-center gap-3">
          <div class="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <h4
            class="text-[10px] font-black uppercase tracking-[0.3em] text-white"
          >
            Signal Protocol v4.0
          </h4>
        </div>
        <button
          class="p-2 text-slate-500 hover:text-white transition-colors"
          @click="isOpen = false"
        >
          <Icon name="lucide:x" class="w-4 h-4" />
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
                : 'bg-white/5 text-white border border-white/10',
            ]"
          >
            <span
              class="block text-[8px] font-black uppercase tracking-widest opacity-40 mb-1"
            >
              {{
                msg.role === "bot" ? "SIGNAL RECEIVED" : "OPERATOR TRANSMISSION"
              }}
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
      <div class="p-4 bg-white/1 border-t border-white/5 relative z-10">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="s in suggestions"
            :key="s"
            class="px-3 py-1.5 glass rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-primary hover:border-primary/30 transition-all"
            @click="sendMessage(s)"
          >
            {{ s }}
          </button>
        </div>
      </div>

      <!-- Input Area -->
      <div
        class="p-4 bg-white/5 border-t border-white/10 relative z-10 flex gap-3"
      >
        <input
          v-model="userInput"
          type="text"
          placeholder="SEND COMMAND..."
          class="flex-1 bg-transparent border-none outline-none text-white font-mono text-xs placeholder:text-slate-700"
          @keyup.enter="sendMessage()"
        >
        <button
          class="p-2 text-primary hover:scale-110 active:scale-95 transition-all"
          @click="sendMessage()"
        >
          <Icon name="lucide:send" class="w-4 h-4" />
        </button>
      </div>
    </Motion>

    <!-- Chat Trigger Toggle -->
    <button
      class="w-16 h-16 md:w-20 md:h-20 glass rounded-4xl flex items-center justify-center text-primary border-primary/20 shadow-4xl hover:scale-110 active:scale-95 transition-all pointer-events-auto relative group overflow-hidden"
      @click="isOpen = !isOpen"
    >
      <div
        class="absolute inset-x-0 h-px bg-white/40 animate-sweep z-20 pointer-events-none"
      />
      <div
        class="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity"
      />
      <Icon
        v-if="!isOpen"
        name="lucide:message-square"
        class="w-7 h-7 md:w-8 md:h-8 relative z-10"
      />
      <Icon
        v-else
        name="lucide:x"
        class="w-7 h-7 md:w-8 md:h-8 relative z-10"
      />
    </button>
  </div>
</template>

<script setup>
import { Motion } from "motion-v";
import { ref, watch, nextTick } from "vue";

const isOpen = ref(false);
const userInput = ref("");
const isTyping = ref(false);
const chatLog = ref(null);

const messages = ref([
  {
    role: "bot",
    content:
      "INITIALIZING CORE COMMUNICATION PROTOCOL... WAITING FOR OPERATOR COMMAND.",
  },
]);

const suggestions = [
  "WHO IS CÃ‰SAR GÃ“MEZ?",
  "WHAT IS THE TECH STACK?",
  "CURRENT MISSION?",
  "EXPERIENCE LEVEL?",
];

const responses = {
  "WHO IS CÃ‰SAR GÃ“MEZ?":
    "OPERATOR: CÃ‰SAR GÃ“MEZ IS A SENIOR FULLSTACK DEVELOPER WITH 13+ YEARS OF EXPERIENCE. SPECIALIZED IN FRONTEND ARCHITECTURE (VUE/NUXT) AND ROBUST BACKEND SYSTEMS. FOUNDING MEMBER @ LINGOQUESTO.",
  "WHAT IS THE TECH STACK?":
    "STACK ANALYSIS: VUE 3, NUXT 4, TYPESCRIPT, NODE.JS, TAILWIND CSS 4, PRIMEVUE 4. ARCHITECTURE FOCUSED ON SCALABILITY AND IMPACT.",
  "CURRENT MISSION?":
    "ACTIVE MISSION: DEFINING THE NEXT GENERATION OF ED-TECH PLATFORMS AT LINGOQUESTO AND MAINTAINING HIGH-PERFORMANCE CLOUD ARCHITECTURES.",
  "EXPERIENCE LEVEL?":
    "LEVEL: 13+ YEARS IN PRODUCTION. FRONTEND ARCHITECT. 600K+ LINES OF CODE WRITTEN. CITIZEN OF THE FULLSTACK ECOSYSTEM.",
};

const sendMessage = (content) => {
  const text = content || userInput.value.trim().toUpperCase();
  if (!text) return;

  messages.value.push({ role: "user", content: text });
  userInput.value = "";
  isTyping.value = true;

  scrollToBottom();

  setTimeout(() => {
    const botResponse =
      responses[text] ||
      "COMMAND NOT RECOGNIZED. PLEASE USE ESTABLISHED PROTOCOLS OR CONTACT DIRECTLY VIA SIGNAL FREQUENCY.";
    messages.value.push({ role: "bot", content: botResponse });
    isTyping.value = false;
    scrollToBottom();
  }, 1000);
};

const scrollToBottom = () => {
  nextTick(() => {
    if (chatLog.value) {
      chatLog.value.scrollTo({
        top: chatLog.value.scrollHeight,
        behavior: "smooth",
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

