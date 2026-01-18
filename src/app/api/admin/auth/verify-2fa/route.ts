/**
 * Admin 2FA Verification API
 * POST /api/admin/auth/verify-2fa
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminDb, twoFactorDb } from '@/lib/db';
import { generateToken, verify2FAToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { adminId, code, method } = await request.json();

    if (!adminId || !code) {
      return NextResponse.json({ error: 'Admin ID and code are required' }, { status: 400 });
    }

    const admin = adminDb.getById(adminId);

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    let isValid = false;

    if (method === 'email' || method === 'sms') {
      // Verify OTP code from database
      const session = twoFactorDb.getByAdminId(adminId);

      if (!session || session.code !== code) {
        return NextResponse.json({ error: 'Invalid verification code' }, { status: 401 });
      }

      // Mark as verified
      twoFactorDb.verify(session.id);
      isValid = true;
    } else if (method === 'authenticator') {
      // Verify TOTP token
      if (!admin.two_factor_secret) {
        return NextResponse.json({ error: '2FA not set up' }, { status: 400 });
      }

      isValid = verify2FAToken(code, admin.two_factor_secret);
    }

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 401 });
    }

    // Generate JWT token
    const token = generateToken({
      id: admin.id,
      email: admin.email,
      role: admin.role,
    });

    // Update last login
    adminDb.update(admin.id, { last_login: new Date().toISOString() });

    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });

    // Set cookie
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('2FA verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
