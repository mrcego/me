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
export const AVAILABILITY_START = AVAILABILITY_CONFIG.availableFrom
  ? parseAvailableFrom(AVAILABILITY_CONFIG.availableFrom)
  : new Date(2026, 0, 1);

export function isImmediatelyAvailable(
  now = new Date(),
  availableFrom: string | null = AVAILABILITY_CONFIG.availableFrom,
) {
  if (!availableFrom) return true;
  const start = parseAvailableFrom(availableFrom);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return today >= start;
}

export function isBannerEnabled(): boolean {
  try {
    const config = useRuntimeConfig();
    if (config?.public?.availabilityBannerEnabled !== undefined) {
      return Boolean(config.public.availabilityBannerEnabled);
    }
  } catch {
    // Outside Nuxt context (plain unit tests)
  }
  return AVAILABILITY_CONFIG.enabled;
}

/**
 * Availability banner visibility.
 *
 * Defaults to `AVAILABILITY_CONFIG.enabled` (or `NUXT_PUBLIC_AVAILABILITY_BANNER_ENABLED`),
 * allowing instant hiding/showing of the top banner.
 */
export function useAvailability(bannerEnabledOverride?: boolean) {
  const enabled =
    typeof bannerEnabledOverride === 'boolean' ? bannerEnabledOverride : isBannerEnabled();

  const showAnnouncement = ref(enabled);
  const isAvailable = ref(false);

  if (import.meta.client) {
    onMounted(() => {
      isAvailable.value = isImmediatelyAvailable();
    });
  }

  return {
    showAnnouncement: readonly(showAnnouncement),
    isAvailable: readonly(isAvailable),
  };
}
