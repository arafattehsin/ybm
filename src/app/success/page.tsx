'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/components/ui';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';

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
    <div className="py-16 md:py-24">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <CheckCircle size={80} className="mx-auto text-green-500 mb-6" />

        <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
          Thank You for Your Order!
        </h1>

        <p className="text-lg text-gray-600 mb-4">
          Your order has been received and is being prepared with love.
        </p>

        <p className="text-gray-500 mb-8">
          You will receive a confirmation email shortly with your order details.
          If you have any questions, please don&apos;t hesitate to contact us.
        </p>

        <div className="bg-amber-50 rounded-lg p-6 mb-8">
          <h2 className="font-semibold text-gray-900 mb-2">What&apos;s Next?</h2>
          <ul className="text-left text-gray-600 space-y-2">
            <li>• You&apos;ll receive an email confirmation shortly</li>
            <li>• We&apos;ll prepare your order fresh</li>
            <li>• Delivery options will be coordinated as per your checkout selection</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="outline">Return Home</Button>
          </Link>
          <Link href="/menu">
            <Button>
              Order More
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
