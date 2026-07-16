import { ref, onMounted, onUnmounted } from 'vue';

const SECTION_IDS = [
  'hero',
  'about',
  'tech-stack',
  'certifications',
  'capabilities',
  'testimonials',
  'contact',
] as const;

export const usePortfolio = () => {
  const activeSection = ref('hero');
  let sectionObserver: IntersectionObserver | null = null;

  onMounted(() => {
    sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top - 96) - Math.abs(b.boundingClientRect.top - 96),
          )[0];

        if (visibleSection?.target.id) {
          activeSection.value = visibleSection.target.id;
        }
      },
      {
        rootMargin: '-96px 0px -70% 0px',
        threshold: [0, 0.1],
      },
    );

    for (const sectionId of SECTION_IDS) {
      const section = document.getElementById(sectionId);
      if (section) sectionObserver.observe(section);
    }
  });

  onUnmounted(() => {
    sectionObserver?.disconnect();
  });

  return {
    activeSection,
  };
};
