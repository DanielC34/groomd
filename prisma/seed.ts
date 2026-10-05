/**
 * Seeds the Service and Barber catalogue tables from the authoritative static
 * catalogue in src/lib/data, using the SAME ids the application uses.
 * Idempotent: safe to run on every deploy.
 *
 *   npm run db:seed        (or: npx prisma db seed)
 */
import { getPrisma } from '../src/lib/prisma/client';
import { getAllServices } from '../src/lib/data/services';
import { getAllBarbers } from '../src/lib/data/barbers';
import { ServiceStatus, BarberStatus } from '@prisma/client';

async function main() {
  const prisma = getPrisma();

  for (const s of getAllServices()) {
    const data = {
      name: s.name,
      description: s.description,
      price: s.price * 100, // schema stores minor units (ngwee): K 220 -> 22000
      duration: s.durationMinutes,
      category: s.category,
      status: ServiceStatus.ACTIVE,
    };
    await prisma.service.upsert({ where: { id: s.id }, update: data, create: { id: s.id, ...data } });
  }

  for (const b of getAllBarbers()) {
    const data = { name: b.name, role: b.role, bio: b.bio, specialities: b.specialities, status: BarberStatus.ACTIVE };
    await prisma.barber.upsert({ where: { id: b.id }, update: data, create: { id: b.id, ...data } });
  }

  // Seed initial BusinessHours (0=Sunday, 1=Monday, ..., 6=Saturday)
  const businessHours = [
    { dayOfWeek: 0, isClosed: true, openMinute: null, closeMinute: null },     // Sunday
    { dayOfWeek: 1, openMinute: 540, closeMinute: 1080, isClosed: false },      // Monday 09:00-18:00
    { dayOfWeek: 2, openMinute: 540, closeMinute: 1080, isClosed: false },      // Tuesday 09:00-18:00
    { dayOfWeek: 3, openMinute: 540, closeMinute: 1080, isClosed: false },      // Wednesday 09:00-18:00
    { dayOfWeek: 4, openMinute: 540, closeMinute: 1080, isClosed: false },      // Thursday 09:00-18:00
    { dayOfWeek: 5, openMinute: 540, closeMinute: 1080, isClosed: false },      // Friday 09:00-18:00
    { dayOfWeek: 6, openMinute: 480, closeMinute: 960, isClosed: false },       // Saturday 08:00-16:00
  ];

  for (const bh of businessHours) {
    await prisma.businessHours.upsert({
      where: { dayOfWeek: bh.dayOfWeek },
      update: bh,
      create: bh,
    });
  }

  console.log(`Seeded ${getAllServices().length} services, ${getAllBarbers().length} barbers, and 7 business hours.`);
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  process.exit(1);
});
