import { getPrisma } from '@/lib/prisma/client';
import { generateSessionToken, hashSessionToken, calculateSessionExpiry, SessionData } from './session';

export async function createSession(staffUserId: string, email: string, status: string): Promise<{ token: string; expiresAt: Date }> {
  const prisma = getPrisma();
  
  const token = generateSessionToken();
  const tokenHash = hashSessionToken(token);
  const expiresAt = calculateSessionExpiry();

  await prisma.session.create({
    data: {
      staffUserId,
      tokenHash,
      expiresAt,
    },
  });

  return { token, expiresAt };
}

export async function validateSession(token: string): Promise<SessionData | null> {
  const tokenHash = hashSessionToken(token);
  const prisma = getPrisma();

  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: {
      staffUser: {
        select: {
          id: true,
          email: true,
          status: true,
        },
      },
    },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: session.id } });
    return null;
  }

  if (session.staffUser.status !== 'ACTIVE') {
    return null;
  }

  return {
    staffUserId: session.staffUserId,
    email: session.staffUser.email,
    status: session.staffUser.status,
    createdAt: session.createdAt,
    expiresAt: session.expiresAt,
  };
}

export async function deleteSession(token: string): Promise<void> {
  const tokenHash = hashSessionToken(token);
  const prisma = getPrisma();

  await prisma.session.deleteMany({
    where: { tokenHash },
  });
}

export async function deleteAllSessionsForUser(staffUserId: string): Promise<void> {
  const prisma = getPrisma();

  await prisma.session.deleteMany({
    where: { staffUserId },
  });
}

export async function cleanupExpiredSessions(): Promise<number> {
  const prisma = getPrisma();

  const result = await prisma.session.deleteMany({
    where: {
      expiresAt: { lt: new Date() },
    },
  });

  return result.count;
}