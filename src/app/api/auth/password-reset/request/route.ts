import { NextRequest, NextResponse } from 'next/server';
import { createPasswordResetToken } from '@/lib/auth/staff';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const result = await createPasswordResetToken(email);

    if (!result) {
      return NextResponse.json({
        message: 'If an account exists with that email, a password reset link has been sent',
      });
    }

    return NextResponse.json({
      message: 'If an account exists with that email, a password reset link has been sent',
      // In development, include the token for testing
      ...(process.env.NODE_ENV === 'development' && { token: result.token, expiresAt: result.expiresAt.toISOString() }),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    );
  }
}