/**
 * Customers API
 * GET /api/admin/customers - List all customers
 */

import { NextRequest, NextResponse } from 'next/server';
import { customerDb } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value;

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const customers = await customerDb.getAll();

    return NextResponse.json({ customers });
  } catch (error) {
    console.error('Get customers error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
