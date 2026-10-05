import { NextResponse } from 'next/server';
import { getSessionCookie, clearSessionCookie } from '@/lib/auth/cookies';
import { deleteSession } from '@/lib/auth/session-management';

export async function POST() {
  const token = await getSessionCookie();
  
  if (token) {
    await deleteSession(token);
    await clearSessionCookie();
  }

  return NextResponse.json({ message: 'Logged out successfully' });
}