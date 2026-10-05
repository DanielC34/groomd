import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getEffectiveBusinessHours,
  getBlockoutsForDateRange,
  filterSlotsByBlockouts,
} from '../business-hours';

// Mock functions for the Prisma client
const mockSpecialHoursFindUnique = vi.fn();
const mockBusinessHoursFindUnique = vi.fn();
const mockBlockoutFindMany = vi.fn();

vi.mock('@/lib/prisma/client', () => ({
  getPrisma: () => ({
    specialHours: {
      findUnique: mockSpecialHoursFindUnique,
    },
    businessHours: {
      findUnique: mockBusinessHoursFindUnique,
    },
    blockout: {
      findMany: mockBlockoutFindMany,
    },
  }),
}));

describe('Business Hours Module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getEffectiveBusinessHours', () => {
    it('returns special hours when they exist for the date', async () => {
      mockSpecialHoursFindUnique.mockResolvedValue({
        date: new Date('2026-12-25'),
        openMinute: 600,
        closeMinute: 900,
        isClosed: false,
      });

      const result = await getEffectiveBusinessHours(new Date('2026-12-25T00:00:00.000Z'));
      
      expect(result.openMinute).toBe(600);
      expect(result.closeMinute).toBe(900);
      expect(result.isClosed).toBe(false);
    });

    it('returns special closed hours when special hours is closed', async () => {
      mockSpecialHoursFindUnique.mockResolvedValue({
        date: new Date('2026-01-01'),
        isClosed: true,
        openMinute: null,
        closeMinute: null,
      });

      const result = await getEffectiveBusinessHours(new Date('2026-01-01T00:00:00.000Z'));
      
      expect(result.isClosed).toBe(true);
    });

    it('falls back to weekly business hours when no special hours', async () => {
      mockSpecialHoursFindUnique.mockResolvedValue(null);
      mockBusinessHoursFindUnique.mockResolvedValue({
        dayOfWeek: 1,
        openMinute: 540,
        closeMinute: 1080,
        isClosed: false,
      });

      const result = await getEffectiveBusinessHours(new Date('2026-10-12T00:00:00.000Z')); // Monday
      
      expect(result.openMinute).toBe(540);
      expect(result.closeMinute).toBe(1080);
      expect(result.isClosed).toBe(false);
    });

    it('falls back to weekly closed day', async () => {
      mockSpecialHoursFindUnique.mockResolvedValue(null);
      mockBusinessHoursFindUnique.mockResolvedValue({
        dayOfWeek: 0,
        openMinute: null,
        closeMinute: null,
        isClosed: true,
      });

      const result = await getEffectiveBusinessHours(new Date('2026-10-11T00:00:00.000Z')); // Sunday
      
      expect(result.isClosed).toBe(true);
    });

    it('returns closed when no business hours configured', async () => {
      mockSpecialHoursFindUnique.mockResolvedValue(null);
      mockBusinessHoursFindUnique.mockResolvedValue(null);

      const result = await getEffectiveBusinessHours(new Date('2026-10-12T00:00:00.000Z'));
      
      expect(result.isClosed).toBe(true);
    });
  });

  describe('getBlockoutsForDateRange', () => {
    it('fetches shop-wide blockouts', async () => {
      mockBlockoutFindMany.mockResolvedValue([
        { startAt: new Date('2026-10-15T08:00:00.000Z'), endAt: new Date('2026-10-15T12:00:00.000Z'), barberId: null },
      ]);

      const result = await getBlockoutsForDateRange(
        new Date('2026-10-15T00:00:00.000Z'),
        new Date('2026-10-16T00:00:00.000Z'),
        undefined
      );

      expect(result).toHaveLength(1);
      expect(result[0].barberId).toBeNull();
      expect(result[0].startAt).toEqual(new Date('2026-10-15T08:00:00.000Z'));
    });

    it('fetches barber-specific blockouts', async () => {
      mockBlockoutFindMany.mockResolvedValue([
        { startAt: new Date('2026-10-15T08:00:00.000Z'), endAt: new Date('2026-10-15T12:00:00.000Z'), barberId: 'barber-1' },
      ]);

      const result = await getBlockoutsForDateRange(
        new Date('2026-10-15T00:00:00.000Z'),
        new Date('2026-10-16T00:00:00.000Z'),
        'barber-1'
      );

      expect(result).toHaveLength(1);
      expect(result[0].barberId).toBe('barber-1');
    });

    it('includes barberId in where clause when null is passed', async () => {
      mockBlockoutFindMany.mockResolvedValue([]);

      await getBlockoutsForDateRange(
        new Date('2026-10-15T00:00:00.000Z'),
        new Date('2026-10-16T00:00:00.000Z'),
        null
      );

      // Check that the where clause includes barberId: null
      expect(mockBlockoutFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            barberId: null,
          }),
        })
      );
    });
  });

  describe('filterSlotsByBlockouts', () => {
    it('filters out slots overlapping shop-wide blockout', () => {
      const slots = [
        { start: new Date('2026-10-15T08:00:00.000Z'), end: new Date('2026-10-15T08:45:00.000Z'), barberId: 'barber-1' },
        { start: new Date('2026-10-15T10:00:00.000Z'), end: new Date('2026-10-15T10:45:00.000Z'), barberId: 'barber-1' },
        { start: new Date('2026-10-15T13:00:00.000Z'), end: new Date('2026-10-15T13:45:00.000Z'), barberId: 'barber-1' },
      ];

      const blockouts = [
        { startAt: new Date('2026-10-15T09:00:00.000Z'), endAt: new Date('2026-10-15T12:00:00.000Z'), barberId: null },
      ];

      const result = filterSlotsByBlockouts(slots, blockouts, 'barber-1');

      expect(result).toHaveLength(2);
      expect(result[0].start).toEqual(new Date('2026-10-15T08:00:00.000Z'));
      expect(result[1].start).toEqual(new Date('2026-10-15T13:00:00.000Z'));
    });

    it('filters out slots overlapping barber-specific blockout', () => {
      const slots = [
        { start: new Date('2026-10-15T08:00:00.000Z'), end: new Date('2026-10-15T08:45:00.000Z'), barberId: 'barber-1' },
        { start: new Date('2026-10-15T10:00:00.000Z'), end: new Date('2026-10-15T10:45:00.000Z'), barberId: 'barber-1' },
      ];

      const blockouts = [
        { startAt: new Date('2026-10-15T09:00:00.000Z'), endAt: new Date('2026-10-15T12:00:00.000Z'), barberId: 'barber-1' },
      ];

      const result = filterSlotsByBlockouts(slots, blockouts, 'barber-1');

      expect(result).toHaveLength(1);
      expect(result[0].start).toEqual(new Date('2026-10-15T08:00:00.000Z'));
    });

    it('does not filter slots for other barbers when blockout is barber-specific', () => {
      const slots = [
        { start: new Date('2026-10-15T08:00:00.000Z'), end: new Date('2026-10-15T08:45:00.000Z'), barberId: 'barber-1' },
        { start: new Date('2026-10-15T08:00:00.000Z'), end: new Date('2026-10-15T08:45:00.000Z'), barberId: 'barber-2' },
      ];

      const blockouts = [
        { startAt: new Date('2026-10-15T08:00:00.000Z'), endAt: new Date('2026-10-15T12:00:00.000Z'), barberId: 'barber-1' },
      ];

      // Filtering for barber-2: blockout is for barber-1, so both slots should pass
      const result = filterSlotsByBlockouts(slots, blockouts, 'barber-2');

      expect(result).toHaveLength(2);
      expect(result.some(s => s.barberId === 'barber-1')).toBe(true);
      expect(result.some(s => s.barberId === 'barber-2')).toBe(true);
    });

    it('allows boundary-touching intervals', () => {
      const slots = [
        { start: new Date('2026-10-15T12:00:00.000Z'), end: new Date('2026-10-15T12:45:00.000Z'), barberId: 'barber-1' },
      ];

      const blockouts = [
        { startAt: new Date('2026-10-15T08:00:00.000Z'), endAt: new Date('2026-10-15T12:00:00.000Z'), barberId: null },
      ];

      const result = filterSlotsByBlockouts(slots, blockouts, 'barber-1');

      expect(result).toHaveLength(1); // Should be allowed - slot starts exactly when blockout ends
    });
  });
});