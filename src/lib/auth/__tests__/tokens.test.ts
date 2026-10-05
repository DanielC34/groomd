import { describe, it, expect } from 'vitest';
import { generateSecureToken, hashToken, calculateExpiry, calculateExpiryHours, INVITATION_EXPIRY_DAYS, PASSWORD_RESET_EXPIRY_HOURS } from '../tokens';

describe('Token Utilities', () => {
  it('generates a secure token', () => {
    const token = generateSecureToken();
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.length).toBe(64);
  });

  it('generates unique tokens', () => {
    const tokens = new Set<string>();
    for (let i = 0; i < 100; i++) {
      tokens.add(generateSecureToken());
    }
    expect(tokens.size).toBe(100);
  });

  it('hashes token consistently', () => {
    const token = 'test-token-123';
    const hash1 = hashToken(token);
    const hash2 = hashToken(token);
    expect(hash1).toBe(hash2);
    expect(hash1.length).toBe(64);
  });

  it('produces different hashes for different tokens', () => {
    const hash1 = hashToken('token-1');
    const hash2 = hashToken('token-2');
    expect(hash1).not.toBe(hash2);
  });

  it('calculates expiry in days', () => {
    const before = new Date();
    const expiry = calculateExpiry(INVITATION_EXPIRY_DAYS);
    const after = new Date();
    
    const diffDays = Math.floor((expiry.getTime() - before.getTime()) / (1000 * 60 * 60 * 24));
    expect(diffDays).toBe(INVITATION_EXPIRY_DAYS);
  });

  it('calculates expiry in hours', () => {
    const before = new Date();
    const expiry = calculateExpiryHours(PASSWORD_RESET_EXPIRY_HOURS);
    const after = new Date();
    
    const diffHours = Math.floor((expiry.getTime() - before.getTime()) / (1000 * 60 * 60));
    expect(diffHours).toBe(PASSWORD_RESET_EXPIRY_HOURS);
  });
});