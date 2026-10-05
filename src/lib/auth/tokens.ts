import { randomBytes, createHash } from 'crypto';

const TOKEN_BYTES = 32;

export function generateSecureToken(): string {
  return randomBytes(TOKEN_BYTES).toString('hex');
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export const INVITATION_EXPIRY_DAYS = 7;
export const PASSWORD_RESET_EXPIRY_HOURS = 1;

export function calculateExpiry(days: number): Date {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + days);
  return expiry;
}

export function calculateExpiryHours(hours: number): Date {
  const expiry = new Date();
  expiry.setTime(expiry.getTime() + hours * 60 * 60 * 1000);
  return expiry;
}