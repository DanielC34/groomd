import { describe, it, expect } from 'vitest';
import {
  createLusakaDate,
  lusakaDateTimeToUtc,
  getLusakaParts,
  formatLusakaTime,
  formatLusakaDate,
  getDayOfWeek,
  isSameLusakaDay,
  startOfLusakaDay,
  addMinutes,
  addDays,
  todayLusakaYmd,
  addDaysYmd,
  dayOfWeekYmd,
  addMinutesToHhmm,
  formatYmdDate,
  formatYmdShort,
  formatTimeRange,
} from '../timezone';

// These tests assert absolute instants / Lusaka wall-clock values only, so they
// pass regardless of the machine timezone (run with TZ=UTC, Africa/Lusaka, etc.).

describe('Timezone Utilities', () => {
  describe('createLusakaDate', () => {
    it('10:00 Lusaka is 08:00 UTC', () => {
      expect(createLusakaDate(2026, 10, 10, 10, 0).toISOString()).toBe('2026-10-10T08:00:00.000Z');
    });

    it('Lusaka midnight is 22:00 UTC the previous day', () => {
      expect(createLusakaDate(2026, 10, 10).toISOString()).toBe('2026-10-09T22:00:00.000Z');
    });

    it('lusakaDateTimeToUtc matches createLusakaDate', () => {
      expect(lusakaDateTimeToUtc('2026-10-10', '14:30').getTime()).toBe(createLusakaDate(2026, 10, 10, 14, 30).getTime());
    });

    it('round-trips through getLusakaParts', () => {
      const p = getLusakaParts(createLusakaDate(2026, 10, 10, 14, 30));
      expect([p.year, p.month, p.day, p.hours, p.minutes]).toEqual([2026, 10, 10, 14, 30]);
      expect(p.ymd).toBe('2026-10-10');
      expect(p.hhmm).toBe('14:30');
      expect(p.minutesOfDay).toBe(14 * 60 + 30);
    });
  });

  describe('formatLusakaTime', () => {
    it('formats time in 24-hour Lusaka format', () => {
      expect(formatLusakaTime(createLusakaDate(2026, 10, 10, 14, 30))).toBe('14:30');
    });

    it('pads single digits', () => {
      expect(formatLusakaTime(createLusakaDate(2026, 10, 10, 9, 5))).toBe('09:05');
    });

    it('converts a UTC instant to Lusaka time', () => {
      expect(formatLusakaTime(new Date('2026-10-10T08:00:00Z'))).toBe('10:00');
    });
  });

  describe('formatLusakaDate', () => {
    it('formats date as Sat 10 Oct 2026', () => {
      expect(formatLusakaDate(createLusakaDate(2026, 10, 10, 14, 30))).toBe('Sat 10 Oct 2026');
    });
  });

  describe('getDayOfWeek', () => {
    it('returns correct day name', () => {
      expect(getDayOfWeek(createLusakaDate(2026, 10, 10))).toBe('Saturday');
      expect(getDayOfWeek(createLusakaDate(2026, 10, 12))).toBe('Monday');
    });

    it('uses the Lusaka day, not the UTC day', () => {
      // 23:30 UTC Saturday = 01:30 Sunday in Lusaka
      expect(getDayOfWeek(new Date('2026-10-10T23:30:00Z'))).toBe('Sunday');
    });

    it('dayOfWeekYmd works on calendar strings', () => {
      expect(dayOfWeekYmd('2026-10-10')).toBe('Saturday');
      expect(dayOfWeekYmd('2026-10-11')).toBe('Sunday');
    });
  });

  describe('isSameLusakaDay', () => {
    it('returns true for same day', () => {
      expect(isSameLusakaDay(createLusakaDate(2026, 10, 10, 9, 0), createLusakaDate(2026, 10, 10, 18, 0))).toBe(true);
    });

    it('returns false for different days', () => {
      expect(isSameLusakaDay(createLusakaDate(2026, 10, 10, 23, 0), createLusakaDate(2026, 10, 11, 1, 0))).toBe(false);
    });
  });

  describe('startOfLusakaDay', () => {
    it('returns midnight of same Lusaka day', () => {
      const date = createLusakaDate(2026, 10, 10, 14, 30);
      const start = startOfLusakaDay(date);
      expect(start.getTime()).toBe(createLusakaDate(2026, 10, 10).getTime());
      expect(getLusakaParts(start).hhmm).toBe('00:00');
      expect(isSameLusakaDay(start, date)).toBe(true);
    });
  });

  describe('addMinutes', () => {
    it('adds minutes correctly', () => {
      const result = addMinutes(createLusakaDate(2026, 10, 10, 14, 30), 45);
      expect(formatLusakaTime(result)).toBe('15:15');
    });

    it('handles day rollover in Lusaka', () => {
      const result = addMinutes(createLusakaDate(2026, 10, 10, 23, 45), 30);
      const p = getLusakaParts(result);
      expect(p.day).toBe(11);
      expect(p.hhmm).toBe('00:15');
    });

    it('addMinutesToHhmm does wall-clock arithmetic', () => {
      expect(addMinutesToHhmm('16:45', 75)).toBe('18:00');
      expect(addMinutesToHhmm('18:00', -75)).toBe('16:45');
    });
  });

  describe('addDays', () => {
    it('adds days correctly', () => {
      const p = getLusakaParts(addDays(createLusakaDate(2026, 10, 10, 14, 30), 2));
      expect([p.day, p.hhmm]).toEqual([12, '14:30']);
    });

    it('handles month rollover', () => {
      const p = getLusakaParts(addDays(createLusakaDate(2026, 10, 30, 14, 30), 2));
      expect([p.month, p.day]).toEqual([11, 1]);
    });

    it('addDaysYmd handles month and year rollover', () => {
      expect(addDaysYmd('2026-10-30', 2)).toBe('2026-11-01');
      expect(addDaysYmd('2026-12-31', 1)).toBe('2027-01-01');
    });
  });

  describe('todayLusakaYmd', () => {
    it('uses the Lusaka date around UTC midnight', () => {
      // 22:30 UTC on 9 Oct is already 00:30 on 10 Oct in Lusaka
      expect(todayLusakaYmd(new Date('2026-10-09T22:30:00Z'))).toBe('2026-10-10');
      expect(todayLusakaYmd(new Date('2026-10-09T21:30:00Z'))).toBe('2026-10-09');
    });
  });
});

describe('display formatting (CONTENT §4)', () => {
  it('formats dates and ranges', () => {
    expect(formatYmdDate('2026-10-10')).toBe('Sat 10 Oct 2026');
    expect(formatYmdShort('2026-10-10')).toBe('Sat 10 Oct');
    expect(formatYmdDate('2026-09-26')).toBe('Sat 26 Sep 2026');
    expect(formatTimeRange('16:45', 75)).toBe('16:45–18:00');
  });
});
