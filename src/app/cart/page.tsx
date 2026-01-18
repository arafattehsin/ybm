'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useCartStore } from '@/stores/cartStore';
import { CartItem, CartSummary } from '@/components/cart';
import { ShoppingBag, ArrowLeft, Sparkles } from 'lucide-react';

export default function CartPage() {
  const { items, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );

      if (shapesRef.current) {
        const shapes = shapesRef.current.children;
        Array.from(shapes).forEach((shape, index) => {
          gsap.to(shape, {
            y: `random(-25, 25)`,
            x: `random(-20, 20)`,
            rotation: `random(-10, 10)`,
            duration: 5 + index * 0.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  if (totalItems === 0) {
    return (
      <div ref={sectionRef} className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-hero">
        {/* Background Shapes */}
        <div ref={shapesRef} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 bg-pink-100/40 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-pink-50/50 rounded-full blur-3xl" />
        </div>

        <div ref={contentRef} className="relative z-10 max-w-2xl mx-auto px-4 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <ShoppingBag size={48} className="text-pink-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-serif mb-4">
            <span className="gradient-text">Your Cart is Empty</span>
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Looks like you haven&apos;t added any delicious treats yet! Browse our menu to find something sweet.
          </p>
          <Link href="/menu">
            <button className="btn-gradient px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2 mx-auto">
              <ArrowLeft size={20} />
              Browse Menu
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-pink-50 to-white">
      {/* Background Shapes */}
      <div ref={shapesRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-pink-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-10 w-80 h-80 bg-pink-50/50 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-white/60 rounded-full blur-2xl" />
      </div>

      <div ref={contentRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header */}
        <div className="mb-10">
          <span className="inline-block px-4 py-1 bg-pink-100 text-pink-600 rounded-full text-sm font-semibold uppercase tracking-wider mb-4">
            Shopping Cart
          </span>
          <h1 className="text-3xl md:text-4xl font-bold font-serif">
            <span className="gradient-text">Your Cart</span>
            <span className="text-gray-800"> ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-pink-100 p-6 shadow-lg">
              {items.map((item, index) => (
                <div key={item.id} className={index < items.length - 1 ? 'border-b border-pink-100 pb-6 mb-6' : ''}>
                  <CartItem item={item} />
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 transition-colors font-medium group"
            >
              <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
              Continue Shopping
            </Link>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <CartSummary />
              
              {/* Secure Checkout Badge */}
              <div className="mt-4 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-pink-100 text-center">
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <Sparkles className="w-5 h-5 text-pink-500" />
                  <span className="text-sm">Secure checkout powered by Stripe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
