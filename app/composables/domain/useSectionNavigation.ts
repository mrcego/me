import {
  buildSectionHref,
  normalizeSectionHash,
  pathsMatchHome,
  revealSectionGeometry,
} from '~/utils/sectionNavigation';
import { withTrailingSlash } from '~/utils/siteUrl';

/**
 * Route-aware section navigation for the single-page home.
 * On expertise landings (no section IDs), navigates to localized home + hash.
 */
export function useSectionNavigation() {
  const route = useRoute();
  const router = useRouter();
  const localePath = useLocalePath();

  const homePath = computed(() => localePath('/'));

  const isOnHome = computed(() => pathsMatchHome(route.path, homePath.value));

  function scrollToHash(hash: string) {
    const targetHash = normalizeSectionHash(hash);
    const id = targetHash.slice(1);
    if (!id || !import.meta.client) return;

    requestAnimationFrame(() => {
      const element = document.getElementById(id);
      if (!element) return;
      revealSectionGeometry(id);
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  async function goToSection(event: Event | undefined, hash: string) {
    event?.preventDefault();
    const targetHash = normalizeSectionHash(hash);
    if (!targetHash) return;

    if (isOnHome.value) {
      if (route.hash !== targetHash) {
        await router.replace({ hash: targetHash });
      }
      scrollToHash(targetHash);
      return;
    }

    await router.push({ path: withTrailingSlash(homePath.value), hash: targetHash });
    await nextTick();
    scrollToHash(targetHash);
  }

  function sectionHref(hash: string): string {
    return buildSectionHref(hash, isOnHome.value, homePath.value);
  }

  return {
    homePath,
    isOnHome,
    goToSection,
    scrollToHash,
    sectionHref,
    normalizeHash: normalizeSectionHash,
    revealSectionGeometry,
  };
}
