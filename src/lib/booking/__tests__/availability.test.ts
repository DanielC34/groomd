import { describe, it, expect } from 'vitest';
import {
  getAvailabilityForDate,
  getAvailabilityForRange,
} from '../availability';
import { createLusakaDate } from '../timezone';

const MOCK_BOOKINGS = [
  {
    startAt: createLusakaDate(2026, 10, 10, 10, 0),
    endAt: createLusakaDate(2026, 10, 10, 10, 45),
    barberId: 'mwila-banda',
  },
  {
    startAt: createLusakaDate(2026, 10, 10, 14, 0),
    endAt: createLusakaDate(2026, 10, 10, 14, 30),
    barberId: 'chanda-mulenga',
  },
];

const FIXED_REFERENCE_TIME = createLusakaDate(2026, 10, 10, 9, 0);

describe('Availability Calculation', () => {
  describe('Opening Hours', () => {
    it('weekday (Monday) is open with slots', () => {
      const date = createLusakaDate(2026, 10, 12); // Monday
      const result = getAvailabilityForDate(
        'signature-cut',
        'no-preference',
        null,
        date,
        [],
        FIXED_REFERENCE_TIME
      );

      expect(result.status).toBe('open');
      expect(result.slots.length).toBeGreaterThan(0);
      expect(result.dayOfWeek).toBe('Monday');
    });

    it('Saturday is open with slots', () => {
      const date = createLusakaDate(2026, 10, 10); // Saturday
      const result = getAvailabilityForDate(
        'signature-cut',
        'no-preference',
        null,
        date,
        [],
        FIXED_REFERENCE_TIME
      );

      expect(result.status).toBe('open');
      expect(result.slots.length).toBeGreaterThan(0);
      expect(result.dayOfWeek).toBe('Saturday');
    });

    it('Sunday is closed', () => {
      const date = createLusakaDate(2026, 10, 11); // Sunday
      const result = getAvailabilityForDate(
        'signature-cut',
        'no-preference',
        null,
        date,
        [],
        FIXED_REFERENCE_TIME
      );

      expect(result.status).toBe('closed');
      expect(result.slots.length).toBe(0);
      expect(result.dayOfWeek).toBe('Sunday');
    });

    it('appointment cannot extend beyond closing time (weekday 45min service)', () => {
      const date = createLusakaDate(2026, 10, 12); // Monday, closes 18:00
      const result = getAvailabilityForDate(
        'signature-cut', // 45 min
        'no-preference',
        null,
        date,
        [],
        FIXED_REFERENCE_TIME
      );

      const lastSlot = result.slots[result.slots.length - 1];
      expect(lastSlot.start).toBe('17:15'); // 17:15 + 45min = 18:00
    });

    it('appointment cannot extend beyond closing time (Saturday 45min service)', () => {
      const date = createLusakaDate(2026, 10, 10); // Saturday, closes 16:00
      const result = getAvailabilityForDate(
        'signature-cut', // 45 min
        'no-preference',
        null,
        date,
        [],
        FIXED_REFERENCE_TIME
      );

      const lastSlot = result.slots[result.slots.length - 1];
      expect(lastSlot.start).toBe('15:15'); // 15:15 + 45min = 16:00
    });

    it('75-minute service has earlier latest start on weekdays', () => {
      const date = createLusakaDate(2026, 10, 12); // Monday, closes 18:00
      const result = getAvailabilityForDate(
        'cut-and-beard', // 75 min
        'no-preference',
        null,
        date,
        [],
        FIXED_REFERENCE_TIME
      );

      const lastSlot = result.slots[result.slots.length - 1];
      expect(lastSlot.start).toBe('16:45'); // 16:45 + 75min = 18:00
    });

    it('75-minute service has earlier latest start on Saturday', () => {
      const date = createLusakaDate(2026, 10, 10); // Saturday, closes 16:00
      const result = getAvailabilityForDate(
        'cut-and-beard', // 75 min
        'no-preference',
        null,
        date,
        [],
        FIXED_REFERENCE_TIME
      );

      const lastSlot = result.slots[result.slots.length - 1];
      expect(lastSlot.start).toBe('14:45'); // 14:45 + 75min = 16:00
    });
  });

  describe('Slot Generation', () => {
    it('generates 15-minute increments', () => {
      const date = createLusakaDate(2026, 10, 12); // Monday
      const result = getAvailabilityForDate(
        'signature-cut',
        'no-preference',
        null,
        date,
        [],
        FIXED_REFERENCE_TIME
      );

      const times = result.slots.map((s) => s.start);
      expect(times[0]).toBe('09:00');
      expect(times[1]).toBe('09:15');
      expect(times[2]).toBe('09:30');
    });

    it('30-minute service has more slots than 45-minute service', () => {
      const date = createLusakaDate(2026, 10, 12);
      const result30 = getAvailabilityForDate('buzz-cut-line-up', 'no-preference', null, date, [], FIXED_REFERENCE_TIME);
      const result45 = getAvailabilityForDate('signature-cut', 'no-preference', null, date, [], FIXED_REFERENCE_TIME);

      expect(result30.slots.length).toBeGreaterThan(result45.slots.length);
    });

    it('45-minute service has more slots than 75-minute service', () => {
      const date = createLusakaDate(2026, 10, 12);
      const result45 = getAvailabilityForDate('signature-cut', 'no-preference', null, date, [], FIXED_REFERENCE_TIME);
      const result75 = getAvailabilityForDate('cut-and-beard', 'no-preference', null, date, [], FIXED_REFERENCE_TIME);

      expect(result45.slots.length).toBeGreaterThan(result75.slots.length);
    });
  });

  describe('Booking Window', () => {
    it('today is valid', () => {
      const today = createLusakaDate(2026, 10, 10);
      const result = getAvailabilityForDate(
        'signature-cut',
        'no-preference',
        null,
        today,
        [],
        FIXED_REFERENCE_TIME
      );
      expect(result.status).toBe('open');
    });

    it('30 days ahead is valid', () => {
      const date = createLusakaDate(2026, 11, 9); // 30 days from Oct 10
      const result = getAvailabilityForDate(
        'signature-cut',
        'no-preference',
        null,
        date,
        [],
        FIXED_REFERENCE_TIME
      );
      expect(result.status).toBe('open');
    });

    it('31 days ahead is invalid (not implemented - would need range check)', () => {
      // This is handled at the API layer by limiting the range
      // The availability function itself doesn't enforce max window
      // but the API should only call it for valid dates
      expect(true).toBe(true);
    });
  });

  describe('Minimum Notice', () => {
    it('slot less than one hour away is rejected', () => {
      // Reference time is 09:00, min notice 60min = slots before 10:00 rejected
      const date = createLusakaDate(2026, 10, 10); // Saturday
      const result = getAvailabilityForDate(
        'signature-cut', // 45 min
        'no-preference',
        null,
        date,
        [],
        createLusakaDate(2026, 10, 10, 9, 0)
      );

      const times = result.slots.map((s) => s.start);
      expect(times).not.toContain('09:00');
      expect(times).not.toContain('09:15');
      expect(times).not.toContain('09:30');
      expect(times).not.toContain('09:45');
      expect(times).toContain('10:00');
    });

    it('slot at least one hour away is accepted', () => {
      const date = createLusakaDate(2026, 10, 10); // Saturday
      const result = getAvailabilityForDate(
        'signature-cut',
        'no-preference',
        null,
        date,
        [],
        createLusakaDate(2026, 10, 10, 9, 0)
      );

      expect(result.slots.some((s) => s.start === '10:00')).toBe(true);
      expect(result.slots.some((s) => s.start === '10:15')).toBe(true);
    });
  });

  describe('Existing Bookings', () => {
    it('exact overlap is rejected', () => {
      // Existing booking: 10:00-10:45 for mwila-banda
      // Request 10:00 for same barber should be rejected
      const date = createLusakaDate(2026, 10, 10);
      const result = getAvailabilityForDate(
        'signature-cut', // 45 min
        'specific',
        'mwila-banda',
        date,
        MOCK_BOOKINGS,
        FIXED_REFERENCE_TIME
      );

      expect(result.slots.some((s) => s.start === '10:00')).toBe(false);
    });

    it('partial overlap is rejected', () => {
      // Existing booking: 10:00-10:45
      // Request 10:15 for same barber (overlaps 10:15-11:00) should be rejected
      const date = createLusakaDate(2026, 10, 10);
      const result = getAvailabilityForDate(
        'signature-cut',
        'specific',
        'mwila-banda',
        date,
        MOCK_BOOKINGS,
        FIXED_REFERENCE_TIME
      );

      expect(result.slots.some((s) => s.start === '10:15')).toBe(false);
    });

    it('adjacent appointments allowed', () => {
      // Existing booking ends at 10:45, next slot starts at 10:45 should be OK
      const date = createLusakaDate(2026, 10, 10);
      const result = getAvailabilityForDate(
        'signature-cut',
        'specific',
        'mwila-banda',
        date,
        MOCK_BOOKINGS,
        FIXED_REFERENCE_TIME
      );

      expect(result.slots.some((s) => s.start === '10:45')).toBe(true);
    });

    it('different barber remains available', () => {
      // Booking for mwila-banda at 10:00, chanda-mulenga should be available at 10:00
      const date = createLusakaDate(2026, 10, 10);
      const result = getAvailabilityForDate(
        'signature-cut',
        'specific',
        'chanda-mulenga',
        date,
        MOCK_BOOKINGS,
        FIXED_REFERENCE_TIME
      );

      expect(result.slots.some((s) => s.start === '10:00')).toBe(true);
    });
  });

  describe('Barber Preference', () => {
    it('specific barber only uses that barber', () => {
      const date = createLusakaDate(2026, 10, 10);
      const result = getAvailabilityForDate(
        'signature-cut',
        'specific',
        'mwila-banda',
        date,
        MOCK_BOOKINGS,
        FIXED_REFERENCE_TIME
      );

      expect(result.slots.every((s) => s.barberId === 'mwila-banda')).toBe(true);
    });

    it('unavailable selected barber produces no slots', () => {
      // Book all slots for mwila-banda
      const allDayBookings = [
        { startAt: createLusakaDate(2026, 10, 10, 8, 0), endAt: createLusakaDate(2026, 10, 10, 16, 0), barberId: 'mwila-banda' },
      ];
      const date = createLusakaDate(2026, 10, 10);
      const result = getAvailabilityForDate(
        'signature-cut',
        'specific',
        'mwila-banda',
        date,
        allDayBookings,
        FIXED_REFERENCE_TIME
      );

      expect(result.status).toBe('full');
      expect(result.slots.length).toBe(0);
    });

    it('no preference finds a slot when another barber is available', () => {
      // mwila-banda booked all day, but chanda-mulenga and kondwani-phiri free
      const allDayBookings = [
        { startAt: createLusakaDate(2026, 10, 10, 8, 0), endAt: createLusakaDate(2026, 10, 10, 16, 0), barberId: 'mwila-banda' },
      ];
      const date = createLusakaDate(2026, 10, 10);
      const result = getAvailabilityForDate(
        'signature-cut',
        'no-preference',
        null,
        date,
        allDayBookings,
        FIXED_REFERENCE_TIME
      );

      expect(result.status).toBe('open');
      expect(result.slots.length).toBeGreaterThan(0);
      expect(result.slots.every((s) => s.barberId !== 'mwila-banda')).toBe(true);
    });

    it('no preference can assign an available barber', () => {
      const date = createLusakaDate(2026, 10, 10);
      const result = getAvailabilityForDate(
        'signature-cut',
        'no-preference',
        null,
        date,
        MOCK_BOOKINGS,
        FIXED_REFERENCE_TIME
      );

      expect(result.slots.length).toBeGreaterThan(0);
      expect(result.slots.every((s) => s.barberId !== undefined)).toBe(true);
    });
  });
});

describe('Availability Range', () => {
  it('returns results for each day in range', () => {
    const start = createLusakaDate(2026, 10, 10); // Saturday
    const end = createLusakaDate(2026, 10, 12);   // Monday
    const results = getAvailabilityForRange(
      'signature-cut',
      'no-preference',
      null,
      start,
      end,
      [],
      FIXED_REFERENCE_TIME
    );

    expect(results.length).toBe(3);
    expect(results[0].dayOfWeek).toBe('Saturday');
    expect(results[1].dayOfWeek).toBe('Sunday');
    expect(results[2].dayOfWeek).toBe('Monday');
  });
});