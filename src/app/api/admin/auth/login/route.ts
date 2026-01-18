/**
 * Admin Login API
 * POST /api/admin/auth/login
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminDb, twoFactorDb } from '@/lib/db';
import { comparePassword, generateToken, generateOTPCode, sendOTPEmail } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Find admin by email
    const admin = adminDb.getByEmail(email);

    if (!admin || !admin.active) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Verify password
    const isValid = await comparePassword(password, admin.password);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Check if 2FA is enabled
    if (admin.two_factor_enabled) {
      const method = admin.two_factor_method || 'email';

      if (method === 'email') {
        // Generate and send OTP code
        const code = generateOTPCode();
        twoFactorDb.create(admin.id, method, code);
        await sendOTPEmail(admin.email, code);

        return NextResponse.json({
          requires2FA: true,
          method: 'email',
          adminId: admin.id,
          message: 'Verification code sent to your email',
        });
      } else if (method === 'authenticator') {
        return NextResponse.json({
          requires2FA: true,
          method: 'authenticator',
          adminId: admin.id,
          message: 'Enter code from your authenticator app',
        });
      }
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
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
