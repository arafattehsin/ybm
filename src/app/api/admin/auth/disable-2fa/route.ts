/**
 * Disable 2FA API
 * POST /api/admin/auth/disable-2fa
 * Disables 2FA (requires password and current TOTP code)
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminsRepository } from '@/lib/cosmosdb';
import { verifyToken, verify2FAToken, comparePassword } from '@/lib/auth';

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

    const { password, code } = await request.json();

    if (!password || !code) {
      return NextResponse.json({ error: 'Password and code required' }, { status: 400 });
    }

    const admin = await adminsRepository.getById(payload.id);

    if (!admin || !admin.active) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    if (!admin.two_factor_enabled) {
      return NextResponse.json({ error: '2FA is not enabled' }, { status: 400 });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, admin.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Verify TOTP code
    const isCodeValid = verify2FAToken(code, admin.two_factor_secret!);

    if (!isCodeValid) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 401 });
    }

    // Disable 2FA and clear secrets
    await adminsRepository.update(admin.id, {
      two_factor_enabled: 0,
      two_factor_secret: '',
      two_factor_backup_codes: '',
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: '2FA disabled successfully',
    });
  } catch (error) {
    console.error('Disable 2FA error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
