/**
 * Analytics API
 * GET /api/admin/analytics - Get dashboard statistics
 */

import { NextRequest, NextResponse } from 'next/server';
import { analyticsDb } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value;

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const stats = analyticsDb.getStats();

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Get analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
