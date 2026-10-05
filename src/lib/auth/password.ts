import { hash, verify } from '@node-rs/argon2';

const ARGON2_MEMORY_COST = 19456;
const ARGON2_TIME_COST = 2;
const ARGON2_PARALLELISM = 1;
const ARGON2_OUTPUT_LEN = 32;

export async function hashPassword(password: string): Promise<string> {
  if (!password || password.length < 12) {
    throw new Error('Password must be at least 12 characters');
  }
  return hash(password, {
    memoryCost: ARGON2_MEMORY_COST,
    timeCost: ARGON2_TIME_COST,
    parallelism: ARGON2_PARALLELISM,
    outputLen: ARGON2_OUTPUT_LEN,
  });
}

export async function verifyPassword(password: string, hashStr: string): Promise<boolean> {
  try {
    return await verify(hashStr, password, {
      memoryCost: ARGON2_MEMORY_COST,
      timeCost: ARGON2_TIME_COST,
      parallelism: ARGON2_PARALLELISM,
      outputLen: ARGON2_OUTPUT_LEN,
    });
  } catch {
    return false;
  }
}

export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password) {
    return { valid: false, error: 'Password is required' };
  }
  if (password.length < 12) {
    return { valid: false, error: 'Password must be at least 12 characters' };
  }
  return { valid: true };
}