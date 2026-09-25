/**
 * Client-safe helpers for consuming GET /api/bookings/availability.
 * The response shape is AvailabilityResult from ./availability.
 */
import { z } from 'zod';
import type { AvailabilityResult, TimeSlot } from './availability';

const TimeSlotSchema = z.object({
  start: z.string().regex(/^\d{2}:\d{2}$/),
  end: z.string().regex(/^\d{2}:\d{2}$/),
  barberId: z.string().optional(),
});

const AvailabilityResponseSchema = z.object({
  date: z.string(),
  dayOfWeek: z.string(),
  status: z.enum(['closed', 'open', 'full']),
  slots: z.array(TimeSlotSchema),
});

/** Validate an availability API response body. Throws if the shape is wrong. */
export function parseAvailabilityResponse(json: unknown): AvailabilityResult {
  return AvailabilityResponseSchema.parse(json);
}

export interface SlotGroup {
  label: 'Morning' | 'Afternoon' | 'Evening';
  sublabel: string;
  slots: TimeSlot[];
}

/**
 * Group slots per CONTENT §9.6: Morning < 12:00, Afternoon 12:00–16:59,
 * Evening 17:00+. Empty groups are omitted.
 */
export function groupSlots(slots: TimeSlot[], eveningSublabel: string): SlotGroup[] {
  const morning: TimeSlot[] = [];
  const afternoon: TimeSlot[] = [];
  const evening: TimeSlot[] = [];

  for (const slot of slots) {
    const hour = Number(slot.start.split(':')[0]);
    if (hour < 12) morning.push(slot);
    else if (hour < 17) afternoon.push(slot);
    else evening.push(slot);
  }

  const groups: SlotGroup[] = [];
  if (morning.length) groups.push({ label: 'Morning', sublabel: 'Before 12:00', slots: morning });
  if (afternoon.length) groups.push({ label: 'Afternoon', sublabel: '12:00 – 16:59', slots: afternoon });
  if (evening.length) groups.push({ label: 'Evening', sublabel: eveningSublabel, slots: evening });
  return groups;
}
