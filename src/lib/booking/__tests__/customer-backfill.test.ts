import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getPrisma } from '@/lib/prisma/client';
import { canonicalizePhone } from '@/lib/utils/phone';
import { BookingStatus } from '@prisma/client';

describe('Customer Backfill', () => {
  const prisma = getPrisma();

  beforeAll(async () => {
    await prisma.booking.deleteMany({ 
      where: { customerName: { startsWith: 'Backfill ' } } 
    });
    await prisma.customer.deleteMany({ 
      where: { name: { startsWith: 'Backfill ' } } 
    });
  });

  afterAll(async () => {
    await prisma.booking.deleteMany({ 
      where: { customerName: { startsWith: 'Backfill ' } } 
    });
    await prisma.customer.deleteMany({ 
      where: { name: { startsWith: 'Backfill ' } } 
    });
    await prisma.$disconnect();
  });

  it('backfill creates customers and links bookings', async () => {
    const bookings = await Promise.all([
      prisma.booking.create({
        data: {
          reference: 'GRD-TEST01',
          serviceId: 'signature-cut',
          barberId: 'mwila-banda',
          startAt: new Date('2026-10-12T10:00:00Z'),
          endAt: new Date('2026-10-12T10:45:00Z'),
          customerName: 'Backfill Test User 1',
          customerPhone: '+260 97 111 1111',
          customerEmail: 'backfill1@example.com',
          status: BookingStatus.CONFIRMED,
        },
      }),
      prisma.booking.create({
        data: {
          reference: 'GRD-TEST02',
          serviceId: 'skin-fade',
          barberId: 'chanda-mulenga',
          startAt: new Date('2026-10-12T14:00:00Z'),
          endAt: new Date('2026-10-12T14:45:00Z'),
          customerName: 'Backfill Test User 2',
          customerPhone: '097 222 2222',
          customerEmail: 'backfill2@example.com',
          status: BookingStatus.CONFIRMED,
        },
      }),
      prisma.booking.create({
        data: {
          reference: 'GRD-TEST03',
          serviceId: 'signature-cut',
          barberId: 'kondwani-phiri',
          startAt: new Date('2026-10-12T15:00:00Z'),
          endAt: new Date('2026-10-12T15:45:00Z'),
          customerName: 'Backfill Test User 1',
          customerPhone: '+260971111111',
          customerEmail: 'backfill3@example.com',
          status: BookingStatus.CONFIRMED,
        },
      }),
    ]);

    const phoneToCustomerId = new Map<string, string>();

    for (const booking of bookings) {
      const canonicalPhone = canonicalizePhone(booking.customerPhone);

      const customer = await prisma.customer.findUnique({
        where: { canonicalPhone: booking.customerPhone },
      });

      if (!customer) {
        const newCustomer = await prisma.customer.create({
          data: {
            name: booking.customerName,
            canonicalPhone,
            email: booking.customerEmail,
          },
        });
        phoneToCustomerId.set(canonicalPhone, newCustomer.id);
        await prisma.booking.update({
          where: { id: booking.id },
          data: { customerId: newCustomer.id },
        });
      } else {
        phoneToCustomerId.set(canonicalPhone, customer.id);
        await prisma.booking.update({
          where: { id: booking.id },
          data: { customerId: customer.id },
        });
      }
    }

    const bookingsWithCustomer = await prisma.booking.findMany({
      where: { reference: { startsWith: 'GRD-TEST' } },
      include: { customer: true },
    });

    expect(bookingsWithCustomer.length).toBe(3);
    expect(bookingsWithCustomer.every((b) => b.customerId !== null)).toBe(true);

    const booking1 = bookingsWithCustomer.find((b) => b.reference === 'GRD-TEST01')!;
    const booking3 = bookingsWithCustomer.find((b) => b.reference === 'GRD-TEST03')!;
    expect(booking1.customerId).toBe(booking3.customerId);

    const booking2 = bookingsWithCustomer.find((b) => b.reference === 'GRD-TEST02')!;
    expect(booking2.customerId).not.toBe(booking1.customerId);
  });

  it('same email + different phone -> different customers', async () => {
    const phone1 = '+260975555555';
    const phone2 = '+260976666666';
    const email = 'shared@example.com';

    const customer1 = await prisma.customer.create({
      data: { name: 'Test User 1', canonicalPhone: phone1, email },
    });

    const customer2 = await prisma.customer.create({
      data: { name: 'Test User 2', canonicalPhone: phone2, email },
    });

    expect(customer1.id).not.toBe(customer2.id);
    expect(customer1.email).toBe(customer2.email);
  });
});