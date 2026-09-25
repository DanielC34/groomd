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

async function main() {
  const prisma = getPrisma();

  for (const s of getAllServices()) {
    const data = {
      name: s.name,
      description: s.description,
      price: s.price * 100, // schema stores minor units (ngwee): K 220 -> 22000
      duration: s.durationMinutes,
      category: s.category,
    };
    await prisma.service.upsert({ where: { id: s.id }, update: data, create: { id: s.id, ...data } });
  }

  for (const b of getAllBarbers()) {
    const data = { name: b.name, role: b.role, bio: b.bio, specialities: b.specialities };
    await prisma.barber.upsert({ where: { id: b.id }, update: data, create: { id: b.id, ...data } });
  }

  console.log(`Seeded ${getAllServices().length} services and ${getAllBarbers().length} barbers.`);
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  process.exit(1);
});
