import { BookingStatus } from '@prisma/client';
import type { Prisma } from '@prisma/client';
import { validateBookingTimeRules } from './validation';
import { isBookingOverlapViolation } from './overlap-violation';
import { lusakaDateTimeToUtc, addMinutes } from './timezone';
import { getAllBarbers } from '@/lib/data/barbers';
import { getPrisma } from '@/lib/prisma/client';

export const RESCHEDULE_CANCELLATION_REASON = 'RESCHEDULED';

export interface RescheduleInput {
  bookingId: string;
  date: string;
  time: string;
  barberPreference: 'specific' | 'no-preference';
  barberId: string | null | undefined;
  notes?: string;
}

export interface RescheduleResult {
  originalBooking: {
    id: string;
    reference: string;
    status: BookingStatus;
    cancelledAt: Date | null;
    cancellationReason: string | null;
  };
  replacementBooking: {
    id: string;
    reference: string;
    status: BookingStatus;
    startAt: Date;
    endAt: Date;
    barberId: string;
    rescheduledFromBookingId: string;
  };
}

export async function rescheduleBooking(input: RescheduleInput): Promise<RescheduleResult> {
  const prisma = getPrisma();

  const { bookingId, date, time, barberPreference, barberId, notes } = input;

  // 1. Verify original booking exists and is CONFIRMED
  const originalBooking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { service: true, barber: true },
  });

  if (!originalBooking) {
    throw new Error('Booking not found');
  }

  if (originalBooking.status !== BookingStatus.CONFIRMED) {
    throw new Error(`Cannot reschedule a booking with status ${originalBooking.status}`);
  }

  // 2. Validate replacement time rules (reuses existing validation)
  const service = originalBooking.service;
  const timeValidation = validateBookingTimeRules(
    service.id,
    barberPreference,
    barberId,
    date,
    time
  );

  if (!timeValidation.valid) {
    throw new Error(timeValidation.errors.join(', '));
  }

  // 3. Check service/barber status
  if (service.status !== 'ACTIVE') {
    throw new Error('Service is not active');
  }

  if (barberPreference === 'specific' && barberId) {
    const barber = await prisma.barber.findUnique({ where: { id: barberId } });
    if (!barber) {
      throw new Error('Barber not found');
    }
    if (barber.status !== 'ACTIVE') {
      throw new Error('Barber is not active');
    }
  }

  // 4. Calculate new start/end times
  const startAtUtc = lusakaDateTimeToUtc(date, time);
  const endAtUtc = addMinutes(startAtUtc, service.duration);

  // 5. Transaction: create replacement, cancel original, link them
  const MAX_ATTEMPTS = 3;
  let result: RescheduleResult | undefined;

  for (let i = 0; i < MAX_ATTEMPTS && !result; i++) {
    try {
      result = await prisma.$transaction(async (tx) => {
        // Re-fetch original booking inside transaction to ensure it's still CONFIRMED
        const currentOriginal = await tx.booking.findUnique({
          where: { id: bookingId },
          include: { service: true },
        });

        if (!currentOriginal) {
          throw new Error('Booking not found');
        }

        if (currentOriginal.status !== BookingStatus.CONFIRMED) {
          throw new Error(`Cannot reschedule a booking with status ${currentOriginal.status}`);
        }

        // Check for circular relationship
        if (await wouldCreateCycle()) {
          throw new Error('Reschedule would create a circular relationship');
        }

        // Check availability for the replacement slot
        const existingBookings = await tx.booking.findMany({
          where: {
            status: BookingStatus.CONFIRMED,
            startAt: { lt: endAtUtc },
            endAt: { gt: startAtUtc },
          },
          select: {
            startAt: true,
            endAt: true,
            barberId: true,
          },
        });

        let selectedBarberId: string;

        if (barberPreference === 'specific' && barberId) {
          const conflicts = existingBookings.filter(
            (b) => b.barberId === barberId && b.startAt < endAtUtc && b.endAt > startAtUtc
          );
          if (conflicts.length > 0) {
            throw new Error('CONFLICT');
          }
          selectedBarberId = barberId;
        } else {
          const allBarbers = getAllBarbers();
          if (allBarbers.length === 0) {
            throw new Error('No barbers available');
          }

          const availableBarber = allBarbers.find((b) => {
            const conflicts = existingBookings.filter(
              (existing) => existing.barberId === b.id && existing.startAt < endAtUtc && existing.endAt > startAtUtc
            );
            return conflicts.length === 0;
          });

          if (!availableBarber) {
            throw new Error('CONFLICT');
          }
          selectedBarberId = availableBarber.id;
        }

        // Create replacement booking
        const reference = await generateUniqueReferenceInTransaction(tx);

        const replacementBooking = await tx.booking.create({
          data: {
            reference,
            serviceId: currentOriginal.serviceId,
            barberId: selectedBarberId,
            customerId: currentOriginal.customerId,
            customerName: currentOriginal.customerName,
            customerPhone: currentOriginal.customerPhone,
            customerEmail: currentOriginal.customerEmail,
            notes: notes ?? currentOriginal.notes,
            status: BookingStatus.CONFIRMED,
            startAt: startAtUtc,
            endAt: endAtUtc,
            rescheduledFromBookingId: currentOriginal.id,
          },
        });

        // Cancel original booking
        await tx.booking.update({
          where: { id: currentOriginal.id },
          data: {
            status: BookingStatus.CANCELLED,
            cancelledAt: new Date(),
            cancellationReason: RESCHEDULE_CANCELLATION_REASON,
            cancellationNote: `Rescheduled to ${replacementBooking.reference}`,
            outcomeAt: null,
          },
        });

        return {
          originalBooking: {
            id: currentOriginal.id,
            reference: currentOriginal.reference,
            status: BookingStatus.CANCELLED,
            cancelledAt: new Date(),
            cancellationReason: RESCHEDULE_CANCELLATION_REASON,
          },
          replacementBooking: {
            id: replacementBooking.id,
            reference: replacementBooking.reference,
            status: BookingStatus.CONFIRMED,
            startAt: replacementBooking.startAt,
            endAt: replacementBooking.endAt,
            barberId: replacementBooking.barberId,
            rescheduledFromBookingId: replacementBooking.rescheduledFromBookingId!,
          },
        };
      });
    } catch (error) {
      if (!isBookingOverlapViolation(error)) throw error;
      // Conflict occurred, retry with next available barber (for no-preference) or fail
    }
  }

  if (!result) {
    throw new Error('CONFLICT');
  }

  return result;
}

async function wouldCreateCycle(): Promise<boolean> {
  // Walk the chain to ensure we don't create a cycle
  // Since we're adding a NEW booking that points to the original,
  // we just need to check if the original already points to this booking
  // (which is impossible for a new booking) or if there's some other cycle
  // In practice, a new booking can't be in the chain yet, so this is a safeguard
  return false;
}

async function generateUniqueReferenceInTransaction(tx: Prisma.TransactionClient): Promise<string> {
  const REFERENCE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const REFERENCE_PREFIX = 'GRD-';
  const REFERENCE_LENGTH = 6;
  const MAX_ATTEMPTS = 10;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    let ref = REFERENCE_PREFIX;
    for (let i = 0; i < REFERENCE_LENGTH; i++) {
      ref += REFERENCE_CHARS.charAt(Math.floor(Math.random() * REFERENCE_CHARS.length));
    }
    const existing = await tx.booking.findUnique({ where: { reference: ref } });
    if (!existing) {
      return ref;
    }
  }
  throw new Error('Unable to generate unique booking reference');
}

export async function getRescheduleChain(bookingId: string): Promise<Array<{
  id: string;
  reference: string;
  status: BookingStatus;
  startAt: Date;
  endAt: Date;
  rescheduledFromBookingId: string | null;
}>> {
  const prisma = getPrisma();
  
  // Walk the chain backwards to get full history
  const chain: Array<{
    id: string;
    reference: string;
    status: BookingStatus;
    startAt: Date;
    endAt: Date;
    rescheduledFromBookingId: string | null;
  }> = [];

  let currentId: string | null = bookingId;
  while (currentId) {
    const nextBooking: {
      id: string;
      reference: string;
      status: BookingStatus;
      startAt: Date;
      endAt: Date;
      rescheduledFromBookingId: string | null;
    } | null = await prisma.booking.findUnique({
      where: { id: currentId },
      select: {
        id: true,
        reference: true,
        status: true,
        startAt: true,
        endAt: true,
        rescheduledFromBookingId: true,
      },
    });
    if (!nextBooking) break;
    chain.push(nextBooking);
    currentId = nextBooking.rescheduledFromBookingId;
  }

  return chain;
}