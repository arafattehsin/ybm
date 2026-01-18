'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
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
  const custardRef = useRef<HTMLDivElement>(null);
  const custardBackRef = useRef<HTMLDivElement>(null);

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

      // Custard image floating animation
      if (custardRef.current) {
        gsap.to(custardRef.current, {
          x: -20,
          y: -25,
          rotation: -8,
          scale: 1.06,
          duration: 6,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }

      // Custard back circle animation
      if (custardBackRef.current) {
        gsap.to(custardBackRef.current, {
          x: 18,
          y: 12,
          rotation: 6,
          scale: 1.1,
          duration: 7,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }

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
    <section ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden bg-gradient-merged">
      {/* Floating Custard Image at Top Right - merging with previous section */}
      <div className="absolute -top-20 right-8 lg:right-16 z-40">
        {/* Splash shape */}
        <div className="absolute -top-6 -right-6 w-36 h-36 opacity-20 pointer-events-none">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path 
              fill="#E91E63" 
              d="M44.7,-76.4C58.1,-68.5,69.4,-56.6,77.1,-42.6C84.8,-28.6,88.9,-12.5,87.3,2.9C85.8,18.4,78.6,33.2,68.7,45.4C58.8,57.6,46.2,67.3,32.2,73.6C18.1,80,-2.5,83,-21.3,79.1C-40.2,75.2,-57.3,64.4,-69.8,50.1C-82.3,35.8,-90.2,17.9,-89.6,0.3C-89,-17.2,-79.9,-34.4,-67.5,-47.7C-55.1,-61,-39.4,-70.4,-23.6,-76.8C-7.8,-83.2,8.1,-86.6,23.4,-84.2C38.8,-81.8,53.6,-73.6,44.7,-76.4Z" 
              transform="translate(100 100)"
            />
          </svg>
        </div>
        {/* Back circle - pink/white */}
        <div 
          ref={custardBackRef}
          className="absolute w-40 h-40 md:w-52 md:h-52 rounded-full -top-4 -right-4"
          style={{
            background: 'linear-gradient(135deg, #FFB6C1 0%, #FFFFFF 50%, #E91E63 100%)'
          }}
        />
        {/* Front circle - white/pink */}
        <div 
          className="absolute w-32 h-32 md:w-44 md:h-44 rounded-full top-0 right-0"
          style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FFC0CB 50%, #FFB6C1 100%)'
          }}
        />
        {/* Custard image */}
        <div ref={custardRef} className="relative w-28 h-28 md:w-40 md:h-40">
          <Image
            src="/images/products/curstardfinal.png"
            alt="Custard dessert"
            fill
            className="object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Background Decorative Shapes */}
      <div ref={shapesRef} className="absolute inset-0 pointer-events-none">
        {/* Shape pairs with different color combinations */}
        <div className="absolute top-32 left-20">
          <div className="w-18 h-18 rounded-full" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #E91E63 100%)' }} />
          <div className="absolute inset-2 w-12 h-12 rounded-full" style={{ background: 'linear-gradient(135deg, #FFB6C1 0%, #FFFFFF 100%)' }} />
        </div>
        <div className="absolute bottom-1/4 left-1/4">
          <div className="w-14 h-14 rounded-full bg-white/70" />
          <div className="absolute inset-1 w-10 h-10 rounded-full" style={{ background: 'linear-gradient(135deg, #E91E63 0%, #FFC0CB 100%)' }} />
        </div>
        <div className="absolute top-1/3 right-1/3">
          <div className="w-10 h-10 rounded-full" style={{ background: 'linear-gradient(135deg, #FFC0CB 0%, #E91E63 100%)' }} />
          <div className="absolute inset-1 w-6 h-6 rounded-full bg-white/80" />
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
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={testimonial.id}>
                <TestimonialCard testimonial={testimonial} index={index} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          <button className="testimonial-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-pink-600 hover:bg-pink-50 hover:scale-110 transition-all duration-300 border border-pink-100">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button className="testimonial-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-pink-600 hover:bg-pink-50 hover:scale-110 transition-all duration-300 border border-pink-100">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  const cardColors = [
    'from-pink-50 to-white',
    'from-white to-pink-50',
    'from-pink-100/50 to-white',
  ];

  return (
    <div className={`bg-gradient-to-br ${cardColors[index % 3]} rounded-3xl p-8 shadow-lg border border-pink-100 h-full flex flex-col`}>
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
