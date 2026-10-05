import { defineConfig } from 'prisma/config';

// Prisma 7 does not load .env automatically. Load it for local CLI use if present;
// in production the host provides DATABASE_URL as a real environment variable.
try {
  process.loadEnvFile?.();
} catch {
  // No .env file — rely on the process environment.
}

export default defineConfig({
  schema: './prisma/schema.prisma',
  migrations: {
    path: './prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // Read directly (not via env()) so `prisma generate` still works when
    // DATABASE_URL is absent, e.g. during `npm install` on CI.
    url: process.env.DATABASE_URL,
    shadowDatabaseUrl: process.env.DATABASE_URL,
  },
});
