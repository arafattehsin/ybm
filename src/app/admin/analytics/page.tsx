'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, ShoppingBag, Users, Package } from 'lucide-react';

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  ordersThisMonth: number;
  revenueThisMonth: number;
  averageOrderValue: number;
  pendingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  statusBreakdown: Record<string, number>;
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/analytics');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(cents / 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
        <p className="text-gray-600">Detailed insights and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats?.totalRevenue || 0)}</p>
          <p className="text-xs text-green-600 mt-2">All time</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Total Orders</p>
          <p className="text-3xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
          <p className="text-xs text-gray-500 mt-2">{stats?.ordersThisMonth || 0} this month</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Avg Order Value</p>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats?.averageOrderValue || 0)}</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Pending Orders</p>
          <p className="text-3xl font-bold text-gray-900">{stats?.pendingOrders || 0}</p>
          <p className="text-xs text-orange-600 mt-2">Requires attention</p>
        </div>
      </div>

      {/* Monthly Performance */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">This Month Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Revenue</span>
              <span className="text-lg font-semibold text-gray-900">{formatCurrency(stats?.revenueThisMonth || 0)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-primary to-accent h-3 rounded-full"
                style={{ width: '65%' }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Target: {formatCurrency(15000)}</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Orders</span>
              <span className="text-lg font-semibold text-gray-900">{stats?.ordersThisMonth || 0} orders</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full"
                style={{ width: '75%' }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Target: 50 orders</p>
          </div>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Order Status Distribution</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats?.statusBreakdown || {}).map(([status, count]) => (
            <div key={status} className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 capitalize mb-1">{status.replace(/_/g, ' ')}</p>
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <p className="text-xs text-gray-500 mt-1">
                {((count / (stats?.totalOrders || 1)) * 100).toFixed(1)}%
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <h3 className="text-green-800 font-semibold mb-2">Delivered Orders</h3>
          <p className="text-4xl font-bold text-green-900">{stats?.deliveredOrders || 0}</p>
          <p className="text-sm text-green-700 mt-2">Successfully completed</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
          <h3 className="text-orange-800 font-semibold mb-2">Pending Orders</h3>
          <p className="text-4xl font-bold text-orange-900">{stats?.pendingOrders || 0}</p>
          <p className="text-sm text-orange-700 mt-2">In progress</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
          <h3 className="text-red-800 font-semibold mb-2">Cancelled Orders</h3>
          <p className="text-4xl font-bold text-red-900">{stats?.cancelledOrders || 0}</p>
          <p className="text-sm text-red-700 mt-2">Refunded or cancelled</p>
        </div>
      </div>
    </div>
  );
}
