'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Gift, Heart, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function SeasonalCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);
  const floatingShapeRef = useRef<HTMLDivElement>(null);

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

      // Floating shape animation
      gsap.to(floatingShapeRef.current, {
        y: -20,
        x: 10,
        rotation: 5,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Background shapes
      if (shapesRef.current) {
        const shapes = shapesRef.current.children;
        Array.from(shapes).forEach((shape, index) => {
          gsap.to(shape, {
            y: `random(-25, 25)`,
            x: `random(-20, 20)`,
            rotation: `random(-15, 15)`,
            duration: 5 + index,
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
    <section ref={sectionRef} className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-br from-pink-50 via-white to-pink-100">
      {/* Background Decorative Shapes */}
      <div ref={shapesRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-40 h-40 bg-pink-200/30 rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-pink-100/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-pink-300/20 rounded-full blur-xl" />
        {/* Small floating elements */}
        <Heart className="absolute top-1/4 right-1/4 w-6 h-6 text-pink-300/50" />
        <Sparkles className="absolute bottom-1/3 left-1/5 w-5 h-5 text-pink-400/40" />
        <Gift className="absolute top-1/3 left-1/4 w-8 h-8 text-pink-200/60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content Side */}
          <div ref={contentRef} className="relative">
            {/* Floating decorative shape behind content */}
            <div 
              ref={floatingShapeRef}
              className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-pink-200 to-pink-100 rounded-full blur-sm opacity-60"
              style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}
            />
            
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-xl border border-pink-100">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl mb-6 shadow-lg">
                <Gift className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold font-serif mb-6 leading-tight">
                <span className="gradient-text">Perfect Time</span>
                <br />
                <span className="text-gray-800">to Send Gifts</span>
              </h2>

              <p className="text-gray-600 text-lg lg:text-xl mb-8 leading-relaxed">
                Nothing says &quot;I love you&quot; quite like a handcrafted sweet treat. 
                Whether it&apos;s a birthday surprise, anniversary celebration, or just 
                because — let our desserts carry your warmest wishes. Each box is 
                prepared with love and wrapped with care, ready to make someone&apos;s 
                day absolutely magical.
              </p>

              <Link href="/menu">
                <button className="btn-gradient px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 group">
                  <span className="flex items-center gap-2">
                    Order Now
                    <Heart className="w-5 h-5 transition-transform duration-300 group-hover:scale-125" />
                  </span>
                </button>
              </Link>
            </div>
          </div>

          {/* Video Side */}
          <div ref={videoRef} className="relative">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-300 to-pink-500 rounded-3xl blur-xl opacity-30 transform scale-105" />
            
            {/* Video Container */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50" style={{
              background: 'linear-gradient(135deg, rgba(233, 30, 99, 0.1) 0%, rgba(255, 64, 129, 0.1) 100%)'
            }}>
              {/* Gradient border effect */}
              <div className="absolute inset-0 rounded-3xl p-1 bg-gradient-to-br from-pink-400 via-white to-pink-300 -z-10" />
              
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full aspect-[4/3] object-cover"
              >
                <source src="/videos/3.mp4" type="video/mp4" />
              </video>

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-pink-600/20 to-transparent pointer-events-none" />
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-xl border border-pink-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-500" />
                <span className="text-sm font-semibold text-gray-700">Made with Love</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

