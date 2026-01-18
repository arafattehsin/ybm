'use client';

import { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ShoppingCart, 
  Users, 
  Clock,
  ArrowUpRight,
  ArrowRight,
  BarChart3,
  Sparkles,
  CheckCircle2,
  Truck,
  XCircle,
  Timer,
  ChefHat,
  Package
} from 'lucide-react';
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

// Mini bar chart component for performance visualization
const MiniBarChart = ({ data, color }: { data: number[]; color: string }) => {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((value, index) => (
        <div
          key={index}
          className={`flex-1 rounded-t-sm transition-all duration-500 hover:opacity-80 ${color}`}
          style={{ 
            height: `${(value / max) * 100}%`,
            minHeight: value > 0 ? '4px' : '0px'
          }}
        />
      ))}
    </div>
  );
};

// Donut chart component
const DonutChart = ({ data, colors }: { data: { label: string; value: number }[]; colors: string[] }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercent = 0;

  const segments = data.map((item, index) => {
    const percent = total > 0 ? (item.value / total) * 100 : 0;
    const startPercent = cumulativePercent;
    cumulativePercent += percent;
    return { ...item, percent, startPercent, color: colors[index % colors.length] };
  });

  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
        <circle
          cx="18"
          cy="18"
          r="15.5"
          fill="none"
          stroke="#f3f4f6"
          strokeWidth="3"
        />
        {segments.map((segment, index) => (
          <circle
            key={index}
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            stroke={segment.color}
            strokeWidth="3"
            strokeDasharray={`${segment.percent} ${100 - segment.percent}`}
            strokeDashoffset={-segment.startPercent}
            className="transition-all duration-700"
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-900">{total}</span>
        <span className="text-xs text-gray-500">Total</span>
      </div>
    </div>
  );
};

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
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary"></div>
          <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-primary animate-pulse" />
        </div>
      </div>
    );
  }

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(cents / 100);
  };

  // Generate mock weekly data for visualization
  const weeklyRevenue = [
    Math.floor((stats?.totalRevenue || 0) * 0.1),
    Math.floor((stats?.totalRevenue || 0) * 0.15),
    Math.floor((stats?.totalRevenue || 0) * 0.08),
    Math.floor((stats?.totalRevenue || 0) * 0.2),
    Math.floor((stats?.totalRevenue || 0) * 0.18),
    Math.floor((stats?.totalRevenue || 0) * 0.12),
    Math.floor((stats?.totalRevenue || 0) * 0.17),
  ];

  const weeklyOrders = [1, 2, 1, 3, 2, 1, stats?.ordersThisMonth || 2];

  const statusIcons: Record<string, React.ReactNode> = {
    pending: <Timer className="w-4 h-4" />,
    confirmed: <CheckCircle2 className="w-4 h-4" />,
    preparing: <ChefHat className="w-4 h-4" />,
    ready: <Package className="w-4 h-4" />,
    out_for_delivery: <Truck className="w-4 h-4" />,
    delivered: <CheckCircle2 className="w-4 h-4" />,
    cancelled: <XCircle className="w-4 h-4" />,
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-600 border-amber-200',
    confirmed: 'bg-blue-50 text-blue-600 border-blue-200',
    preparing: 'bg-purple-50 text-purple-600 border-purple-200',
    ready: 'bg-teal-50 text-teal-600 border-teal-200',
    out_for_delivery: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    delivered: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    cancelled: 'bg-red-50 text-red-600 border-red-200',
  };

  const donutData = Object.entries(stats?.statusBreakdown || {}).map(([label, value]) => ({
    label,
    value,
  }));

  const donutColors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];

  return (
    <div className="space-y-8">
      {/* Welcome Banner with Glassmorphism */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-pink-500 to-accent rounded-3xl p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-white/80 text-sm font-medium">Dashboard Overview</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">Welcome back! 👋</h1>
          <p className="text-white/80 text-lg">Here&apos;s what&apos;s happening with your bakery today.</p>
        </div>
      </div>

      {/* Stats Grid - Redesigned Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <div className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-lg shadow-gray-100/50 hover:shadow-2xl hover:shadow-emerald-100/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-100 to-transparent rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl shadow-lg shadow-emerald-200">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-sm font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+12%</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats?.totalRevenue || 0)}</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <MiniBarChart data={weeklyRevenue} color="bg-emerald-400" />
              <p className="text-xs text-gray-400 mt-2 text-center">Last 7 days</p>
            </div>
          </div>
        </div>

        {/* Orders Card */}
        <div className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-lg shadow-gray-100/50 hover:shadow-2xl hover:shadow-blue-100/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100 to-transparent rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg shadow-blue-200">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                {stats?.ordersThisMonth || 0} new
              </span>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">Total Orders</p>
            <p className="text-3xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <MiniBarChart data={weeklyOrders} color="bg-blue-400" />
              <p className="text-xs text-gray-400 mt-2 text-center">Last 7 days</p>
            </div>
          </div>
        </div>

        {/* Avg Order Value Card */}
        <div className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-lg shadow-gray-100/50 hover:shadow-2xl hover:shadow-purple-100/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-100 to-transparent rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl shadow-lg shadow-purple-200">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">Avg Order Value</p>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats?.averageOrderValue || 0)}</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Performance</span>
                <span className="text-xs font-medium text-purple-600">Good</span>
              </div>
              <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full w-3/4 transition-all duration-1000" />
              </div>
            </div>
          </div>
        </div>

        {/* Pending Orders Card */}
        <div className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-lg shadow-gray-100/50 hover:shadow-2xl hover:shadow-amber-100/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-100 to-transparent rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg shadow-amber-200">
                <Clock className="w-6 h-6 text-white" />
              </div>
              {(stats?.pendingOrders || 0) > 0 && (
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">Pending Orders</p>
            <p className="text-3xl font-bold text-gray-900">{stats?.pendingOrders || 0}</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-amber-600 font-medium flex items-center gap-1">
                <Timer className="w-3.5 h-3.5" />
                {(stats?.pendingOrders || 0) > 0 ? 'Requires attention' : 'All caught up! 🎉'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Status & Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Status Breakdown - Redesigned */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-lg shadow-gray-100/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Order Status</h2>
              <p className="text-sm text-gray-500 mt-1">Real-time order tracking</p>
            </div>
            <Link 
              href="/admin/orders" 
              className="flex items-center gap-1 text-sm text-primary hover:text-accent transition-colors font-medium"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(stats?.statusBreakdown || {}).map(([status, count]) => (
              <div 
                key={status} 
                className={`p-4 rounded-xl border ${statusColors[status] || 'bg-gray-50 text-gray-600 border-gray-200'} hover:scale-105 transition-transform duration-200 cursor-pointer`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {statusIcons[status] || <Package className="w-4 h-4" />}
                  <p className="text-sm font-medium capitalize">{status.replace(/_/g, ' ')}</p>
                </div>
                <p className="text-3xl font-bold">{count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg shadow-gray-100/50">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Distribution</h2>
          <p className="text-sm text-gray-500 mb-6">Order breakdown</p>
          <DonutChart data={donutData} colors={donutColors} />
          <div className="mt-6 space-y-2">
            {donutData.slice(0, 3).map((item, index) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: donutColors[index] }} />
                  <span className="text-gray-600 capitalize">{item.label.replace(/_/g, ' ')}</span>
                </div>
                <span className="font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions - Redesigned */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/orders"
          className="group relative bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border-2 border-primary/20 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500" />
          <div className="relative">
            <div className="p-4 bg-gradient-to-br from-primary to-accent rounded-2xl w-fit mb-4 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
              <ShoppingCart className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-primary transition-colors">View Orders</h3>
            <p className="text-sm text-gray-500 mb-4">Manage all customer orders</p>
            <div className="flex items-center gap-1 text-primary font-medium text-sm group-hover:gap-2 transition-all">
              <span>Open</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </Link>

        <Link
          href="/admin/customers"
          className="group relative bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 border-2 border-blue-200/50 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-transparent rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500" />
          <div className="relative">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl w-fit mb-4 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform duration-300">
              <Users className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors">View Customers</h3>
            <p className="text-sm text-gray-500 mb-4">Manage customer information</p>
            <div className="flex items-center gap-1 text-blue-600 font-medium text-sm group-hover:gap-2 transition-all">
              <span>Open</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </Link>

        <Link
          href="/admin/analytics"
          className="group relative bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-6 border-2 border-purple-200/50 hover:border-purple-300 hover:shadow-2xl hover:shadow-purple-100/50 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-transparent rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500" />
          <div className="relative">
            <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl w-fit mb-4 shadow-lg shadow-purple-200 group-hover:scale-110 transition-transform duration-300">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-purple-600 transition-colors">View Analytics</h3>
            <p className="text-sm text-gray-500 mb-4">Detailed reports and insights</p>
            <div className="flex items-center gap-1 text-purple-600 font-medium text-sm group-hover:gap-2 transition-all">
              <span>Open</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </Link>
      </div>

      {/* This Month Performance - Modern Graph */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg shadow-gray-100/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">This Month Performance</h2>
            <p className="text-sm text-gray-500 mt-1">Revenue and orders overview</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-accent" />
              <span className="text-sm text-gray-600">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm text-gray-600">Orders</span>
            </div>
          </div>
        </div>

        {/* Modern Area Chart Visualization */}
        <div className="relative h-64">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 pr-4">
            <span>{formatCurrency((stats?.revenueThisMonth || 0) * 1.2)}</span>
            <span>{formatCurrency((stats?.revenueThisMonth || 0) * 0.8)}</span>
            <span>{formatCurrency((stats?.revenueThisMonth || 0) * 0.4)}</span>
            <span>$0</span>
          </div>

          {/* Chart Area */}
          <div className="ml-16 h-full relative">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="border-b border-gray-100 w-full" />
              ))}
            </div>

            {/* Revenue Area */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgb(236, 72, 153)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="rgb(236, 72, 153)" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="orderGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Revenue area fill */}
              <path
                d="M 0 80 Q 15 60, 30 65 T 60 50 T 90 55 T 120 40 T 150 45 T 180 35 T 210 30 L 210 100 L 0 100 Z"
                fill="url(#revenueGradient)"
                className="transition-all duration-1000"
              />
              {/* Revenue line */}
              <path
                d="M 0 80 Q 15 60, 30 65 T 60 50 T 90 55 T 120 40 T 150 45 T 180 35 T 210 30"
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="3"
                className="transition-all duration-1000"
                style={{ 
                  stroke: 'rgb(236, 72, 153)',
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round'
                }}
              />

              {/* Orders area fill */}
              <path
                d="M 0 90 Q 30 85, 60 80 T 120 70 T 180 60 T 210 55 L 210 100 L 0 100 Z"
                fill="url(#orderGradient)"
                className="transition-all duration-1000"
              />
              {/* Orders line */}
              <path
                d="M 0 90 Q 30 85, 60 80 T 120 70 T 180 60 T 210 55"
                fill="none"
                stroke="rgb(59, 130, 246)"
                strokeWidth="2"
                className="transition-all duration-1000"
                style={{ 
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round'
                }}
              />

              {/* Data points */}
              <circle cx="30" cy="65" r="4" fill="rgb(236, 72, 153)" className="drop-shadow-lg" />
              <circle cx="90" cy="55" r="4" fill="rgb(236, 72, 153)" className="drop-shadow-lg" />
              <circle cx="150" cy="45" r="4" fill="rgb(236, 72, 153)" className="drop-shadow-lg" />
              <circle cx="210" cy="30" r="4" fill="rgb(236, 72, 153)" className="drop-shadow-lg" />
            </svg>

            {/* X-axis labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400 transform translate-y-6">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-6 mt-10">
          <div className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl border border-primary/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Revenue this month</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.revenueThisMonth || 0)}</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Orders this month</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.ordersThisMonth || 0} orders</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
