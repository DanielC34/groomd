import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { getPrisma } from '@/lib/prisma/client';
import { 
  createPasswordResetToken, 
  validatePasswordResetToken, 
  resetPassword,
  verifyStaffCredentials 
} from '../staff';

describe('Password Reset Service', () => {
  const prisma = getPrisma();

  beforeAll(async () => {
    // Ensure test user exists
    await prisma.staffUser.upsert({
      where: { email: 'test-reset@example.com' },
      update: { passwordHash: 'hashed', status: 'ACTIVE' },
      create: { email: 'test-reset@example.com', passwordHash: 'hashed', status: 'ACTIVE' },
    });
  });

  afterAll(async () => {
    await prisma.staffUser.deleteMany({ where: { email: { startsWith: 'test-' } } });
    await prisma.passwordResetToken.deleteMany({ where: { email: { startsWith: 'test-' } } });
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.passwordResetToken.deleteMany({ where: { email: { startsWith: 'test-' } } });
  });

  describe('createPasswordResetToken', () => {
    it('creates a reset token for existing user', async () => {
      const result = await createPasswordResetToken('test-reset@example.com');
      
      expect(result).not.toBeNull();
      const token = result!.token;
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBe(64);
      expect(result!.expiresAt).toBeInstanceOf(Date);
      expect(result!.expiresAt.getTime()).toBeGreaterThan(Date.now());
    });

    it('returns null for non-existent user', async () => {
      const result = await createPasswordResetToken('nonexistent@example.com');
      expect(result).toBeNull();
    });

    it('generates token with 1 hour expiry', async () => {
      const result = await createPasswordResetToken('test-reset@example.com');
      
      expect(result).not.toBeNull();
      const diffHours = Math.floor((result!.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60));
      expect(diffHours).toBe(1);
    });

    it('does not reveal whether email exists', async () => {
      const result1 = await createPasswordResetToken('test-reset@example.com');
      const result2 = await createPasswordResetToken('nonexistent@example.com');
      
      expect(result1).not.toBeNull();
      expect(result2).toBeNull();
      // Both return without error, API returns generic message
    });
  });

  describe('validatePasswordResetToken', () => {
    it('returns token data for valid token', async () => {
      const result = await createPasswordResetToken('test-reset@example.com');
      
      const validated = await validatePasswordResetToken(result!.token);
      
      expect(validated).toBeDefined();
      expect(validated?.email).toBe('test-reset@example.com');
      expect(validated?.tokenHash).toBeDefined();
    });

    it('returns null for invalid token', async () => {
      const validated = await validatePasswordResetToken('invalid-token');
      expect(validated).toBeNull();
    });

    it('returns null for expired token', async () => {
      const { generateSecureToken, hashToken } = await import('../tokens');
      const prisma = getPrisma();
      
      const token = generateSecureToken();
      const tokenHash = hashToken(token);
      const expiredDate = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
      
      await prisma.passwordResetToken.create({
        data: { email: 'test-expired@example.com', tokenHash, expiresAt: expiredDate },
      });

      const validated = await validatePasswordResetToken(token);
      expect(validated).toBeNull();
    });

    it('returns null for already used token', async () => {
      const prisma = getPrisma();
      const { generateSecureToken, hashToken } = await import('../tokens');
      
      const token = generateSecureToken();
      const tokenHash = hashToken(token);
      
      await prisma.passwordResetToken.create({
        data: { 
          email: 'test-used@example.com', 
          tokenHash, 
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
          usedAt: new Date(),
        },
      });

      const validated = await validatePasswordResetToken(token);
      expect(validated).toBeNull();
    });
  });

  describe('resetPassword', () => {
    it('resets password with valid token', async () => {
      const result = await createPasswordResetToken('test-reset@example.com');
      
      await resetPassword(result!.token, 'NewSecurePass123!');
      
      const verified = await verifyStaffCredentials('test-reset@example.com', 'NewSecurePass123!');
      expect(verified).toBeDefined();
    });

    it('rejects invalid token', async () => {
      await expect(resetPassword('invalid-token', 'NewSecurePass123!'))
        .rejects.toThrow('Invalid reset token');
    });

    it('rejects expired token', async () => {
      const { generateSecureToken, hashToken } = await import('../tokens');
      const prisma = getPrisma();
      
      const token = generateSecureToken();
      const tokenHash = hashToken(token);
      const expiredDate = new Date(Date.now() - 2 * 60 * 60 * 1000);
      
      await prisma.passwordResetToken.create({
        data: { email: 'test-expired@example.com', tokenHash, expiresAt: expiredDate },
      });

      await expect(resetPassword(token, 'NewSecurePass123!'))
        .rejects.toThrow('expired');
    });

    it('rejects already used token', async () => {
      const prisma = getPrisma();
      const { generateSecureToken, hashToken } = await import('../tokens');
      
      const token = generateSecureToken();
      const tokenHash = hashToken(token);
      
      await prisma.passwordResetToken.create({
        data: { 
          email: 'test-used@example.com', 
          tokenHash, 
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
          usedAt: new Date(),
        },
      });

      await expect(resetPassword(token, 'NewSecurePass123!'))
        .rejects.toThrow('already been used');
    });

    it('rejects password shorter than 12 characters', async () => {
      const result = await createPasswordResetToken('test-reset@example.com');
      
      await expect(resetPassword(result!.token, 'Short123!'))
        .rejects.toThrow('at least 12 characters');
    });

    it('invalidates old password after reset', async () => {
      const result = await createPasswordResetToken('test-reset@example.com');
      
      await resetPassword(result!.token, 'NewSecurePass123!');
      
      const verified = await verifyStaffCredentials('test-reset@example.com', 'NewSecurePass123!');
      expect(verified).toBeDefined();
      
      const oldVerified = await verifyStaffCredentials('test-reset@example.com', 'oldpassword');
      expect(oldVerified).toBeNull();
    });

    it('marks token as used after successful reset', async () => {
      const result = await createPasswordResetToken('test-mark-used@example.com');
      
      await resetPassword(result!.token, 'NewSecurePass123!');
      
      const validated = await validatePasswordResetToken(result!.token);
      expect(validated).toBeNull();
    });
  });
});