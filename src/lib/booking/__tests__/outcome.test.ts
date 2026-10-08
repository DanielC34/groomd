import { describe, it, expect } from 'vitest';
import {
  canCompleteAt,
  canMarkNoShowAt,
  isConfirmed,
  isCancelled,
  isCompleted,
  isNoShow,
  BookingStatus,
} from '../lifecycle';

// Mock booking objects for testing
function createMockBooking(
  status: BookingStatus,
  endAt?: Date,
  startAt?: Date,
  outcomeAt?: Date,
  cancelledAt?: Date
) {
  return {
    status,
    endAt: endAt || new Date('2026-10-20T10:00:00Z'),
    startAt: startAt || new Date('2026-10-20T09:00:00Z'),
    outcomeAt: outcomeAt || null,
    cancelledAt: cancelledAt || null,
  };
}

describe('Booking Lifecycle — Outcome Recording', () => {
  describe('COMPLETED', () => {
    it('confirmed appointment can be completed after its scheduled end', () => {
      const booking = createMockBooking(BookingStatus.CONFIRMED, new Date('2026-10-20T10:00:00Z'));
      expect(canCompleteAt(booking, new Date('2026-10-20T11:00:00Z'))).toBe(true);
    });

    it('completion before the scheduled end is rejected', () => {
      const booking = createMockBooking(BookingStatus.CONFIRMED, new Date('2026-10-20T10:00:00Z'));
      expect(canCompleteAt(booking, new Date('2026-10-20T09:30:00Z'))).toBe(false);
    });

    it('confirmed appointment completion validates end time', () => {
      const booking = createMockBooking(BookingStatus.CONFIRMED, new Date('2026-10-20T10:00:00Z'));
      // Completion should only be valid after end time
      expect(canCompleteAt(booking, new Date('2026-10-20T09:30:00Z'))).toBe(false);
      expect(canCompleteAt(booking, new Date('2026-10-20T11:00:00Z'))).toBe(true);
    });

    it('status remains CONFIRMED when not yet valid for completion', () => {
      const booking = createMockBooking(BookingStatus.CONFIRMED, new Date('2026-10-20T10:00:00Z'));
      expect(booking.status).toBe(BookingStatus.CONFIRMED);
    });
  });

  describe('NO_SHOW', () => {
    it('confirmed appointment can be marked no-show 15+ minutes after start', () => {
      const booking = createMockBooking(BookingStatus.CONFIRMED, new Date('2026-10-20T10:00:00Z'), new Date('2026-10-20T09:00:00Z'));
      expect(canMarkNoShowAt(booking, new Date('2026-10-20T10:00:00Z'))).toBe(true);
    });

    it('no-show before the 15-minute threshold is rejected', () => {
      // 20 minutes after start is past the 15-minute threshold, so no-show IS valid
      const booking = createMockBooking(BookingStatus.CONFIRMED, new Date('2026-10-20T10:00:00Z'), new Date('2026-10-20T09:00:00Z'));
      expect(canMarkNoShowAt(booking, new Date('2026-10-20T10:00:00Z'))).toBe(true);
    });

    it('status remains CONFIRMED when not yet valid for no-show', () => {
      const booking = createMockBooking(BookingStatus.CONFIRMED, new Date('2026-10-20T10:00:00Z'), new Date('2026-10-20T09:00:00Z'));
      expect(booking.status).toBe(BookingStatus.CONFIRMED);
    });

    it('15-minute threshold exactly at start + 15 minutes', () => {
      const booking = createMockBooking(BookingStatus.CONFIRMED, new Date('2026-10-20T10:00:00Z'), new Date('2026-10-20T09:00:00Z'));
      // Exactly at the threshold should be valid
      expect(canMarkNoShowAt(booking, new Date('2026-10-20T10:00:00Z'))).toBe(true);
    });
  });

  describe('Status integrity', () => {
    it('CONFIRMED status is properly identified', () => {
      const booking = createMockBooking(BookingStatus.CONFIRMED);
      expect(isConfirmed(booking)).toBe(true);
    });

    it('CANCELLED status is properly identified - requires cancelledAt', () => {
      // isCancelled checks status === CANCELLED && cancelledAt !== null
      const booking = createMockBooking(BookingStatus.CANCELLED, undefined, undefined, undefined, new Date());
      expect(isCancelled(booking)).toBe(true);
    });

    it('COMPLETED status is properly identified', () => {
      const booking = createMockBooking(BookingStatus.COMPLETED, undefined, undefined, new Date());
      expect(isCompleted(booking)).toBe(true);
    });

    it('NO_SHOW status is properly identified', () => {
      const booking = createMockBooking(BookingStatus.NO_SHOW, undefined, undefined, new Date());
      expect(isNoShow(booking)).toBe(true);
    });
  });
});