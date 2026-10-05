import { BookingStatus } from '@prisma/client';

export { BookingStatus };

export const BookingLifecycleStatus = {
  CONFIRMED: BookingStatus.CONFIRMED,
  CANCELLED: BookingStatus.CANCELLED,
  COMPLETED: BookingStatus.COMPLETED,
  NO_SHOW: BookingStatus.NO_SHOW,
} as const;

export type BookingLifecycleStatus = typeof BookingLifecycleStatus[keyof typeof BookingLifecycleStatus];

const VALID_TRANSITIONS: Record<BookingLifecycleStatus, BookingLifecycleStatus[]> = {
  [BookingStatus.CONFIRMED]: [BookingStatus.CANCELLED, BookingStatus.COMPLETED, BookingStatus.NO_SHOW],
  [BookingStatus.CANCELLED]: [],
  [BookingStatus.COMPLETED]: [],
  [BookingStatus.NO_SHOW]: [],
};

export function canTransition(from: BookingLifecycleStatus, to: BookingLifecycleStatus): boolean {
  return VALID_TRANSITIONS[from].includes(to);
}

export function assertValidTransition(from: BookingLifecycleStatus, to: BookingLifecycleStatus): void {
  if (!canTransition(from, to)) {
    throw new Error(`Invalid booking status transition: ${from} -> ${to}`);
  }
}

export interface CancellationData {
  reason: string;
  note?: string;
}

export function applyCancellation(
  booking: { status: BookingLifecycleStatus; cancelledAt: Date | null; cancellationReason: string | null; cancellationNote: string | null; outcomeAt: Date | null },
  data: CancellationData,
  now: Date = new Date()
): void {
  assertValidTransition(booking.status, BookingStatus.CANCELLED);
  if (!data.reason || data.reason.trim() === '') {
    throw new Error('Cancellation reason is required');
  }
  booking.status = BookingStatus.CANCELLED;
  booking.cancelledAt = now;
  booking.cancellationReason = data.reason.trim();
  booking.cancellationNote = data.note?.trim() ?? null;
  booking.outcomeAt = null;
}

export function applyCompletion(
  booking: { status: BookingLifecycleStatus; outcomeAt: Date | null; cancelledAt: Date | null; cancellationReason: string | null; cancellationNote: string | null; endAt: Date },
  now: Date = new Date()
): void {
  assertValidTransition(booking.status, BookingStatus.COMPLETED);
  if (booking.status !== BookingStatus.CONFIRMED) {
    throw new Error('Only confirmed bookings can be completed');
  }
  if (!canCompleteAt(booking, now)) {
    throw new Error('Booking cannot be completed before its scheduled end time');
  }
  booking.status = BookingStatus.COMPLETED;
  booking.outcomeAt = now;
  booking.cancelledAt = null;
  booking.cancellationReason = null;
  booking.cancellationNote = null;
}

export function applyNoShow(
  booking: { status: BookingLifecycleStatus; outcomeAt: Date | null; cancelledAt: Date | null; cancellationReason: string | null; cancellationNote: string | null; startAt: Date },
  now: Date = new Date()
): void {
  assertValidTransition(booking.status, BookingStatus.NO_SHOW);
  if (booking.status !== BookingStatus.CONFIRMED) {
    throw new Error('Only confirmed bookings can be marked as no-show');
  }
  if (!canMarkNoShowAt(booking, now)) {
    throw new Error('Booking cannot be marked as no-show before 15 minutes after its scheduled start time');
  }
  booking.status = BookingStatus.NO_SHOW;
  booking.outcomeAt = now;
  booking.cancelledAt = null;
  booking.cancellationReason = null;
  booking.cancellationNote = null;
}

export function canCompleteAt(booking: { endAt: Date }, now: Date = new Date()): boolean {
  return now.getTime() >= booking.endAt.getTime();
}

export function canMarkNoShowAt(booking: { startAt: Date }, now: Date = new Date()): boolean {
  const noShowThreshold = new Date(booking.startAt.getTime() + 15 * 60 * 1000);
  return now.getTime() >= noShowThreshold.getTime();
}

export function isConfirmed(booking: { status: BookingLifecycleStatus; cancelledAt: Date | null; outcomeAt: Date | null }): boolean {
  return booking.status === BookingStatus.CONFIRMED
    && booking.cancelledAt === null
    && booking.outcomeAt === null;
}

export function isCancelled(booking: { status: BookingLifecycleStatus; cancelledAt: Date | null }): boolean {
  return booking.status === BookingStatus.CANCELLED && booking.cancelledAt !== null;
}

export function isCompleted(booking: { status: BookingLifecycleStatus; outcomeAt: Date | null }): boolean {
  return booking.status === BookingStatus.COMPLETED && booking.outcomeAt !== null;
}

export function isNoShow(booking: { status: BookingLifecycleStatus; outcomeAt: Date | null }): boolean {
  return booking.status === BookingStatus.NO_SHOW && booking.outcomeAt !== null;
}

export function getBlockingStatuses(): BookingLifecycleStatus[] {
  return [BookingStatus.CONFIRMED];
}

export function isBlockingStatus(status: BookingLifecycleStatus): boolean {
  return status === BookingStatus.CONFIRMED;
}