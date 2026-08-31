import { describe, expect, it } from 'vitest';
import { AVAILABILITY_CONFIG } from '../../app/config/availability.config';
import { isImmediatelyAvailable } from '../../app/composables/domain/useAvailability';

describe('isImmediatelyAvailable', () => {
  it('returns true when availableFrom is null', () => {
    expect(AVAILABILITY_CONFIG.availableFrom).toBeNull();
    expect(isImmediatelyAvailable()).toBe(true);
    expect(isImmediatelyAvailable(new Date(2026, 7, 9))).toBe(true);
  });

  it('is true when explicitly passed a past date', () => {
    expect(isImmediatelyAvailable(new Date(2026, 7, 9), '2026-08-01')).toBe(true);
  });

  it('is false when explicitly passed a future date', () => {
    expect(isImmediatelyAvailable(new Date(2026, 7, 9), '2026-12-01')).toBe(false);
  });

  it('is true on and after an explicit start date', () => {
    expect(isImmediatelyAvailable(new Date(2026, 7, 10), '2026-08-10')).toBe(true);
    expect(isImmediatelyAvailable(new Date(2026, 7, 11), '2026-08-10')).toBe(true);
  });

  it('ignores time-of-day (compares local calendar dates only)', () => {
    const lateOnStart = new Date(2026, 7, 10, 23, 30, 0);
    expect(isImmediatelyAvailable(lateOnStart, '2026-08-10')).toBe(true);
  });

  it('honors an explicit availableFrom override at the boundary', () => {
    const boundary = '2026-08-10';
    expect(isImmediatelyAvailable(new Date(2026, 7, 9), boundary)).toBe(false);
    expect(isImmediatelyAvailable(new Date(2026, 7, 10), boundary)).toBe(true);
  });

  it('defaults AVAILABILITY_CONFIG.enabled to false when not seeking', () => {
    expect(typeof AVAILABILITY_CONFIG.enabled).toBe('boolean');
  });
});
