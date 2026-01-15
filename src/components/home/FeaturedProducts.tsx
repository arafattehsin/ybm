import Link from 'next/link';
import type { Product } from '@/types';
import { ProductCard } from '@/components/products';
import { Button } from '@/components/ui';

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            Featured
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            BEST FOR THIS SEASON
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link href="/menu">
            <Button variant="outline" size="lg">
              CHECK MENU
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
