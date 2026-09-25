import { bookingConfig } from '@/lib/data/booking-config';

const TIMEZONE = bookingConfig.timezone;

export function getNowInLusaka(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: TIMEZONE }));
}

export function toLusakaDate(date: Date): Date {
  return new Date(date.toLocaleString('en-US', { timeZone: TIMEZONE }));
}

export function createLusakaDate(year: number, month: number, day: number, hours = 0, minutes = 0): Date {
  const date = new Date(year, month - 1, day, hours, minutes, 0, 0);
  return date;
}

export function getLusakaOffset(date: Date): number {
  const lusakaTime = new Date(date.toLocaleString('en-US', { timeZone: TIMEZONE }));
  const utcTime = new Date(date.getTime());
  return (utcTime.getTime() - lusakaTime.getTime()) / 60000;
}

export function lusakaDateToUtc(lusakaDate: Date): Date {
  const offset = getLusakaOffset(lusakaDate);
  return new Date(lusakaDate.getTime() + offset * 60 * 1000);
}

export function utcToLusakaDate(utcDate: Date): Date {
  return toLusakaDate(utcDate);
}

export function formatLusakaTime(date: Date): string {
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: TIMEZONE,
  });
}

export function formatLusakaDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: TIMEZONE,
  }).replace(',', '');
}

export function getDayOfWeek(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long', timeZone: TIMEZONE });
}

export function isSameLusakaDay(a: Date, b: Date): boolean {
  return (
    a.toLocaleDateString('en-US', { timeZone: TIMEZONE }) ===
    b.toLocaleDateString('en-US', { timeZone: TIMEZONE })
  );
}

export function startOfLusakaDay(date: Date): Date {
  const lusakaStr = date.toLocaleString('en-US', { timeZone: TIMEZONE });
  const [datePart] = lusakaStr.split(',');
  const [month, day, year] = datePart.split('/');
  return createLusakaDate(parseInt(year), parseInt(month), parseInt(day), 0, 0);
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000);
}