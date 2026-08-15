/**
 * Contract / availability boundary used by `useAvailability`.
 * Keep in sync with human-readable copy in i18n `availability.announcement.dateValue`.
 */
export const AVAILABILITY_CONFIG = {
  /** No fixed start date — César is available now. */
  availableFrom: null,
} as const;

export type AvailabilityConfig = typeof AVAILABILITY_CONFIG;
