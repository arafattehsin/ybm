'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Truck, 
  CreditCard,
  User,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Package,
  Calendar,
  FileText
} from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface OrderItem {
  id: string;
  name?: string;
  productName?: string;
  size?: string;
  addons?: string[];
  quantity: number;
  price?: number;
  unitPrice?: number;
  totalPrice?: number;
}

interface StatusChange {
  status: string;
  timestamp: string;
  note?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  customerName?: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentIntentId?: string;
  shippingAddress?: {
    name?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
  deliveryInstructions?: string;
  createdAt: string;
  updatedAt?: string;
  statusHistory?: StatusChange[];
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalOrders?: number;
  totalSpent?: number;
  createdAt?: string;
}

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle },
  preparing: { label: 'Preparing', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Package },
  ready: { label: 'Ready', color: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: CheckCircle },
  out_for_delivery: { label: 'Out for Delivery', color: 'bg-orange-100 text-orange-800 border-orange-200', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle }
};

const paymentStatusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  paid: { label: 'Paid', color: 'bg-green-100 text-green-800' },
  failed: { label: 'Failed', color: 'bg-red-100 text-red-800' },
  refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-800' }
};

const allStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'] as const;

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [statusNote, setStatusNote] = useState('');

  const fetchOrder = useCallback(async () => {
    try {
      const response = await fetch(`/api/getmein/orders/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch order');
      const data = await response.json();
      
      // Normalize field names to handle both camelCase and snake_case
      const normalizedOrder = {
        ...data,
        orderNumber: data.orderNumber || data.order_id || 'N/A',
        customerId: data.customerId || data.customer_id,
        customerName: data.customerName || data.customer_name || '',
        customerEmail: data.customerEmail || data.customer_email || '',
        customerPhone: data.customerPhone || data.customer_phone || '',
        paymentStatus: data.paymentStatus || data.payment_status || 'pending',
        paymentIntentId: data.paymentIntentId || data.payment_intent_id,
        deliveryFee: data.deliveryFee ?? data.delivery_fee ?? 0,
        shippingAddress: data.shippingAddress || data.shipping_address || (data.delivery_address ? {
          name: data.delivery_address.name,
          line1: data.delivery_address.street || data.delivery_address.line1,
          line2: data.delivery_address.apartment || data.delivery_address.line2,
          city: data.delivery_address.city,
          state: data.delivery_address.state,
          postal_code: data.delivery_address.postcode || data.delivery_address.postal_code,
          country: data.delivery_address.country
        } : undefined),
        deliveryInstructions: data.deliveryInstructions || data.delivery_instructions || '',
        createdAt: data.createdAt || data.created_at,
        updatedAt: data.updatedAt || data.updated_at,
        statusHistory: data.statusHistory || data.status_history || []
      };
      
      setOrder(normalizedOrder);
      setSelectedStatus(normalizedOrder.status);
      
      // Fetch customer details if customerId exists
      if (normalizedOrder.customerId) {
        try {
          const customerRes = await fetch(`/api/getmein/customers/${normalizedOrder.customerId}`);
          if (customerRes.ok) {
            const customerData = await customerRes.json();
            setCustomer(customerData);
          }
        } catch (err) {
          console.error('Failed to fetch customer:', err);
        }
      }
    } catch (err) {
      setError('Failed to load order details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleStatusUpdate = async () => {
    if (!order || selectedStatus === order.status) return;
    
    setUpdating(true);
    setError(null);
    try {
      const response = await fetch(`/api/getmein/orders/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: selectedStatus,
          statusNote: statusNote || undefined
        })
      });
      
      if (!response.ok) throw new Error('Failed to update status');
      
      const updatedData = await response.json();
      
      // Normalize the updated order data
      const normalizedOrder = {
        ...updatedData,
        orderNumber: updatedData.orderNumber || updatedData.order_id || 'N/A',
        customerId: updatedData.customerId || updatedData.customer_id,
        customerName: updatedData.customerName || updatedData.customer_name || '',
        customerEmail: updatedData.customerEmail || updatedData.customer_email || '',
        customerPhone: updatedData.customerPhone || updatedData.customer_phone || '',
        paymentStatus: updatedData.paymentStatus || updatedData.payment_status || 'pending',
        paymentIntentId: updatedData.paymentIntentId || updatedData.payment_intent_id,
        deliveryFee: updatedData.deliveryFee ?? updatedData.delivery_fee ?? 0,
        shippingAddress: updatedData.shippingAddress || updatedData.shipping_address,
        deliveryInstructions: updatedData.deliveryInstructions || updatedData.delivery_instructions || '',
        createdAt: updatedData.createdAt || updatedData.created_at,
        updatedAt: updatedData.updatedAt || updatedData.updated_at,
        statusHistory: updatedData.statusHistory || updatedData.status_history || []
      };
      
      setOrder(normalizedOrder);
      setStatusNote('');
      setSelectedStatus(normalizedOrder.status);
    } catch (err) {
      setError('Failed to update order status');
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-AU', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDateTime = (dateString: string) => {
    return `${formatDate(dateString)} at ${formatTime(dateString)} AEDT`;
  };

  const getItemName = (item: OrderItem): string => {
    return item.productName || item.name || 'Unknown Product';
  };

  const getItemPrice = (item: OrderItem): number => {
    // All prices are in cents from Stripe
    if (item.totalPrice !== undefined && !isNaN(item.totalPrice) && item.totalPrice > 0) {
      return item.totalPrice / 100;
    }
    if (item.unitPrice !== undefined && !isNaN(item.unitPrice) && item.unitPrice > 0) {
      return (item.unitPrice * item.quantity) / 100;
    }
    if (item.price !== undefined && !isNaN(item.price) && item.price > 0) {
      return item.price / 100;
    }
    // Fallback for old orders: calculate from order subtotal if available
    if (order && order.subtotal && order.items.length > 0) {
      return (order.subtotal / 100) / order.items.length;
    }
    return 0;
  };

  const getUnitPrice = (item: OrderItem): number => {
    // All prices are in cents from Stripe
    if (item.unitPrice !== undefined && !isNaN(item.unitPrice) && item.unitPrice > 0) {
      return item.unitPrice / 100;
    }
    if (item.totalPrice !== undefined && !isNaN(item.totalPrice) && item.quantity > 0 && item.totalPrice > 0) {
      return (item.totalPrice / item.quantity) / 100;
    }
    if (item.price !== undefined && !isNaN(item.price) && item.quantity > 0 && item.price > 0) {
      return (item.price / item.quantity) / 100;
    }
    // Fallback for old orders: use total item price divided by quantity
    return getItemPrice(item) / (item.quantity || 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <p className="text-red-600 text-lg">{error || 'Order not found'}</p>
        <Link href="/getmein/orders" className="text-[#2D2D2D] hover:underline flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>
      </div>
    );
  }

  const StatusIcon = statusConfig[order.status]?.icon || Clock;

  return (
    <div className="space-y-8 pb-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="font-medium">Back to Orders</span>
      </button>

      {/* Header with Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-pink-500 via-pink-600 to-pink-700 rounded-2xl shadow-2xl p-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="relative">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg mb-3 border border-white/30">
                <p className="text-pink-100 text-sm font-medium">Order Details</p>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight drop-shadow-lg">
                {order.orderNumber}
              </h1>
              <div className="flex items-center gap-2 text-pink-100">
                <Calendar className="h-5 w-5" />
                <p className="text-base font-medium">{formatDateTime(order.createdAt)}</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className={`px-5 py-2.5 rounded-xl text-sm font-bold border-2 shadow-lg backdrop-blur-sm ${statusConfig[order.status]?.color} bg-white/90`}>
                <StatusIcon className="h-4 w-4 inline mr-2" />
                <span className="text-xs font-semibold opacity-75 mr-1">ORDER:</span>
                {statusConfig[order.status]?.label}
              </div>
              <div className={`px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg backdrop-blur-sm ${paymentStatusConfig[order.paymentStatus]?.color} bg-white/90`}>
                <CreditCard className="h-4 w-4 inline mr-2" />
                <span className="text-xs font-semibold opacity-75 mr-1">PAYMENT:</span>
                {paymentStatusConfig[order.paymentStatus]?.label}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-pink-50 to-pink-100">
              <h2 className="text-2xl font-bold text-pink-700 flex items-center gap-3">
                <Package className="h-6 w-6 text-pink-600" />
                Order Items ({order.items.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {order.items.map((item, index) => (
                <div key={item.id || index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-base text-gray-900">{getItemName(item)}</h3>
                      <div className="mt-1 space-y-1">
                        {item.size && (
                          <p className="text-sm text-gray-500">Size: {item.size}</p>
                        )}
                        {item.addons && item.addons.length > 0 && (
                          <p className="text-sm text-gray-500">
                            Add-ons: {item.addons.join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-base text-gray-900">
                        ${getItemPrice(item).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} × ${getUnitPrice(item).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Order Summary */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="space-y-2">
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900 font-medium">${((order.subtotal || 0) / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="text-gray-900 font-medium">${((order.deliveryFee || 0) / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-2 border-t border-gray-200">
                  <span className="text-gray-900">Total</span>
                  <span className="text-[#2D2D2D]">${((order.total || 0) / 100).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Update Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-100">
              <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-3">
                <Clock className="h-6 w-6 text-blue-600" />
                Update Status
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-base font-bold text-gray-700 mb-2">
                  New Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D2D2D] focus:border-transparent"
                >
                  {allStatuses.map((status) => (
                    <option key={status} value={status}>
                      {statusConfig[status].label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-base font-bold text-gray-700 mb-2">
                  Note (optional)
                </label>
                <textarea
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Add a note for this status change..."
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D2D2D] focus:border-transparent resize-none text-base"
                />
              </div>
              <button
                onClick={handleStatusUpdate}
                disabled={updating || selectedStatus === order.status}
                className="w-full px-4 py-2 bg-[#2D2D2D] text-white rounded-lg font-medium hover:bg-[#3D3D3D] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {updating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>

          {/* Status Timeline */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-100">
                <h2 className="text-2xl font-bold text-green-700 flex items-center gap-3">
                  <FileText className="h-6 w-6 text-green-600" />
                  Status Timeline
                </h2>
              </div>
              <div className="p-6">
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-200"></div>
                  
                  {/* Timeline items */}
                  <div className="space-y-6">
                    {order.statusHistory.map((change, index) => {
                      const config = statusConfig[change.status as keyof typeof statusConfig] || statusConfig.pending;
                      const TimelineIcon = config.icon;
                      return (
                        <div key={index} className="relative flex items-start gap-4 pl-10">
                          <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${config.color}`}>
                            <TimelineIcon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-base text-gray-900">{config.label}</p>
                            <p className="text-sm text-gray-500">
                              {formatDateTime(change.timestamp)}
                            </p>
                            {change.note && (
                              <p className="text-sm text-gray-600 mt-1 bg-gray-50 px-3 py-2 rounded-lg">
                                {change.note}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Customer Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-amber-100">
              <h2 className="text-2xl font-bold text-orange-700 flex items-center gap-3">
                <User className="h-6 w-6 text-orange-600" />
                Customer
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Name</p>
                  <p className="font-bold text-base text-gray-900">
                    {order.customerName || customer?.name || 'Guest Customer'}
                  </p>
                </div>
                
                {(order.customerEmail || customer?.email) && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <a href={`mailto:${order.customerEmail || customer?.email}`} className="text-gray-900 font-bold text-base hover:text-blue-600">
                      {order.customerEmail || customer?.email}
                    </a>
                  </div>
                )}
                
                {(order.customerPhone || customer?.phone) && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Phone</p>
                    <a href={`tel:${order.customerPhone || customer?.phone}`} className="text-gray-900 text-base font-medium hover:text-blue-600">
                      {order.customerPhone || customer?.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Delivery Address Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-blue-100">
              <h2 className="text-2xl font-bold text-cyan-700 flex items-center gap-3">
                <MapPin className="h-6 w-6 text-cyan-600" />
                Delivery Address
              </h2>
            </div>
            <div className="p-6">
              {order.shippingAddress ? (
                <div className="space-y-2">
                  {order.shippingAddress.name && (
                    <p className="font-semibold text-base text-gray-900">{order.shippingAddress.name}</p>
                  )}
                  <p className="text-base text-gray-700">{order.shippingAddress.line1}</p>
                  {order.shippingAddress.line2 && (
                    <p className="text-base text-gray-700">{order.shippingAddress.line2}</p>
                  )}
                  <p className="text-base text-gray-700">
                    {[
                      order.shippingAddress.city,
                      order.shippingAddress.state,
                      order.shippingAddress.postal_code
                    ].filter(Boolean).join(', ')}
                  </p>
                  {order.shippingAddress.country && (
                    <p className="text-base text-gray-500">{order.shippingAddress.country}</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 italic">No delivery address provided</p>
              )}
              
              {order.deliveryInstructions && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-1">Delivery Instructions:</p>
                  <p className="text-sm text-gray-600 bg-yellow-50 px-3 py-2 rounded-lg">
                    {order.deliveryInstructions}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-green-100">
              <h2 className="text-2xl font-bold text-emerald-700 flex items-center gap-3">
                <CreditCard className="h-6 w-6 text-emerald-600" />
                Payment
              </h2>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-base text-gray-600">Status</span>
                <span className={`px-3 py-1.5 rounded text-sm font-bold ${paymentStatusConfig[order.paymentStatus]?.color}`}>
                  {paymentStatusConfig[order.paymentStatus]?.label}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base text-gray-600">Method</span>
                <span className="text-base text-gray-900">Stripe</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base text-gray-600">Amount</span>
                <span className="font-bold text-base text-gray-900">${((order.total || 0) / 100).toFixed(2)}</span>
              </div>
              {order.paymentIntentId && (
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">Payment Intent</p>
                  <p className="text-xs font-mono text-gray-600 break-all mt-1">
                    {order.paymentIntentId}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
