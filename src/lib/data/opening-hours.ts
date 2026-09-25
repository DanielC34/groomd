import type { OpeningHours, DayOfWeek } from '@/lib/types';

export type { DayOfWeek };

export const openingHours: OpeningHours[] = [
  { day: 'Monday', open: '09:00', close: '18:00', closed: false },
  { day: 'Tuesday', open: '09:00', close: '18:00', closed: false },
  { day: 'Wednesday', open: '09:00', close: '18:00', closed: false },
  { day: 'Thursday', open: '09:00', close: '18:00', closed: false },
  { day: 'Friday', open: '09:00', close: '18:00', closed: false },
  { day: 'Saturday', open: '08:00', close: '16:00', closed: false },
  { day: 'Sunday', open: '', close: '', closed: true },
];

export function isDayClosed(day: DayOfWeek): boolean {
  const hours = openingHours.find((h) => h.day === day);
  return hours?.closed ?? true;
}

export function getOpeningHours(day: DayOfWeek): OpeningHours | undefined {
  return openingHours.find((h) => h.day === day);
}

export function getShortHoursString(): string {
  return 'Mon–Fri 09:00–18:00 · Sat 08:00–16:00 · Sun Closed';
}

/** CONTENT §4: "Today: {open}–{close}" / "Today: Closed" (no open-now logic). */
export function getTodayLine(day: DayOfWeek): string {
  const hours = getOpeningHours(day);
  return !hours || hours.closed ? 'Today: Closed' : `Today: ${hours.open}–${hours.close}`;
}

/** CONTENT §6.2 quick-info hours (Mon–Sat only). */
export const QUICK_INFO_HOURS = 'Mon–Fri 09:00–18:00 · Sat 08:00–16:00';
