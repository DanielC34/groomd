import { describe, it, expect } from 'vitest';
import { getAvailabilityForDate } from '../availability';
import { validateBookingTimeRules } from '../validation';
import { lusakaDateTimeToUtc, addMinutes, formatLusakaTime } from '../timezone';

/**
 * Regression tests for the server-timezone bug: a booking stored exactly the way
 * POST /api/bookings stores it (absolute UTC instants) must block the right
 * Lusaka slots, and slot end times must be correct. Run with TZ=UTC in CI;
 * these assertions do not depend on the process timezone.
 */
describe('Server-timezone independence', () => {
  // Mwila, Mon 12 Oct 2026, 10:00–10:45 Lusaka == 08:00–08:45 UTC
  const startAt = lusakaDateTimeToUtc('2026-10-12', '10:00');
  const endAt = addMinutes(startAt, 45);
  const stored = [{ startAt, endAt, barberId: 'mwila-banda' }];
  const day = lusakaDateTimeToUtc('2026-10-12');
  const reference = new Date('2026-10-05T08:00:00Z');

  it('stores 10:00 Lusaka as 08:00 UTC', () => {
    expect(startAt.toISOString()).toBe('2026-10-12T08:00:00.000Z');
    expect(endAt.toISOString()).toBe('2026-10-12T08:45:00.000Z');
  });

  it('a stored booking blocks exactly the overlapping Lusaka slots', async () => {
    const r = await getAvailabilityForDate('signature-cut', 'specific', 'mwila-banda', day, stored, reference);
    const starts = r.slots.map((s) => s.start);
    for (const blocked of ['09:30', '09:45', '10:00', '10:15', '10:30']) {
      expect(starts).not.toContain(blocked);
    }
    for (const free of ['09:00', '09:15', '10:45', '12:00']) {
      expect(starts).toContain(free);
    }
  });

  it('returns the correct Lusaka date and slot end times', async () => {
    const r = await getAvailabilityForDate('signature-cut', 'specific', 'mwila-banda', day, [], reference);
    expect(r.date).toBe('2026-10-12');
    expect(r.dayOfWeek).toBe('Monday');
    expect(r.slots[0]).toEqual({ start: '09:00', end: '09:45', barberId: 'mwila-banda' });
    expect(r.slots[r.slots.length - 1]).toEqual({ start: '17:15', end: '18:00', barberId: 'mwila-banda' });
  });

  it('booking end time is start + duration in Lusaka time', () => {
    expect(formatLusakaTime(addMinutes(lusakaDateTimeToUtc('2026-10-12', '16:45'), 75))).toBe('18:00');
  });

  it('applies one-hour notice in Lusaka time', async () => {
    // "Now" = 07:50 UTC = 09:50 Lusaka on the same day -> earliest start is 11:00
    const now = new Date('2026-10-12T07:50:00Z');
    const r = await getAvailabilityForDate('signature-cut', 'no-preference', null, day, [], now);
    expect(r.slots[0].start).toBe('11:00');
  });

  it('validation accepts the latest valid start and rejects later ones', () => {
    // Uses real "now", so pick a date inside the 30-day window relative to today.
    const d = new Date(Date.now() + 7 * 24 * 3600 * 1000);
    // find next Monday within window
    while (new Date(d.getTime() + 2 * 3600 * 1000).getUTCDay() !== 1) d.setTime(d.getTime() + 24 * 3600 * 1000);
    const shifted = new Date(d.getTime() + 2 * 3600 * 1000);
    const ymd = shifted.toISOString().slice(0, 10);
    expect(validateBookingTimeRules('cut-and-beard', 'no-preference', null, ymd, '16:45').valid).toBe(true);
    expect(validateBookingTimeRules('cut-and-beard', 'no-preference', null, ymd, '17:00').valid).toBe(false);
  });
});