import { describe, expect, it } from 'vitest';
import { AVAILABILITY_CONFIG } from '../../app/config/availability.config';
import {
  AVAILABILITY_START,
  isImmediatelyAvailable,
  parseAvailableFrom,
} from '../../app/composables/domain/useAvailability';

describe('isImmediatelyAvailable', () => {
  it('parses availableFrom ISO as local midnight', () => {
    expect(parseAvailableFrom(AVAILABILITY_CONFIG.availableFrom)).toEqual(AVAILABILITY_START);
    expect(AVAILABILITY_CONFIG.availableFrom).toBe('2026-08-10');
  });

  it('is false before the contract start date (happy path for banner)', () => {
    const before = new Date(2026, 7, 9, 23, 59, 59);
    expect(isImmediatelyAvailable(before)).toBe(false);
  });

  it('is true on and after the start date', () => {
    expect(isImmediatelyAvailable(AVAILABILITY_START)).toBe(true);
    expect(isImmediatelyAvailable(new Date(2026, 7, 11))).toBe(true);
  });

  it('ignores time-of-day (compares local calendar dates only)', () => {
    const lateOnStart = new Date(2026, 7, 10, 23, 30, 0);
    expect(isImmediatelyAvailable(lateOnStart)).toBe(true);
  });

  it('honors an explicit availableFrom override at the boundary', () => {
    const boundary = '2026-08-10';
    expect(isImmediatelyAvailable(new Date(2026, 7, 9), boundary)).toBe(false);
    expect(isImmediatelyAvailable(new Date(2026, 7, 10), boundary)).toBe(true);
  });
});
