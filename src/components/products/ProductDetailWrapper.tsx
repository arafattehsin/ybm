'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Product, Size, Addon } from '@/types';
import { formatPrice, formatPriceRange } from '@/lib/constants';
import { useCartStore } from '@/stores/cartStore';
import { Minus, Plus, Check, Share2, ArrowLeft, ShoppingCart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ProductDetailWrapperProps {
  product: Product;
  addons: Addon[];
  relatedProducts: Product[];
}

export function ProductDetailWrapper({ product, addons, relatedProducts }: ProductDetailWrapperProps) {
  const [selectedSize, setSelectedSize] = useState<Size>(product.sizes[0]);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const relatedRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);

  const addItem = useCartStore((state) => state.addItem);

  // Calculate total price
  const unitPrice = useMemo(() => {
    const addonTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
    return selectedSize.price + addonTotal;
  }, [selectedSize, selectedAddons]);

  const totalPrice = unitPrice * quantity;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(imageRef.current,
        { opacity: 0, x: -50, scale: 0.95 },
        { opacity: 1, x: 0, scale: 1, duration: 0.8, ease: 'power3.out' }
      );

      gsap.fromTo(contentRef.current,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' }
      );

      if (relatedRef.current) {
        gsap.fromTo(relatedRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            scrollTrigger: {
              trigger: relatedRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

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

  const handleAddonToggle = (addon: Addon) => {
    setSelectedAddons((prev) =>
      prev.some((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      image: product.images[0],
      size: selectedSize,
      addons: selectedAddons,
      quantity,
      unitPrice,
    });

    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-pink-50 to-white">
      {/* Background Shapes */}
      <div ref={shapesRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-pink-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-10 w-80 h-80 bg-pink-50/50 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-white/60 rounded-full blur-2xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Back Button */}
        <Link 
          href="/menu"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span>Back to Menu</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div ref={imageRef} className="space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-pink-50 to-white shadow-xl">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                priority
              />
              
              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-pink-600 text-sm font-semibold rounded-full uppercase shadow-lg">
                  {product.category}
                </span>
              </div>

              {/* Out of Stock Overlay */}
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  <span className="bg-red-500 text-white px-6 py-3 font-bold rounded-full text-lg">
                    OUT OF STOCK
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    aria-label={`View ${product.name} image ${index + 1}`}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all duration-300 ${
                      selectedImage === index
                        ? 'border-pink-500 shadow-lg scale-105'
                        : 'border-transparent hover:border-pink-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div ref={contentRef} className="space-y-6">
            {/* Name */}
            <h1 className="text-3xl lg:text-4xl font-bold font-serif">
              <span className="gradient-text">{product.name}</span>
            </h1>

            {/* Price */}
            <p className="text-3xl font-bold text-pink-600">
              {formatPrice(selectedSize.price)}
              {product.sizes.length > 1 && (
                <span className="text-lg font-normal text-gray-500">
                  {' '}– {formatPrice(product.sizes[product.sizes.length - 1].price)}
                </span>
              )}
            </p>

            {/* Description */}
            <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>

            {/* Size Selector */}
            {product.sizes.length > 1 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Size
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
                        selectedSize.id === size.id
                          ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg'
                          : 'bg-white text-gray-700 border border-pink-200 hover:border-pink-400'
                      }`}
                    >
                      {size.name} - {formatPrice(size.price)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add-ons */}
            {addons.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Add-ons
                </label>
                <div className="space-y-2">
                  {addons.map((addon) => (
                    <label
                      key={addon.id}
                      className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-300 border ${
                        selectedAddons.some((a) => a.id === addon.id)
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-pink-100 bg-white hover:border-pink-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                        selectedAddons.some((a) => a.id === addon.id)
                          ? 'bg-pink-500 text-white'
                          : 'border-2 border-gray-300'
                      }`}>
                        {selectedAddons.some((a) => a.id === addon.id) && (
                          <Check className="w-3 h-3" />
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedAddons.some((a) => a.id === addon.id)}
                        onChange={() => handleAddonToggle(addon)}
                        className="hidden"
                      />
                      <span className="flex-1 font-medium">{addon.name}</span>
                      <span className="text-pink-600 font-semibold">+{formatPrice(addon.price)}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-700">Quantity:</span>
              <div className="flex items-center bg-white border border-pink-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-pink-50 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={18} className="text-gray-600" />
                </button>
                <span className="px-5 py-3 font-bold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-pink-50 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={18} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-gradient-to-br from-pink-50 to-white rounded-2xl p-6 border border-pink-100">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>{quantity}x {selectedSize.name}</span>
                  <span>{formatPrice(selectedSize.price * quantity)}</span>
                </div>
                {selectedAddons.map((addon) => (
                  <div key={addon.id} className="flex justify-between text-gray-500 text-sm">
                    <span>+ {addon.name} (x{quantity})</span>
                    <span>{formatPrice(addon.price * quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-bold text-xl pt-4 border-t border-pink-200">
                <span>Total</span>
                <span className="text-pink-600">{formatPrice(totalPrice)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 btn-gradient py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  !product.inStock ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:-translate-y-0.5'
                }`}
              >
                {showAddedMessage ? (
                  <>
                    <Check size={22} />
                    Added to Cart!
                  </>
                ) : product.inStock ? (
                  <>
                    <ShoppingCart size={22} />
                    Add to Cart
                  </>
                ) : (
                  'Out of Stock'
                )}
              </button>
              
              <button
                onClick={handleShare}
                className="p-4 bg-white border border-pink-200 rounded-xl hover:bg-pink-50 transition-colors"
                aria-label="Share product"
              >
                <Share2 size={22} className="text-pink-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div ref={relatedRef} className="mt-20">
            <h2 className="text-3xl font-bold font-serif text-center mb-10">
              <span className="gradient-text">You May Also Like</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/menu/${p.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-pink-50"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={p.images[0]}
                      alt={p.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 mb-1 line-clamp-1">{p.name}</h3>
                    <p className="text-pink-600 font-semibold">{formatPriceRange(p.sizes)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
