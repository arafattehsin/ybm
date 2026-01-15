'use client';

import { useState } from 'react';
import { useCartStore } from '@/stores/cartStore';
import { formatPrice } from '@/lib/constants';
import { Button } from '@/components/ui';
import { Loader2, Truck, MapPin, AlertCircle } from 'lucide-react';
import { getDeliveryFeeByPostcode, isDeliveryAvailable } from '@/lib/postcodes';

export function CartSummary() {
  const { items, getTotalPrice } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [postcode, setPostcode] = useState('');
  const [postcodeError, setPostcodeError] = useState('');
  const [deliveryFee, setDeliveryFee] = useState(0);

  const subtotal = getTotalPrice();
  const totalPrice = subtotal + deliveryFee;

  const handlePostcodeCheck = () => {
    const trimmedPostcode = postcode.trim();
    
    if (!trimmedPostcode) {
      setPostcodeError('Please enter a postcode');
      setDeliveryFee(0);
      return;
    }

    if (!/^\d{4}$/.test(trimmedPostcode)) {
      setPostcodeError('Please enter a valid 4-digit postcode');
      setDeliveryFee(0);
      return;
    }

    const fee = getDeliveryFeeByPostcode(trimmedPostcode);
    
    if (fee === null) {
      setPostcodeError('Sorry, delivery is not available to this postcode');
      setDeliveryFee(0);
    } else {
      setPostcodeError('');
      setDeliveryFee(fee);
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;

    // Validate delivery details if delivery is selected
    if (deliveryMethod === 'delivery') {
      if (!postcode.trim()) {
        setPostcodeError('Please enter your postcode');
        return;
      }
      if (!isDeliveryAvailable(postcode.trim())) {
        setPostcodeError('Please check if delivery is available to your postcode');
        return;
      }
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            size: item.size.name,
            addons: item.addons.map((a) => a.name),
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
          deliveryMethod,
          deliveryPostcode: deliveryMethod === 'delivery' ? postcode.trim() : undefined,
        }),
      });

      const data = await response.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 space-y-4">
      {/* Delivery Method Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Delivery Method
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors hover:border-gray-300 bg-white">
            <input
              type="radio"
              value="pickup"
              checked={deliveryMethod === 'pickup'}
              onChange={(e) => {
                setDeliveryMethod(e.target.value as 'pickup');
                setDeliveryFee(0);
                setPostcodeError('');
              }}
              className="w-4 h-4 text-amber-600"
            />
            <MapPin size={20} className="text-gray-600" />
            <div className="flex-1">
              <div className="font-medium">Pickup</div>
              <div className="text-sm text-gray-500">Free - 1-2 business days</div>
            </div>
            <span className="font-semibold text-green-600">FREE</span>
          </label>

          <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors hover:border-gray-300 bg-white">
            <input
              type="radio"
              value="delivery"
              checked={deliveryMethod === 'delivery'}
              onChange={(e) => setDeliveryMethod(e.target.value as 'delivery')}
              className="w-4 h-4 text-amber-600"
            />
            <Truck size={20} className="text-gray-600" />
            <div className="flex-1">
              <div className="font-medium">Delivery</div>
              <div className="text-sm text-gray-500">Greater Sydney - 1-3 business days</div>
            </div>
            {deliveryFee > 0 && (
              <span className="font-semibold">{formatPrice(deliveryFee)}</span>
            )}
          </label>
        </div>
      </div>

      {/* Postcode Input for Delivery */}
      {deliveryMethod === 'delivery' && (
        <div>
          <label htmlFor="postcode" className="block text-sm font-medium text-gray-700 mb-2">
            Delivery Postcode
          </label>
          <div className="flex gap-2">
            <input
              id="postcode"
              type="text"
              value={postcode}
              onChange={(e) => {
                setPostcode(e.target.value);
                setPostcodeError('');
              }}
              placeholder="e.g. 2000"
              maxLength={4}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            <Button
              type="button"
              onClick={handlePostcodeCheck}
              variant="outline"
              className="whitespace-nowrap"
            >
              Check
            </Button>
          </div>
          {postcodeError && (
            <div className="flex items-start gap-2 mt-2 text-sm text-red-600">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{postcodeError}</span>
            </div>
          )}
          {!postcodeError && deliveryFee > 0 && (
            <div className="flex items-start gap-2 mt-2 text-sm text-green-600">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>Delivery available! Fee: {formatPrice(deliveryFee)}</span>
            </div>
          )}
        </div>
      )}

      {/* Subtotal */}
      <div className="border-t pt-4">
        <div className="flex justify-between text-gray-700 mb-2">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {deliveryFee > 0 && (
          <div className="flex justify-between text-gray-700 mb-2">
            <span>Delivery</span>
            <span>{formatPrice(deliveryFee)}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-semibold pt-2 border-t">
          <span>Total</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <Button
        onClick={handleCheckout}
        disabled={items.length === 0 || isLoading}
        size="lg"
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 size={20} className="mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          'PROCEED TO CHECKOUT'
        )}
      </Button>

      {/* Note */}
      <p className="text-sm text-gray-500 text-center">
        Payment will be authorized but not charged until order is confirmed
      </p>
    </div>
  );
}
