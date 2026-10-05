import { z } from 'zod';

export const BusinessHoursInputSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  openMinute: z.number().int().min(0).max(1439).optional(),
  closeMinute: z.number().int().min(1).max(1440).optional(),
  isClosed: z.boolean().default(false),
}).superRefine((data, ctx) => {
  if (data.isClosed) return;
  if (data.openMinute === undefined || data.closeMinute === undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'For open days, openMinute and closeMinute are required',
      path: ['closeMinute'],
    });
    return;
  }
  if (data.closeMinute <= data.openMinute) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'For open days, closeMinute must be greater than openMinute',
      path: ['closeMinute'],
    });
  }
});

export const SpecialHoursInputSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  openMinute: z.number().int().min(0).max(1439).optional(),
  closeMinute: z.number().int().min(1).max(1440).optional(),
  isClosed: z.boolean().default(false),
  reason: z.string().max(500).optional(),
}).superRefine((data, ctx) => {
  if (data.isClosed) return;
  if (data.openMinute === undefined || data.closeMinute === undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'For open special days, openMinute and closeMinute are required',
      path: ['closeMinute'],
    });
    return;
  }
  if (data.closeMinute <= data.openMinute) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'For open special days, closeMinute must be greater than openMinute',
      path: ['closeMinute'],
    });
  }
});

export const BlockoutInputSchema = z.object({
  barberId: z.string().nullable().optional(),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  reason: z.string().max(500).optional(),
}).superRefine((data, ctx) => {
  const start = new Date(data.startAt);
  const end = new Date(data.endAt);
  if (end <= start) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'endAt must be after startAt',
      path: ['endAt'],
    });
  }
});

export type BusinessHoursInput = z.infer<typeof BusinessHoursInputSchema>;
export type SpecialHoursInput = z.infer<typeof SpecialHoursInputSchema>;
export type BlockoutInput = z.infer<typeof BlockoutInputSchema>;

export function validateBusinessHours(input: unknown): BusinessHoursInput {
  return BusinessHoursInputSchema.parse(input);
}

export function validateSpecialHours(input: unknown): SpecialHoursInput {
  return SpecialHoursInputSchema.parse(input);
}

export function validateBlockout(input: unknown): BlockoutInput {
  return BlockoutInputSchema.parse(input);
}

export function formatBusinessHours(hours: { openMinute: number | null; closeMinute: number | null; isClosed: boolean }): string {
  if (hours.isClosed) return 'Closed';
  if (hours.openMinute === null || hours.closeMinute === null) return 'Closed';
  
  const open = minutesToTime(hours.openMinute);
  const close = minutesToTime(hours.closeMinute);
  return `${open}–${close}`;
}

export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}