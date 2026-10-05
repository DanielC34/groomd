import { describe, it, expect } from 'vitest';
import {
  validateBusinessHours,
  validateSpecialHours,
  validateBlockout,
  BusinessHoursInputSchema,
  SpecialHoursInputSchema,
  BlockoutInputSchema,
  formatBusinessHours,
  minutesToTime,
  timeToMinutes,
} from '../availability-validation';

describe('Availability Validation', () => {
  describe('BusinessHours Validation', () => {
    it('accepts valid open hours', () => {
      const input = {
        dayOfWeek: 1,
        openMinute: 540,
        closeMinute: 1080,
        isClosed: false,
      };
      expect(() => validateBusinessHours(input)).not.toThrow();
      const result = validateBusinessHours(input);
      expect(result.openMinute).toBe(540);
      expect(result.closeMinute).toBe(1080);
      expect(result.isClosed).toBe(false);
    });

    it('accepts valid closed day', () => {
      const input = {
        dayOfWeek: 0,
        isClosed: true,
      };
      expect(() => validateBusinessHours(input)).not.toThrow();
      const result = validateBusinessHours(input);
      expect(result.isClosed).toBe(true);
    });

    it('rejects closeMinute <= openMinute', () => {
      const input = {
        dayOfWeek: 1,
        openMinute: 1080,
        closeMinute: 540,
        isClosed: false,
      };
      expect(() => validateBusinessHours(input)).toThrow('closeMinute must be greater than openMinute');
    });

    it('rejects equal open/close minutes', () => {
      const input = {
        dayOfWeek: 1,
        openMinute: 540,
        closeMinute: 540,
        isClosed: false,
      };
      expect(() => validateBusinessHours(input)).toThrow('closeMinute must be greater than openMinute');
    });

    it('rejects openMinute out of range', () => {
      const input = {
        dayOfWeek: 1,
        openMinute: -1,
        closeMinute: 540,
        isClosed: false,
      };
      expect(() => validateBusinessHours(input)).toThrow();
    });

    it('rejects closeMinute out of range', () => {
      const input = {
        dayOfWeek: 1,
        openMinute: 540,
        closeMinute: 1441,
        isClosed: false,
      };
      expect(() => validateBusinessHours(input)).toThrow();
    });

    it('rejects dayOfWeek out of range', () => {
      const input = {
        dayOfWeek: 7,
        openMinute: 540,
        closeMinute: 1080,
        isClosed: false,
      };
      expect(() => validateBusinessHours(input)).toThrow();
    });

    it('requires open/close minutes for non-closed days', () => {
      const input = {
        dayOfWeek: 1,
        isClosed: false,
      };
      expect(() => validateBusinessHours(input)).toThrow('openMinute and closeMinute are required');
    });
  });

  describe('SpecialHours Validation', () => {
    it('accepts valid special hours', () => {
      const input = {
        date: '2026-12-25',
        openMinute: 600,
        closeMinute: 900,
        isClosed: false,
        reason: 'Christmas',
      };
      expect(() => validateSpecialHours(input)).not.toThrow();
    });

    it('accepts valid closed special day', () => {
      const input = {
        date: '2026-01-01',
        isClosed: true,
        reason: 'New Year',
      };
      expect(() => validateSpecialHours(input)).not.toThrow();
    });

    it('rejects invalid date format', () => {
      const input = {
        date: '25-12-2026',
        openMinute: 600,
        closeMinute: 900,
        isClosed: false,
      };
      expect(() => validateSpecialHours(input)).toThrow('Date must be in YYYY-MM-DD format');
    });

    it('rejects closeMinute <= openMinute', () => {
      const input = {
        date: '2026-12-25',
        openMinute: 900,
        closeMinute: 600,
        isClosed: false,
      };
      expect(() => validateSpecialHours(input)).toThrow('closeMinute must be greater than openMinute');
    });
  });

  describe('Blockout Validation', () => {
    it('accepts valid shop-wide blockout', () => {
      const input = {
        startAt: '2026-10-15T08:00:00.000Z',
        endAt: '2026-10-15T12:00:00.000Z',
        reason: 'Staff meeting',
      };
      expect(() => validateBlockout(input)).not.toThrow();
    });

    it('accepts valid barber-specific blockout', () => {
      const input = {
        barberId: 'barber-123',
        startAt: '2026-10-15T08:00:00.000Z',
        endAt: '2026-10-15T12:00:00.000Z',
        reason: 'Barber break',
      };
      expect(() => validateBlockout(input)).not.toThrow();
    });

    it('rejects endAt before startAt', () => {
      const input = {
        startAt: '2026-10-15T12:00:00.000Z',
        endAt: '2026-10-15T08:00:00.000Z',
      };
      expect(() => validateBlockout(input)).toThrow('endAt must be after startAt');
    });

    it('rejects equal start and end', () => {
      const input = {
        startAt: '2026-10-15T10:00:00.000Z',
        endAt: '2026-10-15T10:00:00.000Z',
      };
      expect(() => validateBlockout(input)).toThrow('endAt must be after startAt');
    });

    it('accepts midnight-crossing blockout', () => {
      const input = {
        startAt: '2026-10-15T22:00:00.000Z',
        endAt: '2026-10-16T02:00:00.000Z',
      };
      expect(() => validateBlockout(input)).not.toThrow();
    });

    it('accepts full-day blockout', () => {
      const input = {
        startAt: '2026-10-15T00:00:00.000Z',
        endAt: '2026-10-16T00:00:00.000Z',
      };
      expect(() => validateBlockout(input)).not.toThrow();
    });
  });

  describe('Format Utilities', () => {
    it('formats closed hours as Closed', () => {
      expect(formatBusinessHours({ isClosed: true, openMinute: null, closeMinute: null })).toBe('Closed');
    });

    it('formats open hours correctly', () => {
      expect(formatBusinessHours({ isClosed: false, openMinute: 540, closeMinute: 1080 })).toBe('09:00–18:00');
    });

    it('formats 08:00–16:00 correctly', () => {
      expect(formatBusinessHours({ isClosed: false, openMinute: 480, closeMinute: 960 })).toBe('08:00–16:00');
    });

    it('converts minutes to time', () => {
      expect(minutesToTime(0)).toBe('00:00');
      expect(minutesToTime(540)).toBe('09:00');
      expect(minutesToTime(1080)).toBe('18:00');
      expect(minutesToTime(1439)).toBe('23:59');
    });

    it('converts time to minutes', () => {
      expect(timeToMinutes('00:00')).toBe(0);
      expect(timeToMinutes('09:00')).toBe(540);
      expect(timeToMinutes('18:00')).toBe(1080);
      expect(timeToMinutes('23:59')).toBe(1439);
    });
  });

  describe('Schema Type Inference', () => {
    it('infers correct types', () => {
      const bh = BusinessHoursInputSchema.parse({
        dayOfWeek: 1,
        openMinute: 540,
        closeMinute: 1080,
        isClosed: false,
      });
      expect(bh.dayOfWeek).toBe(1);
      expect(bh.openMinute).toBe(540);
      expect(bh.isClosed).toBe(false);

      const sh = SpecialHoursInputSchema.parse({
        date: '2026-12-25',
        openMinute: 600,
        closeMinute: 900,
        isClosed: false,
      });
      expect(sh.date).toBe('2026-12-25');

      const bo = BlockoutInputSchema.parse({
        barberId: 'barber-1',
        startAt: '2026-10-15T08:00:00.000Z',
        endAt: '2026-10-15T12:00:00.000Z',
      });
      expect(bo.barberId).toBe('barber-1');
    });
  });
});