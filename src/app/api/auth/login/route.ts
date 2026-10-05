import { NextRequest, NextResponse } from 'next/server';
import { verifyStaffCredentials } from '@/lib/auth/staff';
import { createSession } from '@/lib/auth/session-management';
import { setSessionCookie } from '@/lib/auth/cookies';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    const staffUser = await verifyStaffCredentials(email, password);

    if (!staffUser) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const sessionToken = await createSession(staffUser.id, staffUser.email, staffUser.status);
    await setSessionCookie(sessionToken.token);

    return NextResponse.json({
      message: 'Login successful',
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
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}