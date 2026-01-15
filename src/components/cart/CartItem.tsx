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
    <div className="flex gap-4 py-4 border-b border-gray-200">
      {/* Remove Button */}
      <button
        onClick={() => removeItem(item.id)}
        className="text-gray-400 hover:text-red-500 transition-colors self-start"
        aria-label="Remove item"
      >
        <X size={20} />
      </button>

      {/* Image */}
      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
        <Image
          src={item.image}
          alt={item.productName}
          fill
          className="object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">
          {item.productName}
        </h3>
        <p className="text-sm text-gray-500">Size: {item.size.name}</p>
        {item.addons.length > 0 && (
          <p className="text-sm text-gray-500">
            Add-ons: {item.addons.map((a) => a.name).join(', ')}
          </p>
        )}

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center border border-gray-300 rounded">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="p-1 hover:bg-gray-100 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="p-1 hover:bg-gray-100 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="text-right">
        <p className="font-semibold text-gray-900">
          {formatPrice(item.totalPrice)}
        </p>
      </div>
    </div>
  );
}
