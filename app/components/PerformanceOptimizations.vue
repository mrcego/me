<template>
  <span class="sr-only" aria-hidden="true" />
</template>

<script setup lang="ts">
onMounted(() => {
  if (!('serviceWorker' in navigator)) return;

  const register = () => {
    void navigator.serviceWorker.register('/sw.js').catch(() => {
      // SW is optional; ignore registration failures in production.
    });
  };

  if (document.readyState === 'complete') {
    register();
  } else {
    window.addEventListener('load', register, { once: true });
  }
});
</script>
