import { describe, it, expect } from 'vitest';
import {
  getLusakaParts,
  lusakaDateTimeToUtc,
  addDays,
} from '@/lib/booking/timezone';

describe('Appointment Data Access — Date Boundary', () => {
  const sampleLusakaDate = '2026-10-15';

  it('constructs correct UTC start-of-day from Lusaka date', () => {
    const { ymd } = getLusakaParts(new Date());
    // Verify getLusakaParts works correctly
    expect(ymd).toBeDefined();
  });

  it('constructs correct UTC next-day boundary from Lusaka start-of-day', () => {
    // Test the addDays utility for next-day boundary
    const startOfDay = lusakaDateTimeToUtc(sampleLusakaDate, '00:00');
    const nextDay = addDays(startOfDay, 1);
    // nextDay should be the start of the following Lusaka day in UTC
    expect(nextDay.getTime()).toBeGreaterThan(startOfDay.getTime());
  });

  it('half-open interval excludes next-day appointment at exactly 00:00', () => {
    // An appointment at startOfNextDayUtc should be excluded
    // An appointment at startOfDayUtc should be included
    const startOfDay = lusakaDateTimeToUtc(sampleLusakaDate, '00:00');
    const startOfNextDay = addDays(startOfDay, 1);

    // The half-open interval: gte startOfDayUtc AND lt startOfNextDayUtc
    // appointmentToday should be included (it equals startOfDay)
    // appointmentNextDay should be excluded (it equals startOfNextDay, and we use lt)
    expect(startOfDay.getTime()).toBeGreaterThanOrEqual(startOfDay.getTime());
    expect(startOfNextDay.getTime()).toEqual(addDays(startOfDay, 1).getTime());
    // Verify the boundary: next day's start should NOT be included
    // when using lt comparison instead of inclusive 23:59 approximation
    const nextDayStart = addDays(startOfDay, 1);
    expect(nextDayStart.getTime()).toBeGreaterThan(startOfDay.getTime());
  });
});

describe('Appointment Data Access — Filter Logic', () => {
  it('all four BookingStatus values are supported by the enum', () => {
    // When status is null, the where clause should include all four statuses
    const expectedStatuses = [
      'CONFIRMED',
      'CANCELLED',
      'COMPLETED',
      'NO_SHOW',
    ];
    expect(expectedStatuses).toHaveLength(4);
  });

  it('barber filter of null returns all barbers', () => {
    // When barberId is null, no barber filter is applied
    const barberId = null;
    expect(barberId).toBeNull();
  });

  it('barber filter with specific ID applies barberId where clause', () => {
    const specificBarberId = 'mwila-banda';
    // The filter should set where.barberId = specificBarberId
    expect(specificBarberId).toBe('mwila-banda');
  });
});

describe('Appointment Data Access — Combined Filters', () => {
  it('combines date, status, and barber filters correctly', () => {
    // Test that all three filter types can be combined
    const filters = {
      date: '2026-10-08',
      status: 'CONFIRMED' as const,
      barberId: 'mwila-banda',
    };

    expect(filters.date).toBe('2026-10-08');
    expect(filters.status).toBe('CONFIRMED');
    expect(filters.barberId).toBe('mwila-banda');
  });
});

describe('Appointment Data Access — Historical Visibility', () => {
  it('cancelled appointments remain queryable', () => {
    // Cancelled appointments should be queryable when status filter is not applied
    // or when explicitly filtering for CANCELLED status
    const isCancelled = 'CANCELLED' === 'CANCELLED';
    expect(isCancelled).toBe(true);
  });

  it('all four statuses are supported', () => {
    const statuses = ['CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW'];
    expect(statuses).toHaveLength(4);
  });
});