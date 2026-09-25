import { describe, it, expect } from 'vitest';
import {
  createLusakaDate,
  formatLusakaTime,
  formatLusakaDate,
  getDayOfWeek,
  isSameLusakaDay,
  startOfLusakaDay,
  addMinutes,
  addDays,
} from '../timezone';

describe('Timezone Utilities', () => {
  describe('createLusakaDate', () => {
    it('creates correct Lusaka date', () => {
      const date = createLusakaDate(2026, 10, 10, 14, 30);
      expect(date.getFullYear()).toBe(2026);
      expect(date.getMonth()).toBe(9); // 0-indexed
      expect(date.getDate()).toBe(10);
      expect(date.getHours()).toBe(14);
      expect(date.getMinutes()).toBe(30);
    });
  });

  describe('formatLusakaTime', () => {
    it('formats time in 24-hour Lusaka format', () => {
      const date = createLusakaDate(2026, 10, 10, 14, 30);
      expect(formatLusakaTime(date)).toBe('14:30');
    });

    it('pads single digits', () => {
      const date = createLusakaDate(2026, 10, 10, 9, 5);
      expect(formatLusakaTime(date)).toBe('09:05');
    });
  });

  describe('formatLusakaDate', () => {
    it('formats date as Sat 10 Oct 2026', () => {
      const date = createLusakaDate(2026, 10, 10, 14, 30);
      expect(formatLusakaDate(date)).toBe('Sat 10 Oct 2026');
    });
  });

  describe('getDayOfWeek', () => {
    it('returns correct day name', () => {
      const saturday = createLusakaDate(2026, 10, 10); // Saturday
      expect(getDayOfWeek(saturday)).toBe('Saturday');

      const monday = createLusakaDate(2026, 10, 12); // Monday
      expect(getDayOfWeek(monday)).toBe('Monday');
    });
  });

  describe('isSameLusakaDay', () => {
    it('returns true for same day', () => {
      const date1 = createLusakaDate(2026, 10, 10, 9, 0);
      const date2 = createLusakaDate(2026, 10, 10, 18, 0);
      expect(isSameLusakaDay(date1, date2)).toBe(true);
    });

    it('returns false for different days', () => {
      const date1 = createLusakaDate(2026, 10, 10, 23, 0);
      const date2 = createLusakaDate(2026, 10, 11, 1, 0);
      expect(isSameLusakaDay(date1, date2)).toBe(false);
    });
  });

  describe('startOfLusakaDay', () => {
    it('returns midnight of same Lusaka day', () => {
      const date = createLusakaDate(2026, 10, 10, 14, 30);
      const start = startOfLusakaDay(date);
      expect(start.getHours()).toBe(0);
      expect(start.getMinutes()).toBe(0);
      expect(isSameLusakaDay(start, date)).toBe(true);
    });
  });

  describe('addMinutes', () => {
    it('adds minutes correctly', () => {
      const date = createLusakaDate(2026, 10, 10, 14, 30);
      const result = addMinutes(date, 45);
      expect(result.getHours()).toBe(15);
      expect(result.getMinutes()).toBe(15);
    });

    it('handles hour rollover', () => {
      const date = createLusakaDate(2026, 10, 10, 23, 45);
      const result = addMinutes(date, 30);
      expect(result.getDate()).toBe(11);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(15);
    });
  });

  describe('addDays', () => {
    it('adds days correctly', () => {
      const date = createLusakaDate(2026, 10, 10, 14, 30);
      const result = addDays(date, 2);
      expect(result.getDate()).toBe(12);
      expect(result.getHours()).toBe(14);
      expect(result.getMinutes()).toBe(30);
    });

    it('handles month rollover', () => {
      const date = createLusakaDate(2026, 10, 30, 14, 30);
      const result = addDays(date, 2);
      expect(result.getMonth()).toBe(10); // November (0-indexed)
      expect(result.getDate()).toBe(1);
    });
  });
});