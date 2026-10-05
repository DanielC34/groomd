import { NextRequest, NextResponse } from 'next/server';
import { acceptStaffInvitation } from '@/lib/auth/staff';
import { createSession } from '@/lib/auth/session-management';
import { setSessionCookie } from '@/lib/auth/cookies';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: 'Invalid invitation token' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    const staffUser = await acceptStaffInvitation(token, password);

    const sessionToken = await createSession(staffUser.id, staffUser.email, staffUser.status);
    await setSessionCookie(sessionToken.token);

    return NextResponse.json({
      message: 'Account created successfully',
      user: {
        id: staffUser.id,
        email: staffUser.email,
        status: staffUser.status,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to accept invitation' },
      { status: 500 }
    );
  }
}