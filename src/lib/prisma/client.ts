import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    // During build or when no database is configured, return a mock client
    // that throws helpful errors when methods are called
    return new Proxy({} as PrismaClient, {
      get(_target, prop) {
        if (prop === '$connect' || prop === '$disconnect' || prop === '$on' || prop === '$use' || prop === '$extends') {
          return () => Promise.resolve();
        }
        return () => {
          throw new Error(
            `Prisma Client method "${String(prop)}" called but no DATABASE_URL is configured. ` +
            'This is expected during build time. For runtime, set DATABASE_URL environment variable.'
          );
        };
      },
    });
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;