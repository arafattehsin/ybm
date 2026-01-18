'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import type { Product } from '@/types';
import { formatPriceRange } from '@/lib/constants';
import { Badge } from '@/components/ui';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const priceDisplay = formatPriceRange(product.sizes);
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isAnimating || !cardRef.current || !imageRef.current) {
      router.push(`/menu/${product.slug}`);
      return;
    }

    setIsAnimating(true);

    // Get the card element's position
    const cardRect = cardRef.current.getBoundingClientRect();
    
    // Create a full-screen overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(255, 240, 245, 0)';
    overlay.style.zIndex = '9997';
    overlay.style.pointerEvents = 'none';
    document.body.appendChild(overlay);
    
    // Create a clone of the entire card for the animation
    const cardClone = cardRef.current.cloneNode(true) as HTMLElement;
    cardClone.style.position = 'fixed';
    cardClone.style.top = `${cardRect.top}px`;
    cardClone.style.left = `${cardRect.left}px`;
    cardClone.style.width = `${cardRect.width}px`;
    cardClone.style.height = `${cardRect.height}px`;
    cardClone.style.zIndex = '9998';
    cardClone.style.borderRadius = '12px';
    cardClone.style.overflow = 'hidden';
    cardClone.style.pointerEvents = 'none';
    cardClone.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
    cardClone.style.transformOrigin = 'center center';
    document.body.appendChild(cardClone);

    // Calculate center and target size
    const centerX = window.innerWidth / 2 - cardRect.width / 2;
    const centerY = window.innerHeight / 2 - cardRect.height / 2;
    const scale = Math.min(window.innerWidth * 0.9 / cardRect.width, window.innerHeight * 0.8 / cardRect.height, 1.5);

    // Animate overlay fade in
    gsap.to(overlay, {
      backgroundColor: 'rgba(255, 240, 245, 0.95)',
      duration: 0.4,
      ease: 'power2.out'
    });

    // Animate the card clone to enlarge and center
    gsap.to(cardClone, {
      top: centerY,
      left: centerX,
      scale: scale,
      duration: 0.5,
      ease: 'power3.out',
      onComplete: () => {
        // Quick flash effect
        gsap.to(cardClone, {
          opacity: 0,
          scale: scale * 1.1,
          duration: 0.2,
          ease: 'power2.in',
          onComplete: () => {
            // Navigate to the product page
            router.push(`/menu/${product.slug}`);
            // Clean up
            setTimeout(() => {
              if (cardClone.parentNode) cardClone.parentNode.removeChild(cardClone);
              if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
              setIsAnimating(false);
            }, 50);
          }
        });
      }
    });

    // Hide the original card
    gsap.to(cardRef.current, {
      opacity: 0,
      scale: 0.9,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
    >
      {/* Image Container */}
      <div ref={imageRef} className="relative aspect-square overflow-hidden bg-gradient-to-br from-pink-50 to-white">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 font-semibold rounded-full">
              OUT OF STOCK
            </span>
          </div>
        )}

        {/* Quick View on Hover */}
        {product.inStock && (
          <div className="absolute inset-0 bg-gradient-to-t from-pink-600/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
            <span className="bg-white text-pink-600 px-6 py-2 font-heading text-sm rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              View Details
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Category Badge */}
        <Badge className="mb-2">{product.category}</Badge>

        {/* Product Name */}
        <h3 className="font-heading text-lg text-gray-900 group-hover:text-pink-600 transition-colors line-clamp-2">
          {product.name}
        </h3>

        {/* Price */}
        <p className="mt-2 text-pink-600 font-heading text-lg">{priceDisplay}</p>
      </div>
    </div>
  );
}
