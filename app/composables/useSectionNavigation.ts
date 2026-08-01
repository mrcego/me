import { buildSectionHref, normalizeSectionHash, pathsMatchHome } from '~/utils/sectionNavigation';
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

  function revealSectionGeometry(targetId?: string) {
    // content-visibility can under-report height; reveal the target and near siblings only.
    const sections = [...document.querySelectorAll('.portfolio-content > [id]')] as HTMLElement[];
    if (!sections.length) return;

    let focusIndex = targetId ? sections.findIndex((section) => section.id === targetId) : -1;
    if (focusIndex < 0) focusIndex = 0;

    const start = Math.max(0, focusIndex - 1);
    const end = Math.min(sections.length - 1, focusIndex + 1);
    for (let i = start; i <= end; i++) {
      const section = sections[i];
      if (section) section.style.contentVisibility = 'visible';
    }
  }

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
