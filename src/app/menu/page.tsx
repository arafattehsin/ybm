'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, X } from 'lucide-react';
import productsData from '@/data/products.json';
import categoriesData from '@/data/categories.json';
import type { Product, Category } from '@/types';
import { formatPriceRange } from '@/lib/constants';

gsap.registerPlugin(ScrollTrigger);

const products = productsData.products as Product[];
const categories = categoriesData.categories as Category[];

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );

      gsap.fromTo(filterRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: 'power2.out' }
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

  useEffect(() => {
    if (gridRef.current) {
      const cards = gridRef.current.children;
      gsap.fromTo(cards,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [filteredProducts, selectedCategory, searchQuery]);

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-pink-50 to-white">
      {/* Background Shapes */}
      <div ref={shapesRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-pink-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-pink-50/50 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-white/60 rounded-full blur-2xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-10">
          <span className="inline-block px-4 py-1 bg-pink-100 text-pink-600 rounded-full text-sm font-semibold uppercase tracking-wider mb-4">
            Our Menu
          </span>
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">
            <span className="gradient-text">Delicious</span>
            <span className="text-gray-800"> Creations</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Handcrafted with love, made fresh for every order. Browse our selection and find your perfect treat!
          </p>
        </div>

        {/* Search & Filter */}
        <div ref={filterRef} className="mb-10">
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search our menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all outline-none bg-white/80 backdrop-blur-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`category-btn px-6 py-2 rounded-full font-heading transition-all duration-300 ${
                !selectedCategory
                  ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg scale-100'
                  : 'bg-white/80 text-gray-700 hover:bg-pink-100 border border-pink-200 scale-100'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`category-btn px-6 py-2 rounded-full font-heading transition-all duration-300 capitalize ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg scale-100'
                    : 'bg-white/80 text-gray-700 hover:bg-pink-100 border border-pink-200 scale-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <MenuProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍰</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filter</p>
          </div>
        )}
      </div>
    </section>
  );
}

function MenuProductCard({ product }: { product: Product }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      y: -8,
      boxShadow: '0 25px 50px rgba(233, 30, 99, 0.15)',
      duration: 0.3,
      ease: 'power2.out'
    });
    // Scale image inside container
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        scale: 1.1,
        duration: 0.6,
        ease: 'power2.out'
      });
    }
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      boxShadow: '0 4px 20px rgba(233, 30, 99, 0.08)',
      duration: 0.3,
      ease: 'power2.out'
    });
    // Reset image scale
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        scale: 1,
        duration: 0.6,
        ease: 'power2.out'
      });
    }
  };

  return (
    <Link
      ref={cardRef}
      href={`/menu/${product.slug}`}
      className="block bg-white rounded-2xl overflow-hidden shadow-md border border-pink-50"
      style={{ boxShadow: '0 4px 20px rgba(233, 30, 99, 0.08)' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-pink-50 to-white">
        <Image
          ref={imageRef}
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-pink-600 text-xs font-semibold rounded-full uppercase shadow-sm">
            {product.category}
          </span>
        </div>

        {/* Out of Stock */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 font-semibold rounded-full text-sm">
              OUT OF STOCK
            </span>
          </div>
        )}

        {/* Hover Overlay */}
        {product.inStock && (
          <div className="absolute inset-0 bg-gradient-to-t from-pink-600/80 via-pink-600/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
            <span className="bg-white text-pink-600 px-6 py-2 font-semibold rounded-full text-sm shadow-lg">
              VIEW DETAILS
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-pink-600 font-bold text-lg">
            {formatPriceRange(product.sizes)}
          </p>
          {product.featured && (
            <span className="text-xs font-semibold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
              ⭐ Featured
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
