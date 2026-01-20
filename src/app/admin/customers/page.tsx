'use client';

import { useEffect, useState } from 'react';
import { Search, Mail, Phone, Users, TrendingUp, ShoppingBag, DollarSign } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  total_spent: number;
  total_orders: number;
  last_order_date: string;
  created_at: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/admin/customers');
      const data = await res.json();
      setCustomers(data.customers);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
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

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(search.toLowerCase()) ||
    customer.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  const totalRevenue = customers.reduce((sum, c) => sum + c.total_spent, 0);
  const avgOrders = customers.length > 0 ? (customers.reduce((sum, c) => sum + c.total_orders, 0) / customers.length).toFixed(1) : 0;

  return (
    <div className="space-y-8">
      {/* Header with Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-pink-500 via-pink-600 to-pink-700 rounded-2xl shadow-2xl p-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight drop-shadow-lg">Customers Management</h1>
              <p className="text-pink-100 text-base">Manage customer information and relationships</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/30">
              <div className="text-white text-center">
                <p className="text-2xl font-bold">{customers.length}</p>
                <p className="text-xs text-pink-100">Total Customers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search customers by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-base"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Customers</p>
              <p className="text-3xl font-bold text-gray-900">{customers.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-200 rounded-xl">
              <ShoppingBag className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Average Orders</p>
              <p className="text-3xl font-bold text-gray-900">{avgOrders}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl">
              <DollarSign className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {customer.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded-full font-semibold border border-green-200">
                Active
              </span>
            </div>

            <h3 className="font-bold text-lg text-gray-900 mb-3">{customer.name}</h3>

            <div className="space-y-2.5 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="p-1.5 bg-gray-100 rounded-lg">
                  <Mail className="w-3.5 h-3.5 text-gray-600" />
                </div>
                <span className="truncate">{customer.email}</span>
              </div>
              {customer.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="p-1.5 bg-gray-100 rounded-lg">
                    <Phone className="w-3.5 h-3.5 text-gray-600" />
                  </div>
                  <span>{customer.phone}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs text-blue-600 font-semibold mb-1">Total Orders</p>
                <p className="text-xl font-bold text-blue-700">{customer.total_orders}</p>
              </div>
              <div className="text-center p-3 bg-pink-50 rounded-xl border border-pink-100">
                <p className="text-xs text-pink-600 font-semibold mb-1">Total Spent</p>
                <p className="text-xl font-bold text-pink-700">{formatCurrency(customer.total_spent)}</p>
              </div>
            </div>

            {customer.last_order_date && (
              <div className="mt-4 pt-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-pink-50 -mx-6 -mb-6 px-6 pb-6 rounded-b-2xl">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-pink-600" />
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Last Order</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {new Date(customer.last_order_date).toLocaleDateString('en-AU', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-lg">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-pink-100 mb-4">
            <Users className="w-10 h-10 text-pink-600" />
          </div>
          <p className="text-lg font-semibold text-gray-600">No customers found</p>
          <p className="text-sm text-gray-500 mt-2">Try adjusting your search</p>
        </div>
      )}
    </div>
  );
}
