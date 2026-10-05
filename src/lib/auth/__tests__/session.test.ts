import { describe, it, expect } from 'vitest';
import { generateSessionToken, hashSessionToken, calculateSessionExpiry, createSessionData, SESSION_EXPIRY_DAYS } from '../session';

describe('Session Utilities', () => {
  it('generates a session token', () => {
    const token = generateSessionToken();
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.length).toBe(64);
  });

  it('generates unique session tokens', () => {
    const tokens = new Set<string>();
    for (let i = 0; i < 100; i++) {
      tokens.add(generateSessionToken());
    }
    expect(tokens.size).toBe(100);
  });

  it('hashes session token consistently', () => {
    const token = 'test-session-token';
    const hash1 = hashSessionToken(token);
    const hash2 = hashSessionToken(token);
    expect(hash1).toBe(hash2);
    expect(hash1.length).toBe(64);
  });

  it('calculates session expiry', () => {
    const before = new Date();
    const expiry = calculateSessionExpiry();
    
    const diffDays = Math.floor((expiry.getTime() - before.getTime()) / (1000 * 60 * 60 * 24));
    expect(diffDays).toBe(SESSION_EXPIRY_DAYS);
  });

  it('creates session data with correct structure', () => {
    const sessionData = createSessionData('user-123', 'test@example.com', 'ACTIVE');
    
    expect(sessionData.staffUserId).toBe('user-123');
    expect(sessionData.email).toBe('test@example.com');
    expect(sessionData.status).toBe('ACTIVE');
    expect(sessionData.createdAt).toBeInstanceOf(Date);
    expect(sessionData.expiresAt).toBeInstanceOf(Date);
    
    const diffMs = sessionData.expiresAt.getTime() - sessionData.createdAt.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    expect(diffDays).toBe(SESSION_EXPIRY_DAYS);
  });
});