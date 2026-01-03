import { ref, onMounted, onUnmounted } from 'vue';

export const usePortfolio = () => {
    const activeSection = ref('home');
    const scrollProgress = ref(0);

    const handleScroll = () => {
        // Progress calculation
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        scrollProgress.value = (winScroll / height) * 100;

        // Active section detection (simplified spy)
        const sections = ['home', 'about', 'portfolio', 'contact'];
        for (const section of sections) {
            const el = document.getElementById(section);
            if (el) {
                const rect = el.getBoundingClientRect();
                if (rect.top <= 150 && rect.bottom >= 150) {
                    if (activeSection.value !== section) {
                        activeSection.value = section;
                        // Update hash without jumping only if it changed
                        if (window.location.hash !== `#${section}`) {
                            window.history.replaceState(null, '', `#${section}`);
                        }
                    }
                    break;
                }
            }
        }
    };

    onMounted(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
    });

    onUnmounted(() => {
        window.removeEventListener('scroll', handleScroll);
    });

    return {
        activeSection,
        scrollProgress
    };
};
