/**
 * Customer Backfill Script
 * 
 * Reads existing bookings, creates Customer records based on canonical phone,
 * and links bookings to their Customer records.
 * 
 * Run with: npx tsx scripts/backfill-customers.ts
 */

import { getPrisma } from '../src/lib/prisma/client';
import { canonicalizePhone } from '../src/lib/utils/phone';

async function main() {
  const prisma = getPrisma();
  
  console.log('Starting customer backfill...');
  
  // 1. Fetch all existing bookings with customer data
  const bookings = await prisma.booking.findMany({
    select: {
      id: true,
      customerName: true,
      customerPhone: true,
      customerEmail: true,
    },
  });
  
  console.log(`Found ${bookings.length} bookings to process`);
  
  // Track created customers and conflicts
  const phoneToCustomerId = new Map<string, string>();
  const conflicts: Array<{
    phone: string;
    existingName: string;
    newName: string;
    existingEmail: string | null;
    newEmail: string | null;
  }> = [];
  
  let created = 0;
  let linked = 0;
  let skipped = 0;
  
  for (const booking of bookings) {
    const canonicalPhone = canonicalizePhone(booking.customerPhone);
    
    // Skip if phone cannot be normalized (not a valid Zambian number)
    if (!/^\+260\d{9}$/.test(canonicalPhone)) {
      console.warn(`Warning: Cannot normalize phone "${booking.customerPhone}" for booking ${booking.id}`);
      skipped++;
      continue;
    }
    
    // Check if we already have a customer for this phone
    let customerId = phoneToCustomerId.get(canonicalPhone);
    
    if (!customerId) {
      // Check if customer already exists in DB
      const existingCustomer = await prisma.customer.findUnique({
        where: { canonicalPhone: canonicalPhone },
      });
      
      if (existingCustomer) {
        customerId = existingCustomer.id;
        phoneToCustomerId.set(canonicalPhone, customerId);
      } else {
        // Create new customer
        const customer = await prisma.customer.create({
          data: {
            name: booking.customerName,
            canonicalPhone: canonicalPhone,
            email: booking.customerEmail || null,
          },
        });
        customerId = customer.id;
        phoneToCustomerId.set(canonicalPhone, customerId);
        created++;
        console.log(`Created customer: ${customerId} (${canonicalPhone})`);
      }
    } else {
      // Customer exists, check for conflicts
      const existing = await prisma.customer.findUnique({
        where: { id: customerId },
      });
      
      if (existing) {
        // Check for conflicts
        const hasNameConflict = existing.name !== booking.customerName;
        const hasEmailConflict = existing.email !== booking.customerEmail && 
                                existing.email !== null && 
                                booking.customerEmail !== null &&
                                existing.email !== booking.customerEmail;
        
        if (hasNameConflict || hasEmailConflict) {
          conflicts.push({
            phone: phoneToCustomerId.get(canonicalPhone) || 'unknown',
            existingName: existing.name,
            newName: booking.customerName,
            existingEmail: existing.email,
            newEmail: booking.customerEmail,
          });
        }
      }
    }
    
    // Update the booking with customerId
    await prisma.booking.update({
      where: { id: booking.id },
      data: { customerId: customerId! },
    });
    
    linked++;
    
    if (linked % 50 === 0) {
      console.log(`Linked ${linked} bookings...`);
    }
  }
  
  console.log('\n--- Backfill Summary ---');
  console.log(`Total bookings processed: ${bookings.length}`);
  console.log(`Customers created: ${created}`);
  console.log(`Bookings linked: ${linked}`);
  console.log(`Skipped (invalid phone): ${skipped}`);
  console.log(`Conflicts found: ${conflicts.length}`);
  
  if (conflicts.length > 0) {
    console.log('\n--- Conflicts Found ---');
    for (const conflict of conflicts) {
      console.log(`Phone: ${conflict.phone}`);
      console.log(`  Existing name: "${conflict.existingName}" vs New: "${conflict.newName}"`);
      console.log(`  Existing email: "${conflict.existingEmail}" vs New: "${conflict.newEmail}"`);
    }
    console.log('\nThese conflicts need manual review.');
  }
  
  // Verify all bookings have customerId
  const unlinked = await prisma.booking.count({
    where: { customerId: null },
  });
  
  if (unlinked === 0) {
    console.log('\n✓ All bookings successfully linked to customers');
  } else {
    console.log(`\n⚠ ${unlinked} bookings still not linked`);
  }
  
  await prisma.$disconnect();
}

main()
  .catch(async (err) => {
    console.error('Backfill failed:', err);
    process.exit(1);
  });