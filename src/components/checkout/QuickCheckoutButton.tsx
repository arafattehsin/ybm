'use client';

import { useState } from 'react';
import type { CartItem } from '@/types';

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
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </span>
        ) : (
          'Proceed to Checkout'
        )}
      </button>
    </div>
  );
}
