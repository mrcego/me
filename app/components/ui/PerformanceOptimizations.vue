<script setup lang="ts">
onMounted(() => {
  if (!('serviceWorker' in navigator)) return;

  // In dev the SW must never run: its cache-first handler would serve stale
  // /_nuxt/* modules, breaking HMR and causing phantom hydration mismatches.
  // Tear down any previously-registered worker + caches so a poisoned browser recovers.
  if (import.meta.dev) {
    void navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => registrations.forEach((r) => void r.unregister()));
    if ('caches' in window) {
      void caches.keys().then((keys) => keys.forEach((key) => void caches.delete(key)));
    }
    return;
  }

  const register = () => {
    void navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        // Check for updates on load immediately
        void registration.update().catch(() => {});

        // Listen for new worker updates and prompt immediate activation
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              newWorker.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        });

        // Check for updates when user returns to the tab
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') {
            void registration.update().catch(() => {});
          }
        });
      })
      .catch(() => {
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

<template>
  <span class="sr-only" aria-hidden="true" />
</template>
