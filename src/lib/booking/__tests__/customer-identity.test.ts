import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getPrisma } from '@/lib/prisma/client';

describe('Customer Identity', () => {
  const prisma = getPrisma();

  beforeAll(async () => {
    await prisma.booking.deleteMany({ 
      where: { customerName: { startsWith: 'Test ' } } 
    });
    await prisma.customer.deleteMany({ 
      where: { name: { startsWith: 'Test ' } } 
    });
  });

  afterAll(async () => {
    await prisma.booking.deleteMany({ 
      where: { customerName: { startsWith: 'Test ' } } 
    });
    await prisma.customer.deleteMany({ 
      where: { name: { startsWith: 'Test ' } } 
    });
    await prisma.$disconnect();
  });

  it('same canonical phone -> same Customer', async () => {
    const phone1 = '+260971234567';
    const phone2 = '097 123 4567';

    const customer1 = await prisma.customer.create({
      data: { name: 'Test User', canonicalPhone: phone1, email: 'test1@example.com' },
    });

    const customer2 = await prisma.customer.upsert({
      where: { canonicalPhone: phone2 },
      update: { name: 'Test User 2', email: 'test2@example.com' },
      create: { name: 'Test User 2', canonicalPhone: phone2, email: 'test2@example.com' },
    });

    expect(customer2.id).toBe(customer1.id);
    expect(customer2.name).toBe('Test User 2');
    expect(customer2.email).toBe('test2@example.com');
  });

  it('different canonical phone -> different Customer', async () => {
    const phone1 = '+260971111111';
    const phone2 = '+260972222222';

    const customer1 = await prisma.customer.create({
      data: { name: 'Test User 1', canonicalPhone: phone1 },
    });

    const customer2 = await prisma.customer.create({
      data: { name: 'Test User 2', canonicalPhone: phone2 },
    });

    expect(customer1.id).not.toBe(customer2.id);
    expect(customer1.canonicalPhone).toBe('+260971111111');
    expect(customer2.canonicalPhone).toBe('+260972222222');
  });

  it('same email + different phone -> different customers', async () => {
    const phone1 = '+260973333333';
    const phone2 = '+260974444444';
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