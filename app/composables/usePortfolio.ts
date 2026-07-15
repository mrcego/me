import { ref, onMounted, onUnmounted } from 'vue';

export const usePortfolio = () => {
  const activeSection = ref('hero');

  const handleScroll = () => {
    const sections = [
      'hero',
      'about',
      'tech-stack',
      'certifications',
      'capabilities',
      'testimonials',
      'contact',
    ];

    for (const section of sections) {
      const el = document.getElementById(section);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
          if (activeSection.value !== section) {
            activeSection.value = section;
          }
          break;
        }
      }
    }
  };

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });

  return {
    activeSection,
  };
};
