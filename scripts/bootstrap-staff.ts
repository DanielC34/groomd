#!/usr/bin/env node

/**
 * Staff Bootstrap Script
 * 
 * Creates the first staff user for a new Groomd deployment.
 * Requires STAFF_BOOTSTRAP_SECRET environment variable.
 * Refuses to run if an active StaffUser already exists.
 * 
 * Usage:
 *   STAFF_BOOTSTRAP_SECRET=your-secret npx tsx scripts/bootstrap-staff.ts email@example.com "Password123"
 */

import { getPrisma } from '../src/lib/prisma/client';
import { hashPassword } from '../src/lib/auth/password';
import { StaffStatus } from '@prisma/client';

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('Usage: STAFF_BOOTSTRAP_SECRET=secret npx tsx scripts/bootstrap-staff.ts <email> <password>');
    process.exit(1);
  }

  const bootstrapSecret = process.env.STAFF_BOOTSTRAP_SECRET;
  if (!bootstrapSecret) {
    console.error('Error: STAFF_BOOTSTRAP_SECRET environment variable is required');
    process.exit(1);
  }

  const [email, password] = args;
  
  if (!email || !email.includes('@')) {
    console.error('Error: Valid email is required');
    process.exit(1);
  }

  if (!password || password.length < 12) {
    console.error('Error: Password must be at least 12 characters');
    process.exit(1);
  }

  const prisma = getPrisma();

  const activeCount = await prisma.staffUser.count({
    where: { status: 'ACTIVE' },
  });

  if (activeCount > 0) {
    console.error('Error: An active staff user already exists. Bootstrap not allowed.');
    process.exit(1);
  }

  const normalizedEmail = email.trim().toLowerCase();
  
  const existing = await prisma.staffUser.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    console.error('Error: A staff user with this email already exists');
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);

  const staffUser = await prisma.staffUser.create({
    data: {
      email: normalizedEmail,
      passwordHash,
      status: StaffStatus.ACTIVE,
    },
  });

  console.log('Successfully created first staff user:');
  console.log(`  ID: ${staffUser.id}`);
  console.log(`  Email: ${staffUser.email}`);
  console.log(`  Status: ${staffUser.status}`);
  console.log(`  Created: ${staffUser.createdAt.toISOString()}`);
  
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error('Bootstrap failed:', err);
  process.exit(1);
});