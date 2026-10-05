import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { getPrisma } from '@/lib/prisma/client';
import { 
  createStaffUser, 
  verifyStaffCredentials, 
  setStaffUserStatus
} from '../staff';
import { 
  createSession,
  validateSession,
  deleteSession,
  deleteAllSessionsForUser
} from '../session-management';

describe('Login & Session', () => {
  const prisma = getPrisma();

  beforeAll(async () => {
    await prisma.staffUser.deleteMany({ where: { email: { startsWith: 'test-login-' } } });
  });

  afterAll(async () => {
    await prisma.staffUser.deleteMany({ where: { email: { startsWith: 'test-login-' } } });
    await prisma.session.deleteMany({});
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.staffUser.deleteMany({ where: { email: { startsWith: 'test-login-' } } });
    await prisma.session.deleteMany({});
  });

  describe('verifyStaffCredentials (Login)', () => {
    it('successfully verifies active user with correct password', async () => {
      await createStaffUser({
        email: 'test-login-success@example.com',
        password: 'SecurePass123!',
      });

      const user = await verifyStaffCredentials('test-login-success@example.com', 'SecurePass123!');
      
      expect(user).toBeDefined();
      expect(user?.email).toBe('test-login-success@example.com');
      expect(user?.status).toBe('ACTIVE');
    });

    it('returns null for incorrect password', async () => {
      await createStaffUser({
        email: 'test-login-wrong@example.com',
        password: 'SecurePass123!',
      });

      const user = await verifyStaffCredentials('test-login-wrong@example.com', 'WrongPass123!');
      expect(user).toBeNull();
    });

    it('returns null for unknown email', async () => {
      const user = await verifyStaffCredentials('unknown@example.com', 'SecurePass123!');
      expect(user).toBeNull();
    });

    it('returns null for inactive user', async () => {
      const user = await createStaffUser({
        email: 'test-login-inactive@example.com',
        password: 'SecurePass123!',
      });

      await setStaffUserStatus(user.id, 'INACTIVE');

      const verified = await verifyStaffCredentials('test-login-inactive@example.com', 'SecurePass123!');
      expect(verified).toBeNull();
    });
  });

  describe('Session Management', () => {
    it('creates a session for active user', async () => {
      const user = await createStaffUser({
        email: 'test-session-create@example.com',
        password: 'SecurePass123!',
      });

      const session = await createSession(user.id, user.email, user.status);
      
      expect(session.token).toBeDefined();
      expect(typeof session.token).toBe('string');
      expect(session.token.length).toBe(64);
      expect(session.expiresAt).toBeInstanceOf(Date);
      expect(session.expiresAt.getTime()).toBeGreaterThan(Date.now());
    });

    it('validates a valid session', async () => {
      const user = await createStaffUser({
        email: 'test-session-validate@example.com',
        password: 'SecurePass123!',
      });

      const session = await createSession(user.id, user.email, user.status);
      const validated = await validateSession(session.token);

      expect(validated).toBeDefined();
      expect(validated?.staffUserId).toBe(user.id);
      expect(validated?.email).toBe(user.email);
      expect(validated?.status).toBe('ACTIVE');
    });

    it('rejects invalid session token', async () => {
      const validated = await validateSession('invalid-token');
      expect(validated).toBeNull();
    });

    it('rejects expired session', async () => {
      const prisma = getPrisma();
      const user = await createStaffUser({
        email: 'test-session-expired@example.com',
        password: 'SecurePass123!',
      });

      const expiredDate = new Date(Date.now() - 1000);
      const token = 'expired-token';
      const { hashSessionToken } = await import('../session');
      const tokenHash = hashSessionToken(token);

      await prisma.session.create({
        data: { staffUserId: user.id, tokenHash, expiresAt: expiredDate },
      });

      const validated = await validateSession(token);
      expect(validated).toBeNull();
    });

    it('rejects session for inactive user', async () => {
      const user = await createStaffUser({
        email: 'test-session-inactive@example.com',
        password: 'SecurePass123!',
      });

      const session = await createSession(user.id, user.email, user.status);
      
      await setStaffUserStatus(user.id, 'INACTIVE');
      
      const validated = await validateSession(session.token);
      expect(validated).toBeNull();
    });

    it('deletes a session', async () => {
      const user = await createStaffUser({
        email: 'test-session-delete@example.com',
        password: 'SecurePass123!',
      });

      const session = await createSession(user.id, user.email, user.status);
      
      await deleteSession(session.token);
      
      const validated = await validateSession(session.token);
      expect(validated).toBeNull();
    });

    it('deletes all sessions for a user', async () => {
      const user = await createStaffUser({
        email: 'test-session-delete-all@example.com',
        password: 'SecurePass123!',
      });

      await createSession(user.id, user.email, user.status);
      await createSession(user.id, user.email, user.status);
      
      await deleteAllSessionsForUser(user.id);
      
      const sessions = await getPrisma().session.findMany({ where: { staffUserId: user.id } });
      expect(sessions.length).toBe(0);
    });
  });
});