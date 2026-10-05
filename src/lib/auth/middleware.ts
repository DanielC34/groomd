import { validateSession } from './session-management';
import { getSessionCookie, clearSessionCookie } from './cookies';
import { redirect } from 'next/navigation';

export async function requireStaffUser(): Promise<{ staffUserId: string; email: string; status: string }> {
  const token = await getSessionCookie();
  
  if (!token) {
    redirect('/staff/login');
  }

  const session = await validateSession(token);
  
  if (!session) {
    await clearSessionCookie();
    redirect('/staff/login');
  }

  return {
    staffUserId: session.staffUserId,
    email: session.email,
    status: session.status,
  };
}

export async function getOptionalStaffUser(): Promise<{ staffUserId: string; email: string; status: string } | null> {
  const token = await getSessionCookie();
  
  if (!token) {
    return null;
  }

  const session = await validateSession(token);
  
  if (!session) {
    return null;
  }

  return {
    staffUserId: session.staffUserId,
    email: session.email,
    status: session.status,
  };
}