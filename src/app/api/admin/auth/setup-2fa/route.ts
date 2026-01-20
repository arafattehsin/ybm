/**
 * Setup 2FA API
 * POST /api/admin/auth/setup-2fa
 * Generates TOTP secret and QR code for authenticator app
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminsRepository } from '@/lib/cosmosdb';
import { verifyToken, generate2FASecret, generateQRCode } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const admin = await adminsRepository.getById(payload.id);

    if (!admin || !admin.active) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    // Check if 2FA is already enabled
    if (admin.two_factor_enabled) {
      return NextResponse.json({ error: '2FA is already enabled' }, { status: 400 });
    }

    // Generate TOTP secret
    const { secret, otpauth_url } = generate2FASecret(admin.email);

    // Generate QR code
    const qrCode = await generateQRCode(otpauth_url!);

    // Store secret temporarily (not enabled yet until verified)
    await adminsRepository.update(admin.id, {
      two_factor_secret: secret,
      two_factor_method: 'totp',
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      secret,
      qrCode,
      message: 'Scan QR code with your authenticator app',
    });
  } catch (error) {
    console.error('Setup 2FA error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
