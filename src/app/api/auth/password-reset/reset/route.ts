import { NextRequest, NextResponse } from 'next/server';
import { resetPassword } from '@/lib/auth/staff';
import { createSession } from '@/lib/auth/session-management';
import { setSessionCookie, hashSessionToken } from '@/lib/auth/cookies';
import { getPrisma } from '@/lib/prisma/client';
import { deleteAllSessionsForUser } from '@/lib/auth/session-management';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: 'Invalid reset token' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    await resetPassword(token, password);

    // Invalidate all existing sessions for this user
    const tokenHash = hashSessionToken(token);
    const prisma = getPrisma();

    const resetToken = await prisma.passwordResetToken.findFirst({
      where: { tokenHash },
    });

    let sessionToken: { token: string; expiresAt: Date } | null = null;
    if (resetToken) {
      const staffUser = await prisma.staffUser.findUnique({
        where: { email: resetToken.email },
      });
      if (staffUser) {
        await deleteAllSessionsForUser(staffUser.id);
        sessionToken = await createSession(staffUser.id, staffUser.email, staffUser.status);
        await setSessionCookie(sessionToken.token);
      }
    }

    return NextResponse.json({
      message: 'Password reset successful',
      ...(sessionToken && resetToken ? { user: { id: resetToken.email, email: resetToken.email } } : {}),
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Password reset failed' },
      { status: 500 }
    );
  }
}