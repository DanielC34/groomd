/**
 * P1-7: proves the database-level double-booking protection using the REAL migration SQL,
 * executed by PGlite (PostgreSQL compiled to WASM, with the btree_gist extension).
 *
 * PGlite is a single connection, so it cannot run two transactions truly in parallel.
 * Instead the test reproduces the exact interleaving that READ COMMITTED permits: both
 * requests run the availability check (both see a free slot), then both insert. Without the
 * constraint both inserts succeed; with it, PostgreSQL rejects the second with 23P01.
 */
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { PGlite } from '@electric-sql/pglite';
import { btree_gist } from '@electric-sql/pglite/contrib/btree_gist';
import { beforeAll, beforeEach, afterAll, describe, expect, it } from 'vitest';
import { isBookingOverlapViolation } from '../overlap-violation';

const MIGRATIONS = path.resolve(__dirname, '../../../../prisma/migrations');
let db: PGlite;

async function insert(ref: string, barberId: string, start: string, end: string) {
  await db.query(
    `INSERT INTO "Booking" ("id","reference","serviceId","barberId","startAt","endAt",
       "customerName","customerPhone","customerEmail","updatedAt")
     VALUES ($1,$1,'signature-cut',$2,$3,$4,'Test','+260970000000','t@example.com',now())`,
    [ref, barberId, start, end]
  );
}

/** The route's sequential availability check for one barber. */
async function isFree(barberId: string, start: string, end: string) {
  const r = await db.query(
    `SELECT 1 FROM "Booking" WHERE "status"='confirmed' AND "barberId"=$1 AND "startAt" < $3 AND "endAt" > $2`,
    [barberId, start, end]
  );
  return r.rows.length === 0;
}

async function expectRejected(p: Promise<unknown>) {
  const err = await p.then(() => null, (e: unknown) => e);
  expect(err, 'insert should have been rejected').not.toBeNull();
  expect((err as { code?: string }).code).toBe('23P01');
  expect(isBookingOverlapViolation(err)).toBe(true);
}

beforeAll(async () => {
  db = new PGlite({ extensions: { btree_gist } });
  for (const dir of readdirSync(MIGRATIONS).filter((d) => /^\d/.test(d)).sort()) {
    await db.exec(readFileSync(path.join(MIGRATIONS, dir, 'migration.sql'), 'utf8'));
  }
  await db.exec(`
    INSERT INTO "Service" VALUES ('signature-cut','Signature Cut','x',22000,45,'cuts',now(),now());
    INSERT INTO "Barber" VALUES ('mwila-banda','Mwila Banda','Head','x','{}',now(),now()),
                                ('chanda-mulenga','Chanda Mulenga','Senior','x','{}',now(),now());
  `);
}, 60_000);

beforeEach(async () => {
  await db.exec(`DELETE FROM "Booking"`);
});

afterAll(async () => {
  await db?.close();
});

describe('Booking_barber_no_overlap exclusion constraint (real migration SQL)', () => {
  it('race: both requests pass the availability check, only the first insert succeeds', async () => {
    const [s, e] = ['2026-10-01 08:00', '2026-10-01 08:45'];
    // Request A and request B both check availability before either inserts.
    expect(await isFree('mwila-banda', s, e)).toBe(true);
    expect(await isFree('mwila-banda', s, e)).toBe(true);
    await insert('GRD-AAAAAA', 'mwila-banda', s, e);
    await expectRejected(insert('GRD-BBBBBB', 'mwila-banda', s, e));
    const count = await db.query(`SELECT count(*)::int AS n FROM "Booking"`);
    expect((count.rows[0] as { n: number }).n).toBe(1);
  });

  it('rejects a partially overlapping booking for the same barber', async () => {
    await insert('GRD-AAAAAA', 'mwila-banda', '2026-10-01 08:00', '2026-10-01 08:45');
    await expectRejected(insert('GRD-BBBBBB', 'mwila-banda', '2026-10-01 08:30', '2026-10-01 09:15'));
    await expectRejected(insert('GRD-CCCCCC', 'mwila-banda', '2026-10-01 07:30', '2026-10-01 08:15'));
  });

  it('allows a different barber at the same time', async () => {
    await insert('GRD-AAAAAA', 'mwila-banda', '2026-10-01 08:00', '2026-10-01 08:45');
    await expect(insert('GRD-BBBBBB', 'chanda-mulenga', '2026-10-01 08:00', '2026-10-01 08:45')).resolves.toBeUndefined();
  });

  it('allows adjacent appointments (one ends exactly when the next starts)', async () => {
    await insert('GRD-AAAAAA', 'mwila-banda', '2026-10-01 08:00', '2026-10-01 08:45');
    await expect(insert('GRD-BBBBBB', 'mwila-banda', '2026-10-01 08:45', '2026-10-01 09:30')).resolves.toBeUndefined();
    await expect(insert('GRD-CCCCCC', 'mwila-banda', '2026-10-01 07:15', '2026-10-01 08:00')).resolves.toBeUndefined();
  });

  it('allows the same time on a different date', async () => {
    await insert('GRD-AAAAAA', 'mwila-banda', '2026-10-01 08:00', '2026-10-01 08:45');
    await expect(insert('GRD-BBBBBB', 'mwila-banda', '2026-10-02 08:00', '2026-10-02 08:45')).resolves.toBeUndefined();
  });
});
