'use client';

import Image from 'next/image';
import type { CartItem as CartItemType } from '@/types';
import { formatPrice } from '@/lib/constants';
import { useCartStore } from '@/stores/cartStore';
import { Minus, Plus, X } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex gap-4">
      {/* Image */}
      <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-pink-50 to-white shadow-md">
        <Image
          src={item.image}
          alt={item.productName}
          fill
          className="object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <h3 className="font-bold text-gray-900 line-clamp-1 text-lg">
            {item.productName}
          </h3>
          <button
            onClick={() => removeItem(item.id)}
            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
            aria-label="Remove item"
          >
            <X size={18} />
          </button>
        </div>
        
        <p className="text-base text-gray-500 mt-1">Size: {item.size.name}</p>
        {item.addons.length > 0 && (
          <p className="text-base text-gray-500">
            Add-ons: {item.addons.map((a) => a.name).join(', ')}
          </p>
        )}

        <div className="flex items-center justify-between mt-3">
          {/* Quantity Controls */}
          <div className="flex items-center bg-white border border-pink-200 rounded-lg overflow-hidden">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="p-2 hover:bg-pink-50 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={14} className="text-gray-600" />
            </button>
            <span className="px-4 py-2 text-base font-bold">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="p-2 hover:bg-pink-50 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={14} className="text-gray-600" />
            </button>
          </div>

          {/* Price */}
          <p className="font-bold text-pink-600 text-xl">
            {formatPrice(item.totalPrice)}
          </p>
        </div>
      </div>
    </div>
  );
}
