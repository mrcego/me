import { AVAILABILITY_CONFIG } from '~/config/availability.config';

/** Parse `YYYY-MM-DD` as local midnight (avoids UTC off-by-one). */
export function parseAvailableFrom(isoDate: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) {
    throw new Error(`Invalid availableFrom ISO date: ${isoDate}`);
  }
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  return new Date(year, month, day);
}

/** Official contract start date — local midnight from content config. */
export const AVAILABILITY_START = parseAvailableFrom(AVAILABILITY_CONFIG.availableFrom);

export function isImmediatelyAvailable(
  now = new Date(),
  availableFrom: string = AVAILABILITY_CONFIG.availableFrom,
) {
  const start = parseAvailableFrom(availableFrom);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return today >= start;
}

/**
 * Availability banner visibility.
 *
 * SSG must NOT freeze a build-time `new Date()` into a dep-less computed forever.
 * Default to the pre-availability announcement in SSR/prerender (matches i18n
 * seeking copy), then reconcile on the client after mount.
 */
export function useAvailability() {
  const showAnnouncement = ref(true);

  if (import.meta.client) {
    onMounted(() => {
      showAnnouncement.value = !isImmediatelyAvailable();
    });
  }

  return {
    showAnnouncement: readonly(showAnnouncement),
  };
}
