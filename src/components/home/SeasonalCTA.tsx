'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Gift, Heart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function SeasonalCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Content animation
      gsap.fromTo(contentRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Video animation
      gsap.fromTo(videoRef.current,
        { opacity: 0, x: 50, scale: 0.9 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.8,
          delay: 0.2,
          scrollTrigger: {
            trigger: videoRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Background shapes - different colors and patterns
      if (shapesRef.current) {
        const shapes = shapesRef.current.children;
        Array.from(shapes).forEach((shape, index) => {
          gsap.to(shape, {
            y: `random(-30, 30)`,
            x: `random(-25, 25)`,
            rotation: `random(-20, 20)`,
            duration: 6 + index * 0.8,
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
    <section ref={sectionRef} className="relative py-28 lg:py-36 overflow-hidden bg-gradient-merged">
      {/* Background Decorative Bakery Shapes - Hidden on mobile */}
      <div ref={shapesRef} className="absolute inset-0 pointer-events-none hidden md:block">
        {/* Cupcake shape */}
        <div className="absolute top-20 left-1/4">
          <svg viewBox="0 0 64 64" className="w-16 h-16 text-pink-300/40" fill="currentColor">
            <path d="M16 28c0-8 6-14 16-14s16 6 16 14c0 2-1 4-2 5h-28c-1-1-2-3-2-5z" />
            <path d="M14 35h36c1 0 2 1 2 2l-4 22c0 2-2 3-4 3H20c-2 0-4-1-4-3l-4-22c0-1 1-2 2-2z" />
            <circle cx="32" cy="18" r="4" />
          </svg>
        </div>
        {/* Donut shape */}
        <div className="absolute bottom-1/3 right-1/4">
          <svg viewBox="0 0 64 64" className="w-14 h-14 text-pink-400/30" fill="currentColor">
            <path d="M32 4C16.5 4 4 16.5 4 32s12.5 28 28 28 28-12.5 28-28S47.5 4 32 4zm0 40c-6.6 0-12-5.4-12-12s5.4-12 12-12 12 5.4 12 12-5.4 12-12 12z" />
          </svg>
        </div>
        {/* Cake slice */}
        <div className="absolute top-1/2 left-10">
          <svg viewBox="0 0 64 64" className="w-10 h-10 text-pink-200/50" fill="currentColor">
            <path d="M8 48l24-40 24 40c0 4-4 8-12 8H20c-8 0-12-4-12-8z" />
          </svg>
        </div>
        {/* Croissant */}
        <div className="absolute bottom-20 left-1/3">
          <svg viewBox="0 0 64 64" className="w-12 h-12 text-pink-300/35" fill="currentColor">
            <path d="M8 40c4-20 16-28 24-28 4 0 10 2 16 8 6 6 8 12 8 16 0 8-8 12-16 8-4-2-8-1-12 2-8 6-22 4-20-6z" />
          </svg>
        </div>
        {/* Large blur shapes */}
        <div className="absolute top-10 right-20 w-48 h-48 bg-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-pink-100/40 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Content Side - Wider and overlaps video */}
          <div ref={contentRef} className="relative lg:col-span-7 z-20">
            <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-xl border border-pink-100 lg:-mr-24">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl mb-6 shadow-lg">
                <Gift className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-heading mb-6 leading-tight">
                <span className="gradient-text">Perfect Time</span>
                <br />
                <span className="text-gray-800">to Send Gifts</span>
              </h2>

              <p className="text-gray-600 text-lg lg:text-xl mb-8 leading-relaxed font-body">
                Nothing says &quot;I love you&quot; quite like a handcrafted sweet treat. 
                Whether it&apos;s a birthday surprise, anniversary celebration, or just 
                because — let our desserts carry your warmest wishes.
              </p>

              <Link href="/menu">
                <button className="btn-gradient px-8 py-4 rounded-full font-heading text-lg shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 group">
                  <span className="flex items-center gap-2">
                    Order Now
                    <Heart className="w-5 h-5 transition-transform duration-300 group-hover:scale-125" />
                  </span>
                </button>
              </Link>
            </div>
          </div>

          {/* Video Side - In front */}
          <div ref={videoRef} className="relative lg:col-span-5 z-30">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-300 to-pink-500 rounded-3xl blur-xl opacity-30 transform scale-105" />
            
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full aspect-[4/3] object-cover"
              >
                <source src="/videos/3.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-pink-600/20 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

