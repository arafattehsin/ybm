'use client';

import { useState } from 'react';
import { useCartStore } from '@/stores/cartStore';
import { formatPrice } from '@/lib/constants';
import { Loader2, Truck, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
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
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-pink-100 space-y-5">
      <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
      
      {/* Delivery Method Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Delivery Method
        </label>
        <div className="space-y-2">
          <label className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border-2 ${
            deliveryMethod === 'pickup' 
              ? 'border-pink-500 bg-pink-50' 
              : 'border-pink-100 bg-white hover:border-pink-300'
          }`}>
            <input
              type="radio"
              value="pickup"
              checked={deliveryMethod === 'pickup'}
              onChange={(e) => {
                setDeliveryMethod(e.target.value as 'pickup');
                setDeliveryFee(0);
                setPostcodeError('');
              }}
              className="w-4 h-4 text-pink-600 focus:ring-pink-500"
            />
            <MapPin size={20} className="text-pink-600" />
            <div className="flex-1">
              <div className="font-medium text-gray-900">Pickup</div>
              <div className="text-sm text-gray-500">Free - 1-2 business days</div>
            </div>
            <span className="font-bold text-green-600 text-sm">FREE</span>
          </label>

          <label className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border-2 ${
            deliveryMethod === 'delivery' 
              ? 'border-pink-500 bg-pink-50' 
              : 'border-pink-100 bg-white hover:border-pink-300'
          }`}>
            <input
              type="radio"
              value="delivery"
              checked={deliveryMethod === 'delivery'}
              onChange={(e) => setDeliveryMethod(e.target.value as 'delivery')}
              className="w-4 h-4 text-pink-600 focus:ring-pink-500"
            />
            <Truck size={20} className="text-pink-600" />
            <div className="flex-1">
              <div className="font-medium text-gray-900">Delivery</div>
              <div className="text-sm text-gray-500">Greater Sydney - 1-3 days</div>
            </div>
            {deliveryFee > 0 && (
              <span className="font-bold text-pink-600">{formatPrice(deliveryFee)}</span>
            )}
          </label>
        </div>
      </div>

      {/* Postcode Input for Delivery */}
      {deliveryMethod === 'delivery' && (
        <div>
          <label htmlFor="postcode" className="block text-sm font-semibold text-gray-700 mb-2">
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
              className="flex-1 px-4 py-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-500 transition-all outline-none"
            />
            <button
              type="button"
              onClick={handlePostcodeCheck}
              className="px-5 py-3 bg-white border-2 border-pink-500 text-pink-600 font-semibold rounded-xl hover:bg-pink-50 transition-colors"
            >
              Check
            </button>
          </div>
          {postcodeError && (
            <div className="flex items-start gap-2 mt-2 text-sm text-red-600">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{postcodeError}</span>
            </div>
          )}
          {!postcodeError && deliveryFee > 0 && (
            <div className="flex items-start gap-2 mt-2 text-sm text-green-600">
              <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>Delivery available! Fee: {formatPrice(deliveryFee)}</span>
            </div>
          )}
        </div>
      )}

      {/* Subtotal */}
      <div className="border-t border-pink-200 pt-4">
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
        <div className="flex justify-between text-xl font-bold pt-3 border-t border-pink-200">
          <span>Total</span>
          <span className="text-pink-600">{formatPrice(totalPrice)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={items.length === 0 || isLoading}
        className={`w-full btn-gradient py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
          items.length === 0 || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:-translate-y-0.5'
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Processing...
          </>
        ) : (
          'Proceed to Checkout'
        )}
      </button>

      {/* Note */}
      <p className="text-sm text-gray-500 text-center">
        Payment will be authorized but not charged until order is confirmed
      </p>
    </div>
  );
}
