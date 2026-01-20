/**
 * Admin Profile API
 * GET /api/getmein/auth/me
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminsRepository } from '@/lib/cosmosdb';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
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

    return NextResponse.json({
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        twoFactorEnabled: admin.two_factor_enabled,
        twoFactorMethod: admin.two_factor_method,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

