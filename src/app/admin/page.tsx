'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Package } from 'lucide-react';
import Link from 'next/link';

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

export default function AdminDashboardPage() {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(cents / 100);
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats?.totalRevenue || 0),
      change: '+12%',
      trending: 'up',
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      change: `${stats?.ordersThisMonth || 0} this month`,
      icon: ShoppingBag,
      color: 'bg-blue-500',
    },
    {
      title: 'Avg Order Value',
      value: formatCurrency(stats?.averageOrderValue || 0),
      icon: Package,
      color: 'bg-purple-500',
    },
    {
      title: 'Pending Orders',
      value: stats?.pendingOrders || 0,
      subtitle: 'Requires attention',
      icon: Users,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to Admin Dashboard</h1>
        <p className="text-white/90">Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
              {stat.trending && (
                <div className={`flex items-center gap-1 text-sm ${stat.trending === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trending === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{stat.change}</span>
                </div>
              )}
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            {stat.change && !stat.trending && (
              <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
            )}
            {stat.subtitle && (
              <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
            )}
          </div>
        ))}
      </div>

      {/* Order Status Breakdown */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Status Breakdown</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats?.statusBreakdown || {}).map(([status, count]) => (
            <div key={status} className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 capitalize">{status.replace(/_/g, ' ')}</p>
              <p className="text-2xl font-bold text-gray-900">{count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/orders"
          className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow group"
        >
          <ShoppingBag className="w-8 h-8 text-primary mb-3" />
          <h3 className="font-semibold text-gray-800 mb-1">View Orders</h3>
          <p className="text-sm text-gray-600">Manage all customer orders</p>
        </Link>

        <Link
          href="/admin/customers"
          className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow group"
        >
          <Users className="w-8 h-8 text-primary mb-3" />
          <h3 className="font-semibold text-gray-800 mb-1">View Customers</h3>
          <p className="text-sm text-gray-600">Manage customer information</p>
        </Link>

        <Link
          href="/admin/analytics"
          className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow group"
        >
          <Package className="w-8 h-8 text-primary mb-3" />
          <h3 className="font-semibold text-gray-800 mb-1">View Analytics</h3>
          <p className="text-sm text-gray-600">Detailed reports and insights</p>
        </Link>
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">This Month Performance</h2>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Revenue</span>
              <span className="text-sm font-medium">{formatCurrency(stats?.revenueThisMonth || 0)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
                style={{ width: '65%' }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Orders</span>
              <span className="text-sm font-medium">{stats?.ordersThisMonth || 0} orders</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: '75%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
