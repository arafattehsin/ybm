import { HeroSection, FeaturedProducts, SeasonalCTA, Testimonials, InstagramSection, FloatingImages } from '@/components/home';
import productsData from '@/data/products.json';
import testimonialsData from '@/data/testimonials.json';
import type { Product, Testimonial } from '@/types';

const products = productsData.products as Product[];
const testimonials = testimonialsData.testimonials as Testimonial[];

// Get featured products (limit to 8 for slider)
const featuredProducts = products.filter((p) => p.featured).slice(0, 8);

export default function HomePage() {
  return (
    <>
      <FloatingImages />
      <HeroSection />
      <FeaturedProducts products={featuredProducts} />
      <SeasonalCTA />
      <Testimonials testimonials={testimonials} />
      <InstagramSection />
    </>
  );
}
