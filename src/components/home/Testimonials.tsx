'use client';

import { useState, useEffect } from 'react';
import type { Testimonial } from '@/types';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const goToPrev = () => {
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const currentTestimonial = testimonials[activeIndex];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Testimonials
          </h2>
          <p className="text-gray-500">Some of our customers reviews</p>
        </div>

        {/* Testimonial Card */}
        <div className="relative bg-gray-50 rounded-2xl p-8 lg:p-12">
          {/* Quote Icon */}
          <div className="text-[#C9A86C] mb-6">
            <Quote size={48} className="fill-current" />
          </div>

          {/* Quote Text */}
          <blockquote className="text-gray-700 text-lg lg:text-xl leading-relaxed mb-8">
            {currentTestimonial.quote}
          </blockquote>

          {/* Author */}
          <div className="border-t pt-6">
            <p className="font-semibold text-gray-900">
              {currentTestimonial.author}
            </p>
            <p className="text-gray-500">{currentTestimonial.location}</p>
          </div>

          {/* Navigation Arrows */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 pointer-events-none">
            <button
              onClick={goToPrev}
              className="pointer-events-auto p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={24} className="text-gray-600" />
            </button>
            <button
              onClick={goToNext}
              className="pointer-events-auto p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight size={24} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === activeIndex ? 'bg-[#C9A86C]' : 'bg-gray-300'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
