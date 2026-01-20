/**
 * Single Order API
 * GET /api/getmein/orders/[id] - Get order by ID
 * PATCH /api/getmein/orders/[id] - Update order
 */

import { NextRequest, NextResponse } from 'next/server';
import { ordersRepository } from '@/lib/cosmosdb';
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
    const order = await ordersRepository.getById(id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('admin-token')?.value;

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    // If status is being updated, add to status history
    if (data.status) {
      const currentOrder = await ordersRepository.getById(id);
      if (currentOrder) {
        const statusHistory = currentOrder.statusHistory || [];
        statusHistory.push({
          status: data.status,
          timestamp: new Date().toISOString(),
          note: data.statusNote
        });
        data.statusHistory = statusHistory;
        delete data.statusNote; // Remove statusNote from the main order data
      }
    }

    data.updatedAt = new Date().toISOString();
    const updatedOrder = await ordersRepository.update(id, data);

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
