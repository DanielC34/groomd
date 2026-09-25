import { describe, it, expect, vi } from 'vitest';
import {
  generateBookingReference,
  isValidReferenceFormat,
  generateUniqueReference,
} from '../reference';

describe('Booking Reference Generation', () => {
  describe('generateBookingReference', () => {
    it('returns correct GRD-XXXXXX format', () => {
      const ref = generateBookingReference();
      expect(ref).toMatch(/^GRD-[A-HJ-NP-Z2-9]{6}$/);
    });

    it('excludes 0, O, 1, I', () => {
      const ref = generateBookingReference();
      const chars = ref.slice(4); // Remove GRD-
      expect(chars).not.toContain('0');
      expect(chars).not.toContain('O');
      expect(chars).not.toContain('1');
      expect(chars).not.toContain('I');
    });

    it('uses only allowed characters', () => {
      const allowed = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      for (let i = 0; i < 100; i++) {
        const ref = generateBookingReference();
        const chars = ref.slice(4);
        for (const char of chars) {
          expect(allowed).toContain(char);
        }
      }
    });
  });

  describe('isValidReferenceFormat', () => {
    it('accepts valid format', () => {
      // Using only allowed chars (no 0, O, 1, I)
      expect(isValidReferenceFormat('GRD-ABCDEF')).toBe(true);
      expect(isValidReferenceFormat('GRD-XYZ789')).toBe(true);
      expect(isValidReferenceFormat('GRD-HJKLMN')).toBe(true);
    });

    it('rejects invalid prefix', () => {
      expect(isValidReferenceFormat('GRX-ABCDEF')).toBe(false);
      expect(isValidReferenceFormat('ABCDEF')).toBe(false);
    });

    it('rejects excluded characters', () => {
      expect(isValidReferenceFormat('GRD-ABC0EF')).toBe(false); // contains 0
      expect(isValidReferenceFormat('GRD-ABCOEF')).toBe(false); // contains O
      expect(isValidReferenceFormat('GRD-ABC1EF')).toBe(false); // contains 1
      expect(isValidReferenceFormat('GRD-ABCIEF')).toBe(false); // contains I
    });

    it('rejects wrong length', () => {
      expect(isValidReferenceFormat('GRD-ABCDE')).toBe(false); // 5 chars
      expect(isValidReferenceFormat('GRD-ABCDEFG')).toBe(false); // 7 chars
    });

    it('rejects lowercase', () => {
      expect(isValidReferenceFormat('grd-abcdef')).toBe(false);
    });
  });

  describe('generateUniqueReference', () => {
    it('returns unique reference on first try', async () => {
      const checkFn = vi.fn().mockResolvedValue(false);
      const ref = await generateUniqueReference(checkFn);
      expect(ref).toMatch(/^GRD-[A-HJ-NP-Z2-9]{6}$/);
      expect(checkFn).toHaveBeenCalledTimes(1);
    });

    it('retries on collision', async () => {
      const checkFn = vi.fn()
        .mockResolvedValueOnce(true)  // first attempt collides
        .mockResolvedValueOnce(false); // second attempt succeeds
      const ref = await generateUniqueReference(checkFn, 10);
      expect(ref).toMatch(/^GRD-[A-HJ-NP-Z2-9]{6}$/);
      expect(checkFn).toHaveBeenCalledTimes(2);
    });

    it('throws after max attempts', async () => {
      const checkFn = vi.fn().mockResolvedValue(true);
      await expect(generateUniqueReference(checkFn, 3)).rejects.toThrow(
        'Unable to generate unique booking reference after maximum attempts'
      );
      expect(checkFn).toHaveBeenCalledTimes(3);
    });
  });
});