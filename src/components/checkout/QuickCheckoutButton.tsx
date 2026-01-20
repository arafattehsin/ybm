'use client';

import { useState } from 'react';
import type { CartItem } from '@/types';
import { ButtonLoader } from '@/components/ui';

interface QuickCheckoutButtonProps {
  items: CartItem[];
  deliveryMethod: 'pickup' | 'delivery';
  deliveryPostcode?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Simple button that redirects to Stripe Checkout Session
 * This uses the existing /api/checkout endpoint
 */
export default function QuickCheckoutButton({
  items,
  deliveryMethod,
  deliveryPostcode,
  disabled,
  className,
}: QuickCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (disabled || items.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      // Convert CartItem format to what the API expects
      const checkoutItems = items.map((item) => ({
        productName: item.productName,
        size: item.size.name,
        addons: item.addons.map((addon) => addon.name),
        quantity: item.quantity,
        unitPrice: item.totalPrice,
      }));

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: checkoutItems,
          deliveryMethod,
          deliveryPostcode,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
          {error}
        </div>
      )}
      <button
        onClick={handleCheckout}
        disabled={disabled || isLoading || items.length === 0}
        className={
          className ||
          `w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
            disabled || isLoading || items.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`
        }
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <ButtonLoader className="w-5 h-5" />
            Loading...
          </span>
        ) : (
          'Proceed to Checkout'
        )}
      </button>
    </div>
  );
}

