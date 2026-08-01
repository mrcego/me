/**
 * Contract / availability boundary used by `useAvailability`.
 * Keep in sync with human-readable copy in i18n `availability.announcement.dateValue`.
 */
export const AVAILABILITY_CONFIG = {
  /** ISO calendar date (YYYY-MM-DD) — local midnight on this day = immediately available. */
  availableFrom: '2026-08-10',
} as const;

export type AvailabilityConfig = typeof AVAILABILITY_CONFIG;
