import { HeroSection, FeaturedProducts, SeasonalCTA, Testimonials } from '@/components/home';
import productsData from '@/data/products.json';
import testimonialsData from '@/data/testimonials.json';
import type { Product, Testimonial } from '@/types';

const products = productsData.products as Product[];
const testimonials = testimonialsData.testimonials as Testimonial[];

// Get featured products (limit to 5)
const featuredProducts = products.filter((p) => p.featured).slice(0, 5);

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts products={featuredProducts} />
      <SeasonalCTA />
      <Testimonials testimonials={testimonials} />
    </>
  );
}
