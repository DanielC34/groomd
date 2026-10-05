import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { getPrisma } from '@/lib/prisma/client';
import { 
  createStaffUser, 
  findStaffUserByEmail, 
  findStaffUserById, 
  setStaffUserStatus, 
  getActiveStaffCount,
  linkBarber,
  verifyStaffCredentials,
  updateStaffPassword,
  StaffStatus 
} from '../staff';

describe('StaffUser Service', () => {
  const prisma = getPrisma();
  let testBarberId: string;

  beforeAll(async () => {
    const barber = await prisma.barber.create({
      data: {
        name: 'Test Barber',
        role: 'Barber',
        bio: 'Test bio',
        specialities: [],
        status: 'ACTIVE',
      },
    });
    testBarberId = barber.id;
  });

  afterAll(async () => {
    await prisma.staffUser.deleteMany({ where: { email: { startsWith: 'test-' } } });
    await prisma.barber.deleteMany({ where: { name: 'Test Barber' } });
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.staffUser.deleteMany({ where: { email: { startsWith: 'test-' } } });
  });

  describe('createStaffUser', () => {
    it('creates a staff user with valid data', async () => {
      const user = await createStaffUser({
        email: 'test-create@example.com',
        password: 'SecurePass123!',
      });

      expect(user.id).toBeDefined();
      expect(user.email).toBe('test-create@example.com');
      expect(user.status).toBe('ACTIVE');
      expect(user.passwordHash).toBeDefined();
      expect(user.barberId).toBeNull();
    });

    it('normalizes email to lowercase', async () => {
      const user = await createStaffUser({
        email: 'TEST-UPPER@EXAMPLE.COM',
        password: 'SecurePass123!',
      });

      expect(user.email).toBe('test-upper@example.com');
    });

    it('rejects duplicate email', async () => {
      await createStaffUser({
        email: 'test-duplicate@example.com',
        password: 'SecurePass123!',
      });

      await expect(createStaffUser({
        email: 'test-duplicate@example.com',
        password: 'AnotherPass123!',
      })).rejects.toThrow('already exists');
    });

    it('rejects password shorter than 12 characters', async () => {
      await expect(createStaffUser({
        email: 'test-short@example.com',
        password: 'Short123!',
      })).rejects.toThrow('at least 12 characters');
    });

    it('links to barber when provided', async () => {
      const user = await createStaffUser({
        email: 'test-barber@example.com',
        password: 'SecurePass123!',
        barberId: testBarberId,
      });

      expect(user.barberId).toBe(testBarberId);
      expect(user.barber).toBeDefined();
      expect(user.barber?.id).toBe(testBarberId);
    });

    it('rejects linking to non-existent barber', async () => {
      await expect(createStaffUser({
        email: 'test-bad-barber@example.com',
        password: 'SecurePass123!',
        barberId: 'non-existent-id',
      })).rejects.toThrow('Barber not found');
    });

    it('rejects linking barber already linked to another user', async () => {
      await createStaffUser({
        email: 'test-barber1@example.com',
        password: 'SecurePass123!',
        barberId: testBarberId,
      });

      await expect(createStaffUser({
        email: 'test-barber2@example.com',
        password: 'SecurePass123!',
        barberId: testBarberId,
      })).rejects.toThrow('already linked');
    });
  });

  describe('findStaffUserByEmail', () => {
    it('finds user by normalized email', async () => {
      await createStaffUser({
        email: 'test-find@example.com',
        password: 'SecurePass123!',
      });

      const user = await findStaffUserByEmail('TEST-FIND@EXAMPLE.COM');
      expect(user).toBeDefined();
      expect(user?.email).toBe('test-find@example.com');
    });

    it('returns null for non-existent email', async () => {
      const user = await findStaffUserByEmail('nonexistent@example.com');
      expect(user).toBeNull();
    });
  });

  describe('findStaffUserById', () => {
    it('finds user by id', async () => {
      const created = await createStaffUser({
        email: 'test-id@example.com',
        password: 'SecurePass123!',
      });

      const user = await findStaffUserById(created.id);
      expect(user).toBeDefined();
      expect(user?.id).toBe(created.id);
    });

    it('returns null for non-existent id', async () => {
      const user = await findStaffUserById('non-existent-id');
      expect(user).toBeNull();
    });
  });

  describe('getActiveStaffCount', () => {
    it('counts active staff users', async () => {
      const initialCount = await getActiveStaffCount();
      
      await createStaffUser({
        email: 'test-count1@example.com',
        password: 'SecurePass123!',
      });
      
      const newCount = await getActiveStaffCount();
      expect(newCount).toBe(initialCount + 1);
    });
  });

  describe('setStaffUserStatus', () => {
    it('deactivates an active user', async () => {
      const user = await createStaffUser({
        email: 'test-deactivate@example.com',
        password: 'SecurePass123!',
      });

      const updated = await setStaffUserStatus(user.id, 'INACTIVE');
      
      expect(updated.status).toBe('INACTIVE');
      expect(updated.deactivatedAt).toBeDefined();
    });

    it('reactivates an inactive user', async () => {
      const user = await createStaffUser({
        email: 'test-reactivate@example.com',
        password: 'SecurePass123!',
      });

      await setStaffUserStatus(user.id, 'INACTIVE');
      const updated = await setStaffUserStatus(user.id, 'ACTIVE');
      
      expect(updated.status).toBe('ACTIVE');
      expect(updated.deactivatedAt).toBeNull();
    });

    it('prevents last active user from deactivating themselves', async () => {
      const user = await createStaffUser({
        email: 'test-last@example.com',
        password: 'SecurePass123!',
      });

      await expect(setStaffUserStatus(user.id, 'INACTIVE', user.id)).rejects.toThrow('last active staff user');
    });

    it('allows deactivation when multiple active users exist', async () => {
      const user1 = await createStaffUser({
        email: 'test-multi1@example.com',
        password: 'SecurePass123!',
      });
      const user2 = await createStaffUser({
        email: 'test-multi2@example.com',
        password: 'SecurePass123!',
      });

      const updated = await setStaffUserStatus(user1.id, 'INACTIVE', user1.id);
      expect(updated.status).toBe('INACTIVE');
    });
  });

  describe('linkBarber', () => {
    it('links a barber to a staff user', async () => {
      const user = await createStaffUser({
        email: 'test-link@example.com',
        password: 'SecurePass123!',
      });

      const updated = await linkBarber(user.id, testBarberId);
      expect(updated.barberId).toBe(testBarberId);
    });

    it('unlinks a barber', async () => {
      const user = await createStaffUser({
        email: 'test-unlink@example.com',
        password: 'SecurePass123!',
        barberId: testBarberId,
      });

      const updated = await linkBarber(user.id, null);
      expect(updated.barberId).toBeNull();
    });

    it('rejects linking to non-existent barber', async () => {
      const user = await createStaffUser({
        email: 'test-bad-link@example.com',
        password: 'SecurePass123!',
      });

      await expect(linkBarber(user.id, 'non-existent')).rejects.toThrow('Barber not found');
    });

    it('rejects linking barber already linked to another user', async () => {
      const user1 = await createStaffUser({
        email: 'test-link1@example.com',
        password: 'SecurePass123!',
        barberId: testBarberId,
      });

      const user2 = await createStaffUser({
        email: 'test-link2@example.com',
        password: 'SecurePass123!',
      });

      await expect(linkBarber(user2.id, testBarberId)).rejects.toThrow('already linked');
    });
  });

  describe('verifyStaffCredentials', () => {
    it('returns user for valid credentials', async () => {
      await createStaffUser({
        email: 'test-verify@example.com',
        password: 'SecurePass123!',
      });

      const user = await verifyStaffCredentials('test-verify@example.com', 'SecurePass123!');
      expect(user).toBeDefined();
      expect(user?.email).toBe('test-verify@example.com');
    });

    it('returns null for incorrect password', async () => {
      await createStaffUser({
        email: 'test-wrong-pass@example.com',
        password: 'SecurePass123!',
      });

      const user = await verifyStaffCredentials('test-wrong-pass@example.com', 'WrongPass123!');
      expect(user).toBeNull();
    });

    it('returns null for inactive user', async () => {
      const user = await createStaffUser({
        email: 'test-inactive@example.com',
        password: 'SecurePass123!',
      });
      
      await setStaffUserStatus(user.id, 'INACTIVE');
      
      const verified = await verifyStaffCredentials('test-inactive@example.com', 'SecurePass123!');
      expect(verified).toBeNull();
    });

    it('returns null for non-existent user', async () => {
      const user = await verifyStaffCredentials('nonexistent@example.com', 'SecurePass123!');
      expect(user).toBeNull();
    });
  });

  describe('updateStaffPassword', () => {
    it('updates password successfully', async () => {
      const user = await createStaffUser({
        email: 'test-update-pass@example.com',
        password: 'SecurePass123!',
      });

      await updateStaffPassword(user.id, 'NewSecurePass456!');

      const verified = await verifyStaffCredentials('test-update-pass@example.com', 'NewSecurePass456!');
      expect(verified).toBeDefined();
    });

    it('rejects old password after update', async () => {
      const user = await createStaffUser({
        email: 'test-old-pass@example.com',
        password: 'SecurePass123!',
      });

      await updateStaffPassword(user.id, 'NewSecurePass456!');
      
      const verified = await verifyStaffCredentials('test-old-pass@example.com', 'SecurePass123!');
      expect(verified).toBeNull();
    });

    it('rejects new password shorter than 12 characters', async () => {
      const user = await createStaffUser({
        email: 'test-short-new@example.com',
        password: 'SecurePass123!',
      });

      await expect(updateStaffPassword(user.id, 'Short123!')).rejects.toThrow('at least 12 characters');
    });
  });
});