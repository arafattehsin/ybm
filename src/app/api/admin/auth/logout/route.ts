/**
 * Admin Logout API
 * POST /api/admin/auth/logout
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(_request: NextRequest) {
  const response = NextResponse.json({ success: true });

  // Clear cookie
  response.cookies.delete('admin-token');

  return response;
}
