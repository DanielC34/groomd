import { getPrisma } from '@/lib/prisma/client';
import { StaffStatus } from '@prisma/client';
import { hashPassword, verifyPassword, validatePassword } from './password';
import { generateSecureToken, hashToken, calculateExpiry, calculateExpiryHours, INVITATION_EXPIRY_DAYS, PASSWORD_RESET_EXPIRY_HOURS } from './tokens';

export { StaffStatus };

export interface CreateStaffUserInput {
  email: string;
  password: string;
  barberId?: string;
}

export interface StaffUserWithRelations {
  id: string;
  email: string;
  passwordHash: string;
  status: StaffStatus;
  barberId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deactivatedAt: Date | null;
  barber: { id: string; name: string } | null;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function createStaffUser(input: CreateStaffUserInput): Promise<StaffUserWithRelations> {
  const normalizedEmail = normalizeEmail(input.email);
  
  const validation = validatePassword(input.password);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const prisma = getPrisma();

  const existing = await prisma.staffUser.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    throw new Error('A staff user with this email already exists');
  }

  if (input.barberId) {
    const barber = await prisma.barber.findUnique({
      where: { id: input.barberId },
    });
    if (!barber) {
      throw new Error('Barber not found');
    }
    const existingLink = await prisma.staffUser.findUnique({
      where: { barberId: input.barberId },
    });
    if (existingLink) {
      throw new Error('This barber is already linked to a staff account');
    }
  }

  const passwordHash = await hashPassword(input.password);

  const staffUser = await prisma.staffUser.create({
    data: {
      email: normalizedEmail,
      passwordHash,
      barberId: input.barberId ?? null,
      status: 'ACTIVE',
    },
    include: {
      barber: { select: { id: true, name: true } },
    },
  });

  return staffUser;
}

export async function findStaffUserByEmail(email: string): Promise<StaffUserWithRelations | null> {
  const normalizedEmail = normalizeEmail(email);
  const prisma = getPrisma();

  return prisma.staffUser.findUnique({
    where: { email: normalizedEmail },
    include: {
      barber: { select: { id: true, name: true } },
    },
  });
}

export async function findStaffUserById(id: string): Promise<StaffUserWithRelations | null> {
  const prisma = getPrisma();

  return prisma.staffUser.findUnique({
    where: { id },
    include: {
      barber: { select: { id: true, name: true } },
    },
  });
}

export async function getActiveStaffCount(): Promise<number> {
  const prisma = getPrisma();
  return prisma.staffUser.count({
    where: { status: 'ACTIVE' },
  });
}

export async function setStaffUserStatus(
  id: string,
  status: StaffStatus,
  actingUserId?: string
): Promise<StaffUserWithRelations> {
  const prisma = getPrisma();

  const staffUser = await prisma.staffUser.findUnique({ where: { id } });
  if (!staffUser) {
    throw new Error('Staff user not found');
  }

  if (staffUser.id === actingUserId && status === 'INACTIVE') {
    const activeCount = await getActiveStaffCount();
    if (activeCount <= 1) {
      throw new Error('Cannot deactivate the last active staff user');
    }
  }

  const data: { status: StaffStatus; deactivatedAt?: Date | null } = {
    status,
    deactivatedAt: status === 'INACTIVE' ? new Date() : null,
  };

  const updated = await prisma.staffUser.update({
    where: { id },
    data,
    include: {
      barber: { select: { id: true, name: true } },
    },
  });

  return updated;
}

export async function linkBarber(staffUserId: string, barberId: string | null): Promise<StaffUserWithRelations> {
  const prisma = getPrisma();

  const staffUser = await prisma.staffUser.findUnique({ where: { id: staffUserId } });
  if (!staffUser) {
    throw new Error('Staff user not found');
  }

  if (barberId) {
    const barber = await prisma.barber.findUnique({ where: { id: barberId } });
    if (!barber) {
      throw new Error('Barber not found');
    }

    const existingLink = await prisma.staffUser.findUnique({
      where: { barberId },
    });
    if (existingLink && existingLink.id !== staffUserId) {
      throw new Error('This barber is already linked to another staff account');
    }
  }

  const updated = await prisma.staffUser.update({
    where: { id: staffUserId },
    data: { barberId: barberId ?? null },
    include: {
      barber: { select: { id: true, name: true } },
    },
  });

  return updated;
}

export async function verifyStaffCredentials(email: string, password: string): Promise<StaffUserWithRelations | null> {
  const staffUser = await findStaffUserByEmail(email);
  if (!staffUser) {
    return null;
  }

  if (staffUser.status !== 'ACTIVE') {
    return null;
  }

  const isValid = await verifyPassword(password, staffUser.passwordHash);
  if (!isValid) {
    return null;
  }

  return staffUser;
}

export async function updateStaffPassword(id: string, newPassword: string): Promise<void> {
  const validation = validatePassword(newPassword);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const passwordHash = await hashPassword(newPassword);
  const prisma = getPrisma();

  await prisma.staffUser.update({
    where: { id },
    data: { passwordHash },
  });
}

export async function createStaffInvitation(email: string): Promise<{ token: string; expiresAt: Date }> {
  const normalizedEmail = normalizeEmail(email);
  const prisma = getPrisma();

  const existingUser = await prisma.staffUser.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    if (existingUser.status === 'ACTIVE') {
      throw new Error('A staff user with this email already exists');
    }
    throw new Error('An inactive staff account exists with this email. Reactivation must be done explicitly.');
  }

  const existingInvitation = await prisma.staffInvitation.findFirst({
    where: {
      email: normalizedEmail,
      acceptedAt: null,
      expiresAt: { gt: new Date() },
    },
  });

  if (existingInvitation) {
    throw new Error('An active invitation already exists for this email');
  }

  const rawToken = generateSecureToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = calculateExpiry(INVITATION_EXPIRY_DAYS);

  await prisma.staffInvitation.create({
    data: {
      email: normalizedEmail,
      tokenHash,
      expiresAt,
    },
  });

  return { token: rawToken, expiresAt };
}

export async function acceptStaffInvitation(token: string, password: string): Promise<StaffUserWithRelations> {
  const validation = validatePassword(password);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const tokenHash = hashToken(token);
  const prisma = getPrisma();

  const invitation = await prisma.staffInvitation.findFirst({
    where: { tokenHash },
  });

  if (!invitation) {
    throw new Error('Invalid invitation');
  }

  if (invitation.acceptedAt) {
    throw new Error('This invitation has already been accepted');
  }

  if (invitation.expiresAt < new Date()) {
    throw new Error('This invitation has expired');
  }

  const existingUser = await prisma.staffUser.findUnique({
    where: { email: invitation.email },
  });

  if (existingUser) {
    if (existingUser.status === 'ACTIVE') {
      throw new Error('A staff user with this email already exists');
    }
    throw new Error('An inactive staff account exists with this email. Reactivation must be done explicitly.');
  }

  const passwordHash = await hashPassword(password);

  const staffUser = await prisma.$transaction(async (tx) => {
    const user = await tx.staffUser.create({
      data: {
        email: invitation.email,
        passwordHash,
        status: 'ACTIVE',
      },
      include: {
        barber: { select: { id: true, name: true } },
      },
    });

    await tx.staffInvitation.update({
      where: { id: invitation.id },
      data: { acceptedAt: new Date() },
    });

    return user;
  });

  return staffUser;
}

export async function createPasswordResetToken(email: string): Promise<{ token: string; expiresAt: Date } | null> {
  const normalizedEmail = normalizeEmail(email);
  const prisma = getPrisma();

  const user = await prisma.staffUser.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    return null;
  }

  const rawToken = generateSecureToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = calculateExpiryHours(PASSWORD_RESET_EXPIRY_HOURS);

  await prisma.passwordResetToken.create({
    data: {
      email: normalizedEmail,
      tokenHash,
      expiresAt,
    },
  });

  return { token: rawToken, expiresAt };
}

export async function validatePasswordResetToken(token: string): Promise<{ email: string; tokenHash: string } | null> {
  const tokenHash = hashToken(token);
  const prisma = getPrisma();

  const resetToken = await prisma.passwordResetToken.findFirst({
    where: { tokenHash },
  });

  if (!resetToken) {
    return null;
  }

  if (resetToken.usedAt) {
    return null;
  }

  if (resetToken.expiresAt < new Date()) {
    return null;
  }

  return { email: resetToken.email, tokenHash };
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  const validation = validatePassword(newPassword);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const tokenHash = hashToken(token);
  const prisma = getPrisma();

  const resetToken = await prisma.passwordResetToken.findFirst({
    where: { tokenHash },
  });

  if (!resetToken) {
    throw new Error('Invalid reset token');
  }

  if (resetToken.usedAt) {
    throw new Error('This reset token has already been used');
  }

  if (resetToken.expiresAt < new Date()) {
    throw new Error('This reset token has expired');
  }

  const newPasswordHash = await hashPassword(newPassword);

  await prisma.$transaction(async (tx) => {
    await tx.staffUser.update({
      where: { email: resetToken.email },
      data: { passwordHash: newPasswordHash },
    });

    await tx.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    });
  });
}