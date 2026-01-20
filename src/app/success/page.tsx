'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/components/ui';
import { CheckCircle, ArrowRight, Loader2, Package, Truck, Clock } from 'lucide-react';

export default function SuccessPage() {
  const { clearCart } = useCartStore();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderCreated, setOrderCreated] = useState(false);
  const [creating, setCreating] = useState(false);

  // Create order from Stripe session
  useEffect(() => {
    async function createOrder() {
      if (!sessionId || orderCreated || creating) return;

      setCreating(true);
      try {
        const response = await fetch('/api/create-order-from-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });

        if (response.ok) {
          setOrderCreated(true);
          clearCart();
        }
      } catch (error) {
        console.error('Failed to create order:', error);
      } finally {
        setCreating(false);
      }
    }

    createOrder();
  }, [sessionId, orderCreated, creating, clearCart]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-4">
        {/* Success Icon with Animation */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-green-400/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-green-400 to-green-500 rounded-full p-6 shadow-2xl">
              <CheckCircle size={64} className="text-white" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-pink-100">
          <div className="p-8 md:p-12 text-center">
            <h1 className="text-3xl md:text-5xl font-bold font-serif bg-gradient-to-r from-pink-600 via-pink-500 to-pink-600 bg-clip-text text-transparent mb-4">
              Thank You for Your Order!
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 mb-3 font-medium">
              Your order has been received and is being prepared with love.
            </p>

            <p className="text-base md:text-lg text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed">
              You will receive a confirmation email shortly with your order details. If you have any questions, please don&apos;t hesitate to contact us.
            </p>

            {/* What's Next Section */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 md:p-8 mb-8 text-left border border-amber-200/50">
              <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                <span className="text-3xl">✨</span>
                <span>What&apos;s Next?</span>
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-base md:text-lg text-gray-800 font-medium">
                      You&apos;ll receive an email confirmation shortly
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Check your inbox for order details and tracking information
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-base md:text-lg text-gray-800 font-medium">
                      We&apos;ll prepare your order fresh
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Our team is already getting started on your delicious items
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-base md:text-lg text-gray-800 font-medium">
                      Delivery options will be coordinated
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Based on your checkout selection and preferences
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/" className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto px-8 py-6 text-lg font-semibold border-2 border-pink-300 hover:border-pink-500 hover:bg-pink-50 transition-all duration-300"
                >
                  Return Home
                </Button>
              </Link>
              <Link href="/menu" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto px-8 py-6 text-lg font-semibold bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <span className="flex items-center gap-2">
                    Order More
                    <ArrowRight size={20} />
                  </span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Decorative Bottom Wave */}
          <div className="h-3 bg-gradient-to-r from-pink-400 via-pink-500 to-pink-400"></div>
        </div>

        {/* Trust Badge */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            🔒 Secure payment processed | 💚 Crafted with love
          </p>
        </div>
      </div>
    </div>
  );
}
