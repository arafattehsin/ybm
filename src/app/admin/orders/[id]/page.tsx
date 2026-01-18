'use client';

import { useEffect, useState, useCallback } from 'react';
import { use } from 'react';
import { ArrowLeft, Package, User, MapPin, CreditCard, Clock } from 'lucide-react';
import Link from 'next/link';

interface OrderItem {
  productName: string;
  quantity: number;
  size?: string;
  addons?: string[];
  unitPrice: number;
  totalPrice: number;
}

interface DeliveryAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postcode: string;
}

interface Order {
  id: string;
  order_id: string;
  customer_id: string;
  items: OrderItem[];
  status: string;
  payment_status: string;
  payment_intent_id: string;
  delivery_method: string;
  delivery_address: DeliveryAddress | null;
  delivery_fee: number;
  subtotal: number;
  total: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/orders/${resolvedParams.id}`);
      const data = await res.json();
      setOrder(data.order);
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  }, [resolvedParams.id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const updateOrderStatus = async (newStatus: string) => {
    if (!order) return;

    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        fetchOrder();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdating(false);
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

  if (!order) {
    return <div className="text-center py-12">Order not found</div>;
  }

  const statusOptions = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{order.order_id}</h1>
            <p className="text-gray-600">
              Placed on {new Date(order.created_at).toLocaleDateString('en-AU', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-4 py-2 rounded-lg font-medium ${
            order.payment_status === 'captured'
              ? 'bg-green-100 text-green-800'
              : order.payment_status === 'authorized'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-red-100 text-red-800'
          }`}>
            Payment: {order.payment_status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Update */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Status</h2>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => updateOrderStatus(status)}
                  disabled={updating}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    order.status === status
                      ? 'bg-gradient-to-r from-primary to-accent text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Items
            </h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.productName}</h3>
                    <p className="text-sm text-gray-600">Size: {item.size}</p>
                    {item.addons && item.addons.length > 0 && (
                      <p className="text-sm text-gray-600">Addons: {item.addons.join(', ')}</p>
                    )}
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(item.totalPrice)}</p>
                    <p className="text-sm text-gray-500">{formatCurrency(item.unitPrice)} each</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              {order.delivery_fee > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>{formatCurrency(order.delivery_fee)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Customer
            </h2>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Customer ID:</p>
              <p className="font-medium text-gray-900">{order.customer_id}</p>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Delivery
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Method</p>
                <p className="font-medium text-gray-900 capitalize">{order.delivery_method}</p>
              </div>
              {order.delivery_address && (
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="text-sm text-gray-900">
                    {order.delivery_address.line1}
                    {order.delivery_address.line2 && `, ${order.delivery_address.line2}`}
                  </p>
                  <p className="text-sm text-gray-900">
                    {order.delivery_address.city}, {order.delivery_address.postcode}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-medium text-gray-900 capitalize">{order.payment_status}</p>
              </div>
              {order.payment_intent_id && (
                <div>
                  <p className="text-sm text-gray-600">Payment Intent</p>
                  <p className="text-xs text-gray-900 font-mono break-all">{order.payment_intent_id}</p>
                </div>
              )}
            </div>
          </div>

          {/* Timestamps */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Timeline
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Created</p>
                <p className="text-sm text-gray-900">
                  {new Date(order.created_at).toLocaleString('en-AU')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="text-sm text-gray-900">
                  {new Date(order.updated_at).toLocaleString('en-AU')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
