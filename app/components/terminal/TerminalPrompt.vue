<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
  suggestions: string[];
  activeSuggestion: number;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
  submit: [];
  'apply-suggestion': [value?: string];
  'move-suggestion': [delta: number];
  'history-prev': [];
  'history-next': [];
}>();

const inputRef = ref<HTMLInputElement | null>(null);

defineExpose({
  focus: () => inputRef.value?.focus(),
  get el() {
    return inputRef.value;
  },
});

const listboxId = 'portfolio-terminal-suggestions';
const activeDescendant = computed(() =>
  props.activeSuggestion >= 0 ? `${listboxId}-${props.activeSuggestion}` : undefined,
);

const ghost = computed(() => {
  const active = props.suggestions[props.activeSuggestion];
  if (!active) return '';
  const value = props.modelValue;
  const token = value.trimEnd().split(/\s+/).pop() ?? '';
  if (!active.startsWith(token) || !token) return '';
  return active.slice(token.length);
});

function onKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'Enter':
      event.preventDefault();
      emit('submit');
      break;
    case 'Tab':
      if (props.suggestions.length) {
        event.preventDefault();
        emit('apply-suggestion');
      }
      break;
    case 'ArrowUp':
      event.preventDefault();
      if (props.suggestions.length && props.modelValue.trim()) {
        emit('move-suggestion', -1);
      } else {
        emit('history-prev');
      }
      break;
    case 'ArrowDown':
      event.preventDefault();
      if (props.suggestions.length && props.modelValue.trim()) {
        emit('move-suggestion', 1);
      } else {
        emit('history-next');
      }
      break;
    case 'Escape':
      break;
    default:
      break;
  }
}
</script>

<template>
  <div class="portfolio-terminal__prompt">
    <label class="sr-only" for="portfolio-terminal-input">{{ $t('terminal.promptLabel') }}</label>
    <div class="portfolio-terminal__prompt-row">
      <span class="portfolio-terminal__prompt-prefix" aria-hidden="true">
        <span class="portfolio-terminal__prompt-seg portfolio-terminal__prompt-seg--user">cg</span
        ><span class="portfolio-terminal__prompt-seg portfolio-terminal__prompt-seg--at">@</span
        ><span class="portfolio-terminal__prompt-seg portfolio-terminal__prompt-seg--host">dev</span
        ><span class="portfolio-terminal__prompt-seg portfolio-terminal__prompt-seg--path"
          >~/me</span
        ><span class="portfolio-terminal__prompt-seg portfolio-terminal__prompt-seg--glyph">❯</span>
      </span>
      <span class="portfolio-terminal__prompt-route" aria-hidden="true">
        <span class="portfolio-terminal__prompt-route-line" />
        <span class="portfolio-terminal__prompt-route-node" />
      </span>
      <div class="portfolio-terminal__input-wrap">
        <span v-if="ghost" class="portfolio-terminal__ghost" aria-hidden="true">
          <span class="portfolio-terminal__ghost-pad">{{ modelValue }}</span
          ><span class="portfolio-terminal__ghost-tail">{{ ghost }}</span>
        </span>
        <input
          id="portfolio-terminal-input"
          ref="inputRef"
          class="portfolio-terminal__input"
          type="text"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          role="combobox"
          aria-autocomplete="list"
          :aria-expanded="suggestions.length > 0"
          :aria-controls="suggestions.length ? listboxId : undefined"
          :aria-activedescendant="activeDescendant"
          :placeholder="$t('terminal.promptPlaceholder')"
          :value="modelValue"
          autofocus
          @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
          @keydown="onKeydown"
        />
      </div>
    </div>

    <ul
      v-if="suggestions.length"
      :id="listboxId"
      class="portfolio-terminal__suggestions"
      role="listbox"
      :aria-label="$t('terminal.suggestionsLabel')"
    >
      <li
        v-for="(item, index) in suggestions"
        :id="`${listboxId}-${index}`"
        :key="item"
        role="option"
        class="portfolio-terminal__suggestion"
        :class="{ 'portfolio-terminal__suggestion--active': index === activeSuggestion }"
        :aria-selected="index === activeSuggestion"
        @mousedown.prevent="emit('apply-suggestion', item)"
      >
        {{ item }}
      </li>
    </ul>

    <p class="portfolio-terminal__prompt-hint lg:hidden">{{ $t('terminal.indexHint') }}</p>
  </div>
</template>
