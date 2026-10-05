import { NextRequest, NextResponse } from 'next/server';
import { rescheduleBooking, RescheduleInput } from '@/lib/booking/reschedule';
import { isBookingOverlapViolation } from '@/lib/booking/overlap-violation';

export async function POST(request: NextRequest) {
  try {
    let body: RescheduleInput;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const { bookingId, date, time, barberPreference, barberId, notes } = body;

    if (!bookingId || !date || !time || !barberPreference) {
      return NextResponse.json(
        { error: 'Missing required fields: bookingId, date, time, barberPreference' },
        { status: 400 }
      );
    }

    if (barberPreference !== 'specific' && barberPreference !== 'no-preference') {
      return NextResponse.json(
        { error: 'barberPreference must be "specific" or "no-preference"' },
        { status: 400 }
      );
    }

    if (barberPreference === 'specific' && !barberId) {
      return NextResponse.json(
        { error: 'barberId is required when barberPreference is "specific"' },
        { status: 400 }
      );
    }

    const result = await rescheduleBooking({
      bookingId,
      date,
      time,
      barberPreference,
      barberId: barberId ?? null,
      notes,
    });

    return NextResponse.json(
      {
        originalBooking: {
          id: result.originalBooking.id,
          reference: result.originalBooking.reference,
          status: result.originalBooking.status,
          cancelledAt: result.originalBooking.cancelledAt,
          cancellationReason: result.originalBooking.cancellationReason,
        },
        replacementBooking: {
          id: result.replacementBooking.id,
          reference: result.replacementBooking.reference,
          status: result.replacementBooking.status,
          startAt: result.replacementBooking.startAt.toISOString(),
          endAt: result.replacementBooking.endAt.toISOString(),
          barberId: result.replacementBooking.barberId,
          rescheduledFromBookingId: result.replacementBooking.rescheduledFromBookingId,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'CONFLICT' || isBookingOverlapViolation(error)) {
        return NextResponse.json(
          { error: 'The selected time is no longer available. Please choose another time.' },
          { status: 409 }
        );
      }
      if (error.message === 'Booking not found') {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        );
      }
      if (error.message.includes('Cannot reschedule')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
      if (error.message.includes('validation') || error.message.includes('Invalid')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
      if (error.message === 'No barbers available') {
        return NextResponse.json(
          { error: 'No barbers available for the selected time.' },
          { status: 409 }
        );
      }
    }
    console.error('Reschedule API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}