import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, validatePassword } from '../password';

describe('Password Hashing', () => {
  it('hashes a valid password', async () => {
    const password = 'SecurePass123!';
    const hash = await hashPassword(password);
    expect(hash).toBeDefined();
    expect(typeof hash).toBe('string');
    expect(hash.length).toBeGreaterThan(0);
  });

  it('rejects password shorter than 12 characters', async () => {
    await expect(hashPassword('Short123!')).rejects.toThrow('Password must be at least 12 characters');
  });

  it('rejects empty password', async () => {
    await expect(hashPassword('')).rejects.toThrow('Password must be at least 12 characters');
  });

  it('verifies correct password', async () => {
    const password = 'SecurePass123!';
    const hash = await hashPassword(password);
    const isValid = await verifyPassword(password, hash);
    expect(isValid).toBe(true);
  });

  it('rejects incorrect password', async () => {
    const password = 'SecurePass123!';
    const hash = await hashPassword(password);
    const isValid = await verifyPassword('WrongPass123!', hash);
    expect(isValid).toBe(false);
  });

  it('validates password length', () => {
    expect(validatePassword('')).toEqual({ valid: false, error: 'Password is required' });
    expect(validatePassword('Short123!')).toEqual({ valid: false, error: 'Password must be at least 12 characters' });
    expect(validatePassword('ValidPass123!')).toEqual({ valid: true });
  });

  it('handles verifyPassword with invalid hash gracefully', async () => {
    const isValid = await verifyPassword('password', 'invalid-hash');
    expect(isValid).toBe(false);
  });
});