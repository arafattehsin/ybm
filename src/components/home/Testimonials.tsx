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
    <section ref={sectionRef} className="relative py-20 lg:py-28 overflow-hidden">
      {/* Curvy Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-pink-50 to-white">
        {/* Top wave */}
        <svg className="absolute top-0 left-0 w-full" viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,50 Q360,0 720,50 T1440,50 L1440,0 L0,0 Z" fill="white" />
        </svg>
        {/* Bottom wave */}
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,50 Q360,100 720,50 T1440,50 L1440,100 L0,100 Z" fill="white" />
        </svg>
      </div>

      {/* Decorative Shapes */}
      <div ref={shapesRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-48 h-48 bg-pink-200/40 rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-pink-100/50 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/60 rounded-full blur-xl" />
        {/* Quote decorations */}
        <Quote className="absolute top-1/4 left-1/5 w-12 h-12 text-pink-200/40 transform rotate-12" />
        <Quote className="absolute bottom-1/4 right-1/5 w-8 h-8 text-pink-300/30 transform -rotate-12" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-14">
          <span className="inline-block px-4 py-1 bg-white/80 backdrop-blur-sm text-pink-600 rounded-full text-sm font-semibold uppercase tracking-wider mb-4 shadow-sm">
            Testimonials
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-4">
            <span className="gradient-text">Sweet Words</span>
            <span className="text-gray-800"> from Our Customers</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Don&apos;t just take our word for it — hear what our wonderful customers have to say
          </p>
        </div>

        {/* Testimonial Slider */}
        <div ref={sliderRef} className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              prevEl: '.testimonial-prev',
              nextEl: '.testimonial-next',
            }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            loop={true}
            className="pb-14"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <TestimonialCard testimonial={testimonial} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          <button className="testimonial-prev absolute left-0 lg:-left-16 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-pink-600 hover:bg-pink-50 transition-all duration-300 hover:scale-110 hover:shadow-xl">
            <ChevronLeft size={24} />
          </button>
          <button className="testimonial-next absolute right-0 lg:-right-16 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-pink-600 hover:bg-pink-50 transition-all duration-300 hover:scale-110 hover:shadow-xl">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-xl border border-pink-100 mx-4">
      {/* Quote Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6">
          <Quote className="w-8 h-8 text-white fill-white" />
        </div>
      </div>

      {/* Stars */}
      <div className="flex justify-center gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
        ))}
      </div>

      {/* Quote Text */}
      <blockquote className="text-gray-700 text-lg lg:text-xl leading-relaxed text-center mb-8 italic">
        &quot;{testimonial.quote}&quot;
      </blockquote>

      {/* Author */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
          {testimonial.author.charAt(0)}
        </div>
        <p className="font-bold text-gray-900 text-lg">{testimonial.author}</p>
        <p className="text-pink-600 font-medium">{testimonial.location}</p>
      </div>
    </div>
  );
}
