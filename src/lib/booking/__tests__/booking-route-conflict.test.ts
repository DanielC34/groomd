/**
 * P1-7: the losing request of a race must get the normal 409, never a 500.
 * The Prisma client is mocked so its transaction fails the way the pg driver adapter
 * reports an exclusion-constraint violation.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const transaction = vi.fn();
vi.mock('@/lib/prisma/client', () => ({ getPrisma: () => ({ $transaction: transaction }) }));

import { POST } from '@/app/api/bookings/route';

// @prisma/adapter-pg puts the SQLSTATE in cause.originalCode (dist/index.mjs, convertDriverError);
// Prisma wraps it as meta.driverAdapterError (same nesting as the P1001 seen in the P0 check).
function overlapError() {
  const err = new Error('Invalid `tx.booking.create()` invocation') as Error & Record<string, unknown>;
  err.code = 'P2010';
  err.meta = { driverAdapterError: { cause: { originalCode: '23P01', kind: 'postgres' } } };
  return err;
}

const body = (barber: 'specific' | 'no-preference') => ({
  serviceId: 'signature-cut',
  barberPreference: barber,
  barberId: barber === 'specific' ? 'mwila-banda' : null,
  date: '2026-10-01',
  time: '10:00',
  customerName: 'Test User',
  customerPhone: '+260 97 000 0000',
  customerEmail: 't@example.com',
  notes: '',
  termsAccepted: true,
});
const req = (b: unknown) =>
  new Request('http://x/api/bookings', { method: 'POST', body: JSON.stringify(b) }) as never;

describe('POST /api/bookings under a concurrent double-booking', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-30T07:00:00Z')); // 09:00 Lusaka, day before
    transaction.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => vi.useRealTimers());

  it('returns 409 (not 500) with the user-facing message when the constraint rejects the insert', async () => {
    transaction.mockRejectedValue(overlapError());
    const res = await POST(req(body('specific')));
    expect(res.status).toBe(409);
    const json = await res.json();
    expect(json.error).toBe('The selected time is no longer available. Please choose another time.');
    expect(JSON.stringify(json)).not.toMatch(/23P01|constraint|gist|postgres/i);
  });

  it('retries a no-preference booking so it can move to the next free barber', async () => {
    const booking = { reference: 'GRD-ABCDEF' };
    transaction
      .mockRejectedValueOnce(overlapError())
      .mockResolvedValueOnce({ booking, selectedBarberId: 'chanda-mulenga' });
    const res = await POST(req(body('no-preference')));
    expect(res.status).toBe(201);
    expect(transaction).toHaveBeenCalledTimes(2);
    expect((await res.json()).barber.id).toBe('chanda-mulenga');
  });

  it('still returns 500 for unrelated database errors', async () => {
    transaction.mockRejectedValue(Object.assign(new Error('db down'), { code: 'P1001' }));
    const res = await POST(req(body('specific')));
    expect(res.status).toBe(500);
    expect(transaction).toHaveBeenCalledTimes(1);
  });
});
