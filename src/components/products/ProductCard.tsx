'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!cardRef.current || !imageRef.current) {
      router.push(`/menu/${product.slug}`);
      return;
    }

    // Get the image element's position
    const imageRect = imageRef.current.getBoundingClientRect();
    
    // Create a clone of the image for the animation
    const imageClone = imageRef.current.cloneNode(true) as HTMLElement;
    imageClone.style.position = 'fixed';
    imageClone.style.top = `${imageRect.top}px`;
    imageClone.style.left = `${imageRect.left}px`;
    imageClone.style.width = `${imageRect.width}px`;
    imageClone.style.height = `${imageRect.height}px`;
    imageClone.style.zIndex = '9998';
    imageClone.style.borderRadius = '12px';
    imageClone.style.overflow = 'hidden';
    imageClone.style.pointerEvents = 'none';
    document.body.appendChild(imageClone);

    // Calculate center of screen
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const targetWidth = Math.min(window.innerWidth * 0.8, 600);
    const targetHeight = targetWidth;

    // Animate the clone to expand to center
    gsap.to(imageClone, {
      top: centerY - targetHeight / 2,
      left: centerX - targetWidth / 2,
      width: targetWidth,
      height: targetHeight,
      duration: 0.5,
      ease: 'power3.inOut',
      onComplete: () => {
        // Navigate to the product page
        router.push(`/menu/${product.slug}`);
        // Clean up after navigation starts
        setTimeout(() => {
          if (imageClone.parentNode) {
            imageClone.parentNode.removeChild(imageClone);
          }
        }, 100);
      }
    });

    // Fade out the original card
    gsap.to(cardRef.current, {
      opacity: 0.3,
      scale: 0.95,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* Image Container */}
      <div ref={imageRef} className="relative aspect-square overflow-hidden bg-gray-100 rounded-t-lg">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 font-semibold rounded">
              OUT OF STOCK
            </span>
          </div>
        )}

        {/* Quick View on Hover */}
        {product.inStock && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-900 px-4 py-2 font-semibold rounded shadow-lg">
              QUICK VIEW
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category Badge */}
        <Badge className="mb-2">{product.category}</Badge>

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors line-clamp-2">
          {product.name}
        </h3>

        {/* Price */}
        <p className="mt-2 text-gray-600 font-medium">{priceDisplay}</p>
      </div>
    </div>
  );
}
