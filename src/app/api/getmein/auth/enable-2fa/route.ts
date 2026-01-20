/**
 * Enable 2FA API
 * POST /api/getmein/auth/enable-2fa
 * Verifies TOTP code and enables 2FA with backup codes
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminsRepository } from '@/lib/cosmosdb';
import { verifyToken, verify2FAToken } from '@/lib/auth';
import crypto from 'crypto';

/**
 * Generate backup codes for account recovery
 */
function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    // Generate 8-character alphanumeric code
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    codes.push(`${code.slice(0, 4)}-${code.slice(4, 8)}`);
  }
  return codes;
}

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

    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Verification code required' }, { status: 400 });
    }

    const admin = await adminsRepository.getById(payload.id);

    if (!admin || !admin.active) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    if (admin.two_factor_enabled) {
      return NextResponse.json({ error: '2FA is already enabled' }, { status: 400 });
    }

    if (!admin.two_factor_secret) {
      return NextResponse.json({ error: '2FA not set up. Call setup-2fa first' }, { status: 400 });
    }

    // Verify TOTP code
    const isValid = verify2FAToken(code, admin.two_factor_secret);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 401 });
    }

    // Generate backup codes
    const backupCodes = generateBackupCodes(10);

    // Enable 2FA and store backup codes
    await adminsRepository.update(admin.id, {
      two_factor_enabled: 1,
      two_factor_method: 'totp',
      two_factor_backup_codes: JSON.stringify(backupCodes),
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      backupCodes,
      message: '2FA enabled successfully. Save these backup codes in a safe place!',
    });
  } catch (error) {
    console.error('Enable 2FA error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

