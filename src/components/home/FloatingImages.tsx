'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface FloatingImageProps {
  src: string;
  alt: string;
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  size: {
    image: string;
    backCircle: string;
    frontCircle: string;
  };
  gradientBack: string;
  gradientFront: string;
  scrollStart: number; // percentage of page height where image should appear
  scrollEnd: number; // percentage of page height where image should disappear
}

function FloatingImage({ 
  src, 
  alt, 
  position, 
  size, 
  gradientBack, 
  gradientFront,
  scrollStart,
  scrollEnd 
}: FloatingImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const backCircleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !imageRef.current || !backCircleRef.current) return;

    const ctx = gsap.context(() => {
      // Floating animation for image
      gsap.to(imageRef.current, {
        x: 15,
        y: -20,
        rotation: 8,
        scale: 1.05,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Floating animation for back circle (opposite direction)
      gsap.to(backCircleRef.current, {
        x: -12,
        y: 10,
        rotation: -5,
        scale: 1.08,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Show/hide based on scroll position
      ScrollTrigger.create({
        trigger: document.body,
        start: `${scrollStart}% top`,
        end: `${scrollEnd}% top`,
        onEnter: () => gsap.to(containerRef.current, { opacity: 1, duration: 0.3 }),
        onLeave: () => gsap.to(containerRef.current, { opacity: 0, duration: 0.3 }),
        onEnterBack: () => gsap.to(containerRef.current, { opacity: 1, duration: 0.3 }),
        onLeaveBack: () => gsap.to(containerRef.current, { opacity: 0, duration: 0.3 }),
      });
    }, containerRef);

    return () => ctx.revert();
  }, [scrollStart, scrollEnd]);

  return (
    <div 
      ref={containerRef}
      className="fixed pointer-events-none"
      style={{
        ...position,
        zIndex: 9999,
      }}
    >
      {/* Back circle */}
      <div 
        ref={backCircleRef}
        className={`absolute rounded-full ${size.backCircle}`}
        style={{
          background: gradientBack,
          top: '-10px',
          left: '-10px',
        }}
      />
      {/* Front circle */}
      <div 
        className={`absolute rounded-full ${size.frontCircle}`}
        style={{
          background: gradientFront,
          top: '0',
          left: '0',
        }}
      />
      {/* Image */}
      <div ref={imageRef} className={`relative ${size.image}`}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain drop-shadow-2xl"
        />
      </div>
    </div>
  );
}

export function FloatingImages() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
      {/* Hero Section - Bottom Right Glass */}
      <FloatingImage
        src="/images/products/glassfinal.png"
        alt="Glass dessert"
        position={{ bottom: '5%', right: '5%' }}
        size={{
          image: 'w-40 h-40 md:w-56 md:h-56',
          backCircle: 'w-52 h-52 md:w-72 md:h-72',
          frontCircle: 'w-44 h-44 md:w-60 md:h-60',
        }}
        gradientBack="linear-gradient(135deg, #E91E63 0%, #FFB6C1 50%, #FFFFFF 100%)"
        gradientFront="linear-gradient(135deg, #FFFFFF 0%, #FFC0CB 50%, #FFB6C1 100%)"
        scrollStart={0}
        scrollEnd={25}
      />

      {/* SeasonalCTA Section - Top Left Choco */}
      <FloatingImage
        src="/images/products/chocofinal.png"
        alt="Chocolate dessert"
        position={{ top: '20%', left: '3%' }}
        size={{
          image: 'w-32 h-32 md:w-44 md:h-44',
          backCircle: 'w-44 h-44 md:w-56 md:h-56',
          frontCircle: 'w-36 h-36 md:w-48 md:h-48',
        }}
        gradientBack="linear-gradient(135deg, #FFFFFF 0%, #FFC0CB 50%, #E91E63 100%)"
        gradientFront="linear-gradient(135deg, #E91E63 0%, #FFB6C1 50%, #FFFFFF 100%)"
        scrollStart={20}
        scrollEnd={45}
      />

      {/* Testimonials Section - Top Right Custard */}
      <FloatingImage
        src="/images/products/curstardfinal.png"
        alt="Custard dessert"
        position={{ top: '35%', right: '3%' }}
        size={{
          image: 'w-28 h-28 md:w-40 md:h-40',
          backCircle: 'w-40 h-40 md:w-52 md:h-52',
          frontCircle: 'w-32 h-32 md:w-44 md:h-44',
        }}
        gradientBack="linear-gradient(135deg, #FFB6C1 0%, #FFFFFF 50%, #E91E63 100%)"
        gradientFront="linear-gradient(135deg, #FFFFFF 0%, #FFC0CB 50%, #FFB6C1 100%)"
        scrollStart={40}
        scrollEnd={65}
      />

      {/* Instagram Section - Top Left Choco2 */}
      <FloatingImage
        src="/images/products/chocofinal2.png"
        alt="Chocolate dessert 2"
        position={{ top: '55%', left: '3%' }}
        size={{
          image: 'w-28 h-28 md:w-36 md:h-36',
          backCircle: 'w-40 h-40 md:w-48 md:h-48',
          frontCircle: 'w-32 h-32 md:w-40 md:h-40',
        }}
        gradientBack="linear-gradient(135deg, #E91E63 0%, #FFB6C1 50%, #FFFFFF 100%)"
        gradientFront="linear-gradient(135deg, #FFFFFF 0%, #FFC0CB 50%, #E91E63 100%)"
        scrollStart={60}
        scrollEnd={85}
      />

      {/* Footer area - Bottom Left Custard2 */}
      <FloatingImage
        src="/images/products/custard2final.png"
        alt="Custard dessert 2"
        position={{ bottom: '10%', left: '5%' }}
        size={{
          image: 'w-32 h-32 md:w-44 md:h-44',
          backCircle: 'w-44 h-44 md:w-56 md:h-56',
          frontCircle: 'w-36 h-36 md:w-48 md:h-48',
        }}
        gradientBack="linear-gradient(135deg, #FFFFFF 0%, #FFC0CB 50%, #E91E63 100%)"
        gradientFront="linear-gradient(135deg, #E91E63 0%, #FFB6C1 50%, #FFFFFF 100%)"
        scrollStart={80}
        scrollEnd={100}
      />
    </div>
  );
}
