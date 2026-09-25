import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { validateBookingTimeRules } from '../validation';

// "Now" = Wednesday 30 Sep 2026, 09:00 Africa/Lusaka (07:00 UTC).
// +30 days = Fri 30 Oct (open), +31 days = Sat 31 Oct (open, but outside the window).
const NOW = new Date('2026-09-30T07:00:00Z');
const WINDOW_ERROR = /Booking window/;
const NOTICE_ERROR = /in advance/;

const check = (date: string, time: string) =>
  validateBookingTimeRules('signature-cut', 'no-preference', null, date, time);

describe('booking date boundaries (unchanged rules)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });
  afterEach(() => vi.useRealTimers());

  it('today inside the 1-hour notice window is rejected', () => {
    expect(check('2026-09-30', '09:45').errors.some((e) => NOTICE_ERROR.test(e))).toBe(true);
  });

  it('today at exactly 1 hour notice is accepted', () => {
    expect(check('2026-09-30', '10:00')).toEqual({ valid: true, errors: [] });
  });

  it('Sundays are closed', () => {
    const r = check('2026-10-04', '10:00');
    expect(r.valid).toBe(false);
    expect(r.errors).toContain('The studio is closed on Sundays.');
  });

  it('+30 days is accepted', () => {
    expect(check('2026-10-30', '10:00')).toEqual({ valid: true, errors: [] });
  });

  it('+31 days is rejected', () => {
    const r = check('2026-10-31', '10:00');
    expect(r.valid).toBe(false);
    expect(r.errors.some((e) => WINDOW_ERROR.test(e))).toBe(true);
  });
});
