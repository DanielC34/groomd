import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma/client';
import { getAllBarbers } from '@/lib/data/barbers';
import type { Prisma } from '@prisma/client';
import { BookingStatus } from '@prisma/client';
import { validateBookingRequest, validateBookingTimeRules, BookingRequest } from '@/lib/booking/validation';
import { getServiceByIdChecked, getBarberByIdChecked } from '@/lib/booking/validation';
import { isBookingOverlapViolation } from '@/lib/booking/overlap-violation';
import { lusakaDateTimeToUtc, addMinutes, formatLusakaTime, formatLusakaDate } from '@/lib/booking/timezone';

type TransactionClient = Prisma.TransactionClient;

export async function POST(request: NextRequest) {
  try {
    let body: BookingRequest;
    try {
      body = validateBookingRequest(await request.json());
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return NextResponse.json(
          { error: 'Validation failed', details: error.message },
          { status: 400 }
        );
      }
      throw error;
    }

    const { serviceId, barberPreference, barberId, date, time, customerName, customerPhone, customerEmail, notes } = body;

    const timeValidation = validateBookingTimeRules(serviceId, barberPreference, barberId, date, time);
    if (!timeValidation.valid) {
      return NextResponse.json(
        { error: 'Booking time validation failed', details: timeValidation.errors },
        { status: 400 }
      );
    }

    const service = getServiceByIdChecked(serviceId);

    if (barberPreference === 'specific' && barberId) {
      getBarberByIdChecked(barberId);
    }

    // Absolute instants: `time` is Lusaka wall-clock time; duration is plain arithmetic.
    const startAtUtc = lusakaDateTimeToUtc(date, time);
    const endAtUtc = addMinutes(startAtUtc, service.durationMinutes);

    // The availability check below is not exclusive under READ COMMITTED: two simultaneous
    // requests can both pass it. The "Booking_barber_no_overlap" exclusion constraint makes
    // PostgreSQL reject the loser (23P01). We then re-run the transaction: a specific-barber
    // request now sees the conflict (409); a no-preference request moves to the next free barber.
    const MAX_ATTEMPTS = 3;
    let result: Awaited<ReturnType<typeof attempt>> | undefined;
    for (let i = 0; i < MAX_ATTEMPTS && !result; i++) {
      try {
        result = await attempt();
      } catch (error) {
        if (!isBookingOverlapViolation(error)) throw error;
      }
    }
    if (!result) throw new Error('CONFLICT');

    async function attempt() {
      return getPrisma().$transaction(async (tx) => {
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
        // Same deterministic order as the availability engine ("first available barber").
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

      const reference = await generateUniqueReferenceInTransaction(tx);

      const booking = await tx.booking.create({
        data: {
          reference,
          serviceId: service.id,
          barberId: selectedBarberId,
          startAt: startAtUtc,
          endAt: endAtUtc,
          customerName,
          customerPhone,
          customerEmail,
          notes: notes ?? null,
          status: BookingStatus.CONFIRMED,
        },
      });

      return { booking, selectedBarberId };
      });
    }

    return NextResponse.json(
      {
        reference: result.booking.reference,
        service: {
          id: service.id,
          name: service.name,
          price: service.price,
          durationMinutes: service.durationMinutes,
        },
        barber: {
          id: result.selectedBarberId,
        },
        date: formatLusakaDate(startAtUtc),
        startTime: formatLusakaTime(startAtUtc),
        endTime: formatLusakaTime(endAtUtc),
        startAt: startAtUtc.toISOString(),
        endAt: endAtUtc.toISOString(),
        customerName,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'CONFLICT') {
      return NextResponse.json(
        { error: 'The selected time is no longer available. Please choose another time.' },
        { status: 409 }
      );
    }
    if (error instanceof Error && error.message === 'No barbers available') {
      return NextResponse.json(
        { error: 'No barbers available for the selected time.' },
        { status: 409 }
      );
    }
    console.error('Booking API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function generateUniqueReferenceInTransaction(tx: TransactionClient): Promise<string> {
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