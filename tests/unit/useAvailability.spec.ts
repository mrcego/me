import { describe, expect, it } from 'vitest';
import { AVAILABILITY_START, isImmediatelyAvailable } from '../../app/composables/useAvailability';

describe('isImmediatelyAvailable', () => {
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
});
