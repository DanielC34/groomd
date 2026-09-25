/**
 * Africa/Lusaka time helpers.
 *
 * Zambia is fixed at UTC+2 with no daylight saving, so conversions are done with
 * explicit offset arithmetic. Nothing here depends on the Node process (or
 * browser) local timezone:
 *
 * - Every `Date` is a real absolute instant (what PostgreSQL stores).
 * - Lusaka wall-clock values are read by shifting +2h and using the getUTC* methods.
 * - Calendar days are passed around as `YYYY-MM-DD` strings in Lusaka.
 */
import { bookingConfig } from '@/lib/data/booking-config';

const TIMEZONE = bookingConfig.timezone; // 'Africa/Lusaka'
export const LUSAKA_UTC_OFFSET_MINUTES = 120;
const OFFSET_MS = LUSAKA_UTC_OFFSET_MINUTES * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

const pad = (n: number) => String(n).padStart(2, '0');

export interface LusakaParts {
  year: number;
  month: number; // 1-12
  day: number;
  hours: number;
  minutes: number;
  dayOfWeek: (typeof DAY_NAMES)[number];
  ymd: string; // YYYY-MM-DD
  hhmm: string; // HH:MM
  minutesOfDay: number;
}

/** Lusaka wall-clock parts of an absolute instant. */
export function getLusakaParts(date: Date): LusakaParts {
  const shifted = new Date(date.getTime() + OFFSET_MS);
  const year = shifted.getUTCFullYear();
  const month = shifted.getUTCMonth() + 1;
  const day = shifted.getUTCDate();
  const hours = shifted.getUTCHours();
  const minutes = shifted.getUTCMinutes();
  return {
    year,
    month,
    day,
    hours,
    minutes,
    dayOfWeek: DAY_NAMES[shifted.getUTCDay()],
    ymd: `${year}-${pad(month)}-${pad(day)}`,
    hhmm: `${pad(hours)}:${pad(minutes)}`,
    minutesOfDay: hours * 60 + minutes,
  };
}

/** The current absolute instant. (Kept under its old name for existing callers.) */
export function getNowInLusaka(): Date {
  return new Date();
}

/** Absolute instant for a Lusaka wall-clock time. */
export function createLusakaDate(year: number, month: number, day: number, hours = 0, minutes = 0): Date {
  return new Date(Date.UTC(year, month - 1, day, hours, minutes) - OFFSET_MS);
}

/** Absolute instant for a Lusaka `YYYY-MM-DD` + `HH:MM`. */
export function lusakaDateTimeToUtc(ymd: string, hhmm = '00:00'): Date {
  const [y, m, d] = ymd.split('-').map(Number);
  const [h, min] = hhmm.split(':').map(Number);
  return createLusakaDate(y, m, d, h, min);
}

/** `YYYY-MM-DD` of an instant in Lusaka. */
export function toLusakaYmd(date: Date): string {
  return getLusakaParts(date).ymd;
}

/** Today's `YYYY-MM-DD` in Lusaka. */
export function todayLusakaYmd(now: Date = new Date()): string {
  return toLusakaYmd(now);
}

/** Add calendar days to a `YYYY-MM-DD` string. */
export function addDaysYmd(ymd: string, days: number): string {
  const [y, m, d] = ymd.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d) + days * DAY_MS);
  return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}`;
}

/** Weekday name of a `YYYY-MM-DD` calendar date. */
export function dayOfWeekYmd(ymd: string): (typeof DAY_NAMES)[number] {
  const [y, m, d] = ymd.split('-').map(Number);
  return DAY_NAMES[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}

/**
 * A Date that is safe to pass to toLocaleDateString(..., { timeZone: 'UTC' })
 * for displaying a `YYYY-MM-DD` calendar date, independent of viewer timezone.
 */
export function ymdToDisplayDate(ymd: string): Date {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12));
}

export function formatLusakaTime(date: Date): string {
  return getLusakaParts(date).hhmm;
}

export function formatLusakaDate(date: Date): string {
  return date
    .toLocaleDateString('en-GB', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: TIMEZONE,
    })
    .replace(',', '');
}

export function getDayOfWeek(date: Date): string {
  return getLusakaParts(date).dayOfWeek;
}

export function isSameLusakaDay(a: Date, b: Date): boolean {
  return toLusakaYmd(a) === toLusakaYmd(b);
}

/** Absolute instant of 00:00 Lusaka on the Lusaka day containing `date`. */
export function startOfLusakaDay(date: Date): Date {
  return lusakaDateTimeToUtc(toLusakaYmd(date));
}

/** Add whole days. Safe as plain arithmetic because Lusaka has no DST. */
export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS);
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

/** "HH:MM" + minutes -> "HH:MM" (same-day wall-clock arithmetic). */
export function addMinutesToHhmm(hhmm: string, minutes: number): string {
  const [h, m] = hhmm.split(':').map(Number);
  const total = h * 60 + m + minutes;
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
}

/** CONTENT §4 date format for a Lusaka `YYYY-MM-DD`: "Sat 10 Oct 2026" (viewer-timezone independent). */
export function formatYmdDate(ymd: string): string {
  return ymdToDisplayDate(ymd)
    .toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
    .replace(',', '')
    .replace('Sept', 'Sep');
}

/** Short form without the year, e.g. "Sat 10 Oct" (CONTENT §9.2 / §9.6). */
export function formatYmdShort(ymd: string): string {
  return ymdToDisplayDate(ymd)
    .toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })
    .replace(',', '')
    .replace('Sept', 'Sep');
}

/** Time range with an en dash, e.g. "14:30–15:15" (CONTENT §4). */
export function formatTimeRange(start: string, durationMinutes: number): string {
  return `${start}–${addMinutesToHhmm(start, durationMinutes)}`;
}
