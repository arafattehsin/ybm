/**
 * Orders API
 * GET /api/admin/orders - List all orders
 * POST /api/admin/orders - Create new order
 */

import { NextRequest, NextResponse } from 'next/server';
import { ordersRepository, customersRepository } from '@/lib/cosmosdb';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value;

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const payment_status = searchParams.get('payment_status');

    // Get all orders
    let orders = await ordersRepository.getAll();
    
    // Filter by status if provided
    if (status) {
      orders = orders.filter(order => order.status === status);
    }
    if (payment_status) {
      orders = orders.filter(order => order.payment_status === payment_status);
    }

    // Fetch customer data for each order
    const ordersWithCustomers = await Promise.all(
      orders.map(async (order) => {
        const customer = await customersRepository.getById(order.customer_id);
        return {
          ...order,
          customer_name: customer?.name || 'Unknown Customer',
          customer_email: customer?.email || '',
        };
      })
    );

    return NextResponse.json({ orders: ordersWithCustomers });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value;

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const data = await request.json();
    const order = await ordersRepository.create(data);

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
