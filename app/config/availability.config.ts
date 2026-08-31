/**
 * Master configuration for engineer availability & top announcement banner.
 *
 * - `enabled`: Master switch to show/hide the availability banner.
 *   Default: `false` (hidden by default when already employed / not seeking).
 *   Can be overridden at runtime or build time via `NUXT_PUBLIC_AVAILABILITY_BANNER_ENABLED` env var.
 *
 * - `availableFrom`: Optional ISO date string (YYYY-MM-DD) for scheduled start date announcements.
 *   Set to `null` when available immediately (if enabled).
 */
export const AVAILABILITY_CONFIG = {
  /** Master toggle to show/hide the top availability banner. */
  enabled:
    typeof process !== 'undefined' &&
    process.env?.NUXT_PUBLIC_AVAILABILITY_BANNER_ENABLED !== undefined
      ? process.env.NUXT_PUBLIC_AVAILABILITY_BANNER_ENABLED === 'true'
      : false,

  /** No fixed start date — César is available now (when banner is enabled). */
  availableFrom: null,
} as const;

export type AvailabilityConfig = typeof AVAILABILITY_CONFIG;
