import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getOptionalStaffUser, requireStaffUser } from '../middleware';

vi.mock('../cookies');
vi.mock('../session-management');

import { getSessionCookie as mockedGetSessionCookie } from '../cookies';
import { validateSession } from '../session-management';

const mockGetSessionCookie = mockedGetSessionCookie as ReturnType<typeof vi.fn>;
const mockValidateSession = validateSession as ReturnType<typeof vi.fn>;

describe('Auth Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getOptionalStaffUser', () => {
    it('returns null when no session cookie', async () => {
      mockGetSessionCookie.mockResolvedValue(undefined);
      
      const result = await getOptionalStaffUser();
      expect(result).toBeNull();
    });

    it('returns null when session is invalid', async () => {
      mockGetSessionCookie.mockResolvedValue('invalid-token');
      mockValidateSession.mockResolvedValue(null);
      
      const result = await getOptionalStaffUser();
      expect(result).toBeNull();
    });

    it('returns staff user when session is valid', async () => {
      mockGetSessionCookie.mockResolvedValue('valid-token');
      mockValidateSession.mockResolvedValue({
        staffUserId: 'user-123',
        email: 'test@example.com',
        status: 'ACTIVE',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 86400000),
      });
      
      const result = await getOptionalStaffUser();
      expect(result).toEqual({
        staffUserId: 'user-123',
        email: 'test@example.com',
        status: 'ACTIVE',
      });
    });
  });

  describe('requireStaffUser', () => {
    it('throws redirect when no session cookie', async () => {
      mockGetSessionCookie.mockResolvedValue(undefined);
      
      await expect(requireStaffUser()).rejects.toThrow('/staff/login');
    });

    it('throws redirect when session is invalid', async () => {
      mockGetSessionCookie.mockResolvedValue('invalid-token');
      mockValidateSession.mockResolvedValue(null);
      
      await expect(requireStaffUser()).rejects.toThrow('/staff/login');
    });

    it('returns staff user when session is valid', async () => {
      mockGetSessionCookie.mockResolvedValue('valid-token');
      mockValidateSession.mockResolvedValue({
        staffUserId: 'user-123',
        email: 'test@example.com',
        status: 'ACTIVE',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 86400000),
      });
      
      const result = await requireStaffUser();
      expect(result).toEqual({
        staffUserId: 'user-123',
        email: 'test@example.com',
        status: 'ACTIVE',
      });
    });
  });
});