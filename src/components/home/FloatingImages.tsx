'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

interface FloatingImageProps {
  src: string;
  alt: string;
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  mobilePosition?: {
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
  mobileSize?: {
    image: string;
    backCircle: string;
    frontCircle: string;
  };
  gradientBack: string;
  gradientFront: string;
  hideOnMobile?: boolean;
}

function FloatingImage({ 
  src, 
  alt, 
  position,
  mobilePosition,
  size, 
  mobileSize,
  gradientBack, 
  gradientFront,
  hideOnMobile = false
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
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Combine desktop and mobile positions
  const mobilePos = mobilePosition || position;
  const mobSize = mobileSize || size;

  return (
    <div 
      ref={containerRef}
      className={`fixed pointer-events-none ${hideOnMobile ? 'hidden md:block' : ''}`}
      style={{
        zIndex: 50,
      }}
    >
      {/* Desktop positioning */}
      <div className="hidden md:block" style={position}>
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
      
      {/* Mobile positioning - smaller and repositioned */}
      {!hideOnMobile && (
        <div className="block md:hidden fixed" style={mobilePos}>
          {/* Back circle - smaller on mobile */}
          <div 
            className={`absolute rounded-full ${mobSize.backCircle}`}
            style={{
              background: gradientBack,
              top: '-6px',
              left: '-6px',
            }}
          />
          {/* Front circle - smaller on mobile */}
          <div 
            className={`absolute rounded-full ${mobSize.frontCircle}`}
            style={{
              background: gradientFront,
              top: '0',
              left: '0',
            }}
          />
          {/* Image - smaller on mobile */}
          <div className={`relative ${mobSize.image}`}>
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain drop-shadow-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function FloatingImages() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 50 }}>
      {/* Bottom Right - Glass - visible on mobile below featured section */}
      <FloatingImage
        src="/images/products/glassfinal.png"
        alt="Glass dessert"
        position={{ bottom: '8%', right: '3%' }}
        mobilePosition={{ bottom: '35%', left: '2%' }}
        size={{
          image: 'w-32 h-32 md:w-44 md:h-44',
          backCircle: 'w-44 h-44 md:w-56 md:h-56',
          frontCircle: 'w-36 h-36 md:w-48 md:h-48',
        }}
        mobileSize={{
          image: 'w-16 h-16',
          backCircle: 'w-20 h-20',
          frontCircle: 'w-18 h-18',
        }}
        gradientBack="linear-gradient(135deg, #E91E63 0%, #FFB6C1 50%, #FFFFFF 100%)"
        gradientFront="linear-gradient(135deg, #FFFFFF 0%, #FFC0CB 50%, #FFB6C1 100%)"
      />

      {/* Top Left - Choco - hidden on mobile to avoid overlap with hero */}
      <FloatingImage
        src="/images/products/chocofinal.png"
        alt="Chocolate dessert"
        position={{ top: '15%', left: '2%' }}
        size={{
          image: 'w-28 h-28 md:w-36 md:h-36',
          backCircle: 'w-40 h-40 md:w-48 md:h-48',
          frontCircle: 'w-32 h-32 md:w-40 md:h-40',
        }}
        gradientBack="linear-gradient(135deg, #FFFFFF 0%, #FFC0CB 50%, #E91E63 100%)"
        gradientFront="linear-gradient(135deg, #E91E63 0%, #FFB6C1 50%, #FFFFFF 100%)"
        hideOnMobile={true}
      />

      {/* Top Right - Custard - hidden on mobile */}
      <FloatingImage
        src="/images/products/curstardfinal.png"
        alt="Custard dessert"
        position={{ top: '40%', right: '2%' }}
        size={{
          image: 'w-24 h-24 md:w-32 md:h-32',
          backCircle: 'w-36 h-36 md:w-44 md:h-44',
          frontCircle: 'w-28 h-28 md:w-36 md:h-36',
        }}
        gradientBack="linear-gradient(135deg, #FFB6C1 0%, #FFFFFF 50%, #E91E63 100%)"
        gradientFront="linear-gradient(135deg, #FFFFFF 0%, #FFC0CB 50%, #FFB6C1 100%)"
        hideOnMobile={true}
      />

      {/* Bottom Left - Choco2 - hidden on mobile */}
      <FloatingImage
        src="/images/products/chocofinal2.png"
        alt="Chocolate dessert 2"
        position={{ bottom: '25%', left: '2%' }}
        size={{
          image: 'w-24 h-24 md:w-32 md:h-32',
          backCircle: 'w-36 h-36 md:w-44 md:h-44',
          frontCircle: 'w-28 h-28 md:w-36 md:h-36',
        }}
        gradientBack="linear-gradient(135deg, #E91E63 0%, #FFB6C1 50%, #FFFFFF 100%)"
        gradientFront="linear-gradient(135deg, #FFFFFF 0%, #FFC0CB 50%, #E91E63 100%)"
        hideOnMobile={true}
      />
    </div>
  );
}
