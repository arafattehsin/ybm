import type { Metadata } from 'next';
import { ProductGrid, CategoryFilter } from '@/components/products';
import productsData from '@/data/products.json';
import categoriesData from '@/data/categories.json';
import type { Product, Category } from '@/types';

const products = productsData.products as Product[];
const categories = categoriesData.categories as Category[];

export const metadata: Metadata = {
  title: 'Menu | YUM by Maryam',
  description:
    'Browse our delicious selection of homemade cakes, cupcakes, cookies, and desserts. Order online for delivery across Greater Sydney.',
};

interface MenuPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const resolvedSearchParams = await searchParams;
  const selectedCategory = resolvedSearchParams.category || null;

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  return (
    <div className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">
            Our Menu
          </h1>
          <p className="text-gray-600">
            Handcrafted with love, made fresh for every order
          </p>
        </div>

        {/* Category Filter */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
        />

        {/* Products */}
        <ProductGrid products={filteredProducts} />

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No products found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
