/**
 * Detects PostgreSQL's rejection of a double-booking by the
 * "Booking_barber_no_overlap" exclusion constraint (SQLSTATE 23P01).
 *
 * Depending on the Prisma engine/driver adapter, the SQLSTATE can appear on the error
 * itself, on `cause`, or inside `meta` (e.g. meta.driverAdapterError.cause), so the error
 * graph is walked defensively. Nothing from the database error is exposed to users.
 */
export const OVERLAP_CONSTRAINT = 'Booking_barber_no_overlap';
const EXCLUSION_VIOLATION = '23P01';

export function isBookingOverlapViolation(error: unknown): boolean {
  const seen = new Set<unknown>();
  const stack: unknown[] = [error];

  while (stack.length > 0) {
    const current = stack.pop();
    if (current === null || typeof current !== 'object' || seen.has(current)) continue;
    seen.add(current);
    const record = current as Record<string, unknown>;

    for (const key of ['code', 'originalCode', 'sqlState']) {
      if (record[key] === EXCLUSION_VIOLATION) return true;
    }
    for (const key of ['constraint', 'message', 'originalMessage']) {
      const value = record[key];
      if (typeof value === 'string' && value.includes(OVERLAP_CONSTRAINT)) return true;
    }
    for (const key of ['cause', 'meta', 'driverAdapterError', 'kind']) {
      if (record[key] && typeof record[key] === 'object') stack.push(record[key]);
    }
  }
  return false;
}
