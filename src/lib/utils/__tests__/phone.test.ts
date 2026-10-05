import { describe, it, expect } from 'vitest';
import { canonicalizePhone, isValidZambianPhone, formatPhoneForDisplay } from '@/lib/utils/phone';

describe('Phone Canonicalization', () => {
  describe('canonicalizePhone', () => {
    it('normalizes local format with spaces', () => {
      expect(canonicalizePhone('097 123 4567')).toBe('+260971234567');
    });

    it('normalizes local format without spaces', () => {
      expect(canonicalizePhone('0971234567')).toBe('+260971234567');
    });

    it('normalizes international format with spaces', () => {
      expect(canonicalizePhone('+260 97 123 4567')).toBe('+260971234567');
    });

    it('normalizes international format without spaces', () => {
      expect(canonicalizePhone('+260971234567')).toBe('+260971234567');
    });

    it('normalizes international format without +', () => {
      expect(canonicalizePhone('260971234567')).toBe('+260971234567');
    });

    it('handles 9-digit local number', () => {
      expect(canonicalizePhone('971234567')).toBe('+260971234567');
    });
  });

  describe('isValidZambianPhone', () => {
    it('accepts valid formats', () => {
      expect(isValidZambianPhone('097 123 4567')).toBe(true);
      expect(isValidZambianPhone('0971234567')).toBe(true);
      expect(isValidZambianPhone('+260 97 123 4567')).toBe(true);
      expect(isValidZambianPhone('+260971234567')).toBe(true);
      expect(isValidZambianPhone('260971234567')).toBe(true);
      expect(isValidZambianPhone('971234567')).toBe(true);
    });

    it('rejects invalid formats', () => {
      expect(isValidZambianPhone('123')).toBe(false);
      expect(isValidZambianPhone('abc')).toBe(false);
      expect(isValidZambianPhone('')).toBe(false);
      expect(isValidZambianPhone('+1234567890')).toBe(false);
    });
  });

  describe('formatPhoneForDisplay', () => {
    it('formats canonical phone for display', () => {
      expect(formatPhoneForDisplay('+260971234567')).toBe('+260 971 234 567');
      expect(formatPhoneForDisplay('+260970000000')).toBe('+260 970 000 000');
    });
  });
});