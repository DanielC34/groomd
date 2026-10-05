import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the Prisma client
vi.mock('@/lib/prisma/client', () => ({
  getPrisma: () => ({
    booking: {
      findMany: vi.fn(),
    },
  }),
}));

// Mock business-hours module with factory function
vi.mock('../business-hours', () => {
  return {
    getEffectiveBusinessHours: vi.fn(),
    getAvailableSlotsForBarber: vi.fn(),
    getAvailableSlotsForNoPreference: vi.fn(),
    getBlockoutsForDateRange: vi.fn(),
  };
});

// Import the modules under test
import { getAvailabilityForDate, getAvailabilityForRange } from '../availability';

// Import the mocked functions - cast to get proper mock types
import * as businessHoursModule from '../business-hours';

const getEffectiveBusinessHours = businessHoursModule.getEffectiveBusinessHours as ReturnType<typeof vi.fn>;
const getAvailableSlotsForBarber = businessHoursModule.getAvailableSlotsForBarber as ReturnType<typeof vi.fn>;

describe('Availability Integration with Business Hours', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAvailabilityForDate', () => {
    it('returns closed when business hours is closed', async () => {
      getEffectiveBusinessHours.mockResolvedValue({
        openMinute: 0,
        closeMinute: 0,
        isClosed: true,
      });

      const result = await getAvailabilityForDate(
        'signature-cut',
        'specific',
        'barber-1',
        new Date('2026-10-11T00:00:00.000Z'), // Sunday
        [],
        new Date('2026-10-10T00:00:00.000Z')
      );

      expect(result.status).toBe('closed');
      expect(result.slots).toHaveLength(0);
    });

    it('returns open with slots when business hours is open and slots available', async () => {
      getEffectiveBusinessHours.mockResolvedValue({
        openMinute: 540, // 09:00
        closeMinute: 1080, // 18:00
        isClosed: false,
      });
      
      getAvailableSlotsForBarber.mockResolvedValue([
        { start: '09:00', end: '09:45' },
        { start: '09:15', end: '10:00' },
      ]);

      const result = await getAvailabilityForDate(
        'signature-cut',
        'specific',
        'barber-1',
        new Date('2026-10-12T00:00:00.000Z'), // Monday
        [],
        new Date('2026-10-10T00:00:00.000Z')
      );

      expect(result.status).toBe('open');
      expect(result.slots).toHaveLength(2);
      expect(result.slots[0].start).toBe('09:00');
      expect(result.slots[0].barberId).toBe('barber-1');
    });

    it('returns full when no slots available', async () => {
      getEffectiveBusinessHours.mockResolvedValue({
        openMinute: 540,
        closeMinute: 1080,
        isClosed: false,
      });
      
      getAvailableSlotsForBarber.mockResolvedValue([]);

      const result = await getAvailabilityForDate(
        'signature-cut',
        'specific',
        'barber-1',
        new Date('2026-10-12T00:00:00.000Z'),
        [],
        new Date('2026-10-10T00:00:00.000Z')
      );

      expect(result.status).toBe('full');
      expect(result.slots).toHaveLength(0);
    });

    it('uses no-preference flow correctly', async () => {
      getEffectiveBusinessHours.mockResolvedValue({
        openMinute: 540,
        closeMinute: 1080,
        isClosed: false,
      });
      
      const { getAvailableSlotsForNoPreference } = await import('../business-hours');
      (getAvailableSlotsForNoPreference as ReturnType<typeof vi.fn>).mockResolvedValue([
        { start: '09:00', end: '09:45', barberId: 'barber-1' },
        { start: '09:15', end: '10:00', barberId: 'barber-2' },
      ]);

      const result = await getAvailabilityForDate(
        'signature-cut',
        'no-preference',
        null,
        new Date('2026-10-12T00:00:00.000Z'),
        [],
        new Date('2026-10-10T00:00:00.000Z')
      );

      expect(result.status).toBe('open');
      expect(result.slots).toHaveLength(2);
      expect(result.slots[0].barberId).toBe('barber-1');
      expect(result.slots[1].barberId).toBe('barber-2');
    });
  });

  describe('getAvailabilityForRange', () => {
    it('returns array of daily availabilities', async () => {
      getEffectiveBusinessHours
        .mockResolvedValueOnce({ openMinute: 540, closeMinute: 1080, isClosed: false }) // Monday
        .mockResolvedValueOnce({ openMinute: 540, closeMinute: 1080, isClosed: false }) // Tuesday
        .mockResolvedValueOnce({ openMinute: 540, closeMinute: 1080, isClosed: false }) // Wednesday
        .mockResolvedValueOnce({ openMinute: 540, closeMinute: 1080, isClosed: false }) // Thursday
        .mockResolvedValueOnce({ openMinute: 540, closeMinute: 1080, isClosed: false }) // Friday
        .mockResolvedValueOnce({ openMinute: 480, closeMinute: 960, isClosed: false }) // Saturday
        .mockResolvedValueOnce({ openMinute: 0, closeMinute: 0, isClosed: true }); // Sunday
      
      getAvailableSlotsForBarber.mockResolvedValue([
        { start: '09:00', end: '09:45' },
      ]);

      const startDate = new Date('2026-10-12T00:00:00.000Z'); // Monday
      const endDate = new Date('2026-10-18T00:00:00.000Z'); // Sunday

      const results = await getAvailabilityForRange(
        'signature-cut',
        'specific',
        'barber-1',
        startDate,
        endDate,
        [],
        new Date('2026-10-10T00:00:00.000Z')
      );

      expect(results).toHaveLength(7); // 7 days
      expect(results[6].status).toBe('closed'); // Sunday
    });
  });
});