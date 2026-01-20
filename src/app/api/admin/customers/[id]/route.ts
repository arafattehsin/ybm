/**
 * Single Customer API
 * GET /api/admin/customers/[id] - Get customer by ID with orders
 */

import { NextRequest, NextResponse } from 'next/server';
import { customersRepository, ordersRepository } from '@/lib/cosmosdb';
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
    const customer = await customersRepository.getById(id);

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Get customer's orders for statistics
    const allOrders = await ordersRepository.getAll();
    const orders = allOrders.filter(order => order.customerId === id || order.customer_id === id);
    
    // Calculate total orders and total spent
    customer.totalOrders = orders.length;
    customer.totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);

    return NextResponse.json(customer);
  } catch (error) {
    console.error('Get customer error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
