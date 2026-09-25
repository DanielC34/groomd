import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { getAvailabilityForDate } from '@/lib/booking/availability';
import { validateAvailabilityQuery, AvailabilityQuery } from '@/lib/booking/validation';
import { getNowInLusaka, createLusakaDate, startOfLusakaDay, addDays } from '@/lib/booking/timezone';
import { bookingConfig } from '@/lib/data/booking-config';

function parseQueryParams(searchParams: URLSearchParams): AvailabilityQuery {
  const barberId = searchParams.get('barberId');
  return validateAvailabilityQuery({
    serviceId: searchParams.get('serviceId'),
    barberPreference: searchParams.get('barberPreference'),
    barberId: barberId ?? null,
    date: searchParams.get('date'),
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = parseQueryParams(searchParams);

    const [year, month, day] = query.date.split('-').map(Number);
    const selectedDate = createLusakaDate(year, month, day);
    const now = getNowInLusaka();

    const startDate = startOfLusakaDay(now);
    const maxDate = addDays(startDate, bookingConfig.maxBookingWindowDays);

    if (selectedDate < startDate || selectedDate > maxDate) {
      return NextResponse.json(
        { error: `Booking window is today through ${bookingConfig.maxBookingWindowDays} days ahead.` },
        { status: 400 }
      );
    }

    const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long', timeZone: bookingConfig.timezone });
    if (dayOfWeek === 'Sunday') {
      return NextResponse.json(
        {
          date: query.date,
          dayOfWeek: 'Sunday',
          status: 'closed',
          slots: [],
        },
        { status: 200 }
      );
    }

    const startOfDay = startOfLusakaDay(selectedDate);
    const endOfDay = addDays(startOfDay, 1);

    const existingBookings = await prisma.booking.findMany({
      where: {
        status: 'confirmed',
        startAt: { gte: startOfDay },
        endAt: { lt: endOfDay },
      },
      select: {
        startAt: true,
        endAt: true,
        barberId: true,
      },
    });

    const availability = getAvailabilityForDate(
      query.serviceId,
      query.barberPreference,
      query.barberId,
      selectedDate,
      existingBookings,
      now
    );

    return NextResponse.json(availability, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request parameters', details: error.message },
        { status: 400 }
      );
    }
    if (error instanceof Error && error.message === 'Service not found') {
      return NextResponse.json({ error: 'Unknown service' }, { status: 404 });
    }
    console.error('Availability API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}