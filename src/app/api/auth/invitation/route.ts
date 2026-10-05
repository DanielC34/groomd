import { NextRequest, NextResponse } from 'next/server';
import { requireStaffUser } from '@/lib/auth/middleware';
import { createStaffInvitation } from '@/lib/auth/staff';

export async function POST(request: NextRequest) {
  try {
    await requireStaffUser();

    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const result = await createStaffInvitation(email);

    return NextResponse.json({
      message: 'Invitation created successfully',
      expiresAt: result.expiresAt.toISOString(),
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create invitation' },
      { status: 500 }
    );
  }
}