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
      const res = await fetch('/api/getmein/analytics');
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
    <div className="space-y-8">
      {/* Header with Pink Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-pink-500 via-pink-600 to-pink-700 rounded-2xl shadow-2xl p-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg mb-3 border border-white/30">
                <p className="text-pink-100 text-sm font-medium">Analytics & Reports</p>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight drop-shadow-lg">Analytics & Reports</h1>
              <p className="text-pink-100 text-base">Detailed insights and performance metrics</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-200 rounded-xl">
              <DollarSign className="w-7 h-7 text-green-600" />
            </div>
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-gray-500 text-base font-semibold mb-1">Total Revenue</p>
          <p className="text-4xl font-bold text-gray-900">{formatCurrency(stats?.totalRevenue || 0)}</p>
          <p className="text-sm text-green-600 mt-2 font-medium">All time</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
              <ShoppingBag className="w-7 h-7 text-blue-600" />
            </div>
          </div>
          <p className="text-gray-500 text-base font-semibold mb-1">Total Orders</p>
          <p className="text-4xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
          <p className="text-sm text-gray-500 mt-2 font-medium">{stats?.ordersThisMonth || 0} this month</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl">
              <Package className="w-7 h-7 text-purple-600" />
            </div>
          </div>
          <p className="text-gray-500 text-base font-semibold mb-1">Avg Order Value</p>
          <p className="text-4xl font-bold text-gray-900">{formatCurrency(stats?.averageOrderValue || 0)}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-orange-100 to-amber-200 rounded-xl">
              <Users className="w-7 h-7 text-orange-600" />
            </div>
          </div>
          <p className="text-gray-500 text-base font-semibold mb-1">Pending Orders</p>
          <p className="text-4xl font-bold text-gray-900">{stats?.pendingOrders || 0}</p>
          <p className="text-sm text-orange-600 mt-2 font-bold">Requires attention</p>
        </div>
      </div>

      {/* Monthly Performance */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">This Month Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-base text-gray-600 font-medium">Revenue</span>
              <span className="text-xl font-bold text-gray-900">{formatCurrency(stats?.revenueThisMonth || 0)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-pink-500 to-pink-600 h-4 rounded-full transition-all duration-500"
                style={{ width: '65%' }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2 font-medium">Target: {formatCurrency(15000)}</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-base text-gray-600 font-medium">Orders</span>
              <span className="text-xl font-bold text-gray-900">{stats?.ordersThisMonth || 0} orders</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                style={{ width: '75%' }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2 font-medium">Target: 50 orders</p>
          </div>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Status Distribution</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats?.statusBreakdown || {}).map(([status, count]) => (
            <div key={status} className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
              <p className="text-base text-gray-600 font-semibold capitalize mb-2">{status.replace(/_/g, ' ')}</p>
              <p className="text-4xl font-bold text-gray-900">{count}</p>
              <p className="text-sm text-gray-500 mt-2 font-medium">
                {((count / (stats?.totalOrders || 1)) * 100).toFixed(1)}%
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-green-800 font-bold text-lg mb-3">Delivered Orders</h3>
          <p className="text-5xl font-bold text-green-900">{stats?.deliveredOrders || 0}</p>
          <p className="text-base text-green-700 mt-3 font-medium">Successfully completed</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200 shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-orange-800 font-bold text-lg mb-3">Pending Orders</h3>
          <p className="text-5xl font-bold text-orange-900">{stats?.pendingOrders || 0}</p>
          <p className="text-base text-orange-700 mt-3 font-medium">In progress</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border border-red-200 shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-red-800 font-bold text-lg mb-3">Cancelled Orders</h3>
          <p className="text-5xl font-bold text-red-900">{stats?.cancelledOrders || 0}</p>
          <p className="text-base text-red-700 mt-3 font-medium">Refunded or cancelled</p>
        </div>
      </div>
    </div>
  );
}

