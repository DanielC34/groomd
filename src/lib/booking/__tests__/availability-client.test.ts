import { describe, it, expect } from 'vitest';
import { getAvailabilityForDate } from '../availability';
import { parseAvailabilityResponse, groupSlots } from '../availability-client';
import { lusakaDateTimeToUtc } from '../timezone';

describe('Availability API response shape (client)', () => {
  // Build a real response exactly as the API does: engine output -> JSON.
  let engineResult: Awaited<ReturnType<typeof getAvailabilityForDate>>;
  let satResult: Awaited<ReturnType<typeof getAvailabilityForDate>>;
  
  beforeAll(async () => {
    engineResult = await getAvailabilityForDate(
      'signature-cut',
      'no-preference',
      null,
      lusakaDateTimeToUtc('2026-10-12'),
      [],
      new Date('2026-10-05T08:00:00Z')
    );
    satResult = await getAvailabilityForDate(
      'signature-cut', 'no-preference', null, lusakaDateTimeToUtc('2026-10-10'), [], new Date('2026-10-05T08:00:00Z')
    );
  });

  it('slots are objects with start, end and barberId', () => {
    const body = JSON.parse(JSON.stringify(engineResult));
    const parsed = parseAvailabilityResponse(body);
    expect(parsed.status).toBe('open');
    expect(parsed.slots[0]).toEqual({ start: '09:00', end: '09:45', barberId: 'mwila-banda' });
  });

  it('rejects the old string[] shape', () => {
    const body = JSON.parse(JSON.stringify(engineResult));
    expect(() => parseAvailabilityResponse({ ...body, slots: ['09:00'] })).toThrow();
  });

  it('parses a closed day', () => {
    const parsed = parseAvailabilityResponse({ date: '2026-10-11', dayOfWeek: 'Sunday', status: 'closed', slots: [] });
    expect(parsed.status).toBe('closed');
  });

  it('groups slot objects into Morning / Afternoon / Evening', () => {
    const body = JSON.parse(JSON.stringify(engineResult));
    const groups = groupSlots(parseAvailabilityResponse(body).slots, 'Weekday cutoff 17:15');
    expect(groups.map((g) => g.label)).toEqual(['Morning', 'Afternoon', 'Evening']);
    expect(groups[0].slots[0].start).toBe('09:00');
    expect(groups[1].slots[0].start).toBe('12:00');
    expect(groups[2].slots[0].start).toBe('17:00');
    expect(groups[2].slots.at(-1)?.end).toBe('18:00');
  });

  it('hides empty groups (Saturday has no evening)', () => {
    const body = JSON.parse(JSON.stringify(satResult));
    expect(groupSlots(parseAvailabilityResponse(body).slots, '').map((g) => g.label)).toEqual(['Morning', 'Afternoon']);
  });
});