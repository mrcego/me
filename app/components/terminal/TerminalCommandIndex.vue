<script setup lang="ts">
import { TERMINAL_COMMANDS } from '~/config/portfolioTerminal.config';

const groups = computed(() => {
  const order = ['info', 'nav', 'system'] as const;
  return order.map((group) => ({
    group,
    commands: TERMINAL_COMMANDS.filter((command) => command.group === group),
  }));
});
</script>

<template>
  <aside class="portfolio-terminal__index" aria-labelledby="portfolio-terminal-index-title">
    <h3 id="portfolio-terminal-index-title" class="portfolio-terminal__index-title type-label">
      {{ $t('terminal.indexTitle') }}
    </h3>
    <p class="portfolio-terminal__index-hint">{{ $t('terminal.indexHint') }}</p>
    <div v-for="bucket in groups" :key="bucket.group" class="portfolio-terminal__index-group">
      <p class="portfolio-terminal__index-group-label type-label">
        {{ $t(`terminal.indexGroups.${bucket.group}`) }}
      </p>
      <ul class="portfolio-terminal__index-list">
        <li
          v-for="command in bucket.commands"
          :key="command.id"
          class="portfolio-terminal__index-item"
        >
          <code>{{ $t(command.usageKey) }}</code>
          <span>{{ $t(command.summaryKey) }}</span>
        </li>
      </ul>
    </div>
  </aside>
</template>
