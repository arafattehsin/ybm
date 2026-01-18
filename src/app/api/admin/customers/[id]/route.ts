/**
 * Single Customer API
 * GET /api/admin/customers/[id] - Get customer by ID with orders
 */

import { NextRequest, NextResponse } from 'next/server';
import { customerDb, orderDb } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('admin-token')?.value;

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;
    const customer = customerDb.getById(id);

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Get customer's orders
    const orders = orderDb.getByCustomerId(id);

    return NextResponse.json({ customer, orders });
  } catch (error) {
    console.error('Get customer error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
