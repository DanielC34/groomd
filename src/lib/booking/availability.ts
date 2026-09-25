import {
  isDayClosed,
  getOpeningHours,
  type DayOfWeek,
} from '@/lib/data/opening-hours';
import { bookingConfig } from '@/lib/data/booking-config';
import { getServiceById } from '@/lib/data/services';
import {
  getNowInLusaka,
  createLusakaDate,
  formatLusakaTime,
  getDayOfWeek,
  isSameLusakaDay,
  startOfLusakaDay,
  addMinutes,
} from './timezone';

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

function parseTime(time: string): { hours: number; minutes: number } {
  const [hours, minutes] = time.split(':').map(Number);
  return { hours, minutes };
}

function timeToMinutes(time: string): number {
  const { hours, minutes } = parseTime(time);
  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function generateCandidateSlots(
  openTime: string,
  closeTime: string,
  serviceDuration: number,
  intervalMinutes: number
): string[] {
  const open = timeToMinutes(openTime);
  const close = timeToMinutes(closeTime);
  const latestStart = close - serviceDuration;

  const slots: string[] = [];
  for (let time = open; time <= latestStart; time += intervalMinutes) {
    slots.push(minutesToTime(time));
  }
  return slots;
}

function isSlotInPast(
  slotStart: string,
  referenceTime: Date,
  minNoticeMinutes: number
): boolean {
  const nowMinutes = referenceTime.getHours() * 60 + referenceTime.getMinutes();
  const slotMinutes = timeToMinutes(slotStart);
  return slotMinutes < nowMinutes + minNoticeMinutes;
}

function doesOverlap(
  existingStart: Date,
  existingEnd: Date,
  requestedStart: Date,
  requestedEnd: Date
): boolean {
  return existingStart < requestedEnd && existingEnd > requestedStart;
}

function getBookedIntervalsForBarber(
  bookings: Array<{ startAt: Date; endAt: Date; barberId: string }>,
  barberId: string,
  date: Date
): Array<{ start: Date; end: Date }> {
  const startOfDay = startOfLusakaDay(date);
  const endOfDay = addMinutes(startOfDay, 24 * 60);

  return bookings
    .filter((b) => b.barberId === barberId)
    .filter((b) => doesOverlap(b.startAt, b.endAt, startOfDay, endOfDay))
    .map((b) => ({ start: b.startAt, end: b.endAt }));
}

export function getAvailabilityForDate(
  serviceId: string,
  barberPreference: BarberPreference,
  barberId: string | null | undefined,
  date: Date,
  existingBookings: Array<{ startAt: Date; endAt: Date; barberId: string }> = [],
  referenceTime: Date = getNowInLusaka()
): AvailabilityResult {
  const service = getServiceById(serviceId);
  if (!service) {
    throw new Error(`Service not found: ${serviceId}`);
  }

  const dayOfWeek = getDayOfWeek(date) as DayOfWeek;
  const dateStr = date.toISOString().split('T')[0];

  if (isDayClosed(dayOfWeek)) {
    return {
      date: dateStr,
      dayOfWeek,
      status: 'closed',
      slots: [],
    };
  }

  const hours = getOpeningHours(dayOfWeek);
  if (!hours) {
    return {
      date: dateStr,
      dayOfWeek,
      status: 'closed',
      slots: [],
    };
  }

  const isToday = isSameLusakaDay(date, referenceTime);
  const candidateSlots = generateCandidateSlots(
    hours.open,
    hours.close,
    service.durationMinutes,
    bookingConfig.slotIntervalMinutes
  );

  const availableSlots: TimeSlot[] = [];

  if (barberPreference === 'specific' && barberId) {
    const bookedIntervals = getBookedIntervalsForBarber(existingBookings, barberId, date);

    for (const slotStart of candidateSlots) {
      if (isToday && isSlotInPast(slotStart, referenceTime, bookingConfig.minNoticeMinutes)) {
        continue;
      }

      const { hours, minutes } = parseTime(slotStart);
      const slotStartDate = createLusakaDate(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        hours,
        minutes
      );
      const slotEndDate = addMinutes(slotStartDate, service.durationMinutes);

      const hasConflict = bookedIntervals.some((interval) =>
        doesOverlap(interval.start, interval.end, slotStartDate, slotEndDate)
      );

      if (!hasConflict) {
        availableSlots.push({
          start: slotStart,
          end: formatLusakaTime(slotEndDate),
          barberId,
        });
      }
    }
  } else if (barberPreference === 'no-preference') {
    const allBarbers = ['mwila-banda', 'chanda-mulenga', 'kondwani-phiri'];

    for (const slotStart of candidateSlots) {
      if (isToday && isSlotInPast(slotStart, referenceTime, bookingConfig.minNoticeMinutes)) {
        continue;
      }

      const { hours, minutes } = parseTime(slotStart);
      const slotStartDate = createLusakaDate(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        hours,
        minutes
      );
      const slotEndDate = addMinutes(slotStartDate, service.durationMinutes);

      const availableBarber = allBarbers.find((bid) => {
        const bookedIntervals = getBookedIntervalsForBarber(existingBookings, bid, date);
        return !bookedIntervals.some((interval) =>
          doesOverlap(interval.start, interval.end, slotStartDate, slotEndDate)
        );
      });

      if (availableBarber) {
        availableSlots.push({
          start: slotStart,
          end: formatLusakaTime(slotEndDate),
          barberId: availableBarber,
        });
      }
    }
  }

  const status = availableSlots.length > 0 ? 'open' : 'full';

  return {
    date: dateStr,
    dayOfWeek,
    status,
    slots: availableSlots,
  };
}

export function getAvailabilityForRange(
  serviceId: string,
  barberPreference: BarberPreference,
  barberId: string | null,
  startDate: Date,
  endDate: Date,
  existingBookings: Array<{ startAt: Date; endAt: Date; barberId: string }> = [],
  referenceTime: Date = getNowInLusaka()
): AvailabilityResult[] {
  const results: AvailabilityResult[] = [];
  let current = startOfLusakaDay(startDate);
  const end = startOfLusakaDay(endDate);

  while (current <= end) {
    results.push(
      getAvailabilityForDate(
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

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}