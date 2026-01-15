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
    <Link
      href={`/menu/${product.slug}`}
      className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
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
        <h3 className="font-semibold text-gray-900 group-hover:text-[#C9A86C] transition-colors line-clamp-2">
          {product.name}
        </h3>

        {/* Price */}
        <p className="mt-2 text-gray-600 font-medium">{priceDisplay}</p>
      </div>
    </Link>
  );
}
