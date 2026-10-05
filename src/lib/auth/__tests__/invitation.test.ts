import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { getPrisma } from '@/lib/prisma/client';
import { 
  createStaffInvitation, 
  acceptStaffInvitation
} from '../staff';
import { hashToken } from '../tokens';

describe('StaffInvitation Service', () => {
  const prisma = getPrisma();

  afterAll(async () => {
    await prisma.staffUser.deleteMany({ where: { email: { startsWith: 'test-' } } });
    await prisma.staffInvitation.deleteMany({ where: { email: { startsWith: 'test-' } } });
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.staffUser.deleteMany({ where: { email: { startsWith: 'test-' } } });
    await prisma.staffInvitation.deleteMany({ where: { email: { startsWith: 'test-' } } });
  });

  describe('createStaffInvitation', () => {
    it('creates an invitation for a new email', async () => {
      const result = await createStaffInvitation('test-invite@example.com');
      
      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe('string');
      expect(result.token.length).toBe(64);
      expect(result.expiresAt).toBeInstanceOf(Date);
      expect(result.expiresAt.getTime()).toBeGreaterThan(Date.now());
    });

    it('normalizes email to lowercase', async () => {
      const result = await createStaffInvitation('TEST-INVITE@EXAMPLE.COM');
      
      const invitation = await getPrisma().staffInvitation.findFirst({
        where: { tokenHash: hashToken(result.token) },
      });
      
      expect(invitation?.email).toBe('test-invite@example.com');
    });

    it('rejects invitation for existing active user', async () => {
      const prisma = getPrisma();
      await prisma.staffUser.create({
        data: {
          email: 'test-existing@example.com',
          passwordHash: 'hashed',
          status: 'ACTIVE',
        },
      });

      await expect(createStaffInvitation('test-existing@example.com'))
        .rejects.toThrow('already exists');
    });

    it('rejects invitation for existing inactive user', async () => {
      const prisma = getPrisma();
      await prisma.staffUser.create({
        data: {
          email: 'test-inactive@example.com',
          passwordHash: 'hashed',
          status: 'INACTIVE',
        },
      });

      await expect(createStaffInvitation('test-inactive@example.com'))
        .rejects.toThrow('inactive staff account');
    });

    it('rejects duplicate active invitation', async () => {
      await createStaffInvitation('test-duplicate@example.com');
      
      await expect(createStaffInvitation('test-duplicate@example.com'))
        .rejects.toThrow('active invitation already exists');
    });
  });

  describe('acceptStaffInvitation', () => {
    it('accepts a valid invitation', async () => {
      const result = await createStaffInvitation('test-accept@example.com');
      
      const user = await acceptStaffInvitation(result.token, 'NewSecurePass123!');
      
      expect(user.id).toBeDefined();
      expect(user.email).toBe('test-accept@example.com');
      expect(user.status).toBe('ACTIVE');
    });

    it('rejects invalid token', async () => {
      await expect(acceptStaffInvitation('invalid-token', 'SecurePass123!'))
        .rejects.toThrow('Invalid invitation');
    });

    it('rejects expired invitation', async () => {
      const prisma = getPrisma();
      const { generateSecureToken, hashToken } = await import('../tokens');
      
      const token = generateSecureToken();
      const tokenHash = hashToken(token);
      const expiredDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      await prisma.staffInvitation.create({
        data: {
          email: 'test-expired@example.com',
          tokenHash,
          expiresAt: expiredDate,
        },
      });

      await expect(acceptStaffInvitation(token, 'SecurePass123!'))
        .rejects.toThrow('expired');
    });

    it('rejects already accepted invitation', async () => {
      const result = await createStaffInvitation('test-double@example.com');
      
      await acceptStaffInvitation(result.token, 'SecurePass123!');
      
      await expect(acceptStaffInvitation(result.token, 'AnotherPass123!'))
        .rejects.toThrow('already been accepted');
    });

    it('rejects invitation for existing active user', async () => {
      const prisma = getPrisma();
      await prisma.staffUser.create({
        data: {
          email: 'test-existing-accept@example.com',
          passwordHash: 'hashed',
          status: 'ACTIVE',
        },
      });

      const result = await createStaffInvitation('test-existing-accept@example.com');
      
      await expect(acceptStaffInvitation(result.token, 'SecurePass123!'))
        .rejects.toThrow('already exists');
    });

    it('rejects invitation for existing inactive user', async () => {
      const prisma = getPrisma();
      await prisma.staffUser.create({
        data: {
          email: 'test-inactive-accept@example.com',
          passwordHash: 'hashed',
          status: 'INACTIVE',
        },
      });

      const result = await createStaffInvitation('test-inactive-accept@example.com');
      
      await expect(acceptStaffInvitation(result.token, 'SecurePass123!'))
        .rejects.toThrow('inactive staff account');
    });

    it('rejects password shorter than 12 characters', async () => {
      const result = await createStaffInvitation('test-short-pass@example.com');
      
      await expect(acceptStaffInvitation(result.token, 'Short123!'))
        .rejects.toThrow('at least 12 characters');
    });

    it('creates active user with hashed password', async () => {
      const result = await createStaffInvitation('test-hash@example.com');
      
      const user = await acceptStaffInvitation(result.token, 'SecurePass123!');
      
      expect(user.status).toBe('ACTIVE');
      expect(user.passwordHash).toBeDefined();
      expect(user.passwordHash).not.toBe('SecurePass123!');
    });
  });
});