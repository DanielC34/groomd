import { z } from 'zod';
import { getAllServices } from '@/lib/data/services';
import { getAllBarbers } from '@/lib/data/barbers';
import { bookingConfig } from '@/lib/data/booking-config';
import { getOpeningHours } from '@/lib/data/opening-hours';
import { createLusakaDate, getNowInLusaka, isSameLusakaDay, startOfLusakaDay, addDays } from './timezone';
import type { DayOfWeek } from '@/lib/types';

const barberIds = getAllBarbers().map((b) => b.id);

export const BarberPreferenceSchema = z.enum(['specific', 'no-preference']);

export const AvailabilityQuerySchema = z.object({
  serviceId: z.string().min(1, 'Service ID is required'),
  barberPreference: BarberPreferenceSchema,
  barberId: z.string().optional().nullable(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

export const BookingRequestSchema = z.object({
  serviceId: z.string().min(1, 'Service ID is required'),
  barberPreference: BarberPreferenceSchema,
  barberId: z.string().optional().nullable(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
  customerName: z.string().min(2, 'Name must be at least 2 characters').trim(),
  customerPhone: z.string().regex(/^[\d\s+]+$/, 'Phone must contain only digits, spaces, and +').min(8, 'Phone number too short'),
  customerEmail: z.string().email('Invalid email address'),
  notes: z.string().max(500, 'Notes must be 500 characters or less').optional(),
  termsAccepted: z.literal(true, { message: 'Terms must be accepted' }),
});

export type AvailabilityQuery = z.infer<typeof AvailabilityQuerySchema>;
export type BookingRequest = z.infer<typeof BookingRequestSchema>;

export function validateAvailabilityQuery(input: unknown): AvailabilityQuery {
  return AvailabilityQuerySchema.parse(input);
}

export function validateBookingRequest(input: unknown): BookingRequest {
  return BookingRequestSchema.parse(input);
}

function isValidLusakaTime(time: string): boolean {
  const match = time.match(/^(\d{2}):(\d{2})$/);
  if (!match) return false;
  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  return hours >= 0 && hours <= 23 && minutes % 15 === 0 && minutes < 60;
}

function isFifteenMinuteIncrement(time: string): boolean {
  const match = time.match(/^(\d{2}):(\d{2})$/);
  if (!match) return false;
  const minutes = parseInt(match[2], 10);
  return minutes % 15 === 0;
}

export function validateBookingTimeRules(
  serviceId: string,
  barberPreference: 'specific' | 'no-preference',
  barberId: string | null | undefined,
  dateStr: string,
  timeStr: string
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  const service = getAllServices().find((s) => s.id === serviceId);
  if (!service) {
    errors.push('Unknown service');
    return { valid: false, errors };
  }

  if (!isValidLusakaTime(timeStr)) {
    errors.push('Invalid time format. Must be HH:MM in 15-minute increments.');
    return { valid: false, errors };
  }

  if (!isFifteenMinuteIncrement(timeStr)) {
    errors.push('Time must be in 15-minute increments (e.g., 09:00, 09:15, 09:30).');
    return { valid: false, errors };
  }

  const [year, month, day] = dateStr.split('-').map(Number);
  const selectedDate = createLusakaDate(year, month, day);
  const now = getNowInLusaka();

  if (isSameLusakaDay(selectedDate, now)) {
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const [hours, minutes] = timeStr.split(':').map(Number);
    const slotMinutes = hours * 60 + minutes;
    if (slotMinutes < nowMinutes + bookingConfig.minNoticeMinutes) {
      errors.push(`Appointments must be booked at least ${bookingConfig.minNoticeMinutes} minutes in advance.`);
    }
  }

  const startDate = startOfLusakaDay(now);
  const maxDate = addDays(startDate, bookingConfig.maxBookingWindowDays);
  if (selectedDate < startDate || selectedDate > maxDate) {
    errors.push(`Booking window is today through ${bookingConfig.maxBookingWindowDays} days ahead.`);
  }

  const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long', timeZone: bookingConfig.timezone });
  if (dayOfWeek === 'Sunday') {
    errors.push('The studio is closed on Sundays.');
  }

  const openingHours = getOpeningHours(dayOfWeek as DayOfWeek);
  if (!openingHours || openingHours.closed) {
    errors.push('The studio is closed on this day.');
  } else {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const slotStartMinutes = hours * 60 + minutes;
    const openMinutes = parseTimeToMinutes(openingHours.open);
    const closeMinutes = parseTimeToMinutes(openingHours.close);
    const latestStart = closeMinutes - service.durationMinutes;

    if (slotStartMinutes < openMinutes || slotStartMinutes > latestStart) {
      errors.push(`Selected time is outside opening hours for the chosen service on this day.`);
    }
  }

  if (barberPreference === 'specific') {
    if (!barberId || !barberIds.includes(barberId)) {
      errors.push('Invalid barber selection.');
    }
  }

  return { valid: errors.length === 0, errors };
}

function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function getServiceByIdChecked(serviceId: string) {
  const service = getAllServices().find((s) => s.id === serviceId);
  if (!service) {
    throw new Error('Service not found');
  }
  return service;
}

export function getBarberByIdChecked(barberId: string) {
  const barber = getAllBarbers().find((b) => b.id === barberId);
  if (!barber) {
    throw new Error('Barber not found');
  }
  return barber;
}