import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma/client';
import { getAvailabilityForDate } from '@/lib/booking/availability';
import { validateAvailabilityQuery, AvailabilityQuery } from '@/lib/booking/validation';
import { getNowInLusaka, lusakaDateTimeToUtc, todayLusakaYmd, addDaysYmd, addDays, dayOfWeekYmd } from '@/lib/booking/timezone';
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

    const now = getNowInLusaka();
    const todayYmd = todayLusakaYmd(now);
    const maxYmd = addDaysYmd(todayYmd, bookingConfig.maxBookingWindowDays);

    // YYYY-MM-DD strings compare correctly as text.
    if (query.date < todayYmd || query.date > maxYmd) {
      return NextResponse.json(
        { error: `Booking window is today through ${bookingConfig.maxBookingWindowDays} days ahead.` },
        { status: 400 }
      );
    }

    if (dayOfWeekYmd(query.date) === 'Sunday') {
      return NextResponse.json(
        { date: query.date, dayOfWeek: 'Sunday', status: 'closed', slots: [] },
        { status: 200 }
      );
    }

    // Lusaka day bounds as absolute instants.
    const startOfDay = lusakaDateTimeToUtc(query.date);
    const endOfDay = addDays(startOfDay, 1);

    // Fetch existing bookings from database, or use empty array if DB is unavailable.
    let existingBookings: Array<{ startAt: Date; endAt: Date; barberId: string }> = [];
    try {
      existingBookings = await getPrisma().booking.findMany({
        where: {
          status: 'confirmed',
          startAt: { lt: endOfDay },
          endAt: { gt: startOfDay },
        },
        select: { startAt: true, endAt: true, barberId: true },
      });
    } catch (prismaError) {
      // If database is not configured (e.g., missing DATABASE_URL), fall back to empty bookings.
      // This allows local development without a database.
      if (prismaError instanceof Error && prismaError.message.includes('DATABASE_URL is not set')) {
        existingBookings = [];
      } else {
        throw prismaError;
      }
    }

    const availability = getAvailabilityForDate(
      query.serviceId,
      query.barberPreference,
      query.barberId,
      startOfDay,
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
    if (error instanceof Error && error.message.startsWith('Service not found')) {
      return NextResponse.json({ error: 'Unknown service' }, { status: 404 });
    }
    console.error('Availability API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
