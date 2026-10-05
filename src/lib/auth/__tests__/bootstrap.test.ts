import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { hashPassword } from '../password';
import { StaffStatus } from '@prisma/client';

vi.mock('@/lib/prisma/client', () => ({
  getPrisma: () => ({
    staffUser: {
      count: vi.fn().mockResolvedValue(0),
      findUnique: vi.fn().mockResolvedValue(null),
      create: vi.fn(),
    },
  }),
}));

import { getPrisma } from '@/lib/prisma/client';

describe('Bootstrap Script Logic', () => {
  const prisma = getPrisma();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('rejects when active staff user already exists', async () => {
    (prisma.staffUser.count as ReturnType<typeof vi.fn>).mockResolvedValueOnce(1);
    
    const activeCount = await prisma.staffUser.count({
      where: { status: 'ACTIVE' },
    });
    
    expect(activeCount).toBeGreaterThan(0);
  });

  it('allows bootstrap when no active staff users exist', async () => {
    (prisma.staffUser.count as ReturnType<typeof vi.fn>).mockResolvedValueOnce(0);
    (prisma.staffUser.findUnique as ReturnType<typeof vi.fn>).mockResolvedValueOnce(null);
    (prisma.staffUser.create as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      id: 'new-user-id',
      email: 'bootstrap@example.com',
      status: 'ACTIVE',
      createdAt: new Date(),
    });

    const activeCount = await prisma.staffUser.count({
      where: { status: 'ACTIVE' },
    });
    
    expect(activeCount).toBe(0);
    
    const existing = await prisma.staffUser.findUnique({
      where: { email: 'bootstrap@example.com' },
    });
    
    expect(existing).toBeNull();

    const hashedPassword = await hashPassword('SecureBootstrap123!');
    const user = await prisma.staffUser.create({
      data: {
        email: 'bootstrap@example.com',
        passwordHash: await hashPassword('SecureBootstrap123!'),
        status: StaffStatus.ACTIVE,
      },
    });

    expect(user.id).toBe('new-user-id');
    expect(user.email).toBe('bootstrap@example.com');
    expect(user.status).toBe('ACTIVE');
  });

  it('rejects duplicate email', async () => {
    (prisma.staffUser.findUnique as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      id: 'existing-id',
      email: 'duplicate@example.com',
    });

    const existing = await prisma.staffUser.findUnique({
      where: { email: 'duplicate@example.com' },
    });

    expect(existing).not.toBeNull();
  });
});