'use client';

import Link from 'next/link';
import type { Category } from '@/types';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
}

export function CategoryFilter({
  categories,
  selectedCategory,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      <Link
        href="/menu"
        className={cn(
          'px-4 py-2 rounded-full text-sm font-medium transition-colors',
          selectedCategory === null
            ? 'bg-[#2D2D2D] text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        )}
      >
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/menu?category=${category.slug}`}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            selectedCategory === category.slug
              ? 'bg-[#2D2D2D] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
