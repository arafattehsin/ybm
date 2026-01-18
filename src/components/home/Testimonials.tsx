'use client';

import { useEffect, useRef } from 'react';
import type { Testimonial } from '@/types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCards } from 'swiper/modules';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-cards';

gsap.registerPlugin(ScrollTrigger);

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Slider animation
      gsap.fromTo(sliderRef.current,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          delay: 0.2,
          scrollTrigger: {
            trigger: sliderRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Background shapes animation
      if (shapesRef.current) {
        const shapes = shapesRef.current.children;
        Array.from(shapes).forEach((shape, index) => {
          gsap.to(shape, {
            y: `random(-30, 30)`,
            x: `random(-25, 25)`,
            rotation: `random(-20, 20)`,
            duration: 6 + index * 0.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 lg:py-40 overflow-hidden bg-gradient-merged">
      {/* Background Decorative Bakery Shapes - Hidden on mobile */}
      <div ref={shapesRef} className="absolute inset-0 pointer-events-none hidden md:block">
        {/* Cupcake shape */}
        <div className="absolute top-32 left-20">
          <svg viewBox="0 0 64 64" className="w-16 h-16 text-pink-300/40" fill="currentColor">
            <path d="M16 28c0-8 6-14 16-14s16 6 16 14c0 2-1 4-2 5h-28c-1-1-2-3-2-5z" />
            <path d="M14 35h36c1 0 2 1 2 2l-4 22c0 2-2 3-4 3H20c-2 0-4-1-4-3l-4-22c0-1 1-2 2-2z" />
            <circle cx="32" cy="18" r="4" />
          </svg>
        </div>
        {/* Donut shape */}
        <div className="absolute bottom-1/4 left-1/4">
          <svg viewBox="0 0 64 64" className="w-12 h-12 text-pink-400/30" fill="currentColor">
            <path d="M32 4C16.5 4 4 16.5 4 32s12.5 28 28 28 28-12.5 28-28S47.5 4 32 4zm0 40c-6.6 0-12-5.4-12-12s5.4-12 12-12 12 5.4 12 12-5.4 12-12 12z" />
          </svg>
        </div>
        {/* Cake slice shape */}
        <div className="absolute top-1/3 right-1/4">
          <svg viewBox="0 0 64 64" className="w-10 h-10 text-pink-200/50" fill="currentColor">
            <path d="M8 48l24-40 24 40c0 4-4 8-12 8H20c-8 0-12-4-12-8z" />
            <path d="M16 38h32v6H16z" opacity="0.7" />
          </svg>
        </div>
        {/* Large blur shapes */}
        <div className="absolute top-20 left-1/4 w-56 h-56 bg-pink-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-48 h-48 bg-pink-200/40 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-heading mb-4">
            <span className="gradient-text">What Our Customers Say</span>
          </h2>
          <p className="text-gray-600 text-lg font-body max-w-2xl mx-auto">
            Real reviews from our amazing customers who made their celebrations sweeter
          </p>
        </div>

        {/* Testimonials Slider */}
        <div ref={sliderRef} className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectCards]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              prevEl: '.testimonial-prev',
              nextEl: '.testimonial-next',
            }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-14"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <TestimonialCard testimonial={testimonial} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons - Increased spacing from content */}
          <button className="testimonial-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 lg:-translate-x-16 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-pink-600 hover:bg-pink-50 hover:scale-110 transition-all duration-300 border border-pink-100">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button className="testimonial-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 lg:translate-x-16 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-pink-600 hover:bg-pink-50 hover:scale-110 transition-all duration-300 border border-pink-100">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg border border-pink-100 h-full flex flex-col min-h-[380px]">
      {/* Quote Icon */}
      <div className="mb-4">
        <Quote className="w-10 h-10 text-pink-300" />
      </div>

      {/* Rating - Always 5 stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className="w-5 h-5 text-yellow-400 fill-yellow-400"
          />
        ))}
      </div>

      {/* Testimonial Text */}
      <p className="text-gray-600 mb-6 flex-grow font-body leading-relaxed">
        &quot;{testimonial.quote}&quot;
      </p>

      {/* Author */}
      <div className="border-t border-pink-100 pt-4">
        <p className="font-heading text-gray-900">{testimonial.author}</p>
        <p className="text-sm text-pink-600 font-body">{testimonial.location}</p>
      </div>
    </div>
  );
}
