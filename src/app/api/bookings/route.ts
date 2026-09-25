import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import type { Prisma } from '@prisma/client';
import { validateBookingRequest, validateBookingTimeRules, BookingRequest } from '@/lib/booking/validation';
import { getServiceByIdChecked, getBarberByIdChecked } from '@/lib/booking/validation';
import { createLusakaDate, lusakaDateToUtc, formatLusakaTime, formatLusakaDate } from '@/lib/booking/timezone';

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

    const [year, month, day] = date.split('-').map(Number);
    const lusakaDate = createLusakaDate(year, month, day);
    const [hours, minutes] = time.split(':').map(Number);
    const lusakaStartAt = createLusakaDate(year, month, day, hours, minutes);
    const lusakaEndAt = new Date(lusakaStartAt.getTime() + getServiceByIdChecked(serviceId).durationMinutes * 60 * 1000);

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

    const startAtUtc = lusakaDateToUtc(lusakaStartAt);
    const endAtUtc = lusakaDateToUtc(lusakaEndAt);

    const result = await prisma.$transaction(async (tx) => {
      const existingBookings = await tx.booking.findMany({
        where: {
          status: 'confirmed',
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
        const allBarbers = await tx.barber.findMany();
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
          status: 'confirmed',
        },
      });

      return { booking, selectedBarberId };
    });

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
        date: formatLusakaDate(lusakaDate),
        startTime: time,
        endTime: formatLusakaTime(lusakaEndAt),
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