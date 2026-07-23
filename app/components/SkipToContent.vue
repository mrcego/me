<template>
  <a href="#main-content" class="skip-to-content" @click="skipToContent">
    {{ $t('a11y.skipToContent') }}
  </a>
</template>

<script setup>
const skipToContent = (e) => {
  e.preventDefault();
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.focus();
    mainContent.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<style scoped>
.skip-to-content {
  position: absolute;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  padding: 1rem 2rem;
  background: var(--color-primary);
  color: white;
  font-weight: 900;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: top 0.3s ease;
}

.skip-to-content:focus {
  top: 1rem;
  outline: 3px solid white;
  outline-offset: 4px;
}
</style>
