'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const leftBlobRef = useRef<HTMLDivElement>(null);
  const leftBlobBgRef = useRef<HTMLDivElement>(null);
  const rightBlobRef = useRef<HTMLDivElement>(null);
  const rightBlobBgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const awardRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const glassBackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial content animation
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: 'power3.out' }
      );

      // Award badge animation
      gsap.fromTo(awardRef.current,
        { opacity: 0, scale: 0.8, x: 50 },
        { opacity: 1, scale: 1, x: 0, duration: 0.8, delay: 0.6, ease: 'back.out(1.7)' }
      );

      // Floating animation for left blob - ENLARGED
      gsap.to(leftBlobRef.current, {
        x: 20,
        y: -25,
        rotation: 5,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      gsap.to(leftBlobBgRef.current, {
        x: -15,
        y: 20,
        rotation: -3,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Floating animation for right blob with DIFFERENT pattern
      gsap.to(rightBlobRef.current, {
        x: -20,
        y: 20,
        rotation: -5,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      gsap.to(rightBlobBgRef.current, {
        x: 15,
        y: -15,
        rotation: 4,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Glass image floating animation with rotation, left-right, and scale
      if (glassRef.current) {
        gsap.to(glassRef.current, {
          x: 30,
          y: -15,
          rotation: 8,
          scale: 1.05,
          duration: 5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }

      // Glass back circle animation
      if (glassBackRef.current) {
        gsap.to(glassBackRef.current, {
          x: -20,
          y: 10,
          rotation: -5,
          scale: 1.08,
          duration: 6,
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
            x: `random(-40, 40)`,
            y: `random(-40, 40)`,
            rotation: `random(-20, 20)`,
            duration: 7 + index * 0.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          });
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-[95vh] overflow-hidden bg-gradient-hero">
      {/* Background Decorative Shapes */}
      <div ref={shapesRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-white/50 rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-pink-100/40 rounded-full blur-2xl" />
        <div className="absolute top-1/4 right-1/3 w-10 h-10 bg-pink-300/50 rounded-full" />
        <div className="absolute bottom-1/3 left-1/3 w-8 h-8 bg-pink-400/40 rounded-full" />
        <div className="absolute top-2/3 right-1/5 w-5 h-5 bg-pink-200/60 rounded-full" />
        <div className="absolute top-1/2 left-10 w-6 h-6 bg-pink-500/30 rounded-full" />
        <div className="absolute bottom-1/4 right-10 w-4 h-4 bg-white/80 rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Mobile Layout - Stack with content between videos */}
        <div className="flex flex-col lg:hidden items-center overflow-hidden">
          {/* First Video Blob on Mobile - contained within screen */}
          <div className="relative w-[90%] max-w-[320px] h-[260px] sm:h-[300px] mb-4 mx-auto">
            {/* Background blob - pink/white gradient - closer to video */}
            <div 
              className="absolute inset-0 shadow-2xl"
              style={{ 
                background: 'linear-gradient(135deg, #E91E63 0%, #FFB6C1 50%, #FFFFFF 100%)',
                borderRadius: '65% 35% 25% 75% / 55% 25% 75% 45%',
                transform: 'scale(1.08)'
              }}
            />
            {/* Second layer - closer */}
            <div 
              className="absolute inset-1 shadow-xl"
              style={{ 
                background: 'linear-gradient(135deg, #FFFFFF 0%, #FFC0CB 50%, #FFB6C1 100%)',
                borderRadius: '60% 40% 30% 70% / 55% 30% 70% 45%',
                transform: 'scale(1.04)'
              }}
            />
            {/* Video container blob */}
            <div 
              className="absolute inset-3 overflow-hidden shadow-2xl"
              style={{ 
                borderRadius: '55% 45% 35% 65% / 55% 35% 65% 45%'
              }}
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/videos/hero.mp4" type="video/mp4" />
              </video>
            </div>
          </div>

          {/* Content in the Middle on Mobile */}
          <div ref={contentRef} className="text-center z-10 py-6 px-4">
            {/* Award Badge */}
            <div 
              ref={awardRef}
              className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-5 py-3 rounded-full shadow-lg mb-6 border border-pink-100"
            >
              <Image
                src="/videos/awardpic.jpeg"
                alt="Local Business Awards 2021"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <div className="text-left">
                <p className="text-xs font-bold text-pink-600 uppercase tracking-wider">Finalist</p>
                <p className="text-sm font-semibold text-gray-700">Local Business Awards 2021</p>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl font-heading mb-6 leading-tight">
              <span className="gradient-text">YUM</span>
              <span className="text-gray-800 block my-1 text-xl sm:text-2xl font-body font-medium">by</span>
              <span className="gradient-text">Maryam</span>
            </h1>

            {/* Description */}
            <p className="text-gray-600 text-base sm:text-lg mb-8 max-w-sm mx-auto leading-relaxed font-body">
              An artisan dessert boutique crafting heavenly homemade cakes & sweet treats with love from Sydney.
            </p>

            {/* CTA Button */}
            <Link href="/menu">
              <button className="btn-gradient px-10 py-4 rounded-full font-heading text-base shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 group">
                <span className="flex items-center gap-2">
                  Explore Menu
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            </Link>
          </div>

          {/* Second Video Blob on Mobile - contained within screen */}
          <div className="relative w-[90%] max-w-[320px] h-[260px] sm:h-[300px] mt-4 mx-auto">
            {/* Background blob - white/pink gradient - closer to video */}
            <div 
              className="absolute inset-0 shadow-2xl"
              style={{ 
                background: 'linear-gradient(135deg, #FFFFFF 0%, #FFC0CB 50%, #E91E63 100%)',
                borderRadius: '35% 65% 75% 25% / 35% 75% 25% 65%',
                transform: 'scale(1.08)'
              }}
            />
            {/* Second layer - closer */}
            <div 
              className="absolute inset-1 shadow-xl"
              style={{ 
                background: 'linear-gradient(135deg, #FFB6C1 0%, #FFFFFF 50%, #FFC0CB 100%)',
                borderRadius: '40% 60% 70% 30% / 40% 65% 35% 60%',
                transform: 'scale(1.04)'
              }}
            />
            {/* Video container blob */}
            <div 
              className="absolute inset-3 overflow-hidden shadow-2xl"
              style={{ 
                borderRadius: '35% 65% 60% 40% / 40% 55% 45% 60%'
              }}
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/videos/1.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Larger videos with more spacing */}
        <div className="hidden lg:grid grid-cols-12 gap-2 items-center min-h-[70vh]">
          
          {/* Left Video Blob Section - ENLARGED with more space from center */}
          <div className="lg:col-span-4 relative h-[550px] -ml-32">
            {/* Background blob - pink/white gradient */}
            <div 
              ref={leftBlobBgRef}
              className="absolute inset-0 shadow-2xl"
              style={{ 
                background: 'linear-gradient(135deg, #E91E63 0%, #FFB6C1 50%, #FFFFFF 100%)',
                borderRadius: '65% 35% 25% 75% / 55% 25% 75% 45%',
                transform: 'scale(1.18) translate(10px, 10px)'
              }}
            />
            {/* Second layer circle - white/pink */}
            <div 
              className="absolute inset-0 shadow-xl"
              style={{ 
                background: 'linear-gradient(135deg, #FFFFFF 0%, #FFC0CB 50%, #FFB6C1 100%)',
                borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
                transform: 'scale(1.10) translate(5px, 5px)'
              }}
            />
            {/* Video container blob */}
            <div 
              ref={leftBlobRef}
              className="absolute inset-2 overflow-hidden shadow-2xl animate-pulse-glow"
              style={{ 
                borderRadius: '55% 45% 35% 65% / 55% 35% 65% 45%'
              }}
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/videos/hero.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-pink-500/10 to-transparent" />
            </div>
          </div>

          {/* Center Content - Desktop Only */}
          <div className="lg:col-span-4 text-center z-10">
            {/* Award Badge */}
            <div 
              className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-5 py-3 rounded-full shadow-lg mb-8 border border-pink-100"
            >
              <Image
                src="/videos/awardpic.jpeg"
                alt="Local Business Awards 2021"
                width={45}
                height={45}
                className="rounded-full object-cover"
              />
              <div className="text-left">
                <p className="text-xs font-bold text-pink-600 uppercase tracking-wider">Finalist</p>
                <p className="text-sm font-semibold text-gray-700">Local Business Awards 2021</p>
                <p className="text-xs text-gray-500">Parramatta</p>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl lg:text-6xl font-heading mb-8 leading-tight">
              <span className="gradient-text">YUM</span>
              <span className="text-gray-800 block my-2 text-2xl lg:text-3xl font-body font-medium">by</span>
              <span className="gradient-text">Maryam</span>
            </h1>

            {/* Description */}
            <p className="text-gray-600 text-lg lg:text-xl mb-10 max-w-md mx-auto leading-relaxed font-body">
              An artisan dessert boutique crafting heavenly homemade cakes, 
              cupcakes & sweet treats with love from Sydney.
            </p>

            {/* CTA Button */}
            <Link href="/menu">
              <button className="btn-gradient px-12 py-5 rounded-full font-heading text-lg shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 group">
                <span className="flex items-center gap-3">
                  Explore Menu
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            </Link>
          </div>

          {/* Right Video Blob Section - LARGER with more space from center */}
          <div className="lg:col-span-4 relative h-[550px] -mr-32">
            {/* Background blob - white/pink gradient (reversed) */}
            <div 
              ref={rightBlobBgRef}
              className="absolute inset-0 shadow-2xl"
              style={{ 
                background: 'linear-gradient(135deg, #FFFFFF 0%, #FFC0CB 50%, #E91E63 100%)',
                borderRadius: '35% 65% 75% 25% / 35% 75% 25% 65%',
                transform: 'scale(1.18) translate(-10px, 10px)'
              }}
            />
            {/* Second layer - pink/white */}
            <div 
              className="absolute inset-0 shadow-xl"
              style={{ 
                background: 'linear-gradient(135deg, #FFB6C1 0%, #FFFFFF 50%, #FFC0CB 100%)',
                borderRadius: '40% 60% 70% 30% / 45% 65% 35% 55%',
                transform: 'scale(1.10) translate(-5px, 5px)'
              }}
            />
            {/* Video container blob - DIFFERENT SHAPE */}
            <div 
              ref={rightBlobRef}
              className="absolute inset-2 overflow-hidden shadow-2xl"
              style={{ 
                borderRadius: '35% 65% 60% 40% / 40% 55% 45% 60%'
              }}
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/videos/1.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-b from-pink-500/10 to-transparent" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Glass Image at Bottom Right - ON TOP of everything */}
      <div className="absolute right-8 lg:right-24 -bottom-20 z-[9999] hidden sm:block">
        {/* Back circle with animation */}
        <div 
          ref={glassBackRef}
          className="absolute w-52 h-52 md:w-72 md:h-72 rounded-full -top-10 -left-10"
          style={{
            background: 'linear-gradient(135deg, #E91E63 0%, #FFB6C1 50%, #FFFFFF 100%)'
          }}
        />
        <div 
          className="absolute w-44 h-44 md:w-60 md:h-60 rounded-full top-0 left-0"
          style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FFC0CB 50%, #FFB6C1 100%)'
          }}
        />
        {/* Glass image - ON TOP of circles */}
        <div ref={glassRef} className="relative w-40 h-40 md:w-56 md:h-56 z-10">
          <Image
            src="/images/products/glassfinal.png"
            alt="Delicious dessert"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
      </div>

      {/* Static Wave Divider - No Animation */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg 
          viewBox="0 0 1440 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full"
          preserveAspectRatio="none"
        >
          <path 
            d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z" 
            fill="#FCE4EC"
          />
          <path 
            d="M0,80 C240,110 480,50 720,80 C960,110 1200,50 1440,80 L1440,120 L0,120 Z" 
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}

