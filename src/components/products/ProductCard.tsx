'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';
import { formatPriceRange } from '@/lib/constants';
import { Badge } from '@/components/ui';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const priceDisplay = formatPriceRange(product.sizes);

  return (
    <Link href={`/menu/${product.slug}`}>
      <div 
        className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
        style={{
          border: '2px solid transparent',
          backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #ec4899, #f472b6, #ec4899)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
          backgroundSize: 'auto, 150% 150%',
          backgroundPosition: 'auto, 0% 0%',
          transitionProperty: 'all',
          transitionDuration: '300ms'
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.backgroundPosition = 'auto, 50% 50%';
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.backgroundPosition = 'auto, 0% 0%';
        }}
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-pink-50 to-white">
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
    </Link>
  );
}

