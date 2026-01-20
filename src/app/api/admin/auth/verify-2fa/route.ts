/**
 * Admin 2FA Verification API
 * POST /api/admin/auth/verify-2fa
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminsRepository } from '@/lib/cosmosdb';
import { generateToken, verify2FAToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { adminId, code, method } = await request.json();

    console.log('2FA Verification attempt:', { adminId, code, method });

    if (!adminId || !code) {
      return NextResponse.json({ error: 'Admin ID and code are required' }, { status: 400 });
    }

    const admin = await adminsRepository.getById(adminId);

    if (!admin) {
      console.error('Admin not found:', adminId);
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    console.log('Admin found:', { 
      email: admin.email, 
      twoFactorEnabled: admin.two_factor_enabled,
      twoFactorMethod: admin.two_factor_method,
      hasSecret: !!admin.two_factor_secret 
    });

    let isValid = false;

    if (method === 'email' || method === 'sms') {
      // TODO: Implement 2FA sessions in Cosmos DB
      // Verify OTP code from database
      // const session = twoFactorDb.getByAdminId(adminId);

      // if (!session || session.code !== code) {
      //   return NextResponse.json({ error: 'Invalid verification code' }, { status: 401 });
      // }

      // Mark as verified
      // twoFactorDb.verify(session.id);
      return NextResponse.json({ error: '2FA email/sms not yet implemented' }, { status: 501 });
    } else if (method === 'totp' || method === 'authenticator') {
      // Verify TOTP token
      if (!admin.two_factor_secret) {
        console.error('2FA secret not found for admin:', admin.email);
        return NextResponse.json({ error: '2FA not set up' }, { status: 400 });
      }

      // Trim and sanitize the code
      const sanitizedCode = code.trim().replace(/\s/g, '');
      console.log('Verifying TOTP code:', { 
        originalCode: code, 
        sanitizedCode,
        secretLength: admin.two_factor_secret.length 
      });

      isValid = verify2FAToken(sanitizedCode, admin.two_factor_secret);
      console.log('TOTP verification result:', isValid);

      // If TOTP fails, check backup codes
      if (!isValid && admin.two_factor_backup_codes) {
        console.log('TOTP failed, checking backup codes...');
        const backupCodes = JSON.parse(admin.two_factor_backup_codes);
        const codeIndex = backupCodes.indexOf(sanitizedCode);
        
        if (codeIndex !== -1) {
          console.log('Valid backup code found at index:', codeIndex);
          // Backup code is valid - remove it (one-time use)
          backupCodes.splice(codeIndex, 1);
          await adminsRepository.update(admin.id, {
            two_factor_backup_codes: JSON.stringify(backupCodes),
            updated_at: new Date().toISOString(),
          });
          isValid = true;
        } else {
          console.log('Backup code not found in list');
        }
      }
    }

    if (!isValid) {
      console.error('2FA verification failed for admin:', admin.email);
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 401 });
    }

    console.log('2FA verification successful for:', admin.email);

    // Generate JWT token
    const token = generateToken({
      id: admin.id,
      email: admin.email,
      role: admin.role,
    });

    // Update last login
    await adminsRepository.update(admin.id, { last_login: new Date().toISOString() });

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
