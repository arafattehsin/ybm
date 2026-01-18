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

      // Floating animation for left blob
      gsap.to(leftBlobRef.current, {
        x: 15,
        y: -20,
        rotation: 3,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      gsap.to(leftBlobBgRef.current, {
        x: -10,
        y: 15,
        rotation: -2,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Floating animation for right blob
      gsap.to(rightBlobRef.current, {
        x: -15,
        y: 15,
        rotation: -3,
        duration: 4.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      gsap.to(rightBlobBgRef.current, {
        x: 10,
        y: -10,
        rotation: 2,
        duration: 5.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Background shapes animation
      if (shapesRef.current) {
        const shapes = shapesRef.current.children;
        Array.from(shapes).forEach((shape, index) => {
          gsap.to(shape, {
            x: `random(-30, 30)`,
            y: `random(-30, 30)`,
            rotation: `random(-15, 15)`,
            duration: 6 + index,
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
    <section ref={heroRef} className="relative min-h-[90vh] overflow-hidden bg-gradient-hero">
      {/* Background Decorative Shapes */}
      <div ref={shapesRef} className="absolute inset-0 pointer-events-none">
        {/* Large pink blob top-left */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl" />
        {/* Medium white blob center */}
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-white/50 rounded-full blur-2xl" />
        {/* Small pink blob bottom-right */}
        <div className="absolute bottom-20 right-1/4 w-48 h-48 bg-pink-100/40 rounded-full blur-2xl" />
        {/* Floating small circles */}
        <div className="absolute top-1/4 right-1/3 w-8 h-8 bg-pink-300/50 rounded-full" />
        <div className="absolute bottom-1/3 left-1/3 w-6 h-6 bg-pink-400/40 rounded-full" />
        <div className="absolute top-2/3 right-1/5 w-4 h-4 bg-pink-200/60 rounded-full" />
        {/* Curvy shapes */}
        <svg className="absolute top-0 right-0 w-1/2 h-1/2 opacity-10" viewBox="0 0 200 200">
          <path fill="#E91E63" d="M40,-62.6C52.5,-54.5,63.5,-44.1,70.1,-31.2C76.7,-18.3,78.9,-2.9,76.2,11.3C73.5,25.5,65.9,38.4,55.2,48.3C44.5,58.2,30.6,65.1,15.5,69.4C0.5,73.7,-15.7,75.4,-30.3,71.1C-44.9,66.8,-57.9,56.6,-66.8,43.4C-75.7,30.2,-80.4,14.1,-79.6,-1.5C-78.8,-17.1,-72.5,-32.2,-62.4,-43.8C-52.3,-55.4,-38.4,-63.5,-24.3,-70.8C-10.1,-78.1,4.2,-84.6,17.7,-82.5C31.1,-80.4,43.7,-69.7,40,-62.6Z" transform="translate(100 100)" />
        </svg>
        <svg className="absolute bottom-0 left-0 w-1/3 h-1/3 opacity-10" viewBox="0 0 200 200">
          <path fill="#FF4081" d="M44.7,-76.4C58.1,-68.5,69.4,-56.6,77.1,-42.6C84.8,-28.6,88.9,-12.5,87.3,2.9C85.8,18.4,78.6,33.2,68.7,45.4C58.8,57.6,46.2,67.3,32.2,73.6C18.1,80,-2.5,83,-21.3,79.1C-40.2,75.2,-57.3,64.4,-69.8,50.1C-82.3,35.8,-90.2,17.9,-89.6,0.3C-89,-17.2,-79.9,-34.4,-67.5,-47.7C-55.1,-61,-39.4,-70.4,-23.6,-76.8C-7.8,-83.2,8.1,-86.6,23.4,-84.2C38.8,-81.8,53.6,-73.6,44.7,-76.4Z" transform="translate(100 100)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[70vh]">
          
          {/* Left Video Blob Section */}
          <div className="lg:col-span-4 relative h-[350px] md:h-[450px] order-2 lg:order-1">
            {/* Background blob */}
            <div 
              ref={leftBlobBgRef}
              className="absolute inset-0 bg-gradient-to-br from-pink-200 via-pink-100 to-white blob-1 shadow-xl"
              style={{ 
                borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
                transform: 'scale(1.1) translate(10px, 10px)'
              }}
            />
            {/* Video container blob */}
            <div 
              ref={leftBlobRef}
              className="absolute inset-4 overflow-hidden shadow-2xl animate-pulse-glow"
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
                poster="/images/products/hero-poster.jpg"
              >
                <source src="/videos/hero.mp4" type="video/mp4" />
              </video>
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-pink-500/10 to-transparent" />
            </div>
          </div>

          {/* Center Content */}
          <div ref={contentRef} className="lg:col-span-4 text-center order-1 lg:order-2 z-10">
            {/* Award Badge */}
            <div 
              ref={awardRef}
              className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg mb-6 border border-pink-100"
            >
              <Image
                src="/videos/awardpic.jpeg"
                alt="Local Business Awards 2021"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <div className="text-left">
                <p className="text-xs font-semibold text-pink-600 uppercase tracking-wider">Finalist</p>
                <p className="text-sm font-medium text-gray-700">Local Business Awards 2021</p>
                <p className="text-xs text-gray-500">Parramatta</p>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif mb-6 leading-tight">
              <span className="gradient-text">YUM</span>
              <span className="text-gray-800"> by </span>
              <span className="gradient-text">Maryam</span>
            </h1>

            {/* Description */}
            <p className="text-gray-600 text-lg md:text-xl mb-8 max-w-lg mx-auto leading-relaxed">
              An artisan dessert boutique crafting heavenly homemade cakes, 
              cupcakes & sweet treats with love from our kitchen in Sydney. 
              Every creation is a celebration of flavour and joy.
            </p>

            {/* CTA Button */}
            <Link href="/menu">
              <button className="btn-gradient px-10 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 group">
                <span className="flex items-center gap-2">
                  Explore Menu
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            </Link>
          </div>

          {/* Right Video Blob Section */}
          <div className="lg:col-span-4 relative h-[350px] md:h-[450px] order-3">
            {/* Background blob */}
            <div 
              ref={rightBlobBgRef}
              className="absolute inset-0 bg-gradient-to-bl from-pink-100 via-white to-pink-200 blob-2 shadow-xl"
              style={{ 
                borderRadius: '40% 60% 70% 30% / 40% 70% 30% 60%',
                transform: 'scale(1.1) translate(-10px, 10px)'
              }}
            />
            {/* Video container blob */}
            <div 
              ref={rightBlobRef}
              className="absolute inset-4 overflow-hidden shadow-2xl"
              style={{ 
                borderRadius: '45% 55% 65% 35% / 45% 65% 35% 55%'
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
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-pink-500/10 to-transparent" />
            </div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path 
            d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z" 
            fill="white"
          />
          <path 
            d="M0,80 C240,120 480,40 720,80 C960,120 1200,40 1440,80 L1440,120 L0,120 Z" 
            fill="#FCE4EC"
            fillOpacity="0.5"
          />
        </svg>
      </div>
    </section>
  );
}

