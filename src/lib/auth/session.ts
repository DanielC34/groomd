import { randomBytes, createHash } from 'crypto';

export const SESSION_TOKEN_BYTES = 32;
export const SESSION_EXPIRY_DAYS = 30;
const SESSION_EXPIRY_MS = SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

export function generateSessionToken(): string {
  return randomBytes(SESSION_TOKEN_BYTES).toString('hex');
}

export function hashSessionToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function calculateSessionExpiry(): Date {
  const expiry = new Date();
  expiry.setTime(expiry.getTime() + SESSION_EXPIRY_MS);
  return expiry;
}

export interface SessionData {
  staffUserId: string;
  email: string;
  status: string;
  createdAt: Date;
  expiresAt: Date;
}

export function createSessionData(staffUserId: string, email: string, status: string): SessionData {
  const now = new Date();
  return {
    staffUserId,
    email,
    status,
    createdAt: now,
    expiresAt: calculateSessionExpiry(),
  };
}