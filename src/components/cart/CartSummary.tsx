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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-heading text-gray-900 flex items-center gap-2">
        <span className="w-2 h-8 bg-gradient-to-b from-pink-500 to-pink-400 rounded-full"></span>
        Order Summary
      </h2>
      
      {/* Delivery Method Selection */}
      <div>
        <label className="block text-sm font-heading font-semibold text-gray-700 mb-3">
          Delivery Method
        </label>
        <div className="grid md:grid-cols-2 gap-4">
          <label className={`flex items-center gap-3 p-5 rounded-2xl cursor-pointer transition-all border-2 ${
            deliveryMethod === 'pickup' 
              ? 'border-pink-500 bg-pink-50 shadow-md' 
              : 'border-pink-100 bg-white hover:border-pink-300 hover:shadow-sm'
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
              <div className="font-heading font-medium text-gray-900">Pickup</div>
              <div className="text-sm text-gray-500 font-body">Free - 1-2 business days</div>
            </div>
            <span className="font-heading font-bold text-green-600 text-sm bg-green-50 px-3 py-1 rounded-full">FREE</span>
          </label>

          <label className={`flex items-center gap-3 p-5 rounded-2xl cursor-pointer transition-all border-2 ${
            deliveryMethod === 'delivery' 
              ? 'border-pink-500 bg-pink-50 shadow-md' 
              : 'border-pink-100 bg-white hover:border-pink-300 hover:shadow-sm'
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
              <div className="font-heading font-medium text-gray-900">Delivery</div>
              <div className="text-sm text-gray-500 font-body">Greater Sydney - 1-3 days</div>
            </div>
            {deliveryFee > 0 && (
              <span className="font-heading font-bold text-pink-600 bg-pink-50 px-3 py-1 rounded-full">{formatPrice(deliveryFee)}</span>
            )}
          </label>
        </div>
      </div>

      {/* Postcode Input for Delivery */}
      {deliveryMethod === 'delivery' && (
        <div className="bg-pink-50/50 rounded-2xl p-5">
          <label htmlFor="postcode" className="block text-sm font-heading font-semibold text-gray-700 mb-3">
            Delivery Postcode
          </label>
          <div className="flex gap-3">
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
              className="flex-1 px-5 py-4 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-500 transition-all outline-none font-body text-lg"
            />
            <button
              type="button"
              onClick={handlePostcodeCheck}
              className="px-6 py-4 bg-white border-2 border-pink-500 text-pink-600 font-heading font-semibold rounded-xl hover:bg-pink-50 transition-colors"
            >
              Check
            </button>
          </div>
          {postcodeError && (
            <div className="flex items-start gap-2 mt-3 text-sm text-red-600 font-body">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{postcodeError}</span>
            </div>
          )}
          {!postcodeError && deliveryFee > 0 && (
            <div className="flex items-start gap-2 mt-3 text-sm text-green-600 font-body">
              <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>Delivery available! Fee: {formatPrice(deliveryFee)}</span>
            </div>
          )}
        </div>
      )}

      {/* Subtotal */}
      <div className="border-t-2 border-pink-100 pt-6 space-y-3">
        <div className="flex justify-between text-gray-700 font-body text-lg">
          <span>Subtotal</span>
          <span className="font-semibold">{formatPrice(subtotal)}</span>
        </div>
        {deliveryFee > 0 && (
          <div className="flex justify-between text-gray-700 font-body text-lg">
            <span>Delivery</span>
            <span className="font-semibold">{formatPrice(deliveryFee)}</span>
          </div>
        )}
        <div className="flex justify-between text-2xl font-bold pt-4 border-t-2 border-pink-100">
          <span className="font-heading">Total</span>
          <span className="gradient-text font-heading">{formatPrice(totalPrice)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={items.length === 0 || isLoading}
        className={`w-full btn-gradient py-5 rounded-2xl font-heading font-semibold text-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-3 ${
          items.length === 0 || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:-translate-y-0.5'
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 size={24} className="animate-spin" />
            Processing...
          </>
        ) : (
          'Proceed to Checkout'
        )}
      </button>

      {/* Note */}
      <p className="text-sm text-gray-500 text-center font-body">
        Payment will be authorized but not charged until order is confirmed
      </p>
    </div>
  );
}
