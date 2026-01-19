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
  
  // Delivery address fields
  const [streetAddress, setStreetAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [addressError, setAddressError] = useState('');
  const [postcodeValidated, setPostcodeValidated] = useState(false);

  const subtotal = getTotalPrice();
  const totalPrice = subtotal + deliveryFee;

  // Auto-validate postcode as user types
  const handlePostcodeChange = (value: string) => {
    setPostcode(value);
    const trimmedPostcode = value.trim();
    
    // Clear errors if empty
    if (!trimmedPostcode) {
      setPostcodeError('');
      setDeliveryFee(0);
      setPostcodeValidated(false);
      return;
    }

    // Check if it's a valid 4-digit postcode
    if (!/^\d{4}$/.test(trimmedPostcode)) {
      if (trimmedPostcode.length === 4) {
        setPostcodeError('Please enter a valid 4-digit postcode');
      } else {
        setPostcodeError('');
      }
      setDeliveryFee(0);
      setPostcodeValidated(false);
      return;
    }

    // Check if delivery is available for this postcode
    const fee = getDeliveryFeeByPostcode(trimmedPostcode);
    
    if (fee === null) {
      setPostcodeError('Sorry, delivery is not available to this postcode');
      setDeliveryFee(0);
      setPostcodeValidated(false);
    } else {
      setPostcodeError('');
      setDeliveryFee(fee);
      setPostcodeValidated(true);
    }
  };

  // Check if checkout should be enabled
  const isCheckoutDisabled = () => {
    if (items.length === 0 || isLoading) return true;
    
    if (deliveryMethod === 'delivery') {
      // All required fields must be filled
      if (!streetAddress.trim() || !city.trim() || !postcode.trim() || !phone.trim()) {
        return true;
      }
      // Postcode must be validated and have no errors
      if (postcodeError || !postcodeValidated) {
        return true;
      }
    }
    
    return false;
  };

  const validateDeliveryDetails = (): boolean => {
    if (deliveryMethod === 'delivery') {
      if (!streetAddress.trim()) {
        setAddressError('Please enter your street address');
        return false;
      }
      if (!city.trim()) {
        setAddressError('Please enter your town/city');
        return false;
      }
      if (!postcode.trim()) {
        setAddressError('Please enter your postcode');
        return false;
      }
      if (!phone.trim()) {
        setAddressError('Please enter your phone number');
        return false;
      }
      if (!isDeliveryAvailable(postcode.trim())) {
        setAddressError('Delivery is not available to this postcode');
        return false;
      }
      setAddressError('');
    }
    return true;
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;

    // Validate delivery details if delivery is selected
    if (!validateDeliveryDetails()) {
      return;
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
          deliveryAddress: deliveryMethod === 'delivery' ? {
            street: streetAddress.trim(),
            apartment: apartment.trim(),
            city: city.trim(),
            state: 'New South Wales',
            postcode: postcode.trim(),
            phone: phone.trim(),
          } : undefined,
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
      <h2 className="text-3xl font-bold font-heading text-gray-900 flex items-center gap-2">
        <span className="w-2 h-8 bg-gradient-to-b from-pink-500 to-pink-400 rounded-full"></span>
        Order Summary
      </h2>
      
      {/* Delivery Method Selection */}
      <div>
        <label className="block text-base font-heading font-semibold text-gray-700 mb-3">
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
            <MapPin size={22} className="text-pink-600" />
            <div className="flex-1">
              <div className="font-heading font-medium text-gray-900 text-base">Pickup</div>
              <div className="text-base text-gray-500 font-body">Free - 3-4 business days</div>
            </div>
            <span className="font-heading font-bold text-green-600 text-base bg-green-50 px-3 py-1 rounded-full">FREE</span>
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
            <Truck size={22} className="text-pink-600" />
            <div className="flex-1">
              <div className="font-heading font-medium text-gray-900 text-base">Delivery</div>
              <div className="text-base text-gray-500 font-body">Greater Sydney - 4-5 business days</div>
            </div>
            {deliveryFee > 0 && (
              <span className="font-heading font-bold text-pink-600 bg-pink-50 px-3 py-1 rounded-full text-base">{formatPrice(deliveryFee)}</span>
            )}
          </label>
        </div>
      </div>

      {/* Delivery Address Form */}
      {deliveryMethod === 'delivery' && (
        <div className="bg-pink-50/50 rounded-2xl p-5 space-y-4">
          <h3 className="text-base font-heading font-semibold text-gray-700 mb-3">
            Delivery Address (Greater Sydney, NSW)
          </h3>
          
          {addressError && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-body">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{addressError}</span>
            </div>
          )}

          {/* Street Address */}
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label htmlFor="street" className="block text-xs font-medium text-gray-600 mb-2">
                Street address *
              </label>
              <input
                id="street"
                type="text"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                placeholder="123 Main Street"
                className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-500 transition-all outline-none font-body"
                required
              />
            </div>
            <div>
              <label htmlFor="apartment" className="block text-xs font-medium text-gray-600 mb-2">
                Apartment, suite, unit, etc. (optional)
              </label>
              <input
                id="apartment"
                type="text"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
                placeholder="Apt 4B"
                className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-500 transition-all outline-none font-body"
              />
            </div>
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className="block text-xs font-medium text-gray-600 mb-2">
              Town / City *
            </label>
            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Sydney"
              className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-500 transition-all outline-none font-body"
              required
            />
          </div>

          {/* State and Postcode */}
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label htmlFor="state" className="block text-xs font-medium text-gray-600 mb-2">
                State *
              </label>
              <input
                id="state"
                type="text"
                value="New South Wales"
                disabled
                className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl bg-gray-50 text-gray-600 font-body cursor-not-allowed"
              />
            </div>
            <div>
              <label htmlFor="postcode" className="block text-xs font-medium text-gray-600 mb-2">
                Postcode *
              </label>
              <input
                id="postcode"
                type="text"
                value={postcode}
                onChange={(e) => handlePostcodeChange(e.target.value)}
                placeholder="2118"
                maxLength={4}
                className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-500 transition-all outline-none font-body"
                required
              />
              {postcodeError && (
                <div className="flex items-start gap-1 mt-2 text-xs text-red-600 font-body">
                  <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                  <span>{postcodeError}</span>
                </div>
              )}
              {!postcodeError && postcodeValidated && (
                <div className="flex items-start gap-1 mt-2 text-xs text-green-600 font-body">
                  <CheckCircle size={14} className="mt-0.5 flex-shrink-0" />
                  <span>
                    {deliveryFee === 0 
                      ? 'Delivery available! FREE delivery' 
                      : `Delivery available! ${formatPrice(deliveryFee)} delivery fee`
                    }
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-xs font-medium text-gray-600 mb-2">
              Phone *
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0412 345 678"
              className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-500 transition-all outline-none font-body"
              required
            />
          </div>
        </div>
      )}

      {/* Subtotal */}
      <div className="border-t-2 border-pink-100 pt-6 space-y-3">
        <div className="flex justify-between text-gray-700 font-body text-xl">
          <span>Subtotal</span>
          <span className="font-semibold">{formatPrice(subtotal)}</span>
        </div>
        {deliveryFee > 0 && (
          <div className="flex justify-between text-gray-700 font-body text-xl">
            <span>Delivery</span>
            <span className="font-semibold">{formatPrice(deliveryFee)}</span>
          </div>
        )}
        <div className="flex justify-between text-3xl font-bold pt-4 border-t-2 border-pink-100">
          <span className="font-heading">Total</span>
          <span className="gradient-text font-heading">{formatPrice(totalPrice)}</span>
        </div>
      </div>

      {/* Important Note Before Checkout */}
      <div className="bg-pink-50 border-2 border-pink-200 rounded-2xl p-5 space-y-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-6 h-6 text-pink-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 space-y-2">
            <p className="text-lg font-bold text-gray-900 font-heading">
              Important Information
            </p>
            <p className="text-base text-gray-700 font-body">
              • Delivery orders must be placed before 4 business days. All orders will be delivered within 5 PM to 9 PM window.
            </p>
            <p className="text-base text-gray-700 font-body">
              • If recipient is not at the delivery address, we will try to contact them for 10 minutes and then leave the order at the door/entrance of the property. If it is an apartment building, we will leave at the main entrance.
            </p>
            <p className="text-base text-gray-700 font-body">
              • For any delivery timing adjustments, please contact us on <span className="font-semibold text-pink-600">WhatsApp only</span> at +61422918748.
            </p>
            <p className="text-base text-gray-700 font-body">
              • Pickup orders need to be placed at least 3 business days before pickup.
            </p>
            <p className="text-base text-gray-700 font-body">
              • If you want orders delivered/picked up earlier, please contact us to check availability. All orders are subject to confirmation.
            </p>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={isCheckoutDisabled()}
        className={`w-full btn-gradient py-5 rounded-2xl font-heading font-semibold text-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-3 ${
          isCheckoutDisabled() ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:-translate-y-0.5'
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
