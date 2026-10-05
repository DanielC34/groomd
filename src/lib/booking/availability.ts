import {
  getNowInLusaka,
  getLusakaParts,
  startOfLusakaDay,
  addDays,
} from './timezone';
import { getServiceById } from '@/lib/data/services';
import {
  getEffectiveBusinessHours,
  getAvailableSlotsForBarber,
  getAvailableSlotsForNoPreference,
} from './business-hours';

export type BarberPreference = 'specific' | 'no-preference';

export interface TimeSlot {
  start: string; // HH:MM in Lusaka time
  end: string;   // HH:MM in Lusaka time
  barberId?: string; // for no-preference: which barber is available
}

export interface AvailabilityResult {
  date: string; // YYYY-MM-DD in Lusaka
  dayOfWeek: string;
  status: 'closed' | 'open' | 'full';
  slots: TimeSlot[];
}

export interface BarberAvailability {
  barberId: string;
  slots: TimeSlot[];
}

export async function getAvailabilityForDate(
  serviceId: string,
  barberPreference: BarberPreference,
  barberId: string | null | undefined,
  date: Date,
  existingBookings: Array<{ startAt: Date; endAt: Date; barberId: string }> = [],
  referenceTime: Date = getNowInLusaka()
): Promise<AvailabilityResult> {
  const service = getServiceById(serviceId);
  if (!service) {
    throw new Error(`Service not found: ${serviceId}`);
  }

  const { ymd: dateStr, dayOfWeek: lusakaDay } = getLusakaParts(date);
  const dayOfWeek = lusakaDay;

  const businessHours = await getEffectiveBusinessHours(date);
  if (businessHours.isClosed) {
    return {
      date: dateStr,
      dayOfWeek,
      status: 'closed',
      slots: [],
    };
  }

  let availableSlots: TimeSlot[];

  if (barberPreference === 'specific' && barberId) {
    const slots = await getAvailableSlotsForBarber(
      serviceId,
      barberId,
      date,
      existingBookings,
      referenceTime
    );
    availableSlots = slots.map((s) => ({
      start: s.start,
      end: s.end,
      barberId,
    }));
  } else if (barberPreference === 'no-preference') {
    const slots = await getAvailableSlotsForNoPreference(
      serviceId,
      date,
      existingBookings,
      referenceTime
    );
    availableSlots = slots;
  } else {
    availableSlots = [];
  }

  const status = availableSlots.length > 0 ? 'open' : 'full';

  return {
    date: dateStr,
    dayOfWeek,
    status,
    slots: availableSlots,
  };
}

export async function getAvailabilityForRange(
  serviceId: string,
  barberPreference: BarberPreference,
  barberId: string | null,
  startDate: Date,
  endDate: Date,
  existingBookings: Array<{ startAt: Date; endAt: Date; barberId: string }> = [],
  referenceTime: Date = getNowInLusaka()
): Promise<AvailabilityResult[]> {
  const results: AvailabilityResult[] = [];
  let current = startOfLusakaDay(startDate);
  const end = startOfLusakaDay(endDate);

  while (current <= end) {
    results.push(
      await getAvailabilityForDate(
        serviceId,
        barberPreference,
        barberId,
        current,
        existingBookings,
        referenceTime
      )
    );
    current = addDays(current, 1);
  }

  return results;
}