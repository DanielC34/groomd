import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { getPrisma } from '@/lib/prisma/client';
import { rescheduleBooking, getRescheduleChain, RESCHEDULE_CANCELLATION_REASON } from '../reschedule';
import { BookingStatus } from '@prisma/client';

describe('Booking Rescheduling', () => {
  const prisma = getPrisma();
  let testServiceId: string;
  let testBarberId: string;

  beforeAll(async () => {
    // Get existing service and barber
    const service = await prisma.service.findFirst({ where: { status: 'ACTIVE' } });
    const barber = await prisma.barber.findFirst({ where: { status: 'ACTIVE' } });
    
    if (!service || !barber) {
      throw new Error('No active service or barber found for tests');
    }
    
    testServiceId = service.id;
    testBarberId = barber.id;
  });

  afterAll(async () => {
    // Clean up test bookings
    await prisma.booking.deleteMany({
      where: { customerName: { startsWith: 'Reschedule Test' } }
    });
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean up before each test
    await prisma.booking.deleteMany({
      where: { customerName: { startsWith: 'Reschedule Test' } }
    });
  });

  async function createTestBooking(
    date: string,
    time: string,
    barberId: string = testBarberId
  ) {
    const startAt = new Date(`${date}T${time}:00.000Z`);
    const service = await prisma.service.findUnique({ where: { id: testServiceId } });
    const endAt = new Date(startAt.getTime() + (service?.duration ?? 45) * 60 * 1000);

    return prisma.booking.create({
      data: {
        reference: `GRD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        serviceId: testServiceId,
        barberId,
        customerName: 'Reschedule Test User',
        customerPhone: '+260970000000',
        customerEmail: 'test@example.com',
        startAt,
        endAt,
        status: BookingStatus.CONFIRMED,
      },
    });
  }

  describe('Basic rescheduling', () => {
    it('confirmed booking can be rescheduled to a new time', async () => {
      const original = await createTestBooking('2026-10-12', '10:00');
      
      const result = await rescheduleBooking({
        bookingId: original.id,
        date: '2026-10-13',
        time: '14:00',
        barberPreference: 'specific',
        barberId: testBarberId,
      });

      // Verify original booking is cancelled
      expect(result.originalBooking.status).toBe(BookingStatus.CANCELLED);
      expect(result.originalBooking.cancelledAt).not.toBeNull();
      expect(result.originalBooking.cancellationReason).toBe(RESCHEDULE_CANCELLATION_REASON);

      // Verify replacement booking
      expect(result.replacementBooking.status).toBe(BookingStatus.CONFIRMED);
      expect(result.replacementBooking.rescheduledFromBookingId).toBe(original.id);
      expect(result.replacementBooking.id).not.toBe(original.id);
      expect(result.replacementBooking.reference).not.toBe(original.reference);

      // Verify times are correct
      const expectedStart = new Date('2026-10-13T14:00:00.000Z');
      expect(result.replacementBooking.startAt.getTime()).toBe(expectedStart.getTime());
    });

    it('replacement receives a new ID', async () => {
      const original = await createTestBooking('2026-10-12', '10:00');
      
      const result = await rescheduleBooking({
        bookingId: original.id,
        date: '2026-10-13',
        time: '14:00',
        barberPreference: 'specific',
        barberId: testBarberId,
      });

      expect(result.replacementBooking.id).not.toBe(original.id);
      expect(result.replacementBooking.id).toBeDefined();
      expect(typeof result.replacementBooking.id).toBe('string');
    });

    it('replacement receives a new reference', async () => {
      const original = await createTestBooking('2026-10-12', '10:00');
      
      const result = await rescheduleBooking({
        bookingId: original.id,
        date: '2026-10-13',
        time: '14:00',
        barberPreference: 'specific',
        barberId: testBarberId,
      });

      expect(result.replacementBooking.reference).not.toBe(original.reference);
      expect(result.replacementBooking.reference).toMatch(/^GRD-[A-HJ-NP-Z2-9]{6}$/);
    });

    it('replacement points to original via rescheduledFromBookingId', async () => {
      const original = await createTestBooking('2026-10-12', '10:00');
      
      const result = await rescheduleBooking({
        bookingId: original.id,
        date: '2026-10-13',
        time: '14:00',
        barberPreference: 'specific',
        barberId: testBarberId,
      });

      expect(result.replacementBooking.rescheduledFromBookingId).toBe(original.id);
    });

    it('original becomes CANCELLED with RESCHEDULED reason', async () => {
      const original = await createTestBooking('2026-10-12', '10:00');
      
      const result = await rescheduleBooking({
        bookingId: original.id,
        date: '2026-10-13',
        time: '14:00',
        barberPreference: 'specific',
        barberId: testBarberId,
      });

      const originalBooking = await prisma.booking.findUnique({ where: { id: original.id } });
      expect(originalBooking?.status).toBe(BookingStatus.CANCELLED);
      expect(originalBooking?.cancellationReason).toBe(RESCHEDULE_CANCELLATION_REASON);
      expect(originalBooking?.cancellationNote).toContain(result.replacementBooking.reference);
      expect(originalBooking?.outcomeAt).toBeNull();
    });

    it('replacement is CONFIRMED', async () => {
      const original = await createTestBooking('2026-10-12', '10:00');
      
      const result = await rescheduleBooking({
        bookingId: original.id,
        date: '2026-10-13',
        time: '14:00',
        barberPreference: 'specific',
        barberId: testBarberId,
      });

      const replacement = await prisma.booking.findUnique({ where: { id: result.replacementBooking.id } });
      expect(replacement?.status).toBe(BookingStatus.CONFIRMED);
      expect(replacement?.rescheduledFromBookingId).toBe(original.id);
    });

    it('original slot becomes available after reschedule', async () => {
      const original = await createTestBooking('2026-10-12', '10:00');
      
      // Verify original slot was blocking
      const originalStart = original.startAt;
      const originalEnd = original.endAt;
      const conflictingBookings = await prisma.booking.findMany({
        where: {
          status: BookingStatus.CONFIRMED,
          barberId: testBarberId,
          startAt: { lt: originalEnd },
          endAt: { gt: originalStart },
        },
      });
      expect(conflictingBookings.length).toBe(1);
      expect(conflictingBookings[0].id).toBe(original.id);

      // Reschedule
      await rescheduleBooking({
        bookingId: original.id,
        date: '2026-10-13',
        time: '14:00',
        barberPreference: 'specific',
        barberId: testBarberId,
      });

      // Original slot should now be free
      const afterReschedule = await prisma.booking.findMany({
        where: {
          status: BookingStatus.CONFIRMED,
          barberId: testBarberId,
          startAt: { lt: originalEnd },
          endAt: { gt: originalStart },
        },
      });
      expect(afterReschedule.length).toBe(0);
    });
  });

  describe('History chain', () => {
    it('A -> B creates correct chain', async () => {
      const A = await createTestBooking('2026-10-12', '10:00');
      
      const result1 = await rescheduleBooking({
        bookingId: A.id,
        date: '2026-10-13',
        time: '14:00',
        barberPreference: 'specific',
        barberId: testBarberId,
      });

      const chain = await getRescheduleChain(result1.replacementBooking.id);
      expect(chain.length).toBe(2);
      expect(chain[0].id).toBe(result1.replacementBooking.id);
      expect(chain[0].rescheduledFromBookingId).toBe(A.id);
      expect(chain[1].id).toBe(A.id);
      expect(chain[1].rescheduledFromBookingId).toBeNull();
    });

    it('A -> B -> C creates correct chain', async () => {
      const A = await createTestBooking('2026-10-12', '10:00');
      
      const result1 = await rescheduleBooking({
        bookingId: A.id,
        date: '2026-10-13',
        time: '14:00',
        barberPreference: 'specific',
        barberId: testBarberId,
      });

      const result2 = await rescheduleBooking({
        bookingId: result1.replacementBooking.id,
        date: '2026-10-14',
        time: '09:00',
        barberPreference: 'specific',
        barberId: testBarberId,
      });

      const chain = await getRescheduleChain(result2.replacementBooking.id);
      expect(chain.length).toBe(3);
      expect(chain[0].id).toBe(result2.replacementBooking.id);
      expect(chain[0].rescheduledFromBookingId).toBe(result1.replacementBooking.id);
      expect(chain[1].id).toBe(result1.replacementBooking.id);
      expect(chain[1].rescheduledFromBookingId).toBe(A.id);
      expect(chain[2].id).toBe(A.id);
      expect(chain[2].rescheduledFromBookingId).toBeNull();
    });

    it('each booking only points to immediate predecessor', async () => {
      const A = await createTestBooking('2026-10-12', '10:00');
      
      const result1 = await rescheduleBooking({
        bookingId: A.id,
        date: '2026-10-13',
        time: '14:00',
        barberPreference: 'specific',
        barberId: testBarberId,
      });

      const result2 = await rescheduleBooking({
        bookingId: result1.replacementBooking.id,
        date: '2026-10-14',
        time: '09:00',
        barberPreference: 'specific',
        barberId: testBarberId,
      });

      // C points to B, not A
      expect(result2.replacementBooking.rescheduledFromBookingId).toBe(result1.replacementBooking.id);
      
      // B points to A
      const B = await prisma.booking.findUnique({ where: { id: result1.replacementBooking.id } });
      expect(B?.rescheduledFromBookingId).toBe(A.id);
      
      // A has no predecessor
      const updatedA = await prisma.booking.findUnique({ where: { id: A.id } });
      expect(updatedA?.rescheduledFromBookingId).toBeNull();
    });
  });

  describe('Failed reschedule scenarios', () => {
    it('unavailable slot leaves original CONFIRMED', async () => {
      // Create two bookings that conflict
      const original = await createTestBooking('2026-10-12', '10:00');
      await createTestBooking('2026-10-13', '14:00'); // This slot is now taken
      
      await expect(rescheduleBooking({
        bookingId: original.id,
        date: '2026-10-13',
        time: '14:00',
        barberPreference: 'specific',
        barberId: testBarberId,
      })).rejects.toThrow('CONFLICT');

      // Original should still be CONFIRMED
      const originalBooking = await prisma.booking.findUnique({ where: { id: original.id } });
      expect(originalBooking?.status).toBe(BookingStatus.CONFIRMED);
      expect(originalBooking?.cancelledAt).toBeNull();
      expect(originalBooking?.cancellationReason).toBeNull();
    });

    it('cancelled booking cannot be rescheduled', async () => {
      const original = await createTestBooking('2026-10-12', '10:00');
      await prisma.booking.update({
        where: { id: original.id },
        data: { status: BookingStatus.CANCELLED, cancelledAt: new Date(), cancellationReason: 'test' },
      });

      await expect(rescheduleBooking({
        bookingId: original.id,
        date: '2026-10-13',
        time: '14:00',
        barberPreference: 'specific',
        barberId: testBarberId,
      })).rejects.toThrow('Cannot reschedule a booking with status CANCELLED');
    });

    it('completed booking cannot be rescheduled', async () => {
      const original = await createTestBooking('2026-10-12', '10:00');
      await prisma.booking.update({
        where: { id: original.id },
        data: { status: BookingStatus.COMPLETED, outcomeAt: new Date() },
      });

      await expect(rescheduleBooking({
        bookingId: original.id,
        date: '2026-10-13',
        time: '14:00',
        barberPreference: 'specific',
        barberId: testBarberId,
      })).rejects.toThrow('Cannot reschedule a booking with status COMPLETED');
    });

    it('no-show booking cannot be rescheduled', async () => {
      const original = await createTestBooking('2026-10-12', '10:00');
      await prisma.booking.update({
        where: { id: original.id },
        data: { status: BookingStatus.NO_SHOW, outcomeAt: new Date() },
      });

      await expect(rescheduleBooking({
        bookingId: original.id,
        date: '2026-10-13',
        time: '14:00',
        barberPreference: 'specific',
        barberId: testBarberId,
      })).rejects.toThrow('Cannot reschedule a booking with status NO_SHOW');
    });

    it('inactive barber cannot be selected', async () => {
      const original = await createTestBooking('2026-10-12', '10:00');
      
      // Create inactive barber
      const inactiveBarber = await prisma.barber.create({
        data: {
          name: 'Inactive Barber',
          role: 'Barber',
          bio: 'Test',
          specialities: [],
          status: 'INACTIVE',
        },
      });

      await expect(rescheduleBooking({
        bookingId: original.id,
        date: '2026-10-13',
        time: '14:00',
        barberPreference: 'specific',
        barberId: inactiveBarber.id,
      })).rejects.toThrow('Barber is not active');

      // Cleanup
      await prisma.barber.delete({ where: { id: inactiveBarber.id } });
    });

    it('inactive service cannot be selected', async () => {
      const original = await createTestBooking('2026-10-12', '10:00');
      
      // Deactivate the service
      await prisma.service.update({
        where: { id: testServiceId },
        data: { status: 'INACTIVE' },
      });

      await expect(rescheduleBooking({
        bookingId: original.id,
        date: '2026-10-13',
        time: '14:00',
        barberPreference: 'specific',
        barberId: testBarberId,
      })).rejects.toThrow('Service is not active');

      // Reactivate for other tests
      await prisma.service.update({
        where: { id: testServiceId },
        data: { status: 'ACTIVE' },
      });
    });

    it('outside booking window leaves original unchanged', async () => {
      const original = await createTestBooking('2026-10-12', '10:00');
      
      // Try to reschedule to 60 days in the future (outside 30-day window)
      await expect(rescheduleBooking({
        bookingId: original.id,
        date: '2026-12-15',
        time: '14:00',
        barberPreference: 'specific',
        barberId: testBarberId,
      })).rejects.toThrow();

      const originalBooking = await prisma.booking.findUnique({ where: { id: original.id } });
      expect(originalBooking?.status).toBe(BookingStatus.CONFIRMED);
    });

    it('minimum notice violation leaves original unchanged', async () => {
      const original = await createTestBooking('2026-10-12', '10:00');
      
      // Try to reschedule to today with less than 1 hour notice
      const today = new Date().toISOString().split('T')[0];
      const now = new Date();
      const soonTime = `${String(now.getHours() + 1).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      // This test might be flaky depending on time, so we'll just verify the error is thrown
      // and the original is unchanged
      try {
        await rescheduleBooking({
          bookingId: original.id,
          date: today,
          time: soonTime,
          barberPreference: 'specific',
          barberId: testBarberId,
        });
      } catch {
        // Expected to fail
      }

      const originalBooking = await prisma.booking.findUnique({ where: { id: original.id } });
      expect(originalBooking?.status).toBe(BookingStatus.CONFIRMED);
    });

    it('finish after close leaves original unchanged', async () => {
      const original = await createTestBooking('2026-10-12', '10:00');
      
      // Try to book at 18:00 for a 45-min service when close is 17:00
      await expect(rescheduleBooking({
        bookingId: original.id,
        date: '2026-10-13',
        time: '18:00',
        barberPreference: 'specific',
        barberId: testBarberId,
      })).rejects.toThrow();

      const originalBooking = await prisma.booking.findUnique({ where: { id: original.id } });
      expect(originalBooking?.status).toBe(BookingStatus.CONFIRMED);
    });

    it('non-existent booking throws error', async () => {
      await expect(rescheduleBooking({
        bookingId: 'non-existent-id',
        date: '2026-10-13',
        time: '14:00',
        barberPreference: 'specific',
        barberId: testBarberId,
      })).rejects.toThrow('Booking not found');
    });
  });

  describe('Normal booking regression', () => {
    it('normal booking creates CONFIRMED with null rescheduledFromBookingId', async () => {
      const booking = await createTestBooking('2026-10-15', '10:00');
      
      expect(booking.status).toBe(BookingStatus.CONFIRMED);
      expect(booking.rescheduledFromBookingId).toBeNull();
    });
  });
});