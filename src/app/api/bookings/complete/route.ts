import { NextRequest, NextResponse } from 'next/server';
import { requireStaffUser } from '@/lib/auth/middleware';
import { getPrisma } from '@/lib/prisma/client';
import { applyCompletion, canCompleteAt } from '@/lib/booking/lifecycle';
import { BookingStatus } from '@prisma/client';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireStaffUser();
    const appointmentId = params.id;

    const booking = await getPrisma().booking.findUnique({
      where: { id: appointmentId },
      include: {
        service: true,
        barber: true,
        customer: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Only confirmed bookings can be completed
    if (booking.status !== BookingStatus.CONFIRMED) {
      const statusName = BookingStatus[booking.status as keyof typeof BookingStatus];
      return NextResponse.json(
        { error: `Cannot complete appointment with status: ${statusName}` },
        { status: 400 }
      );
    }

    // Validate that the appointment has ended
    const now = new Date();
    if (!canCompleteAt(booking, now)) {
      return NextResponse.json(
        { error: 'Booking cannot be completed before its scheduled end time' },
        { status: 400 }
      );
    }

    // Apply completion using the existing lifecycle utility
    const updatedBooking = { ...booking };
    applyCompletion(updatedBooking, now);

    // Update the database
    const result = await getPrisma().booking.update({
      where: { id: appointmentId },
      data: {
        status: BookingStatus.COMPLETED,
        outcomeAt: updatedBooking.outcomeAt,
        cancelledAt: null,
        cancellationReason: null,
        cancellationNote: null,
      },
      include: {
        service: true,
        barber: true,
        customer: true,
      },
    });

    return NextResponse.json({
      success: true,
      appointment: {
        id: result.id,
        reference: result.reference,
        status: result.status,
        outcomeAt: result.outcomeAt,
        statusLabel: BookingStatus[result.status as keyof typeof BookingStatus],
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Complete appointment error:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}