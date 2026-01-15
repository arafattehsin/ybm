'use client';

import Link from 'next/link';
import { useCartStore } from '@/stores/cartStore';
import { CartItem, CartSummary } from '@/components/cart';
import { Button } from '@/components/ui';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const { items, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  if (totalItems === 0) {
    return (
      <div className="py-16 md:py-24">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-300 mb-6" />
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4">
            Your cart is empty
          </h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven&apos;t added any delicious treats yet!
          </p>
          <Link href="/menu">
            <Button size="lg">
              <ArrowLeft size={20} className="mr-2" />
              Browse Menu
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">
            Your Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            {/* Continue Shopping */}
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 mt-4 text-amber-600 hover:text-amber-700 transition-colors"
            >
              <ArrowLeft size={18} />
              Continue Shopping
            </Link>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
