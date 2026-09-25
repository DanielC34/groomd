import type { PrismaClient } from '@prisma/client';

const REFERENCE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const REFERENCE_PREFIX = 'GRD-';
const REFERENCE_LENGTH = 6;

export function generateBookingReference(): string {
  let result = REFERENCE_PREFIX;
  for (let i = 0; i < REFERENCE_LENGTH; i++) {
    result += REFERENCE_CHARS.charAt(Math.floor(Math.random() * REFERENCE_CHARS.length));
  }
  return result;
}

export function isValidReferenceFormat(reference: string): boolean {
  const regex = /^GRD-[A-HJ-NP-Z2-9]{6}$/;
  return regex.test(reference);
}

export async function generateUniqueReference(
  checkFn: (ref: string) => Promise<boolean>,
  maxAttempts = 10
): Promise<string> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const ref = generateBookingReference();
    const exists = await checkFn(ref);
    if (!exists) {
      return ref;
    }
  }
  throw new Error('Unable to generate unique booking reference after maximum attempts');
}

export interface BookingCreationInput {
  serviceId: string;
  barberPreference: 'specific' | 'no-preference';
  barberId?: string | null;
  startAt: Date; // Lusaka local time
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes?: string;
}

export interface BookingCreationResult {
  reference: string;
  serviceId: string;
  barberId: string;
  startAt: Date; // UTC
  endAt: Date;   // UTC
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes: string | null;
  status: 'confirmed';
}

export async function createBooking(
  input: BookingCreationInput,
  prisma: PrismaClient
): Promise<BookingCreationResult> {
  const service = await prisma.service.findUnique({ where: { id: input.serviceId } });
  if (!service) {
    throw new Error(`Service not found: ${input.serviceId}`);
  }

  let selectedBarberId: string;

  if (input.barberPreference === 'specific' && input.barberId) {
    const barber = await prisma.barber.findUnique({ where: { id: input.barberId } });
    if (!barber) {
      throw new Error(`Barber not found: ${input.barberId}`);
    }
    selectedBarberId = barber.id;
  } else {
    const allBarbers = await prisma.barber.findMany();
    if (allBarbers.length === 0) {
      throw new Error('No barbers available');
    }

    const availableBarber = await Promise.all(
      allBarbers.map(async (b) => {
        const conflicts = await prisma.booking.findMany({
          where: {
            barberId: b.id,
            startAt: { lt: input.startAt },
            endAt: { gt: input.startAt },
          },
        });
        return { barber: b, conflicts };
      })
    ).then((results) => results.find((r) => r.conflicts.length === 0)?.barber);

    if (!availableBarber) {
      throw new Error('No barbers available for the selected time');
    }
    selectedBarberId = availableBarber.id;
  }

  const startAtUtc = input.startAt;
  const endAtUtc = new Date(startAtUtc.getTime() + service.duration * 60 * 1000);

  const reference = await generateUniqueReference(
    async (ref) => {
      const existing = await prisma.booking.findUnique({ where: { reference: ref } });
      return !!existing;
    }
  );

  const booking = await prisma.booking.create({
    data: {
      reference,
      serviceId: service.id,
      barberId: selectedBarberId,
      startAt: startAtUtc,
      endAt: endAtUtc,
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      customerEmail: input.customerEmail,
      notes: input.notes ?? null,
      status: 'confirmed',
    },
  });

  return booking;
}