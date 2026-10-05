import { describe, it, expect } from 'vitest';
import {
  canTransition,
  assertValidTransition,
  applyCancellation,
  applyCompletion,
  applyNoShow,
  canCompleteAt,
  canMarkNoShowAt,
  isConfirmed,
  isCancelled,
  isCompleted,
  isNoShow,
  isBlockingStatus,
  getBlockingStatuses,
  BookingStatus,
  type BookingLifecycleStatus,
} from '../lifecycle';

describe('Booking Lifecycle', () => {
  function createBaseBooking() {
    return {
      status: BookingStatus.CONFIRMED as BookingLifecycleStatus,
      startAt: new Date('2026-10-12T08:00:00Z'),
      endAt: new Date('2026-10-12T08:45:00Z'),
      cancelledAt: null as Date | null,
      cancellationReason: null as string | null,
      cancellationNote: null as string | null,
      outcomeAt: null as Date | null,
    };
  }

  describe('Valid Transitions', () => {
    it('CONFIRMED -> CANCELLED succeeds', () => {
      expect(canTransition(BookingStatus.CONFIRMED, BookingStatus.CANCELLED)).toBe(true);
      assertValidTransition(BookingStatus.CONFIRMED, BookingStatus.CANCELLED);
    });

    it('CONFIRMED -> COMPLETED succeeds', () => {
      expect(canTransition(BookingStatus.CONFIRMED, BookingStatus.COMPLETED)).toBe(true);
      assertValidTransition(BookingStatus.CONFIRMED, BookingStatus.COMPLETED);
    });

    it('CONFIRMED -> NO_SHOW succeeds', () => {
      expect(canTransition(BookingStatus.CONFIRMED, BookingStatus.NO_SHOW)).toBe(true);
      assertValidTransition(BookingStatus.CONFIRMED, BookingStatus.NO_SHOW);
    });

    it('CANCELLED -> anything fails', () => {
      expect(canTransition(BookingStatus.CANCELLED, BookingStatus.CONFIRMED)).toBe(false);
      expect(canTransition(BookingStatus.CANCELLED, BookingStatus.COMPLETED)).toBe(false);
      expect(canTransition(BookingStatus.CANCELLED, BookingStatus.NO_SHOW)).toBe(false);
    });

    it('COMPLETED -> anything fails', () => {
      expect(canTransition(BookingStatus.COMPLETED, BookingStatus.CONFIRMED)).toBe(false);
      expect(canTransition(BookingStatus.COMPLETED, BookingStatus.CANCELLED)).toBe(false);
      expect(canTransition(BookingStatus.COMPLETED, BookingStatus.NO_SHOW)).toBe(false);
    });

    it('NO_SHOW -> anything fails', () => {
      expect(canTransition(BookingStatus.NO_SHOW, BookingStatus.CONFIRMED)).toBe(false);
      expect(canTransition(BookingStatus.NO_SHOW, BookingStatus.CANCELLED)).toBe(false);
      expect(canTransition(BookingStatus.NO_SHOW, BookingStatus.COMPLETED)).toBe(false);
    });

    it('assertValidTransition throws for invalid transitions', () => {
      expect(() => assertValidTransition(BookingStatus.CANCELLED, BookingStatus.CONFIRMED)).toThrow('Invalid booking status transition');
      expect(() => assertValidTransition(BookingStatus.COMPLETED, BookingStatus.CANCELLED)).toThrow('Invalid booking status transition');
      expect(() => assertValidTransition(BookingStatus.NO_SHOW, BookingStatus.COMPLETED)).toThrow('Invalid booking status transition');
    });
  });

  describe('Cancellation Data Rules', () => {
    it('cancelled requires a reason', () => {
      const booking = { ...createBaseBooking() };
      expect(() => applyCancellation(booking, { reason: '' })).toThrow('Cancellation reason is required');
      expect(() => applyCancellation(booking, { reason: '   ' })).toThrow('Cancellation reason is required');
    });

    it('optional cancellation note is accepted', () => {
      const booking = { ...createBaseBooking() };
      applyCancellation(booking, { reason: 'Customer requested', note: 'Internal note' });
      expect(booking.cancellationNote).toBe('Internal note');
    });

    it('cancellation without note sets note to null', () => {
      const booking = { ...createBaseBooking() };
      applyCancellation(booking, { reason: 'Customer requested' });
      expect(booking.cancellationNote).toBeNull();
    });

    it('cancelledAt is populated', () => {
      const booking = { ...createBaseBooking() };
      const now = new Date('2026-10-12T10:00:00Z');
      applyCancellation(booking, { reason: 'Customer requested' }, now);
      expect(booking.cancelledAt).toEqual(now);
    });

    it('outcomeAt remains null for cancelled', () => {
      const booking = { ...createBaseBooking() };
      applyCancellation(booking, { reason: 'Customer requested' });
      expect(booking.outcomeAt).toBeNull();
    });

    it('status becomes CANCELLED', () => {
      const booking = { ...createBaseBooking() };
      applyCancellation(booking, { reason: 'Customer requested' });
      expect(booking.status).toBe(BookingStatus.CANCELLED);
    });
  });

  describe('Outcome Data Rules', () => {
    it('completed sets outcomeAt', () => {
      const booking = { ...createBaseBooking() };
      const now = new Date('2026-10-12T10:00:00Z');
      applyCompletion(booking, now);
      expect(booking.outcomeAt).toEqual(now);
    });

    it('no-show sets outcomeAt', () => {
      const booking = { ...createBaseBooking() };
      const now = new Date('2026-10-12T10:00:00Z');
      applyNoShow(booking, now);
      expect(booking.outcomeAt).toEqual(now);
    });

    it('cancellation fields remain null for completed', () => {
      const booking = { ...createBaseBooking() };
      applyCompletion(booking, new Date('2026-10-12T10:00:00Z'));
      expect(booking.cancelledAt).toBeNull();
      expect(booking.cancellationReason).toBeNull();
      expect(booking.cancellationNote).toBeNull();
    });

    it('cancellation fields remain null for no-show', () => {
      const booking = { ...createBaseBooking() };
      applyNoShow(booking, new Date('2026-10-12T10:00:00Z'));
      expect(booking.cancelledAt).toBeNull();
      expect(booking.cancellationReason).toBeNull();
      expect(booking.cancellationNote).toBeNull();
    });

    it('status becomes COMPLETED', () => {
      const booking = { ...createBaseBooking() };
      applyCompletion(booking, new Date('2026-10-12T10:00:00Z'));
      expect(booking.status).toBe(BookingStatus.COMPLETED);
    });

    it('status becomes NO_SHOW', () => {
      const booking = { ...createBaseBooking() };
      applyNoShow(booking, new Date('2026-10-12T10:00:00Z'));
      expect(booking.status).toBe(BookingStatus.NO_SHOW);
    });
  });

  describe('Confirmed State', () => {
    it('confirmed has no cancellation data', () => {
      expect(isConfirmed(createBaseBooking())).toBe(true);
      expect(createBaseBooking().cancelledAt).toBeNull();
      expect(createBaseBooking().cancellationReason).toBeNull();
      expect(createBaseBooking().cancellationNote).toBeNull();
    });

    it('confirmed has no outcome data', () => {
      expect(createBaseBooking().outcomeAt).toBeNull();
    });

    it('isConfirmed returns false for cancelled', () => {
      const booking = { ...createBaseBooking() };
      applyCancellation(booking, { reason: 'Test' });
      expect(isConfirmed(booking)).toBe(false);
    });

    it('isConfirmed returns false for completed', () => {
      const booking = { ...createBaseBooking() };
      applyCompletion(booking, new Date('2026-10-12T09:00:00Z'));
      expect(isConfirmed(booking)).toBe(false);
    });

    it('isConfirmed returns false for no-show', () => {
      const booking = { ...createBaseBooking() };
      applyNoShow(booking, new Date('2026-10-12T08:30:00Z'));
      expect(isConfirmed(booking)).toBe(false);
    });
  });

  describe('Completion Timing', () => {
    const endAt = new Date('2026-10-12T08:45:00Z');

    it('before end fails', () => {
      const booking = { ...createBaseBooking(), endAt };
      const beforeEnd = new Date('2026-10-12T08:44:00Z');
      expect(canCompleteAt(booking, beforeEnd)).toBe(false);
      expect(() => applyCompletion(booking, beforeEnd)).toThrow('cannot be completed before its scheduled end time');
    });

    it('exactly at end succeeds', () => {
      const booking = { ...createBaseBooking(), endAt };
      const atEnd = new Date('2026-10-12T08:45:00Z');
      expect(canCompleteAt(booking, atEnd)).toBe(true);
      expect(() => applyCompletion(booking, atEnd)).not.toThrow();
    });

    it('after end succeeds', () => {
      const booking = { ...createBaseBooking(), endAt };
      const afterEnd = new Date('2026-10-12T09:00:00Z');
      expect(canCompleteAt(booking, afterEnd)).toBe(true);
      expect(() => applyCompletion(booking, afterEnd)).not.toThrow();
    });
  });

  describe('No-Show Timing', () => {
    const startAt = new Date('2026-10-12T08:00:00Z');

    it('before 15-minute threshold fails', () => {
      const booking = { ...createBaseBooking(), startAt };
      const beforeThreshold = new Date('2026-10-12T08:14:00Z');
      expect(canMarkNoShowAt(booking, beforeThreshold)).toBe(false);
      expect(() => applyNoShow(booking, beforeThreshold)).toThrow('cannot be marked as no-show before 15 minutes after its scheduled start time');
    });

    it('exactly at 15 minutes succeeds', () => {
      const booking = { ...createBaseBooking(), startAt };
      const atThreshold = new Date('2026-10-12T08:15:00Z');
      expect(canMarkNoShowAt(booking, atThreshold)).toBe(true);
      expect(() => applyNoShow(booking, atThreshold)).not.toThrow();
    });

    it('after 15 minutes succeeds', () => {
      const booking = { ...createBaseBooking(), startAt };
      const afterThreshold = new Date('2026-10-12T08:30:00Z');
      expect(canMarkNoShowAt(booking, afterThreshold)).toBe(true);
      expect(() => applyNoShow(booking, afterThreshold)).not.toThrow();
    });
  });

  describe('State Checks', () => {
    it('isCancelled returns true for cancelled', () => {
      const booking = { ...createBaseBooking() };
      applyCancellation(booking, { reason: 'Test' });
      expect(isCancelled(booking)).toBe(true);
    });

    it('isCompleted returns true for completed', () => {
      const booking = { ...createBaseBooking() };
      applyCompletion(booking, new Date('2026-10-12T09:00:00Z'));
      expect(isCompleted(booking)).toBe(true);
    });

    it('isNoShow returns true for no-show', () => {
      const booking = { ...createBaseBooking() };
      applyNoShow(booking, new Date('2026-10-12T08:30:00Z'));
      expect(isNoShow(booking)).toBe(true);
    });
  });

  describe('Blocking Statuses', () => {
    it('only CONFIRMED blocks availability', () => {
      expect(isBlockingStatus(BookingStatus.CONFIRMED)).toBe(true);
      expect(isBlockingStatus(BookingStatus.CANCELLED)).toBe(false);
      expect(isBlockingStatus(BookingStatus.COMPLETED)).toBe(false);
      expect(isBlockingStatus(BookingStatus.NO_SHOW)).toBe(false);
    });

    it('getBlockingStatuses returns only CONFIRMED', () => {
      expect(getBlockingStatuses()).toEqual([BookingStatus.CONFIRMED]);
    });
  });
});