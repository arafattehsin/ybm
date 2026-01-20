'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { ButtonLoader } from '@/components/ui';
import type { CartItem } from '@/types';
import { formatAmount } from '@/lib/stripe';

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

interface StripeCheckoutProps {
  items: CartItem[];
  deliveryMethod: 'pickup' | 'delivery';
  deliveryPostcode?: string;
  customerEmail?: string;
  customerName?: string;
  onSuccess?: (paymentIntentId: string) => void;
  onError?: (error: string) => void;
}

interface CheckoutFormProps extends StripeCheckoutProps {
  clientSecret: string;
}

/**
 * Checkout form component that handles the payment
 */
function CheckoutForm({
  items,
  deliveryMethod,
  deliveryPostcode,
  customerEmail,
  customerName,
  onSuccess,
  onError,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Calculate total
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Confirm the payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
          receipt_email: customerEmail,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'An error occurred');
        onError?.(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess?.(paymentIntent.id);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setErrorMessage(message);
      onError?.(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
        <div className="space-y-2 text-sm">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>
                {item.productName} ({item.size.name}) x {item.quantity}
              </span>
              <span>{formatAmount(item.totalPrice)}</span>
            </div>
          ))}
          <div className="border-t pt-2 mt-2 font-semibold flex justify-between">
            <span>Subtotal</span>
            <span>{formatAmount(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Delivery ({deliveryMethod})</span>
            <span>{deliveryMethod === 'pickup' ? 'Free' : 'Calculated'}</span>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      {customerName && (
        <div className="text-sm">
          <p className="font-medium">Customer: {customerName}</p>
          {customerEmail && <p className="text-gray-600">{customerEmail}</p>}
          {deliveryPostcode && (
            <p className="text-gray-600">Delivery to: {deliveryPostcode}</p>
          )}
        </div>
      )}

      {/* Stripe Payment Element */}
      <div className="border rounded-lg p-4">
        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {errorMessage}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
          !stripe || isProcessing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isProcessing ? (
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
            Processing...
          </span>
        ) : (
          `Pay ${formatAmount(subtotal)}`
        )}
      </button>

      {/* Security Notice */}
      <p className="text-xs text-center text-gray-500">
        🔒 Payments are securely processed by Stripe
      </p>
    </form>
  );
}

/**
 * Main Stripe Checkout component wrapper
 */
export default function StripeCheckout(props: StripeCheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInitiateCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: props.items,
          deliveryMethod: props.deliveryMethod,
          deliveryPostcode: props.deliveryPostcode,
          customerEmail: props.customerEmail,
          customerName: props.customerName,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create payment intent');
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      props.onError?.(message);
    } finally {
      setLoading(false);
    }
  };

  if (!clientSecret) {
    return (
      <div className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <button
          onClick={handleInitiateCheckout}
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors flex items-center justify-center gap-2 ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? (
            <>
              <ButtonLoader className="w-5 h-5" />
              Loading...
            </>
          ) : (
            'Proceed to Payment'
          )}
        </button>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#2563eb',
            colorBackground: '#ffffff',
            colorText: '#1f2937',
            colorDanger: '#ef4444',
            fontFamily: 'system-ui, sans-serif',
            borderRadius: '8px',
          },
        },
      }}
    >
      <CheckoutForm clientSecret={clientSecret} {...props} />
    </Elements>
  );
}

