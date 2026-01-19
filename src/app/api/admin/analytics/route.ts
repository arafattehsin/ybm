/**
 * Analytics API
 * GET /api/admin/analytics - Get dashboard statistics
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

    // Get all data
    const orders = await ordersRepository.getAll();
    const customers = await customersRepository.getAll();

    // Calculate stats
    const totalRevenue = orders
      .filter(o => o.payment_status === 'captured')
      .reduce((sum, o) => sum + o.total, 0);
    
    const totalOrders = orders.length;
    const totalCustomers = customers.length;
    
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = orders.filter(o => new Date(o.created_at) >= today).length;

    const stats = {
      totalRevenue,
      totalOrders,
      totalCustomers,
      pendingOrders,
      todayOrders,
      averageOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Get analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
