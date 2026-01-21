'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useCartStore } from '@/stores/cartStore';
import { CartItem, CartSummary } from '@/components/cart';
import { ShoppingBag, ArrowLeft, Sparkles, Gift, Heart } from 'lucide-react';

export default function CartClient() {
  const { items, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);

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
            y: `random(-30, 30)`,
            x: `random(-25, 25)`,
            rotation: `random(-15, 15)`,
            duration: 4 + index * 0.3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          });
        });
      }

      // Floating decorations
      if (floatingRef.current) {
        const floats = floatingRef.current.children;
        Array.from(floats).forEach((float, index) => {
          gsap.to(float, {
            y: `random(-20, 20)`,
            rotation: `random(-10, 10)`,
            duration: 3 + index * 0.5,
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
          <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-pink-200/30 rounded-full blur-2xl" />
        </div>

        <div ref={contentRef} className="relative z-10 max-w-2xl mx-auto px-4 text-center">
          <div className="w-28 h-28 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <ShoppingBag size={56} className="text-pink-500" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-heading mb-4">
            <span className="gradient-text">Your Cart is Empty</span>
          </h1>
          <p className="text-gray-600 text-lg mb-8 font-body">
            Looks like you haven&apos;t added any delicious treats yet! Browse our menu to find something sweet.
          </p>
          <Link href="/menu">
            <button className="btn-gradient px-8 py-4 rounded-full font-heading font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2 mx-auto">
              <ArrowLeft size={20} />
              Browse Menu
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="relative min-h-screen overflow-hidden" style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF5F8 30%, #FFEBEF 60%, #FFF0F5 100%)' }}>
      {/* Animated Background Shapes */}
      <div ref={shapesRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-20 w-72 h-72 bg-pink-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-10 w-96 h-96 bg-pink-100/50 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-56 h-56 bg-white/70 rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-1/3 w-48 h-48 bg-pink-50/60 rounded-full blur-3xl" />
        
        {/* Decorative shapes */}
        <div className="absolute top-32 left-1/3 w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full opacity-30" />
        <div className="absolute top-48 right-40 w-6 h-6 bg-gradient-to-br from-pink-300 to-pink-400 rounded-full opacity-40" />
        <div className="absolute bottom-60 left-20 w-10 h-10 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full opacity-50" />
      </div>

      {/* Floating Decorations */}
      <div ref={floatingRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-24 right-16 text-pink-300 opacity-40">
          <Heart size={32} fill="currentColor" />
        </div>
        <div className="absolute top-1/2 left-12 text-pink-200 opacity-50">
          <Gift size={40} />
        </div>
        <div className="absolute bottom-32 right-24 text-pink-300 opacity-30">
          <Sparkles size={36} />
        </div>
      </div>

      <div ref={contentRef} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-5 py-2 bg-pink-100 text-pink-600 rounded-full text-sm font-heading font-semibold uppercase tracking-wider mb-4">
            <ShoppingBag className="inline w-4 h-4 mr-2" />
            Shopping Cart
          </span>
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-3">
            <span className="gradient-text">Your Cart</span>
          </h1>
          <p className="text-gray-600 text-lg font-body">
            You have <span className="text-pink-600 font-semibold">{totalItems}</span> {totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {/* Vertical Layout */}
        <div className="space-y-8">
          {/* Cart Items Section */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-pink-100 p-6 md:p-8 shadow-xl">
            <h2 className="text-xl font-bold font-heading text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                <span className="text-pink-600 text-sm font-bold">{totalItems}</span>
              </span>
              Your Items
            </h2>
            <div className="divide-y divide-pink-100">
              {items.map((item) => (
                <div key={item.id} className="py-6 first:pt-0 last:pb-0">
                  <CartItem item={item} />
                </div>
              ))}
            </div>
          </div>

          {/* Continue Shopping Link */}
          <div className="flex justify-center">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 transition-colors font-heading font-medium group bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-md hover:shadow-lg"
            >
              <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary Section - Full Width */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-pink-100 p-6 md:p-10 shadow-xl">
            <CartSummary />
          </div>
          
          {/* Secure Checkout Badge */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-pink-100 text-center shadow-lg">
            <div className="flex items-center justify-center gap-3 text-gray-600">
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-pink-500" />
              </div>
              <div className="text-left">
                <p className="font-heading font-semibold text-gray-800">Secure Checkout</p>
                <p className="text-sm text-gray-500 font-body">Powered by Stripe</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

