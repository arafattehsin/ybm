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

    // Calculate total revenue (only from captured payments)
    const totalRevenue = orders
      .filter(o => o.payment_status === 'captured' || o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.total, 0);
    
    const totalOrders = orders.length;
    const totalCustomers = customers.length;
    
    // Count orders by status
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
    const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
    
    // Status breakdown
    const statusBreakdown: Record<string, number> = {};
    orders.forEach(order => {
      const status = order.status || 'unknown';
      statusBreakdown[status] = (statusBreakdown[status] || 0) + 1;
    });
    
    // Calculate this month's data
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const ordersThisMonth = orders.filter(o => {
      const orderDate = new Date(o.created_at || o.createdAt);
      return orderDate >= firstDayOfMonth;
    }).length;
    
    const revenueThisMonth = orders
      .filter(o => {
        const orderDate = new Date(o.created_at || o.createdAt);
        return orderDate >= firstDayOfMonth && (o.payment_status === 'captured' || o.paymentStatus === 'paid');
      })
      .reduce((sum, o) => sum + o.total, 0);
    
    // Calculate today's orders
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = orders.filter(o => {
      const orderDate = new Date(o.created_at || o.createdAt);
      return orderDate >= today;
    }).length;

    const stats = {
      totalRevenue,
      totalOrders,
      totalCustomers,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      todayOrders,
      ordersThisMonth,
      revenueThisMonth,
      statusBreakdown,
      averageOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Get analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
